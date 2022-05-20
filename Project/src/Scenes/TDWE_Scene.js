import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "../CubeBody.js";
import Player from "../Player.js";
import Text from "../Text.js";
import InformationContainer from "../InformationContainer.js";
import AnimatedModel from "../AnimatedModel.js";

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
    this.name = "The Day We Escaped";
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
    this.playerInstance.rightBorder = 65;
    this.playerInstance.sceneName = this.name;
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
        0xffffff
      );
      projectDescription.headerContent = "Project Description";
      projectDescription.paragraphContent =
        "This was the 3rd project in my 2nd year, and the first" +
        "\none where we were completely free to make what we wanted" +
        "\nin every possible creative way. I mostly worked on AI.";

      projectDescription.createContent();
      this.add(projectDescription.group);
    }

    {
      const teamStructure = new InformationContainer(
        new THREE.Vector3(3.3, 2, -3),
        this.resources.items.ElMessiri,
        0xffffff
      );
      teamStructure.headerContent = "Team Structure";
      teamStructure.paragraphContent = "3 Artists \n1 Designer \n2 Engineers";

      teamStructure.createContent();
      this.add(teamStructure.group);
    }

    {
      const projectDetails = new InformationContainer(
        new THREE.Vector3(3.3, 4.8, -3),
        this.resources.items.ElMessiri,
        0xffffff
      );
      projectDetails.headerContent = "Project details";
      projectDetails.paragraphContent =
        "Project type: school\n" +
        "Language: C#\n" +
        "Software: Unity 3D\n" +
        "Project duration: 2 weeks";

      projectDetails.createContent();
      this.add(projectDetails.group);
    }

    {
      let gitButton = new AnimatedModel(
        "Git_Repo",
        this.resources.items.git.clone(),
        new THREE.Vector3(8.5, 4, -3),
        true,
        0.15,
        "Repository",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
    }

    {
      let youtubeButton = new AnimatedModel(
        "Trailer",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(8.5, 0.6, -3),
        true,
        0.15,
        "Trailer",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }

    this.aiSystemBreakdown();
    this.fovViewBreakdown();
    this.createButtonEventListeners();
  }

  aiSystemBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(13, 7.3, -3),
        this.resources.items.ElMessiri,
        0xffffff
      );
      systemDescription.headerContent = "AI System";
      systemDescription.paragraphContent =
        "I worked on a navmesh-based AI system. The agents roam around the" +
        "\nmap. Combined with the Field of View system, they are always on" +
        "\non the lookout for the players.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    {
      let youtubeButton = new AnimatedModel(
        "Demonstration",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(14, 0.6, -3),
        true,
        0.15,
        "VoxelTool_Video",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }
  }

  fovViewBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(22, 7.3, -3),
        this.resources.items.ElMessiri,
        0xffffff
      );
      systemDescription.headerContent = "FOV View";
      systemDescription.paragraphContent =
        "Working together with the voxel tool, every AI agent has a" +
        "\ninite State Machine (FSM) instance assigned to them." +
        "\nDepending on external factors and settings for that AI type," +
        "\nan action / new state is determined.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    {
      let youtubeButton = new AnimatedModel(
        "Demonstration",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(23.5, 0.6, -3),
        true,
        0.15,
        "FSM_Video",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }
  }

  createButtonEventListeners() {
    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        switch (this.currentIntersect.object.name) {
          case "Trailer":
            showModal("https://www.youtube.com/embed/vR66tzICYdI");
            break;

          case "Git_Repo":
            window.open(
              "https://github.com/ngmeijer/Project-Show-Off-URP/blob/main-final/Assets/Prototyping/%5B%20ITERATION%205%20%5D%20%5B%20PROTOTYPE%20%5D%20VoxelTool%20%2B%20Pathfinding.prefab.meta"
            );
            break;

          case "VoxelTool_Video":
            showModal("https://www.youtube.com/embed/IdJxNQYtQVk");
            break;

          case "FSM_Video":
            showModal("https://www.youtube.com/embed/IdJxNQYtQVk");
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

  createLighting() {
    this.light = new THREE.DirectionalLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 4);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
