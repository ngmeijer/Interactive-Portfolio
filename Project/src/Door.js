import * as THREE from 'three';
import Cube from "./Cube.js";

export default class Door extends THREE.Object3D {
  ID;
  pos;
  size;
  colour;
  doorComponent;
  verticalMovement = 5;
  isOpen = false;
  isClosed = true;
  originalPosition;

  constructor(pID, pSize, pPosition, pColour) {
    super();
    this.ID = pID;
    this.pos = pPosition;
    this.size = pSize;
    this.colour = pColour;

    this.doorComponent = new Cube(
      "AboutMeDoor",
      new THREE.Vector3(pSize.x, pSize.y, pSize.z),
      new THREE.Vector3(pPosition.x, pPosition.y, pPosition.z),
      0x9d0208,
      true,
      0
    );

    this.originalPosition = this.doorComponent.pos;
  }

  update() {
    this.doorComponent.update();
  }

  openDoor() {
    let targetPos = new THREE.Vector3(
      this.originalPosition.x,
      this.originalPosition.y + 8,
      this.originalPosition.z
    );

    const tweenOpen = new TWEEN.Tween(this.doorComponent.body.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .start();

    this.isOpen = true;
  }

  closeDoor() {
    const tweenClose = new TWEEN.Tween(this.doorComponent.body.position)
      .to(
        {
          x: this.originalPosition.x,
          y: this.originalPosition.y,
          z: this.originalPosition.z,
        },
        1500
      )
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    this.isOpen = false;
  }
}
