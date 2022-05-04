import { CameraApplication } from "./lib/CameraApplication";
import { GLMeshBuilder } from "./webgl/WebGLMesh";
import { Matrix4, Vector2, Vector3 } from "./common/math/TSM";
import {
  CanvasKeyBoardEvent,
  CanvasMouseEvent,
} from "./lib/Application";
import { DrawHelper, GLProgram, GLTexture, HttpRequest } from ".";
import { GLHelper } from "./webgl/WebGLHepler";
import { GLShaderType } from "./webgl/glsl";
import { GLAttribName } from "./type";
export class MeshApplication extends CameraApplication {
  public textureBuilder: GLMeshBuilder;
  public textures: GLTexture; // 纹理着色器所使用的纹理对象
  public currTexIdx: number = 0
  public textureProgram: GLProgram; // 使用颜色GPU Program对象
  public lastPos: Vector2
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, { premultipliedAlpha: false });
    this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.textureBuilder = GLHelper.createBuilder(this.gl, GLShaderType.TEXTURE, [GLAttribName.POSITION, GLAttribName.COLOR, GLAttribName.TEXCOORD]);
    this.isSupportMouseMove = true;

  }
  public onMouseMove(evt: CanvasMouseEvent): void {
    if (this._isMouseDown) {
      // let pos = evt.canvasPosition.copy()
      // const v1 = new Vector3([pos.x, pos.y, this.camera.position.z])
      // const v2 = new Vector3([this.lastPos.x, this.lastPos.y, this.camera.position.z])
      // const normal = Vector3.cross(v1, v2)
      // const angle = Math.acos(Vector3.dot(v1.normalize(), v2.normalize()));
      // if (!normal || !angle) {
      //   return
      // }
      // const m = new Matrix4().rotate(angle, normal)
      // console.log(m, angle);
      // if (!m) {
      //   return
      // } 
   
      // Matrix4.product(m, this.camera.viewProjectionMatrix, this.camera.viewProjectionMatrix)
      // this.lastPos = pos
    }
    return;
  }
  protected onMouseDown(evt: CanvasMouseEvent): void {
    this.lastPos = evt.canvasPosition.copy()
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    // 每帧旋转1度
    this.angle += 1;
    // 调用基类方法，这样就能让摄像机进行更新
    super.update(elapsedMsec, intervalSec);
  }
  public drawCoordSystem(): void {
    this.matStack.pushMatrix(); // 矩阵堆栈进栈
    this.matStack.rotate(-10, new Vector3([0, 1, 0]).normalize());
    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );
    DrawHelper.drawCoordSystem(this.builder, Matrix4.m0, 100);
    this.matStack.popMatrix();
  }
  public async run(): Promise<void> {

    // await必须要用于async声明的函数中
    let img = await HttpRequest.loadImageAsync("data/pic1.png");
    let tex = new GLTexture(this.gl);
    tex.upload(img, 0, true);
    tex.filter();
    this.textures = tex
    console.log(tex);

    super.run(); // 调用基类的run方法，基类run方法内部调用了start方法
  }

  public drawByMatrixWithColorShader(): void {
    // this.textures[this.currTexIdx].bind();
    this.matStack.pushMatrix(); // 矩阵堆栈进栈

    this.matStack.rotate(-this.angle, new Vector3([0, 1, 0.5]).normalize());

    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );

    DrawHelper.drawSphere(this.textureBuilder, Matrix4.m0, 50)
    // DrawHelper.drawTextureCubeBox(this.textureBuilder, Matrix4.m0);
    // this.textures[this.currTexIdx].unbind()
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
