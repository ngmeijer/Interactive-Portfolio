import * as THREE from "three";

import Cube from "./Cube.js";
import Text from "./Text.js";
import Door from "./Door.js";
import { Vector2, Vector3 } from "three";
import Image from "./Image.js";

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
    this.createLighting();
    this.creatAboutMeText();
    this.createAboutMeGeometry();
    this.createPhoto();
    this.createLanguageDetails();

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
      new THREE.Vector3(31, 6.5, -10),
      this.environmentColor,
      true,
      0
    );
    ground.addToScene(this.scene, this.physicsWorld);
  }

  createPhoto() {
    const photo = new Image(
      new Vector2(4, 6),
      new Vector3(20, 10, -6),
      this.resources.items.Photo
    );
    this.scene.add(photo.mesh);
  }

  createLanguageDetails() {
    const cpp = new Image(
      new Vector2(1, 1),
      new Vector3(23, 10, -6),
      this.resources.items.cpp
    );
    this.scene.add(cpp.mesh);

    const csharp = new Image(
      new Vector2(1, 1),
      new Vector3(24, 10, -6),
      this.resources.items.csharp
    );
    this.scene.add(csharp.mesh);

    const css = new Image(
      new Vector2(1, 1),
      new Vector3(25, 10, -6),
      this.resources.items.css
    );
    this.scene.add(css.mesh);

    const html = new Image(
      new Vector2(1, 1),
      new Vector3(26, 10, -6),
      this.resources.items.html
    );
    this.scene.add(html.mesh);

    const javascript = new Image(
      new Vector2(1, 1),
      new Vector3(27, 10, -6),
      this.resources.items.javascript
    );
    this.scene.add(javascript.mesh);
  }

  creatAboutMeText() {
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    let textContent =
      "Hi! My name is Nils Meijer, currently a student \nat Saxion Universities in Enschede, The Netherlands. \nI'm doing the engineering direction. I hope my website \nleaves a good impression of the work I do!";
    const informationText = new Text(
      textContent,
      this.resources.items.ElMessiri,
      0.3,
      textCol,
      new THREE.Vector3(7.5, 12, -6.5)
    );
    scene.add(informationText.mesh);
  }

  createLighting() {
    this.light = new THREE.SpotLight(0xffffff, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.light.position.set(15, 13, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(12, 12, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
