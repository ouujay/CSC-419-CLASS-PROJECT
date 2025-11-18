/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// controls.ts
export function createControls(p5) {
  let zoomLevel = 0.05;
  let panX = 0;
  let panY = 0;
  let initialDistance = 0;
  let initialZoom = 1;
  let touchStartX = 0;
  let touchStartY = 0;
  let isPanning = false;

  const controls = () => {
    p5.translate(panX, panY);
    p5.scale(zoomLevel);
  };

  const touchStarted = () => {
    if (p5.touches.length === 2) {
      const d = p5.dist(
        p5.touches[0].x,
        p5.touches[0].y,
        p5.touches[1].x,
        p5.touches[1].y
      );
      initialDistance = d;
      initialZoom = zoomLevel;
      isPanning = false;
    } else if (p5.touches.length === 1) {
      touchStartX = p5.touches[0].x - panX;
      touchStartY = p5.touches[0].y - panY;
      isPanning = true;
    }
    return false;
  };

  const touchMoved = () => {
    if (p5.touches.length === 2) {
      const currentDistance = p5.dist(
        p5.touches[0].x,
        p5.touches[0].y,
        p5.touches[1].x,
        p5.touches[1].y
      );
      const zoomFactor = currentDistance / initialDistance;
      zoomLevel = p5.constrain(initialZoom * zoomFactor, 0.1, 5);
      isPanning = false;
    } else if (p5.touches.length === 1 && isPanning) {
      panX = p5.touches[0].x - touchStartX;
      panY = p5.touches[0].y - touchStartY;
    }
    return false;
  };

  const touchEnded = () => {
    if (p5.touches.length === 0) {
      isPanning = false;
    }
    return false;
  };

  const mouseWheel = (event: WheelEvent) => {
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    zoomLevel = p5.constrain(zoomLevel * zoomFactor, 0.1, 5);
    return false;
  };

  const mouseDragged = () => {
    if (p5.touches.length === 0) {
      panX += p5.mouseX - p5.pmouseX;
      panY += p5.mouseY - p5.pmouseY;
    }
  };

  return {
    controls,
    touchStarted,
    touchMoved,
    touchEnded,
    mouseWheel,
    mouseDragged,
  };
}
