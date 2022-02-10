import "./style.css";
import * as THREE from "three";
import CANNON from "cannon";
import TWEEN from "@tweenjs/tween.js";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import MainScene from "./MainScene.js";
import TDWE_Scene from "./TDWE_Scene.js";

let loadedTextures = false;
let loadedFonts = false;

THREE.Cache.enabled = true;
const eventManager = new THREE.EventDispatcher();
const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();

const mainScene = new MainScene(fontLoader, textureLoader);
const tdweScene = new TDWE_Scene(fontLoader, textureLoader);
mainScene.eventManager = eventManager;
tdweScene.eventManager = eventManager;

let camera, renderer;

let fadeImage = document.getElementById("fadeImage");

let activeScene = mainScene;
let activePhysicsWorld;

let canEnterItem = false;
let currentlyEntering = false;

let environmentColor = 0x100b13,
  instructionTextColor = 0x9d0208,
  platformColor = 0xe85d04;

document.addEventListener("keydown", function (event) {
  if (event.key == "f" || event.key == "F") {
    if (!canEnterItem || currentlyEntering) return;
    currentlyEntering = true;
    activeScene.playerInstance.saveCurrentPosition();
    activeScene.playerInstance.moveIntoPortfolioItem();
    switchScene();
  }
});

function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 3, 8);

  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  document.body.appendChild(renderer.domElement);
}

function switchScene() {
  var currentOpacity = { opacity: 0 };
  var fullOpacity = { opacity: 1 };
  var noOpacity = { opacity: 0 };
  var fadeOut = new TWEEN.Tween(currentOpacity)
    .to(fullOpacity, 2000)
    .onUpdate(function () {
      fadeImage.style.setProperty("opacity", currentOpacity.opacity);
    })
    .onComplete(function () {
      if (activeScene == mainScene) activeScene = tdweScene;
      else activeScene = mainScene;
      activePhysicsWorld = activeScene.physicsWorld;
      //activeScene.playerInstance.resetPlayer();
    });

  var fadeIn = new TWEEN.Tween(currentOpacity)
    .to(noOpacity, 2000)
    .onUpdate(function () {
      fadeImage.style.setProperty("opacity", currentOpacity.opacity);
    });

  fadeOut.chain(fadeIn);
  fadeOut.start();
  currentlyEntering = false;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

let cameraOffset = new THREE.Vector3(1.5, 2, 0);
function cameraFollowPlayer() {
  camera.position.x =
    activeScene.playerInstance.playerBody.position.x + cameraOffset.x;
  camera.position.y =
    activeScene.playerInstance.playerBody.position.y + cameraOffset.y;
}

async function loadResources() {
  fontLoader.load(
    "/El_Messiri_SemiBold_Regular.json",

    function (font) {
      THREE.Cache.add("customFont", font);
      loadedFonts = true;
    }
  );
  textureLoader.load(
    "/NetherFights.png",

    function onLoad(image) {
      THREE.Cache.add("NetherFights_Image", image);
      loadedTextures = true;
    }
  );
}

const frameClock = new THREE.Clock();
let delta;
loadResources();
async function initialize() {

  window.addEventListener("resize", onWindowResize, false);
  createRenderingComponents();
  mainScene.environmentColor = environmentColor;
  mainScene.instructionTextColor = instructionTextColor;
  mainScene.platformColor = platformColor;
  mainScene.initalizeScene();

  tdweScene.environmentColor = environmentColor;
  tdweScene.instructionTextColor = instructionTextColor;
  tdweScene.platformColor = platformColor;
  tdweScene.initalizeScene();

  activeScene = mainScene;
  activePhysicsWorld = mainScene.physicsWorld;

  animate();
}
initialize();

function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  canEnterItem = mainScene.portfolioArea.canEnterItem;
  activePhysicsWorld.step(delta);
  activeScene.update(delta);

  cameraFollowPlayer();

  TWEEN.update();
  render();
}

function render() {
  renderer.render(activeScene, camera);
}
