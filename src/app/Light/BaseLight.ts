export class BaseLight {
  public color: number[];
  public shininess: number;
  constructor(color = [0, 0, 0], shininess = 50) {
    this.color = color;
    this.shininess = shininess;
  }
}
