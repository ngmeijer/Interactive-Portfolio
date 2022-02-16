import * as THREE from "three";
import { Vector3 } from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Cube from "./Cube.js";
import Elevator from "./Elevator.js";
import Text from "./Text.js";

export default class Home {
  scene;
  physicsWorld;
  fontLoader;
  eventManager;

  instructionTextColor = 0xe85d04;
  platformColor = 0x370617;
  environmentColor = 0x6a040f;

  playerInstance;
  frontLight;
  backLight;
  background;
  elevator;

  constructor(pScene, pPhysicsWorld, pResources, pEventManager) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
    this.eventManager = pEventManager;
  }

  overrideColours() {}

  initializeArea() {
    this.createStartGeometry();
    //this.createStartText();
    this.createLighting();
  }

  update() {
    this.elevator.update();
  }

  createStartGeometry() {
    let ground = new Cube(
      "Home_Ground",
      new THREE.Vector3(9, 5, 1),
      new THREE.Vector3(-1.5, -5.5, 1),
      0x000000,
      true
    );
    ground.addToScene(this.scene, this.physicsWorld);

    let homeMesh = this.resources.items.HomeIntro;
    this.scene.add(homeMesh.scene);
    homeMesh.scene.position.set(-8, -0.1, -3);

    this.background = this.resources.items.CubeBackground;
    this.scene.add(this.background.scene);
    this.background.scene.position.set(-20, -10, -9);
    this.elevator = new Elevator(
      new THREE.Vector3(4.5, 0, -2),
      this.environmentColor,
      this.eventManager
    );
    this.elevator.createText(this.resources.items.ElMessiri, this.scene);
    this.elevator.addToScene(this.scene, this.physicsWorld);
    this.elevator.playerInstance = this.playerInstance;
  }

  createStartText() {
    const titleText = new Text(
      "Home",
      this.resources.items.ElMessiri,
      0.7,
      this.instructionTextColor,
      new THREE.Vector3(-7, 5, -6)
    );

    const hintText = new Text(
      "Press A/D to move!\nPress space to jump",
      this.resources.items.ElMessiri,
      0.4,
      this.instructionTextColor,
      new THREE.Vector3(-7, 0.5, -6)
    );

    const roleText = new Text(
      "Game Developer\nGame Designer\nWeb Developer",
      this.resources.items.ElMessiri,
      0.4,
      this.instructionTextColor,
      new THREE.Vector3(-7, 3.5, -6)
    );

    this.scene.add(titleText.mesh);
    this.scene.add(hintText.mesh);
    this.scene.add(roleText.mesh);
  }

  createLighting() {
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(-10, 10, -5);

    this.backLight = new THREE.SpotLight(0xff0000, 15, 0, Math.PI * 0.3, 1, 10);
    this.backLight.position.set(0, -10, 1);
    this.backLight.castShadow = true;
    this.backLight.shadow.far = 30;

    this.backLight.target = lightTarget;
    this.scene.add(lightTarget);
    this.scene.add(this.backLight.target);
    this.scene.add(this.backLight);

    this.backLight.shadow.mapSize.width = 1024;
    this.backLight.shadow.mapSize.height = 1024;

    const backLightTarget = new THREE.Object3D();
    backLightTarget.position.set(0, 1, -5);

    this.frontLight = new THREE.SpotLight(0xffffff, 3, 0, Math.PI * 0.7, 1, 1);
    this.frontLight.position.set(0, 5, 5);
    this.frontLight.castShadow = true;
    this.frontLight.shadow.far = 30;

    this.frontLight.target = lightTarget;
    this.scene.add(lightTarget);
    this.scene.add(this.frontLight.target);
    this.scene.add(this.frontLight);

    this.frontLight.shadow.mapSize.width = 2048;
    this.frontLight.shadow.mapSize.height = 2048;
  }
}
