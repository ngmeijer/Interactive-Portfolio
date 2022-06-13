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
    const ProcArt_Item = new PortfolioItem(
      "Procedural Art",
      this.resources.items.ProcArt_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(11, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const hiveLife_Item = new PortfolioItem(
      "Hive Life",
      this.resources.items.HiveLife_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(16.5, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const intoTheNight_Item = new PortfolioItem(
      "Into The Night",
      this.resources.items.Shop,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(22, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    const NetherFights_Item = new PortfolioItem(
      "Nether Fights",
      this.resources.items.NetherFights_Image,
      this.resources.items.ElMessiri,
      new THREE.Vector2(5, 2.95),
      new THREE.Vector3(4.875, 2.75),
      new THREE.Vector3(27.5, 0.75, -1),
      this.instructionTextColor,
      this.platformColor
    );

    ProcArt_Item.addToScene(this.scene, this.physicsWorld);
    ProcArt_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(ProcArt_Item);

    hiveLife_Item.addToScene(this.scene, this.physicsWorld);
    hiveLife_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(hiveLife_Item);

    NetherFights_Item.addToScene(this.scene, this.physicsWorld);
    NetherFights_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(NetherFights_Item);

    intoTheNight_Item.addToScene(this.scene, this.physicsWorld);
    intoTheNight_Item.playerInstance = this.playerInstance;
    this.portfolioItems.push(intoTheNight_Item);
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
    this.frontLight.position.set(23, 7, 6);
    this.frontLight.castShadow = true;
    this.frontLight.shadow.far = 30;

    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(17.5, 1, -5);

    this.scene.add(this.frontLight);
    this.scene.add(lightTarget);
    this.scene.add(this.frontLight.target);
    this.frontLight.target = lightTarget;

    this.frontLight.shadow.mapSize.width = 512;
    this.frontLight.shadow.mapSize.height = 512;

    this.bottomLight = new THREE.SpotLight(
      0xdc2f02,
      75,
      20,
      Math.PI * 0.3,
      0.25,
      1
    );
    this.bottomLight.position.set(26, -10, 2);
    this.bottomLight.castShadow = true;
    this.bottomLight.shadow.far = 30;

    this.scene.add(this.bottomLight);
    this.scene.add(lightTarget);
    this.scene.add(this.bottomLight.target);
    this.bottomLight.target = lightTarget;

    this.bottomLight.shadow.mapSize.width = 512;
    this.bottomLight.shadow.mapSize.height = 512;
  }
}
