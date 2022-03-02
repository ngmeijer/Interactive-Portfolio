import * as THREE from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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

  instructionTextColor = 0x9d0208;
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
    let languages = new Text(
      "Languages:",
      this.resources.items.ElMessiri,
      0.6,
      0xffffff,
      new Vector3(19.8, 19.5, -6)
    );
    this.scene.add(languages.mesh);

    //1st column
    let cpp = this.resources.items.cpp.clone();;
    this.scene.add(cpp);
    cpp.position.set(21, 15.2, -6);
    cpp.receiveShadow = true;

    let csharp = this.resources.items.csharp.clone();;
    this.scene.add(csharp);
    csharp.position.set(21, 17.8, -6);

    //2nd column
    let css = this.resources.items.css.clone();;
    this.scene.add(css);
    css.position.set(23.6, 17.8, -6);

    let html = this.resources.items.html.clone();;
    this.scene.add(html);
    html.position.set(23.6, 15.2, -6);

    let javascript = this.resources.items.javascript.clone();;
    this.scene.add(javascript);
    javascript.position.set(21.1, 12.6, -6);
  }

  createSoftwareDetails() {
    let software = new Text(
      "Software:",
      this.resources.items.ElMessiri,
      0.6,
      0xffffff,
      new Vector3(26.8, 19.5, -6)
    );
    this.scene.add(software.mesh);

    //1st column
    let unity = this.resources.items.unity.clone();;
    this.scene.add(unity);
    unity.position.set(28.3, 17.8, -6);
    unity.receiveShadow = true;

    let unrealEngine = this.resources.items.unrealEngine.clone();;
    this.scene.add(unrealEngine);
    unrealEngine.position.set(28.3, 15.15, -6);
    unrealEngine.receiveShadow = true;

    let gitkraken = this.resources.items.gitkraken.clone();;
    this.scene.add(gitkraken);
    gitkraken.position.set(28.3, 12.5, -6);

    //2nd column
    let blender = this.resources.items.blender.clone();;
    this.scene.add(blender);
    blender.position.set(31, 15, -6);

    let visualStudio = this.resources.items.visualStudio.clone();;
    this.scene.add(visualStudio);
    visualStudio.position.set(31, 17.8, -6);
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
    this.light = new THREE.SpotLight(0xdc2f02, 10, 20, Math.PI * 0.95, 0.25, 1);
    this.light.position.set(20, 17, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(24, 17, -5);

    //this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    const rectLight = new THREE.RectAreaLight(0xffffff, 50, 10, 8);
    rectLight.position.set(27, 16, -2);
    this.scene.add(rectLight);
  }
}
