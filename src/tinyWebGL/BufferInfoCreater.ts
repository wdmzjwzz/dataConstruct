import { Arrays, AttribInfo, BufferInfo } from "./interface";
import { getGLTypeForTypedArray, getNormalizationForTypedArray } from "./utils";

class BufferInfoFactory {
    static _instance: BufferInfoFactory;
    static get instance() {

        if (!BufferInfoFactory._instance) {
            BufferInfoFactory._instance = new BufferInfoFactory()
        }
        return BufferInfoFactory._instance
    }
    public createBufferInfoFromArrays(gl: WebGL2RenderingContext, arrays: Arrays, srcBufferInfo?: BufferInfo) {
        const newAttribs = this.createAttribsFromArrays(gl, arrays);
        const bufferInfo: BufferInfo = Object.assign({}, srcBufferInfo ? srcBufferInfo : {});
        bufferInfo.attribs = Object.assign({}, srcBufferInfo ? srcBufferInfo.attribs : {}, newAttribs);
        const indices = arrays.indices;
        if (indices) {
            const newIndices = indices.data
            bufferInfo.indices = this.setBufferFromTypedArray(gl, newIndices, gl.ELEMENT_ARRAY_BUFFER);
            bufferInfo.numElements = newIndices.length;
            bufferInfo.elementType = getGLTypeForTypedArray(newIndices);
        }
        return bufferInfo;
    }

    private createAttribsFromArrays(gl: WebGL2RenderingContext, arrays: Arrays) {
        const attribs: {
            [key: string]: AttribInfo;
        } = {};
        Object.keys(arrays).forEach((attribName) => {
            if (attribName === "indices") {
                return
            }
            const array = arrays[attribName];
            let buffer;
            let type;
            let normalization;
            let numComponents;
            if (array.buffer) {
                buffer = array.buffer;
                numComponents = array.numComponents || array.size;
                type = array.type;
                normalization = array.normalize;
            } else {
                const typedArray = array.data;
                buffer = this.setBufferFromTypedArray(gl, typedArray, undefined, array.drawType);
                type = getGLTypeForTypedArray(typedArray);
                normalization = array.normalize || getNormalizationForTypedArray(typedArray);
                numComponents = array.numComponents;
            }
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
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return attribs;
    }
    private setBufferFromTypedArray(gl: WebGL2RenderingContext, array: ArrayBufferView, type: number = gl.ARRAY_BUFFER, drawType: number = gl.STATIC_DRAW) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(type, buffer);
        gl.bufferData(type, array, drawType);
        return buffer
    }
}
export const BufferInfoCreater = BufferInfoFactory.instance