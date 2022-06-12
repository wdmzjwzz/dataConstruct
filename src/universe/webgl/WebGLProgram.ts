
import { Vector2, Vector3, Vector4, Matrix4, quat } from "../common/math/TSM";

import { GLHelper } from "./WebGLHepler";
import { attrTypeMap } from "../../tinyWebGL/attriMap";
import { typeMap } from "../../tinyWebGL/programTypeMap";

export interface GLSetters {
  [key: string]: (...arg: any) => boolean
}
export class GLProgram {

  public gl: WebGL2RenderingContext; // WebGL上下文渲染对象
  public name: string; // program名


  public program: WebGLProgram; // 链接器
  public vsShader: WebGLShader; // vertex shader编译器
  public fsShader: WebGLShader; // fragment shader编译器

  public attribSetters: GLSetters = {};
  public uniformSetters: GLSetters = {};

  private progromBeforeLink(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ): void {
    //链接前才能使用bindAttribLocation函数 

  }

  public constructor(
    context: WebGL2RenderingContext,
    vsShader: string,
    fsShader: string,
  ) {
    this.gl = context;

    this.vsShader = this.gl.createShader(this.gl.VERTEX_SHADER);

    this.fsShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.program = this.gl.createProgram();

    this.loadShaders(vsShader, fsShader);

    this.loadAttribSetters()
    this.loadUniformSetters()
  }
  public loadShaders(vs: string, fs: string): void {
    GLHelper.compileShader(this.gl, vs, this.vsShader);
    GLHelper.compileShader(this.gl, fs, this.fsShader);
    GLHelper.linkProgram(
      this.gl,
      this.program,
      this.vsShader,
      this.fsShader,
      this.progromBeforeLink.bind(this)
    );

    //获取当前active状态的attribute和uniform的数量
    //很重要一点，active_attributes/uniforms必须在link后才能获得
    GLHelper.logProgramActiveAttribs(this.gl, this.program);
    GLHelper.logProgramAtciveUniforms(this.gl, this.program);
  }
  public loadAttribSetters() {
    const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < numAttribs; ++i) {
      const attribInfo = this.gl.getActiveAttrib(this.program, i);
      const index = this.gl.getAttribLocation(this.program, attribInfo.name);
      const typeInfo = attrTypeMap[attribInfo.type];
      const setter = typeInfo.setter(this.gl, index, typeInfo);
      setter.location = index;
      if (!this.attribSetters[attribInfo.name]) {
        this.attribSetters[attribInfo.name] = null
      }
      this.attribSetters[attribInfo.name] = setter;
    }
  }

  public loadUniformSetters() {

    const uniformSetters: any = this.uniformSetters;
    // const uniformTree = {};
    const numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);


    for (let ii = 0; ii < numUniforms; ++ii) {
      const uniformInfo = this.gl.getActiveUniform(this.program, ii);
      let name = uniformInfo.name;
      const location = this.gl.getUniformLocation(this.program, uniformInfo.name);
      // the uniform will have no location if it's in a uniform block
      if (!location) {
        continue;
      }
      const setter = this.createUniformSetter(uniformInfo, location);
      uniformSetters[name] = setter;
    }

  }

  private createUniformSetter(uniformInfo: WebGLActiveInfo, location: WebGLUniformLocation) {
    let textureUnit = 0; 
    const type = uniformInfo.type;
    const typeInfo = typeMap[type];
    if (!typeInfo) {
      throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
    }
    let setter;
    if (typeInfo.bindPoint) {
      // it's a sampler
      const unit = textureUnit;
      textureUnit += uniformInfo.size;
      debugger
      setter = typeInfo.setter(this.gl, type, unit, location, uniformInfo.size);
    } else {
      setter = typeInfo.setter(this.gl, location);
    }
    setter.location = location;
    return setter;
  }
  public bind(): void {
    this.gl.useProgram(this.program);
  }

  public unbind(): void {
    this.gl.useProgram(null);
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    return this.gl.getUniformLocation(this.program, name);
  }

  public getAttributeLocation(name: string): number {
    return this.gl.getAttribLocation(this.program, name);
  }

  public setAttributeLocation(name: string, loc: number): void {
    this.gl.bindAttribLocation(this.program, loc, name);
  }

  public loadSampler(unit: number = 0): boolean {
    return this.setSampler('u_diffuse', unit);
  }

  public setInt(name: string, i: number): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1i(loc, i);
      return true;
    }
    return false;
  }

  public setFloat(name: string, f: number): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1f(loc, f);
      return true;
    }
    return false;
  }

  public setVector2(name: string, v2: Vector2): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform2fv(loc, v2.values);
      return true;
    }
    return false;
  }

  public setVector3(name: string, v3: Vector3): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform3fv(loc, v3.values);
      return true;
    }
    return false;
  }

  public setVector4(name: string, v4: Vector4): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform4fv(loc, v4.values);
      return true;
    }
    return false;
  }

  public setQuat(name: string, q: quat): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform4fv(loc, q.values);
      return true;
    }
    return false;
  }

  public setMatrix3(name: string, mat: Matrix4): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniformMatrix3fv(loc, false, mat.values);
      return true;
    }
    return false;
  }

  public setMatrix4(name: string, mat: Matrix4): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniformMatrix4fv(loc, false, mat.values);
      return true;
    }
    return false;
  }

  public setSampler(name: string, sampler: number): boolean {
    let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
    if (loc) {
      this.gl.uniform1i(loc, sampler);
      return true;
    }
    return false;
  }

}
