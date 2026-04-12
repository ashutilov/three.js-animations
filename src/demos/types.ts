export type DemoHost = {
  canvas: HTMLCanvasElement;
  info: HTMLElement;
  extras: HTMLElement;
};

/** Returns a dispose function (cancel RAF, release WebGL, DOM, loaders). */
export type DemoFactory = (host: DemoHost) => () => void;
