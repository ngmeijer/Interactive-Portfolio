import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CubeBody from "./CubeBody.js";
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
    this.twitter = this.resources.items.twitter.clone();
    this.scene.add(this.twitter);
    this.twitter.position.set(17, 26, -6);

    this.linkedin = this.resources.items.linkedin.clone();
    this.scene.add(this.linkedin);
    this.linkedin.position.set(20, 26, -6);

    this.git = this.resources.items.git.clone();
    this.scene.add(this.git);
    this.git.position.set(23, 26, -6);

    this.discord = this.resources.items.discord.clone();
    this.scene.add(this.discord);
    this.discord.position.set(26, 26, -6);

    this.playstore = this.resources.items.playstore.clone();
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

  createDiscordTween() {
    this.usernameText = new Text(
      "ActOfRagex#4817",
      this.resources.items.ElMessiri,
      0.23,
      0xffffff,
      new THREE.Vector3(24.65, 27, -6)
    );

    this.usernameText.mesh.castShadow = false;
    this.scene.add(this.usernameText.mesh);

    const targetShowTextPosition = new THREE.Vector3(
      this.usernameText.mesh.position.x,
      this.usernameText.mesh.position.y + 0.5,
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
            if(!this.currentlyHoveringDiscord){
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

    const rectLight = new THREE.RectAreaLight(0xffffff, 10, 22, 8);
    rectLight.position.set(20, 25, -2);
    this.scene.add(rectLight);
  }
}
