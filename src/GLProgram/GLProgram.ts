import { AttribMap } from "../app/BasicWebGLApplication";
import { EShaderType, GLHelper } from "../utils/GLHelper";
import { GLAttribBits, GLAttribState } from "../utils/GLAttribState";
import { mat4, mat3, vec3, vec4 } from "../math/tsm";
import { GLShaderSource } from "./GLShaderSource";

export class GLProgram {
    // uniforms 相关定义


    public static readonly MVMatrix: string = "uMVMatrix";//模型视图矩阵
    public static readonly ModelMatrix: string = "uModelMatrix";
    public static readonly ViewMatrix: string = "uViewMatrix";//视矩阵
    public static readonly ProjectMatrix: string = "uProjectMatrix";//投影举证
    public static readonly NormalMatrix: string = "uNormalMatrix";//法向矩阵
    public static readonly MVPMatrix: string = "uMVPMatrix";//模型-视图-投影矩阵

    public static readonly Color: string = "uColor";
    public static readonly Sampler: string = "uSampler";

    public static readonly DiffUsSampler: string = "uDiffUsSampler";//漫反射取样器
    public static readonly NormalSampler: string = "uNormalSampler";//法向取样器
    public static readonly SpecularSampler: string = "uSpecularSampler";//高光取样器
    public static readonly DepthSampler: string = "uDepthSampler";//漫反射取样器

    public gl: WebGLRenderingContext;
    public name: string;
    private _attribState: GLAttribBits;
    public program: WebGLProgram;
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;
    public attribMap: AttribMap;
    public uniformMap: AttribMap;
    constructor(gl: WebGLRenderingContext, attribState: GLAttribBits, name: string, vsShader: string | null = null, fsShader: string | null = null) {
        this.gl = gl;
        this._attribState = attribState;
        let shader: WebGLShader | null = GLHelper.createShader(this.gl, EShaderType.VS_SHADER);
        if (!shader) {
            throw new Error("创建shader失败");

        }
        this.vsShader = shader;
        shader = null;
        shader = GLHelper.createShader(this.gl, EShaderType.FS_SHADER);
        if (!shader) {
            throw new Error("创建shader失败");

        }
        this.fsShader = shader;

        let program: WebGLProgram | null = GLHelper.createProgram(this.gl)
        if (!program) {
            throw new Error("创建program失败");
        }
        this.program = program;
        this.attribMap = {}
        this.uniformMap = {}
        if (vsShader && fsShader) {
            this.loadShaders(vsShader, fsShader)
        }
        this.name = name
    }
    public loadShaders(vs: string, fs: string) {
        GLHelper.compileShader(this.gl, vs, this.vsShader)
        if (!GLHelper.compileShader(this.gl, vs, this.vsShader)) {
            throw new Error("loadShaders");
        }
        if (!GLHelper.compileShader(this.gl, fs, this.fsShader)) {
            throw new Error("loadShaders");
        }

        if (!GLHelper.linkProgram(this.gl, this.program, this.vsShader, this.fsShader, this.programBeforeLink.bind(this), this.programAfterLink.bind(this))) {
            throw new Error("linkProgram error");
        }
    }
    private programBeforeLink(gl: WebGLRenderingContext, program: WebGLProgram): void {

        if (GLAttribState.hasPosition(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.POSITION_LOCATION, GLAttribState.POSITION_NAME)
        }
        if (GLAttribState.hasNormal(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.NORMAL_LOCATION, GLAttribState.NORMAL_NAME)
        }
        if (GLAttribState.hasTexCoord_0(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.TEXCOORD_LOCATION, GLAttribState.TEXCOORD_NAME)
        }
        if (GLAttribState.hasTexCoord_1(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.TEXCOORD1_LOCATION, GLAttribState.TEXCOORD1_NAME)
        }
        if (GLAttribState.hasColor(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.COLOR_LOCATION, GLAttribState.COLOR_NAME)
        }
        if (GLAttribState.hasTangent(this._attribState)) {
            gl.bindAttribLocation(program, GLAttribState.TANGRNT_LOCATION, GLAttribState.TANGRNT_NAME)
        }

    }
    private programAfterLink(gl: WebGLRenderingContext, program: WebGLProgram): void {
        GLHelper.getProgramActiveAttribs(gl, program, this.attribMap);
        GLHelper.getProgramActiveUniforms(gl, program, this.uniformMap);
        console.log(this.attribMap, this.uniformMap)
    }
    public bind(): void {
        this.gl.useProgram(this.program)
    }
    public unbind(): void {
        this.gl.useProgram(null)
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {
        return this.gl.getUniformLocation(this.program, name)
    }

    public setMatrix4(name: string, mat: mat4): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc !== null) {
            this.gl.uniformMatrix4fv(loc, false, mat.values)
            return true
        }
        return false
    }
    public setMatrix3(name: string, mat: mat3): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc !== null) {
            this.gl.uniformMatrix3fv(loc, false, mat.values)
            return true
        }
        return false
    }
    public setVec3(name: string, vec: vec3): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc !== null) {
            this.gl.uniform3fv(loc, vec.values)
            return true
        }
        return false
    }
    public setVec4(name: string, vec: vec4): boolean {
        let loc: WebGLUniformLocation | null = this.getUniformLocation(name);
        if (loc !== null) {
            this.gl.uniform4fv(loc, vec.values)
            return true
        }
        return false
    }
    public static createDefaultTextureProgram(gl: WebGLRenderingContext): GLProgram {
        return new GLProgram(gl, GLAttribState.makeVertexAtrribs(true, false, false, false, false), GLShaderSource.textureShader.vs, GLShaderSource.textureShader.fs)
    }
    public static createDefaultColorProgram(gl: WebGLRenderingContext): GLProgram {
        return new GLProgram(gl, GLAttribState.makeVertexAtrribs(false, false, false, false, true), GLShaderSource.colorShader.vs, GLShaderSource.colorShader.fs)
    }
}
