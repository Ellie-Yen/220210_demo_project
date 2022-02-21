type ElementAction = (element: HTMLElement) => any;
type CanvasElementAction = (element: HTMLCanvasElement) => any;
interface CanvasDrawActionKwargs {
  ctx: CanvasRenderingContext2D
}
interface CanvasPosKwargs {
  x: number,
  y: number
}
interface CanvasSizeKwargs {
  h: number,
  w: number
}
type CanvasRectKwargs = CanvasPosKwargs & CanvasSizeKwargs;
type CanvasRectParamList = [number, number, number, number]; // x, y, w, h