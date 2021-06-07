import { GLAttribBits, GLAttribOffsetMap, GLAttribState } from "../utils/GLAttribState";
import { GLMeshBase } from "./GLMeshBase";

export class GLStaticMesh extends GLMeshBase {
    protected _vbo: WebGLBuffer;
    protected _vertCount: number = 0;// vertex numbers
    protected _ibo: WebGLBuffer | null = null;
    protected _indexCount: number = 0;
    constructor(gl: WebGLRenderingContext, attribState: GLAttribBits, vbo: Float32Array | ArrayBuffer, ibo: Uint16Array | null = null, drawMode: number = gl.TRIANGLES) {
        super(gl, attribState, drawMode);

        this.bind();
        let vb: WebGLBuffer | null = gl.createBuffer();
        if (!vb) {
            throw new Error("vbo create error");

        }
        this._vbo = vb;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vbo, this.gl.STATIC_DRAW)

        // 交错存储的顶点属性
        let offsetMap: GLAttribOffsetMap = GLAttribState.getInterleavedLayoutAttribOffsetMap(this._attribState);
        this._vertCount = vbo.byteLength / offsetMap[GLAttribState.ATTRIBSTRIDE];


        GLAttribState.setAttribVertexArrayPointer(gl, offsetMap)
        GLAttribState.setAttribVertexArrayState(gl, this._attribState)

        this.setIBO(ibo);
        this.unbind()
    }
    protected setIBO(ibo: Uint16Array | null) {
        if (ibo === null) {
            return
        }
        this._ibo = this.gl.createBuffer();
        if (!this._ibo) {
            throw new Error("this._ibo = this.gl.createBuffer();");

        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, ibo, this.gl.STATIC_DRAW)
        this._indexCount = ibo.length
    }

    public draw(): void {
        this.bind();//绑定VAO
        if (this._ibo) {
            this.gl.drawElements(this.drawMode, this._indexCount, this.gl.UNSIGNED_SHORT, 0)
        } else {
            this.gl.drawArrays(this.drawMode, 0, this._vertCount)
        }
        this.unbind()
    }
    public drawRange(offset: number, count: number) {
        if (this._ibo) {
            this.gl.drawElements(this.drawMode, this._indexCount, this.gl.UNSIGNED_SHORT, offset)
        } else {
            this.gl.drawArrays(this.drawMode, offset, count)
        }
    }
    
}