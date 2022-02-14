import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/fontloader";
import EventEmitter from "./EventEmitter.js";

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
