import * as THREE from "three";
import CANNON from "cannon";
import TWEEN from "@tweenjs/tween.js";
import Text from "./Text.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Vector3 } from "three";

export default class Elevator extends THREE.Object3D {
  spineMesh;
  platformMesh;
  platformBody;
  fenceMesh;
  fenceBody;
  fenceOffset;
  colour;
  playerInstance;
  moveFloorUp = false;
  moveFloorDown = false;
  currentFloor = 0;
  maxFloors = 2;
  eventManager;
  animationPlaying = false;

  hintText;
  textOffset;

  constructor(pPosition, pColour, pEventManager) {
    super();
    this.pos = pPosition;
    this.colour = pColour;
    this.eventManager = pEventManager;

    this.createSpine();
    this.createPlatform();
    this.createFence();
    this.initializeInputEvents(this);

    this.boundUnlockAnimation = this.unlockAnimation.bind(this);
  }

  createSpine() {
    const geo = new THREE.BoxGeometry(0.5, 45, 2);
    const material = new THREE.MeshPhongMaterial({ color: this.colour });
    this.spineMesh = new THREE.Mesh(geo, material);
    this.spineMesh.position.x = this.pos.x;
    this.spineMesh.position.y = this.pos.y;
    this.spineMesh.position.z = this.pos.z;
  }

  createPlatform() {
    const geo = new THREE.BoxGeometry(2.8, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x370617 });
    this.platformMesh = new THREE.Mesh(geo, material);
    this.platformMesh.position.x = this.pos.x + 0.1;
    this.platformMesh.position.y = this.pos.y - 1;
    this.platformMesh.position.z = this.pos.z + 3;
    this.platformMesh.receiveShadow = true;
    this.platformMesh.castShadow = true;

    const platformShape = new CANNON.Box(new CANNON.Vec3(1, 0.5, 2));
    this.platformBody = new CANNON.Body({ mass: this.mass });

    this.platformBody.addShape(platformShape);
    this.platformBody.position.x = this.platformMesh.position.x;
    this.platformBody.position.y = this.platformMesh.position.y;
    this.platformBody.position.z = this.platformMesh.position.z;
  }

  createFence() {
    this.fenceOffset = new Vector3(-1.55, 0, 0);
    const fenceShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 2));
    this.fenceBody = new CANNON.Body({ mass: this.mass });

    this.fenceBody.addShape(fenceShape);

    const geo = new THREE.BoxGeometry(0.18, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.fenceMesh = new THREE.Mesh(geo, material);
    this.fenceMesh.receiveShadow = true;
    this.fenceMesh.castShadow = true;
  }

  createText(pFont, pScene) {
    this.hintText = new Text(
      "W to ascend\nS to descend",
      pFont,
      0.3,
      0xff0000,
      new THREE.Vector3(3.3, 1, -1)
    );

    this.textOffset = new Vector3(-1.3, 2, -2);
    pScene.add(this.hintText.mesh);
  }

  update() {
    this.updateTransform();
  }

  updateTransform() {
    this.fenceBody.position.set(
      this.platformBody.position.x + this.fenceOffset.x,
      this.platformBody.position.y + this.fenceOffset.y,
      this.platformBody.position.z + this.fenceOffset.z
    );
    this.fenceMesh.position.set(
      this.fenceBody.position.x,
      this.fenceBody.position.y,
      this.fenceBody.position.z
    );
    this.platformMesh.position.set(
      this.platformBody.position.x,
      this.platformBody.position.y,
      this.platformBody.position.z
    );

    this.hintText.mesh.position.set(
      this.platformBody.position.x + this.textOffset.x,
      this.platformBody.position.y + this.textOffset.y,
      this.platformBody.position.z + this.textOffset.z,
    );
  }

  initializeInputEvents(pThis) {
    document.addEventListener("keydown", function (event) {
      if (event.key == "w" || event.key == "W") {
        pThis.checkDirection(1);
      }
      if (event.key == "s" || event.key == "S") {
        pThis.checkDirection(-1);
      }
    });
  }

  checkDirection(pDirection) {
    switch (pDirection) {
      case 1:
        this.moveFloorUp = true;
        this.moveFloorDown = false;
        break;
      case -1:
        this.moveFloorDown = true;
        this.moveFloorUp = false;
        break;
    }

    this.checkPlayerDistance();
  }

  unlockAnimation() {
    this.eventManager.dispatchEvent({ type: "Event_enableMove" });
    this.animationPlaying = false;
  }

  checkPlayerDistance() {
    if (this.animationPlaying) return;

    let distance = this.playerInstance.currentPos.distanceTo(
      this.platformMesh.position
    );

    if (distance <= 1.5) {
      this.eventManager.dispatchEvent({ type: "Event_disableMove" });
      if (this.moveFloorUp && this.currentFloor < this.maxFloors) {
        this.startAscendingAnimation();
      }

      if (this.moveFloorDown && this.currentFloor > 0) {
        this.startDescendingAnimation(this.eventManager);
      }
    }
  }

  startAscendingAnimation() {
    this.animationPlaying = true;

    const tweenFenceUp = new TWEEN.Tween(this.fenceOffset)
      .to(
        {
          x: this.fenceOffset.x,
          y: this.fenceOffset.y + 1,
          z: this.fenceOffset.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Linear.None);

    let elevatorTargetPos = new THREE.Vector3(
      this.platformBody.position.x,
      this.platformBody.position.y + 8,
      this.platformBody.position.z
    );

    const tweenToFloorUp = new TWEEN.Tween(this.platformBody.position)
      .to(
        {
          x: elevatorTargetPos.x,
          y: elevatorTargetPos.y,
          z: elevatorTargetPos.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(this.boundUnlockAnimation);

    if (this.currentFloor == 0) {
      tweenFenceUp.chain(tweenToFloorUp);
      tweenFenceUp.start();
    } else tweenToFloorUp.start();

    this.currentFloor++;
    this.moveFloorUp = false;
  }

  startDescendingAnimation(pEventManager) {
    this.animationPlaying = true;

    const tweenFenceDown = new TWEEN.Tween(this.fenceOffset)
      .to(
        {
          x: this.fenceOffset.x,
          y: this.fenceOffset.y - 1,
          z: this.fenceOffset.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Linear.None);

    let targetPos = new THREE.Vector3(
      this.platformBody.position.x,
      this.platformBody.position.y - 8,
      this.platformBody.position.z
    );

    const tweenToFloorDown = new TWEEN.Tween(this.platformBody.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 2000)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(function () {
        pEventManager.dispatchEvent({ type: "Event_enableMove" });
      });

    tweenToFloorDown.chain(tweenFenceDown);
    tweenToFloorDown.start();

    this.animationPlaying = false;
    this.currentFloor--;
    this.moveFloorDown = false;
  }

  addToScene(pScene, pPhysicsWorld) {
    pScene.add(this.spineMesh);
    pScene.add(this.platformMesh);
    pScene.add(this.fenceMesh);

    pPhysicsWorld.addBody(this.platformBody);
    pPhysicsWorld.addBody(this.fenceBody);
  }
}
