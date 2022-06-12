 
export enum EGLSLESDataType {
  FLOAT_Vector2 = 0x8b50,
  FLOAT_Vector3,
  FLOAT_Vector4,
  INT_Vector2,
  INT_Vector3,
  INT_Vector4,
  BOOL,
  BOOL_Vector2,
  BOOL_Vector3,
  BOOL_Vector4,
  FLOAT_MAT2,
  FLOAT_MAT3,
  FLOAT_Matrix4,
  SAMPLER_2D,
  SAMPLER_CUBE,

  FLOAT = 0x1406,
  INT = 0x1404,
}

export class GLAttribInfo {
  public size: number; // size 是指type的个数，切记
  public type: EGLSLESDataType; // type 是Uniform Type，而不是DataType
  public location: WebGLUniformLocation | number;

  public constructor(
    size: number,
    type: number,
    loc: WebGLUniformLocation | number
  ) {
    this.size = size;
    this.type = type;
    this.location = loc;
  }
}

export type GLAttribInfoMap = { [key: string]: GLAttribInfo };

export class GLHelper {
  public static printStates(gl: WebGL2RenderingContext): void {
    // 所有的boolean状态变量，共9个
    console.log("1. isBlendEnable = " + gl.isEnabled(gl.BLEND));
    console.log("2. isCullFaceEnable = " + gl.isEnabled(gl.CULL_FACE));
    console.log("3. isDepthTestEnable = " + gl.isEnabled(gl.DEPTH_TEST));
    console.log("4. isDitherEnable = " + gl.isEnabled(gl.DITHER));
    console.log(
      "5. isPolygonOffsetFillEnable = " + gl.isEnabled(gl.POLYGON_OFFSET_FILL)
    );
    console.log(
      "6. isSampleAlphtToCoverageEnable = " +
      gl.isEnabled(gl.SAMPLE_ALPHA_TO_COVERAGE)
    );
    console.log(
      "7. isSampleCoverageEnable = " + gl.isEnabled(gl.SAMPLE_COVERAGE)
    );
    console.log("8. isScissorTestEnable = " + gl.isEnabled(gl.SCISSOR_TEST));
    console.log("9. isStencilTestEnable = " + gl.isEnabled(gl.STENCIL_TEST));
  }

  public static printWebGLInfo(gl: WebGL2RenderingContext): void {
    console.log("renderer = " + gl.getParameter(gl.RENDERER));
    console.log("version = " + gl.getParameter(gl.VERSION));
    console.log("vendor = " + gl.getParameter(gl.VENDOR));
    console.log(
      "glsl version = " + gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    );
  }

  public static printWebGLTextureInfo(gl: WebGL2RenderingContext): void {
    console.log(
      "MAX_COMBINED_TEXTURE_IMAGE_UNITS = ",
      gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)
    );
    console.log(
      "MAX_TEXTURE_IMAGE_UNITS = ",
      gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)
    );
    console.log("MAX_TEXTURE_SIZE = ", gl.getParameter(gl.MAX_TEXTURE_SIZE));
    console.log(
      "MAX_CUBE_MAP_TEXTURE_SIZE = ",
      gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)
    );
  }

  public static triggerContextLostEvent(gl: WebGL2RenderingContext): void {
    let ret: WEBGL_lose_context | null = gl.getExtension("WEBGL_lose_context");
    if (ret !== null) {
      ret.loseContext();
    }
  }

  public static checkGLError(gl: WebGL2RenderingContext): boolean {
    let err: number = gl.getError();
    if (err === 0) {
      return false;
    } else {
      console.log("WebGL Error NO: ", err);
      return true;
    }
  }

  public static setDefaultState(gl: WebGL2RenderingContext): void {
    // default [r=0,g=0,b=0,a=0]
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // 每次清屏时，将颜色缓冲区设置为全透明黑色
    gl.clearDepth(1.0); // 每次清屏时，将深度缓冲区设置为1.0
    gl.enable(gl.DEPTH_TEST); //开启深度测试
    gl.enable(gl.CULL_FACE); //开启背面剔除
    gl.enable(gl.SCISSOR_TEST); // 开启裁剪测试
  }

  public static setViewport(gl: WebGL2RenderingContext, v: number[]): void {
    gl.viewport(v[0], v[1], v[2], v[3]);
  }

  public static compileShader(
    gl: WebGL2RenderingContext,
    code: string,
    shader: WebGLShader
  ): boolean {
    gl.shaderSource(shader, code); // 载入shader源码
    gl.compileShader(shader); // 编译shader源码
    // 检查编译错误
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
      // 如果编译出现错误，则弹出对话框，了解错误的原因
      console.error(gl.getShaderInfoLog(shader));
      // 然后将shader删除掉，防止内存泄漏
      gl.deleteShader(shader);
      // 编译错误返回false
      return false;
    }
    // 编译成功返回true
    return true;
  }

  public static linkProgram(
    gl: WebGL2RenderingContext, // 渲染上下文对象
    program: WebGLProgram, // 链接器对象
    vsShader: WebGLShader, // 要链接的顶点着色器
    fsShader: WebGLShader, // 要链接的片段着色器
    beforeProgramLink?: (
      gl: WebGL2RenderingContext,
      program: WebGLProgram
    ) => void
  ) {
    // 1、使用attachShader方法将顶点和片段着色器与当前的连接器相关联
    gl.attachShader(program, vsShader);
    gl.attachShader(program, fsShader);

    // 2、在调用linkProgram方法之前，按需触发beforeProgramLink回调函数
    if (beforeProgramLink !== null) {
      beforeProgramLink(gl, program);
    }

    // 3、调用linkProgram进行链接操作
    gl.linkProgram(program);

    // 5、使用validateProgram进行链接验证
    gl.validateProgram(program);
    // 6、使用带gl.VALIDATE_STATUS参数的getProgramParameter方法，进行验证状态检查
    if (
      !gl.getProgramParameter(program, gl.VALIDATE_STATUS) ||
      !gl.getProgramParameter(program, gl.LINK_STATUS)
    ) {
      throw new Error("linkProgram failed");
    }
  }

  public static logProgramActiveAttribs(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ) {
    //获取当前active状态的attribute和uniform的数量
    //很重要一点，active_attributes/uniforms必须在link后才能获得
    let attributsCount: number = gl.getProgramParameter(
      program,
      gl.ACTIVE_ATTRIBUTES
    );
    const out: GLAttribInfoMap = {};
    //很重要一点，所谓active是指uniform已经被使用的，否则不属于uniform,uniform在shader中必须是读取，不能赋值
    //很重要一点，attribute在shader中只能读取，不能赋值,如果没有被使用的话，也是不算入activeAttrib中去的
    for (let i = 0; i < attributsCount; i++) {
      let info: WebGLActiveInfo = gl.getActiveAttrib(program, i);

      out[info.name] = new GLAttribInfo(
        info.size,
        info.type,
        gl.getAttribLocation(program, info.name)
      );

    }
    console.log(JSON.stringify(out));
  }

  public static logProgramAtciveUniforms(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
  ) {
    let uniformsCount: number = gl.getProgramParameter(
      program,
      gl.ACTIVE_UNIFORMS
    );
    const out: GLAttribInfoMap = {};
    for (let i = 0; i < uniformsCount; i++) {
      let info: WebGLActiveInfo | null = gl.getActiveUniform(program, i);
      if (info) {
        let loc: WebGLUniformLocation | null = gl.getUniformLocation(
          program,
          info.name
        );
        if (loc !== null) {
          out[info.name] = new GLAttribInfo(info.size, info.type, loc);
        }
      }
    }
    console.log(JSON.stringify(out));
  }

  public static getColorBufferData(gl: WebGL2RenderingContext): Uint8Array {
    let pixels: Uint8Array = new Uint8Array(
      gl.drawingBufferWidth * gl.drawingBufferHeight * 4
    );
    gl.readPixels(
      0,
      0,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );
    return pixels;
  }
 
}
