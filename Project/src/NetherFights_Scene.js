import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "./CubeBody.js";
import Player from "./Player.js";
import Text from "./Text.js";
import { Vector2, Vector3 } from "three";

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

  videoTexture;
  videoContainer;
  videoSource;
  videoIsPlaying;
  playButton;
  pauseButton;
  gitButton;
  currentVideoIndex = 0;
  maxVideoIndex = 2;
  movieMaterial;
  videoSources = ["NetherFights_Gameplay.mp4"];
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

  initalizeScene(pCamera) {
    this.camera = pCamera;
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -12, 0);
    this.createGeneralGeometry();

    this.createPlayer();
    this.createLighting();
    this.createStartText();
    this.createImage();
    this.createVideo();
    this.createVideoControls();
    this.createRepositoryReference();
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

    // const technicalDetailsHeader = new Text(
    //   "Test Header",
    //   this.resources.items.ElMessiri,
    //   0.35,
    //   textCol,
    //   new Vector3(12.5, 7.2, -3)
    // );
    // scene.add(technicalDetailsHeader.mesh);

    // const technicalDetailsText = new Text(
    //   "test paragraph.",
    //   this.resources.items.ElMessiri,
    //   0.2,
    //   textCol,
    //   new Vector3(12.6, 6.5, -3)
    // );
    // scene.add(technicalDetailsText.mesh);
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

    let movieGeometry = new THREE.PlaneGeometry(12, 6.75);
    let movieCubeScreen = new THREE.Mesh(movieGeometry, this.movieMaterial);
    this.add(movieCubeScreen);
    movieCubeScreen.position.set(17, 3.7, -3);
    this.videoContainer.crossOrigin = "anonymous";
    this.videoContainer.load();
    var playPromise = this.videoContainer.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        this.videoContainer.pause();
      });
    }

    this.videoIsPlaying = false;

    const videoPlayerHeader = new Text(
      "Video player",
      this.resources.items.ElMessiri,
      0.3,
      this.instructionTextColor,
      new Vector3(11, 7.2, -3)
    );
    this.add(videoPlayerHeader.mesh);
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
        switch (this.currentIntersect.object.name) {
          case "PlayButton":
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
          case "git":
            window.open(
              "https://github.com/ngmeijer/cplusplus-course/tree/master/SFML%20environment/cpp_assignment"
            );
            break;
        }
      }
    });
  }

  createVideoButtons() {
    this.playButton = this.resources.items.play.clone();
    this.add(this.playButton);
    this.playButton.position.set(10, 2.2, -3);

    this.pauseButton = this.resources.items.pause.clone();
    this.add(this.pauseButton);
    this.pauseButton.position.set(10, 1, -3);
  }

  createVideoTweens() {
    let pausedText = new Text(
      "Paused",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new Vector3(11.1, 0, -3.1)
    );
    this.add(pausedText.mesh);

    let playingText = new Text(
      "Playing",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new Vector3(11.1, 1, -3.1)
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

    const objectsToTest = [this.playButton, this.pauseButton, this.gitButton];
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
