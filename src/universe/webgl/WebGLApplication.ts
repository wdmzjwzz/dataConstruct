import { Application } from "../lib/Application";
import { GLWorldMatrixStack } from "./WebGLMatrixStack";
import { GLHelper } from "./WebGLHepler";


export class WebGLApplication extends Application {
  // 可以直接操作WebGL相关内容
  public gl: WebGL2RenderingContext;
 
  public matStack: GLWorldMatrixStack;
  public constructor(
    canvas: HTMLCanvasElement,
    contextAttributes: WebGLContextAttributes = { premultipliedAlpha: false },
  ) {
    super(canvas);
    this.gl = this.canvas.getContext("webgl2", contextAttributes);
    this.matStack = new GLWorldMatrixStack();
    // 初始化渲染状态
    GLHelper.setDefaultState(this.gl);
 
  }
}
