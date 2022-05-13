import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "../CubeBody.js";
import Player from "../Player.js";
import Text from "../Text.js";
import InformationContainer from "../InformationContainer.js";

import { showModal } from "../modal.js";

export default class TDWE_Scene extends THREE.Scene {
  light;

  physicsWorld;
  camera;

  playerInstance;
  playerPosition = new THREE.Vector3(0, 0.5, 1);

  instructionTextColor = 0x9d0208;
  platformColor = 0xe85d04;
  environmentColor = 0x100b13;

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
  mousePosition = new THREE.Vector2();
  currentIntersect;
  currentScene = false;
  externalLinksButtons = [];

  tweensOnPause = [];
  tweensOnPlay = [];

  constructor(pResources) {
    super();
    this.resources = pResources;
  }

  initalizeScene(pCamera) {
    this.camera = pCamera;
    this.rayCaster = new THREE.Raycaster();
    this.physicsWorld = new CANNON.World();
    this.physicsWorld.gravity.set(0, -12, 0);
    this.createGeneralGeometry();

    this.createPlayer();
    this.createLighting();
    this.createStartText();
    this.createImage();
  }

  update(delta) {
    if (!this.currentScene) return;

    this.playerInstance.update(delta);
    this.checkExternalLinksMouseOver();
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
    this.playerInstance.rightBorder = 65;
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
      new THREE.Vector3(30, -3, 1),
      new THREE.Vector3(150, 5, 1)
    );
    this.physicsWorld.addBody(groundBody);

    const groundMesh = this.resources.items.ItemGround.clone();
    this.add(groundMesh);
    groundMesh.position.set(-1.5, -1.25, 1);
  }

  createStartText() {
    {
      const projectDescription = new InformationContainer(
        new THREE.Vector3(3.3, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      projectDescription.headerContent = "Project Description";
      projectDescription.paragraphContent =
        "A normal course (for all roles) in my 2nd year. The assignment" +
        "\nwas tocreate a procedural city, which resembles any of the 4" +
        "\navailable themes. I chose Cyberpunk.";

      projectDescription.createContent();
      this.add(projectDescription.group);
    }

    {
      const teamStructure = new InformationContainer(
        new THREE.Vector3(3.3, 2, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      teamStructure.headerContent = "Team Structure";
      teamStructure.paragraphContent = "1 Artist \n1 Engineer";

      teamStructure.createContent();
      this.add(teamStructure.group);
    }

    {
      const projectDetails = new InformationContainer(
        new THREE.Vector3(3.3, 4.8, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      projectDetails.headerContent = "Project details";
      projectDetails.paragraphContent =
        "Project type: school\n" +
        "Language: C#\n" +
        "Software: Unity 3D\n" +
        "Project duration: 5 weeks";

      projectDetails.createContent();
      this.add(projectDetails.group);
    }

    {
      const gitHeader = new Text(
        "Git repository",
        this.resources.items.ElMessiri,
        0.2,
        this.instructionTextColor,
        new THREE.Vector3(7.6, 5.4, -3)
      );
      this.add(gitHeader.mesh);

      let gitButton = this.resources.items.git.clone();
      this.add(gitButton);
      gitButton.position.set(8.5, 4, -3);
      gitButton.children[0].name = "Git_Repo";
      this.externalLinksButtons.push(gitButton);
    }

    {
      const youtubeHeader = new Text(
        "Trailer",
        this.resources.items.ElMessiri,
        0.2,
        this.instructionTextColor,
        new THREE.Vector3(8, 1.9, -3)
      );
      this.add(youtubeHeader.mesh);

      let youtubeButton = this.resources.items.youtube.clone();
      this.add(youtubeButton);
      youtubeButton.position.set(8.5, 0.6, -3);
      youtubeButton.children[0].name = "Trailer";
      this.externalLinksButtons.push(youtubeButton);
    }

    this.toolBreakdown();
    this.createButtonEventListeners();
  }

  toolBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(12, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Editor tooling";
      systemDescription.paragraphContent =
        "Since I chose the programming direction for this course, I made" +
        "\nan extensive in-editor tool. Below, you can see the different" +
        "\nphases you're going through to generate a city.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }
  }

  createButtonEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    
    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        switch (this.currentIntersect.object.name) {
          case "Trailer":
            showModal("https://www.youtube.com/embed/mhs_hoBcfrw");
            break;

          case "Git_Repo":
            window.open("https://github.com/ngmeijer/Procedural-Art-Course");
            break;
        }
      }
    });
  }

  checkExternalLinksMouseOver() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);

    const objectsToTest = this.externalLinksButtons;
    const intersectedObjects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersectedObjects.length) {
      this.currentIntersect = intersectedObjects[0];
    } else {
      this.currentIntersect = null;
    }
  }

  createImage() {
    const geo = new THREE.PlaneBufferGeometry(13, 7.319);
    const material = new THREE.MeshBasicMaterial({
      map: this.resources.items.ProcArt_Image,
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
        this.videoContainer.pause();
      });
    }

    this.videoIsPlaying = false;
  }

  createLighting() {
    this.light = new THREE.DirectionalLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 4);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
