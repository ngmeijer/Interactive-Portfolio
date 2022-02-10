import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Cube from "./Cube.js";

export default class ContactMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;
  light;

  constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.textureLoader = pTextureLoader;
    this.fontLoader = pFontloader;
  }

  overrideColours() {}

  initializeArea() {
    this.createContactMeGeometry();
    this.createLighting();
    this.createText();
  }

  update(){
    
  }

  createContactMeGeometry() {
    let ground = new Cube(
      "Portfolio_Ground",
      new THREE.Vector3(50, 1, 30),
      new THREE.Vector3(31, 11.5, -10),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.scene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "Portfolio_BackgroundLeft",
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

    this.fontLoader.load(
      "/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new TextGeometry(
          "Contact me",
          { font: font, size: 0.7, height: 0.01 }
        );
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
    );
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 20);
    this.light.position.set(15, 20, 0);
    this.light.castShadow = true;
    this.scene.add(this.light);
  }
}
