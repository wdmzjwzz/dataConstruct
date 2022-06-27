/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "./shaders/shodowColor.vert";
import colorFS from "./shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";

import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";

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
    this.vao = vao;
    this.gl = gl;
    this.camera = camera;
    this.matStack = new GLWorldMatrixStack();
    this.glProgram = new GLProgram(gl, colorVS, colorFS);
  }
  public addLight(light: BaseLight) {
    this.light = light;
  }
  public update(elapsedMsec: number, intervalSec: number): void { }

  resizeCanvasToDisplaySize() {
    const canvas = this.gl.canvas as HTMLCanvasElement;
    if (canvas.width !== canvas.clientWidth) {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }
  public start(): void {
    this.resizeCanvasToDisplaySize()

    const bufferData: { [key: string]: BufferData } = {
      a_position: {
        data: new Float32Array([0, 0, 0, 0.5, 0.7, 0.5, 0.7, 0,]),
        numComponents: 2
      },
      indices: {
        data: new Uint16Array([0, 1, 2, 0, 2, 3])
      }
    }
    const buffers = GLHelper.createBuffers(this.gl, bufferData)

    const uniformData = {
      u_color: new Uint16Array([0, 1, 1, 1])
    }
    this.glProgram.bind()
    this.glProgram.setUniformInfo(uniformData) 
    this.glProgram.setAttributeInfo(buffers)
    GLHelper.setDefaultState(this.gl)
    // draw
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    this.gl.drawElements(primitiveType, count, this.gl.UNSIGNED_SHORT, offset);
    super.start();
  }

  public render(): void {

  }
  degToRad(d: number) {
    return (d * Math.PI) / 180;
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void { }
}
