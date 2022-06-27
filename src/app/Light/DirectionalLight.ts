 
import { BaseLight } from "./BaseLight";

export class DirectionalLight extends BaseLight {
  public direction: number[];
  constructor(direction: number[], color = [0, 0, 0]) {
    super(color);

    this.direction = direction;
  }
}
