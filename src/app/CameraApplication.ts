/* eslint-disable */
import { Application, CanvasMouseEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "./shaders/shodowColor.vert";
import colorFS from "./shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";

import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Matrix4, Vector2, Vector3 } from "./math/TSM";

export class CameraApplication extends Application {
  public camera: Camera; // 在WebGLApplication的基础上增加了对摄像机系统的支持
  public angle = 0; // 用来更新旋转角度
  public gl: WebGL2RenderingContext;

  public light: BaseLight | null = null;

  public bufferInfo: BufferInfo | null = null;
  public uniformsData: { [key: string]: any } = {};

  public matStack: GLWorldMatrixStack;

  public glProgram: GLProgram;

  public vao: WebGLVertexArrayObject;
  public lastPoint: Vector2 = new Vector2()
  public constructor(canvas: HTMLCanvasElement, camera: Camera) {
    super(canvas);
    const gl = this.canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("canvas.getContext(webgl2) failed");
    }
    const vao = gl.createVertexArray();
    if (!vao) {
      throw new Error("createVertexArray failed");
    }
    this.isSupportMouseMove = true
    this.vao = vao;
    this.gl = gl;
    this.camera = camera;
    this.matStack = new GLWorldMatrixStack();
    this.glProgram = new GLProgram(gl, colorVS, colorFS);
  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void {
    // this.camera.rotate(1, new Vector3([1, 0, 0]))
    this.camera.update(elapsedMsec)
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    if (canvas.width !== canvas.clientWidth) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }
  public start(): void {
    this.resizeCanvasToDisplaySize()
    const { vertexes, colors, indices } = GLHelper.createCubeVertxes()

    const bufferData: { [key: string]: BufferData } = {
      a_position: {
        data: vertexes,
        numComponents: 3
      },
      a_color: {
        data: colors,
        numComponents: 4
      },
      indices: {
        data: indices
      }
    }
    this.bufferInfo = this.glProgram.createBuffers(bufferData)
    super.start();
  }

  public render(): void {
    this.angle += 0.5;
    this.matStack.pushMatrix()
    this.matStack.rotate(this.angle, Vector3.up)
    const projectionMat4 = this.camera.viewProjMatrix
    const modelProjectionMatrix = Matrix4.product(projectionMat4, this.matStack.modelViewMatrix)
    const uniformData = {
      u_matrix: modelProjectionMatrix.values
    }
    this.glProgram.bind()
    this.glProgram.setUniformInfo(uniformData)
    this.glProgram.setAttributeInfo(this.bufferInfo)
    GLHelper.setDefaultState(this.gl)
    // draw 
    this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);
    this.matStack.popMatrix()
  }

  protected onMouseDown(evt: CanvasMouseEvent): void {
    this.lastPoint = this.getMouseOnCircle(evt.canvasPosition.x, evt.canvasPosition.y)
  }
  public onWheel(evt: CanvasMouseEvent) {
    if (evt.wheelDelta < 0) {
      // 前进
      this.camera.moveForward(50)
    } else {
      // 后退
      this.camera.moveForward(-50)
    }
  }

  protected onMouseMove(evt: CanvasMouseEvent): void { 
    if (!this._isMouseDown && !this._isRightMouseDown) {
      return
    }
    
    const endPoint = this.getMouseOnCircle(evt.canvasPosition.x, evt.canvasPosition.y)
    const delta = endPoint.subtract(this.lastPoint) 
    this.lastPoint = this.getMouseOnCircle(evt.canvasPosition.x, evt.canvasPosition.y)
    if (this._isRightMouseDown) {
      this.camera.pan(delta) 
      return
    }
    if (this._isMouseDown) {
      this.camera.roll(delta)
    }
  }

  getMouseOnCircle(pageX: number, pageY: number) {
    const vector = new Vector2() 
    vector.x = -(pageX - this.canvas.width * 0.5) / (this.canvas.width * 0.5)
    vector.y = (pageY - this.canvas.height * 0.5) / (this.canvas.height * 0.5)

    return vector;

  }
}
