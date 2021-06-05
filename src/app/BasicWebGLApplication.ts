import { mat4 } from "../math/tsm"
import { Application } from "./Application";
import { GLHelper } from "./GLHelper";

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
            console.log(JSON.stringify(e))
        }, false)
        GLHelper.triggerContextLostEvent(this.gl)
    }
    public gl: WebGLRenderingContext;
    public projectMatrix: mat4;
    public viewMatrix: mat4;
    public viewProjectMatrix: mat4


}