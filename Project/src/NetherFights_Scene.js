import Plane from "./Plane.js";
import Cube from "./Cube.js";
import Player from "./Player.js";

export default class NetherFights_Scene extends THREE.Scene {
  light;

  homeArea;
  portfolioArea;
  aboutMeArea;
  contactMeArea;
  websiteComponents = [];
  physicsWorld;

  eventManager;
  fontLoader;
  textureLoader;

  playerInstance;
  playerPosition = new THREE.Vector3(0, 0.5, 1);

  instructionTextColor;
  platformColor;
  environmentColor;

  constructor(pFontLoader, pTextureLoader) {
    super();
    this.fontLoader = pFontLoader;
    this.textureLoader = pTextureLoader;
    this.imageFileName = "NetherFigts";
  }

  initalizeScene() {
    this.physicsWorld = new CANNON.World();
    this.createGeneralGeometry();
    this.physicsWorld.gravity.set(0, -12, 0);

    this.createPlayer();
    this.createLighting();
    //this.createStartText();
    this.createImage();
  }

  update(delta) {
    this.playerInstance.update(delta);
  }

  createPlayer() {
    this.playerInstance = new Player(8, 7, this.playerPosition);
    this.physicsWorld.addBody(this.playerInstance.playerBody);
    this.add(this.playerInstance.group);

    this.createMovementInput(this.playerInstance);
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
    let ground = new Plane(
      new THREE.Vector2(40, 50),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-90, 0, 0),
      this.environmentColor,
      true
    );
    this.add(ground.planeMesh);
    this.physicsWorld.addBody(ground.planeBody);

    let background = new Plane(
      new THREE.Vector2(120, 25),
      new THREE.Vector3(0, 0, -25),
      new THREE.Vector3(0, 0, 0),
      0x100b13,
      false
    );
    this.add(background.planeMesh);

    let wall = new Cube(
        "LeftWall",
        new THREE.Vector3(2, 20, 50),
        new THREE.Vector3(-8, 0, 0),
        this.environmentColor,
        true,
        0
      );
      wall.addToScene(this, this.physicsWorld);
  }

  createStartText() {
    let scene = this;
    let textCol = this.instructionTextColor;

    this.fontLoader.load(
      "../Fonts/El_Messiri_SemiBold_Regular.json",

      function (font) {
        const titleGeo = new THREE.TextGeometry("PortfolioItem_Name", {
          font: font,
          size: 0.7,
          height: 0.01,
        });
        const titleMesh = new THREE.Mesh(titleGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        titleMesh.position.x = -7;
        titleMesh.position.y = 7;
        titleMesh.position.z = -6;
        titleMesh.castShadow = true;
        scene.add(titleMesh);

        const hintGeo = new THREE.TextGeometry(
          "This is still a WIP... \nKeep an eye out for it ;)",
          { font: font, size: 0.4, height: 0.01 }
        );
        const hintMesh = new THREE.Mesh(hintGeo, [
          new THREE.MeshPhongMaterial({ color: textCol }),
          new THREE.MeshPhongMaterial({ color: textCol }),
        ]);

        hintMesh.position.x = -7;
        hintMesh.position.y = 1;
        hintMesh.position.z = -6;
        hintMesh.castShadow = true;
        scene.add(hintMesh);
      }
    );
  }

  createImage(){
    const geo = new THREE.PlaneBufferGeometry(
        10,
        5.63
      );
      const material = new THREE.MeshBasicMaterial({
        map: this.textureLoader.load(`../Images/` + this.imageFileName + ".png"),
      });
  
      this.image = new THREE.Mesh(geo, material);
      this.add(this.image);
      this.image.castShadow = true;
      this.image.position.x = 6;
      this.image.position.y = 2;
      this.image.position.z = -7;
  }

  createLighting() {
    this.light = new THREE.PointLight(0xffba08, 10, 20);
    this.light.position.set(0, 7, 2);
    this.light.castShadow = true;
    this.add(this.light);
  }
}
