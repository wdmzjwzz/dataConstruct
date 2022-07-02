/* eslint-disable */
import { Application, CanvasKeyBoardEvent, CanvasMouseEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "./shaders/shodowColor.vert";
import colorFS from "./shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";

import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Vector3 } from "./math/TSM";
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
    this.angle += 0.1;
    const projectionMat4 = this.camera.viewProjMatrix
    const uniformData = {
      u_matrix: projectionMat4.values
    }
    this.glProgram.bind()
    this.glProgram.setUniformInfo(uniformData)
    this.glProgram.setAttributeInfo(this.bufferInfo)
    GLHelper.setDefaultState(this.gl)
    // draw 
    this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);

  }
  degToRad(d: number) {
    return (d * Math.PI) / 180;
  }

  public onWheel(evt: CanvasMouseEvent) {
    console.log(evt, 1111);
    // const position = [evt.x, evt.y]
    // 放大
    if (evt.wheelDelta < 0) {
      
    } else {
      // 缩小
    }

  }
}
