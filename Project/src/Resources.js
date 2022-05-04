import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/fontloader";
import EventEmitter from "./EventEmitter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { LoadingManager } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/dracoloader";

export default class Resources extends EventEmitter {
  items;
  toLoad;
  loaded;
  sources;
  loaders;
  loadingBar;

  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.loadingBar = document.querySelector(".loadingBar");
    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.loadingManager = new LoadingManager(
      //Loaded
      () => {
        this.loadingBar.classList.add("ended");
        this.loadingBar.style.transform = "";
      },

      //Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        const progressRatio = itemsLoaded / itemsTotal;
        this.loadingBar.style.transform = `scaleX(${progressRatio})`;
      }
    );
    this.loaders.fontLoader = new FontLoader(this.loaders.loadingManager);
    this.loaders.textureLoader = new THREE.TextureLoader(
      this.loaders.loadingManager
    );
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader = new GLTFLoader(this.loaders.loadingManager);
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
    this.loaders.svgLoader = new SVGLoader(this.loaders.loadingManager);
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "font":
          this.loaders.fontLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "texture":
          this.loaders.textureLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
        case "model":
          this.loaders.gltfLoader.load(source.path, (file) => {
            file.scene.traverse(function (child) {
              if (child.isMesh) {
                child.receiveShadow = true;
                child.material.metalness = 0;
              }
            });
            this.sourceLoaded(source, file.scene);
          });
          break;
        case "svg":
          this.loaders.svgLoader.load(source.path, (file) => {
            this.sourceLoaded(source, file);
          });
          break;
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
