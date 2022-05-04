import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "./CubeBody.js";
import Player from "./Player.js";
import Text from "./Text.js";
import InformationContainer from "./InformationContainer.js";
import e from "cors";

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

    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });
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
        "This was the 3rd project in my 2nd year, and the first" +
        "\none where we were free to make what we wanted, in every possible" +
        "\ncreative way. I mostly worked on AI.";

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
      teamStructure.paragraphContent = "3 Artists \n2 Designers \n2 Engineers";

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
        "Project duration: 3 weeks";

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

    this.voxelToolBreakdown();
    this.FSMBreakdown();
    this.createButtonEventListeners();
  }

  voxelToolBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(13, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Voxel Tool";
      systemDescription.paragraphContent =
        "I developed a Unity editor tool, which can be used to calculate a" +
        "\nvoxel area. This 3D grid can be used by (airborne) AI agents to" +
        "\ndetermine where they can fly. That data is saved to a Scriptable" +
        "\nObject, so that it's reusable.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    {
      const youtubeHeader = new Text(
        "Demonstration",
        this.resources.items.ElMessiri,
        0.2,
        this.instructionTextColor,
        new THREE.Vector3(13, 1.9, -3)
      );
      this.add(youtubeHeader.mesh);

      let youtubeButton = this.resources.items.youtube.clone();
      this.add(youtubeButton);
      youtubeButton.position.set(14, 0.6, -3);
      youtubeButton.children[0].name = "VoxelTool_Video";

      this.externalLinksButtons.push(youtubeButton);
    }
  }

  FSMBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(22, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "AI Finite State Machine";
      systemDescription.paragraphContent =
        "Working in tandem with the voxel tool, every AI agent has a" +
        "\ninite State Machine (FSM) instance assigned to them." +
        "\nDepending on external factors and settings for that AI type," +
        "\nan action / new state is determined.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    {
      const youtubeHeader = new Text(
        "Demonstration",
        this.resources.items.ElMessiri,
        0.2,
        this.instructionTextColor,
        new THREE.Vector3(22, 1.9, -3)
      );
      this.add(youtubeHeader.mesh);

      let youtubeButton = this.resources.items.youtube.clone();
      this.add(youtubeButton);
      youtubeButton.position.set(23, 0.6, -3);
      youtubeButton.children[0].name = "FSM_Video";
      this.externalLinksButtons.push(youtubeButton);
    }
  }

  createButtonEventListeners() {
    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        switch (this.currentIntersect.object.name) {
          case "Trailer":
            window.open("https://www.youtube.com/watch?v=vR66tzICYdI");
            break;

          case "Git_Repo":
            window.open(
              "https://github.com/ngmeijer/Project-Show-Off-URP/blob/main-final/Assets/Prototyping/%5B%20ITERATION%205%20%5D%20%5B%20PROTOTYPE%20%5D%20VoxelTool%20%2B%20Pathfinding.prefab.meta"
            );
            break;

          case "VoxelTool_Video":
            window.open("https://www.youtube.com/watch?v=vR66tzICYdI");
            break;

          case "FSM_Video":
            window.open("https://www.youtube.com/watch?v=IdJxNQYtQVk");
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
        switch (this.currentIntersect.object.name) {
          case "PlayButton":
            console.log(this.videoIsPlaying);
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
    this.playButton = this.resources.items.play.clone();
    this.add(this.playButton);
    this.playButton.position.set(11.5, 3.4, -3);

    this.pauseButton = this.resources.items.pause.clone();
    this.add(this.pauseButton);
    this.pauseButton.position.set(11.5, 2.2, -3);

    this.replayButton = this.resources.items.replay.clone();
    this.add(this.replayButton);
    this.replayButton.position.set(11.5, 1, -3);

    this.nextButton = this.resources.items.next.clone();
    this.add(this.nextButton);
    this.nextButton.position.set(17, -0.6, -3);

    this.previousButton = this.resources.items.previous.clone();
    this.add(this.previousButton);
    this.previousButton.position.set(16, -0.6, -3);
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
      this.playButton,
      this.pauseButton,
      this.replayButton,
      this.nextButton,
      this.previousButton,
    ];
    const intersects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }

    for (const intersect of intersects) {
      intersect.object.material.color.set("#00ff00");
    }

    for (const currentObject of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === object))
        console.log(intersect.id);
      currentObject.children[0].material.color.set("#0000ff");
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
