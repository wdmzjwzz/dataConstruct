import { mat4, vec3 } from "../math/tsm"
import { Application } from "./Application";
import { EShaderType, GLHelper } from "./GLHelper";
import colorShader from "./glsl/colorShader_vs.vert"
import colorShader_fs from "./glsl/colorShader_fs.frag"
export class BasicWebGLApplication extends Application {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas);
        let contextAttribs: WebGLContextAttributes = {
            depth: true,
            stencil: true,
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
            preserveDrawingBuffer: false
        };

        let ctx: WebGLRenderingContext | null = this.canvas.getContext("webgl", contextAttribs)
        if (ctx === null) {
            throw new Error("无法创建ctx");

        }
        this.gl = ctx
        this.canvas.addEventListener("webglcontextlost", (e) => {
            console.log(JSON.stringify(e), "webglcontextlost")
        }, false)
        // GLHelper.triggerContextLostEvent(this.gl)
        // 投影举证
        this.projectMatrix = mat4.perspective(1, this.canvas.width / this.canvas.height, 0.1, 100)
        // 视矩阵
        this.viewMatrix = mat4.lookAt(new vec3([0, 0, 5]), new vec3())
        this.viewProjectMatrix = mat4.product(this.projectMatrix, this.viewMatrix, new mat4())
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl.scissor(0, 0, this.canvas.width, this.canvas.height)
        this.gl.enable(this.gl.SCISSOR_TEST)


        this.vsShader = GLHelper.createShader(this.gl, EShaderType.VS_SHADER)
        GLHelper.compileShader(this.gl, this.colorShader_vs, this.vsShader)

        this.fsShader = GLHelper.createShader(this.gl, EShaderType.FS_SHADER)
        GLHelper.compileShader(this.gl, this.colorShader_fs, this.fsShader)

        this.program = GLHelper.createProgram(this.gl)
        GLHelper.linkProgram(this.gl, this.program, this.vsShader, this.fsShader, null, this.printProgramActiveInfo.bind(this))
    }
    public gl: WebGLRenderingContext;
    public projectMatrix: mat4;
    public viewMatrix: mat4;
    public viewProjectMatrix: mat4

    public colorShader_vs: string = colorShader
    public colorShader_fs: string = colorShader_fs
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;
    public program: WebGLProgram;


    public printProgramActiveInfo(): void {
        GLHelper.getProgramActiveAttribs(this.gl, this.program);
        GLHelper.getProgramActiveUniforms(this.gl, this.program)
    }
}