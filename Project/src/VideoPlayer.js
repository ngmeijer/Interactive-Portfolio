import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import Text from "./Text";
import { Group } from "three";

export default class VideoPlayer extends THREE.Object3D {
  playerPosition;
  videoTexture;
  videoContainer;
  videoSource;
  videoIsPlaying;
  playButton;
  pauseButton;
  currentVideoIndex = 0;
  movieMaterial;
  videoSources = [];
  rayCaster;
  rayDirection;
  camera;
  sources;
  mousePosition = new THREE.Vector2();
  currentIntersect;
  resources;
  tweensOnPause = [];
  tweensOnPlay = [];
  group;

  constructor(pPosition, pSources, pRaycaster, pCamera, pResources) {
    super();
    this.group = new Group();
    this.playerPosition = pPosition;
    this.sources = pSources;
    this.rayCaster = pRaycaster;
    this.camera = pCamera;
    this.resources = pResources;

    //this.createVideo();
    //this.createVideoControls();
  }

  createVideo() {
    this.videoContainer = document.getElementById("videoContainer");
    this.videoSource = document.getElementById("video");
    this.videoSource.setAttribute("src", "Videos/" + this.videoSources[0]);

    this.videoTexture = new THREE.VideoTexture(this.videoContainer);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    let movieGeometry = new THREE.PlaneGeometry(12, 6.75);
    let movieCubeScreen = new THREE.Mesh(movieGeometry, this.movieMaterial);
    let cubePos = new THREE.Vector3(
      this.position.x,
      this.position.y,
      this.position.z
    );
    movieCubeScreen.position.x = this.playerPosition.x;
    movieCubeScreen.position.y = this.playerPosition.y;
    movieCubeScreen.position.z = this.playerPosition.z;
    this.group.add(movieCubeScreen);

    this.videoContainer.crossOrigin = "anonymous";
    this.videoContainer.load();
    var playPromise = this.videoContainer.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        this.videoContainer.pause();
      });
    }

    this.videoIsPlaying = false;

    const videoPlayerHeader = new Text(
      "Video player",
      this.resources.items.ElMessiri,
      0.3,
      this.instructionTextColor,
      new THREE.Vector3(this.playerPosition.x - 6, this.playerPosition.y + 3.5, this.playerPosition.z)
    );
    this.group.add(videoPlayerHeader.mesh);
  }

  createVideoControls() {
    window.addEventListener("mousemove", (event) => {
      this.mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    this.createVideoButtons();
    this.createVideoTweens();

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        switch (this.currentIntersect.object.name) {
          case "PlayButton":
            if (this.videoIsPlaying) break;
            this.videoContainer.play();
            this.tweensOnPlay[0].start();
            this.tweensOnPlay[1].start();
            this.videoIsPlaying = true;
            break;

          case "PauseButton":
            if (!this.videoIsPlaying) break;
            this.videoContainer.pause();
            this.tweensOnPause[0].start();
            this.tweensOnPause[1].start();
            this.videoIsPlaying = false;
            break;
          case "git":
            window.open(
              "https://github.com/ngmeijer/cplusplus-course/tree/master/SFML%20environment/cpp_assignment"
            );
            break;
        }
      }
    });
  }

  createVideoButtons() {
    this.playButton = this.resources.items.play.clone();
    this.group.add(this.playButton);
    this.playButton.position.set(10, 2.2, -3);

    this.pauseButton = this.resources.items.pause.clone();
    this.group.add(this.pauseButton);
    this.pauseButton.position.set(10, 1, -3);
  }

  createVideoTweens() {
    let pausedText = new Text(
      "Paused",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new THREE.Vector3(11.1, 0, -3.1)
    );
    this.group.add(pausedText.mesh);

    let playingText = new Text(
      "Playing",
      this.resources.items.ElMessiri,
      0.2,
      0xffffff,
      new THREE.Vector3(11.1, 1, -3.1)
    );
    this.group.add(playingText.mesh);

    this.tweensOnPause.push(
      new TWEEN.Tween(pausedText.mesh.position).to(
        {
          x: pausedText.mesh.position.x,
          y: pausedText.mesh.position.y - 0.05,
          z: pausedText.mesh.position.z,
        },
        500
      )
    );

    this.tweensOnPause.push(
      new TWEEN.Tween(playingText.mesh.position).to(
        {
          x: playingText.mesh.position.x,
          y: playingText.mesh.position.y + 1,
          z: playingText.mesh.position.z,
        },
        500
      )
    );

    this.tweensOnPlay.push(
      new TWEEN.Tween(playingText.mesh.position).to(
        {
          x: playingText.mesh.position.x,
          y: playingText.mesh.position.y - 1,
          z: playingText.mesh.position.z,
        },
        500,
        500
      )
    );

    this.tweensOnPlay.push(
      new TWEEN.Tween(pausedText.mesh.position).to(
        {
          x: pausedText.mesh.position.x,
          y: pausedText.mesh.position.y + 1,
          z: pausedText.mesh.position.z,
        },
        500,
        500
      )
    );
  }

  switchVideo() {
    if (this.currentVideoIndex < 0) {
      this.currentVideoIndex = this.maxVideoIndex;
    }

    if (this.currentVideoIndex > this.maxVideoIndex) {
      this.currentVideoIndex = 0;
    }

    this.videoSource.setAttribute(
      "src",
      "Videos/" + this.sources[this.currentVideoIndex]
    );
    this.videoContainer.load();

    this.videoTexture.video = this.videoContainer;
    this.movieMaterial.map = this.videoTexture;

    var playPromise = this.videoContainer.play();

    if (playPromise !== undefined) {
      playPromise.then((_) => {
        this.videoContainer.pause();
      });
    }
    this.videoIsPlaying = false;
  }

  checkVideoControlsMouseOver() {
    this.rayCaster.setFromCamera(this.mousePosition, this.camera);

    const objectsToTest = [this.playButton, this.pauseButton];
    const intersects = this.rayCaster.intersectObjects(objectsToTest);

    if (intersects.length) {
      this.currentIntersect = intersects[0];
    } else {
      this.currentIntersect = null;
    }

    for (const currentObject of objectsToTest) {
      if (!intersects.find((intersect) => intersect.object === currentObject)) {
        currentObject.children[0].material.color.set("#ffff00");
      }
    }
    for (const intersect of intersects) {
      intersect.object.material.color.set("#ff0000");
    }
  }
}
