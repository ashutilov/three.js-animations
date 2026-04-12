import { describe, expect, it } from "vitest";
import { computeDrawingBufferResize } from "./resizeRendererToDisplaySize";

describe("computeDrawingBufferResize", () => {
  it("returns needResize false when buffer already matches", () => {
    expect(
      computeDrawingBufferResize(800, 600, 2, 1600, 1200)
    ).toEqual({ width: 1600, height: 1200, needResize: false });
  });

  it("returns needResize true when width differs", () => {
    expect(
      computeDrawingBufferResize(800, 600, 2, 800, 1200)
    ).toEqual({ width: 1600, height: 1200, needResize: true });
  });

  it("floors dimensions with bitwise OR like canvas sizing", () => {
    expect(
      computeDrawingBufferResize(100, 100, 1.25, 0, 0)
    ).toEqual({ width: 125, height: 125, needResize: true });
  });
});
