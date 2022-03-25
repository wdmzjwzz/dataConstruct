import { Application } from "../lib/Application";
import { GLWorldMatrixStack } from "./WebGLMatrixStack";
import { GLMeshBuilder } from "./WebGLMesh";
import { GLHelper } from "./WebGLHepler";
import { GLShaderType } from "./glsl";
 

export class WebGLApplication extends Application {
  // 可以直接操作WebGL相关内容
  public gl: WebGLRenderingContext;

  // 模拟OpenGL1.1中矩阵堆栈
  // 封装在GLWorldMatrixStatc中
  public matStack: GLWorldMatrixStack;

  // 模拟OpenGL1.1中的立即绘制模式
  // 封装在GLMeshBuilder类中
  public builder: GLMeshBuilder;

  // 为了在3D环境中同时支持Canvas2D绘制，特别是为了实现文字绘制
  protected canvas2D: HTMLCanvasElement | null = null;
  protected ctx2D: CanvasRenderingContext2D | null = null;

  public constructor(
    canvas: HTMLCanvasElement,
    contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false },
  ) {
    super(canvas);
    this.gl = this.canvas.getContext("webgl", contextAttributes);


    this.matStack = new GLWorldMatrixStack();
    // 初始化渲染状态
    GLHelper.setDefaultState(this.gl);

    // 由于Canvas是左手系，而webGL是右手系，需要FilpYCoord
    this.isFlipYCoord = true;
    // 初始化时，创建颜色GLMeshBuilder对象
    this.builder = GLHelper.createBuilder(this.gl, GLShaderType.COLOR);
  }

  protected getMouseCanvas(): HTMLCanvasElement {
    if (this.canvas2D !== null && this.ctx2D !== null) {
      return this.canvas2D;
    } else {
      return this.canvas;
    }
  }
}
