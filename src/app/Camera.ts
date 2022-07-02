import { Point3 } from "./Geometry/Point";
import { MathHelper } from "./math/MathHelper";
import { Matrix4, Vector3 } from "./math/TSM";


export enum ECameraType {
  FPSCAMERA,
  FLYCAMERA,
}

export class Camera {

  public controlByMouse: boolean;
  public readonly position: Point3;
  public target: Point3;
  public far: number
  public near: number
  public aspectRatio: number
  public fovY: number;

  public projectionMatrix: Matrix4 = new Matrix4();
  public viewMatrix: Matrix4 = new Matrix4();
  public invViewMatrix: Matrix4 = new Matrix4();
  public viewProjMatrix: Matrix4 = new Matrix4();

  public constructor(
    width: number,
    height: number,
    fovY: number = 45.0,
    zNear: number = 1,
    zFar: number = 1000
  ) {

    this.aspectRatio = width / height;
    this.fovY = MathHelper.toRadian(fovY);
    this.near = zNear;
    this.far = zFar;

    this.controlByMouse = false;
    this.position = new Point3(0,0, 500)
    this.target = new Point3(0, 0, 0)
    this.update(0)
  }

  public update(intervalSec: number): void {
    this.projectionMatrix = Matrix4.perspective(
      this.fovY,
      this.aspectRatio,
      this.near,
      this.far
    );
    this.viewMatrix = Matrix4.lookAt(this.position, this.target, Vector3.up)
    this.invViewMatrix = this.viewMatrix.copy().inverse()
    this.viewProjMatrix = Matrix4.product(
      this.projectionMatrix,
      this.invViewMatrix,
    );
  }
  setPosition(newPosition: number[] | Point3) {
    if (newPosition instanceof Point3) {
      this.position.x = newPosition.x;
      this.position.y = newPosition.y
      this.position.z = newPosition.z
    } else {
      if (newPosition.length !== 3) {
        throw new Error("相机位置格式不真确");
      }
      this.position.x = newPosition[0];
      this.position.y = newPosition[1]
      this.position.z = newPosition[2]
    } 
  } 
  lookAt(target:Point3=this.target){
    this.target = target
    this.viewMatrix = Matrix4.lookAt(this.position, target, Vector3.up) 
  } 
}
