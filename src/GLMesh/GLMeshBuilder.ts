import { GLProgram } from "../GLProgram/GLProgram";
import { mat4, vec2, vec3, vec4 } from "../math/tsm";
import { TypedArrayList } from "../tree/TypedArrayList";
import { GLAttribBits, GLAttribOffsetMap, GLAttribState } from "../utils/GLAttribState";
import { GLMeshBase } from "./GLMeshBase";

export enum EVertexLayout {
    INTERLEAVED,
    SEQUENCED,
    SEPARATED
}
export class GLMeshBuilder extends GLMeshBase {
    private static SEQUENCED: string = "SEQUENCED";
    private static INTERLEAVED: string = "INTERLEAVED";
    private _layout: EVertexLayout;

    //当前正在输入的顶点属性
    private _color: vec4 = new vec4([0, 0, 0, 0])
    private _texCoord: vec2 = new vec2([0, 0])
    private _normal: vec3 = new vec3([0, 0, 1]);

    private _hasColor: boolean;
    private _hasTexCoord: boolean;
    private _hasNormal: boolean;


    private _lists: { [key: string]: TypedArrayList<Float32Array> } = {}
    private _buffers: { [key: string]: WebGLBuffer } = {} //VBO
    private _vertCount: number = 0;
    public program: GLProgram;
    public texture: WebGLTexture | null;

    constructor(gl: WebGLRenderingContext, state: GLAttribBits, program: GLProgram, texture: WebGLTexture | null = null, layout: EVertexLayout = EVertexLayout.INTERLEAVED) {
        super(gl, state);
        // 1
        this._hasColor = GLAttribState.hasColor(this._attribState);
        this._hasTexCoord = GLAttribState.hasTexCoord_0(this._attribState);
        this._hasNormal = GLAttribState.hasNormal(this._attribState);

        this._layout = layout;
        this.program = program;
        this.texture = texture;
        this.bind()
        // 生成索引缓存
        let buffer = this.gl.createBuffer()

        if (!buffer) {
            throw new Error("");

        }

        // 2 INTERLEAVED 存储
        if (this._layout === EVertexLayout.INTERLEAVED) {
            this._lists[GLMeshBuilder.INTERLEAVED] = new TypedArrayList<Float32Array>(Float32Array);
            this._buffers[GLMeshBuilder.INTERLEAVED] = buffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
            let map: GLAttribOffsetMap = GLAttribState.getInterleavedLayoutAttribOffsetMap(this._attribState);
            GLAttribState.setAttribVertexArrayPointer(this.gl, map)
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState)
        }
        else if (this._layout === EVertexLayout.SEQUENCED) {
            this._lists[GLAttribState.POSITION_NAME] = new TypedArrayList<Float32Array>(Float32Array);

            if (this._hasColor) {
                this._lists[GLAttribState.COLOR_NAME] = new TypedArrayList<Float32Array>(Float32Array);
            }
            if (this._hasTexCoord) {
                this._lists[GLAttribState.TEXCOORD_NAME] = new TypedArrayList<Float32Array>(Float32Array);
            }
            if (this._hasNormal) {
                this._lists[GLAttribState.NORMAL_NAME] = new TypedArrayList<Float32Array>(Float32Array);
            }
            buffer = this.gl.createBuffer();
            this._buffers[GLMeshBuilder.SEQUENCED] = buffer;

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState)
        }
        else {
            this._lists[GLAttribState.POSITION_NAME] = new TypedArrayList<Float32Array>(Float32Array);

            this._buffers[GLAttribState.POSITION_NAME] = buffer;
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            if (this._hasColor) {
                this._lists[GLAttribState.COLOR_NAME] = new TypedArrayList<Float32Array>(Float32Array);
                buffer = this.gl.createBuffer();
                this._buffers[GLAttribState.COLOR_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
            }

            if (this._hasTexCoord) {
                this._lists[GLAttribState.TEXCOORD_NAME] = new TypedArrayList<Float32Array>(Float32Array);
                buffer = this.gl.createBuffer();
                this._buffers[GLAttribState.TEXCOORD_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
            }

            if (this._hasNormal) {
                this._lists[GLAttribState.NORMAL_NAME] = new TypedArrayList<Float32Array>(Float32Array);
                buffer = this.gl.createBuffer();
                this._buffers[GLAttribState.NORMAL_NAME] = buffer;
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
            }
            GLAttribState.setAttribVertexArrayState(this.gl, this._attribState)
            let map = GLAttribState.getSepratedLayoutAttribOffsetMap(this._attribState);
            GLAttribState.setAttribVertexArrayPointer(this.gl, map)
        }
        this.unbind()
    }
    public color(r: number, g: number, b: number, a: number = 1.0): GLMeshBuilder {
        if (this._hasColor) {
            this._color.r = r
            this._color.g = g
            this._color.b = b
            this._color.a = a
        }
        return this
    }

    public texcoord(u: number, v: number): GLMeshBuilder {
        if (this._hasTexCoord) {
            this._texCoord.x = u;
            this._texCoord.y = v
        }
        return this
    }
    public normal(x: number, y: number, z: number): GLMeshBuilder {
        if (this._hasNormal) {
            this._normal.x = x;
            this._normal.y = y;
            this._normal.z = z
        }
        return this
    }
    public vertex(x: number, y: number, z: number): GLMeshBuilder {
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list = this._lists[GLMeshBuilder.INTERLEAVED];
            list.push(x);
            list.push(y);
            list.push(z);
            if (this._hasTexCoord) {
                list.push(this._texCoord.x)
                list.push(this._texCoord.y)
            }
            if (this._hasNormal) {
                list.push(this._normal.x)
                list.push(this._normal.y)
                list.push(this._normal.z)
            }
            if (this._hasColor) {
                list.push(this._color.r);
                list.push(this._color.g)
                list.push(this._color.b)
                list.push(this._color.a)
            }
        } else {
            let list = this._lists[GLAttribState.POSITION_NAME];
            list.push(x);
            list.push(y);
            list.push(z);

            if (this._hasTexCoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME];
                list.push(this._texCoord.x)
                list.push(this._texCoord.y)
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME];
                list.push(this._normal.x)
                list.push(this._normal.y)
                list.push(this._normal.z)
            }
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME];
                list.push(this._color.r);
                list.push(this._color.g)
                list.push(this._color.b)
                list.push(this._color.a)
            }
        }
        this._vertCount++
        return this
    }

    public begin(drawMode: number = this.gl.TRIANGLES): GLMeshBuilder {
        this.drawMode = drawMode;
        this._vertCount = 0;
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list = this._lists[GLMeshBuilder.INTERLEAVED]
            list.clear()
        } else {
            let list = this._lists[GLAttribState.POSITION_NAME]
            list.clear()
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME]
                list.clear()
            }
            if (this._hasTexCoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME]
                list.clear()
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME]
                list.clear()
            }
        }
        return this
    }
    public end(mvp: mat4): void {
        this.program.bind()
        this.program.setMatrix4(GLProgram.MVPMatrix, mvp);
        this.bind();
        if (this._layout === EVertexLayout.INTERLEAVED) {
            let list = this._lists[GLMeshBuilder.INTERLEAVED];
            let buffer = this._buffers[GLMeshBuilder.INTERLEAVED];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, list.subArray(), this.gl.DYNAMIC_DRAW)
        } else if (this._layout === EVertexLayout.SEQUENCED) {
            let buffer = this._buffers[GLMeshBuilder.SEQUENCED];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, this._attribStride * this._vertCount, this.gl.DYNAMIC_DRAW);
            let map = GLAttribState.getSequencedLayoutAttribOffsetMap(this._attribState, this._vertCount);
            let list = this._lists[GLAttribState.POSITION_NAME];
            this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, list.subArray())

            if (this._hasTexCoord) {
                list = this._lists[GLAttribState.TEXCOORD_NAME]
                this.gl.bufferSubData(this.gl.ARRAY_BUFFER, map[GLAttribState.TEXCOORD_NAME], list.subArray())
            }
            if (this._hasColor) {
                list = this._lists[GLAttribState.COLOR_NAME]
                this.gl.bufferSubData(this.gl.ARRAY_BUFFER, map[GLAttribState.COLOR_NAME], list.subArray())
            }
            if (this._hasNormal) {
                list = this._lists[GLAttribState.NORMAL_NAME]
                this.gl.bufferSubData(this.gl.ARRAY_BUFFER, map[GLAttribState.NORMAL_NAME], list.subArray())
            }
            GLAttribState.setAttribVertexArrayPointer(this.gl, map)
        } else {
            let buffer = this._buffers[GLAttribState.POSITION_NAME];
            let list = this._lists[GLAttribState.POSITION_NAME];
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, list.subArray(), this.gl.DYNAMIC_DRAW);

            if (this._hasTexCoord) {
                buffer = this._buffers[GLAttribState.TEXCOORD_NAME];
                list = this._lists[GLAttribState.TEXCOORD_NAME]
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, list.subArray(), this.gl.DYNAMIC_DRAW);
            }
            if (this._hasColor) {
                buffer = this._buffers[GLAttribState.COLOR_NAME];
                list = this._lists[GLAttribState.COLOR_NAME]
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, list.subArray(), this.gl.DYNAMIC_DRAW);
            }
            if (this._hasNormal) {
                buffer = this._buffers[GLAttribState.NORMAL_NAME];
                list = this._lists[GLAttribState.NORMAL_NAME]
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, list.subArray(), this.gl.DYNAMIC_DRAW);
            }
            this.gl.drawArrays(this.drawMode, 0, this._vertCount)
            this.bind()
            this.program.unbind()
        }
    }
}