import { DataType } from "./constants"
import { isTexture } from "./utils";

export const typeMap: { [key: number]: any } = {
    [DataType.FLOAT]: {
        Type: Float32Array,
        size: 4,
        setter: floatSetter,
        arraySetter: floatArraySetter,
    },
    [DataType.FLOAT_VEC2]: {
        Type: Float32Array,
        size: 8,
        setter: floatVec2Setter,
        cols: 2,
    },
    [DataType.FLOAT_VEC3]: {
        Type: Float32Array,
        size: 12,
        setter: floatVec3Setter,
        cols: 3,
    },
    [DataType.FLOAT_VEC4]: {
        Type: Float32Array,
        size: 16,
        setter: floatVec4Setter,
        cols: 4,
    },
    [DataType.INT]: {
        Type: Int32Array,
        size: 4,
        setter: intSetter,
        arraySetter: intArraySetter,
    },
    [DataType.INT_VEC2]: {
        Type: Int32Array,
        size: 8,
        setter: intVec2Setter,
        cols: 2,
    },
    [DataType.INT_VEC3]: {
        Type: Int32Array,
        size: 12,
        setter: intVec3Setter,
        cols: 3,
    },
    [DataType.INT_VEC4]: {
        Type: Int32Array,
        size: 16,
        setter: intVec4Setter,
        cols: 4,
    },
    [DataType.UNSIGNED_INT]: {
        Type: Uint32Array,
        size: 4,
        setter: uintSetter,
        arraySetter: uintArraySetter,
    },
    [DataType.UNSIGNED_INT_VEC2]: {
        Type: Uint32Array,
        size: 8,
        setter: uintVec2Setter,
        cols: 2,
    },
    [DataType.UNSIGNED_INT_VEC3]: {
        Type: Uint32Array,
        size: 12,
        setter: uintVec3Setter,
        cols: 3,
    },
    [DataType.UNSIGNED_INT_VEC4]: {
        Type: Uint32Array,
        size: 16,
        setter: uintVec4Setter,
        cols: 4,
    },
    [DataType.BOOL]: {
        Type: Uint32Array,
        size: 4,
        setter: intSetter,
        arraySetter: intArraySetter,
    },
    [DataType.BOOL_VEC2]: {
        Type: Uint32Array,
        size: 8,
        setter: intVec2Setter,
        cols: 2,
    },
    [DataType.BOOL_VEC3]: {
        Type: Uint32Array,
        size: 12,
        setter: intVec3Setter,
        cols: 3,
    },
    [DataType.BOOL_VEC4]: {
        Type: Uint32Array,
        size: 16,
        setter: intVec4Setter,
        cols: 4,
    },
    [DataType.FLOAT_MAT2]: {
        Type: Float32Array,
        size: 32,
        setter: floatMat2Setter,
        rows: 2,
        cols: 2,
    },
    [DataType.FLOAT_MAT3]: {
        Type: Float32Array,
        size: 48,
        setter: floatMat3Setter,
        rows: 3,
        cols: 3,
    },
    [DataType.FLOAT_MAT4]: {
        Type: Float32Array,
        size: 64,
        setter: floatMat4Setter,
        rows: 4,
        cols: 4,
    },
    [DataType.FLOAT_MAT2x3]: {
        Type: Float32Array,
        size: 32,
        setter: floatMat23Setter,
        rows: 2,
        cols: 3,
    },
    [DataType.FLOAT_MAT2x4]: {
        Type: Float32Array,
        size: 32,
        setter: floatMat24Setter,
        rows: 2,
        cols: 4,
    },
    [DataType.FLOAT_MAT3x2]: {
        Type: Float32Array,
        size: 48,
        setter: floatMat32Setter,
        rows: 3,
        cols: 2,
    },
    [DataType.FLOAT_MAT3x4]: {
        Type: Float32Array,
        size: 48,
        setter: floatMat34Setter,
        rows: 3,
        cols: 4,
    },
    [DataType.FLOAT_MAT4x2]: {
        Type: Float32Array,
        size: 64,
        setter: floatMat42Setter,
        rows: 4,
        cols: 2,
    },
    [DataType.FLOAT_MAT4x3]: {
        Type: Float32Array,
        size: 64,
        setter: floatMat43Setter,
        rows: 4,
        cols: 3,
    },
    [DataType.SAMPLER_2D]: {
      
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D,
    },
    [DataType.SAMPLER_CUBE]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_CUBE_MAP,
    },
    [DataType.SAMPLER_3D]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_3D,
    },
    [DataType.SAMPLER_2D_SHADOW]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D,
    },
    [DataType.SAMPLER_2D_ARRAY]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D_ARRAY,
    },
    [DataType.SAMPLER_2D_ARRAY_SHADOW]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D_ARRAY,
    },
    [DataType.SAMPLER_CUBE_SHADOW]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_CUBE_MAP,
    },
    [DataType.INT_SAMPLER_2D]: { 
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D,
    },
    [DataType.INT_SAMPLER_3D]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_3D,
    },
    [DataType.INT_SAMPLER_CUBE]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_CUBE_MAP,
    },
    [DataType.INT_SAMPLER_2D_ARRAY]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D_ARRAY,
    },
    [DataType.UNSIGNED_INT_SAMPLER_2D]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D,
    },
    [DataType.UNSIGNED_INT_SAMPLER_3D]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_3D,
    },
    [DataType.UNSIGNED_INT_SAMPLER_CUBE]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_CUBE_MAP,
    },
    [DataType.UNSIGNED_INT_SAMPLER_2D_ARRAY]: {
        
        size: 0,
        setter: samplerSetter,
        arraySetter: samplerArraySetter,
        bindPoint: DataType.TEXTURE_2D_ARRAY,
    },

}


function floatSetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: number) {
        gl.uniform1f(location, v);
    };
}

function floatArraySetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform1fv(location, v);
    };
}

function floatVec2Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform2fv(location, v);
    };
}

function floatVec3Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform3fv(location, v);
    };
}

function floatVec4Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform4fv(location, v);
    };
}

function intSetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: number) {
        gl.uniform1i(location, v);
    };
}

function intArraySetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform1iv(location, v);
    };
}

function intVec2Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform2iv(location, v);
    };
}

function intVec3Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform3iv(location, v);
    };
}

function intVec4Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform4iv(location, v);
    };
}

function uintSetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: number) {
        gl.uniform1ui(location, v);
    };
}

function uintArraySetter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform1uiv(location, v);
    };
}

function uintVec2Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform2uiv(location, v);
    };
}

function uintVec3Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform3uiv(location, v);
    };
}

function uintVec4Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniform4uiv(location, v);
    };
}

function floatMat2Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix2fv(location, false, v);
    };
}

function floatMat3Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix3fv(location, false, v);
    };
}

function floatMat4Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix4fv(location, false, v);
    };
}

function floatMat23Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix2x3fv(location, false, v);
    };
}

function floatMat32Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix3x2fv(location, false, v);
    };
}

function floatMat24Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix2x4fv(location, false, v);
    };
}

function floatMat42Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix4x2fv(location, false, v);
    };
}

function floatMat34Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix3x4fv(location, false, v);
    };
}

function floatMat43Setter(gl: WebGL2RenderingContext, location: number) {
    return function (v: Iterable<number>) {
        gl.uniformMatrix4x3fv(location, false, v);
    };
}
function samplerSetter(
    gl: WebGL2RenderingContext,
    type: number,
    unit: number,
    location: number
) {
    const bindPoint = getBindPointForSamplerType(type);
    return function (textureOrPair: { texture: any; sampler: any; }) {
        let texture;
        let sampler;
        if (isTexture(textureOrPair)) {
            texture = textureOrPair;
            sampler = null;
        } else {
            texture = textureOrPair.texture;
            sampler = textureOrPair.sampler;
        }
        // gl.uniform1i(location, unit);
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(bindPoint, texture);
        // gl.bindSampler(unit, sampler);
    };
}
function getBindPointForSamplerType(type: number) {
    return (typeMap as any)[type].bindPoint;
}

function samplerArraySetter(
    gl: WebGL2RenderingContext,
    type: number,
    unit: number,
    location: number,
    size: number
) {
    const bindPoint = getBindPointForSamplerType(type);
    const units = new Int32Array(size);
    for (let ii = 0; ii < size; ++ii) {
        units[ii] = unit + ii;
    }

    return function (textures: any[]) {
        gl.uniform1iv(location, units);
        textures.forEach(function (textureOrPair, index) {
            gl.activeTexture(gl.TEXTURE0 + units[index]);
            let texture;
            let sampler;
            if (isTexture(textureOrPair)) {
                texture = textureOrPair;
                sampler = null;
            } else {
                texture = textureOrPair.texture;
                sampler = textureOrPair.sampler;
            }
            gl.bindSampler(unit, sampler);
            gl.bindTexture(bindPoint, texture);
        });
    };
}
