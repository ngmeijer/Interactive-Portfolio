export default class AreaComponent {
    playerInstance;
    moveableObjects = [];
    light;
  
    canUpdate = true;
  
    constructor(pScene, pPhysicsWorld, pResources) {
      this.scene = pScene;
      this.physicsWorld = pPhysicsWorld;
      this.resources;
    }
  }