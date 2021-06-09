// import { GLProgram } from "../GLProgram/GLProgram";
// import { GLProgramCache } from "../GLProgram/GLProgramCache";
import { Application } from "./Application";
// import { GLMeshBuilder } from "../GLMesh/GLMeshBuilder"
// import mat4 from "../math/mat4";
// import { vec3 } from "../math/tsm";
export class WebGLApplication extends Application {
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
        // let projectMatrix = mat4.perspective(1, this.canvas.width / this.canvas.height, 0.1, 1000)
        // 视矩阵
        // let viewMatrix = mat4.lookAt(new vec3([0, 0, 200]), new vec3())
        // let viewProjectMatrix = mat4.product(projectMatrix, viewMatrix, new mat4())
        // const colorP = GLProgram.createDefaultColorProgram(this.gl)
        // console.log(colorP,111)
        // GLProgramCache.instance.set("color", colorP);
        // const mesh = new GLMeshBuilder(this.gl, colorP._attribState, GLProgramCache.instance.getMaybe("color"),)
        // mesh.color(0, 0, 0, 1).vertex(0.5, 0.5, 0).vertex(-0.5, -0.5, 0).vertex(0.5, -0.5, 0).begin(this.gl.TRIANGLES).end(viewProjectMatrix)
        // GLProgramCache.instance.set("texture", GLProgram.createDefaultTextureProgram(this.gl));

    }
    public gl: WebGLRenderingContext | null = null;
    public matStack: any;
    public builder: any;
    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null
}