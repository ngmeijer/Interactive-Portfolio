import * as THREE from "three";
import { Vector3 } from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

import Cube from "./Cube.js";
import CubeBody from "./CubeBody.js";
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
  newScene;

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
        this.newScene = this.portfolioItems[i].ID;
      }
    }
  }

  createPortfolioGeometry() {
    let groundBody = new CubeBody(
      new Vector3(31, -1, 1),
      new Vector3(50, 1, 1)
    );
    this.physicsWorld.addBody(groundBody);

    let ground = this.resources.items.ItemGround.clone();
    this.scene.add(ground);
    ground.position.set(11.5, -1.25, 1);
  }

  createPortfolioItems() {
    const TWDE_Item = new PortfolioItem(
      "TDWE",
      this.resources.items.TDWE_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(16, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const NetherFights_Item = new PortfolioItem(
      "NetherFights",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(21.5, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const TWDE_Item3 = new PortfolioItem(
      "TDWE",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(27, 0.75, -1),
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
      0xdc2f02,
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
      0xdc2f02,
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

    const rectLight = new THREE.RectAreaLight(0xffffff, 2, 22, 8);
    rectLight.position.set(15, 3, 2);
    //this.scene.add(rectLight);

    const helper = new RectAreaLightHelper(rectLight);
    rectLight.add(helper);
  }
}
