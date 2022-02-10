export default class PictureFrame extends THREE.Object3D {
    ID;
    framePosition;
    outerSize;
    isStatic;
    mass;
    meshLeft;
    meshRight;
    meshTop;
    meshBottom;
    cubeBody;
    colour;
    physicsMat;
    contactMat;
    friction;
    restitution;

    verticalWallWidth;
    verticalWallHeight;

    horizontalWallWidth;
    horizontalWallHeight;
  
    constructor(pID, pOuterSize, pInnerSize, pPosition, pColour) {
      super();
      this.ID = pID;
      this.framePosition = pPosition;
      this.outerSize = pOuterSize;
      this.innerSize = pInnerSize;
      this.colour = pColour;
  
      this.createGraphics();
    }
  
    createGraphics() {
      //Vertical walls = left & right;
      //Horizontal walls = top & bottom;
      this.verticalWallWidth = this.outerSize.x - this.innerSize.x;
      this.verticalWallHeight = this.outerSize.y;

      this.horizontalWallHeight = this.outerSize.y - this.innerSize.y;

      const cubeGeoLeft = new THREE.BoxGeometry(
        this.verticalWallWidth,
        this.verticalWallHeight,
        0.2
      );
      const cubeGeoRight = cubeGeoLeft;

      const cubeGeoTop = new THREE.BoxGeometry(
        this.outerSize.x,
        this.horizontalWallHeight,
        0.2
      );

      const material = new THREE.MeshPhongMaterial({
        polygonOffset: true,
        polygonOffsetFactor: -1.0,
        polygonOffsetUnits: -4.0,
      });
      material.color.setHex(this.colour);

      this.meshLeft = new THREE.Mesh(cubeGeoLeft, material);
      this.meshRight = new THREE.Mesh(cubeGeoRight, material);
      this.meshTop = new THREE.Mesh(cubeGeoTop, material);

      this.meshLeft.position.x = this.framePosition.x - this.outerSize.x / 2;
      this.meshLeft.position.y = this.framePosition.y;
      this.meshLeft.position.z = this.framePosition.z;

      this.meshRight.position.x = this.framePosition.x + this.outerSize.x / 2;
      this.meshRight.position.y = this.framePosition.y;
      this.meshRight.position.z = this.framePosition.z;

      this.meshTop.position.x = this.framePosition.x;
      this.meshTop.position.y = this.framePosition.y + this.outerSize.y / 2 - this.horizontalWallHeight / 2;
      this.meshTop.position.z = this.framePosition.z;

      this.meshLeft.castShadow = true;
      this.meshLeft.receiveShadow = true;
    }

    addToScene(pScene){
       pScene.add(this.meshLeft);
       pScene.add(this.meshRight);
       pScene.add(this.meshTop);
    }
  }