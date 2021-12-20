import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  PlaneGeometry,
  FaceColors,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import "../css/styles.css";

let sphere, renderer, scene, camera, mesh, stats;

sphere = {
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0
};

let initGui = () => {
  let gui = new GUI();
  gui
    .add(sphere, "positionX")
    .min(-5)
    .max(5)
    .step(0.01);
  gui
    .add(sphere, "positionY")
    .min(-5)
    .max(5)
    .step(0.01);
  gui
    .add(sphere, "positionZ")
    .min(-5)
    .max(5)
    .step(0.01);
  gui
    .add(sphere, "rotationX")
    .min(-0.2)
    .max(0.2)
    .step(0.001);
  gui
    .add(sphere, "rotationY")
    .min(-0.2)
    .max(0.2)
    .step(0.001);
  gui
    .add(sphere, "rotationZ")
    .min(-0.2)
    .max(0.2)
    .step(0.001);
};

let initStats = () => {
  stats = new Stats();
  stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);
};

let init = () => {
  let width, height, light, geometry, material;

  width = window.innerWidth;
  height = window.innerHeight;

  renderer = new WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild(renderer.domElement);

  scene = new Scene();

  camera = new PerspectiveCamera(45, width / height, 0.1, 5000);
  camera.position.set(0, 0, 1000);

  light = new AmbientLight(0xfff);
  scene.add(light);

  // var geometry = new PlaneGeometry(300, 300, 12, 12);
  geometry = new SphereGeometry(300, 32, 32);
  material = new MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: FaceColors
  });

  for (var i = 0; i < geometry.faces.length; i++) {
    geometry.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());
  }

  mesh = new Mesh(geometry, material);
  scene.add(mesh);
};

let render = () => {
  mesh.position.x += sphere.positionX;
  mesh.position.y += sphere.positionY;
  mesh.position.z += sphere.positionZ;
  mesh.rotation.x += sphere.rotationX;
  mesh.rotation.y += sphere.rotationY;
  mesh.rotation.z += sphere.rotationZ;
  renderer.render(scene, camera);
};

let animate = () => {
  stats.begin();
  // monitored code goes here
  render();
  stats.end();

  requestAnimationFrame(animate);
};

initGui();
initStats();
init();
animate();
