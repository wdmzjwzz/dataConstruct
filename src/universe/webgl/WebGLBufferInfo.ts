import { DataType } from "../../tinyWebGL/constants";

export interface BufferDataDesc {
    data: Int8Array | Int16Array | Int32Array | Uint16Array | Uint32Array | Float32Array;
    numComponents?: number;
    size?: number;
    stride?: number;
    offset?: number;
    divisor?: number;
    drawType?: number
};
export type BufferInfo = {
    numElements?: number;
    elementType?: number;
    indices?: WebGLBuffer;
    attribs?: {
        [key: string]: AttribInfo;
    };
};
export type AttribInfo = {
    value?: number[] | ArrayBufferView;
    numComponents?: number;
    size?: number;
    type?: number;
    normalize?: boolean;
    offset?: number;
    stride?: number;
    divisor?: number;
    buffer: WebGLBuffer;
    drawType?: number;
};
export type BufferDatas = {
    [key: string]: BufferDataDesc;
};
class BufferInfoFactory {
    static _instance: BufferInfoFactory;
    static get instance() {

        if (!BufferInfoFactory._instance) {
            BufferInfoFactory._instance = new BufferInfoFactory()
        }
        return BufferInfoFactory._instance
    }
    public createBufferInfoFromArrays(gl: WebGL2RenderingContext, arrays: BufferDatas) {

        const bufferInfo: BufferInfo = {};
        bufferInfo.attribs = this.createAttribsFromArrays(gl, arrays);
        const indices = arrays.indices;
        if (indices) {
            const newIndices = indices.data
            bufferInfo.indices = this.setBufferFromTypedArray(gl, newIndices, gl.ELEMENT_ARRAY_BUFFER);
            bufferInfo.numElements = newIndices.length;
            bufferInfo.elementType = this.getGLTypeForTypedArray(newIndices);
        }
        return bufferInfo;
    }
    public getGLTypeForTypedArray(typedArray: any) {
        if (typedArray instanceof Int8Array) {
            return DataType.BYTE;
        }
        if (typedArray instanceof Uint8Array) {
            return DataType.UNSIGNED_BYTE;
        }
        if (typedArray instanceof Uint8ClampedArray) {
            return DataType.UNSIGNED_BYTE;
        }
        if (typedArray instanceof Int16Array) {
            return DataType.SHORT;
        }
        if (typedArray instanceof Uint16Array) {
            return DataType.UNSIGNED_SHORT;
        }
        if (typedArray instanceof Int32Array) {
            return DataType.INT;
        }
        if (typedArray instanceof Uint32Array) {
            return DataType.UNSIGNED_INT;
        }
        if (typedArray instanceof Float32Array) {
            return DataType.FLOAT;
        }
        throw new Error("unsupported typed array type");
    }
    private createAttribsFromArrays(gl: WebGL2RenderingContext, arrays: BufferDatas) {
        const attribs: {
            [key: string]: AttribInfo;
        } = {};
        Object.keys(arrays).forEach((attribName) => {
            if (attribName === "indices") {
                return
            }
            const array = arrays[attribName];
            let buffer = this.setBufferFromTypedArray(gl, array.data, undefined, array.drawType);
            attribs[attribName] = {
                buffer: buffer,
                numComponents: array.numComponents,
                type: this.getGLTypeForTypedArray(array.data),
                stride: array.stride || 0,
                offset: array.offset || 0,
                divisor: array.divisor,
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