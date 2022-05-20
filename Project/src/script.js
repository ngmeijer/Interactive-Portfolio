import "./style.css";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import Resources from "./Resources.js";
import sources from "./sources.js";
import MainScene from "./Scenes/MainScene.js";
import TDWE_Scene from "./Scenes/TDWE_Scene.js";
import NetherFights_Scene from "./Scenes/NetherFights_Scene.js";
import ProcArt_Scene from "./Scenes/ProcArt_Scene.js";
import HiveLife_Scene from "./Scenes/HiveLife_Scene.js";

THREE.Cache.enabled = true;
const eventManager = new THREE.EventDispatcher();
let resources = new Resources(sources);
resources.on("ready", () => {
  initialize();
});
const mainScene = new MainScene(resources);
const tdweScene = new TDWE_Scene(resources);
const netherFightsScene = new NetherFights_Scene(resources);
const procArtScene = new ProcArt_Scene(resources);
const hiveLifeScene = new HiveLife_Scene(resources);

mainScene.eventManager = eventManager;
tdweScene.eventManager = eventManager;

let camera, renderer;

let fadeImage = document.getElementById("fadeImage");

let activeScene = mainScene;
let newScene;
let activePhysicsWorld;

let canEnterItem = false;
let currentlyEntering = false;
let inPortfolioScene = false;
let lastPlayerPosition;

document.addEventListener("keydown", function (event) {
  if (event.key == "f" || event.key == "F") {
    if (activeScene.name != "Main Scene") {
      newScene = mainScene;
      mainScene.playerInstance.setPosition(lastPlayerPosition);
      switchScene();
    } else if (!canEnterItem || currentlyEntering) return;
    else {
      currentlyEntering = true;
      lastPlayerPosition = mainScene.playerInstance.group.position;
      mainScene.playerInstance.moveIntoPortfolioItem();
      switchScene();
    }
  }
});

function createRenderingComponents() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 3, 9.5);

  renderer = new THREE.WebGLRenderer({
    powerPreference: "high-performance",
    logarithmicDepthBuffer: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
}

var fadeInTween;
var fadeOutTween;
var currentOpacity = { opacity: 0 };

function switchScene() {
  currentOpacity.opacity = 0;

  fadeSceneOut(currentOpacity);
  fadeSceneIn(currentOpacity);

  fadeOutTween.chain(fadeInTween);
  fadeOutTween.start();
  currentlyEntering = false;
}

function fadeSceneIn(pCurrentOpacity) {
  fadeInTween = new TWEEN.Tween(pCurrentOpacity)
    .to({ opacity: 0 }, 3000)
    .onUpdate(function (pCurrentOpacity) {
      fadeImage.style.setProperty("opacity", pCurrentOpacity.opacity);
    });
}

function fadeSceneOut(pCurrentOpacity) {
  fadeOutTween = new TWEEN.Tween(pCurrentOpacity)
    .to({ opacity: 1 }, 1500)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function (pCurrentOpacity) {
      fadeImage.style.setProperty("opacity", pCurrentOpacity.opacity);
    })
    .onComplete(function () {
      activeScene.currentScene = false;
      activeScene.playerInstance.resetPlayer();

      newScene = mainScene.portfolioArea.newScene;

      if (activeScene.name != "Main Scene") newScene = "Main Scene";

      switch (newScene) {
        case "The Day We Escaped":
          activeScene = tdweScene;
          break;
        case "Nether Fights":
          activeScene = netherFightsScene;
          break;
        case "Hive Life":
          activeScene = hiveLifeScene;
          break;
        case "Procedural Art":
          activeScene = procArtScene;
          break;
        case "Main Scene":
          activeScene = mainScene;
          inPortfolioScene = false;
          break;
      }

      activeScene.playerInstance.resetPlayer();

      activeScene.currentScene = true;
      activePhysicsWorld = activeScene.physicsWorld;
    });
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

function initializeScenes() {
  mainScene.initalizeScene(camera);
  tdweScene.initalizeScene(camera);
  procArtScene.initalizeScene(camera);
  hiveLifeScene.initalizeScene(camera);
  netherFightsScene.initalizeScene(camera);
}

const frameClock = new THREE.Clock();
let delta;
async function initialize() {
  window.addEventListener("resize", onWindowResize, false);
  createRenderingComponents();
  currentOpacity.opacity = 1;
  fadeSceneIn(currentOpacity);
  fadeInTween.start();
  initializeScenes();

  activeScene = mainScene;
  activePhysicsWorld = activeScene.physicsWorld;
  activeScene.currentScene = true;

  animate();
}

let countedFrames = 0;
function animate() {
  requestAnimationFrame(animate);

  delta = Math.min(frameClock.getDelta(), 0.1);
  canEnterItem = mainScene.portfolioArea.canEnterItem;
  activePhysicsWorld.step(delta);
  activeScene.update(delta);

  countedFrames++;

  let fps = countedFrames / frameClock.getElapsedTime();
  //console.log(fps);

  cameraFollowPlayer();

  TWEEN.update();
  render();
}

function render() {
  renderer.render(activeScene, camera);
}
