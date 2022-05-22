import { DataType } from "./interface";
import { isArrayBuffer } from "./typedarrays";


function isWebGL2(gl: any) {

  return !!gl.texStorage2D;
}


function isWebGL1(gl: any) {

  return !gl.texStorage2D;
}

const glEnumToString = (function () {
  const haveEnumsForType: any = {};
  const enums: any = {};

  function addEnums(gl: any) {
    const type = gl.constructor.name;
    if (!haveEnumsForType[type]) {
      for (const key in gl) {
        if (typeof gl[key] === 'number') {
          const existing = enums[gl[key]];
          enums[gl[key]] = existing ? `${existing} | ${key}` : key;
        }
      }
      haveEnumsForType[type] = true;
    }
  }

  return function glEnumToString(gl: any, value: any) {
    addEnums(gl);
    return enums[value] || (typeof value === 'number' ? `0x${value.toString(16)}` : value);
  };
}());

function guessNumComponentsFromName(name: string, length: number) {
  const texcoordRE = /coord|texture/i;
  const colorRE = /color|colour/i;
  let numComponents;
  if (texcoordRE.test(name)) {
    numComponents = 2;
  } else if (colorRE.test(name)) {
    numComponents = 4;
  } else {
    numComponents = 3;  // position, normals, indices ...
  }

  if (length % numComponents > 0) {
    throw new Error(`Can not guess numComponents for attribute '${name}'. Tried ${numComponents} but ${length} values is not evenly divisible by ${numComponents}. You should specify it.`);
  }
  return numComponents;
}
function getArray(array: any) {
  return array.length ? array : array.data;
}


function getNumComponents(array: any, arrayName: string) {
  return array.numComponents || array.size || guessNumComponentsFromName(arrayName, getArray(array).length);
}

function isIndices(name: string) {
  return name === "indices";
}


function getNormalizationForTypedArray(typedArray: any) {
  if (typedArray instanceof Int8Array) { return true; }  // eslint-disable-line
  if (typedArray instanceof Uint8Array) { return true; }  // eslint-disable-line
  return false;
}


function getNormalizationForTypedArrayType(typedArrayType: Int8ArrayConstructor | Uint8ArrayConstructor) {
  if (typedArrayType === Int8Array) { return true; }  // eslint-disable-line
  if (typedArrayType === Uint8Array) { return true; }  // eslint-disable-line
  return false;
}
function getBytesPerValueForGLType(type: DataType) {
  if (type === DataType.BYTE) return 1;  // eslint-disable-line
  if (type === DataType.UNSIGNED_BYTE) return 1;  // eslint-disable-line
  if (type === DataType.SHORT) return 2;  // eslint-disable-line
  if (type === DataType.UNSIGNED_SHORT) return 2;  // eslint-disable-line
  if (type === DataType.INT) return 4;  // eslint-disable-line
  if (type === DataType.UNSIGNED_INT) return 4;  // eslint-disable-line
  if (type === DataType.FLOAT) return 4;  // eslint-disable-line
  return 0;
}
function makeTypedArray(array: any, name: string) {
  if (isArrayBuffer(array)) {
    return array;
  }

  if (isArrayBuffer(array.data)) {
    return array.data;
  }

  if (Array.isArray(array)) {
    array = {
      data: array,
    };
  }

  let Type = array.type;
  if (!Type) {
    if (isIndices(name)) {
      Type = Uint16Array;
    } else {
      Type = Float32Array;
    }
  }
  return new Type(array.data);
}
export {
  glEnumToString,
  isWebGL1,
  isWebGL2,
  guessNumComponentsFromName,
  getNumComponents,
  isIndices,
  getNormalizationForTypedArray,
  getNormalizationForTypedArrayType,
  getBytesPerValueForGLType,
  makeTypedArray
};


