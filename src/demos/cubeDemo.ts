import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { computeDrawingBufferResize } from "../utils/resizeRendererToDisplaySize";
import type { DemoFactory } from "./types";

function resizeToCanvas(renderer: WebGLRenderer): void {
  const canvas = renderer.domElement;
  const { width, height } = computeDrawingBufferResize(
    canvas.clientWidth,
    canvas.clientHeight,
    window.devicePixelRatio,
    canvas.width,
    canvas.height
  );
  renderer.setSize(width, height, false);
}

export const mountCubeDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });
  resizeToCanvas(renderer);

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    host.canvas.clientWidth / Math.max(host.canvas.clientHeight, 1),
    0.1,
    1000
  );
  camera.position.z = 5;

  const geometry = new BoxGeometry();
  const material = new MeshBasicMaterial({ color: 0xffff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  let raf = 0;

  function animate(): void {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    resizeToCanvas(renderer);
    camera.aspect =
      host.canvas.clientWidth / Math.max(host.canvas.clientHeight, 1);
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
    raf = requestAnimationFrame(animate);
  }

  raf = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(raf);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    scene.clear();
  };
};
