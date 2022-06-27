/* eslint-disable */
 
import { MathHelper } from "./math/MathHelper";
import { Matrix4, Vector3 } from "./math/TSM";

export enum ECameraType {
  FPSCAMERA,
  FLYCAMERA,
}

export class Camera {
  public projectionMat4: Matrix4;
  public position: Vector3;
  public viewMat4: Matrix4;
  public viewInverseMat4: Matrix4;
  public viewProjection: Matrix4;
  public constructor(
    width: number,
    height: number,
    fovY: number = 45.0,
    zNear: number = 1,
    zFar: number = 1000
  ) {
    const fov = MathHelper.toRadian(fovY);
    const aspect = width / height; 
    this.projectionMat4 = Matrix4.perspective(fov, aspect, zNear, zFar);
    this.position = new Vector3([0, 0, 100]);
    const target = new Vector3([0,0, 0]);
    const up = Vector3.up
    this.viewMat4 = Matrix4.lookAt(this.position, target, up);
    this.viewInverseMat4 = this.viewMat4.inverse();
    this.viewProjection = Matrix4.product(this.projectionMat4, this.viewInverseMat4);
  }
  /**
   * [x,y,z]
   * @param position 
   */
  setPositon(position: number[]) {
    this.position.x = position[0];
    this.position.y = position[1];
    this.position.z = position[2];
  }
}
