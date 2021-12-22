import { CameraApplication } from "../theWorld/lib/CameraApplication";
import { GLMeshBuilder } from "../theWorld/webgl/WebGLMesh";
import { mat4, vec3 } from "../theWorld/common/math/TSM";
import { GLProgram } from "../theWorld/webgl/WebGLProgram";
import { GLCoordSystem } from "../theWorld/webgl/WebGLCoordSystem";
import { CanvasKeyBoardEvent } from "../theWorld/common/Application";
import { GLTexture } from "../theWorld/webgl/WebGLTexture";
import { Point } from "../theWorld/Geometry/Point";
import { DrawHelper } from "../theWorld";
export class MeshApplication extends CameraApplication {
  public colorShader: GLProgram; // 颜色着色器
  public textureShader: GLProgram; // 纹理着色器
  public texture: GLTexture; // 纹理着色器所使用的纹理对象
  public builder: GLMeshBuilder;

  public angle: number = 0; // 用来更新旋转角度
  public coords: GLCoordSystem; // 用于多视口渲染使用的GLCoordSystem对象
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, { premultipliedAlpha: false }, true);
    this.coords = new GLCoordSystem([0, 0, this.canvas.height]);
  }

  public update(elapsedMsec: number, intervalSec: number): void {
    // 每帧旋转1度
    this.angle += 1;
    // 调用基类方法，这样就能让摄像机进行更新
    super.update(elapsedMsec, intervalSec);
  }

  public drawByMatrixWithColorShader(): void {
    // 很重要，由于我们后续使用多视口渲染，因此必须要调用camera的setviewport方法
    this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
    // 使用cleartColor方法设置当前颜色缓冲区背景色是什么颜色
    this.gl.clearColor(0, 0, 0, 1);
    // 调用clear清屏操作
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // 关闭三角形背面剔除功能，这是因为在初始化是，我们是开启了该功能
    // 但是由于我们下面会渲染三角形和四边形这两个2d形体，所以要关闭，否则不会显示三角形或四边形的背面部分
    this.gl.disable(this.gl.CULL_FACE);

    // EVertexLayout.SEPARATED 顶点存储格式绘制绘制绕[ 1 , 1 , 1 ]轴转转的立方体
    this.matStack.pushMatrix(); // 矩阵堆栈进栈
    {
      // this.matStack.translate(new vec3([1, 1, 0]));
      this.matStack.rotate(-this.angle, new vec3([0, 1, 0]).normalize());

      // 合成model-view-projection矩阵，存储到mat4的静态变量中，减少内存的重新分配
      mat4.product(
        this.camera.viewProjectionMatrix,
        this.matStack.modelViewMatrix,
        mat4.m0
      );
      DrawHelper.drawCoordSystem(this.builder, mat4.m0, 1);
      DrawHelper.drawSolidCubeBox(this.builder, mat4.m0); // 调用DrawHelper类的静态drawWireFrameCubeBox方法
      this.createPoints([new Point(0.8, 0, 0), new Point(0, 0, 0)], mat4.m0);

      this.matStack.popMatrix();
    }
    // 恢复三角形背面剔除功能
    this.gl.enable(this.gl.CULL_FACE);
  }

  public render(): void {
    // 调用的的currentDrawMethod这个回调函数，该函数指向当前要渲染的页面方法
    this.drawByMatrixWithColorShader();
  }
  public createPoints(points: Point[], mat: mat4) {
    this.builder.begin(this.gl.POINTS);
    this.builder
      .color(0, 0, 1)
      .size(20)
      .vertex(points[0].x, points[0].y, points[0].z);
    this.builder
      .color(0, 1, 0)
      .size(10)
      .vertex(points[1].x, points[1].y, points[1].z);
    this.builder.end(mat); // 向GPU提交绘制命令
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void {
    super.onKeyPress(evt);
  }
}
