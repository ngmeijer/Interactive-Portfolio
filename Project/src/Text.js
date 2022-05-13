import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class Text extends THREE.Object3D {
  mesh;
  geo;

  constructor(pTextContent, pFont, pFontSize, pColour, pPosition) {
    super();

    this.geo = new TextGeometry(pTextContent, {
      font: pFont,
      size: pFontSize,
      height: 0.01,
    });
    this.mesh = new THREE.Mesh(this.geo, [
      new THREE.MeshBasicMaterial({ color: pColour }),
      new THREE.MeshBasicMaterial({ color: pColour }),
    ]);

    this.mesh.position.x = pPosition.x;
    this.mesh.position.y = pPosition.y;
    this.mesh.position.z = pPosition.z;
    this.mesh.castShadow = true;
  }
}
