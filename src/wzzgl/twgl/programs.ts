import { DataType } from "./interface";



export class Programs {
    public setterMap: any = {}
    constructor() {
        this.setterMap[DataType.FLOAT] = { Type: Float32Array, size: 4, setter: floatSetter, arraySetter: floatArraySetter, };
        this.setterMap[DataType.FLOAT_VEC2] = { Type: Float32Array, size: 8, setter: floatVec2Setter, cols: 2, };
        this.setterMap[DataType.FLOAT_VEC3] = { Type: Float32Array, size: 12, setter: floatVec3Setter, cols: 3, };
        this.setterMap[DataType.FLOAT_VEC4] = { Type: Float32Array, size: 16, setter: floatVec4Setter, cols: 4, };
        this.setterMap[DataType.INT] = { Type: Int32Array, size: 4, setter: intSetter, arraySetter: intArraySetter, };
        this.setterMap[DataType.INT_VEC2] = { Type: Int32Array, size: 8, setter: intVec2Setter, cols: 2, };
        this.setterMap[DataType.INT_VEC3] = { Type: Int32Array, size: 12, setter: intVec3Setter, cols: 3, };
        this.setterMap[DataType.INT_VEC4] = { Type: Int32Array, size: 16, setter: intVec4Setter, cols: 4, };
        this.setterMap[DataType.UNSIGNED_INT] = { Type: Uint32Array, size: 4, setter: uintSetter, arraySetter: uintArraySetter, };
        this.setterMap[DataType.UNSIGNED_INT_VEC2] = { Type: Uint32Array, size: 8, setter: uintVec2Setter, cols: 2, };
        this.setterMap[DataType.UNSIGNED_INT_VEC3] = { Type: Uint32Array, size: 12, setter: uintVec3Setter, cols: 3, };
        this.setterMap[DataType.UNSIGNED_INT_VEC4] = { Type: Uint32Array, size: 16, setter: uintVec4Setter, cols: 4, };
        this.setterMap[DataType.BOOL] = { Type: Uint32Array, size: 4, setter: intSetter, arraySetter: intArraySetter, };
        this.setterMap[DataType.BOOL_VEC2] = { Type: Uint32Array, size: 8, setter: intVec2Setter, cols: 2, };
        this.setterMap[DataType.BOOL_VEC3] = { Type: Uint32Array, size: 12, setter: intVec3Setter, cols: 3, };
        this.setterMap[DataType.BOOL_VEC4] = { Type: Uint32Array, size: 16, setter: intVec4Setter, cols: 4, };
        this.setterMap[DataType.FLOAT_MAT2] = { Type: Float32Array, size: 32, setter: floatMat2Setter, rows: 2, cols: 2, };
        this.setterMap[DataType.FLOAT_MAT3] = { Type: Float32Array, size: 48, setter: floatMat3Setter, rows: 3, cols: 3, };
        this.setterMap[DataType.FLOAT_MAT4] = { Type: Float32Array, size: 64, setter: floatMat4Setter, rows: 4, cols: 4, };
        this.setterMap[DataType.FLOAT_MAT2x3] = { Type: Float32Array, size: 32, setter: floatMat23Setter, rows: 2, cols: 3, };
        this.setterMap[DataType.FLOAT_MAT2x4] = { Type: Float32Array, size: 32, setter: floatMat24Setter, rows: 2, cols: 4, };
        this.setterMap[DataType.FLOAT_MAT3x2] = { Type: Float32Array, size: 48, setter: floatMat32Setter, rows: 3, cols: 2, };
        this.setterMap[DataType.FLOAT_MAT3x4] = { Type: Float32Array, size: 48, setter: floatMat34Setter, rows: 3, cols: 4, };
        this.setterMap[DataType.FLOAT_MAT4x2] = { Type: Float32Array, size: 64, setter: floatMat42Setter, rows: 4, cols: 2, };
        this.setterMap[DataType.FLOAT_MAT4x3] = { Type: Float32Array, size: 64, setter: floatMat43Setter, rows: 4, cols: 3, };
        this.setterMap[DataType.SAMPLER_2D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D, };
        this.setterMap[DataType.SAMPLER_CUBE] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_CUBE_MAP, };
        this.setterMap[DataType.SAMPLER_3D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_3D, };
        this.setterMap[DataType.SAMPLER_2D_SHADOW] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D, };
        this.setterMap[DataType.SAMPLER_2D_ARRAY] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D_ARRAY, };
        this.setterMap[DataType.SAMPLER_2D_ARRAY_SHADOW] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D_ARRAY, };
        this.setterMap[DataType.SAMPLER_CUBE_SHADOW] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_CUBE_MAP, };
        this.setterMap[DataType.INT_SAMPLER_2D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D, };
        this.setterMap[DataType.INT_SAMPLER_3D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_3D, };
        this.setterMap[DataType.INT_SAMPLER_CUBE] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_CUBE_MAP, };
        this.setterMap[DataType.INT_SAMPLER_2D_ARRAY] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D_ARRAY, };
        this.setterMap[DataType.UNSIGNED_INT_SAMPLER_2D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D, };
        this.setterMap[DataType.UNSIGNED_INT_SAMPLER_3D] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_3D, };
        this.setterMap[DataType.UNSIGNED_INT_SAMPLER_CUBE] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_CUBE_MAP, };
        this.setterMap[DataType.UNSIGNED_INT_SAMPLER_2D_ARRAY] = { Type: null, size: 0, setter: samplerSetter, arraySetter: samplerArraySetter, bindPoint: DataType.TEXTURE_2D_ARRAY, };

    }
    floatSetter(gl, location) {
        return function (v) {
            gl.uniform1f(location, v);
        };
    }

    floatArraySetter(gl, location) {
        return function (v) {
            gl.uniform1fv(location, v);
        };
    }

    floatVec2Setter(gl, location) {
        return function (v) {
            gl.uniform2fv(location, v);
        };
    }

    floatVec3Setter(gl, location) {
        return function (v) {
            gl.uniform3fv(location, v);
        };
    }

    floatVec4Setter(gl, location) {
        return function (v) {
            gl.uniform4fv(location, v);
        };
    }

    intSetter(gl, location) {
        return function (v) {
            gl.uniform1i(location, v);
        };
    }

    intArraySetter(gl, location) {
        return function (v) {
            gl.uniform1iv(location, v);
        };
    }

    intVec2Setter(gl, location) {
        return function (v) {
            gl.uniform2iv(location, v);
        };
    }

    intVec3Setter(gl, location) {
        return function (v) {
            gl.uniform3iv(location, v);
        };
    }

    intVec4Setter(gl, location) {
        return function (v) {
            gl.uniform4iv(location, v);
        };
    }

    uintSetter(gl, location) {
        return function (v) {
            gl.uniform1ui(location, v);
        };
    }

    uintArraySetter(gl, location) {
        return function (v) {
            gl.uniform1uiv(location, v);
        };
    }

    uintVec2Setter(gl, location) {
        return function (v) {
            gl.uniform2uiv(location, v);
        };
    }

    uintVec3Setter(gl, location) {
        return function (v) {
            gl.uniform3uiv(location, v);
        };
    }

    uintVec4Setter(gl, location) {
        return function (v) {
            gl.uniform4uiv(location, v);
        };
    }

    floatMat2Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix2fv(location, false, v);
        };
    }

    floatMat3Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix3fv(location, false, v);
        };
    }

    floatMat4Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix4fv(location, false, v);
        };
    }

    floatMat23Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix2x3fv(location, false, v);
        };
    }

    floatMat32Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix3x2fv(location, false, v);
        };
    }

    floatMat24Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix2x4fv(location, false, v);
        };
    }

    floatMat42Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix4x2fv(location, false, v);
        };
    }

    floatMat34Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix3x4fv(location, false, v);
        };
    }

    floatMat43Setter(gl, location) {
        return function (v) {
            gl.uniformMatrix4x3fv(location, false, v);
        };
    }

    samplerSetter(gl, type, unit, location) {
        const bindPoint = getBindPointForSamplerType(gl, type);
        return utils.isWebGL2(gl) ? function (textureOrPair) {
            let texture;
            let sampler;
            if (helper.isTexture(gl, textureOrPair)) {
                texture = textureOrPair;
                sampler = null;
            } else {
                texture = textureOrPair.texture;
                sampler = textureOrPair.sampler;
            }
            gl.uniform1i(location, unit);
            gl.activeTexture(TEXTURE0 + unit);
            gl.bindTexture(bindPoint, texture);
            gl.bindSampler(unit, sampler);
        } : function (texture) {
            gl.uniform1i(location, unit);
            gl.activeTexture(TEXTURE0 + unit);
            gl.bindTexture(bindPoint, texture);
        };
    }

    samplerArraySetter(gl, type, unit, location, size) {
        const bindPoint = getBindPointForSamplerType(gl, type);
        const units = new Int32Array(size);
        for (let ii = 0; ii < size; ++ii) {
            units[ii] = unit + ii;
        }

        return utils.isWebGL2(gl) ? function (textures) {
            gl.uniform1iv(location, units);
            textures.forEach(function (textureOrPair, index) {
                gl.activeTexture(TEXTURE0 + units[index]);
                let texture;
                let sampler;
                if (helper.isTexture(gl, textureOrPair)) {
                    texture = textureOrPair;
                    sampler = null;
                } else {
                    texture = textureOrPair.texture;
                    sampler = textureOrPair.sampler;
                }
                gl.bindSampler(unit, sampler);
                gl.bindTexture(bindPoint, texture);
            });
        } : function (textures) {
            gl.uniform1iv(location, units);
            textures.forEach(function (texture, index) {
                gl.activeTexture(TEXTURE0 + units[index]);
                gl.bindTexture(bindPoint, texture);
            });
        };
    }


    createProgramFromSources(gl: WebGL2RenderingContext, vs: string, fs: string) {

        const shaders = [];
        const vs_shader = this.loadShader(
            gl, vs, gl.VERTEX_SHADER);


        const fs_shader = this.loadShader(
            gl, fs, gl.FRAGMENT_SHADER);

        shaders.push(vs_shader, fs_shader);
        return this.createProgram(gl, shaders);
    }
    createProgram(gl: WebGL2RenderingContext, shaders: WebGLShader[]) {
        const program = gl.createProgram();
        shaders.forEach(function (shader) {
            gl.attachShader(program, shader);
        });

        gl.linkProgram(program);

        // Check the link status
        const linked = gl.getProgramParameter(program, LINK_STATUS);
        if (!linked) {
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    loadShader(gl: WebGL2RenderingContext, shaderSource: string, shaderType: number) {

        // Create the shader object
        const shader = gl.createShader(shaderType);
        // Load the shader source
        gl.shaderSource(shader, shaderSource);

        // Compile the shader
        gl.compileShader(shader);

        // Check the compile status
        const compiled = gl.getShaderParameter(shader, COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error 
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    createUniformSetters(gl: WebGL2RenderingContext, program: WebGLProgram) {
        let textureUnit = 0;

        /**
         * Creates a setter for a uniform of the given program with it's
         * location embedded in the setter.
         * @param {WebGLProgram} program
         * @param {WebGLUniformInfo} uniformInfo
         * @returns {function} the created setter.
         */
        function createUniformSetter(uniformInfo, location) {
            const isArray = uniformInfo.name.endsWith("[0]");
            const type = uniformInfo.type;
            const typeInfo = this.setterMap[type];
            if (!typeInfo) {
                throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
            }
            let setter;
            if (typeInfo.bindPoint) {
                // it's a sampler
                const unit = textureUnit;
                textureUnit += uniformInfo.size;
                if (isArray) {
                    setter = typeInfo.arraySetter(gl, type, unit, location, uniformInfo.size);
                } else {
                    setter = typeInfo.setter(gl, type, unit, location, uniformInfo.size);
                }
            } else {
                if (typeInfo.arraySetter && isArray) {
                    setter = typeInfo.arraySetter(gl, location);
                } else {
                    setter = typeInfo.setter(gl, location);
                }
            }
            setter.location = location;
            return setter;
        }

        const uniformSetters = {};
        const uniformTree = {};
        const numUniforms = gl.getProgramParameter(program, ACTIVE_UNIFORMS);

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = gl.getActiveUniform(program, ii);
            if (isBuiltIn(uniformInfo)) {
                continue;
            }
            let name = uniformInfo.name;
            // remove the array suffix.
            if (name.endsWith("[0]")) {
                name = name.substr(0, name.length - 3);
            }
            const location = gl.getUniformLocation(program, uniformInfo.name);
            // the uniform will have no location if it's in a uniform block
            if (location) {
                const setter = createUniformSetter(uniformInfo, location);
                uniformSetters[name] = setter;
                addSetterToUniformTree(name, setter, uniformTree, uniformSetters);
            }
        }

        return uniformSetters;
        }
}