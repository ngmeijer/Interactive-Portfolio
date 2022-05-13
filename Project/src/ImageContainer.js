import * as THREE from "three";

export default class Image extends THREE.Object3D {
  mesh;

  constructor(pSize, pPosition, pFile) {
    super();
    const geo = new THREE.PlaneBufferGeometry(pSize.x, pSize.y);

    const material = new THREE.MeshBasicMaterial({
      map: pFile,
    });

    this.mesh = new THREE.Mesh(geo, material);

    this.mesh.position.x = pPosition.x;
    this.mesh.position.y = pPosition.y;
    this.mesh.position.z = pPosition.z;
  }
}
