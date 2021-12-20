import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  FaceColors,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh
} from "three";
import "../css/styles.css";

function main() {
  // renderer
  // const renderer = new WebGLRenderer();
  // enderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  const canvas = document.querySelector("#c");
  const renderer = new WebGLRenderer({ canvas });

  // camera
  const fov = 75; // field of view
  const aspect = 2;
  const near = 0.1;
  const far = 8;
  const camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 5;

  // scena
  const scene = new Scene();

  // light
  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  // geometry
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(geometry, color, positionX) {
    const material = new MeshPhongMaterial({ color });

    const cube = new Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = positionX;

    return cube;
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2)
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = (canvas.clientWidth * pixelRatio) | 0;
    const height = (canvas.clientHeight * pixelRatio) | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * 0.1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

main();
