export type GLAttribBits = number;
export type GLAttribOffsetMap = { [key: string]: number };

export interface GLAttribInfo {
  bit: number;
  component: number;
  location: number;
}
export enum GLAttribName {
  POSITION = "aPosition",
  TEXCOORD = "aTexCoord",
  NORMAL = "aNormal",
  COLOR = "aColor",
  SIZE = "aSize",
}
