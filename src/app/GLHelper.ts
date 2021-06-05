export class GLHelper {
    static printStates(gl: WebGLRenderingContext | null): void {
        if (gl === null) {
            return
        }
        console.log("isBlendEnable = " + gl.isEnabled(gl.BLEND))
    }
    static triggerContextLostEvent(gl: WebGLRenderingContext): void {
        let ret: WEBGL_lose_context | null = gl.getExtension("WEBGL_lose_context");
        if (ret) {
            ret.loseContext()
        }
    }
}