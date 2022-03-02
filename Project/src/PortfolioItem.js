import TWEEN, { Tween } from "@tweenjs/tween.js";
import * as THREE from "three";
import { Vector2, Vector3 } from "three";
import Cube from "./Cube.js";
import Image from "./Image.js";
import Text from "./Text.js";

export default class PortfolioItem extends THREE.Object3D {
  ID;
  itemPosition;
  outerSize;
  meshLeft;
  meshRight;
  meshTop;
  meshBottom;
  platform;
  bridge;
  textColour;
  platformColour;
  file;
  imageOffset;
  textureLoader;
  hintText;
  textVisible;
  tweenTextShow;
  tweenTextHide;
  playerInstance;
  playerInRange;

  background;

  verticalWallWidth;
  verticalWallHeight;

  horizontalWallWidth;
  horizontalWallHeight;

  shouldCreatePlatform;

  customFont;

  constructor(
    pID,
    pFile,
    pFont,
    pOuterSize,
    pInnerSize,
    pPosition,
    pTextColour,
    pPlatformColour,
    pCreatePlatform = true
  ) {
    super();
    this.ID = pID;
    this.file = pFile;
    this.font = pFont;
    this.itemPosition = pPosition;
    this.outerSize = pOuterSize;
    this.innerSize = pInnerSize;
    this.textColour = pTextColour;
    this.platformColour = pPlatformColour;
    this.shouldCreatePlatform = pCreatePlatform;

    this.imageOffset = new THREE.Vector3(0, 0, -0.5);

    this.createText();
    this.createPlatform();
    this.createFrame();
    this.createImage();

    const targetShowTextPosition = new THREE.Vector3(
      this.hintText.mesh.position.x,
      this.hintText.mesh.position.y + 1.7,
      this.hintText.mesh.position.z + 1
    );
    const targetHideTextPosition = new THREE.Vector3(
      this.hintText.mesh.position.x,
      this.hintText.mesh.position.y,
      this.hintText.mesh.position.z
    );

    this.tweenTextShow = new Tween(this.hintText.mesh.position)
      .to(
        {
          x: targetShowTextPosition.x,
          y: targetShowTextPosition.y,
          z: targetShowTextPosition.z,
        },
        300
      )
      .easing(TWEEN.Easing.Quartic.InOut);

    this.tweenTextHide = new Tween(this.hintText.mesh.position)
      .to(
        {
          x: targetHideTextPosition.x,
          y: targetHideTextPosition.y,
          z: targetHideTextPosition.z,
        },
        300
      )
      .easing(TWEEN.Easing.Quartic.InOut);
  }

  createFrame() {
    this.background = new Cube(
      this.ID + "_Platform",
      new THREE.Vector3(5.2, 3, 0.1),
      new THREE.Vector3(
        this.itemPosition.x,
        this.itemPosition.y - 1.5,
        this.itemPosition.z - 0.55
      ),
      0x000000,
      true,
      0
    );
  }

  createImage() {
    this.image = new Image(
      new Vector2(this.innerSize.x, this.innerSize.y),
      new Vector3(
        this.itemPosition.x,
        this.itemPosition.y,
        this.itemPosition.z + this.imageOffset.z
      ),
      this.file
    );
  }

  createPlatform() {
    this.platform = new Cube(
      this.ID + "_Platform",
      new THREE.Vector3(this.outerSize.x + 0.1 * this.outerSize.x, 0.15, 8),
      new THREE.Vector3(
        this.itemPosition.x,
        this.itemPosition.y - 1.15,
        this.itemPosition.z
      ),
      this.platformColour,
      true,
      0
    );

    this.platform.mesh.castShadow = false;

    this.bridge = new Cube(
      this.ID + "_Bridge",
      new THREE.Vector3(1, 5, 6),
      new THREE.Vector3(
        this.itemPosition.x,
        this.itemPosition.y - 6.37,
        this.itemPosition.z - 1.9
      ),
      0x363636,
      true,
      0
    );
  }

  createText() {
    this.hintText = new Text(
      "Press F",
      this.font,
      0.3,
      0xffffff,
      new Vector3(
        this.itemPosition.x - 0.8,
        this.itemPosition.y,
        this.itemPosition.z - 2
      )
    );

    this.hintText.mesh.castShadow = false;
  }

  checkPlayerOnPlatform() {
    let playerDistance = this.playerInstance.currentPos.distanceTo(
      this.itemPosition
    );

    if (playerDistance < 2.9) {
      this.playerInRange = true;
      if (!this.textVisible) this.startTextShowAnimation();
    } else {
      this.playerInRange = false;
      if (this.textVisible) this.startTextHideAnimation();
    }

    return this.playerInRange;
  }

  startTextShowAnimation() {
    this.textVisible = true;
    this.tweenTextShow.start();
  }

  startTextHideAnimation() {
    this.textVisible = false;
    this.tweenTextHide.start();
  }

  addToScene(pScene, pPhysicsWorld) {
    pScene.add(this.background.mesh);
    pScene.add(this.bridge.mesh);
    pPhysicsWorld.add(this.bridge.body);

    pScene.add(this.image.mesh);

    pScene.add(this.hintText.mesh);
  }
}
