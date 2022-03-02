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

  constructor(pScene, pPhysicsWorld, pResources, pCamera) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
    this.camera = pCamera;
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
      new THREE.Vector3(50, 3, 2),
      new THREE.Vector3(31, 20.5, 0.75),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.scene, this.physicsWorld);
  }

  createSocialMedia() {
    this.twitter = this.resources.items.twitter;
    this.scene.add(this.twitter);
    this.twitter.position.set(17, 26, -6);

    this.linkedin = this.resources.items.linkedin;
    this.scene.add(this.linkedin);
    this.linkedin.position.set(20, 26, -6);

    this.git = this.resources.items.git.clone();
    this.scene.add(this.git);
    this.git.position.set(23, 26, -6);

    this.discord = this.resources.items.discord;
    this.scene.add(this.discord);
    this.discord.position.set(26, 26, -6);

    this.playstore = this.resources.items.playstore;
    this.scene.add(this.playstore);
    this.playstore.position.set(29, 26, -6);
  }

  checkSocialMediaMouseOver() {
    if (this.mousePosition == null) return;
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const objectsToTest = [
      this.twitter,
      this.linkedin,
      this.git,
      this.discord,
      this.playstore,
    ];
    const intersects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }

    for (const currentObject of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === currentObject)) {
        currentObject.children[0].material.color.set("#DC2F02");
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

    this.rayCaster = new THREE.Raycaster();

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        switch (this.currentIntersect.object.name) {
          case "twitter":
            window.open("https://twitter.com/NilsGMeijer");
            break;
          case "linkedin":
            window.open("https://www.linkedin.com/in/nilsmeijer1/");
            break;

          case "git":
            window.open("https://github.com/ngmeijer");
            break;

          case "discord":
            break;

          case "playstore":
            window.open(
              "https://play.google.com/store/apps/developer?id=Alpha+Foundry"
            );
            break;
        }
      }
    });
  }

  createLighting() {
    this.light = new THREE.SpotLight(0xdc2f02, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.light.position.set(13, 27, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(12, 18, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    const rectLight = new THREE.RectAreaLight(0xffffff, 50, 22, 8);
    rectLight.position.set(20, 25, -2);
    this.scene.add(rectLight);
  }
}
