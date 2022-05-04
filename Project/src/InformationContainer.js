import * as THREE from "three";
import Text from "./Text";

export default class InformationContainer extends THREE.Object3D {
  paragraphOffset;
  font;
  colour;
  headerContent;
  paragraphContent;
  group;

  constructor(pPosition, pFont, pColour) {
    super();
    this.position.x = pPosition.x;
    this.position.y = pPosition.y;
    this.position.z = pPosition.z;
    this.paragraphOffset = new THREE.Vector3(0, -0.6, 0);
    this.font = pFont;
    this.colour = pColour;
    this.group = new THREE.Group();
  }

  createContent() {
    this.createHeader();
    this.createParagraph();
  }

  createHeader() {
    const header = new Text(
      this.headerContent,
      this.font,
      0.3,
      this.colour,
      this.position
    );
    this.group.add(header.mesh);
  }

  createParagraph() {
    const paragraphPosition = this.position.add(this.paragraphOffset);

    const paragraph = new Text(
      this.paragraphContent,
      this.font,
      0.2,
      this.colour,
      paragraphPosition
    );
    this.group.add(paragraph.mesh);
  }
}
