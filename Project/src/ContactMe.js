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
    this.createSocialMedia();
  }

  update() {}

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
    let twitter = this.resources.items.twitter;
    this.scene.add(twitter.scene);
    twitter.scene.position.set(17, 22, -6);

    let linkedin = this.resources.items.linkedin;
    this.scene.add(linkedin.scene);
    linkedin.scene.position.set(20, 22, -6);

    let git = this.resources.items.git;
    this.scene.add(git.scene);
    git.scene.position.set(23, 22, -6);

    let discord = this.resources.items.discord;
    this.scene.add(discord.scene);
    discord.scene.position.set(26, 22, -6);

    let playstore = this.resources.items.playstore;
    this.scene.add(playstore.scene);
    playstore.scene.position.set(29, 22, -6);
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
