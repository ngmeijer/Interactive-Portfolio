import * as THREE from 'three';
import CANNON from 'cannon';

export default class Plane extends THREE.Object3D {
    size;
    planePosition = new THREE.Vector3();
    planeRotationDegrees;
    planeRotationRadians;
  
    planeMesh;
    planeBody;
    colour;
      
    constructor(pSize, pPosition, pRotation, pColour, pAddRigidBody) {
      super();
      this.size = pSize;
      this.planePosition = new THREE.Vector3(pPosition.x, pPosition.y, pPosition.z);
      this.planeRotationDegrees = pRotation;
  
      this.planeRotationRadians = new THREE.Vector3(0,0,0);
      this.planeRotationRadians.x = THREE.MathUtils.degToRad(this.planeRotationDegrees.x);
      this.planeRotationRadians.y = THREE.MathUtils.degToRad(this.planeRotationDegrees.y);
      this.planeRotationRadians.z = THREE.MathUtils.degToRad(this.planeRotationDegrees.z);
  
      this.colour = pColour;
  
      this.createGraphics();
  
      if(pAddRigidBody) this.createBody();
    }
  
    createGraphics() {
      const planeGeometry = new THREE.PlaneGeometry(this.size.x, this.size.y);
      let material = new THREE.MeshPhongMaterial();
      material.color.setHex(this.colour);
      this.planeMesh = new THREE.Mesh(planeGeometry, material);
      this.planeMesh.receiveShadow = true;
      
      this.setPosition();
  
      this.setRotation();
    }
  
    createBody() {
      const planeShape = new CANNON.Plane();
      this.planeBody = new CANNON.Body({ mass: 0 });
      this.planeBody.position.y = this.planePosition.y;
      this.planeBody.addShape(planeShape);
      this.planeBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
      );
    }
  
    setPosition(){
      this.planeMesh.position.y = this.planePosition.y;
      this.planeMesh.position.z = this.planePosition.z;
    }
  
    setRotation(){
      this.planeMesh.rotation.x = this.planeRotationRadians.x;
      this.planeMesh.rotation.y = this.planeRotationRadians.y;
      this.planeMesh.rotation.z = this.planeRotationRadians.z;
    }
  
    addToScene(pScene, pPhysicsWorld = null) {
      pScene.add(this.planeMesh);
      if (pPhysicsWorld == null) return;
      pPhysicsWorld.addBody(this.body);
    }
  }
  