import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DirectionalLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SplineCurve,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import { computeDrawingBufferResize } from "../utils/resizeRendererToDisplaySize";
import { disposeObjectTree } from "./disposeThree";
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

export const mountTankDemo: DemoFactory = (host) => {
  const renderer = new WebGLRenderer({ canvas: host.canvas });
  renderer.setClearColor(0xaaaaaa);
  renderer.shadowMap.enabled = true;

  function makeCamera(fov = 40): PerspectiveCamera {
    const aspect = 2;
    const zNear = 0.1;
    const zFar = 1000;
    return new PerspectiveCamera(fov, aspect, zNear, zFar);
  }

  const camera = makeCamera();
  camera.position.set(8, 4, 10).multiplyScalar(3);
  camera.lookAt(0, 0, 0);

  const scene = new Scene();

  {
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(0, 20, 0);
    scene.add(light);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    const d = 50;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 50;
    light.shadow.bias = 0.001;
  }

  {
    const light = new DirectionalLight(0xffffff, 1);
    light.position.set(1, 2, 4);
    scene.add(light);
  }

  const groundGeometry = new PlaneGeometry(50, 50);
  const groundMaterial = new MeshPhongMaterial({ color: 0xcc8866 });
  const groundMesh = new Mesh(groundGeometry, groundMaterial);
  groundMesh.rotation.x = Math.PI * -0.5;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  const carWidth = 4;
  const carHeight = 1;
  const carLength = 8;

  const tank = new Object3D();
  scene.add(tank);

  const bodyGeometry = new BoxGeometry(carWidth, carHeight, carLength);
  const bodyMaterial = new MeshPhongMaterial({ color: 0x6688aa });
  const bodyMesh = new Mesh(bodyGeometry, bodyMaterial);
  bodyMesh.position.y = 1.4;
  bodyMesh.castShadow = true;
  tank.add(bodyMesh);

  const tankCameraFov = 75;
  const tankCamera = makeCamera(tankCameraFov);
  tankCamera.position.y = 3;
  tankCamera.position.z = -6;
  tankCamera.rotation.y = Math.PI;
  bodyMesh.add(tankCamera);

  const wheelRadius = 1;
  const wheelThickness = 0.5;
  const wheelSegments = 6;
  const wheelGeometry = new CylinderGeometry(
    wheelRadius,
    wheelRadius,
    wheelThickness,
    wheelSegments
  );
  const wheelMaterial = new MeshPhongMaterial({ color: 0x888888 });
  const wheelPositions: [number, number, number][] = [
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
    [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
  ];
  const wheelMeshes = wheelPositions.map((position) => {
    const mesh = new Mesh(wheelGeometry, wheelMaterial);
    mesh.position.set(...position);
    mesh.rotation.z = Math.PI * 0.5;
    mesh.castShadow = true;
    bodyMesh.add(mesh);
    return mesh;
  });

  const domeRadius = 2;
  const domeWidthSubdivisions = 12;
  const domeHeightSubdivisions = 12;
  const domePhiStart = 0;
  const domePhiEnd = Math.PI * 2;
  const domeThetaStart = 0;
  const domeThetaEnd = Math.PI * 0.5;
  const domeGeometry = new SphereGeometry(
    domeRadius,
    domeWidthSubdivisions,
    domeHeightSubdivisions,
    domePhiStart,
    domePhiEnd,
    domeThetaStart,
    domeThetaEnd
  );
  const domeMesh = new Mesh(domeGeometry, bodyMaterial);
  domeMesh.castShadow = true;
  bodyMesh.add(domeMesh);
  domeMesh.position.y = 0.5;

  const turretWidth = 0.1;
  const turretHeight = 0.1;
  const turretLength = carLength * 0.75 * 0.2;
  const turretGeometry = new BoxGeometry(
    turretWidth,
    turretHeight,
    turretLength
  );
  const turretMesh = new Mesh(turretGeometry, bodyMaterial);
  const turretPivot = new Object3D();
  turretMesh.castShadow = true;
  turretPivot.scale.set(5, 5, 5);
  turretPivot.position.y = 0.5;
  turretMesh.position.z = turretLength * 0.5;
  turretPivot.add(turretMesh);
  bodyMesh.add(turretPivot);

  const turretCamera = makeCamera();
  turretCamera.position.y = 0.75 * 0.2;
  turretMesh.add(turretCamera);

  const targetGeometry = new SphereGeometry(0.5, 6, 3);
  const targetMaterial = new MeshPhongMaterial({
    color: 0x00ff00,
    flatShading: true,
  });
  const targetMesh = new Mesh(targetGeometry, targetMaterial);
  const targetOrbit = new Object3D();
  const targetElevation = new Object3D();
  const targetBob = new Object3D();
  targetMesh.castShadow = true;
  scene.add(targetOrbit);
  targetOrbit.add(targetElevation);
  targetElevation.position.z = carLength * 2;
  targetElevation.position.y = 8;
  targetElevation.add(targetBob);
  targetBob.add(targetMesh);

  const targetCamera = makeCamera();
  const targetCameraPivot = new Object3D();
  targetCamera.position.y = 1;
  targetCamera.position.z = -2;
  targetCamera.rotation.y = Math.PI;
  targetBob.add(targetCameraPivot);
  targetCameraPivot.add(targetCamera);

  const curve = new SplineCurve([
    new Vector2(-10, 0),
    new Vector2(-5, 5),
    new Vector2(0, 0),
    new Vector2(5, -5),
    new Vector2(10, 0),
    new Vector2(5, 10),
    new Vector2(-5, 10),
    new Vector2(-10, -10),
    new Vector2(-15, -8),
    new Vector2(-10, 0),
  ]);

  const points = curve.getPoints(50);
  const lineGeometry = new BufferGeometry().setFromPoints(points);
  const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
  const splineObject = new Line(lineGeometry, lineMaterial);
  splineObject.rotation.x = Math.PI * 0.5;
  splineObject.position.y = 0.05;
  scene.add(splineObject);

  const targetPosition = new Vector3();
  const tankPosition = new Vector2();
  const tankTarget = new Vector2();

  const cameras = [
    { cam: camera, desc: "detached camera" },
    { cam: turretCamera, desc: "on turret looking at target" },
    { cam: targetCamera, desc: "near target looking at tank" },
    { cam: tankCamera, desc: "above back of tank" },
  ];

  let raf = 0;

  function render(time: number): void {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      cameras.forEach((cameraInfo) => {
        const cam = cameraInfo.cam;
        cam.aspect = canvas.clientWidth / canvas.clientHeight;
        cam.updateProjectionMatrix();
      });
    }

    targetOrbit.rotation.y = time * 0.27;
    targetBob.position.y = Math.sin(time * 2) * 4;
    targetMesh.rotation.x = time * 7;
    targetMesh.rotation.y = time * 13;
    targetMaterial.emissive.setHSL(time * 10 - Math.floor(time * 10), 1, 0.25);
    targetMaterial.color.setHSL(time * 10 - Math.floor(time * 10), 1, 0.25);

    const tankTime = time * 0.05;
    curve.getPointAt(tankTime % 1, tankPosition);
    curve.getPointAt((tankTime + 0.01) % 1, tankTarget);
    tank.position.set(tankPosition.x, 0, tankPosition.y);
    tank.lookAt(tankTarget.x, 0, tankTarget.y);

    targetMesh.getWorldPosition(targetPosition);
    turretPivot.lookAt(targetPosition);

    turretCamera.lookAt(targetPosition);

    tank.getWorldPosition(targetPosition);
    targetCameraPivot.lookAt(targetPosition);

    wheelMeshes.forEach((obj) => {
      obj.rotation.x = time * 3;
    });

    const active = cameras[(time * 0.25) % cameras.length | 0];
    host.info.textContent = active.desc;

    renderer.render(scene, active.cam);

    raf = requestAnimationFrame(render);
  }

  raf = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(raf);
    host.info.textContent = "";
    disposeObjectTree(scene);
    renderer.dispose();
    scene.clear();
  };
};
