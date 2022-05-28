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

    STATIC_DRAW = 0x88e4,
    ARRAY_BUFFER = 0x8892,
    ELEMENT_ARRAY_BUFFER = 0x8893,
    BUFFER_SIZE = 0x8764,
    TEXTURE0 = 0x84c0,
    DYNAMIC_DRAW = 0x88e8,
    UNIFORM_BUFFER = 0x8a11,
    TRANSFORM_FEEDBACK_BUFFER = 0x8c8e,

    TRANSFORM_FEEDBACK = 0x8e22,

    COMPILE_STATUS = 0x8b81,
    LINK_STATUS = 0x8b82,
    ACTIVE_UNIFORMS = 0x8b86,
    ACTIVE_ATTRIBUTES = 0x8b89,
    TRANSFORM_FEEDBACK_VARYINGS = 0x8c83,
    ACTIVE_UNIFORM_BLOCKS = 0x8a36,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46,
    UNIFORM_BLOCK_DATA_SIZE = 0x8a40,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43,

     
    FLOAT_VEC2 = 0x8b50,
    FLOAT_VEC3 = 0x8b51,
    FLOAT_VEC4 = 0x8b52,
    
    INT_VEC2 = 0x8b53,
    INT_VEC3 = 0x8b54,
    INT_VEC4 = 0x8b55,
    BOOL = 0x8b56,
    BOOL_VEC2 = 0x8b57,
    BOOL_VEC3 = 0x8b58,
    BOOL_VEC4 = 0x8b59,
    FLOAT_MAT2 = 0x8b5a,
    FLOAT_MAT3 = 0x8b5b,
    FLOAT_MAT4 = 0x8b5c,
    SAMPLER_2D = 0x8b5e,
    SAMPLER_CUBE = 0x8b60,
    SAMPLER_3D = 0x8b5f,
    SAMPLER_2D_SHADOW = 0x8b62,
    FLOAT_MAT2x3 = 0x8b65,
    FLOAT_MAT2x4 = 0x8b66,
    FLOAT_MAT3x2 = 0x8b67,
    FLOAT_MAT3x4 = 0x8b68,
    FLOAT_MAT4x2 = 0x8b69,
    FLOAT_MAT4x3 = 0x8b6a,
    SAMPLER_2D_ARRAY = 0x8dc1,
    SAMPLER_2D_ARRAY_SHADOW = 0x8dc4,
    SAMPLER_CUBE_SHADOW = 0x8dc5,
 
    UNSIGNED_INT_VEC2 = 0x8dc6,
    UNSIGNED_INT_VEC3 = 0x8dc7,
    UNSIGNED_INT_VEC4 = 0x8dc8,
    INT_SAMPLER_2D = 0x8dca,
    INT_SAMPLER_3D = 0x8dcb,
    INT_SAMPLER_CUBE = 0x8dcc,
    INT_SAMPLER_2D_ARRAY = 0x8dcf,
    UNSIGNED_INT_SAMPLER_2D = 0x8dd2,
    UNSIGNED_INT_SAMPLER_3D = 0x8dd3,
    UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7,

    TEXTURE_2D = 0x0de1,
    TEXTURE_CUBE_MAP = 0x8513,
    TEXTURE_3D = 0x806f,
    TEXTURE_2D_ARRAY = 0x8c1a,

}
export const glTypeToTypedArray =
{

    [DataType.BYTE]: Int8Array,
    [DataType.UNSIGNED_BYTE]: Uint8Array,
    [DataType.SHORT]: Int16Array,
    [DataType.UNSIGNED_SHORT]: Uint16Array,
    [DataType.INT]: Int32Array,
    [DataType.UNSIGNED_INT]: Uint32Array,
    [DataType.FLOAT]: Float32Array,
    [DataType.UNSIGNED_SHORT_4_4_4_4]: Uint16Array,
    [DataType.UNSIGNED_SHORT_5_5_5_1]: Uint16Array,
    [DataType.UNSIGNED_SHORT_5_6_5]: Uint16Array,
    [DataType.HALF_FLOAT]: Uint16Array,
    [DataType.UNSIGNED_INT_2_10_10_10_REV]: Uint32Array,
    [DataType.UNSIGNED_INT_10F_11F_11F_REV]: Uint32Array,
    [DataType.UNSIGNED_INT_5_9_9_9_REV]: Uint32Array,
    [DataType.FLOAT_32_UNSIGNED_INT_24_8_REV]: Uint32Array,
    [DataType.UNSIGNED_INT_24_8]: Uint32Array,
}