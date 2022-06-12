 
import { TextureOptions  } from "./interface";

class TextureFactory {
    static _instance: TextureFactory;
    static get instance() {

        if (!TextureFactory._instance) {
            TextureFactory._instance = new TextureFactory()
        }
        return TextureFactory._instance
    }
    createTexture(gl: WebGL2RenderingContext, options?: TextureOptions): WebGLTexture {
        const tex = gl.createTexture();
        const target = gl.TEXTURE_2D;
        gl.bindTexture(target, tex);

        let src = options.src;
        if (src) {
            // const dimensions = this.setTextureFromArray(gl, tex, src, options);
            // const width = dimensions.width;
            // const height = dimensions.height;
            // this.setTextureFilteringForSize(gl, tex, options, width, height, gl.RGBA);
            this.setTextureParameters(gl, tex, options);
        }

        return tex;
    } 
    setSkipStateToDefault(gl: WebGL2RenderingContext) {
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4);
        gl.pixelStorei(gl.UNPACK_ROW_LENGTH, 0);
        gl.pixelStorei(gl.UNPACK_IMAGE_HEIGHT, 0);
        gl.pixelStorei(gl.UNPACK_SKIP_PIXELS, 0);
        gl.pixelStorei(gl.UNPACK_SKIP_ROWS, 0);
        gl.pixelStorei(gl.UNPACK_SKIP_IMAGES, 0);

    }

    setPackState(gl: WebGL2RenderingContext, options?: TextureOptions) {
        if (options.colorspaceConversion !== undefined) {
            gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, options.colorspaceConversion);
        }
        if (options.premultiplyAlpha !== undefined) {
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, options.premultiplyAlpha);
        }
        if (options.flipY !== undefined) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, options.flipY);
        }
    }

    setTextureParameters(gl: WebGL2RenderingContext, tex: WebGLTexture, options: TextureOptions) {
        const target = gl.TEXTURE_2D;
        gl.bindTexture(target, tex);
        this.setTextureSamplerParameters(gl, target, options);
    }
    setTextureSamplerParameters(gl: WebGL2RenderingContext, target: any, options: TextureOptions) {
        if (options.minMag) {
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, options.minMag);
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, options.minMag);
        }
        if (options.min) {
            gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, options.min);
        }
        if (options.mag) {
            gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, options.mag);
        }
        if (options.wrap) {
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, options.wrap);
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, options.wrap);
            if (target === gl.TEXTURE_3D || target instanceof WebGLSampler) {
                gl.texParameteri(target, gl.TEXTURE_WRAP_R, options.wrap);
            }
        }
        if (options.wrapR) {
            gl.texParameteri(target, gl.TEXTURE_WRAP_R, options.wrapR);
        }
        if (options.wrapS) {
            gl.texParameteri(target, gl.TEXTURE_WRAP_S, options.wrapS);
        }
        if (options.wrapT) {
            gl.texParameteri(target, gl.TEXTURE_WRAP_T, options.wrapT);
        }
        if (options.minLod) {
            gl.texParameteri(target, gl.TEXTURE_MIN_LOD, options.minLod);
        }
        if (options.maxLod) {
            gl.texParameteri(target, gl.TEXTURE_MAX_LOD, options.maxLod);
        }
        if (options.baseLevel) {
            gl.texParameteri(target, gl.TEXTURE_BASE_LEVEL, options.baseLevel);
        }
        if (options.maxLevel) {
            gl.texParameteri(target, gl.TEXTURE_MAX_LEVEL, options.maxLevel);
        }
    }

}
export const TextureCreater = TextureFactory.instance