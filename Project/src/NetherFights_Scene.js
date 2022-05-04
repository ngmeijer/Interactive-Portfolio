import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "./CubeBody.js";
import Player from "./Player.js";
import Text from "./Text.js";
import { Vector2, Vector3 } from "three";
import VideoPlayer from "./VideoPlayer.js";

export default class NetherFights_Scene extends THREE.Scene {
  light;

  homeArea;
  portfolioArea;
  aboutMeArea;
  contactMeArea;
  websiteComponents = [];
  physicsWorld;
  camera;

  eventManager;

  playerInstance;
  playerPosition = new THREE.Vector3(15, 0.5, 1);

  instructionTextColor = 0x9d0208;
  platformColor = 0xe85d04;
  environmentColor = 0x100b13;

  gitButton;
  videoPlayer;
  videoSources = ["NetherFights_Gameplay.mp4"];
  rayCaster;
  mousePosition = new Vector2();
  currentIntersect;
  currentScene = false;

  constructor(pResources) {
    super();
    this.resources = pResources;
    this.rayCaster = new THREE.Raycaster();
  }

  initalizeScene(pCamera) {
    this.camera = pCamera;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -12, 0);
    this.createGeneralGeometry();

    this.createPlayer();
    this.createLighting();
    this.createStartText();
    this.createImage();
    //this.createVideo();
    this.createRepositoryReference();
  }

  update(delta) {
    if (!this.currentScene) return;

    this.playerInstance.update(delta);

    this.videoPlayer.checkVideoControlsMouseOver();
  }

  createPlayer() {
    this.playerInstance = new Player(
      8,
      7,
      this.playerPosition,
      this.resources.items.characterMesh
    );
    this.physicsWorld.addBody(this.playerInstance.playerBody);
    this.add(this.playerInstance.group);

    this.createMovementInput(this.playerInstance);
    this.playerInstance.leftBorder = -6;
    this.playerInstance.rightBorder = 35;
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
    let groundBody = new CubeBody(
      new THREE.Vector3(10, -3, 1),
      new THREE.Vector3(100, 5, 1)
    );
    this.physicsWorld.addBody(groundBody);

    const groundMesh = this.resources.items.ItemGround.clone();;
    this.add(groundMesh);
    groundMesh.position.set(-1.5, -1.5, 0.5);
    groundMesh.receiveShadow = true;
  }

  createStartText() {
    let scene = this;
    let textCol = this.instructionTextColor;

    const projectDescriptionText = new Text(
      "The end product of the C++ course in my 2nd year. I had \njust bought Doom Eternal around that time" +
        "and I quite like \nits atmosphere, so I wanted to do something with the theme. " +
        "\nWith that in mind, I wrote a small 2D fighter game.",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(3.3, 7.3, -3)
    );
    scene.add(projectDescriptionText.mesh);

    const teamStructureHeader = new Text(
      "Team structure:",
      this.resources.items.ElMessiri,
      0.3,
      textCol,
      new Vector3(3.3, 4.3, -3)
    );
    scene.add(teamStructureHeader.mesh);

    const teamStructureText = new Text(
      " 1 Engineer (me)",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(3.3, 3.7, -3)
    );
    scene.add(teamStructureText.mesh);

    const projectDetailsHeader = new Text(
      "Project details:",
      this.resources.items.ElMessiri,
      0.3,
      textCol,
      new Vector3(3.3, 2.7, -3)
    );
    scene.add(projectDetailsHeader.mesh);

    const projectDetailsText = new Text(
      "Project type: school\n" +
        "Language: C++\n" +
        "Software & libraries: Visual Studio, SFML\n" +
        "Project duration: 5 weeks",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(3.3, 2.2, -3)
    );
    scene.add(projectDetailsText.mesh);
  }

  createImage() {
    const geo = new THREE.PlaneBufferGeometry(13, 7.319);
    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.NetherFights_Image,
    });

    this.image = new THREE.Mesh(geo, material);
    this.add(this.image);
    this.image.castShadow = true;
    this.image.position.set(-3.8, 4.15, -3);
  }

  createVideo() {
    this.videoPlayer = new VideoPlayer(new Vector3(17,3.7, -3), this.videoSources, this.rayCaster, this.camera, this.resources);
    this.add(this.videoPlayer.group);
  }

  createRepositoryReference() {
    this.gitButton = this.resources.items.git.clone();;
    this.add(this.gitButton);
    this.gitButton.position.set(25, 5.8, -3);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 100);
    this.light.position.set(0, 7, 2);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
