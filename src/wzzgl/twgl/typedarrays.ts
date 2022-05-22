import { DataType } from "./interface";


const glTypeToTypedArray = {
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
  [DataType.UNSIGNED_INT_24_8]: Uint32Array
};


export function getGLTypeForTypedArray(typedArray: any) {
  if (typedArray instanceof Int8Array) { return DataType.BYTE; }           // eslint-disable-line
  if (typedArray instanceof Uint8Array) { return DataType.UNSIGNED_BYTE; }  // eslint-disable-line
  if (typedArray instanceof Uint8ClampedArray) { return DataType.UNSIGNED_BYTE; }  // eslint-disable-line
  if (typedArray instanceof Int16Array) { return DataType.SHORT; }          // eslint-disable-line
  if (typedArray instanceof Uint16Array) { return DataType.UNSIGNED_SHORT; } // eslint-disable-line
  if (typedArray instanceof Int32Array) { return DataType.INT; }            // eslint-disable-line
  if (typedArray instanceof Uint32Array) { return DataType.UNSIGNED_INT; }   // eslint-disable-line
  if (typedArray instanceof Float32Array) { return DataType.FLOAT; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}


export function getGLTypeForTypedArrayType(typedArrayType: Int8ArrayConstructor | Uint8ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Float32ArrayConstructor | Uint8ClampedArrayConstructor) {
  if (typedArrayType === Int8Array) { return DataType.BYTE; }           // eslint-disable-line
  if (typedArrayType === Uint8Array) { return DataType.UNSIGNED_BYTE; }  // eslint-disable-line
  if (typedArrayType === Uint8ClampedArray) { return DataType.UNSIGNED_BYTE; }  // eslint-disable-line
  if (typedArrayType === Int16Array) { return DataType.SHORT; }          // eslint-disable-line
  if (typedArrayType === Uint16Array) { return DataType.UNSIGNED_SHORT; } // eslint-disable-line
  if (typedArrayType === Int32Array) { return DataType.INT; }            // eslint-disable-line
  if (typedArrayType === Uint32Array) { return DataType.UNSIGNED_INT; }   // eslint-disable-line
  if (typedArrayType === Float32Array) { return DataType.FLOAT; }          // eslint-disable-line
  throw new Error('unsupported typed array type');
}


export function getTypedArrayTypeForGLType(type: DataType) {
  const CTOR = glTypeToTypedArray[type];
  if (!CTOR) {
    throw new Error('unknown gl type');
  }
  return CTOR;
}

export const isArrayBuffer = typeof SharedArrayBuffer !== 'undefined'
  ? function isArrayBufferOrSharedArrayBuffer(a: any) {
    return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
  }
  : function isArrayBuffer(a: any) {
    return a && a.buffer && a.buffer instanceof ArrayBuffer;
  };



