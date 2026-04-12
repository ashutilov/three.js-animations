import {
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { computeDrawingBufferResize } from "../utils/resizeRendererToDisplaySize";
import type { DemoFactory } from "./types";

function resizeRendererToDisplaySize(renderer: WebGLRenderer): boolean {
  const canvas = renderer.domElement;
  const { width, height, needResize } = computeDrawingBufferResize(
    canvas.clientWidth,
    canvas.clientHeight,
    window.devicePixelRatio,
    canvas.width,
    canvas.height
  );
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

export const mountFundamentalsDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 8;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  const scene = new Scene();

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(
    geom: BoxGeometry,
    color: number,
    positionX: number
  ): Mesh {
    const material = new MeshPhongMaterial({ color });

    const cube = new Mesh(geom, material);
    scene.add(cube);

    cube.position.x = positionX;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2),
  ];

  let raf = 0;

  function render(time: number): void {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const el = renderer.domElement;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    geometry.dispose();
    cubes.forEach((c) => {
      (c.material as MeshPhongMaterial).dispose();
    });
    renderer.dispose();
    scene.clear();
  };
};
