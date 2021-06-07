import { GLAttribBits, GLAttribState } from "../utils/GLAttribState";

export abstract class GLMeshBase {
    public gl: WebGLRenderingContext;
    public drawMode: number;//七种基本几何图元之一
    protected _attribState: GLAttribBits;
    protected _attribStride: number;
    protected _vao: OES_vertex_array_object;
    protected _vaoTarget: WebGLVertexArrayObjectOES;

    constructor(gl: WebGLRenderingContext, attribState: GLAttribBits, drawMode: number = gl.TRIANGLES) {
        this.gl = gl;
        let vao: OES_vertex_array_object | null = this.gl.getExtension("OES_vertex_array_object")
        if (!vao) {
            throw new Error("no Support OES_vertex_array_object");
        }
        this._vao = vao;

        let vaoTarget: WebGLVertexArrayObjectOES | null = this._vao.createVertexArrayOES();
        if (!vaoTarget) {
            throw new Error("no Support WebGLVertexArrayObjectOES");

        }
        this._vaoTarget = vaoTarget;
        this._attribState = attribState
        this.drawMode = drawMode;
        this._attribStride = GLAttribState.getVertexByteStride(this._attribState);

    }
    public bind(): void {
        this._vao.bindVertexArrayOES(this._vaoTarget)
    }
    public unbind() {
        this._vao.bindVertexArrayOES(null)
    }
    public get vertexStride(): number {
        return this._attribStride
    }
}