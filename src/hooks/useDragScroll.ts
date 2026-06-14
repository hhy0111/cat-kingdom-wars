import { useRef, type PointerEvent } from "react";

type DragScrollState = {
  active: boolean;
  pointerId: number;
  startX: number;
  startY: number;
  startScrollLeft: number;
  startScrollTop: number;
  moved: boolean;
};

const interactiveSelector = "button, a, input, select, textarea, [role='button']";

export function useDragScroll<T extends HTMLElement>() {
  const stateRef = useRef<DragScrollState>({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    startScrollTop: 0,
    moved: false,
  });

  const stopDrag = (element: T, pointerId: number) => {
    stateRef.current.active = false;
    element.classList.remove("drag-scrolling");
    if (element.hasPointerCapture?.(pointerId)) {
      element.releasePointerCapture(pointerId);
    }
  };

  return {
    onPointerDown: (event: PointerEvent<T>) => {
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.closest(interactiveSelector)) {
        return;
      }

      const element = event.currentTarget;
      const canScroll = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
      if (!canScroll) {
        return;
      }

      stateRef.current = {
        active: true,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startScrollLeft: element.scrollLeft,
        startScrollTop: element.scrollTop,
        moved: false,
      };
      element.setPointerCapture?.(event.pointerId);
      element.classList.add("drag-scrolling");
    },
    onPointerMove: (event: PointerEvent<T>) => {
      const state = stateRef.current;
      if (!state.active || state.pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        state.moved = true;
      }

      event.currentTarget.scrollLeft = state.startScrollLeft - deltaX;
      event.currentTarget.scrollTop = state.startScrollTop - deltaY;
      if (state.moved) {
        event.preventDefault();
      }
    },
    onPointerUp: (event: PointerEvent<T>) => {
      if (stateRef.current.active && stateRef.current.pointerId === event.pointerId) {
        stopDrag(event.currentTarget, event.pointerId);
      }
    },
    onPointerCancel: (event: PointerEvent<T>) => {
      if (stateRef.current.active && stateRef.current.pointerId === event.pointerId) {
        stopDrag(event.currentTarget, event.pointerId);
      }
    },
  };
}
