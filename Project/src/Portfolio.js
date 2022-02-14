import * as THREE from "three";
import CANNON from "cannon";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Cube from "./Cube.js";
import PortfolioItem from "./PortfolioItem.js";

export default class Portfolio {
  mainScene;
  physicsWorld;
  textureLoader;
  fontLoader;

  playerInstance;

  instructionTextColor;
  platformColor;
  environmentColor;

  portfolioItems = [];
  itemScenes = [];
  itemPhysicsWorlds = [];
  light;

  canEnterItem;
  nearestItemName;

  constructor(pScene, pPhysicsWorld, pResources) {
    this.mainScene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
  }

  overrideColours() {}

  initializeArea() {
    this.createPortfolioGeometry();
    this.createPortfolioText();
    this.createPortfolioItems();
    this.createLighting();
  }

  update() {
    this.canEnterItem = false;
    for (let i = 0; i < this.portfolioItems.length; i++) {
      if (this.portfolioItems[i].checkPlayerOnPlatform()) {
        this.canEnterItem = true;
      }
    }
  }

  createPortfolioGeometry() {
    let ground = new Cube(
      "Portfolio_Ground",
      new THREE.Vector3(50, 1, 50),
      new THREE.Vector3(31, -1.5, -10),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.mainScene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "Portfolio_BackgroundLeft",
      new THREE.Vector3(1, 20, 30),
      new THREE.Vector3(6.5, -0.5, -16),
      this.environmentColor,
      true,
      0
    );

    backgroundLeft.addToScene(this.mainScene, this.physicsWorld);
  }

  createPortfolioText() {
    let scene = this.mainScene;
    let textCol = this.instructionTextColor;
    let textMesh;

    const titleGeo = new TextGeometry("Portfolio", {
      font: this.resources.items.ElMessiri,
      size: 0.7,
      height: 0.01,
    });
    const titleMesh = new THREE.Mesh(titleGeo, [
      new THREE.MeshPhongMaterial({ color: textCol }),
      new THREE.MeshPhongMaterial({ color: textCol }),
    ]);

    titleMesh.position.x = 7;
    titleMesh.position.y = 3;
    titleMesh.position.z = -1;
    titleMesh.castShadow = true;
    scene.add(titleMesh);
  }

  createPortfolioItems() {
    let textCol = this.instructionTextColor;
    let platformCol = this.platformColor;
    let textureLoader = this.textureLoader;

    const TWDE_Item = new PortfolioItem(
      "TDWE_Portfolio",
      this.resources.items.TDWE_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(12, 0.8, 0),
      textCol,
      platformCol
    );

    const NetherFights_Item = new PortfolioItem(
      "NetherFights",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(18, 0.8, 0),
      textCol,
      platformCol
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(24, 0.8, 0),
      textCol,
      platformCol
    );

    TWDE_Item.createImage(textureLoader);
    TWDE_Item.addToScene(this.mainScene, this.physicsWorld);
    TWDE_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item);

    NetherFights_Item.createImage(textureLoader);
    NetherFights_Item.addToScene(this.mainScene, this.physicsWorld);
    NetherFights_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(NetherFights_Item);

    TWDE_Item3.createImage(textureLoader);
    TWDE_Item3.addToScene(this.mainScene, this.physicsWorld);
    TWDE_Item3.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item3);
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 4, 60);
    this.light.position.set(15, 2, 0);
    this.light.castShadow = true;
    this.mainScene.add(this.light);
  }
}
