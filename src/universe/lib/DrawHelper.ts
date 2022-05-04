import { Vector3, Matrix4, Vector4 } from "../common/math/TSM";
import { TypedArrayList } from "../common/container/TypedArrayList";
import { GLMeshBuilder } from "../webgl/WebGLMesh";
import { Point } from "../Geometry/Point";
import { getIndices } from "../common/utils/tools";
import { defaultCollor } from "../constants";
import { MathHelper } from "../common/math/MathHelper";
export class CoordSystem {
  public viewport: number[] = []; // 当前坐标系被绘制在哪个视口中
  public axis: Vector3; // 当前坐标系绕哪个轴旋转
  public angle: number; // 当前坐标系的旋转的角度(不是弧度！)
  public pos: Vector3; // 当前坐标系的位置，如果是多视口渲染的话，就为[0,0,0]
  public isDrawAxis: boolean; // 是否绘制旋转轴
  public isD3D: boolean; // 是否绘制D3D左手系

  public constructor(
    viewport: number[],
    pos: Vector3 = Vector3.zero,
    axis: Vector3 = Vector3.up,
    angle: number = 0,
    isDrawAxis: boolean = false,
    isD3D: boolean = false
  ) {
    this.viewport = viewport;
    this.angle = angle;
    this.axis = axis;
    this.pos = pos;
    this.isDrawAxis = isDrawAxis;
    this.isD3D = isD3D;
  }
}

export class DrawHelper {
  public static getCirclePointsOnXYPlane(
    pts: TypedArrayList<Float32Array>,
    radius: number,
    segment: number = 32
  ): void {
    pts.clear();
    let step: number = Math.PI / segment;
    let ang: number = 0;
    for (let i: number = 0; i <= segment; i++) {
      ang = i * step;
      pts.push(Math.cos(ang));
      pts.push(Math.sin(ang));
      pts.push(0.0);
    }
  }
  public static drawCoordSystem(
    builder: GLMeshBuilder,
    mat: Matrix4,
    len: number = 5
  ) {
    builder.begin(builder.gl.LINES);

    builder.color(1.0, 0.0, 0.0).vertex(0.0, 0.0, 0.0);
    builder.color(1.0, 0.0, 0.0).vertex(len, 0, 0);

    builder.color(0.0, 1.0, 0.0).vertex(0.0, 0.0, 0.0);
    builder.color(0.0, 1.0, 0.0).vertex(0.0, len, 0.0);

    builder.color(0.0, 0.0, 1.0).vertex(0.0, 0.0, 0.0);
    builder.color(0.0, 0.0, 1.0).vertex(0.0, 0.0, len);

    builder.end(mat);
  }

  /*
        /3--------/7  |
        / |       /   |
        /  |      /   |
        1---------5   |
        |  /2- - -|- -6
        | /       |  /
        |/        | /
        0---------4/
    */

  public static drawSolidCubeBox(
    builder: GLMeshBuilder,
    mat: Matrix4,
    center: Point = new Point(0, 0, 0),
    halfLen: number = 0.2,
    color: Vector4 = Vector4.green
  ): void {
    let mins: Vector3 = new Vector3([
      center.x - halfLen,
      center.y - halfLen,
      center.z - halfLen,
    ]);
    let maxs: Vector3 = new Vector3([
      center.x + halfLen,
      center.y + halfLen,
      center.z + halfLen,
    ]);
    // 使用LINE_LOOP绘制底面，注意顶点顺序，逆时针方向，根据右手螺旋定则可知，法线朝外
    builder.begin(builder.gl.TRIANGLE_FAN); // 使用的是LINE_LOOP图元绘制模式

    const p0 = new Point(mins.x, mins.y, maxs.z);
    const p1 = new Point(mins.x, maxs.y, maxs.z);
    const p2 = new Point(mins.x, mins.y, mins.z);
    const p3 = new Point(mins.x, maxs.y, mins.z);
    const p4 = new Point(maxs.x, mins.y, maxs.z);
    const p5 = new Point(maxs.x, maxs.y, maxs.z);
    const p6 = new Point(maxs.x, mins.y, mins.z);
    const p7 = new Point(maxs.x, maxs.y, mins.z);
    const faces = [
      [p0, p4, p6, p2],
      [p1, p5, p7, p3],
      [p4, p6, p7, p5],
      [p6, p2, p3, p7],
      [p2, p0, p1, p3],
      [p0, p4, p5, p1],
    ];
    faces.forEach((face) => {
      DrawHelper.drawFace(builder, mat, face, [], color);
    });
  }
  /*
       /3--------/7  |
       / |       /   |
       /  |      /   |
       1---------5   |
       |  /2- - -|- -6
       | /       |  /
       |/        | /
       0---------4/
   */
  public static drawTextureCubeBox(
    builder: GLMeshBuilder,
    mat: Matrix4,
    halfLen: number = 20,
    tc: number[] = [
      0, 0,
      1, 0,
      1, 1,
      0, 1, // 前面
    ]
  ) {
    // 前面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[2], tc[3]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.texcoord(tc[4], tc[5]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.texcoord(tc[6], tc[7]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.end(mat);
    // 右面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.texcoord(tc[2], tc[3]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[4], tc[5]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.texcoord(tc[6], tc[7]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.end(mat);
    // 后面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[2], tc[3]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[4], tc[5]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.texcoord(tc[6], tc[7]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.end(mat);
    // 左面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[2], tc[3]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[4], tc[5]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.texcoord(tc[6], tc[7]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.end(mat);
    // 上面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.texcoord(tc[2], tc[3]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.texcoord(tc[4], tc[5]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.texcoord(tc[6], tc[7]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.end(mat);
    // 下面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[2], tc[3]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[4], tc[5]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[6], tc[7]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.end(mat);
  }
  public static drawSphere(
    builder: GLMeshBuilder,
    mat: Matrix4,
    radius: number = 80,
    center: Point = new Point(0, 0, 0),
    tc: number[] = [
      0, 0,
      1, 0,
      1, 1,
      0, 1, // 前面
    ]
  ) {

    const number = 360 / 15;
    const faces: Point[][] = [];

    for (let index = 0; index < number; index++) {
      const colums = 18
      const angle2 = 180 / colums

      let rotateMatrix4 = new Matrix4().rotate(MathHelper.toRadian(index * 15), new Vector3([0, 1, 0]))
      const n = Vector3.cross(new Vector3([1, 0, 0]), new Vector3([0, 1, 0]))
      const normal = rotateMatrix4.multiplyVector3(n).normalize()
      faces[index] = [];
      let p0 = center.add(new Point(0, radius, 0))

      for (let c = 0; c < colums + 1; c++) {
        let rotateMatrix4 = new Matrix4().rotate(MathHelper.toRadian(c * angle2), normal)
        const v = rotateMatrix4.multiplyVector3(p0)
        faces[index].push(new Point(v.x, v.y, v.z))
      }
    }
    const faces2: Point[][] = [];
    for (let index = 0; index < faces.length; index++) {
      const face = faces[index];
      faces2[index] = [];
      for (let j = 0; j < face.length - 1; j++) {
        const point = face[j];
        if (j === 0) {
          const f = [
            face[0],
            face[1],
            faces[(index + 1) % faces.length][1]]
          const vu = DrawHelper.getUVValues(f, 1000, 1000)

          DrawHelper.drawFace(builder, mat, f, vu)
          continue;
        }
        if (j === face.length - 2) {
          const f = [
            face[j],
            face[j + 1],
            faces[(index + 1) % faces.length][j + 1]]
          const vu = DrawHelper.getUVValues(f, 1000, 1000)
          DrawHelper.drawFace(builder, mat, f, vu)
          continue;
        }
        const f = [point,
          face[j + 1],
          faces[(index + 1) % faces.length][j + 1],
          faces[(index + 1) % faces.length][j]]
        const vu = DrawHelper.getUVValues(f, 1000, 1000)
        DrawHelper.drawFace(builder, mat, f, vu)
      }
    }
  }
  public static getUVValues(face: Point[], width: number, height: number) {
    const v1 = face[1].subtract(face[0])
    const v2 = face[2].subtract(face[1])
    const normal = Vector3.cross(v1, v2).normalize()
    const up = new Vector3([0, 1, 0]).normalize()

    const cross = Vector3.cross(normal, up).normalize()
    const angle = Math.acos(Vector3.dot(up, normal));
    const mat = new Matrix4().rotate(angle, cross)
    let mins = new Point(0, 0, 0)
    let maxs = new Point(0, 0, 0)
    let nPoints = face.map(point => {
      const v = mat.multiplyVector3(new Vector3([point.x, point.y, point.z]))
      if (v.x < mins.x) {
        mins.x = v.x;
      }
      if (v.x > maxs.x) {
        maxs.x = v.x;
      }

      if (v.y < mins.y) {
        mins.y = v.y;
      }
      if (v.y > maxs.y) {
        maxs.y = v.y;
      }

      if (v.z < mins.z) {
        mins.z = v.z;
      }
      if (v.z > maxs.z) {
        maxs.z = v.z;
      }
      return new Point(v.x, v.y, v.z)
    })
    let UVs: number[][] = []
    let w = maxs.x - mins.x
    let h = maxs.z - mins.z
    const m = Math.min(w, h)
    nPoints.forEach(point => {
      let v = point.subtract(mins)

      UVs.push([v.x / m, v.z / m])
    })
    return UVs

  }
  public static drawFace(
    builder: GLMeshBuilder,
    mat: Matrix4,
    points: Point[],
    uvs: number[][] = [],
    color = defaultCollor
  ) {
    const indices = getIndices(points);
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.setIBO(indices);

    points.forEach((point, index: number) => {
      builder
        .color(color.r, color.g, color.b)
        .texcoord(uvs[index][0], uvs[index][1])
        .vertex(point.x, point.y, point.z);
    });
    builder.end(mat);
  }

}
