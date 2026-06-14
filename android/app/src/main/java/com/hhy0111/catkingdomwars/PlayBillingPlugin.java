package com.hhy0111.catkingdomwars;

import android.app.Activity;

import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CapacitorPlugin(name = "PlayBilling")
public class PlayBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    private BillingClient billingClient;
    private final Map<String, ProductDetails> productDetailsById = new HashMap<>();
    private PluginCall pendingPurchaseCall;

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(
                        PendingPurchasesParams.newBuilder()
                                .enableOneTimeProducts()
                                .build()
                )
                .build();
    }

    @PluginMethod
    public void queryProducts(PluginCall call) {
        List<String> productIds = readProductIds(call);
        if (productIds.isEmpty()) {
            JSObject result = new JSObject();
            result.put("products", new JSArray());
            call.resolve(result);
            return;
        }

        ensureBillingReady(call, () -> queryProductDetails(productIds, call, productDetailsList -> {
            JSArray products = new JSArray();
            for (ProductDetails productDetails : productDetailsList) {
                productDetailsById.put(productDetails.getProductId(), productDetails);
                JSObject item = new JSObject();
                item.put("productId", productDetails.getProductId());
                item.put("title", productDetails.getTitle());
                item.put("description", productDetails.getDescription());
                item.put("price", getFormattedPrice(productDetails));
                products.put(item);
            }

            JSObject result = new JSObject();
            result.put("products", products);
            call.resolve(result);
        }));
    }

    @PluginMethod
    public void purchase(PluginCall call) {
        String productId = call.getString("productId");
        if (productId == null || productId.trim().isEmpty()) {
            resolveStatus(call, "error", null, "Missing productId.");
            return;
        }

        if (pendingPurchaseCall != null) {
            resolveStatus(call, "error", productId, "Another purchase is already in progress.");
            return;
        }

        ensureBillingReady(call, () -> {
            ProductDetails cachedProductDetails = productDetailsById.get(productId);
            if (cachedProductDetails != null) {
                launchPurchaseFlow(call, productId, cachedProductDetails);
                return;
            }

            queryProductDetails(Collections.singletonList(productId), call, productDetailsList -> {
                if (productDetailsList.isEmpty()) {
                    resolveStatus(call, "error", productId, "Product is not available on Google Play.");
                    return;
                }

                ProductDetails productDetails = productDetailsList.get(0);
                productDetailsById.put(productId, productDetails);
                launchPurchaseFlow(call, productId, productDetails);
            });
        });
    }

    @Override
    public void onPurchasesUpdated(BillingResult billingResult, List<Purchase> purchases) {
        PluginCall call = pendingPurchaseCall;
        if (call == null) {
            return;
        }

        int responseCode = billingResult.getResponseCode();
        if (responseCode == BillingClient.BillingResponseCode.USER_CANCELED) {
            clearPendingPurchaseCall();
            resolveStatus(call, "canceled", null, "Purchase was canceled.");
            return;
        }

        if (responseCode != BillingClient.BillingResponseCode.OK || purchases == null || purchases.isEmpty()) {
            clearPendingPurchaseCall();
            resolveStatus(call, "error", null, billingResult.getDebugMessage());
            return;
        }

        Purchase purchase = purchases.get(0);
        List<String> products = purchase.getProducts();
        String productId = products.isEmpty() ? null : products.get(0);

        if (purchase.getPurchaseState() == Purchase.PurchaseState.PENDING) {
            clearPendingPurchaseCall();
            resolveStatus(call, "pending", productId, "Purchase is pending.");
            return;
        }

        if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) {
            clearPendingPurchaseCall();
            resolveStatus(call, "error", productId, "Purchase was not completed.");
            return;
        }

        ConsumeParams consumeParams = ConsumeParams.newBuilder()
                .setPurchaseToken(purchase.getPurchaseToken())
                .build();
        billingClient.consumeAsync(consumeParams, (consumeResult, purchaseToken) -> {
            clearPendingPurchaseCall();
            if (consumeResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                resolveStatus(call, "error", productId, consumeResult.getDebugMessage());
                return;
            }

            JSObject result = new JSObject();
            result.put("status", "purchased");
            result.put("productId", productId);
            result.put("purchaseToken", purchaseToken);
            call.resolve(result);
        });
    }

    private void ensureBillingReady(PluginCall call, BillingReadyCallback callback) {
        if (billingClient == null) {
            load();
        }

        if (billingClient.isReady()) {
            callback.onReady();
            return;
        }

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    callback.onReady();
                    return;
                }
                resolveStatus(call, "unavailable", call.getString("productId"), billingResult.getDebugMessage());
            }

            @Override
            public void onBillingServiceDisconnected() {
                // The next request starts a fresh connection.
            }
        });
    }

    private void queryProductDetails(List<String> productIds, PluginCall call, ProductDetailsCallback callback) {
        List<QueryProductDetailsParams.Product> products = new ArrayList<>();
        for (String productId : productIds) {
            products.add(
                    QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(productId)
                            .setProductType(BillingClient.ProductType.INAPP)
                            .build()
            );
        }

        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(products)
                .build();

        billingClient.queryProductDetailsAsync(params, (BillingResult billingResult, QueryProductDetailsResult productDetailsResult) -> {
            if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                resolveStatus(call, "error", call.getString("productId"), billingResult.getDebugMessage());
                return;
            }
            callback.onProductDetails(productDetailsResult.getProductDetailsList());
        });
    }

    private void launchPurchaseFlow(PluginCall call, String productId, ProductDetails productDetails) {
        ProductDetails.OneTimePurchaseOfferDetails offerDetails = getFirstOfferDetails(productDetails);
        BillingFlowParams.ProductDetailsParams.Builder productDetailsParamsBuilder =
                BillingFlowParams.ProductDetailsParams.newBuilder()
                        .setProductDetails(productDetails);

        if (offerDetails != null && offerDetails.getOfferToken() != null) {
            productDetailsParamsBuilder.setOfferToken(offerDetails.getOfferToken());
        }

        BillingFlowParams billingFlowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(productDetailsParamsBuilder.build()))
                .build();

        Activity activity = getActivity();
        pendingPurchaseCall = call;
        call.setKeepAlive(true);
        BillingResult billingResult = billingClient.launchBillingFlow(activity, billingFlowParams);
        if (billingResult.getResponseCode() != BillingClient.BillingResponseCode.OK) {
            clearPendingPurchaseCall();
            resolveStatus(call, "error", productId, billingResult.getDebugMessage());
            return;
        }
    }

    private List<String> readProductIds(PluginCall call) {
        List<String> productIds = new ArrayList<>();
        JSArray productIdArray = call.getArray("productIds");
        if (productIdArray == null) {
            return productIds;
        }

        for (int i = 0; i < productIdArray.length(); i += 1) {
            try {
                String productId = productIdArray.getString(i);
                if (productId != null && !productId.trim().isEmpty()) {
                    productIds.add(productId);
                }
            } catch (JSONException ignored) {
                // Ignore malformed entries instead of failing the whole catalog query.
            }
        }
        return productIds;
    }

    private String getFormattedPrice(ProductDetails productDetails) {
        ProductDetails.OneTimePurchaseOfferDetails offerDetails = getFirstOfferDetails(productDetails);
        return offerDetails == null ? "" : offerDetails.getFormattedPrice();
    }

    private ProductDetails.OneTimePurchaseOfferDetails getFirstOfferDetails(ProductDetails productDetails) {
        List<ProductDetails.OneTimePurchaseOfferDetails> offerDetailsList = productDetails.getOneTimePurchaseOfferDetailsList();
        if (offerDetailsList == null || offerDetailsList.isEmpty()) {
            return null;
        }
        return offerDetailsList.get(0);
    }

    private void resolveStatus(PluginCall call, String status, String productId, String error) {
        JSObject result = new JSObject();
        result.put("status", status);
        if (productId != null) {
            result.put("productId", productId);
        }
        if (error != null && !error.isEmpty()) {
            result.put("error", error);
        }
        call.resolve(result);
    }

    private void clearPendingPurchaseCall() {
        if (pendingPurchaseCall != null) {
            pendingPurchaseCall.setKeepAlive(false);
            pendingPurchaseCall = null;
        }
    }

    private interface BillingReadyCallback {
        void onReady();
    }

    private interface ProductDetailsCallback {
        void onProductDetails(List<ProductDetails> productDetails);
    }
}
