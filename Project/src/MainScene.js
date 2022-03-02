import * as THREE from "three";
import CANNON from "cannon";

import Home from "./Home.js";
import Portfolio from "./Portfolio.js";
import AboutMe from "./AboutMe.js";
import ContactMe from "./ContactMe.js";
import Player from "./Player.js";

export default class MainScene extends THREE.Scene {
  light;

  homeArea;
  portfolioArea;
  aboutMeArea;
  contactMeArea;
  websiteComponents = [];
  physicsWorld;

  eventManager;
  fontLoader;
  textureLoader;
  resources;
  camera;

  playerInstance;
  playerPosition = new THREE.Vector3(18, 5, 1);

  instructionTextColor;
  platformColor;
  environmentColor;

  elevatorActive = false;

  boundLockPlayer;
  boundUnlockPlayer;

  currentScene = true;

  constructor(pResources) {
    super();
    this.resources = pResources;
    this.boundLockPlayer = this.lockPlayerPosition.bind(this);
    this.boundUnlockPlayer = this.unlockPlayerPosition.bind(this);
  }

  initalizeScene(pCamera) {
    this.camera = pCamera;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -12, 0);
    this.physicsWorld.solver.iterations = 20;

    this.homeArea = new Home(
      this,
      this.physicsWorld,
      this.resources,
      this.eventManager
    );
    this.homeArea.eventManager = this.eventManager;
    this.portfolioArea = new Portfolio(this, this.physicsWorld, this.resources);
    this.aboutMeArea = new AboutMe(this, this.physicsWorld, this.resources);
    this.contactMeArea = new ContactMe(
      this,
      this.physicsWorld,
      this.resources,
      this.camera
    );

    this.websiteComponents.push(this.homeArea);
    this.websiteComponents.push(this.portfolioArea);
    this.websiteComponents.push(this.aboutMeArea);
    this.websiteComponents.push(this.contactMeArea);

    const areaIntros = this.resources.items.AreaIntros;
    this.add(areaIntros);
    areaIntros.position.set(10, -0.1, -3);

    this.createPlayer();

    for (let i = 0; i < this.websiteComponents.length; i++) {
      this.websiteComponents[i].playerInstance = this.playerInstance;
      this.websiteComponents[i].initializeArea();
    }
  }

  update(delta) {
    if (!this.currentScene) return;

    for (let i = 0; i < this.websiteComponents.length; i++) {
      this.websiteComponents[i].update();
    }

    if (this.elevatorActive) {
      let elevatorPos = this.homeArea.elevator.platformBody.position;
      let targetPos = new THREE.Vector3(
        this.playerInstance.playerBody.position.x,
        elevatorPos.y + 1,
        elevatorPos.z
      );
      this.playerInstance.playerBody.position.set(
        targetPos.x,
        targetPos.y,
        targetPos.z
      );
    }
    this.playerInstance.update(delta);
  }

  lockPlayerPosition() {
    this.elevatorActive = true;
    this.playerInstance.canMove = false;
  }

  unlockPlayerPosition() {
    this.elevatorActive = false;
    this.playerInstance.canMove = true;
  }

  createPlayer() {
    this.playerInstance = new Player(
      6,
      7,
      this.playerPosition,
      this.resources.items.characterMesh
    );
    this.physicsWorld.addBody(this.playerInstance.playerBody);
    this.add(this.playerInstance.group);

    this.eventManager.addEventListener(
      "Event_disableMove",
      this.boundLockPlayer
    );
    this.eventManager.addEventListener(
      "Event_enableMove",
      this.boundUnlockPlayer
    );

    this.createMovementInput(this.playerInstance);
    this.playerInstance.leftBorder = -5.5;
    this.playerInstance.rightBorder = 30;
  }

  createMovementInput(pPlayer) {
    document.addEventListener("keydown", function (event) {
      if (event.key == "a" || event.key == "A") {
        pPlayer.movingLeft = true;
      }
      if (event.key == "d" || event.key == "D") {
        pPlayer.movingRight = true;
      }
      if (event.key == " ") {
        pPlayer.handleJump();
      }
    });
    document.addEventListener("keyup", function (event) {
      if (event.key == "a" || event.key == "A") {
        pPlayer.movingLeft = false;
        pPlayer.hasPlayedLeftAnimation = false;
      }
      if (event.key == "d" || event.key == "D") {
        pPlayer.movingRight = false;
        pPlayer.hasPlayedRightAnimation = false;
      }
    });
  }
}
