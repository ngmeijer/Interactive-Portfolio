import "./style.css";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import Resources from "./Resources.js";
import sources from "./sources.js";
import MainScene from "./MainScene.js";
import TDWE_Scene from "./TDWE_Scene.js";
import NetherFights_Scene from "./NetherFights_Scene.js";

THREE.Cache.enabled = true;
const eventManager = new THREE.EventDispatcher();
let resources = new Resources(sources);
resources.on("ready", () => {
  initialize();
});
const mainScene = new MainScene(resources);
const tdweScene = new TDWE_Scene(resources);
const netherFightsScene = new NetherFights_Scene(resources);
mainScene.eventManager = eventManager;
tdweScene.eventManager = eventManager;

let camera, renderer;

let fadeImage = document.getElementById("fadeImage");

let activeScene = mainScene;
let activePhysicsWorld;

let canEnterItem = false;
let currentlyEntering = false;

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
      console.log(fadeImage.style.opacity);
      fadeImage.style.setProperty("opacity", pCurrentOpacity.opacity);
    })
    .onComplete(function () {
      activeScene.currentScene = false;

      let newScene = mainScene.portfolioArea.newScene;

      switch (newScene) {
        case "TDWE":
          activeScene = tdweScene;
          break;
        case "NetherFights":
          activeScene = netherFightsScene;
          break;
        case "HiveLife":
          break;
        default:
          activeScene = mainScene;
          break;
      }

      activeScene.currentScene = true;
      activePhysicsWorld = activeScene.physicsWorld;
      // activeScene.playerInstance.resetPlayer();
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
