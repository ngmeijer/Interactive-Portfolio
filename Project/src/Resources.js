import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/fontloader";
import EventEmitter from "./EventEmitter.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

export default class Resources extends EventEmitter {
  items;
  toLoad;
  loaded;
  sources;
  loaders;

  constructor(sources) {
    super();

    this.sources = sources;

    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.fontLoader = new FontLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.modelLoader = new GLTFLoader();
    this.loaders.svgLoader = new SVGLoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "font") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
      if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
      if (source.type === "model") {
        this.loaders.modelLoader.load(source.path, (file) => {
          file.scene.traverse(function (node) {
            if (node instanceof THREE.Mesh) {
              node.castShadow = true;
            }
          });
          this.sourceLoaded(source, file);
        });
      }
      if (source.type === "svg") {
        this.loaders.svgLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
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
