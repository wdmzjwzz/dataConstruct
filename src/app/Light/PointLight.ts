 
import { BaseLight } from "./BaseLight";

export class PointLight extends BaseLight {
  public position: number[];
  public specularColor: number[];
  constructor(
    position: number[],
    shininess = 50,
    specularColor = [0, 0, 0],
    color = [0, 0, 0]
  ) {
    super(color, shininess);

    this.position = position;
    this.specularColor = specularColor;
  }
}
