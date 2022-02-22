import CANNON from "cannon";

export default class CubeBody extends CANNON.Body {
  constructor(pPosition, pSize, pMass = 0) {
    super();

    const cubeShape = new CANNON.Box(
      new CANNON.Vec3(pSize.x / 2, pSize.y / 2, pSize.z / 2)
    );

    this.mass = pMass;

    this.addShape(cubeShape);
    this.position.set(pPosition.x, pPosition.y, pPosition.z);
  }
}
