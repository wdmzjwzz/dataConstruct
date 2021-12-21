import { attribNames, FLOAT32_SIZE, GLAttribMap } from "../constants";
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
    attribNames.forEach((name) => {
      this.vertexAttrib(gl, name, offsetMap[name]);
    });
  }
  public vertexAttrib(
    gl: WebGLRenderingContext,
    name: GLAttribName,
    offset: number
  ) {
    if (offset !== undefined) {
      // sequenced的话stride为0
      gl.vertexAttribPointer(
        GLAttribMap[name].location,
        GLAttribMap[name].component,
        gl.FLOAT,
        false,
        0,
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

  public getSepratedLayoutAttribOffsetMap(
    attribBits: GLAttribBits
  ): GLAttribOffsetMap {
    // 每个顶点属性使用一个vbo的话，每个offsets中的顶点属性的偏移都是为0
    // 并且offsets的length = vbo的个数，不需要顶点stride和byteLenth属性
    let offsets: GLAttribOffsetMap = {};
    attribNames.forEach((name) => {
      if (this.hasAttrib(name, attribBits)) {
        offsets[name] = 0;
      }
    });
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
