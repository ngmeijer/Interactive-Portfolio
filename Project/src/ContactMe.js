import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Cube from "./Cube.js";

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
    let scene = this.scene;
    let textCol = this.instructionTextColor;

    const titleGeo = new TextGeometry("Contact me", {
      font: this.resources.items.ElMessiri,
      size: 0.7,
      height: 0.01,
    });
    const titleMesh = new THREE.Mesh(titleGeo, [
      new THREE.MeshPhongMaterial({ color: textCol }),
      new THREE.MeshPhongMaterial({ color: textCol }),
    ]);

    titleMesh.position.x = 7;
    titleMesh.position.y = 16;
    titleMesh.position.z = -6;
    titleMesh.castShadow = true;
    scene.add(titleMesh);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 20);
    this.light.position.set(15, 20, 0);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }
}
