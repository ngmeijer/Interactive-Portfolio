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
      this.hintText.mesh.position.y + 1.5,
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
    //Vertical walls = left & right;
    //Horizontal walls = top & bottom;
    this.verticalWallWidth = this.outerSize.x - this.innerSize.x;
    this.verticalWallHeight = this.outerSize.y;

    this.horizontalWallHeight = this.outerSize.y - this.innerSize.y;

    const cubeGeoLeft = new THREE.BoxGeometry(
      this.verticalWallWidth,
      this.verticalWallHeight,
      0.2
    );
    const cubeGeoRight = cubeGeoLeft;

    const cubeGeoTop = new THREE.BoxGeometry(
      this.outerSize.x,
      this.horizontalWallHeight,
      0.2
    );

    const material = new THREE.MeshPhongMaterial({
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0,
    });
    material.color.setHex(this.platformColour);

    this.meshLeft = new THREE.Mesh(cubeGeoLeft, material);
    this.meshRight = new THREE.Mesh(cubeGeoRight, material);
    this.meshTop = new THREE.Mesh(cubeGeoTop, material);

    this.meshLeft.position.x =
      this.itemPosition.x - this.outerSize.x / 2 + this.verticalWallWidth / 2;
    this.meshLeft.position.y = this.itemPosition.y;
    this.meshLeft.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshRight.position.x =
      this.itemPosition.x + this.outerSize.x / 2 + this.verticalWallWidth / 2;
    this.meshRight.position.y = this.itemPosition.y;
    this.meshRight.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshTop.position.x = this.itemPosition.x;
    this.meshTop.position.y =
      this.itemPosition.y +
      this.outerSize.y / 2 -
      this.horizontalWallHeight / 2;
    this.meshTop.position.z = this.itemPosition.z + this.imageOffset.z;

    this.meshLeft.castShadow = false;
    this.meshLeft.receiveShadow = true;

    this.meshRight.castShadow = false;
    this.meshRight.receiveShadow = true;

    this.meshTop.castShadow = false;
    this.meshTop.receiveShadow = true;
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
      new THREE.Vector3(1,5,3),
      new THREE.Vector3(
        this.itemPosition.x,
        this.itemPosition.y - 6.4,
        this.itemPosition.z
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
    pScene.add(this.meshLeft);
    pScene.add(this.meshRight);
    pScene.add(this.meshTop);
    pScene.add(this.bridge.mesh);
    //pPhysicsWorld.add(this.bridge.body);

    pScene.add(this.image.mesh);

    pScene.add(this.hintText.mesh);
  }
}
