import TWEEN, { Tween } from "@tweenjs/tween.js";
import * as THREE from "three";
import { Group, Vector2, Vector3 } from "three";
import Cube from "./Cube.js";
import Image from "./ImageContainer.js";
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

  popupGroup;
  popupText;
  nameText;
  textVisible;
  tweenTextShow;
  tweenTextHide;
  playerInstance;
  playerInRange;

  imageCanvas;

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
    this.popupGroup = new THREE.Group();

    this.createText();
    this.createPlatform();
    this.createFrame();
    this.createImage();

    const targetShowTextPosition = new THREE.Vector3(
      this.popupGroup.position.x,
      this.popupGroup.position.y + 1.7,
      this.popupGroup.position.z
    );
    const targetHideTextPosition = new THREE.Vector3(
      this.popupGroup.position.x,
      this.popupGroup.position.y,
      this.popupGroup.position.z
    );

    this.tweenTextShow = new Tween(this.popupGroup.position)
      .to(
        {
          x: targetShowTextPosition.x,
          y: targetShowTextPosition.y,
          z: targetShowTextPosition.z,
        },
        300
      )
      .easing(TWEEN.Easing.Quartic.InOut);

    this.tweenTextHide = new Tween(this.popupGroup.position)
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
    this.imageCanvas = new Cube(
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
    this.imageCanvas.mesh.castShadow = false;
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
    this.popupText = new Text(
      "Press F to enter",
      this.font,
      0.3,
      0xffffff,
      new Vector3(-1.5, 0, 0)
    );

    this.popupText.mesh.castShadow = false;

    this.popupGroup.add(this.popupText.mesh);

    this.nameText = new Text(
      this.ID,
      this.font,
      0.3,
      0xffffff,
      new Vector3(0, 0.75, 0)
    );

    this.nameText.geo.computeBoundingBox();
    this.nameText.geo.center();
    this.nameText.mesh.castShadow = false;

    this.popupGroup.add(this.nameText.mesh);

    this.popupGroup.position.set(
      this.itemPosition.x,
      this.itemPosition.y,
      this.itemPosition.z - 1
    );
  }

  checkPlayerOnPlatform() {
    let playerDistance = this.playerInstance.currentPos.distanceTo(
      this.itemPosition
    );

    if (playerDistance < 3.5) {
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
    pScene.add(this.imageCanvas.mesh);
    pScene.add(this.image.mesh);
    pScene.add(this.bridge.mesh);
    pPhysicsWorld.add(this.bridge.body);

    pScene.add(this.popupGroup);
  }
}
