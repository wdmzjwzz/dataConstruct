import { v4 as uuidv4 } from "uuid";
export class BaseEntity {
  public id: string;
  constructor(texture?: WebGLTexture) {
    this.id = uuidv4();
  }
}
