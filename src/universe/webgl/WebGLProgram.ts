import { GLAttribStateManager } from "./WebGLAttribState";
import { Vector2, Vector3, Vector4, Matrix4, quat } from "../common/math/TSM";
 
import { GLHelper } from "./WebGLHepler";
import { GLAttribBits } from "../type";
import { attribNames, GLAttribMap } from "../constants";
import { GLShaderSource, GLShaderType } from "./glsl";
/*
比较特别的是Texture Unit
glActiveTexture 激活某个TextureUnit
glBindTexture   激活的TextureUnit中放入纹理
glUniform1i     将unit所绑定的纹理sampler传输到GPU

绘制时，不需要ActiveTexture了，只要bingTexture就可以了
*/
// camera相关transform uniform可以预先设定
// texture相关，固定化，可以预先设定
// 其他需要每帧更新

export class GLProgram {
  // uniforms相关定义

  //vs常用的uniform命名
  public static readonly MVMatrix: string = "uMVMatrix"; // 模型视图矩阵
  public static readonly ModelMatrix: string = "uModelMatrix"; // 模型矩阵
  public static readonly ViewMatrix: string = "uViewMatrix"; // 视矩阵
  public static readonly ProjectMatrix: string = "uProjectMatrix"; // 投影矩阵
  public static readonly NormalMatrix: string = "uNormalMatrix"; // 法线矩阵
  public static readonly MVPMatrix: string = "uMVPMatrix"; // 模型_视图_投影矩阵
  public static readonly Color: string = "uColor"; // 颜色值

  //ps常用的uniform命名
  public static readonly Sampler: string = "uSampler"; // 纹理取样器
  public static readonly DiffuseSampler: string = "uDiffuseSampler"; // 漫反射取样器
  public static readonly NormalSampler: string = "uNormalSampler"; // 法线取样器
  public static readonly SpecularSampler: string = "uSpecularSampler"; // 高光取样器
  public static readonly DepthSampler: string = "uDepthSampler"; // 深度取样器

  public gl: WebGLRenderingContext; // WebGL上下文渲染对象
  public name: string; // program名

  private _attribState: GLAttribBits; // 当前的Program使用的顶点属性bits值

  public program: WebGLProgram; // 链接器
  public vsShader: WebGLShader; // vertex shader编译器
  public fsShader: WebGLShader; // fragment shader编译器

  public get attribState(): GLAttribBits {
    return this._attribState;
  }

  private progromBeforeLink(
    gl: WebGLRenderingContext,
    program: WebGLProgram
  ): void {
    //链接前才能使用bindAttribLocation函数
    //1 attrib名字必须和shader中的命名要一致
    //2 数量必须要和mesh中一致
    //3 mesh中的数组的component必须固定
    attribNames.forEach((name) => {
      if (GLAttribStateManager.hasAttrib(name, this._attribState)) {
        gl.bindAttribLocation(program, GLAttribMap[name].location, name);
      }
    });
  }

  public constructor(
    context: WebGLRenderingContext,
    attribState: GLAttribBits,
    vsShader: string,
    fsShader: string,
    name: string = ""
  ) {
    this.gl = context;
    this._attribState = attribState; //最好从shader中抽取

    this.vsShader = this.gl.createShader(this.gl.VERTEX_SHADER);

    this.fsShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

    this.program = this.gl.createProgram();

    this.loadShaders(vsShader, fsShader);

    this.name = name;
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

  public loadModeViewMatrix(mat: Matrix4): boolean {
    return this.setMatrix4(GLProgram.MVMatrix, mat);
  }

  public loadSampler(unit: number = 0): boolean {
    return this.setSampler(GLProgram.Sampler, unit);
  }

  public static createProgram(
    type: GLShaderType,
    gl: WebGLRenderingContext,
    bit: GLAttribBits
  ): GLProgram {
    let pro: GLProgram = new GLProgram(
      gl,
      bit,
      GLShaderSource[type].vs,
      GLShaderSource[type].fs
    );
    return pro;
  }
}
