import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Cube from "./Cube.js";
import Text from "./Text.js";
import AreaComponent from "./AreaComponent.js";
import Door from "./Door.js";

export default class AboutMe {
  door;
  playerInstance;
  moveableObjects = [];
  doorMaxDistance = 6;
  light;
  resources;
  scene;
  physicsWorld;

  constructor(pScene, pPhysicsWorld, pResources) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
  }

  overrideColours() {}

  initializeArea() {
    //this.createDoor();
    this.createLighting();
    this.creatAboutMeText();
    this.createAboutMeGeometry();

    if (this.door == null) this.canUpdate = false;
  }

  update() {
    if (this.canUpdate == false) return;

    //this.checkPlayerDistance();

    for (let i = 0; i < this.moveableObjects.length; i++) {
      this.moveableObjects[i].update();
    }
  }

  checkPlayerDistance() {
    let distanceToDoor = this.playerInstance.currentPos.distanceTo(
      this.door.pos
    );

    //Check if distance is too high.
    if (distanceToDoor > this.doorMaxDistance) {
      //Check if doors are closed. If so, skip this element in the loop.
      if (!this.door.isOpen) return;

      //Check if doors are open. If so, close door and move on to the next element.
      if (this.door.isOpen) {
        this.door.closeDoor();
        return;
      }
    }

    //No need to check for distance. The loop only gets this far if the distance is less than the maxDistance.
    if (!this.door.isOpen) this.door.openDoor();
  }

  createDoor() {
    this.door = new Door(
      "AboutMeDoor",
      new THREE.Vector3(1, 25, 20),
      new THREE.Vector3(33.5, 4, 0),
      0x9d0208,
      true
    );

    this.scene.add(this.door.doorComponent.mesh);
    this.physicsWorld.addBody(this.door.doorComponent.body);
    this.moveableObjects.push(this.door);
  }

  createAboutMeGeometry() {
    let ground = new Cube(
      "AboutMe_Ground",
      new THREE.Vector3(50, 1, 50),
      new THREE.Vector3(31, 5, -10),
      this.environmentColor,
      true,
      0
    );
    ground.addToScene(this.scene, this.physicsWorld);
  }

  creatAboutMeText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    const titleGeo = new TextGeometry("About me", {
      font: this.resources.items.ElMessiri,
      size: 0.7,
      height: 0.01,
    });
    const titleMesh = new THREE.Mesh(titleGeo, [
      new THREE.MeshPhongMaterial({ color: textCol }),
      new THREE.MeshPhongMaterial({ color: textCol }),
    ]);

    titleMesh.position.x = 7.5;
    titleMesh.position.y = 11;
    titleMesh.position.z = -6.5;
    titleMesh.castShadow = true;
    scene.add(titleMesh);

    let textContent =
      "Lorem ipsum dolor sit amet, " +
      "\nconsectetur adipiscing elit," +
      "\nsed do eiusmod tempor incididunt" +
      "\nut labore et dolore magna aliqua. " +
      "\nUt enim ad minim veniam, quis nostrud" +
      "\nexercitation ullamco laboris nisi ut aliquip";

    const informationText = new Text(
      textContent,
      this.resources.items.ElMessiri,
      0.3,
      textCol,
      new THREE.Vector3(8, 10, -6)
    );
    scene.add(informationText.mesh);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 5, 30);
    this.light.position.set(15, 7, 0);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }
}
