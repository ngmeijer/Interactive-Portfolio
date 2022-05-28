import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "../CubeBody.js";
import Player from "../Player.js";
import Text from "../Text.js";
import InformationContainer from "../InformationContainer.js";
import Image from "../ImageContainer.js";
import AnimatedModel from "../AnimatedModel.js";

import { showModal } from "../modal.js";

export default class NetherFights_Scene extends THREE.Scene {
  light;

  physicsWorld;
  camera;

  playerInstance;
  playerPosition = new THREE.Vector3(20, 0.5, 1);

  instructionTextColor = 0xffffff;
  platformColor = 0xe85d04;
  environmentColor = 0x100b13;

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
    this.name = "Nether Fights";
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

    this.thumbnail = new Image(
      new THREE.Vector2(13, 7.319),
      new THREE.Vector3(-3.8, 4.15, -3),
      this.resources.items.NetherFights_Image
    );
    this.add(this.thumbnail.mesh);

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
        this.instructionTextColor
      );
      projectDescription.headerContent = "Project Description";
      projectDescription.paragraphContent =
        "We were tasked to create a 2D fighter in C++." +
        "\nSince Doom Eternal had just come out," +
        "\nI decided to use that theme.";

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
      teamStructure.paragraphContent = "1 Engineer (me)";

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
        "Language: C++\n" +
        "Libraries: SFML\n" +
        "Project duration: 5 weeks";

      projectDetails.createContent();
      this.add(projectDetails.group);
    }

    {
      let gitButton = new AnimatedModel(
        "Git_Repo",
        this.resources.items.git.clone(),
        new THREE.Vector3(8.5, 3.5, -3),
        true,
        0.15,
        "Git repository",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
    }

    {
      let youtubeButton = new AnimatedModel(
        "Trailer",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(8.5, 0.2, -3),
        true,
        0.15,
        "Trailer",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }

    this.voxelToolBreakdown();
    this.createButtonEventListeners();
  }

  voxelToolBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(12, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Character customization";
      systemDescription.paragraphContent =
        "In this game scene, the player is able to spend points on multiple traits \n" +
        "(Strength, Endurance and Lethality), before going into battle.";

      systemDescription.createContent();
      this.add(systemDescription.group);

      const screenshot = new Image(
        new THREE.Vector2(11, 6.19),
        new THREE.Vector3(17.5, 1.9, -3),
        this.resources.items.CharacterSelection
      );
      this.add(screenshot.mesh);
    }

    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(24, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Fight scene";
      systemDescription.paragraphContent =
        "In the arena, the player can perform multiple actions, which has" +
        "\nan effect on either himself or the enemy. In my prototype, there" +
        "\nis only a total of 2 enemies, a procedural enemy" +
        "\ngeneration/selection system would have been a possible feature.";

      systemDescription.createContent();
      this.add(systemDescription.group);

      const screenshot = new Image(
        new THREE.Vector2(11, 6.19),
        new THREE.Vector3(29.5, 1.9, -3),
        this.resources.items.FightScene
      );
      this.add(screenshot.mesh);
    }

    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(36, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "You Won! Or Failed..?";
      systemDescription.paragraphContent =
        "One of the requirements for the assignment was a score-saving/loading system.";

      systemDescription.createContent();
      this.add(systemDescription.group);

      const screenshot = new Image(
        new THREE.Vector2(11, 6.19),
        new THREE.Vector3(41.5, 1.9, -3),
        this.resources.items.GameOver
      );
      this.add(screenshot.mesh);
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
              "https://github.com/ngmeijer/cplusplus-course/tree/master/SFML%20environment/cpp_assignment/cpp_assignment"
            );
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

  createLighting() {
    this.light = new THREE.DirectionalLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 4);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
  }
}
