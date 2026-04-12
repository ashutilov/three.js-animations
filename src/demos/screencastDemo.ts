import {
  AmbientLight,
  BufferAttribute,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
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

export const mountScreencastDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });

  const scene = new Scene();
  const camera = new PerspectiveCamera(
    45,
    host.canvas.clientWidth / Math.max(host.canvas.clientHeight, 1),
    0.1,
    5000
  );
  camera.position.set(0, 0, 1000);

  const light = new AmbientLight(0xffffff);
  scene.add(light);

  const geometry = new SphereGeometry(300, 32, 32);
  const colors: number[] = [];
  const position = geometry.getAttribute("position");
  for (let i = 0; i < position.count; i++) {
    const c = new Color(Math.random(), Math.random(), Math.random());
    colors.push(c.r, c.g, c.b);
  }
  geometry.setAttribute("color", new BufferAttribute(new Float32Array(colors), 3));

  const material = new MeshBasicMaterial({ vertexColors: true });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);

  const sphere = {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  };

  const gui = new GUI({ autoPlace: false });
  host.extras.appendChild(gui.domElement);
  gui.add(sphere, "positionX", -5, 5, 0.01);
  gui.add(sphere, "positionY", -5, 5, 0.01);
  gui.add(sphere, "positionZ", -5, 5, 0.01);
  gui.add(sphere, "rotationX", -0.2, 0.2, 0.001);
  gui.add(sphere, "rotationY", -0.2, 0.2, 0.001);
  gui.add(sphere, "rotationZ", -0.2, 0.2, 0.001);

  const stats = new Stats();
  stats.showPanel(1);
  host.extras.appendChild(stats.dom);

  let raf = 0;

  function animate(): void {
    stats.begin();

    mesh.position.set(
      sphere.positionX * 100,
      sphere.positionY * 100,
      sphere.positionZ * 100
    );
    mesh.rotation.x += sphere.rotationX;
    mesh.rotation.y += sphere.rotationY;
    mesh.rotation.z += sphere.rotationZ;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    stats.end();

    raf = requestAnimationFrame(animate);
  }

  raf = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(raf);
    gui.destroy();
    if (host.extras.contains(stats.dom)) {
      host.extras.removeChild(stats.dom);
    }
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    scene.clear();
  };
};
