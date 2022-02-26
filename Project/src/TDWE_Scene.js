import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
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
  videoContainer;
  videoSource;
  videoIsPlaying;
  playButton;
  pauseButton;
  replayButton;
  nextButton;
  previousButton;
  currentVideoIndex = 0;
  maxVideoIndex = 2;
  movieMaterial;
  videoSources = ["TestVideo.mp4", "Test2Video.mp4", "Test3Video.mp4"];
  rayCaster;
  rayDirection;
  mousePosition = new Vector2();
  currentIntersect;
  currentScene = false;

  tweensOnPause = [];
  tweensOnPlay = [];

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

    const groundMesh = this.resources.items.Ground;
    this.add(groundMesh.scene);
    groundMesh.scene.position.set(-1.5, -1.5, 0.5);
    groundMesh.scene.receiveShadow = true;
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
    this.videoContainer = document.getElementById("videoContainer");
    this.videoSource = document.getElementById("video");
    this.videoSource.setAttribute("src", "Videos/" + this.videoSources[0]);

    this.videoTexture = new THREE.VideoTexture(this.videoContainer);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    let movieGeometry = new THREE.PlaneGeometry(8, 4.5);
    let movieCubeScreen = new THREE.Mesh(movieGeometry, this.movieMaterial);
    this.add(movieCubeScreen);
    movieCubeScreen.position.set(16.5, 2.2, -3);
    this.videoContainer.crossOrigin = "anonymous";
    this.videoContainer.load();
    var playPromise = this.videoContainer.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        console.log(playPromise);
        this.videoContainer.pause();
      });
    }

    this.videoIsPlaying = false;
  }

  createVideoControls() {
    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    this.rayCaster = new THREE.Raycaster();

    this.createVideoButtons();
    this.createVideoTweens();

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log(this.currentIntersect.object.name);
        switch (this.currentIntersect.object.name) {
          case "PlayButton":
            console.log(this.videoIsPlaying)
            if (this.videoIsPlaying) break;
            this.videoContainer.play();
            this.tweensOnPlay[0].start();
            this.tweensOnPlay[1].start();
            this.videoIsPlaying = true;
            break;

          case "PauseButton":
            if (!this.videoIsPlaying) break;
            this.videoContainer.pause();
            this.tweensOnPause[0].start();
            this.tweensOnPause[1].start();
            this.videoIsPlaying = false;
            break;

          case "ReplayButton":
            // this.trailer.reset();
            this.videoContainer.play();
            this.videoContainer.pause();
            break;

          case "NextButton":
            this.currentVideoIndex++;
            this.switchVideo();
            break;

          case "PreviousButton":
            this.currentVideoIndex--;
            this.switchVideo();
            break;
        }
      }
    });
  }

  createVideoButtons() {
    this.playButton = this.resources.items.play;
    this.add(this.playButton.scene);
    this.playButton.scene.position.set(11.5, 3.4, -3);

    this.pauseButton = this.resources.items.pause;
    this.add(this.pauseButton.scene);
    this.pauseButton.scene.position.set(11.5, 2.2, -3);

    this.replayButton = this.resources.items.replay;
    this.add(this.replayButton.scene);
    this.replayButton.scene.position.set(11.5, 1, -3);

    this.nextButton = this.resources.items.next;
    this.add(this.nextButton.scene);
    this.nextButton.scene.position.set(17, -0.6, -3);

    this.previousButton = this.resources.items.previous;
    this.add(this.previousButton.scene);
    this.previousButton.scene.position.set(16, -0.6, -3);
  }

  createVideoTweens() {
    let pausedText = new Text(
      "Paused",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new Vector3(12.6, -0.5, -3.1)
    );
    this.add(pausedText.mesh);

    let playingText = new Text(
      "Playing",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new Vector3(12.6, 0.5, -3.1)
    );
    this.add(playingText.mesh);

    this.tweensOnPause.push(
      new TWEEN.Tween(pausedText.mesh.position).to(
        {
          x: pausedText.mesh.position.x,
          y: pausedText.mesh.position.y - 0.05,
          z: pausedText.mesh.position.z,
        },
        500
      )
    );

    this.tweensOnPause.push(
      new TWEEN.Tween(playingText.mesh.position).to(
        {
          x: playingText.mesh.position.x,
          y: playingText.mesh.position.y + 1,
          z: playingText.mesh.position.z,
        },
        500
      )
    );

    this.tweensOnPlay.push(
      new TWEEN.Tween(playingText.mesh.position).to(
        {
          x: playingText.mesh.position.x,
          y: playingText.mesh.position.y - 1,
          z: playingText.mesh.position.z,
        },
        500,
        500
      )
    );

    this.tweensOnPlay.push(
      new TWEEN.Tween(pausedText.mesh.position).to(
        {
          x: pausedText.mesh.position.x,
          y: pausedText.mesh.position.y + 1,
          z: pausedText.mesh.position.z,
        },
        500,
        500
      )
    );
  }

  switchVideo() {
    if (this.currentVideoIndex < 0) {
      this.currentVideoIndex = this.maxVideoIndex;
    }

    if (this.currentVideoIndex > this.maxVideoIndex) {
      this.currentVideoIndex = 0;
    }
    
    this.videoSource.setAttribute(
      "src",
      "Videos/" + this.videoSources[this.currentVideoIndex]
    );
    this.videoContainer.load();

    console.log(this.videoContainer);

    this.videoTexture.video = this.videoContainer;
    this.movieMaterial.map = this.videoTexture;

    var playPromise = this.videoContainer.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        this.videoContainer.pause();
      });
    }
    this.videoIsPlaying = false;
  }

  checkVideoControlsMouseOver() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);

    const objectsToTest = [
      this.playButton.scene,
      this.pauseButton.scene,
      this.replayButton.scene,
      this.nextButton.scene,
      this.previousButton.scene,
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

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 2);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
