/**
 * Computes drawing buffer dimensions from CSS size and device pixel ratio,
 * and whether the buffer should be resized to match.
 */
export function computeDrawingBufferResize(
  clientWidth: number,
  clientHeight: number,
  pixelRatio: number,
  currentWidth: number,
  currentHeight: number
): { width: number; height: number; needResize: boolean } {
  const width = (clientWidth * pixelRatio) | 0;
  const height = (clientHeight * pixelRatio) | 0;
  const needResize = currentWidth !== width || currentHeight !== height;
  return { width, height, needResize };
}
