
import { DataType } from './constants.js';
import { AttribInfo, AttribItem } from './types.js';
import { getGLTypeForTypedArray, isIndices } from './utils.js';


function setBufferFromTypedArray(gl: WebGLRenderingContext, type: number, buffer: WebGLBuffer, array: ArrayBuffer, drawType?: number) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || DataType.STATIC_DRAW);
}


function createBufferFromTypedArray(gl: WebGLRenderingContext, typedArray: ArrayBuffer, type: number, drawType?: number) {

  type = type || DataType.ARRAY_BUFFER;
  const buffer = gl.createBuffer();
  setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
  return buffer;
}

function createAttribsFromArrays(gl: WebGL2RenderingContext, arrays: AttribInfo) {
  const attribs = {};
  Object.keys(arrays).forEach(function (arrayName) {
    if (!isIndices(arrayName)) {
      const array = arrays[arrayName];
      const attribName = arrayName;


      const typedArray = array.buffer;
      let buffer = createBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
      let type = getGLTypeForTypedArray(typedArray);
      let normalization = array.normalize || false
      let numComponents = array.numComponents;

      attribs[attribName] = {
        buffer: buffer,
        numComponents: numComponents,
        type: type,
        normalize: normalization,
        stride: array.stride || 0,
        offset: array.offset || 0,
        divisor: array.divisor,
        drawType: array.drawType,
      };

    }
  });
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return attribs;
}

function setAttribInfoBufferFromArray(gl: WebGLRenderingContext, attribInfo: AttribItem, array: ArrayBuffer, offset: number) {

  if (offset !== undefined) {
    gl.bindBuffer(DataType.ARRAY_BUFFER, attribInfo.buffer);
    gl.bufferSubData(DataType.ARRAY_BUFFER, offset, array);
  } else {
    setBufferFromTypedArray(gl, DataType.ARRAY_BUFFER, attribInfo.buffer, array, attribInfo.drawType);
  }
}

function createBufferInfoFromArrays(gl: WebGL2RenderingContext, arrays: AttribInfo) {
  const newAttribs = createAttribsFromArrays(gl, arrays);
  const bufferInfo: any = {};
  bufferInfo.attribs = newAttribs
  const indices = arrays.indices;
  if (indices) {
    const newIndices = indices.buffer;
    bufferInfo.indices = createBufferFromTypedArray(gl, newIndices, gl.ELEMENT_ARRAY_BUFFER);
    bufferInfo.numElements = newIndices.length;
    bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
  }

  return bufferInfo;
}

function createBufferFromArray(gl: WebGLRenderingContext, array: AttribItem, arrayName: string) {
  const type = arrayName === "indices" ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
  const typedArray = array.buffer;
  return createBufferFromTypedArray(gl, typedArray, type);
}



export {
  createAttribsFromArrays,
  createBufferFromArray,
  createBufferFromTypedArray,
  createBufferInfoFromArrays,
  setAttribInfoBufferFromArray,
};

