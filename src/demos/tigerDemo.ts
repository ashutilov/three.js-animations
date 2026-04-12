import {
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { computeDrawingBufferResize } from "../utils/resizeRendererToDisplaySize";
import { disposeObjectTree } from "./disposeThree";
import type { DemoFactory } from "./types";

/** Served from `public/` so `scene.bin` and `textures/` resolve next to the glTF in dev and production. */
const modelUrl = "/models/tiger/scene.gltf";

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

export const mountTigerDemo: DemoFactory = (host) => {
  let disposed = false;

  const renderer = new WebGLRenderer({ canvas: host.canvas });

  const camera = new PerspectiveCamera(
    45,
    host.canvas.clientWidth / Math.max(host.canvas.clientHeight, 1),
    1,
    1000
  );
  camera.position.set(0, 100, 550);
  camera.lookAt(0, 0, 0);

  const scene = new Scene();
  scene.background = new Color(0x212121);

  const directionalLight = new DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(directionalLight);

  const directionalLight2 = new DirectionalLight(0xffeedd);
  directionalLight2.position.set(0, 5, -5);
  scene.add(directionalLight2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 300;
  controls.maxDistance = 800;
  controls.maxPolarAngle = Math.PI / 2;

  const clock = new Clock();
  let mixer: AnimationMixer | null = null;
  let root: Object3D | null = null;

  const loader = new GLTFLoader();
  loader.load(
    modelUrl,
    (gltf) => {
      if (disposed) {
        disposeObjectTree(gltf.scene);
        return;
      }
      mixer = new AnimationMixer(gltf.scene);
      gltf.animations.forEach((clip) => {
        mixer?.clipAction(clip).play();
      });
      scene.add(gltf.scene);
      root = gltf.scene;
    },
    undefined,
    () => {
      host.info.textContent = "Failed to load tiger model.";
    }
  );

  let raf = 0;

  function animate(): void {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    scene.rotation.y += 0.01;

    const delta = clock.getDelta();
    if (mixer) {
      mixer.update(delta);
    }

    controls.update();
    renderer.render(scene, camera);

    raf = requestAnimationFrame(animate);
  }

  raf = requestAnimationFrame(animate);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    controls.dispose();
    if (root) {
      scene.remove(root);
      disposeObjectTree(root);
    }
    mixer?.stopAllAction();
    renderer.dispose();
    scene.clear();
    host.info.textContent = "";
  };
};
