import { uniformSetters } from "./constants";

export interface GLSetters {
    [key: string]: (...arg: any) => boolean;
}

export interface GLParamsInfo {
    localtion: any;
    type: GLenum;
    size: number;
    name: string;
}
export type BufferData = {
    data: Float32Array | Uint16Array | Uint8Array;
    numComponents?: number;
    type?: number;
    normalize?: boolean;
    stride?: number;
    offset?: number;
    attrib?: string;
    name?: string;
    attribName?: string;
    buffer?: WebGLBuffer; 
};
export type AttribInfo = {
    numComponents?: number;
    size?: number;
    type?: number;
    normalize?: boolean;
    offset?: number;
    stride?: number;
    buffer: WebGLBuffer;
    drawType?: number;
    elementType?: number; 
};
export type BufferInfo = {
    [key: string]: AttribInfo;
};
export default class GLProgram {
    public gl: WebGL2RenderingContext; // WebGL上下文渲染对象
    public program: WebGLProgram; // 链接器
    public vsShader: WebGLShader; // vertex shader编译器
    public fsShader: WebGLShader; // fragment shader编译器
    public bufferInfo: BufferInfo | null = null;
    public atrributeInfoMap: {
        [key: string]: GLParamsInfo;
    } = {};
    public uniformInfoMap: {
        [key: string]: GLParamsInfo;
    } = {};

    public constructor(
        gl: WebGL2RenderingContext,
        vsShader: string,
        fsShader: string
    ) {
        this.gl = gl;

        this.vsShader = this.createShader(this.gl.VERTEX_SHADER, vsShader);

        this.fsShader = this.createShader(this.gl.FRAGMENT_SHADER, fsShader);

        this.program = this.createProgram();

        this.loadAttribInfo();
        this.loadUniformInfo();
    }
    private createShader(type: GLenum, shaderSource: string) {
        const shader = this.gl.createShader(type);
        if (!shader) {
            throw new Error(`createShader Error:${type}`);
        }
        this.gl.shaderSource(shader, shaderSource); // 载入shader源码
        this.gl.compileShader(shader); // 编译shader源码
        if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS) === false) {
            console.error(this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
        }
        return shader;
    }

    private createProgram() {
        const program = this.gl.createProgram();
        if (!program) {
            throw new Error(`createProgram Error `);
        }
        this.gl.attachShader(program, this.vsShader);
        this.gl.attachShader(program, this.fsShader);
        this.gl.linkProgram(program);

        this.gl.validateProgram(program);
        if (
            !this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS) ||
            !this.gl.getProgramParameter(program, this.gl.LINK_STATUS)
        ) {
            throw new Error("linkProgram failed");
        }
        return program;
    }

    private loadAttribInfo() {
        const numAttribs = this.gl.getProgramParameter(
            this.program,
            this.gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 0; i < numAttribs; ++i) {
            const attribInfo = this.gl.getActiveAttrib(this.program, i);
            if (!attribInfo) {
                throw new Error("getActiveAttrib error");
            }
            const location = this.gl.getAttribLocation(this.program, attribInfo.name);
            this.atrributeInfoMap[attribInfo.name] = {
                name: attribInfo.name,
                type: attribInfo.type,
                size: attribInfo.size,
                localtion: location,
            };
        }
    }

    private loadUniformInfo() {
        const numUniforms = this.gl.getProgramParameter(
            this.program,
            this.gl.ACTIVE_UNIFORMS
        );
        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = this.gl.getActiveUniform(this.program, ii);
            if (!uniformInfo) {
                throw new Error("getActiveAttrib error");
            }
            const location = this.gl.getUniformLocation(
                this.program,
                uniformInfo.name
            );
            // the uniform will have no location if it's in a uniform block
            if (!location) {
                continue;
            }
            this.uniformInfoMap[uniformInfo.name] = {
                name: uniformInfo.name,
                type: uniformInfo.type,
                size: uniformInfo.size,
                localtion: location,
            };
        }
    }

    public bind(): void {
        this.gl.useProgram(this.program);
    }

    public unbind(): void {
        this.gl.useProgram(null);
    }
    getAttribLocation(name: string) {
        const attri = this.atrributeInfoMap[name];
        if (!attri) {
            throw new Error("getAttribLocation error:" + name);
        }
        return attri.localtion
    }
    getUniformLocation(name: string) {
        const uniform = this.uniformInfoMap[name];
        if (!uniform) {
            throw new Error("getUniformLocation error:" + name);
        }
        return uniform.localtion
    }
    public createBuffers(
        bufferData: { [key: string]: BufferData }
    ): BufferInfo {
        const keys = Object.keys(bufferData);
        const buffers: BufferInfo = {};
        const gl = this.gl
        keys.forEach((key) => {
            const { data, numComponents, type, stride, offset, normalize } =
                bufferData[key];
            if (key === "indices") {
                const indexBuffer = gl.createBuffer();
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);

                buffers.indices = {
                    buffer: indexBuffer!,
                    elementType: gl.UNSIGNED_SHORT,
                };
                return;
            }

            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

            buffers[key] = {
                buffer: buffer!,
                numComponents: numComponents,
                type: type || gl.FLOAT,
                normalize: normalize || false,
                stride: stride || 0,
                offset: offset || 0,
                drawType: gl.STATIC_DRAW 
            };
        });

        return buffers;
    }
    setAttributeInfo(buffers: BufferInfo) {
        const keys = Object.keys(buffers);

        keys.forEach((key) => {
            const { buffer, numComponents, type, stride, offset, normalize } = buffers[key];
            if (key === "indices") {
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
                return;
            }
            const localtion = this.getAttribLocation(key)
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.vertexAttribPointer(
                localtion,
                numComponents || 3,
                type || this.gl.FLOAT,
                normalize || false,
                stride || 0,
                offset || 0
            );
            this.gl.enableVertexAttribArray(localtion);
        });
    }
    setUniformInfo(uniformData: { [key: string]: any }) {
        const keys = Object.keys(this.uniformInfoMap);
        keys.forEach((key) => {
            const data = uniformData[key];
            const uniform = this.uniformInfoMap[key];
            const setter = uniformSetters[uniform.type];
            if (setter) {
                setter(this.gl, uniform.localtion, data);
            }
        });
    }
}
