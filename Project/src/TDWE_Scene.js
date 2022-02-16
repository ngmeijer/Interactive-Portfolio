import * as THREE from "three";
import CANNON from "cannon";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Plane from "./Plane.js";
import Cube from "./Cube.js";
import Player from "./Player.js";
import Text from "./Text.js";
import { Vector3 } from "three";

export default class TDWE_Scene extends THREE.Scene {
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

  playerInstance;
  playerPosition = new THREE.Vector3(0, 0.5, 1);

  instructionTextColor;
  platformColor;
  environmentColor;

  constructor(pResources) {
    super();
    this.resources = pResources;
  }

  initalizeScene() {
    this.physicsWorld = new CANNON.World();
    this.createGeneralGeometry();
    this.physicsWorld.gravity.set(0, -12, 0);

    this.createPlayer();
    this.createLighting();
    this.createStartText();
    this.createImage();
  }

  update(delta) {
    this.playerInstance.update(delta);
  }

  createPlayer() {
    this.playerInstance = new Player(8, 7, this.playerPosition);
    this.physicsWorld.addBody(this.playerInstance.playerBody);
    this.add(this.playerInstance.group);

    this.createMovementInput(this.playerInstance);
    this.playerInstance.leftBorder = -5;
    this.playerInstance.rightBorder = 10;
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

  createGeneralGeometry() {
    let ground = new Plane(
      new THREE.Vector2(80, 50),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-90, 0, 0),
      this.environmentColor,
      true
    );
    this.add(ground.planeMesh);
    this.physicsWorld.addBody(ground.planeBody);

    let background = new Plane(
      new THREE.Vector2(120, 25),
      new THREE.Vector3(0, 0, -25),
      new THREE.Vector3(0, 0, 0),
      0x100b13,
      false
    );
    this.add(background.planeMesh);

    let wall = new Cube(
      "LeftWall",
      new THREE.Vector3(2, 20, 50),
      new THREE.Vector3(-8, 0, 0),
      this.environmentColor,
      true,
      0
    );
    wall.addToScene(this, this.physicsWorld);
  }

  createStartText() {
    let scene = this;
    let textCol = this.instructionTextColor;

    const titleText = new Text(
      "The Day We Escaped",
      this.resources.items.ElMessiri,
      0.7,
      textCol,
      new Vector3(-7, 7, -6)
    );
    scene.add(titleText.mesh);

    const teamStructureHeader = new Text(
      "Team structure:",
      this.resources.items.ElMessiri,
      0.35,
      textCol,
      new Vector3(6.5, 6.3, -6)
    );
    scene.add(teamStructureHeader.mesh);

    const teamStructureText = new Text(
      " 3 Artists \n 2 Designers \n 2 Engineers",
      this.resources.items.ElMessiri,
      0.25,
      textCol,
      new Vector3(6.5, 5.8, -6)
    );
    scene.add(teamStructureText.mesh);
    
    const descriptionText = new Text(
      "The 3rd project in my 2nd year, \nand the first one where we were free to \nmake what we wanted, in every possible creative way.",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(6.5, 4, -6)
    );
    scene.add(descriptionText.mesh);

    const quoteText = new Text(
      "“A first person co-op puzzle game \nwhere the player needs to escape from a Soviet lab, \ntogether with another player. Do your best to \nsolve the puzzles, evade the enemies and get out together. \nYou will really need to rely on each other to find a way out, \nbut is everything as it seems?”",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(6.5, 2.3, -6)
    );
    scene.add(quoteText.mesh);

    const technicalDetailsText = new Text(
      "Technical Details:",
      this.resources.items.ElMessiri,
      0.35,
      textCol,
      new Vector3(15, 6, -6)
    );
    scene.add(technicalDetailsText.mesh);
  }

  createImage() {
    const geo = new THREE.PlaneBufferGeometry(13, 7.319);
    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.TDWE_Image,
    });

    this.image = new THREE.Mesh(geo, material);
    this.add(this.image);
    this.image.castShadow = true;
    this.image.position.x = -0.5;
    this.image.position.y = 3;
    this.image.position.z = -6;
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 30);
    this.light.position.set(0, 7, 2);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
