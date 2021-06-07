export type GLAttribBits = number;
export type GLAttribOffsetMap = {
    [key: string]: number
}
export class GLAttribState {
    constructor(){}
    // 顶点属性，坐标位置
    public static readonly POSITION_BIT: number = (1 << 0);
    public static readonly POSITION_COMPONENT: number = 3;
    public static readonly POSITION_NAME: string = "aPosition"
    public static readonly POSITION_LOCATION: number = 0;
    // 顶点属性，纹理坐标
    public static readonly TEXCOORD_BIT: number = (1 << 1);
    public static readonly TEXCOORD_COMPONENT: number = 2;
    public static readonly TEXCOORD_NAME: string = "aTexCoord"
    public static readonly TEXCOORD_LOCATION: number = 1;

    // 顶点属性：纹理坐标1

    public static readonly TEXCOORD1_BIT: number = (1 << 2);
    public static readonly TEXCOORD1_COMPONENT: number = 2;
    public static readonly TEXCOORD1_NAME: string = "aTexCoord1"
    public static readonly TEXCOORD1_LOCATION: number = 2;
    // 顶点属性：法向量
    public static readonly NORMAL_BIT: number = (1 << 3);
    public static readonly NORMAL_COMPONENT: number = 3;
    public static readonly NORMAL_NAME: string = "aNormal"
    public static readonly NORMAL_LOCATION: number = 3;
    // 顶点属性：切向量
    public static readonly TANGRNT_BIT: number = (1 << 4);
    public static readonly TANGRNT_COMPONENT: number = 4;
    public static readonly TANGRNT_NAME: string = "aTangent"
    public static readonly TANGRNT_LOCATION: number = 4;
    // 顶点属性颜色
    public static readonly COLOR_BIT: number = (1 << 5);
    public static readonly COLOR_COMPONENT: number = 4;
    public static readonly COLOR_NAME: string = "aColor"
    public static readonly COLOR_LOCATION: number = 5;

    public static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    public static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;

    public static readonly ATTRIBSTRIDE: string = "STRIDE"
    public static readonly ATTRIBBYTELENGTH: string = "BYTELENGTH"


    /**
     * name
     */
    public static getMaxVertexAttribs(gl: WebGLRenderingContext): number {
        return gl.getParameter(gl.MAX_VERTEX_ATTRIBS)
    }
    public static makeVertexAtrribs(
        useTexCoord: boolean,
        useTexCoord1: boolean,
        useNormal: boolean,
        useTangent: boolean,
        useCorlor: boolean
    ): GLAttribBits {
        let bits: GLAttribBits = GLAttribState.POSITION_BIT;
        if (useTexCoord) {
            bits |= GLAttribState.TEXCOORD_BIT;
        }
        if (useTexCoord1) {
            bits |= GLAttribState.TEXCOORD1_BIT;
        }
        if (useNormal) {
            bits |= GLAttribState.NORMAL_BIT;
        }
        if (useTangent) {
            bits |= GLAttribState.TANGRNT_BIT;
        }
        if (useCorlor) {
            bits |= GLAttribState.COLOR_BIT;
        }
        return bits
    }
    public static hasPosition(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.POSITION_BIT) !== 0
    }
    public static hasNormal(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.NORMAL_BIT) !== 0
    }
    public static hasTexCoord_0(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.TEXCOORD_BIT) !== 0
    }
    public static hasTexCoord_1(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.TEXCOORD1_BIT) !== 0
    }
    public static hasColor(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.COLOR_BIT) !== 0
    }
    public static hasTangent(attribBits: GLAttribBits): boolean {
        return (attribBits & GLAttribState.TANGRNT_BIT) !== 0
    }


    public static getInterleavedLayoutAttribOffsetMap(attribBits: GLAttribBits): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {}
        let byteOffset: number = 0;
        if (GLAttribState.hasPosition(attribBits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasNormal(attribBits)) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_0(attribBits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_1(attribBits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasColor(attribBits)) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTangent(attribBits)) {
            offsets[GLAttribState.TANGRNT_NAME] = byteOffset;
            byteOffset += GLAttribState.TANGRNT_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        offsets[GLAttribState.ATTRIBSTRIDE] = byteOffset
        offsets[GLAttribState.ATTRIBBYTELENGTH] = byteOffset
        return offsets
    }
    public static getSequencedLayoutAttribOffsetMap(attribBits: GLAttribBits, vertCount: number): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {}
        let byteOffset: number = 0;
        if (GLAttribState.hasPosition(attribBits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
            byteOffset += vertCount * GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasNormal(attribBits)) {
            offsets[GLAttribState.NORMAL_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_0(attribBits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_1(attribBits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasColor(attribBits)) {
            offsets[GLAttribState.COLOR_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTangent(attribBits)) {
            offsets[GLAttribState.TANGRNT_NAME] = byteOffset;
            byteOffset += vertCount * GLAttribState.TANGRNT_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        offsets[GLAttribState.ATTRIBSTRIDE] = byteOffset / vertCount
        offsets[GLAttribState.ATTRIBBYTELENGTH] = byteOffset
        return offsets
    }
    public static getSepratedLayoutAttribOffsetMap(attribBits: GLAttribBits): GLAttribOffsetMap {
        let offsets: GLAttribOffsetMap = {}

        if (GLAttribState.hasPosition(attribBits)) {
            offsets[GLAttribState.POSITION_NAME] = 0;
        }
        if (GLAttribState.hasNormal(attribBits)) {
            offsets[GLAttribState.NORMAL_NAME] = 0;
        }
        if (GLAttribState.hasTexCoord_0(attribBits)) {
            offsets[GLAttribState.TEXCOORD_NAME] = 0;
        }
        if (GLAttribState.hasTexCoord_1(attribBits)) {
            offsets[GLAttribState.TEXCOORD1_NAME] = 0;
        }
        if (GLAttribState.hasColor(attribBits)) {
            offsets[GLAttribState.COLOR_NAME] = 0;
        }
        if (GLAttribState.hasTangent(attribBits)) {
            offsets[GLAttribState.TANGRNT_NAME] = 0;
        }

        return offsets
    }
    /**
     *  getVertexByteStride
     */
    public static getVertexByteStride(attribBits: GLAttribBits): number {
        let byteOffset: number = 0;

        if (GLAttribState.hasPosition(attribBits)) {
            byteOffset += GLAttribState.POSITION_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasNormal(attribBits)) {
            byteOffset += GLAttribState.NORMAL_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_0(attribBits)) {
            byteOffset += GLAttribState.TEXCOORD_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTexCoord_1(attribBits)) {
            byteOffset += GLAttribState.TEXCOORD1_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasColor(attribBits)) {
            byteOffset += GLAttribState.COLOR_COMPONENT * GLAttribState.FLOAT32_SIZE
        }
        if (GLAttribState.hasTangent(attribBits)) {
            byteOffset += GLAttribState.TANGRNT_COMPONENT * GLAttribState.FLOAT32_SIZE
        }

        return byteOffset
    }
    /**
     * 
     */
    public static setAttribVertexArrayPointer(gl: WebGLRenderingContext, offsetMap: GLAttribOffsetMap): void {
        let stride: number = offsetMap[GLAttribState.ATTRIBSTRIDE];
        if (stride === 0) {
            throw new Error("vertex Array error");

        }
        // sequenced stride====0
        if (stride !== offsetMap[GLAttribState.ATTRIBBYTELENGTH]) {
            stride = 0
        }
        if (stride === undefined) {
            stride = 0
        }
        let offsets: number = offsetMap[GLAttribState.POSITION_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.NORMAL_LOCATION, GLAttribState.NORMAL_COMPONENT, gl.FLOAT, false, stride, offsets)
        }

        offsets = offsetMap[GLAttribState.NORMAL_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.NORMAL_LOCATION, GLAttribState.NORMAL_COMPONENT, gl.FLOAT, false, stride, offsets)
        }

        offsets = offsetMap[GLAttribState.TEXCOORD_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.TEXCOORD_LOCATION, GLAttribState.TEXCOORD_COMPONENT, gl.FLOAT, false, stride, offsets)
        }

        offsets = offsetMap[GLAttribState.TEXCOORD1_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.TEXCOORD1_LOCATION, GLAttribState.TEXCOORD1_COMPONENT, gl.FLOAT, false, stride, offsets)
        }

        offsets = offsetMap[GLAttribState.COLOR_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.COLOR_LOCATION, GLAttribState.COLOR_COMPONENT, gl.FLOAT, false, stride, offsets)
        }

        offsets = offsetMap[GLAttribState.TANGRNT_NAME];
        if (offsets !== undefined) {
            gl.vertexAttribPointer(GLAttribState.TANGRNT_LOCATION, GLAttribState.TANGRNT_COMPONENT, gl.FLOAT, false, stride, offsets)
        }
    }
    /**
     * name
     */
    public static setAttribVertexArrayState(gl: WebGLRenderingContext, attribBits: GLAttribBits, enabled: boolean = true): void {
        if (GLAttribState.hasPosition(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.POSITION_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.POSITION_LOCATION)
        }
        if (GLAttribState.hasNormal(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.NORMAL_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.NORMAL_LOCATION)
        }
        if (GLAttribState.hasTexCoord_0(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.TEXCOORD_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.TEXCOORD_LOCATION)
        }
        if (GLAttribState.hasTexCoord_1(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.TEXCOORD1_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.TEXCOORD1_LOCATION)
        }
        if (GLAttribState.hasColor(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.COLOR_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.COLOR_LOCATION)
        }
        if (GLAttribState.hasTangent(attribBits) && enabled) {
            gl.enableVertexAttribArray(GLAttribState.TANGRNT_LOCATION)
        } else {
            gl.disableVertexAttribArray(GLAttribState.TANGRNT_LOCATION)
        }

    }
}
