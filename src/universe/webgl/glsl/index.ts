import colorShader_vs from "./colorShader_vs.vert";
import colorShader_fs from "./colorShader_fs.frag";
import textureShader_fs from "./textureShader_fs.frag";
import textureShader_vs from "./textureShader_vs.vert";
export enum GLShaderType {
  COLOR = "colorShader",
  TEXTURE = "textureShader",
}
export const GLShaderSource = {
  [GLShaderType.COLOR]: {
    vs: colorShader_vs,
    fs: colorShader_fs,
  },
  [GLShaderType.TEXTURE]: {
    vs: textureShader_vs,
    fs: textureShader_fs,
  },
};
