// import { GLHelper } from "../utils/GLHelper";
enum EGLTexWrapType {
    GL_REPEAT,
    GL_CLAMP_TO_EDGE
}
export class GLTexture {
    public gl: WebGLRenderingContext;
    public isMipmap: boolean;
    public width: number;
    public height: number;
    public format: number;
    public type: number;
    public texture: WebGLTexture;
    public target: number;
    public name: string;

    constructor(gl: WebGLRenderingContext, name: string = "") {
        this.gl = gl;
        this.isMipmap = false
        this.width = this.height = 0;
        this.format = gl.RGBA;
        this.type = gl.UNSIGNED_BYTE;
        let tex = gl.createTexture();
        if (!tex) {
            throw new Error("createTexture error");

        }
        this.texture = tex;
        this.target = gl.TEXTURE_2D;
        this.name = name;
        this.wrap();
        this.filter()
    }
    public upload(source: HTMLImageElement | HTMLCanvasElement, unit: number = 0, mipMap: boolean = false): void {
        this.bind(unit);
        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);
        this.width = source.width;
        this.height = source.height;
        if (mipMap) {
            let isWidthPower = GLTexture.isPowerOfTwo(this.width);
            let isHeightPower = GLTexture.isPowerOfTwo(this.height);
            if (isWidthPower && isHeightPower) {
                this.gl.texImage2D(this.target, 0, this.format, this.format, this.type, source)
                this.gl.generateMipmap(this.target)
            } else {
                let canvas = GLTexture.createPowerOfTwoCanvas(source);
                this.gl.texImage2D(this.target, 0, this.format, this.format, this.type, canvas);
                // GLHelper.checkGLERROR(this.gl)
                this.gl.generateMipmap(this.target);
                // GLHelper.checkGLERROR()
                this.width = canvas.width;
                this.height = canvas.height;


            }
            this.isMipmap = true
        } else {
            this.isMipmap = false;
            this.gl.texImage2D(this.target, 0, this.format, this.format, this.type, source);

        }
        console.log("当前纹理尺寸：", this.width, this.height)
        this.unbind()
    }

    // 判断参数是2的n次方
    public static isPowerOfTwo(x: number): boolean {
        return (x & (x - 1)) == 0
    }
    // 3》4，5》8，6》8
    public static getNextPowerOfTwo(x: number) {
        if (x < 0) {
            throw new Error("x <0");

        }
        --x;
        for (let i = 1; i < 32; i <<= 1) {
            x = x | x >> i;
        }
        return x + 1
    }
    public static createPowerOfTwoCanvas(srcImage: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
        let canvas = document.createElement("canvas");
        canvas.width = GLTexture.getNextPowerOfTwo(srcImage.width);
        canvas.height = GLTexture.getNextPowerOfTwo(srcImage.height);
        let ctx = canvas.getContext("2d")
        if (!ctx) {
            throw new Error(" canvas.getContext()");

        }
        ctx.drawImage(srcImage, 0, 0, srcImage.width, srcImage.height, 0, 0, canvas.width, canvas.height)
        return canvas

    }
    public static createDefaultTexture(gl: WebGLRenderingContext): GLTexture {
        let step: number = 4;
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = 32 * step;
        canvas.height = 32 * step;
        let context = canvas.getContext("2d")
        if (!context) {
            throw new Error(" let context=canvas.getContext");

        }
        for (let i = 0; i < step; i++) {
            for (let j = 0; j < step; j++) {
                let idx = step * i + j;
                context.save();
                context.fillStyle = GLTexture.Color[idx];
                context.fillRect(i * 32, j * 32, 32, 32)
                context.restore()

            }

        }
        let tex = new GLTexture(gl);
        tex.wrap();
        tex.upload(canvas);
        return tex
    }
    public static readonly Color:string[]=[
        'aqua',
        'black',
        'red',
        'green',
        'lime',
        'navy',
        'orange',
        'yellow',
        'olive',
        'teal',
        'white',
        'maroon',
        'fuchsia',
        'blue'
    ]
    public bind(unit: number) {
        if (this.texture) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit)
            this.gl.bindTexture(this.target, this.texture)
        }
    }
    public unbind() {
        if (this.texture) {
            this.gl.bindTexture(this.target, null)
        }
    }

    public wrap(mode: EGLTexWrapType = EGLTexWrapType.GL_REPEAT) {
        this.gl.bindTexture(this.target, this.texture);
        if (mode === EGLTexWrapType.GL_CLAMP_TO_EDGE) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE)
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE)

        } else if (mode === EGLTexWrapType.GL_REPEAT) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)
        } else {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.MIRRORED_REPEAT)
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.MIRRORED_REPEAT)
        }
    }
    public filter(minLinear: boolean = true, magLinear: boolean = true) {
        this.gl.bindTexture(this.target, this.texture);
        if (this.isMipmap) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, minLinear ? this.gl.LINEAR_MIPMAP_LINEAR : this.gl.NEAREST_MIPMAP_NEAREST)
        } else {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, minLinear ? this.gl.LINEAR : this.gl.NEAREST)
        }
        this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, magLinear ? this.gl.LINEAR : this.gl.NEAREST)

    }
}