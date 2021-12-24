import { CameraApplication } from "../theWorld/lib/CameraApplication";
import { GLMeshBuilder } from "../theWorld/webgl/WebGLMesh";
import { Matrix4, Vector3, Vector4 } from "../theWorld/common/math/TSM";
import { CanvasKeyBoardEvent, CanvasMouseEvent } from "../theWorld/common/Application";
import { DrawHelper } from "../theWorld";
import { Point } from "../theWorld/Geometry/Point";
import { GLHelper } from "../theWorld/webgl/WebGLHepler";
import { GLShaderType } from "../theWorld/webgl/WebGLShaderSource";
export class MeshApplication extends CameraApplication {
  public textureBuilder: GLMeshBuilder;

  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, { premultipliedAlpha: false }, true);
    this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.textureBuilder = GLHelper.createBuilder(this.gl, GLShaderType.TEXTURE);
    this.isSupportMouseMove = true
  }
  public onMouseMove(evt: CanvasMouseEvent): void {

    if (this._isMouseDown) {
      console.log(evt, 1111, this._isMouseDown)
    }
    return;
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    // 每帧旋转1度
    this.angle += 1;
    // 调用基类方法，这样就能让摄像机进行更新
    super.update(elapsedMsec, intervalSec);

  }
  public drawCoordSystem(): void {
    this.matStack.pushMatrix(); // 矩阵堆栈进栈
    this.matStack.rotate(-this.angle, new Vector3([0, 1, 0]).normalize());
    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );
    DrawHelper.drawCoordSystem(this.builder, Matrix4.m0, 5);
    this.matStack.popMatrix();
  }
  public drawByMatrixWithColorShader(): void {
    this.matStack.pushMatrix(); // 矩阵堆栈进栈

    this.matStack.rotate(-this.angle, new Vector3([0, 1, 0]).normalize());

    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );
    DrawHelper.drawSolidCubeBox(
      this.builder,
      Matrix4.m0,
      new Point(0, 0, 2),
      0.5,
      Vector4.red
    );

    DrawHelper.drawSolidCubeBox(this.builder, Matrix4.m0);
    this.matStack.popMatrix();
  }

  public render(): void {
    // 使用cleartColor方法设置当前颜色缓冲区背景色是什么颜色
    this.gl.clearColor(0, 0, 0, 1);
    // 调用clear清屏操作
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.disable(this.gl.CULL_FACE);

    this.gl.enable(this.gl.DEPTH_TEST);
    this.drawCoordSystem();
    this.drawByMatrixWithColorShader();
    // 恢复三角形背面剔除功能
    this.gl.enable(this.gl.CULL_FACE);
  }

  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    super.onKeyPress(evt);
  }
}
