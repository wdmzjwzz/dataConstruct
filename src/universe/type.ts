import { Point } from "./Geometry/Point";

export type GLAttribBits = number;
export type GLAttribOffsetMap = { [key: string]: number };
export type INTERLEAVED = "INTERLEAVED";
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
export interface SegmentInfo {
  points: Point[];
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}
