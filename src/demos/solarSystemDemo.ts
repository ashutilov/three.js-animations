import {
  AxesHelper,
  GridHelper,
  Material,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { computeDrawingBufferResize } from "../utils/resizeRendererToDisplaySize";
import type { DemoFactory } from "./types";

class AxisGridHelper {
  grid: GridHelper;
  axes: AxesHelper;
  private _visible = false;

  constructor(node: Object3D, units = 10) {
    const axes = new AxesHelper();
    const axesMat = axes.material as Material;
    axesMat.depthTest = false;
    axes.renderOrder = 2;
    node.add(axes);

    const grid = new GridHelper(units, units);
    const gridMat = grid.material as Material;
    gridMat.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);

    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(v: boolean) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}

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

export const mountSolarSystemDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });
  const gui = new GUI({ autoPlace: false });
  host.extras.appendChild(gui.domElement);

  const fov = 40;
  const aspect = 2;
  const near = 0.1;
  const far = 1000;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new Scene();

  {
    const color = 0xffffff;
    const intensity = 3;
    const light = new PointLight(color, intensity);
    scene.add(light);
  }

  const objects: Object3D[] = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new SphereGeometry(
    radius,
    widthSegments,
    heightSegments
  );

  const solarSystem = new Object3D();
  scene.add(solarSystem);
  objects.push(solarSystem);

  const sunMaterial = new MeshPhongMaterial({ emissive: 0xffff00 });
  const sunMesh = new Mesh(sphereGeometry, sunMaterial);
  sunMesh.scale.set(5, 5, 5);
  solarSystem.add(sunMesh);
  objects.push(sunMesh);

  const earthOrbit = new Object3D();
  earthOrbit.position.x = 10;
  solarSystem.add(earthOrbit);
  objects.push(earthOrbit);

  const earthMaterial = new MeshPhongMaterial({
    color: 0x2233ff,
    emissive: 0x112244,
  });
  const earthMesh = new Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  const moonOrbit = new Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222,
  });
  const moonMesh = new Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  function makeAxisGrid(node: Object3D, label: string, units?: number): void {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 26);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  makeAxisGrid(moonMesh, "moonMesh");

  let raf = 0;

  function render(time: number): void {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

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
    sunMaterial.dispose();
    earthMaterial.dispose();
    moonMaterial.dispose();
    sphereGeometry.dispose();
    renderer.dispose();
    scene.clear();
  };
};
