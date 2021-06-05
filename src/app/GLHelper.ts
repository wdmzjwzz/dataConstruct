export enum EShaderType {
    VS_SHADER,
    FS_SHADER
}
export class GLAttInfo {
    size: number;
    type: number;
    location: number | WebGLUniformLocation | null;
    constructor(size: number, type: number, location: number | WebGLUniformLocation | null) {
        this.size = size;
        this.type = type;
        this.location = location
    }
}

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
    static createShader(gl: WebGLRenderingContext, type: EShaderType): WebGLShader {
        let shader: WebGLShader | null = null;
        if (type === EShaderType.FS_SHADER) {
            shader = gl.createShader(gl.FRAGMENT_SHADER)
        } else {
            shader = gl.createShader(gl.VERTEX_SHADER)
        }
        if (shader === null) {
            throw new Error("创建shader失败");
        }
        return shader
    }
    static compileShader(gl: WebGLRenderingContext, code: string, shader: WebGLShader): boolean {
        gl.shaderSource(shader, code);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader)
            return false
        }
        return true
    }
    static createProgram(gl: WebGLRenderingContext): WebGLProgram {
        let program = gl.createProgram()
        if (!program) {
            throw new Error("创建program失败");

        }
        return program
    }
    static linkProgram(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        vsShader: WebGLShader,
        fsShader: WebGLShader,
        beforeProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null,
        afterProgramLink: ((gl: WebGLRenderingContext, program: WebGLProgram) => void) | null = null
    ): boolean {
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        if (beforeProgramLink) {
            beforeProgramLink(gl, program)
        }
        gl.linkProgram(program)

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.log(gl.getProgramInfoLog(program))
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            return false
        }

        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            console.log(gl.getProgramInfoLog(program))
            gl.deleteShader(vsShader);
            gl.deleteShader(fsShader);
            gl.deleteProgram(program);
            return false
        }
        if (afterProgramLink) {
            afterProgramLink(gl, program)
        }
        return true
    }
    static getProgramActiveAttribs(gl: WebGLRenderingContext, program: WebGLProgram): void {
        // 获取当前active状态的att和uniforms的数量
        let attCount: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let index = 0; index < attCount; index++) {
            let info = gl.getActiveAttrib(program, index);
            if (info) {
                let obj = new GLAttInfo(info.size, info.type, gl.getAttribLocation(program, info.name))
                console.log("getProgramActiveAttribs|name====" + info.name + JSON.stringify(obj))
            }
        }
    }
    static getProgramActiveUniforms(gl: WebGLRenderingContext, program: WebGLProgram): void {
        // 获取当前active状态的att和uniforms的数量
        let attCount: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let index = 0; index < attCount; index++) {
            let info = gl.getActiveAttrib(program, index);
            if (info) {
                let obj = new GLAttInfo(info.size, info.type, gl.getUniformLocation(program, info.name))
                console.log("getProgramActiveUniforms|name====" + info.name + JSON.stringify(obj))
            }
        }
    }
    static createBuffer(gl: WebGLRenderingContext): WebGLBuffer {
        let buffer: WebGLBuffer | null = gl.createBuffer()
        if (buffer) {
            return buffer
        } else {
            throw new Error("创建buffer失败");
        }
    }
}