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
    pAnimationIntensity,
    pHeaderContent,
    pFont
  ) {
    super();

    this.group = new THREE.Group();
    this.group.position.x = pPosition.x;
    this.group.position.y = pPosition.y;
    this.group.position.z = pPosition.z;
    pModel.children[0].name = pName;
    this.group.add(pModel);

    if (pAnimate) this.prepareTweens(pAnimationIntensity);
    if (typeof pHeaderContent !== "undefined")
      this.createHeader(pHeaderContent, pFont);
  }

  createHeader(pHeaderContent, pFont) {
    let groupPos = this.group.position;
    let offset = new THREE.Vector3(0, 1.4, 0);

    this.header = new Text(pHeaderContent, pFont, 0.2, 0xffffff, offset);
    this.header.geo.computeBoundingBox();
    this.header.geo.center();
    this.group.add(this.header.mesh);
  }

  prepareTweens(pAnimationIntensity) {
    if (pAnimationIntensity === "undefined") pAnimationIntensity = 1;
    const startScale = this.group.scale;
    const newScale = new THREE.Vector3(
      startScale.x - pAnimationIntensity,
      startScale.y - pAnimationIntensity,
      startScale.z - pAnimationIntensity
    );

    const tweenScaleDown = new TWEEN.Tween(this.group.scale)
      .to(
        {
          x: newScale.x,
          y: newScale.y,
          z: newScale.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut);

    const tweenScaleUp = new TWEEN.Tween(this.group.scale)
      .to(
        {
          x: startScale.x,
          y: startScale.y,
          z: startScale.z,
        },
        1000
      )
      .easing(TWEEN.Easing.Sinusoidal.InOut);

    tweenScaleDown.chain(tweenScaleUp);
    tweenScaleUp.chain(tweenScaleDown);

    tweenScaleDown.start();
  }
}
