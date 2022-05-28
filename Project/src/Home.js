import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import CubeBody from "./CubeBody.js";
import Elevator from "./Elevator.js";

export default class Home {
  scene;
  physicsWorld;
  fontLoader;
  eventManager;

  instructionTextColor = 0xffffff;
  platformColor = 0x370617;
  environmentColor = 0x6a040f;

  playerInstance;
  frontLight;
  bottomLight;
  background;
  elevator;
  homeIntro;
  arrowsHorizontal;
  ground;

  constructor(pScene, pPhysicsWorld, pResources, pEventManager) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
    this.eventManager = pEventManager;
  }

  overrideColours() {}

  initializeArea() {
    this.createStartGeometry();
    this.createLighting();
    this.createTweens();
  }

  update() {
    this.elevator.update();
  }

  createStartGeometry() {
    const groundBody = new CubeBody(
      new THREE.Vector3(-1.5, -3, 1),
      new THREE.Vector3(9, 5, 1)
    );
    this.physicsWorld.addBody(groundBody);

    this.ground = this.resources.items.HomeGround.clone();
    this.scene.add(this.ground);
    this.ground.position.set(-2, -1.25, 1);

    this.homeIntro = this.resources.items.HomeIntro.clone();
    this.scene.add(this.homeIntro);
    this.homeIntro.position.set(-8, -0.1, -3);

    this.arrowsHorizontal = this.resources.items.ArrowsHorizontal.clone();
    this.scene.add(this.arrowsHorizontal);
    this.arrowsHorizontal.position.set(-6.3, 1, -2.5);

    // this.background = this.resources.items.CubeBackground.clone();
    // this.scene.add(this.background);
    // this.background.position.set(-20, -10, -9);
    this.elevator = new Elevator(
      new THREE.Vector3(4.5, 0, -2),
      0x6a040f,
      this.eventManager
    );
    this.elevator.createHints(this.resources.items, this.scene);
    this.elevator.addToScene(this.scene, this.physicsWorld);
    this.elevator.playerInstance = this.playerInstance;
  }

  createTweens() {
    const startPosition = this.arrowsHorizontal.position;
    const positionLeft = new THREE.Vector3(
      startPosition.x - 1,
      startPosition.y,
      startPosition.z
    );

    const tweenMoveLeft = new TWEEN.Tween(this.arrowsHorizontal.position)
      .to(
        {
          x: positionLeft.x,
          y: positionLeft.y,
          z: positionLeft.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.InOut);

    const tweenMoveRight = new TWEEN.Tween(this.arrowsHorizontal.position)
      .to(
        {
          x: startPosition.x,
          y: startPosition.y,
          z: startPosition.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.InOut);

    tweenMoveLeft.chain(tweenMoveRight);
    tweenMoveRight.chain(tweenMoveLeft);

    tweenMoveLeft.start();
  }

  createLighting() {
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, 0, 0);

    this.bottomLight = new THREE.SpotLight(
      0xdc2f02,
      20,
      0,
      Math.PI * 0.3,
      1,
      0
    );
    this.bottomLight.position.set(2, -10, -2);
    this.bottomLight.castShadow = true;
    this.bottomLight.shadow.far = 30;

    this.bottomLight.target = lightTarget;
    this.scene.add(lightTarget);
    this.scene.add(this.bottomLight.target);
    this.scene.add(this.bottomLight);

    this.bottomLight.shadow.mapSize.width = 512;
    this.bottomLight.shadow.mapSize.height = 512;

    const backLightTarget = new THREE.Object3D();
    backLightTarget.position.set(0, 1, -5);

    this.frontLight = new THREE.SpotLight(0xffba08, 3, 0, Math.PI, 1, 1);
    this.frontLight.position.set(-10, 5, 10);
    this.frontLight.castShadow = true;
    this.frontLight.shadow.far = 30;

    // this.frontLight.target = this.playerInstance;
    this.scene.add(lightTarget);
    // this.scene.add(this.frontLight.target);
    this.scene.add(this.frontLight);

    this.frontLight.shadow.mapSize.width = 512;
    this.frontLight.shadow.mapSize.height = 512;
  }
}
