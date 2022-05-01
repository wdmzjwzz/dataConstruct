import { Vector4 } from "./common/math/TSM";
import { GLAttribInfo, GLAttribName } from "./type";
export const defaultCollor = new Vector4([0, 1, 0,1]);
export const FLOAT32_SIZE = Float32Array.BYTES_PER_ELEMENT;
export const UINT16_SIZE = Uint16Array.BYTES_PER_ELEMENT;
export const ATTRIBSTRIDE = "STRIDE";
export const ATTRIBBYTELENGTH = "BYTELENGTH";
export const GLAttribMap: { [key: string]: GLAttribInfo } = {
  [GLAttribName.POSITION]: { bit: 1 << 0, component: 3, location: 0 },
  [GLAttribName.TEXCOORD]: { bit: 1 << 1, component: 2, location: 1 },
  [GLAttribName.NORMAL]: { bit: 1 << 2, component: 3, location: 2 },
  [GLAttribName.COLOR]: { bit: 1 << 3, component: 4, location: 3 },
};
export const attribNames = [
  GLAttribName.POSITION,
  GLAttribName.TEXCOORD,
  GLAttribName.NORMAL,
  GLAttribName.COLOR,
];
