export class GLAttribState {
    // 顶点属性，坐标位置
    static readonly POSITION_BIT: number = (1 << 0);
    static readonly POSITION_COMPONENT: number = 3;
    static readonly POSITION_NAME: string = "aPosition"
    static readonly POSITION_LOCATION: number = 0;
    // 顶点属性，纹理坐标
    static readonly TEXCOORD_BIT: number = (1 << 1);
    static readonly TEXCOORD_COMPONENT: number = 2;
    static readonly TEXCOORD_NAME: string = "aTexCoord"
    static readonly TEXCOORD_LOCATION: number = 1;

    // 顶点属性：纹理坐标1

    static readonly TEXCOORD1_BIT: number = (1 << 2);
    static readonly TEXCOORD1_COMPONENT: number = 2;
    static readonly TEXCOORD1_NAME: string = "aTexCoord1"
    static readonly TEXCOORD1_LOCATION: number = 2;
    // 顶点属性：法向量
    static readonly NORMAL_BIT: number = (1 << 3);
    static readonly NORMAL_COMPONENT: number = 3;
    static readonly NORMAL_NAME: string = "aNormal"
    static readonly NORMAL_LOCATION: number = 3;
    // 顶点属性：切向量
    static readonly TANGRNT_BIT: number = (1 << 4);
    static readonly TANGRNT_COMPONENT: number = 4;
    static readonly TANGRNT_NAME: string = "aTangent"
    static readonly TANGRNT_LOCATION: number = 4;
    // 顶点属性颜色
    static readonly COLOR_BIT: number = (1 << 5);
    static readonly COLOR_COMPONENT: number = 4;
    static readonly COLOR_NAME: string = "aColor"
    static readonly COLOR_LOCATION: number = 5;

    static readonly FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
    static readonly UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT
}