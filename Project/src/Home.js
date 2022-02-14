import * as THREE from "three";
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
  light;

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
    this.createStartText();
    this.createLighting();
  }

  update() {
    this.elevator.update();
  }

  createStartGeometry() {
    let wall = new Cube(
      "LeftWall",
      new THREE.Vector3(2, 20, 50),
      new THREE.Vector3(-8, -1, 0),
      this.environmentColor,
      true,
      0
    );
    wall.addToScene(this.scene, this.physicsWorld);

    let ground = new Cube(
      "PortfolioGround",
      new THREE.Vector3(10, 0.5, 15),
      new THREE.Vector3(-2, -1, 0),
      this.environmentColor,
      true
    );
    ground.addToScene(this.scene, this.physicsWorld);

    this.elevator = new Elevator(
      new THREE.Vector3(4.5, 0, -2),
      this.environmentColor,
      this.eventManager
    );
    //this.elevator.createText(this.fontLoader, this.scene);
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

    this.scene.add(titleText.mesh);
    this.scene.add(hintText.mesh);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 20);
    this.light.position.set(0, 9, 4);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }
}
