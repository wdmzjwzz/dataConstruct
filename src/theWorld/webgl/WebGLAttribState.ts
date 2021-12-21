import { ATTRIBBYTELENGTH, attribNames, ATTRIBSTRIDE, FLOAT32_SIZE, GLAttribMap } from "../constants";
import { GLAttribBits, GLAttribName, GLAttribOffsetMap } from "../type";

class GLAttribState {
  private static _instance: GLAttribState;
  static get instance() {
    if (!GLAttribState._instance) {
      GLAttribState._instance = new GLAttribState();
    }
    return GLAttribState._instance;
  }

  public makeVertexAttribs(names: GLAttribName[]): GLAttribBits {
    let bits: GLAttribBits = 0;
    names.forEach((name) => {
      bits |= GLAttribMap[name].bit;
    });
    return bits;
  }

  public setAttribVertexArrayPointer(
    gl: WebGLRenderingContext,
    offsetMap: GLAttribOffsetMap
  ): void {
    let stride: number = offsetMap[ATTRIBSTRIDE];
    if (stride === 0) {
      throw new Error("vertex Array有问题！！");
    }
    attribNames.forEach((name) => {
      this.vertexAttrib(gl, name, stride, offsetMap[name]);
    });
  }
  public vertexAttrib(
    gl: WebGLRenderingContext,
    name: GLAttribName,
    stride: number,
    offset: number
  ) {
    if (offset !== undefined) {
      gl.vertexAttribPointer(
        GLAttribMap[name].location,
        GLAttribMap[name].component,
        gl.FLOAT,
        false,
        stride,
        offset
      );
    }
  }
  public setAttribVertexArrayState(
    gl: WebGLRenderingContext,
    attribBits: number,
    enable: boolean = true
  ): void {
    attribNames.forEach((name) => {
      if (this.hasAttrib(name, attribBits) && enable) {
        gl.enableVertexAttribArray(GLAttribMap[name].location);
      } else {
        gl.disableVertexAttribArray(GLAttribMap[name].location);
      }
    });
  }

  public getVertexByteStride(attribBits: GLAttribBits): number {
    let byteOffset: number = 0;
    attribNames.forEach((name) => {
      if (this.hasAttrib(name, attribBits)) {
        byteOffset += GLAttribMap[name].component * FLOAT32_SIZE;
      }
    });

    return byteOffset;
  }
  public getInterleavedLayoutAttribOffsetMap(
    attribBits: GLAttribBits
  ): GLAttribOffsetMap {
    let offsets: GLAttribOffsetMap = {}; // 初始化顶点属性偏移表
    let byteOffset: number = 0; // 初始化时的首地址为0

    attribNames.forEach((name) => {
      if (this.hasAttrib(name, attribBits)) {
        offsets[name] = byteOffset;
        byteOffset += GLAttribMap[name].component * FLOAT32_SIZE;
      }
    });

    // stride和length相等
    offsets[ATTRIBSTRIDE] = byteOffset; // 间隔数组方法存储的话，顶点的stride非常重要
    offsets[ATTRIBBYTELENGTH] = byteOffset;

    return offsets;
  }

  public isAttribStateValid(attribBits: number): boolean {
    // 一定要有位置向量
    if (!this.hasAttrib(GLAttribName.POSITION, attribBits)) {
      return false;
    }
    return true;
  }
  public hasAttrib(name: GLAttribName, attribBits: number) {
    const bit = GLAttribMap[name].bit;
    return (attribBits & bit) !== 0;
  }
}
export const GLAttribStateManager = GLAttribState.instance;
