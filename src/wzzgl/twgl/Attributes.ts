
import * as typedArrays from './typedarrays';
import * as helper from './helper';
import { Attribs, AttribsName, BufferInfo } from './interface';
import { getBytesPerValueForGLType, getNormalizationForTypedArray, getNumComponents, isIndices, makeTypedArray } from './utils';

const STATIC_DRAW = 0x88e4;
const ARRAY_BUFFER = 0x8892;
const ELEMENT_ARRAY_BUFFER = 0x8893;
const BUFFER_SIZE = 0x8764;



function setBufferFromTypedArray(gl: WebGL2RenderingContext, type: number, buffer: WebGLBuffer, array: any, drawType: any) {
  gl.bindBuffer(type, buffer);
  gl.bufferData(type, array, drawType || STATIC_DRAW);
}


export default class Attributes {
  
  createBufferInfoFromArrays(gl: WebGL2RenderingContext, arrays: BufferInfo, srcBufferInfo?: BufferInfo) {
    const newAttribs = this.createAttribsFromArrays(gl, arrays);
    const bufferInfo: BufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
    bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
    const indices = arrays.indices;
    if (indices) {
      const newIndices = makeTypedArray(indices, "indices");
      bufferInfo.indices = this.createBufferFromTypedArray(gl, newIndices, ELEMENT_ARRAY_BUFFER);
      bufferInfo.numElements = newIndices.length;
      bufferInfo.elementType = typedArrays.getGLTypeForTypedArray(newIndices);
    } else if (!bufferInfo.numElements) {
      bufferInfo.numElements = this.getNumElementsFromAttributes(gl, bufferInfo.attribs);
    }

    return bufferInfo;
  }
  createBufferFromTypedArray(gl: WebGL2RenderingContext, typedArray: any, type: number, drawType?: any) {
    if (helper.isBuffer(typedArray)) {
      return typedArray;
    }
    type = type || ARRAY_BUFFER;
    const buffer = gl.createBuffer();
    setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
    return buffer;
  }
  createAttribsFromArrays(gl: WebGL2RenderingContext, arrays: any): Attribs {
    const attribs: Attribs = {};
    Object.keys(arrays).forEach((arrayName: AttribsName) => {
      if (!isIndices(arrayName)) {
        const array = arrays[arrayName];
        const attribName = arrayName;

        let buffer: WebGLBuffer;
        let type;
        let normalization;
        let numComponents;

        const typedArray = makeTypedArray(array, arrayName);
        buffer = this.createBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
        type = typedArrays.getGLTypeForTypedArray(typedArray);
        normalization = array.normalize !== undefined ? array.normalize : getNormalizationForTypedArray(typedArray);
        numComponents = getNumComponents(array, arrayName);

        attribs[attribName] = {
          buffer: buffer,
          numComponents: numComponents,
          type: type,
          normalize: normalization,
          stride: array.stride || 0,
          offset: array.offset || 0,
          divisor: array.divisor === undefined ? undefined : array.divisor,
          drawType: array.drawType,
        };

      }
    });
    gl.bindBuffer(ARRAY_BUFFER, null);
    return attribs;
  }
  getNumElementsFromAttributes(gl: WebGL2RenderingContext, attribs: any) {
    const positionKeys = ['position', 'positions', 'a_position'];
    let key;
    let ii;
    for (ii = 0; ii < positionKeys.length; ++ii) {
      key = positionKeys[ii];
      if (key in attribs) {
        break;
      }

      if (key in attribs) {
        break;
      }
    }
    if (ii === positionKeys.length) {
      key = Object.keys(attribs)[0];
    }
    const attrib = attribs[key];
    gl.bindBuffer(ARRAY_BUFFER, attrib.buffer);
    const numBytes = gl.getBufferParameter(ARRAY_BUFFER, BUFFER_SIZE);
    gl.bindBuffer(ARRAY_BUFFER, null);

    const bytesPerValue = getBytesPerValueForGLType(attrib.type);
    const totalElements = numBytes / bytesPerValue;
    const numComponents = attrib.numComponents || attrib.size;
    // TODO: check stride
    const numElements = totalElements / numComponents;
    if (numElements % 1 !== 0) {
      throw new Error(`numComponents ${numComponents} not correct for length ${length}`);
    }
    return numElements;
  }

}