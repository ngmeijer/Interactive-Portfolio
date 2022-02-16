import * as THREE from 'three';
import CANNON from 'cannon';

export default class Cube extends THREE.Object3D {
  ID;
  pos;
  size;
  isStatic;
  mass;
  mesh;
  body;
  colour;
  physicsMat;
  contactMat;
  friction;
  restitution;

  constructor(
    pID,
    pSize,
    pPosition,
    pColour,
    pIsStatic,
    pMass = 0.0,
    pPhysicsMat = null,
    pFriction = 0.0,
    pRestitution = 0.0
  ) 
    {
    super();
    this.ID = pID;
    this.pos = pPosition;
    this.size = pSize;
    this.colour = pColour;
    this.isStatic = pIsStatic;
    this.mass = pMass;
    this.physicsMat = pPhysicsMat;
    this.friction = pFriction;
    this.restitution = pRestitution;

    if (this.isStatic && this.mass != 0)
      console.log(
        "Object '" + this.ID + "' is set to static but mass is " + this.mass
      );
    if (!this.isStatic && this.mass == 0)
      console.log(
        "Object '" + this.ID + "'s mass is set to 0 but is set to static."
      );

    this.setOriginToBottom();
    this.createGraphics();
    this.createBody();
    this.createPhysicsMaterial();
  }

  update() {
    this.updateTransform();
  }

  setOriginToBottom() {
    this.pos.y += this.size.y / 2;
  }

  updateTransform() {
    this.mesh.position.set(
      this.body.position.x,
      this.body.position.y,
      this.body.position.z
    );
    this.mesh.quaternion.set(
      this.body.quaternion.x,
      this.body.quaternion.y,
      this.body.quaternion.z,
      this.body.quaternion.w
    );
    this.position = this.mesh.position;
  }

  createGraphics() {
    const cubeGeo = new THREE.BoxGeometry(
      this.size.x,
      this.size.y,
      this.size.z
    );
    const material = new THREE.MeshPhongMaterial({
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -4.0,
    });
    material.color.setHex(this.colour);
    this.mesh = new THREE.Mesh(cubeGeo, material);
    this.mesh.position.x = this.pos.x;
    this.mesh.position.y = this.pos.y;
    this.mesh.position.z = this.pos.z;
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  createBody() {
    const cubeShape = new CANNON.Box(
      new CANNON.Vec3(this.size.x / 2, this.size.y / 2, this.size.z / 2)
    );
    this.body = new CANNON.Body({ mass: this.mass });

    this.body.addShape(cubeShape);
    this.body.position.x = this.pos.x;
    this.body.position.y = this.pos.y;
    this.body.position.z = this.pos.z;
  }

  createPhysicsMaterial() {
    if (this.physicsMat == null) return;

    this.contactMat = new CANNON.ContactMaterial(
      this.physicsMat,
      this.physicsMat,
      { friction: this.friction, restitution: this.restitution }
    );
    console.log(
      "Created contact material for object: " +
        this.ID +
        ". Restitution = " +
        this.restitution +
        ". Friction = " +
        this.friction
    );
  }

  addToScene(pScene, pPhysicsWorld = null) {
    pScene.add(this.mesh);
    if (pPhysicsWorld == null) return;
    pPhysicsWorld.addBody(this.body);
  }
}
