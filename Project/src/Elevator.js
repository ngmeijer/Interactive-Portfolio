import * as THREE from 'three';
import CANNON from 'cannon';
import TWEEN from "@tweenjs/tween.js";
import Text from "./Text.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

export default class Elevator extends THREE.Object3D {
  spineMesh;
  platformMesh;
  platformBody;
  fenceMesh;
  fenceBody;
  colour;
  playerInstance;
  moveFloorUp = false;
  moveFloorDown = false;
  currentFloor = 0;
  maxFloors = 3;
  eventManager;
  animationPlaying = false;

  boundTextCreation;

  constructor(pPosition, pColour, pEventManager) {
    super();
    this.pos = pPosition;
    this.colour = pColour;
    this.eventManager = pEventManager;

    this.createSpine();
    this.createPlatform();
    this.createFence();
    this.initializeInputEvents(this, this.eventManager);
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
    const fenceShape = new CANNON.Box(new CANNON.Vec3(0.1, 0.5, 2));
    this.fenceBody = new CANNON.Body({ mass: this.mass });

    this.fenceBody.addShape(fenceShape);

    const geo = new THREE.BoxGeometry(0.18, 1, 4);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    this.fenceMesh = new THREE.Mesh(geo, material);
    this.fenceMesh.receiveShadow = true;
    this.fenceMesh.castShadow = true;
  }

  createText(pFontLoader, pScene){
    pFontLoader.load(
      "/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const hintText = new Text(
          "W to ascend\nS to descend",
          font,
          0.3,
          0xff0000,
          new THREE.Vector3(2, 2, -6)
        );

        pScene.add(hintText.mesh);
      }
    );
  }

  update() {
    this.updateTransform();
  }

  updateTransform() {
    this.fenceBody.position.set(
      this.platformBody.position.x - 1.55,
      this.platformBody.position.y,
      this.platformBody.position.z
    );
    this.platformMesh.position.set(
      this.platformBody.position.x,
      this.platformBody.position.y,
      this.platformBody.position.z
    );
    this.fenceMesh.position.set(
      this.fenceBody.position.x,
      this.fenceBody.position.y,
      this.fenceBody.position.z
    );
  }

  initializeInputEvents(pThis, pEventManager) {
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

  checkPlayerDistance() {
    if (this.animationPlaying) return;

    let distance = this.playerInstance.currentPos.distanceTo(
      this.platformMesh.position
    );

    if (distance <= 1.5) {
      this.eventManager.dispatchEvent({ type: "Event_disableMove" });
      if (this.moveFloorUp && this.currentFloor < this.maxFloors) {
        this.startFenceAnimation();
        this.startAscendingAnimation(this.eventManager);
      }

      if (this.moveFloorDown && this.currentFloor > 0) {
        this.startFenceAnimation();
        this.startDescendingAnimation(this.eventManager);
      }
    }
  }

  startFenceAnimation() {

  }

  startAscendingAnimation(pEventManager) {
    let targetPos = new THREE.Vector3(
      this.platformBody.position.x,
      this.platformBody.position.y + 6.5,
      this.platformBody.position.z
    );

    this.animationPlaying = true;

    const tweenToFloorUp = new TWEEN.Tween(this.platformBody.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 3000)
      .easing(TWEEN.Easing.Linear.None)
      .start()
      .onComplete(function () {
        pEventManager.dispatchEvent({ type: "Event_enableMove" });
      });
    this.animationPlaying = false;
    this.currentFloor++;
    this.moveFloorUp = false;
  }

  startDescendingAnimation(pEventManager) {
    let targetPos = new THREE.Vector3(
      this.platformBody.position.x,
      this.platformBody.position.y - 6.5,
      this.platformBody.position.z
    );

    this.animationPlaying = true;

    const tweenToFloorDown = new TWEEN.Tween(this.platformBody.position)
      .to({ x: targetPos.x, y: targetPos.y, z: targetPos.z }, 3000)
      .easing(TWEEN.Easing.Linear.None)
      .start()
      .onComplete(function () {
        pEventManager.dispatchEvent({ type: "Event_enableMove" });
      });
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
