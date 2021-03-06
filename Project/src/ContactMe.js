import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CubeBody from "./CubeBody.js";
import Text from "./Text.js";
import AnimatedModel from "./AnimatedModel.js";

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
  usernameText;

  currentlyHoveringDiscord;

  tweenUsernameDown;
  tweenUsernameUp;

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
    this.createDiscordTween();
  }

  update() {
    this.checkSocialMediaMouseOver();
  }

  createContactMeGeometry() {
    let groundBody = new CubeBody(
      new THREE.Vector3(31, 23, 1),
      new THREE.Vector3(50, 1, 1)
    );
    this.physicsWorld.addBody(groundBody);

    let ground = this.resources.items.ItemGround.clone();
    this.scene.add(ground);
    ground.position.set(11.5, 22.75, 1);
  }

  createSocialMedia() {
    this.twitter = new AnimatedModel(
      "twitter",
      this.resources.items.twitter.clone(),
      new THREE.Vector3(17, 26, -6),
      true,
      0.2
    );
    this.scene.add(this.twitter.group);

    this.linkedin = new AnimatedModel(
      "linkedin",
      this.resources.items.linkedin.clone(),
      new THREE.Vector3(20, 26, -6),
      true,
      0.2
    );
    this.scene.add(this.linkedin.group);

    this.git = new AnimatedModel(
      "git",
      this.resources.items.git.clone(),
      new THREE.Vector3(23, 26, -6),
      true,
      0.2
    );
    this.scene.add(this.git.group);

    this.discord = new AnimatedModel(
      "discord",
      this.resources.items.discord.clone(),
      new THREE.Vector3(26, 26, -6),
      true,
      0.15
    );
    this.scene.add(this.discord.group);

    this.playstore = new AnimatedModel(
      "playstore",
      this.resources.items.playstore.clone(),
      new THREE.Vector3(29, 26, -6),
      true,
      0.15
    );
    this.scene.add(this.playstore.group);
  }

  checkSocialMediaMouseOver() {
    if (this.mousePosition == null) return;
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);
    const objectsToTest = [
      this.twitter.group.children[0],
      this.linkedin.group.children[0],
      this.git.group.children[0],
      this.discord.group.children[0],
      this.playstore.group.children[0],
    ];
    const intersectedObjects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersectedObjects.length) {
      this.currentIntersect = intersectedObjects[0];
    } else {
      this.currentIntersect = null;
    }

    if (intersectedObjects.length) {
      this.currentIntersect = intersectedObjects[0];
    } else {
      this.currentIntersect = null;
    }
  }

  createDiscordTween() {
    this.usernameText = new Text(
      "ActOfRagex#4817",
      this.resources.items.ElMessiri,
      0.18,
      0xffffff,
      new THREE.Vector3(24.95, 26.85, -6)
    );

    this.usernameText.mesh.castShadow = false;
    this.scene.add(this.usernameText.mesh);

    const targetShowTextPosition = new THREE.Vector3(
      this.usernameText.mesh.position.x,
      this.usernameText.mesh.position.y + 0.6,
      this.usernameText.mesh.position.z
    );
    const targetHideTextPosition = new THREE.Vector3(
      this.usernameText.mesh.position.x,
      this.usernameText.mesh.position.y,
      this.usernameText.mesh.position.z
    );

    this.tweenUsernameUp = new TWEEN.Tween(this.usernameText.mesh.position)
      .to(
        {
          x: targetShowTextPosition.x,
          y: targetShowTextPosition.y,
          z: targetShowTextPosition.z,
        },
        150
      )
      .easing(TWEEN.Easing.Linear.None)
      .onComplete();

    this.cameratweenUsernameDown = new TWEEN.Tween(
      this.usernameText.mesh.position
    )
      .to(
        {
          x: targetHideTextPosition.x,
          y: targetHideTextPosition.y,
          z: targetHideTextPosition.z,
        },
        2000
      )
      .easing(TWEEN.Easing.Linear.None)
      .onComplete();
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
            if (!this.currentlyHoveringDiscord) {
              this.tweenUsernameUp.start();
            }
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
    this.light.position.set(13, 29, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(12, 18, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;

    const rectLight = new THREE.RectAreaLight(0xffffff, 8, 22, 8);
    rectLight.position.set(21, 25, -2);
    this.scene.add(rectLight);
  }
}
