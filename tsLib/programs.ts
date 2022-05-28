import { DataType } from "./constants"; 
function loadShader(
  gl: WebGL2RenderingContext,
  shaderSource: string,
  shaderType: number
) {
  const shader = gl.createShader(shaderType);

  // Load the shader source
  gl.shaderSource(shader, shaderSource);

  // Compile the shader
  gl.compileShader(shader);

  // Check the compile status
  const compiled = gl.getShaderParameter(shader, DataType.COMPILE_STATUS);
  if (!compiled) {
    // Something went wrong during compilation; get the error
    const lastError = gl.getShaderInfoLog(shader);
    console.error("compileShader Error:" + lastError);

    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function getProgramOptions(
  opt_attribs: string[],
  opt_locations: number[],
  opt_errorCallback?: () => void
) {
  const options = {
    attribLocations: [],
    errorCallback: opt_errorCallback,
    transformFeedbackVaryings: null,
    transformFeedbackMode: null,
  };

  if (opt_attribs) {
    let attribLocations: any = {};
    opt_attribs.forEach(function (attrib, ndx) {
      attribLocations[attrib] = opt_locations ? opt_locations[ndx] : ndx;
    });
    options.attribLocations = attribLocations;
  }

  return options;
}

function deleteShaders(gl, shaders) {
  shaders.forEach(function (shader) {
    gl.deleteShader(shader);
  });
}

function createProgram(
  gl: WebGL2RenderingContext,
  shaders: string[],
  opt_attribs: string[],
  opt_locations: number[],
  opt_errorCallback?: () => void
) {
  const progOptions = getProgramOptions(
    opt_attribs,
    opt_locations,
    opt_errorCallback
  );
  const newShaders = [];
  let vertexShaderSource = shaders[0];
  let shader_vs = loadShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  newShaders.push(shader_vs);

  let fragShaderSource = shaders[1];
  let shader_fs = loadShader(gl, fragShaderSource, gl.FRAGMENT_SHADER);
  newShaders.push(shader_fs);

  if (
    !(shader_fs instanceof WebGLShader) ||
    !(shader_vs instanceof WebGLShader)
  ) {
    throw new Error("createProgram->loadShader Error!");
  }

  const program = gl.createProgram();
  newShaders.forEach(function (shader) {
    gl.attachShader(program, shader);
  });
  if (progOptions.attribLocations) {
    Object.keys(progOptions.attribLocations).forEach(function (attrib) {
      gl.bindAttribLocation(
        program,
        progOptions.attribLocations[attrib],
        attrib
      );
    });
  }

  gl.linkProgram(program);

  // Check the link status
  const linked = gl.getProgramParameter(program, DataType.LINK_STATUS);
  if (!linked) {
    // something went wrong with the link
    const lastError = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    deleteShaders(gl, newShaders);
    throw new Error("Error in program linking:" + lastError);
  }
  return program;
}

function createProgramFromSources(
  gl: WebGL2RenderingContext,
  shaderSources: string[],
  opt_attribs?: string[],
  opt_locations?: number[]
) {
  const shaders = [];
  const shader_vs = loadShader(gl, shaderSources[0], gl.VERTEX_SHADER);
  if (!shader_vs) {
    return null;
  }
  const shader_fs = loadShader(gl, shaderSources[1], gl.FRAGMENT_SHADER);
  if (!shader_fs) {
    return null;
  }
  shaders.push(shader_vs);
  shaders.push(shader_fs);
  return createProgram(gl, shaders, opt_attribs, opt_locations);
}

export { 
  createProgram,
  createProgramFromSources, 
};
