
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
    UNSIGNED_INT_24_8 = 0x84FA,

    TEXTURE0 = 0x84c0,
    DYNAMIC_DRAW = 0x88e8,

    ARRAY_BUFFER = 0x8892,
    ELEMENT_ARRAY_BUFFER = 0x8893,
    UNIFORM_BUFFER = 0x8a11,
    TRANSFORM_FEEDBACK_BUFFER = 0x8c8e,

    TRANSFORM_FEEDBACK = 0x8e22,

    COMPILE_STATUS = 0x8b81,
    LINK_STATUS = 0x8b82,
    FRAGMENT_SHADER = 0x8b30,
    VERTEX_SHADER = 0x8b31,
    SEPARATE_ATTRIBS = 0x8c8d,

    ACTIVE_UNIFORMS = 0x8b86,
    ACTIVE_ATTRIBUTES = 0x8b89,
    TRANSFORM_FEEDBACK_VARYINGS = 0x8c83,
    ACTIVE_UNIFORM_BLOCKS = 0x8a36,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46,
    UNIFORM_BLOCK_DATA_SIZE = 0x8a40,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43,


    FLOAT_VEC2 = 0x8B50,
    FLOAT_VEC3 = 0x8B51,
    FLOAT_VEC4 = 0x8B52,
    INT_VEC2 = 0x8B53,
    INT_VEC3 = 0x8B54,
    INT_VEC4 = 0x8B55,
    BOOL = 0x8B56,
    BOOL_VEC2 = 0x8B57,
    BOOL_VEC3 = 0x8B58,
    BOOL_VEC4 = 0x8B59,
    FLOAT_MAT2 = 0x8B5A,
    FLOAT_MAT3 = 0x8B5B,
    FLOAT_MAT4 = 0x8B5C,
    SAMPLER_2D = 0x8B5E,
    SAMPLER_CUBE = 0x8B60,
    SAMPLER_3D = 0x8B5F,
    SAMPLER_2D_SHADOW = 0x8B62,
    FLOAT_MAT2x3 = 0x8B65,
    FLOAT_MAT2x4 = 0x8B66,
    FLOAT_MAT3x2 = 0x8B67,
    FLOAT_MAT3x4 = 0x8B68,
    FLOAT_MAT4x2 = 0x8B69,
    FLOAT_MAT4x3 = 0x8B6A,
    SAMPLER_2D_ARRAY = 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW = 0x8DC4,
    SAMPLER_CUBE_SHADOW = 0x8DC5,
    UNSIGNED_INT_VEC2 = 0x8DC6,
    UNSIGNED_INT_VEC3 = 0x8DC7,
    UNSIGNED_INT_VEC4 = 0x8DC8,
    INT_SAMPLER_2D = 0x8DCA,
    INT_SAMPLER_3D = 0x8DCB,
    INT_SAMPLER_CUBE = 0x8DCC,
    INT_SAMPLER_2D_ARRAY = 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D = 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D = 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7,

    TEXTURE_2D = 0x0DE1,
    TEXTURE_CUBE_MAP = 0x8513,
    TEXTURE_3D = 0x806F,
    TEXTURE_2D_ARRAY = 0x8C1A,

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

