import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Cube from "./Cube.js";
import Text from "./Text.js";

export default class ContactMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;
  light;

  constructor(pScene, pPhysicsWorld, pResources) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
  }

  overrideColours() {}

  initializeArea() {
    this.createContactMeGeometry();
    this.createLighting();
    this.createText();
  }

  update() {}

  createContactMeGeometry() {
    let ground = new Cube(
      "ContactMe_Ground",
      new THREE.Vector3(50, 1, 50),
      new THREE.Vector3(31, 14.5, -10),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.scene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "ContactMe_BackgroundLeft",
      new THREE.Vector3(1, 20, 30),
      new THREE.Vector3(6.5, -0.5, -16),
      this.environmentColor,
      true,
      0
    );

    backgroundLeft.addToScene(this.scene, this.physicsWorld);
  }

  createText() {
    const titleText = new Text(
      "Contact me",
      this.resources.items.ElMessiri,
      0.7,
      this.instructionTextColor,
      new THREE.Vector3(8, 16, -6)
    );

    this.scene.add(titleText.mesh);
  }

  createLighting() {
    this.light = new THREE.SpotLight(0xffffff, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.light.position.set(13, 17, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(12, 16, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
