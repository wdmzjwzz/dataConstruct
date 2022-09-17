
import { v4 as uuidv4 } from "uuid";
import { TextureOptions } from "./types";
export class GLTexture {
  public id: string;
  public textureOptions: TextureOptions;
  public gl: WebGL2RenderingContext;
  public texture: WebGLTexture;
  public target: GLenum
  constructor(gl: WebGL2RenderingContext, options: TextureOptions) {
    this.id = uuidv4();
    this.textureOptions = options;
    this.texture = this.createTexture();
    this.gl = gl
    this.target = options.target || gl.TEXTURE_2D;
  }
  createTexture() {
    const tex = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,                // mip level
      this.gl.LUMINANCE,     // internal format
      8,                // width
      8,                // height
      0,                // border
      this.gl.LUMINANCE,     // format
      this.gl.UNSIGNED_BYTE, // type
      new Uint8Array(this.textureOptions.src as number[]));
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    return tex
  }
}
