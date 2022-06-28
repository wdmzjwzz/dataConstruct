/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "./shaders/shodowColor.vert";
import colorFS from "./shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";

import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Matrix4, Vector3 } from "./math/TSM";

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
        data: new Float32Array([
          0, 0, 0,
          0, 150, 0,
          30, 0, 0,
          0, 150, 0,
          30, 150, 0,
          30, 0, 0,

          // top rung front
          30, 0, 0,
          30, 30, 0,
          100, 0, 0,
          30, 30, 0,
          100, 30, 0,
          100, 0, 0,

          // middle rung front
          30, 60, 0,
          30, 90, 0,
          67, 60, 0,
          30, 90, 0,
          67, 90, 0,
          67, 60, 0,

          // left column back
          0, 0, 30,
          30, 0, 30,
          0, 150, 30,
          0, 150, 30,
          30, 0, 30,
          30, 150, 30,

          // top rung back
          30, 0, 30,
          100, 0, 30,
          30, 30, 30,
          30, 30, 30,
          100, 0, 30,
          100, 30, 30,

          // middle rung back
          30, 60, 30,
          67, 60, 30,
          30, 90, 30,
          30, 90, 30,
          67, 60, 30,
          67, 90, 30,

          // top
          0, 0, 0,
          100, 0, 0,
          100, 0, 30,
          0, 0, 0,
          100, 0, 30,
          0, 0, 30,

          // top rung right
          100, 0, 0,
          100, 30, 0,
          100, 30, 30,
          100, 0, 0,
          100, 30, 30,
          100, 0, 30,

          // under top rung
          30, 30, 0,
          30, 30, 30,
          100, 30, 30,
          30, 30, 0,
          100, 30, 30,
          100, 30, 0,

          // between top rung and middle
          30, 30, 0,
          30, 60, 30,
          30, 30, 30,
          30, 30, 0,
          30, 60, 0,
          30, 60, 30,

          // top of middle rung
          30, 60, 0,
          67, 60, 30,
          30, 60, 30,
          30, 60, 0,
          67, 60, 0,
          67, 60, 30,

          // right of middle rung
          67, 60, 0,
          67, 90, 30,
          67, 60, 30,
          67, 60, 0,
          67, 90, 0,
          67, 90, 30,

          // bottom of middle rung.
          30, 90, 0,
          30, 90, 30,
          67, 90, 30,
          30, 90, 0,
          67, 90, 30,
          67, 90, 0,

          // right of bottom
          30, 90, 0,
          30, 150, 30,
          30, 90, 30,
          30, 90, 0,
          30, 150, 0,
          30, 150, 30,

          // bottom
          0, 150, 0,
          0, 150, 30,
          30, 150, 30,
          0, 150, 0,
          30, 150, 30,
          30, 150, 0,

          // left side
          0, 0, 0,
          0, 0, 30,
          0, 150, 30,
          0, 0, 0,
          0, 150, 30,
          0, 150, 0,
        ]),
        numComponents: 3
      },
      a_color: {
        data: new Uint8Array([
          // left column front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // top rung front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // middle rung front
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,
          200, 70, 120,

          // left column back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // top rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // middle rung back
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,
          80, 70, 200,

          // top
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,
          70, 200, 210,

          // top rung right
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,
          200, 200, 70,

          // under top rung
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,
          210, 100, 70,

          // between top rung and middle
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,
          210, 160, 70,

          // top of middle rung
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,
          70, 180, 210,

          // right of middle rung
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,
          100, 70, 210,

          // bottom of middle rung.
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,
          76, 210, 100,

          // right of bottom
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,
          140, 210, 80,

          // bottom
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,
          90, 130, 110,

          // left side
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
          160, 160, 220,
        ]),
        numComponents: 3
      }
    }
    const buffers = GLHelper.createBuffers(this.gl, bufferData)
    const mat4 = new Matrix4();
    mat4.translate(new Vector3([-0.4, 0, 0]));
    mat4.rotate(Math.PI / 4, Vector3.up)
    const projectionMat4 = this.camera.viewProjection
    const mvpMat4 = Matrix4.product(mat4, projectionMat4)
    const uniformData = { 
      u_matrix: mvpMat4.values
    }
    this.glProgram.bind()
    this.glProgram.setUniformInfo(uniformData)
    this.glProgram.setAttributeInfo(buffers)
    GLHelper.setDefaultState(this.gl)
    // draw
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = 16 * 6;
    this.gl.drawArrays(primitiveType, offset, count);
    super.start();
  }

  public render(): void {

  }
  degToRad(d: number) {
    return (d * Math.PI) / 180;
  }
  public onKeyPress(evt: CanvasKeyBoardEvent): void { }
}
