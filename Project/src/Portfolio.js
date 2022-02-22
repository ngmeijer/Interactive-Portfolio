import * as THREE from "three";
import CANNON from "cannon";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import Cube from "./Cube.js";
import PortfolioItem from "./PortfolioItem.js";

export default class Portfolio {
  scene;
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
  frontLight;
  bottomLight;

  canEnterItem;
  nearestItemName;

  constructor(pScene, pPhysicsWorld, pResources) {
    this.scene = pScene;
    this.physicsWorld = pPhysicsWorld;
    this.resources = pResources;
  }

  overrideColours() {}

  initializeArea() {
    this.createPortfolioGeometry();
    this.createPortfolioItems();
    this.createLighting();
  }

  update() {
    this.canEnterItem = false;
    for (let i = 0; i < this.portfolioItems.length; i++) {
      if (this.portfolioItems[i].checkPlayerOnPlatform()) {
        this.canEnterItem = true;
        this.playerInstance.currentItemTarget = this.portfolioItems[i];
      }
    }
  }

  createPortfolioGeometry() {
    let ground = new Cube(
      "Portfolio_Ground",
      new THREE.Vector3(50, 1, 1),
      new THREE.Vector3(31, -1.5, 1),
      this.environmentColor,
      true,
      0
    );

    ground.addToScene(this.scene, this.physicsWorld);

    let backgroundLeft = new Cube(
      "Portfolio_BackgroundLeft",
      new THREE.Vector3(1, 20, 30),
      new THREE.Vector3(6.5, -0.5, -16),
      this.environmentColor,
      true,
      0
    );

    backgroundLeft.addToScene(this.scene, this.physicsWorld);
  }

  createPortfolioItems() {
    const TWDE_Item = new PortfolioItem(
      "TDWE",
      this.resources.items.TDWE_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(16, 0.8, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const NetherFights_Item = new PortfolioItem(
      "NetherFights",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(21.5, 0.8, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(27, 0.8, -1),
      this.instructionTextColor,
      this.platformColor
    );

    TWDE_Item.addToScene(this.scene, this.physicsWorld);
    TWDE_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item);

    NetherFights_Item.addToScene(this.scene, this.physicsWorld);
    NetherFights_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(NetherFights_Item);

    TWDE_Item3.addToScene(this.scene, this.physicsWorld);
    TWDE_Item3.playerInstance = this.playerInstance;
    this.portfolioItems.push(TWDE_Item3);
  }

  createLighting() {
    this.frontLight = new THREE.SpotLight(
      0xDC2F02,
      15,
      20,
      Math.PI * 0.8,
      0.25,
      1
    );
    this.frontLight.position.set(25, 5, 6);
    this.frontLight.castShadow = true;
    this.frontLight.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(17.5, 1, -5);

    this.scene.add(this.frontLight);
    this.scene.add(lightTarget);
    this.scene.add(this.frontLight.target);
    this.frontLight.target = lightTarget;

    this.frontLight.shadow.mapSize.width = 1024;
    this.frontLight.shadow.mapSize.height = 1024;

    this.bottomLight = new THREE.SpotLight(
      0xDC2F02,
      30,
      20,
      Math.PI * 0.3,
      0.25,
      1
    );
    this.bottomLight.position.set(28, -10, 1);
    this.bottomLight.castShadow = true;
    this.bottomLight.shadow.far = 30;

    this.scene.add(this.bottomLight);
    this.scene.add(lightTarget);
    this.scene.add(this.bottomLight.target);
    this.bottomLight.target = lightTarget;

    this.bottomLight.shadow.mapSize.width = 1024;
    this.bottomLight.shadow.mapSize.height = 1024;
  }
}
