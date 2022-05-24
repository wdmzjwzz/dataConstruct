import { DataType, glTypeToTypedArray } from "./constants";

export function isIndices(name: string) {
    return name === "indices";
}

export function copyNamedProperties(names, src, dst) {
    names.forEach((name) => {
        const value = src[name];
        if (value !== undefined) {
            dst[name] = value;
        }
    });
}


export function copyExistingProperties(src, dst) {
    Object.keys(dst).forEach((key) => {
        if (dst.hasOwnProperty(key) && src.hasOwnProperty(key)) {  /* eslint no-prototype-builtins: 0 */
            dst[key] = src[key];
        }
    });
}

export function error(...args) {
    console.error(...args);
}

export function warn(...args) {
    console.warn(...args);
}

export function isBuffer(gl, t) {
    return typeof WebGLBuffer !== 'undefined' && t instanceof WebGLBuffer;
}

export function isRenderbuffer(gl, t) {
    return typeof WebGLRenderbuffer !== 'undefined' && t instanceof WebGLRenderbuffer;
}

export function isShader(gl, t) {
    return typeof WebGLShader !== 'undefined' && t instanceof WebGLShader;
}

export function isTexture(gl, t) {
    return typeof WebGLTexture !== 'undefined' && t instanceof WebGLTexture;
}

export function isSampler(gl, t) {
    return typeof WebGLSampler !== 'undefined' && t instanceof WebGLSampler;
}


/**
 * Get the GL type for a typedArray
 * @param {ArrayBufferView} typedArray a typedArray
 * @return {number} the GL type for array. For example pass in an `Int8Array` and `gl.BYTE` will
 *   be returned. Pass in a `Uint32Array` and `gl.UNSIGNED_INT` will be returned
 * @memberOf module:twgl/typedArray
 */
export function getGLTypeForTypedArray(typedArray) {
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

/**
 * Get the typed array constructor for a given GL type
 * @param {number} type the GL type. (eg: `gl.UNSIGNED_INT`)
 * @return {function} the constructor for a the corresponding typed array. (eg. `Uint32Array`).
 * @memberOf module:twgl/typedArray
 */
export function geypedArrayTypeForGLType(type) {
    const CTOR = glTypeToTypedArray[type];
    if (!CTOR) {
        throw new Error('unknown gl type');
    }
    return CTOR;
}

export const isArrayBuffer = typeof SharedArrayBuffer !== 'undefined'
    ? function isArrayBufferOrSharedArrayBuffer(a) {
        return a && a.buffer && (a.buffer instanceof ArrayBuffer || a.buffer instanceof SharedArrayBuffer);
    }
    : function isArrayBuffer(a) {
        return a && a.buffer && a.buffer instanceof ArrayBuffer;
    };

export function getArray(array) {
    return array.length ? array : array.data;
}



export function getNumComponents(array, arrayName) {
    return array.numComponents
}