export default class AreaComponent {
    playerInstance;
    moveableObjects = [];
    light;
  
    canUpdate = true;
  
    constructor(pScene, pPhysicsWorld, pTextureLoader, pFontloader) {
      this.scene = pScene;
      this.physicsWorld = pPhysicsWorld;
      this.textureLoader = pTextureLoader;
      this.fontLoader = pFontloader;
    }
  }