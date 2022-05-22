
export enum DataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
    UNSIGNED_SHORT_4_4_4_4 = 0x8033,
    UNSIGNED_SHORT_5_5_5_1 = 0x8034,
    UNSIGNED_SHORT_5_6_5 = 0x8363,
    HALF_FLOAT = 0x140B,
    UNSIGNED_INT_2_10_10_10_REV = 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B,
    UNSIGNED_INT_5_9_9_9_REV = 0x8C3E,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD,
    UNSIGNED_INT_24_8 = 0x84FA
}
export enum AttribsName {
    Normal = 'a_normal',
    Position = 'a_position',
    Texcoord = 'a_texcoord', 
}
export interface BufferInfo {
    [AttribsName.Position]?: number[],
    [AttribsName.Texcoord]?: number[],
    [AttribsName.Normal]?: number[],
    indices?: number[],
    attribs?: any,
    numElements?: number
    elementType?: any
}
export type Attribs = {
    [key in AttribsName]?: {
        buffer: WebGLBuffer,
        divisor: any
        drawType: any
        normalize: boolean
        numComponents: number
        offset: number
        stride: number
        type: DataType
    }
}