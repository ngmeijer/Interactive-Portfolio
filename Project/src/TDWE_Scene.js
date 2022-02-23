import * as THREE from "three";
import CANNON from "cannon";

import CubeBody from "./CubeBody.js";
import Player from "./Player.js";
import Text from "./Text.js";
import { MeshBasicMaterial, Vector2, Vector3 } from "three";

export default class TDWE_Scene extends THREE.Scene {
  light;

  homeArea;
  portfolioArea;
  aboutMeArea;
  contactMeArea;
  websiteComponents = [];
  physicsWorld;
  camera;

  eventManager;
  fontLoader;
  textureLoader;

  playerInstance;
  playerPosition = new THREE.Vector3(0, 0.5, 1);

  instructionTextColor;
  platformColor;
  environmentColor;

  videoTexture;
  trailer;
  playButton;
  pauseButton;
  replayButton;
  rayCaster;
  rayDirection;
  mousePosition = new Vector2();
  currentIntersect;
  currentScene = false;

  constructor(pResources) {
    super();
    this.resources = pResources;
  }

  initalizeScene() {
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -12, 0);
    this.createGeneralGeometry();

    this.createPlayer();
    this.createLighting();
    this.createStartText();
    this.createImage();
    this.createVideo();
    this.createVideoControls();
  }

  update(delta) {
    if (!this.currentScene) return;

    this.playerInstance.update(delta);
    this.videoTexture.needsUpdate = true;

    this.checkVideoControlsMouseOver();
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
      new THREE.Vector3(50, 5, 1)
    );
    this.physicsWorld.addBody(groundBody);

    let groundMesh = this.resources.items.Ground;
    this.add(groundMesh.scene);
    groundMesh.scene.position.set(-1.5, -1.5, 0.5);
  }

  createStartText() {
    let scene = this;
    let textCol = this.instructionTextColor;

    const projectDescriptionText = new Text(
      "This was the 3rd project in my 2nd year, and the first" +
        "\none where we were free to make what we wanted, in every possible" +
        "\ncreative way. I mostly worked on AI.",
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
      new Vector3(3.3, 2.6, -3)
    );
    scene.add(teamStructureHeader.mesh);

    const teamStructureText = new Text(
      " 3 Artists \n 2 Designers \n 2 Engineers",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(3.3, 2, -3)
    );
    scene.add(teamStructureText.mesh);

    const quoteText = new Text(
      "“A first person co-op puzzle game \nwhere the player needs to escape from a Soviet lab, \ntogether with another player. Do your best to \nsolve the puzzles, evade the enemies and get out together. \nYou will really need to rely on each other to find a way out, \nbut is everything as it seems?”",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(3.3, 5.5, -3)
    );
    scene.add(quoteText.mesh);

    const projectDetailsHeader = new Text(
      "Project details:",
      this.resources.items.ElMessiri,
      0.3,
      textCol,
      new Vector3(7, 2.58, -3)
    );
    scene.add(projectDetailsHeader.mesh);

    const projectDetailsText = new Text(
      "Project type: school\n" +
        "Language: C#\n" +
        "Software: Unity 3D\n" +
        "Project duration: 3 weeks",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(7.1, 2, -3)
    );
    scene.add(projectDetailsText.mesh);

    const technicalDetailsHeader = new Text(
      "Voxel tool",
      this.resources.items.ElMessiri,
      0.35,
      textCol,
      new Vector3(12.5, 7.2, -3)
    );
    scene.add(technicalDetailsHeader.mesh);

    const technicalDetailsText = new Text(
      "For this project, I developed a prototype voxel tool. It converts \nany 3D (or 2D) space into a grid of voxels, by detecting colliders \nin the scene and saving that collision data, so that any AI agent \n(in the current stage, only flying agents) will be able to calculate \na new path to their target position.",
      this.resources.items.ElMessiri,
      0.2,
      textCol,
      new Vector3(12.6, 6.5, -3)
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
    this.image.position.set(-3.8, 4.15, -3);
  }

  createVideo() {
    this.trailer = document.getElementById("video");
    this.videoTexture = new THREE.VideoTexture(this.trailer);

    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    let movieGeometry = new THREE.PlaneGeometry(8, 4.5);
    let movieCubeScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    this.add(movieCubeScreen);
    movieCubeScreen.position.set(16.5, 2.2, -3);
    this.trailer.crossOrigin = "anonymous";
    this.trailer.play();
    this.trailer.pause();
  }

  createVideoControls() {
    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log(this.currentIntersect.object.name);
        switch (this.currentIntersect.object.name) {
          case "PlayButton":
            this.trailer.play();
            break;

          case "PauseButton":
            this.trailer.pause();
            break;

          case "ReplayButton":
            console.log("click on replayButton");
            break;
        }
      }
    });

    this.rayCaster = new THREE.Raycaster();

    this.playButton = this.resources.items.play;
    this.add(this.playButton.scene);
    this.playButton.scene.position.set(11.5, 3.4, -3);

    this.pauseButton = this.resources.items.pause;
    this.add(this.pauseButton.scene);
    this.pauseButton.scene.position.set(11.5, 2.2, -3);

    this.replayButton = this.resources.items.replay;
    this.add(this.replayButton.scene);
    this.replayButton.scene.position.set(11.5, 1, -3);
  }

  checkVideoControlsMouseOver() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);

    const objectsToTest = [
      this.playButton.scene,
      this.pauseButton.scene,
      this.replayButton.scene,
    ];
    const intersects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersects.length) {
      if (!this.currentIntersect) {
        console.log("mouse enter");
      }

      this.currentIntersect = intersects[0];
    } else {
      if (this.currentIntersect) {
        console.log("mouse leave");
      }

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

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 2);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
