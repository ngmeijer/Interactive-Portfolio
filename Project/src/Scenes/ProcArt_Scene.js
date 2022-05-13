import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import CANNON from "cannon";

import CubeBody from "../CubeBody.js";
import Player from "../Player.js";
import Text from "../Text.js";
import InformationContainer from "../InformationContainer.js";
import AnimatedModel from "../AnimatedModel.js";

import { showModal } from "../modal.js";
import Image from "../ImageContainer.js";

export default class TDWE_Scene extends THREE.Scene {
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
    this.name = "Procedural Art";
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
      const exitSceneText = new Text(
        "Press F again at any time to exit the scene",
        this.resources.items.ElMessiri,
        0.2,
        0xffffff,
        new THREE.Vector3(-5.5, -1, 1.8)
      );
      exitSceneText.mesh.castShadow = false;
      this.add(exitSceneText.mesh);
    }

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
      let gitButton = new AnimatedModel(
        "Git_Repo",
        this.resources.items.git.clone(),
        new THREE.Vector3(8.5, 3.5, -3),
        true,
        {
          pHeaderContent: "Git repository",
          pFont: this.resources.items.ElMessiri,
        }
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
        {
          pHeaderContent: "Trailer",
          pFont: this.resources.items.ElMessiri,
        }
      );
      this.externalLinksButtons.push(youtubeButton.group.children[0]);
      this.add(youtubeButton.group);
    }

    this.generalToolBreakdown();
    this.nodeSystemBreakdown();
    this.roadGeneratorBreakdown();
    this.cityBlocksBreakdown();
    this.createButtonEventListeners();
  }

  generalToolBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(12, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Editor tooling";
      systemDescription.paragraphContent =
        "Since I chose the programming direction \nfor this course, I made an extensive \nin-editor tool. On the right, you can see \nthe editor with all available functionality.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    const screenshot = new Image(
      new THREE.Vector2(5, 9),
      new THREE.Vector3(19.8, 3.2, -3),
      this.resources.items.ProcArt_Editor
    );
    this.add(screenshot.mesh);

    {
      let gitButton = new AnimatedModel(
        "Editor",
        this.resources.items.git.clone(),
        new THREE.Vector3(14.5, 3.5, -3),
        true,
        {
          pHeaderContent: "Editor script",
          pFont: this.resources.items.ElMessiri,
        }
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
    }
  }

  nodeSystemBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(23.5, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Node System";
      systemDescription.paragraphContent =
        "As the skeleton of the procedural city, I came up" +
        "\nwith a node-placement system. These nodes represent" +
        "\nthe crossroads/intersections. They can be placed, removed," +
        "\nconnected/disconnected and moved at will.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    const screenshot = new Image(
      new THREE.Vector2(10, 6.19),
      new THREE.Vector3(28.5, 1.7, -3),
      this.resources.items.NodeSystem
    );
    this.add(screenshot.mesh);

    {
      let gitButton = new AnimatedModel(
        "NodeSystem",
        this.resources.items.git.clone(),
        new THREE.Vector3(32.5, 6.2, -3),
        true,
        {
          pHeaderContent: "Main script",
          pFont: this.resources.items.ElMessiri,
        }
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
    }
  }

  roadGeneratorBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(35.5, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "Road Generator";
      systemDescription.paragraphContent =
        "Of course, these intersections have to be \nvisually connected with each other as well. The \nroads are generated on demand, based on the \nrelative direction of the connected node. A road is \nreally just a simple quad, with 2 vertices connected to \nthe 'main node'and 2 vertices to the other node.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    const screenshot = new Image(
      new THREE.Vector2(8, 6),
      new THREE.Vector3(39.5, 1.6, -3),
      this.resources.items.RoadGenerator
    );
    this.add(screenshot.mesh);

    {
      let gitButton = new AnimatedModel(
        "RoadGenerator",
        this.resources.items.git.clone(),
        new THREE.Vector3(42.8, 6.2, -3),
        true,
        {
          pHeaderContent: "Main script",
          pFont: this.resources.items.ElMessiri,
        }
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
    }
  }

  cityBlocksBreakdown() {
    {
      const systemDescription = new InformationContainer(
        new THREE.Vector3(45, 7.3, -3),
        this.resources.items.ElMessiri,
        this.instructionTextColor
      );
      systemDescription.headerContent = "City Blocks";
      systemDescription.paragraphContent =
        "At first, I wanted automatic spawnpoint generation based on the nodes" +
        "\nselected, but I found manual selection was more user-friendly and" +
        "\nallowed for much more flexibility.";

      systemDescription.createContent();
      this.add(systemDescription.group);
    }

    const screenshot = new Image(
      new THREE.Vector2(5, 7),
      new THREE.Vector3(47.5, 2, -3),
      this.resources.items.Spawnpoints
    );
    this.add(screenshot.mesh);

    const screenshot2 = new Image(
      new THREE.Vector2(6, 6),
      new THREE.Vector3(53.5, 1.5, -3),
      this.resources.items.CityBlock
    );
    this.add(screenshot2.mesh);

    {
      let gitButton = new AnimatedModel(
        "CityBlockGenerator",
        this.resources.items.git.clone(),
        new THREE.Vector3(55, 6.2, -3),
        true,
        {
          pHeaderContent: "Main script",
          pFont: this.resources.items.ElMessiri,
        }
      );
      this.externalLinksButtons.push(gitButton.group.children[0]);
      this.add(gitButton.group);
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
            console.log("clicked youtube");
            showModal("https://www.youtube.com/embed/mhs_hoBcfrw");
            break;
          case "Git_Repo":
            window.open("https://github.com/ngmeijer/Procedural-Art-Course");
            break;
          case "Editor":
            window.open(
              "https://github.com/ngmeijer/Procedural-Art-Course/blob/main/Assignments/ProceduralArtCity/Assets/Editor/CityGenerationWindow.cs              "
            );
          case "NodeSystem":
            window.open(
              "https://github.com/ngmeijer/Procedural-Art-Course/blob/main/Assignments/ProceduralArtCity/Assets/Scripts/NodeEditor.cs"
            );
            break;
          case "RoadGenerator":
            window.open(
              "https://github.com/ngmeijer/Procedural-Art-Course/blob/main/Assignments/ProceduralArtCity/Assets/Scripts/RoadGenerator.cs"
            );
            break;
          case "CityBlockGenerator":
            window.open(
              "https://github.com/ngmeijer/Procedural-Art-Course/blob/main/Assignments/ProceduralArtCity/Assets/Scripts/CityBlockGenerator.cs"
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
