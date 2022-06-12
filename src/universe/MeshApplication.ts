import { CameraApplication } from "./lib/CameraApplication";
import { Matrix4, Vector3 } from "./common/math/TSM";
import { GLProgram, GLTexture, HttpRequest } from ".";
import { GLShaderSource } from "./webgl/glsl";
import { BufferInfoCreater } from "./webgl/WebGLBufferInfo";
import { DataType } from "../tinyWebGL/constants";
import { GLSetters } from "./webgl/WebGLProgram";
// import { GLHelper } from "./webgl/WebGLHepler";

export class MeshApplication extends CameraApplication {
  public textures: GLTexture; // 纹理着色器所使用的纹理对象
  public programInfo: GLProgram; // 使用颜色GPU Program对象
  public uniforms: any
  public bufferInfo: any
  public constructor(canvas: HTMLCanvasElement) {
    super(canvas, { premultipliedAlpha: false });
    this.camera.setViewport(0, 0, this.canvas.width, this.canvas.height);
    this.programInfo = new GLProgram(this.gl, GLShaderSource.textureShader_vs, GLShaderSource.textureShader_fs)

  }
  public update(elapsedMsec: number, intervalSec: number): void {
    // 每帧旋转1度
    this.angle += 1;
    // 调用基类方法，这样就能让摄像机进行更新
    super.update(elapsedMsec, intervalSec);
  }

  public async run(): Promise<void> {
    // await必须要用于async声明的函数中
    let img = await HttpRequest.loadImageAsync("data/pic1.png");
    let tex = new GLTexture(this.gl);
    tex.upload(img, 0, true);
    tex.filter();
    this.textures = tex
    super.run(); // 调用基类的run方法，基类run方法内部调用了start方法

    const arrays = {
      a_position: { normalize: false, numComponents: 3, data: new Int8Array([1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1]) },
      a_normal: { normalize: false, numComponents: 3, data: new Int8Array([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]) },
      a_texcoord: { normalize: false, numComponents: 2, data: new Int8Array([1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1]) },
      indices: { data: new Uint16Array([0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23]) },
    };
    this.bufferInfo = BufferInfoCreater.createBufferInfoFromArrays(this.gl, arrays);
    this.uniforms = {
      u_lightWorldPos: [1, 8, 100],
      u_lightColor: [1, 0.8, 0.8, 1],
      u_ambient: [0, 0, 0, 1],
      u_specular: [1, 1, 1, 1],
      u_shininess: 50,
      u_specularFactor: 1
    }
  }

  public render(): void {
    // 使用cleartColor方法设置当前颜色缓冲区背景色是什么颜色
    this.gl.clearColor(0, 0, 0, 1);
    // 调用clear清屏操作
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.disable(this.gl.CULL_FACE);

    this.gl.enable(this.gl.DEPTH_TEST);
    // this.textures[this.currTexIdx].bind();
    this.matStack.pushMatrix(); // 矩阵堆栈进栈

    this.matStack.rotate(-this.angle, new Vector3([0, 1, 0.5]).normalize());

    Matrix4.product(
      this.camera.viewProjectionMatrix,
      this.matStack.modelViewMatrix,
      Matrix4.m0
    );
    this.matStack.popMatrix();

    const worldInverseTranspose = new Matrix4()
    this.uniforms.u_viewInverse = this.camera.invViewMatrix.values;
    this.uniforms.u_world = this.matStack.modelViewMatrix.values;
    this.matStack.modelViewMatrix.inverse(worldInverseTranspose)
    this.uniforms.u_worldInverseTranspose = worldInverseTranspose.transpose().values;
    this.uniforms.u_worldViewProjection = Matrix4.m0.values;

    this.gl.useProgram(this.programInfo.program);
    this.setBuffersAndAttributes(this.gl, this.programInfo, this.bufferInfo);
    this.setUniforms(this.programInfo, this.uniforms);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures.texture);
    this.programInfo.loadSampler();
    this.gl.drawElements(this.gl.TRIANGLES, this.bufferInfo.numElements, this.gl.UNSIGNED_SHORT, 0);
    // 恢复三角形背面剔除功能
    this.gl.enable(this.gl.CULL_FACE);
  }
  setUniforms(programInfo: GLProgram, uniforms: any) {
    for (const name in uniforms) {
      const setter = programInfo.uniformSetters[name];
      if (setter) {
        setter(uniforms[name]);
      }
    }
  }
  setBuffersAndAttributes(gl: WebGL2RenderingContext, programInfo: GLProgram, buffers: any) {
    if (buffers.vertexArrayObject) {
      gl.bindVertexArray(buffers.vertexArrayObject);
    } else {
      this.setAttributes(programInfo.attribSetters, buffers.attribs);
      if (buffers.indices) {
        gl.bindBuffer(DataType.ELEMENT_ARRAY_BUFFER, buffers.indices);
      }
    }
  }
  setAttributes(setters: GLSetters, buffers: any) {
    for (const name in buffers) {
      const setter = setters[name];
      if (setter) {
        setter(buffers[name]);
      }
    }
  }

}
