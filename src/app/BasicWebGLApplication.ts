import { mat4, vec3 } from "../math/tsm"
import { Application } from "./Application";
import { EShaderType, GLHelper } from "./GLHelper";
import colorShader from "./glsl/colorShader_vs.vert"
import colorShader_fs from "./glsl/colorShader_fs.frag"
import { TypedArrayList } from "../tree/TypedArrayList";
export interface AttribMap {
    [name: string]: any
}
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
        this.viewMatrix = mat4.lookAt(new vec3([0, 0, 100]), new vec3())
        this.viewProjectMatrix = mat4.product(this.projectMatrix, this.viewMatrix, new mat4())
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
        this.gl.scissor(0, 0, this.canvas.width, this.canvas.height)
        this.gl.enable(this.gl.SCISSOR_TEST)


        this.vsShader = GLHelper.createShader(this.gl, EShaderType.VS_SHADER)
        GLHelper.compileShader(this.gl, this.colorShader_vs, this.vsShader)

        this.fsShader = GLHelper.createShader(this.gl, EShaderType.FS_SHADER)
        GLHelper.compileShader(this.gl, this.colorShader_fs, this.fsShader)

        this.program = GLHelper.createProgram(this.gl)
        this.attribMap = {};
        const linkProgram = GLHelper.linkProgram(this.gl, this.program, this.vsShader, this.fsShader, null, this.printProgramActiveInfo.bind(this))
        if (linkProgram) {
            this.printProgramActiveInfo()
        }
        this.verts = new TypedArrayList(Float32Array, 6 * 7);
        this.ivbo = GLHelper.createBuffer(this.gl);

        this.evbo = GLHelper.createBuffer(this.gl)
        this.indices = new TypedArrayList(Uint16Array, 6)
    }
    public gl: WebGLRenderingContext;
    public projectMatrix: mat4;
    public viewMatrix: mat4;
    public viewProjectMatrix: mat4
    public attribMap: AttribMap;

    public colorShader_vs: string = colorShader
    public colorShader_fs: string = colorShader_fs
    public vsShader: WebGLShader;
    public fsShader: WebGLShader;
    public program: WebGLProgram;

    public verts: TypedArrayList<Float32Array>;
    public ivbo: WebGLBuffer;

    public evbo: WebGLBuffer;
    public indices: TypedArrayList<Uint16Array>;
    public printProgramActiveInfo(): void {
        GLHelper.getProgramActiveAttribs(this.gl, this.program, this.attribMap);
        GLHelper.getProgramActiveUniforms(this.gl, this.program, this.attribMap)
    }
    public drawRectByInterleavedVBO(first: number, count: number) {
        this.verts.clear()
        let data: number[] = [
            -0.5, -0.5, 0, 1, 0, 0, 1,
            0.5, -0.5, 0, 0, 1, 0, 1,
            0.5, 0.5, 0, 0, 0, 1, 0,

            0.5, 0.5, 0, 0, 0, 1, 0,
            -0.5, 0.5, 0, 0, 1, 0, 1,
            -0.5, -0.5, 0, 1, 0, 0, 1
        ]
        this.verts.pushArray(data)
        console.log(this.verts.subArray())
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ivbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.verts.subArray(), this.gl.DYNAMIC_DRAW);

        this.gl.vertexAttribPointer(this.attribMap["aPosition"].location, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0)
        this.gl.vertexAttribPointer(this.attribMap["aColor"].location, 4, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 3 * 4);
        this.gl.enableVertexAttribArray(this.attribMap["aPosition"].location);
        this.gl.enableVertexAttribArray(this.attribMap["aColor"].location);
        // 绘制
        this.gl.useProgram(this.program);
        this.gl.uniformMatrix4fv(this.attribMap['uMVMatrix'].location, false, this.viewProjectMatrix.values);
        this.gl.drawArrays(this.gl.TRIANGLES, first, count);


        this.gl.useProgram(null)
        this.gl.disableVertexAttribArray(this.attribMap["aPosition"].location)
        this.gl.disableVertexAttribArray(this.attribMap["aColor"].location)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    }
    public drawRectByInterleavedWithEBO(count: number, mode: number = this.gl.TRIANGLES) {
        this.verts.clear()
        let data: number[] = [
            -0.5, -0.5, 0, 1, 0, 0, 1,
            0.5, -0.5, 0, 0, 1, 0, 1,
            0.5, 0.5, 0, 0, 0, 1, 0,
            -0.5, 0.5, 0, 0, 1, 0, 1
        ]

        this.indices.clear();
        if (mode === this.gl.TRIANGLES || mode === this.gl.TRIANGLE_FAN) {
            this.indices.pushArray([0, 1, 2, 0, 2, 3])
        } else if (mode === this.gl.TRIANGLE_STRIP) {
            this.indices.pushArray([0, 1, 2, 2, 3, 0])
        }
        this.verts.pushArray(data)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.ivbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.verts.subArray(), this.gl.DYNAMIC_DRAW);

        this.gl.vertexAttribPointer(this.attribMap["aPosition"].location, 3, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0)
        this.gl.vertexAttribPointer(this.attribMap["aColor"].location, 4, this.gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 3 * 4);
        this.gl.enableVertexAttribArray(this.attribMap["aPosition"].location);
        this.gl.enableVertexAttribArray(this.attribMap["aColor"].location);


        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.evbo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices.subArray(), this.gl.DYNAMIC_DRAW);
        // 绘制
        this.gl.useProgram(this.program);
        // let mat: mat4 = new mat4().scale(new vec3([2, 2, 2]))
        // mat4.product(this.viewProjectMatrix, mat, mat)
        this.gl.uniformMatrix4fv(this.attribMap['uMVMatrix'].location, false, this.viewProjectMatrix.values);
        this.gl.drawElements(mode, count, this.gl.UNSIGNED_SHORT, 3 * Uint16Array.BYTES_PER_ELEMENT);


        this.gl.useProgram(null)
        this.gl.disableVertexAttribArray(this.attribMap["aPosition"].location)
        this.gl.disableVertexAttribArray(this.attribMap["aColor"].location)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
    }
}