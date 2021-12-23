import { vec3, mat4, vec4 } from "../common/math/TSM";
import { TypedArrayList } from "../common/container/TypedArrayList";
import { GLMeshBuilder } from "../webgl/WebGLMesh";
import { Point } from "../Geometry/Point";
import { getIndices } from "../common/utils/tools";
import { defaultCollor } from "../constants";
export class CoordSystem {
  public viewport: number[] = []; // 当前坐标系被绘制在哪个视口中
  public axis: vec3; // 当前坐标系绕哪个轴旋转
  public angle: number; // 当前坐标系的旋转的角度(不是弧度！)
  public pos: vec3; // 当前坐标系的位置，如果是多视口渲染的话，就为[0,0,0]
  public isDrawAxis: boolean; // 是否绘制旋转轴
  public isD3D: boolean; // 是否绘制D3D左手系

  public constructor(
    viewport: number[],
    pos: vec3 = vec3.zero,
    axis: vec3 = vec3.up,
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
    mat: mat4,
    len: number = 5
  ): void {
    builder.gl.lineWidth(5);
    builder.begin(builder.gl.LINES);

    builder.color(1.0, 0.0, 0.0).size(5).vertex(0.0, 0.0, 0.0);
    builder.color(1.0, 0.0, 0.0).size(5).vertex(len, 0, 0);

    builder.color(0.0, 1.0, 0.0).size(5).vertex(0.0, 0.0, 0.0);
    builder.color(0.0, 1.0, 0.0).size(5).vertex(0.0, len, 0.0);

    builder.color(0.0, 0.0, 1.0).size(5).vertex(0.0, 0.0, 0.0);
    builder.color(0.0, 0.0, 1.0).size(5).vertex(0.0, 0.0, len);

    builder.end(mat);
    builder.gl.lineWidth(1);
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
    mat: mat4,
    center: Point = new Point(0, 0, 0),
    halfLen: number = 0.2,
    color: vec4 = vec4.green
  ): void {
    let mins: vec3 = new vec3([
      center.x - halfLen,
      center.y - halfLen,
      center.z - halfLen,
    ]);
    let maxs: vec3 = new vec3([
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
      DrawHelper.drawFace(builder, mat, face, color);
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
    mat: mat4,
    halfLen: number = 0.2,
    tc: number[] = [
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 前面
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 右面
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 后面
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 左面
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 上面
      0,
      0,
      1,
      0,
      1,
      1,
      0,
      1, // 下面
    ]
  ): void {
    // 前面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[0], tc[1]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[2], tc[3]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.texcoord(tc[4], tc[5]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.texcoord(tc[6], tc[7]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.end(mat);
    // 右面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[8], tc[9]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.texcoord(tc[10], tc[11]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[12], tc[13]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.texcoord(tc[14], tc[15]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.end(mat);
    // 后面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[16], tc[17]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[18], tc[19]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[20], tc[21]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.texcoord(tc[22], tc[23]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.end(mat);
    // 左面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[24], tc[25]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[26], tc[27]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[28], tc[29]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.texcoord(tc[30], tc[31]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.end(mat);
    // 上面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[32], tc[33]).vertex(-halfLen, halfLen, halfLen); // 1  - + +
    builder.texcoord(tc[34], tc[35]).vertex(halfLen, halfLen, halfLen); // 5  + + +
    builder.texcoord(tc[36], tc[37]).vertex(halfLen, halfLen, -halfLen); // 7  + + -
    builder.texcoord(tc[38], tc[39]).vertex(-halfLen, halfLen, -halfLen); // 3  - + -
    builder.end(mat);
    // 下面
    builder.begin(builder.gl.TRIANGLE_FAN);
    builder.texcoord(tc[40], tc[41]).vertex(-halfLen, -halfLen, halfLen); // 0  - - +
    builder.texcoord(tc[42], tc[43]).vertex(-halfLen, -halfLen, -halfLen); // 2  - - -
    builder.texcoord(tc[44], tc[45]).vertex(halfLen, -halfLen, -halfLen); // 6  + - -
    builder.texcoord(tc[46], tc[47]).vertex(halfLen, -halfLen, halfLen); // 4  + - +
    builder.end(mat);
  }

  public static drawFace(
    builder: GLMeshBuilder,
    mat: mat4,
    points: Point[],
    color = defaultCollor
  ) {
    const indices = getIndices(points);
    builder.begin(builder.gl.TRIANGLE_STRIP);
    builder.setIBO(indices);
    points.forEach((point) => {
      builder
        .color(color.r, color.g, color.b)
        .vertex(point.x, point.y, point.z);
    });
    builder.end(mat);
  }
}
