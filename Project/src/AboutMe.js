import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import Cube from "./Cube.js";
import Text from "./Text.js";
import Door from "./Door.js";
import { Vector2, Vector3 } from "three";
import Image from "./ImageContainer.js";

export default class AboutMe {
  door;
  playerInstance;
  moveableObjects = [];
  doorMaxDistance = 6;
  light;
  resources;
  scene;
  physicsWorld;

  instructionTextColor = 0xffffff;
  platformColor = 0xe85d04;
  environmentColor = 0x100b13;

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
    this.createSoftwareDetails();

    if (this.door == null) this.canUpdate = false;
  }

  update() {
    if (this.canUpdate == false) return;

    for (let i = 0; i < this.moveableObjects.length; i++) {
      this.moveableObjects[i].update();
    }
  }

  createAboutMeGeometry() {
    let ground = new Cube(
      "AboutMe_Ground",
      new THREE.Vector3(50, 3, 2),
      new THREE.Vector3(31, 8.5, 0.75),
      this.environmentColor,
      true,
      0
    );
    ground.addToScene(this.scene, this.physicsWorld);

    let background = new Cube(
      "AboutMe_Background",
      new THREE.Vector3(25, 12, 0.1),
      new THREE.Vector3(24, 10, -7),
      0x03071e,
      true,
      0
    );

    background.addToScene(this.scene);
  }

  createPhoto() {
    const photo = new Image(
      new Vector2(4, 6),
      new Vector3(16.5, 16, -6),
      this.resources.items.Photo
    );
    this.scene.add(photo.mesh);
  }

  createLanguageDetails() {
    let languagesText = new Text(
      "Languages:",
      this.resources.items.ElMessiri,
      0.6,
      0xffffff,
      new Vector3(19.8, 19.5, -6)
    );
    this.scene.add(languagesText.mesh);

    //1st column
    let languagesMesh = this.resources.items.languages.clone();
    this.scene.add(languagesMesh);
    languagesMesh.position.set(21, 15.2, -6);
  }

  createSoftwareDetails() {
    let softwareText = new Text(
      "Software:",
      this.resources.items.ElMessiri,
      0.6,
      0xffffff,
      new Vector3(28.2, 19.5, -6)
    );
    this.scene.add(softwareText.mesh);

    //1st column
    let softwareMesh = this.resources.items.software.clone();
    this.scene.add(softwareMesh);
    softwareMesh.position.set(29.5, 15.15, -6);
  }

  creatAboutMeText() {
    let textContent =
      "Hi! My name is Nils Meijer, currently a \nstudent at Saxion Universities in \nEnschede, The Netherlands. \nI'm doing the engineering direction. \nI hope my website leaves a good \nimpression of the work I do!";
    const informationText = new Text(
      textContent,
      this.resources.items.ElMessiri,
      0.25,
      this.instructionTextColor,
      new THREE.Vector3(8.5, 14.5, -2.5)
    );
    informationText.mesh.rotation.y = Math.PI * 0.15;
    this.scene.add(informationText.mesh);
  }

  createLighting() {
    this.light = new THREE.SpotLight(0xdc2f02, 5, 20, Math.PI * 0.95, 0.25, 1);
    this.light.position.set(20, 18, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(24, 17, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    const rectLight = new THREE.RectAreaLight(0xffffff, 5, 10, 8);
    rectLight.position.set(27, 16, -2);
    this.scene.add(rectLight);
  }
}
