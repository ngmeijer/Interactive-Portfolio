import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";
import Text from "./Text";

export default class AnimatedModel extends THREE.Object3D {
  model;
  header;
  group;

  constructor(
    pName,
    pModel,
    pPosition,
    pAnimate,
    { pHeaderContent, pFont } = null
  ) {
    super();

    this.group = new THREE.Group();
    this.group.position.x = pPosition.x;
    this.group.position.y = pPosition.y;
    this.group.position.z = pPosition.z;
    pModel.children[0].name = pName;
    this.group.add(pModel);

    if (pAnimate) this.prepareTweens();
    if (pHeaderContent != null) this.createHeader(pHeaderContent, pFont);
  }

  createHeader(pHeaderContent, pFont) {
    let groupPos = this.group.position;
    let offset = new THREE.Vector3(0, 1.4, 0);
    let finalPos = new THREE.Vector3(
      groupPos.x + offset.x,
      groupPos.y + offset.y,
      groupPos.z + offset.z
    );

    this.header = new Text(pHeaderContent, pFont, 0.2, 0xffffff, offset);
    this.header.geo.computeBoundingBox();
    this.header.geo.center();
    this.group.add(this.header.mesh);
  }

  prepareTweens() {
    const startScale = this.group.scale;
    const positionDown = new THREE.Vector3(
      startScale.x - 0.05,
      startScale.y - 0.05,
      startScale.z - 0.05
    );

    const tweenMoveDown = new TWEEN.Tween(this.group.scale)
      .to(
        {
          x: positionDown.x,
          y: positionDown.y,
          z: positionDown.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut);

    const tweenMoveUp = new TWEEN.Tween(this.group.scale)
      .to(
        {
          x: startScale.x,
          y: startScale.y,
          z: startScale.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut);

    tweenMoveDown.chain(tweenMoveUp);
    tweenMoveUp.chain(tweenMoveDown);

    tweenMoveDown.start();
  }
}
