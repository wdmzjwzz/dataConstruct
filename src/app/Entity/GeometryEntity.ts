
// import { DataType } from "../constants";
// import { GLTexture } from "../GLTexture";
// import { Matrix4 } from "../math/TSM";
// import { BaseEntity } from "./BaseEntity";

// export class GeometryEntity extends BaseEntity {
//   public texture: GLTexture = new GLTexture({
//     min: DataType.NEAREST,
//     mag: DataType.NEAREST,
//     src: [
//       255, 255, 255, 255, 192, 192, 192, 255, 192, 192, 192, 255, 255, 255, 255,
//       255,
//     ],
//   });
//   public transform: Matrix4 = new Matrix4()
//   public vertices: any;
//   constructor(texture?: GLTexture) {
//     super();
//     if (texture) {
//       this.texture = texture;
//     }
//   }
//   setTexture(tex: GLTexture) {
//     this.texture = tex;
//   }
// }
