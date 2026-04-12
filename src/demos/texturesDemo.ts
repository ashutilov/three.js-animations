import {
  BoxGeometry,
  ClampToEdgeWrapping,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MirroredRepeatWrapping,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
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

const wrapModes = {
  ClampToEdgeWrapping,
  RepeatWrapping,
  MirroredRepeatWrapping,
};

export const mountTexturesDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });

  const fov = 75;
  const aspect = 2;
  const near = 0.1;
  const far = 5;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new Scene();

  const geometry = new BoxGeometry(1, 1, 1);

  const loader = new TextureLoader();

  const texture: Texture = loader.load(
    "https://threejsfundamentals.org/threejs/resources/images/wall.jpg"
  );
  const material = new MeshBasicMaterial({
    map: texture,
  });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  function updateTexture(): void {
    texture.needsUpdate = true;
  }

  const gui = new GUI({ autoPlace: false });
  host.extras.appendChild(gui.domElement);

  gui
    .add(texture, "wrapS", wrapModes)
    .name("texture.wrapS")
    .onChange(updateTexture);
  gui
    .add(texture, "wrapT", wrapModes)
    .name("texture.wrapT")
    .onChange(updateTexture);
  gui.add(texture.repeat, "x", 0, 5, 0.01).name("texture.repeat.x");
  gui.add(texture.repeat, "y", 0, 5, 0.01).name("texture.repeat.y");
  gui.add(texture.offset, "x", -2, 2, 0.01).name("texture.offset.x");
  gui.add(texture.offset, "y", -2, 2, 0.01).name("texture.offset.y");
  gui.add(texture.center, "x", -0.5, 1.5, 0.01).name("texture.center.x");
  gui.add(texture.center, "y", -0.5, 1.5, 0.01).name("texture.center.y");

  const rotationDeg = { value: MathUtils.radToDeg(texture.rotation) };
  gui
    .add(rotationDeg, "value", -360, 360, 0.1)
    .name("texture.rotation (deg)")
    .onChange((v: number) => {
      texture.rotation = MathUtils.degToRad(v);
    });

  let raf = 0;

  function render(time: number): void {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    const speed = 0.2;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;

    renderer.render(scene, camera);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    gui.destroy();
    if (host.extras.contains(gui.domElement)) {
      host.extras.removeChild(gui.domElement);
    }
    geometry.dispose();
    material.dispose();
    texture.dispose();
    renderer.dispose();
    scene.clear();
  };
};
