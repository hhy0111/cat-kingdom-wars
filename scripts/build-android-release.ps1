$ErrorActionPreference = "Stop"

$jdkCandidates = @(
  "C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot",
  "C:\Program Files\Eclipse Adoptium\jdk-21*",
  "C:\Program Files\Java\jdk-21*"
)

$jdkHome = $null
foreach ($candidate in $jdkCandidates) {
  $match = Get-Item -Path $candidate -ErrorAction SilentlyContinue | Select-Object -First 1
  if ($match) {
    $jdkHome = $match.FullName
    break
  }
}

if (-not $jdkHome) {
  throw "JDK 21 is required for Capacitor Android 7 release builds, but no JDK 21 installation was found."
}

$env:JAVA_HOME = $jdkHome
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

npm run android:sync
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Push-Location android
try {
  .\gradlew.bat bundleRelease
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
