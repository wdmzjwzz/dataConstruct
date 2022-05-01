import { Point } from "../../Geometry/Point";

export function getIndices(points: Point[]) {
  const result: number[] = [];
  if (points.length < 3) {
    return result;
  }
  for (let n = 2; n < points.length; n++) {
    result.push(0, n - 1, n);
  }
  return result;
}
