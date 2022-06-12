 
export enum EGLTexWrapType {
  GL_REPEAT, //设置为gl对应的常量
  GL_MIRRORED_REPEAT,
  GL_CLAMP_TO_EDGE,
}

export class GLTexture {
  public gl: WebGL2RenderingContext;
  public isMipmap: boolean; // 是否使用mipmap生成纹理对象
  public width: number; // 当前纹理对象的像素宽度
  public height: number; // 当前纹理对象的像素高度
  public format: number; // 在内存或显存中像素的存储格式，默认为gl.RGBA
  public type: number; // 像素分量的数据类型，默认为gl.UNSIGNED_BYTE
  public texture: WebGLTexture; // WebGLTexture对象
  public target: number; // 为gl.TEXTURE_2D
  public name: string; // 纹理的名称

  public constructor(gl: WebGL2RenderingContext, name: string = "") {
    this.gl = gl;
    this.isMipmap = false;
    this.width = this.height = 0;
    this.format = gl.RGBA;
    this.type = gl.UNSIGNED_BYTE;
    let tex: WebGLTexture | null = gl.createTexture();
    if (tex === null) {
      throw new Error("WebGLTexture创建不成功!");
    }
    this.texture = tex;
    this.target = gl.TEXTURE_2D;
    this.name = name;
    this.wrap();
    this.filter();
  }

 
 
  public static createDefaultTexture(gl: WebGL2RenderingContext): GLTexture {
    let step: number = 4;
    let canvas: HTMLCanvasElement = document.createElement(
      "canvas"
    ) as HTMLCanvasElement;
    canvas.width = 32 * step;
    canvas.height = 32 * step;
    let context: CanvasRenderingContext2D | null = canvas.getContext("2d");
    if (context === null) {
      alert("离屏Canvas获取渲染上下文失败！");
      throw new Error("离屏Canvas获取渲染上下文失败！");
    }

    for (let i: number = 0; i < step; i++) {
      for (let j: number = 0; j < step; j++) {
        let idx: number = step * i + j;
        context.save();
        context.fillStyle = GLTexture.Colors[idx];
        context.fillRect(i * 32, j * 32, 32, 32);
        context.restore();
      }
    }
    let tex: GLTexture = new GLTexture(gl);
    tex.wrap();
    tex.upload(canvas);
    return tex;
  }

  // css标准色字符串
  public static readonly Colors: string[] = [
    "aqua", //浅绿色
    "black", //黑色
    "blue", //蓝色
    "fuchsia", //紫红色
    "gray", //灰色
    "green", //绿色
    "lime", //绿黄色
    "maroon", //褐红色
    "navy", //海军蓝
    "olive", //橄榄色
    "orange", //橙色
    "purple", //紫色
    "red", //红色
    "silver", //银灰色
    "teal", //蓝绿色
    "yellow", //黄色
    "white", //白色
  ];

  public bind(unit: number = 0): void {
    if (this.texture !== null) {
      this.gl.activeTexture(this.gl.TEXTURE0 + unit);
      this.gl.bindTexture(this.target, this.texture);
    }
  }

  public unbind(): void {
    if (this.texture) {
      this.gl.bindTexture(this.target, null);
    }
  }

  //TEXTURE_MIN_FILTER: NEAREST_MIPMAP_LINEAR(默认)
  //TEXTURE_MAG_FILTER: LINEAR(默认)
  public filter(minLinear: boolean = true, magLinear: boolean = true): void {
    // 在设置filter时先要绑定当前的纹理目标
    this.gl.bindTexture(this.target, this.texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  }

  public wrap(mode: EGLTexWrapType = EGLTexWrapType.GL_REPEAT): void {
    this.gl.bindTexture(this.target, this.texture);
    if (mode === EGLTexWrapType.GL_CLAMP_TO_EDGE) {
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_S,
        this.gl.CLAMP_TO_EDGE
      );
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_T,
        this.gl.CLAMP_TO_EDGE
      );
    } else if (mode === EGLTexWrapType.GL_REPEAT) {
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_S,
        this.gl.REPEAT
      );
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_T,
        this.gl.REPEAT
      );
    } else {
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_S,
        this.gl.MIRRORED_REPEAT
      );
      this.gl.texParameteri(
        this.target,
        this.gl.TEXTURE_WRAP_T,
        this.gl.MIRRORED_REPEAT
      );
    }
  }

  public destory(): void {
    this.gl.deleteTexture(this.texture);
  }

  public upload(
    source: HTMLImageElement | HTMLCanvasElement,
    unit: number = 0,
    mipmap: boolean = false
  ): void {
    this.bind(unit); // 先绑定当前要操作的WebGLTexture对象，默认为0
    //否则贴图会倒过来
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);

    this.width = source.width;
    this.height = source.height;

    if (mipmap === true) {
      this.gl.texImage2D(
        this.target,
        0,
        this.format,
        this.format,
        this.type,
        source
      );
      this.gl.generateMipmap(this.target);
      this.isMipmap = true;
    } else {
      this.isMipmap = false;
      this.gl.texImage2D(
        this.target,
        0,
        this.format,
        this.format,
        this.type,
        source
      );
    }
    console.log("当前纹理尺寸为: ", this.width, this.height);
    this.unbind(); //// 解绑当前要操作的WebGLTexture对象
  }
}
