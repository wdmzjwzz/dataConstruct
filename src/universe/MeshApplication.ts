import { CameraApplication } from "./lib/CameraApplication";
import { GLMeshBuilder } from "./webgl/WebGLMesh";
import { Matrix4, Vector3, Vector4 } from "./common/math/TSM";
import {
  CanvasKeyBoardEvent,
  CanvasMouseEvent,
} from "./lib/Application";
import { DrawHelper, GLProgram, GLTexture, HttpRequest } from ".";
import { Point } from "./Geometry/Point";
import { GLHelper } from "./webgl/WebGLHepler";
import { GLShaderType } from "./webgl/glsl";
import { GLAttribName } from "./type";
import { GLAttribStateManager } from "./webgl/WebGLAttribState";
export class MeshApplication extends CameraApplication {
  public textureBuilder: GLMeshBuilder;
  public textures: GLTexture[] = []; // 纹理着色器所使用的纹理对象
  public currTexIdx: number = 0
  public textureProgram: GLProgram; // 使用颜色GPU Program对象
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, { premultipliedAlpha: false });
    this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.textureBuilder = GLHelper.createBuilder(this.gl, GLShaderType.TEXTURE, [GLAttribName.POSITION, GLAttribName.COLOR, GLAttribName.TEXCOORD]);
    this.isSupportMouseMove = true;
    const bit = GLAttribStateManager.makeVertexAttribs([GLAttribName.POSITION, GLAttribName.COLOR, GLAttribName.TEXCOORD]);
    this.textureProgram = GLProgram.createProgram(GLShaderType.TEXTURE, this.gl, bit)
  }
  public onMouseMove(evt: CanvasMouseEvent): void {
    if (this._isMouseDown) {
      console.log(evt, 1111, this._isMouseDown);
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
    this.matStack.rotate(-10, new Vector3([0, 1, 0]).normalize());
    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );
    DrawHelper.drawCoordSystem(this.builder, Matrix4.m0, 5);
    this.matStack.popMatrix();
  }
  public async run(): Promise<void> {
    // await必须要用于async声明的函数中
    let img: HTMLImageElement = await HttpRequest.loadImageAsync(
      "data/pic0.png"
    );
    let tex: GLTexture = new GLTexture(this.gl);
    tex.upload(img, 0, true);
    tex.filter();
    this.textures.push(tex);
    console.log("1、第一个纹理载入成功！");

    // await必须要用于async声明的函数中
    img = await HttpRequest.loadImageAsync("data/pic1.jpg");
    tex = new GLTexture(this.gl);
    tex.upload(img, 0, true);
    tex.filter();
    this.textures.push(tex);
    console.log("2、第二个纹理载入成功！");

    // 在资源同步加载完成后，直接启动换肤的定时器，每隔2秒，将立方体的皮肤进行周而复始的替换
    this.addTimer(this.cubeTimeCallback.bind(this), 2, false);

    console.log("3、启动Application程序");
    super.run(); // 调用基类的run方法，基类run方法内部调用了start方法
  }
  public cubeTimeCallback(id: number, data: any): void {
    this.currTexIdx++; // 定时让计数器+1
    // 取模操作，让currTexIdx的取值范围为[ 0, 2 ]之间（当前有3个纹理）
    this.currTexIdx %= this.textures.length;
  }
  public drawByMatrixWithColorShader(): void {
    this.textures[this.currTexIdx].bind();
    this.textureProgram.bind();
    this.textureProgram.loadSampler();
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
