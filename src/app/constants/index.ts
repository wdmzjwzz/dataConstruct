import { BufferData } from "../GLProgram";

export enum EntityType {
  Plane = "Plane",
  Cube = "Cube",
  Sphere = "Sphere",
  TruncatedCone = "TruncatedCone",
  Crescent = "Crescent",
  Cylinder = "Cylinder",
  Torus = "Torus",
  Disc = "Disc",
}
export enum DataType {
  BYTE = 0x1400,
  UNSIGNED_BYTE = 0x1401,
  SHORT = 0x1402,
  UNSIGNED_SHORT = 0x1403,
  INT = 0x1404,
  UNSIGNED_INT = 0x1405,
  FLOAT = 0x1406,
  UNSIGNED_SHORT_4_4_4_4 = 0x8033,
  UNSIGNED_SHORT_5_5_5_1 = 0x8034,
  UNSIGNED_SHORT_5_6_5 = 0x8363,
  HALF_FLOAT = 0x140b,
  UNSIGNED_INT_2_10_10_10_REV = 0x8368,
  UNSIGNED_INT_10F_11F_11F_REV = 0x8c3b,
  UNSIGNED_INT_5_9_9_9_REV = 0x8c3e,
  FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8dad,
  UNSIGNED_INT_24_8 = 0x84fa,

  STATIC_DRAW = 0x88e4,
  ARRAY_BUFFER = 0x8892,
  ELEMENT_ARRAY_BUFFER = 0x8893,
  BUFFER_SIZE = 0x8764,
  TEXTURE0 = 0x84c0,
  DYNAMIC_DRAW = 0x88e8,
  UNIFORM_BUFFER = 0x8a11,
  TRANSFORM_FEEDBACK_BUFFER = 0x8c8e,

  TRANSFORM_FEEDBACK = 0x8e22,

  COMPILE_STATUS = 0x8b81,
  LINK_STATUS = 0x8b82,
  ACTIVE_UNIFORMS = 0x8b86,
  ACTIVE_ATTRIBUTES = 0x8b89,
  TRANSFORM_FEEDBACK_VARYINGS = 0x8c83,
  ACTIVE_UNIFORM_BLOCKS = 0x8a36,
  UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER = 0x8a44,
  UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER = 0x8a46,
  UNIFORM_BLOCK_DATA_SIZE = 0x8a40,
  UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES = 0x8a43,

  FLOAT_VEC2 = 0x8b50,
  FLOAT_VEC3 = 0x8b51,
  FLOAT_VEC4 = 0x8b52,

  INT_VEC2 = 0x8b53,
  INT_VEC3 = 0x8b54,
  INT_VEC4 = 0x8b55,
  BOOL = 0x8b56,
  BOOL_VEC2 = 0x8b57,
  BOOL_VEC3 = 0x8b58,
  BOOL_VEC4 = 0x8b59,
  FLOAT_MAT2 = 0x8b5a,
  FLOAT_MAT3 = 0x8b5b,
  FLOAT_MAT4 = 0x8b5c,
  SAMPLER_2D = 0x8b5e,
  SAMPLER_CUBE = 0x8b60,
  SAMPLER_3D = 0x8b5f,
  SAMPLER_2D_SHADOW = 0x8b62,
  FLOAT_MAT2x3 = 0x8b65,
  FLOAT_MAT2x4 = 0x8b66,
  FLOAT_MAT3x2 = 0x8b67,
  FLOAT_MAT3x4 = 0x8b68,
  FLOAT_MAT4x2 = 0x8b69,
  FLOAT_MAT4x3 = 0x8b6a,
  SAMPLER_2D_ARRAY = 0x8dc1,
  SAMPLER_2D_ARRAY_SHADOW = 0x8dc4,
  SAMPLER_CUBE_SHADOW = 0x8dc5,

  UNSIGNED_INT_VEC2 = 0x8dc6,
  UNSIGNED_INT_VEC3 = 0x8dc7,
  UNSIGNED_INT_VEC4 = 0x8dc8,
  INT_SAMPLER_2D = 0x8dca,
  INT_SAMPLER_3D = 0x8dcb,
  INT_SAMPLER_CUBE = 0x8dcc,
  INT_SAMPLER_2D_ARRAY = 0x8dcf,
  UNSIGNED_INT_SAMPLER_2D = 0x8dd2,
  UNSIGNED_INT_SAMPLER_3D = 0x8dd3,
  UNSIGNED_INT_SAMPLER_CUBE = 0x8dd4,
  UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8dd7,

  TEXTURE_2D = 0x0de1,
  TEXTURE_CUBE_MAP = 0x8513,
  TEXTURE_3D = 0x806f,
  TEXTURE_2D_ARRAY = 0x8c1a,

  /* TextureMagFilter */
  NEAREST = 0x2600,
  LINEAR = 0x2601,
  /* PixelFormat */
  ALPHA = 0x1906,
  RGB = 0x1907,
  RGBA = 0x1908,
  LUMINANCE = 0x1909,
  LUMINANCE_ALPHA = 0x190a,
  DEPTH_COMPONENT = 0x1902,
  DEPTH_STENCIL = 0x84f9,
}
export const uniformSetters: {
  [key: number]: (
    gl: WebGL2RenderingContext,
    uniformLocation: WebGLUniformLocation,
    data: any
  ) => void;
} = {
  [DataType.FLOAT_MAT4]: (
    gl: WebGL2RenderingContext,
    uniformLocation: WebGLUniformLocation,
    data: any
  ) => { 
    gl.uniformMatrix4fv(uniformLocation, false, data);
  },
  [DataType.FLOAT_VEC4]: (
    gl: WebGL2RenderingContext,
    uniformLocation: WebGLUniformLocation,
    data: any
  ) => {
    gl.uniform4fv(uniformLocation, data);
  },
  [DataType.FLOAT_VEC3]: (
    gl: WebGL2RenderingContext,
    uniformLocation: WebGLUniformLocation,
    data: any
  ) => {
    gl.uniform3fv(uniformLocation, data);
  },
};
export const attribSetters: {
  [key: number]: (
    gl: WebGL2RenderingContext,
    location: number,
    bufferData: BufferData
  ) => void;
} = {
  [DataType.FLOAT_VEC4]: (
    gl: WebGL2RenderingContext,
    location: number,
    bufferData: BufferData
  ) => {
    console.log(location,bufferData);
    
    gl.bindBuffer(DataType.ARRAY_BUFFER, bufferData.buffer!);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(
      location,
      bufferData.numComponents || 3,
      bufferData.type || gl.FLOAT,
      bufferData.normalize || false,
      bufferData.stride || 0,
      bufferData.offset || 0
    );
  },
};
