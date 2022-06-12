import { attrTypeMap } from "./attriMap";
import { ProgramInfo, ProgramOptions } from "./interface";
import { typeMap } from "./programTypeMap";
// import { typeMap } from "./programTypeMap";

export default class Programs {
    public gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl
    }
    public loadShader(shaderSource: string, shaderType: number,): WebGLShader {
        // Create the shader object
        const shader = this.gl.createShader(shaderType);

        // Load the shader source
        this.gl.shaderSource(shader, shaderSource);

        // Compile the shader
        this.gl.compileShader(shader);

        // Check the compile status
        const compiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (!compiled) {
            const lastError = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(lastError);
        }

        return shader;
    }
    public deleteShaders(shaders: WebGLShader[]) {
        shaders.forEach((shader) => {
            this.gl.deleteShader(shader);
        });
    }
    public createProgramInfo(
        vsShaderSources: string,
        fsShaderSources: string,
        opt_attribs?: ProgramOptions): ProgramInfo {
        const program = this.createProgramFromSources(vsShaderSources, fsShaderSources, opt_attribs);
        if (!program) {
            return null;
        }

        const uniformSetters: any = this.createUniformSetters(program)
        const attribSetters: any = this.createAttributeSetters(program);
        const uniformBlockSpec: any = {};
        const transformFeedbackInfo: any = {};
        const programInfo = {
            program,
            uniformSetters,
            attribSetters,
            uniformBlockSpec,
            transformFeedbackInfo
        };
        return programInfo;
    }
    private createAttributeSetters(program: WebGLProgram) {
        const attribSetters: any = {
        }; 
        const numAttribs = this.gl.getProgramParameter(program, this.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttribs; ++i) {
            const attribInfo = this.gl.getActiveAttrib(program, i);
            const index = this.gl.getAttribLocation(program, attribInfo.name);
            const typeInfo = attrTypeMap[attribInfo.type];
            const setter = typeInfo.setter(this.gl, index, typeInfo);
            setter.location = index;
            attribSetters[attribInfo.name] = setter;
        }

        return attribSetters;
    }

    private createProgram(vsShader: WebGLShader, fsShader: WebGLShader, opt_attribs?: ProgramOptions): WebGLProgram {
        const program = this.gl.createProgram();
        this.gl.attachShader(program, vsShader);
        this.gl.attachShader(program, fsShader);
        if (opt_attribs?.attribLocations) {
            Object.keys(opt_attribs.attribLocations).forEach((attrib) => {
                this.gl.bindAttribLocation(program, opt_attribs.attribLocations[attrib], attrib);
            });
        }
        let varyings = opt_attribs?.transformFeedbackVaryings;
        if (varyings) {
            this.gl.transformFeedbackVaryings(program, varyings, opt_attribs.transformFeedbackMode || this.gl.SEPARATE_ATTRIBS);
        }
        this.gl.linkProgram(program);

        // Check the link status
        const linked = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
        if (!linked) {
            const lastError = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            this.deleteShaders([vsShader, fsShader]);
            throw new Error(lastError);

        }
        return program;
    }


    private createProgramFromSources(vsShaderSources: string, fsShaderSources: string, opt_attribs?: ProgramOptions) {

        const vsShader = this.loadShader(vsShaderSources, this.gl.VERTEX_SHADER);

        const fsShader = this.loadShader(fsShaderSources, this.gl.FRAGMENT_SHADER);

        return this.createProgram(vsShader, fsShader, opt_attribs);
    }
    private createUniformSetters(program: WebGLProgram) {
     
        const uniformSetters: any = {};
        // const uniformTree = {};
        const numUniforms = this.gl.getProgramParameter(program, this.gl.ACTIVE_UNIFORMS);

        for (let ii = 0; ii < numUniforms; ++ii) {
            const uniformInfo = this.gl.getActiveUniform(program, ii);
           
            let name = uniformInfo.name;
            // remove the array suffix.
            if (name.endsWith("[0]")) {
                name = name.substr(0, name.length - 3);
            }
            const location = this.gl.getUniformLocation(program, uniformInfo.name);
 
            // the uniform will have no location if it's in a uniform block
            if (location) {
                const setter = this.createUniformSetter(uniformInfo, location);
                uniformSetters[name] = setter;
                // addSetterToUniformTree(name, setter, uniformTree, uniformSetters);
            }
        }

        return uniformSetters;
    }
    private createUniformSetter(uniformInfo: WebGLActiveInfo, location: WebGLUniformLocation) {
        let textureUnit = 0;
        const isArray = uniformInfo.name.endsWith("[0]");
        const type = uniformInfo.type;
        const typeInfo =typeMap[type];
        if (!typeInfo) {
            throw new Error(`unknown type: 0x${type.toString(16)}`); // we should never get here.
        }
        let setter;
        if (typeInfo.bindPoint) {
            // it's a sampler
            const unit = textureUnit;
            textureUnit += uniformInfo.size;
            if (isArray) {
                setter = typeInfo.arraySetter(this.gl, type, unit, location, uniformInfo.size);
            } else {
                setter = typeInfo.setter(this.gl, type, unit, location, uniformInfo.size);
            }
        } else {
            if (typeInfo.arraySetter && isArray) {
                setter = typeInfo.arraySetter(this.gl, location);
            } else {
                setter = typeInfo.setter(this.gl, location);
            }
        }
        setter.location = location;
        return setter;
    }
}