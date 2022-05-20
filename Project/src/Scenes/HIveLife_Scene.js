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

export default class HiveLife_Scene extends THREE.Scene {
  light;

  physicsWorld;
  camera;

  playerInstance;
  playerPosition = new THREE.Vector3(0, 0.5, 1);

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
    this.name = "Hive Life";
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
      this.resources.items.HiveLife_Image
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
        "The final project in my 2nd year." +
        "\nOne where we were completely free to make what we wanted," +
        "\nin every possible creative way. I mostly worked on AI.";

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
      teamStructure.paragraphContent = "3 Artists \n1 Designer \n2 Engineers";

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
        "Project duration: 8 weeks";

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
        "VoxelTool_Video",
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
    this.minecraftBreakdown();
    this.fsmBreakdown();
    this.createButtonEventListeners();
  }

  voxelToolBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(12, 7.3, -3),
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

    const screenshot = new Image(
      new THREE.Vector2(11, 6.19),
      new THREE.Vector3(17.5, 1.9, -3),
      this.resources.items.VoxelTool_Prototype
    );
    this.add(screenshot.mesh);

    {
      let youtubeButton = new AnimatedModel(
        "VoxelTool_Video",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(21.5, 6, -3),
        true,
        0.15,
        "Demonstration",
        this.resources.items.ElMessiri
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }
  }

  minecraftBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(24.5, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Minecraft Prototype";
      systemDescription.paragraphContent =
        "Extending on my voxel tool, I worked on a very basic minecraft" +
        "\nprototype in my free time because I saw some potential" +
        "\nbesides the AI functionality. You're able to generate a" +
        "\nterrain (just 1 block deep, with the 2D dimensions of" +
        "\nthe grid) and place & remove blocks on that terrain.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    const screenshot = new Image(
      new THREE.Vector2(11, 6.19),
      new THREE.Vector3(30, 1.9, -3),
      this.resources.items.Minecraft_Prototype
    );
    this.add(screenshot.mesh);

    {
      let youtubeButton = new AnimatedModel(
        "Minecraft_Prototype",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(34, 6, -3),
        true,
        0.15,
        "Demonstration",
        this.resources.items.ElMessiri
      );

      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }
  }

  fsmBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(38, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Finite State Machine";
      systemDescription.paragraphContent =
        "Working together with the voxel tool, every AI agent has a" +
        "\nFinite State Machine (FSM) instance assigned to them." +
        "\nDepending on external factors and settings for that AI type," +
        "\nan action / new state is determined.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    {
      let youtubeButton = new AnimatedModel(
        "FSM_Video",
        this.resources.items.youtube.clone(),
        new THREE.Vector3(47, 6, -3),
        true,
        0.15,
        "Demonstration",
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
              "https://github.com/ngmeijer/CodeLibrary/tree/Voxel-AI/CodeAssets/Voxel%20Tool"
            );
            break;

          case "VoxelTool_Video":
            showModal("https://www.youtube.com/embed/HvZZfY2vVEs");
            break;

          case "Minecraft_Prototype":
            showModal("https://www.youtube.com/embed/F1ENdT8DLRE");
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

  createLighting() {
    this.light = new THREE.DirectionalLight(0xffba08, 10, 50);
    this.light.position.set(0, 7, 4);
    this.light.castShadow = true;
    this.add(this.light);
    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;
  }
}
