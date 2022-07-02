import { MathHelper } from "./math/MathHelper";
import { Matrix4, Vector3 } from "./math/TSM";


export enum ECameraType {
  FPSCAMERA,
  FLYCAMERA,
}

export class Camera {

  public controlByMouse: boolean;
  public position: Vector3;
  public target: Vector3;
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
    this.position = new Vector3([0, 500, 500])
    this.target = new Vector3([0, 0, 0])
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

  //局部坐标系下的前后运动
  public moveForward(speed: number): void {
    if (this._type === ECameraType.FPSCAMERA) {
      this.position.x += this.zAxis.x * speed;
      this.position.z += this.zAxis.z * speed;
    } else {
      this.position.x += this.zAxis.x * speed;
      this.position.y += this.zAxis.y * speed;
      this.position.z += this.zAxis.z * speed;
    }
  }

  //局部坐标系下的左右运动
  public moveRightward(speed: number): void {
    if (this._type === ECameraType.FPSCAMERA) {
      this.position.x += this.xAxis.x * speed;
      this.position.z += this.xAxis.z * speed;
    } else {
      this.position.x += this.xAxis.x * speed;
      this.position.y += this.xAxis.y * speed;
      this.position.z += this.xAxis.z * speed;
    }
  }

  //局部坐标系下的上下运动
  public moveUpward(speed: number): void {
    if (this._type === ECameraType.FPSCAMERA) {
      this.position.y += speed;
    } else {
      this.position.x += this.yAxis.x * speed;
      this.position.y += this.yAxis.y * speed;
      this.position.z += this.yAxis.z * speed;
    }
  }

  //局部坐标轴的左右旋转
  public yaw(angle: number): void {
    Matrix4.m0.setIdentity();
    angle = MathHelper.toRadian(angle);
    if (this._type === ECameraType.FPSCAMERA) {
      Matrix4.m0.rotate(angle, Vector3.up);
    } else {
      Matrix4.m0.rotate(angle, this.yAxis);
    }

    Matrix4.m0.multiplyVector3(this.zAxis, this.zAxis);
    Matrix4.m0.multiplyVector3(this.xAxis, this.xAxis);
  }

  //局部坐标轴的上下旋转
  public pitch(angle: number): void {
    Matrix4.m0.setIdentity();
    angle = MathHelper.toRadian(angle);
    Matrix4.m0.rotate(angle, this.xAxis);
    Matrix4.m0.multiplyVector3(this.yAxis, this.yAxis);
    Matrix4.m0.multiplyVector3(this.zAxis, this.zAxis);
  }

  //局部坐标轴的滚转
  public roll(angle: number): void {
    if (this._type === ECameraType.FLYCAMERA) {
      angle = MathHelper.toRadian(angle);
      Matrix4.m0.setIdentity();
      Matrix4.m0.rotate(angle, this.zAxis);
      Matrix4.m0.multiplyVector3(this.xAxis, this.xAxis);
      Matrix4.m0.multiplyVector3(this.yAxis, this.yAxis);
    }
  }

  //从当前postition和target获得view矩阵
  //并且从view矩阵抽取forward,up,right方向矢量
  public lookAt(target: Vector3, up: Vector3 = Vector3.up): void {
    this.viewMatrix = Matrix4.lookAt(this.position, target, up);

    this.xAxis.x = this.viewMatrix.values[0];
    this.yAxis.x = this.viewMatrix.values[1];
    this.zAxis.x = this.viewMatrix.values[2];

    this.xAxis.y = this.viewMatrix.values[4];
    this.yAxis.y = this.viewMatrix.values[5];
    this.zAxis.y = this.viewMatrix.values[6];

    this.xAxis.z = this.viewMatrix.values[8];
    this.yAxis.z = this.viewMatrix.values[9];
    this.zAxis.z = this.viewMatrix.values[10];
  }

  private _type: ECameraType = ECameraType.FPSCAMERA;
  private xAxis: Vector3 = new Vector3([1, 0, 0]);
  private yAxis: Vector3 = new Vector3([0, 1, 0]);
  private zAxis: Vector3 = new Vector3([0, 0, 1]);

}
