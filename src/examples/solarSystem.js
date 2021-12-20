import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PointLight,
  SphereBufferGeometry,
  Object3D,
  MeshPhongMaterial,
  Mesh,
  AxesHelper,
  GridHelper
} from "three";
import "../css/styles.css";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

function main() {
  const canvas = document.querySelector("#c");
  const renderer = new WebGLRenderer({ canvas });
  const gui = new GUI();

  const fov = 40;
  const aspect = 2; // the canvas default
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

  const objects = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new SphereBufferGeometry(
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
    emissive: 0x112244
  });
  const earthMesh = new Mesh(sphereGeometry, earthMaterial);
  earthOrbit.add(earthMesh);
  objects.push(earthMesh);

  const moonOrbit = new Object3D();
  moonOrbit.position.x = 2;
  earthOrbit.add(moonOrbit);

  const moonMaterial = new MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x222222
  });
  const moonMesh = new Mesh(sphereGeometry, moonMaterial);
  moonMesh.scale.set(0.5, 0.5, 0.5);
  moonOrbit.add(moonMesh);
  objects.push(moonMesh);

  // Turns both axes and grid visible on/off
  // GUI requires a property that returns a bool
  // to decide to make a checkbox so we make a setter
  // can getter for `visible` which we can tell GUI
  // to look at.
  class AxisGridHelper {
    constructor(node, units = 10) {
      const axes = new AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = 2; // after the grid
      node.add(axes);

      const grid = new GridHelper(units, units);
      grid.material.depthTest = false;
      grid.renderOrder = 1;
      node.add(grid);

      this.grid = grid;
      this.axes = axes;
      this.visible = false;
    }
    get visible() {
      return this._visible;
    }
    set visible(v) {
      this._visible = v;
      this.grid.visible = v;
      this.axes.visible = v;
    }
  }

  function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, "visible").name(label);
  }

  makeAxisGrid(solarSystem, "solarSystem", 26);
  makeAxisGrid(sunMesh, "sunMesh");
  makeAxisGrid(earthOrbit, "earthOrbit");
  makeAxisGrid(earthMesh, "earthMesh");
  makeAxisGrid(moonMesh, "moonMesh");

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach(obj => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
