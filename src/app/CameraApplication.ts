/* eslint-disable */
import { Application, CanvasKeyBoardEvent } from "./Application";
import { Camera } from "./Camera";

import colorVS from "./shaders/shodowColor.vert";
import colorFS from "./shaders/shodowColor.frag";

import { BaseLight } from "./Light/BaseLight";
import { GLWorldMatrixStack } from "./GLMatrixStack";

import GLProgram, { BufferData, BufferInfo } from "./GLProgram";
import { GLHelper } from "./GLHepler";
import { Matrix4 } from "./math/TSM";

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
    var colors = [
      [1.0, 1.0, 1.0, 1.0],    // Front face: white
      [1.0, 0.0, 0.0, 1.0],    // Back face: red
      [0.0, 1.0, 0.0, 1.0],    // Top face: green
      [0.0, 0.0, 1.0, 1.0],    // Bottom face: blue
      [1.0, 1.0, 0.0, 1.0],    // Right face: yellow
      [1.0, 0.0, 1.0, 1.0]     // Left face: purple
    ];

    let generatedColors: number[] = [];

    for (let j = 0; j < 6; j++) {
      var c = colors[j];

      for (var i = 0; i < 4; i++) {
        generatedColors = generatedColors.concat(c);
      }
    }

    const bufferData: { [key: string]: BufferData } = {
      a_position: {
        data: new Float32Array([
          -100, -100, 100,
          100, -100, 100,
          100, 100, 100,
          -100, 100, 100,

          // Back face
          -100, -100, -100,
          -100, 100, -100,
          100, 100, -100,
          100, -100, -100,

          // Top face
          -100, 100, -100,
          -100, 100, 100,
          100, 100, 100,
          100, 100, -100,

          // Bottom face
          -100, -100, -100,
          100, -100, -100,
          100, -100, 100,
          -100, -100, 100,

          // Right face
          100, -100, -100,
          100, 100, -100,
          100, 100, 100,
          100, -100, 100,

          // Left face
          -100, -100, -100,
          -100, -100, 100,
          -100, 100, 100,
          -100, 100, -100
        ]),
        numComponents: 3
      },
      a_color: {
        data: new Uint8Array(generatedColors),
        numComponents: 4
      },
      indices: {
        data: new Uint8Array([
          0, 1, 2, 0, 2, 3,    // front
          4, 5, 6, 4, 6, 7,    // back
          8, 9, 10, 8, 10, 11,   // top
          12, 13, 14, 12, 14, 15,   // bottom
          16, 17, 18, 16, 18, 19,   // right
          20, 21, 22, 20, 22, 23    // left
        ])
      }
    }
    const buffers = GLHelper.createBuffers(this.gl, bufferData)
    const mat4 = new Matrix4();
    // mat4.translate(new Vector3([-0.4, 0, 0]));
    // mat4.rotate(Math.PI / 4, Vector3.up)
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
    var count = 36;
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
