import { WebGLApplication } from "../webgl/WebGLApplication";
import { CanvasKeyBoardEvent } from "../common/Application";
import { Camera } from "./Camera";

export class CameraApplication extends WebGLApplication {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持

  public constructor(
    canvas: HTMLCanvasElement,
    contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false },
    need2d: boolean = false
  ) {
    super(canvas, contextAttributes, need2d);
    this.camera = new Camera(this.gl, canvas.width, canvas.height, 75, 0.1, 1000);
    this.camera.z = 10;
  }

  //子类override update函数时必须要调用基类本方法
  public update(elapsedMsec: number, intervalSec: number): void {
    // 调用Camera对象的update，这样就能实时的计算camera的投影和视图矩阵
    // 这样才能保证摄像机正确运行
    // 如果CameraApplication的子类覆写（override）本函数
    // 那么必须在函数的最后一句代码调用: super.update(elapsedMsec,intervalSec)
    this.camera.update(intervalSec);
  }

  // 内置一个通用的摄像机按键事件响应操作
  // 覆写（）
  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    if (evt.key === "w") {
      this.camera.moveForward(-0.1); // 摄像机向前运行
    } else if (evt.key === "s") {
      this.camera.moveForward(0.1); // 摄像机向后运行
    } else if (evt.key === "a") {
      this.camera.moveRightward(0.1); // 摄像机向右运行
    } else if (evt.key === "d") {
      this.camera.moveRightward(-0.1); // 摄像机向左运行
    } else if (evt.key === "z") {
      this.camera.moveUpward(0.1); // 摄像机向上运行
    } else if (evt.key === "x") {
      this.camera.moveUpward(-0.1); // 摄像机向下运行
    } else if (evt.key === "y") {
      this.camera.yaw(0.1); // 摄像机绕本身的Y轴旋转
    } else if (evt.key === "r") {
      this.camera.roll(0.1); // 摄像机绕本身的Z轴旋转
    } else if (evt.key == "p") {
      this.camera.pitch(0.1); // 摄像机绕本身的X轴旋转
    }
  }
}
