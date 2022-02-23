import * as THREE from "three";
import CANNON from "cannon";
import TWEEN from "@tweenjs/tween.js";

export default class Player extends THREE.Object3D {
  playerMesh;
  playerBody;
  noseMesh;
  currentPos;
  startPos;
  startRot;
  defaultMoveSpeed;
  currentMoveSpeed = 0;
  jumpForce;
  isJumping;
  movingLeft = false;
  movingRight = false;
  velocity;
  canMove = true;

  delta;
  light;

  tweenScaleIn;
  tweenScaleOut;
  tweenJumpIn;
  tweenJumpOut;
  tweenRotateClock90;
  tweenResetRotate;
  tweenMoveLeft;
  tweenMoveRight;
  tweenMoveIntoZ;
  tweenMoveOutZ;
  tweenMoveToItem;
  originalScale;
  currentScale;

  movingLeftRotation = 3.14159;
  movingRightRotation = 0;
  movingInRotation = 1.5708;

  savedPosition;
  positionLocked = false;
  facingLeft;
  facingRight = true;
  group;
  elevator;
  leftBorder;
  rightBorder;
  currentItemTarget;

  characterMesh;

  constructor(pMoveSpeed, pJumpForce, pPosition, pCharacterMesh) {
    super();
    this.defaultMoveSpeed = pMoveSpeed;
    this.currentPos = pPosition;
    this.startPos = pPosition;
    this.savedPosition = pPosition;
    this.jumpForce = pJumpForce;
    this.characterMesh = pCharacterMesh;

    this.canMove = true;

    this.group = new THREE.Group();

    this.initializeGFX();
    this.initializeBody();
    this.velocity = this.playerBody.velocity;
    this.startRot = this.group.rotation;

    this.boundSetTargetPosition = this.setTargetPosition.bind(this);
    this.prepareTweens();
  }

  update(delta) {
    this.delta = delta;
    this.velocity = this.playerBody.velocity;

    this.handleMovement();

    this.playerBody.quaternion.set(0, 0, 0, 1);
    this.group.position.set(
      this.playerBody.position.x,
      this.playerBody.position.y,
      this.playerBody.position.z
    );

    this.currentPos = this.playerBody.position;
    this.playerBody.velocity = this.velocity;
  }

  createMesh() {}

  resetPlayer() {
    this.playerBody.position.x = this.startPos.x;
    this.playerBody.position.y = this.startPos.y;
    this.playerBody.position.z = this.startPos.z;

    this.canMove = true;
  }

  setTargetPosition() {
    this.tweenMoveIntoZ = new TWEEN.Tween(this.playerBody.position)
      .to(
        {
          x: this.playerBody.position.x,
          y: this.playerBody.position.y,
          z: this.playerBody.position.z - 3,
        },
        1500
      )
      .easing(TWEEN.Easing.Quadratic.InOut);

    this.tweenMoveIntoZ.start();
  }

  prepareTweens() {
    this.tweenFaceCamera = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.group.rotation.y - this.movingInRotation,
          z: this.group.rotation.z,
        },
        1500
      )
      .easing(TWEEN.Easing.Quartic.Out);

    this.tweenRotateClock90 = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.group.rotation.y + this.movingInRotation,
          z: this.group.rotation.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.Out);

    this.tweenMoveLeft = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.group.rotation.y + this.movingLeftRotation,
          z: this.group.rotation.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quartic.Out);

    this.tweenMoveRight = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: this.movingRightRotation,
          z: this.group.rotation.z,
        },
        500
      )
      .easing(TWEEN.Easing.Quartic.Out);
  }

  moveIntoPortfolioItem() {
    this.canMove = false;

    this.tweenMoveToItem = new TWEEN.Tween(this.playerBody.position)
      .to(
        {
          x: this.currentItemTarget.itemPosition.x,
          y: this.playerBody.position.y,
          z: this.playerBody.position.z,
        },
        500
      )
      .onComplete(this.boundSetTargetPosition);

    this.tweenRotateCounter90 = new TWEEN.Tween(this.group.rotation)
      .to(
        {
          x: this.group.rotation.x,
          y: 0,
          z: this.group.rotation.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Quartic.Out)
      .onComplete(this.boundSetTargetPosition);

    this.tweenMoveToItem.chain(this.tweenRotateClock90);
    this.tweenMoveToItem.start();
  }

  handleMovement() {
    if (!this.canMove) return;
    if (!this.movingLeft && !this.movingRight) {
      this.currentMoveSpeed = 0;
      return;
    }

    if (this.playerBody.position.x < this.leftBorder) this.movingLeft = false;
    if (this.playerBody.position.x > this.rightBorder) this.movingRight = false;

    if (this.movingLeft || this.movingRight)
      this.currentMoveSpeed = this.defaultMoveSpeed;

    if (this.movingLeft) {
      if (this.facingRight) this.tweenMoveLeft.start();
      this.movingRight = false;
      this.playerBody.position.x =
        this.playerBody.position.x - this.currentMoveSpeed * this.delta;
      this.hasPlayedLeftAnimation = true;
      this.facingRight = false;
    }
    if (this.movingRight) {
      if (!this.facingRight) this.tweenMoveRight.start();
      this.movingLeft = false;
      this.playerBody.position.x =
        this.playerBody.position.x + this.currentMoveSpeed * this.delta;
      this.facingRight = true;
    }
  }

  handleJump() {
    if (this.velocity.y > -0.2 && this.velocity.y < 0.2) {
      this.velocity.y = this.jumpForce;
      this.isJumping = true;
    } else this.isJumping = false;
  }

  saveCurrentPosition() {
    this.savedPosition = this.playerBody.position;
  }

  initializeGFX() {
    const playerGeo = new THREE.BoxGeometry(0.5, 1, 0.5);
    const playerMat = new THREE.MeshStandardMaterial();
    playerMat.color.setHex(0xf48c06);
    this.playerMesh = new THREE.Mesh(playerGeo, playerMat);
    this.playerMesh.castShadow = true;
    this.playerMesh.receiveShadow = true;
    this.originalScale = this.playerMesh.scale;

    const noseGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const noseMat = new THREE.MeshStandardMaterial();
    noseMat.color.setHex(0xff00000);
    this.noseMesh = new THREE.Mesh(noseGeo, noseMat);

    this.playerMesh.add(this.noseMesh);
    this.noseMesh.position.x += 0.3;
    this.group.add(this.playerMesh);
  }

  initializeBody() {
    const playerShape = new CANNON.Box(new CANNON.Vec3(0.25, 0.5, 0.5));
    this.playerBody = new CANNON.Body({ mass: 1 });
    this.playerBody.addShape(playerShape);
    this.playerBody.position.x = this.startPos.x;
    this.playerBody.position.y = this.startPos.y;
    this.playerBody.position.z = this.startPos.z;
    this.playerBody.restitution = 0;
  }
}
