import type { BufferGeometry, Line, Material, Mesh, Object3D } from "three";

function hasGeometry(
  object: Object3D
): object is Object3D & { geometry: BufferGeometry } {
  return "geometry" in object && (object as Mesh).geometry !== undefined;
}

function hasMaterial(
  object: Object3D
): object is Object3D & { material: Material | Material[] } {
  return "material" in object && (object as Mesh | Line).material !== undefined;
}

export function disposeObjectTree(root: Object3D): void {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();

  root.traverse((object) => {
    if (hasGeometry(object)) {
      geometries.add(object.geometry);
    }
    if (hasMaterial(object)) {
      const mat = object.material;
      if (Array.isArray(mat)) {
        mat.forEach((m) => materials.add(m));
      } else {
        materials.add(mat);
      }
    }
  });

  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
}
