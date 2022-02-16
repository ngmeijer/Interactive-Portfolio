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
  light;
  secondLight;

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

    let portfolioIntro = this.resources.items.PortfolioIntro;
    this.scene.add(portfolioIntro.scene);
    portfolioIntro.scene.position.set(10, -0.1, -3);
  }

  createPortfolioItems() {
    const TWDE_Item = new PortfolioItem(
      "TDWE_Portfolio",
      this.resources.items.TDWE_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(16, 0.8, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const NetherFights_Item = new PortfolioItem(
      "NetherFights",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(20.1, 0.8, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(4, 2.36),
      new THREE.Vector3(3.9, 2.2),
      new THREE.Vector3(24.2, 0.8, -1),
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
    this.light = new THREE.SpotLight(0xffffff, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.light.position.set(20, 5, 6);
    this.light.castShadow = true;
    this.light.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(12, 1, -5);

    this.scene.add(this.light);
    this.scene.add(lightTarget);
    this.scene.add(this.light.target);
    this.light.target = lightTarget;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    this.secondLight = new THREE.SpotLight(0xffffff, 5, 20, Math.PI * 0.3, 0.25, 1);
    this.secondLight.position.set(28, 5, 6);
    this.secondLight.castShadow = true;
    this.secondLight.shadow.far = 30;

    this.scene.add(this.secondLight);
    this.scene.add(lightTarget);
    this.scene.add(this.secondLight.target);
    this.secondLight.target = lightTarget;

    this.secondLight.shadow.mapSize.width = 1024;
    this.secondLight.shadow.mapSize.height = 1024;
  }
}
