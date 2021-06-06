import { GLProgram } from "../GLProgram/GLProgram";
import { GLProgramCache } from "../GLProgram/GLProgramCache";
import { Application } from "./Application";

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
        GLProgramCache.instance.set("color", GLProgram.createDefaultColorProgram(this.gl));
        GLProgramCache.instance.set("texture", GLProgram.createDefaultTextureProgram(this.gl));
    }
    public gl: WebGLRenderingContext | null = null;
    public matStack: any;
    public builder: any;
    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null
}