import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import Cube from "./Cube.js";
import Text from "./Text.js";

export default class ContactMe {
  scene;
  physicsWorld;
  textureLoader;
  fontLoader;
  camera;
  light;
  rayCaster;
  mousePosition = new THREE.Vector2();
  twitter;
  linkedin;
  git;
  discord;
  playstore;

  constructor(pScene, pPhysicsWorld, pResources) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
  }

  overrideColours() {}

  initializeArea() {
    this.createContactMeGeometry();
    this.createLighting();
    this.createSocialMedia();
    this.createSocialMediaControls();
  }

  update() {
    this.checkSocialMediaMouseOver();
  }

  createContactMeGeometry() {
    let ground = new Cube(
      "ContactMe_Ground",
      new THREE.Vector3(50, 1, 2),
      new THREE.Vector3(31, 18.5, 0.75),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.scene, this.physicsWorld);
  }

  createSocialMedia() {
    this.twitter = this.resources.items.twitter;
    this.scene.add(this.twitter.scene);
    this.twitter.scene.position.set(17, 22, -6);

    this.linkedin = this.resources.items.linkedin;
    this.scene.add(this.linkedin.scene);
    this.linkedin.scene.position.set(20, 22, -6);

    this.git = this.resources.items.git;
    this.scene.add(this.git.scene);
    this.git.scene.position.set(23, 22, -6);

    this.discord = this.resources.items.discord;
    this.scene.add(this.discord.scene);
    this.discord.scene.position.set(26, 22, -6);

    this.playstore = this.resources.items.playstore;
    this.scene.add(this.playstore.scene);
    this.playstore.scene.position.set(29, 22, -6);
  }

  checkSocialMediaMouseOver() {
    if(this.mousePosition == null) return;

    this.rayCaster.setFromCamera(this.mousePosition, this.camera);

    const objectsToTest = [
      this.twitter.scene,
      this.linkedin.scene,
      this.git.scene,
      this.discord.scene,
      this.playstore.scene,
    ];
    const intersects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }

    for (const currentObject of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === currentObject)) {
        currentObject.children[0].material.color.set("#ffff00");
      }
    }
    for (const intersect of intersects) {
      intersect.object.material.color.set("#ff0000");
    }
  }

  createSocialMediaControls() {
    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    console.log(this.mousePosition);
    this.rayCaster = new THREE.Raycaster();

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log(this.currentIntersect.object.name);
        switch (this.currentIntersect.object.name) {
          case "TwitterButton":
            break;

          case "LinkedinButton":
            break;

          case "GitButton":
            break;

          case "DiscordButton":
            break;

          case "PlaystoreButton":
            break;
        }
      }
    });
  }

  createLighting() {
    this.light = new THREE.SpotLight(0xdc2f02, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.light.position.set(13, 25, 6);
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

    const rectLight = new THREE.RectAreaLight(0xffffff, 50, 22, 8);
    rectLight.position.set(20, 23, -2);
    this.scene.add(rectLight);
  }
}
