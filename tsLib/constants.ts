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