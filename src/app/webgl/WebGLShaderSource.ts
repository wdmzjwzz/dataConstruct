import colorShader_vs from "./glsl/colorShader_vs.vert"
import colorShader_fs from "./glsl/colorShader_fs.frag"
import textureShader_fs from "./glsl/textureShader_fs.frag"
import textureShader_vs from "./glsl/textureShader_vs.vert"

export const GLShaderSource = {
    colorShader: {
        vs: colorShader_vs,
        fs: colorShader_fs
    },
    textureShader: {
        vs: textureShader_vs,
        fs: textureShader_fs
    }
}
