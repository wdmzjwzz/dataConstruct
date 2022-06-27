/* eslint-disable */
import { EPSILON, Vector2, Vector3, Vector4, Matrix4, quat } from "./TSM";

export enum EAxisType {
  NONE = -1,
  XAXIS,
  YAXIS,
  ZAXIS,
}

export enum EPlaneLoc {
  FRONT, // 在平面的正面
  BACK, // 在平面的背面
  COPLANAR, // 与平面共面
}

export class MathHelper {
  // 角度/弧度互转函数
  public static toRadian(degree: number): number {
    return (degree * Math.PI) / 180;
  }

  public static toDegree(radian: number): number {
    return (radian / Math.PI) * 180;
  }

  // 浮点数容差相等函数
  public static numberEquals(left: number, right: number): boolean {
    if (Math.abs(left - right) > EPSILON) {
      return false;
    }
    return true;
  }

  public static clamp(x: number, min: number, max: number): number {
    return x < min ? min : x > max ? max : x;
  }

  // 判断一个整数是否是2的n次方(1,2,4,8,16,32,64,128,258,512,1024,2048,....)
  // 用于2的n次方纹理判断
  public static isPowerOfTwo(value: number): boolean {
    return (value & (value - 1)) == 0;
  }

  public static obj2GLViewportSpace(
    localPt: Vector3,
    mvp: Matrix4,
    viewport: Int32Array | Float32Array,
    viewportPt: Vector3
  ): boolean {
    let v: Vector4 = new Vector4([localPt.x, localPt.y, localPt.z, 1.0]);
    mvp.multiplyVector4(v, v); // 将顶点从local坐标系变换到投影坐标系，或裁剪坐标系
    if (v.w === 0.0) {
      // 如果变换后的w为0，则返回false
      return false;
    }
    // 将裁剪坐标系的点的x / y / z分量除以w，得到normalized坐标值[ -1 , 1 ]之间
    v.x /= v.w;
    v.y /= v.w;
    v.z /= v.w;
    // [-1 , 1]标示的点变换到视口坐标系
    v.x = v.x * 0.5 + 0.5;
    v.y = v.y * 0.5 + 0.5;
    v.z = v.z * 0.5 + 0.5;
    // 视口坐标系再变换到屏幕坐标系
    viewportPt.x = v.x * viewport[2] + viewport[0];
    viewportPt.y = v.y * viewport[3] + viewport[1];
    viewportPt.z = v.z;
    return true;
  }

  // 计算三角形的法向量
  public static computeNormal(
    a: Vector3,
    b: Vector3,
    c: Vector3,
    result: Vector3 | null
  ): Vector3 {
    if (!result) result = new Vector3();
    let l0: Vector3 = new Vector3();
    let l1: Vector3 = new Vector3();
    Vector3.difference(b, a, l0);
    Vector3.difference(c, a, l1);
    Vector3.cross(l0, l1, result);
    result.normalize();
    return result;
  }

  // 下面四个函数是平面相关函数
  //ax+by+cz-d=0
  public static planeFromPoints(
    a: Vector3,
    b: Vector3,
    c: Vector3,
    result: Vector4 | null = null
  ): Vector4 {
    if (!result) result = new Vector4();
    let normal: Vector3 = new Vector3();
    this.computeNormal(a, b, c, normal);
    let d: number = -Vector3.dot(normal, a);
    result.x = normal.x;
    result.y = normal.y;
    result.z = normal.z;
    result.w = d;
    return result;
  }

  public static planeFromPointNormal(
    point: Vector3,
    normal: Vector3,
    result: Vector4 | null = null
  ): Vector4 {
    if (!result) result = new Vector4();
    result.x = normal.x;
    result.y = normal.y;
    result.z = normal.z;
    result.w = -Vector3.dot(normal, point);
    return result;
  }

  public static planeFromPolygon(polygon: Vector3[]): Vector4 {
    if (polygon.length < 3) {
      throw new Error("多变形的顶点数必须大于或等于3!!!");
    }

    return MathHelper.planeFromPoints(polygon[0], polygon[1], polygon[2]);
  }

  public static planeDistanceFromPoint(plane: Vector4, point: Vector3): number {
    return point.x * plane.x + point.y * plane.y + point.z * plane.z + plane.w;
  }

  public static planeTestPoint(plane: Vector4, point: Vector3): EPlaneLoc {
    let num: number = MathHelper.planeDistanceFromPoint(plane, point);
    if (num > EPSILON) {
      return EPlaneLoc.FRONT;
    } else if (num < -EPSILON) {
      return EPlaneLoc.BACK;
    } else {
      return EPlaneLoc.COPLANAR;
    }
  }

  public static planeNormalize(plane: Vector4): number {
    let length: number, ilength: number;

    length = Math.sqrt(
      plane.x * plane.x + plane.y * plane.y + plane.z * plane.z
    );

    if (length === 0) {
      throw new Error("面积为0的平面!!!");
    }

    ilength = 1.0 / length;
    plane.x = plane.x * ilength;
    plane.y = plane.y * ilength;
    plane.z = plane.z * ilength;
    plane.w = plane.w * ilength;

    return length;
  }

  public static boundBoxAddPoint(v: Vector3, mins: Vector3, maxs: Vector3): void {
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
  }

  public static boundBoxClear(
    mins: Vector3,
    maxs: Vector3,
    value: number = Infinity
  ): void {
    mins.x = mins.y = mins.z = value; // 初始化时，让mins表示浮点数的最大范围
    maxs.x = maxs.y = maxs.z = -value; // 初始化是，让maxs表示浮点数的最小范围
  }

  // 获得AABB包围盒的中心点坐标
  public static boundBoxGetCenter(
    mins: Vector3,
    maxs: Vector3,
    out: Vector3 | null = null
  ): Vector3 {
    if (out === null) {
      out = new Vector3();
    }
    // (maxs + mins) * 0.5
    Vector3.sum(mins, maxs, out);
    out.scale(0.5);
    return out;
  }

  public static boundBoxGet8Points(mins: Vector3, maxs: Vector3, pts8: Vector3[]): void {
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
    let center: Vector3 = MathHelper.boundBoxGetCenter(mins, maxs); // 获取中心点
    let maxs2center: Vector3 = Vector3.difference(center, maxs); // 获取最大点到中心点之间的距离向量

    pts8.push(
      new Vector3([
        center.x + maxs2center.x,
        center.y + maxs2center.y,
        center.z + maxs2center.z,
      ])
    ); // 0
    pts8.push(
      new Vector3([
        center.x + maxs2center.x,
        center.y - maxs2center.y,
        center.z + maxs2center.z,
      ])
    ); // 1

    pts8.push(
      new Vector3([
        center.x + maxs2center.x,
        center.y + maxs2center.y,
        center.z - maxs2center.z,
      ])
    ); // 2
    pts8.push(
      new Vector3([
        center.x + maxs2center.x,
        center.y - maxs2center.y,
        center.z - maxs2center.z,
      ])
    ); // 3

    pts8.push(
      new Vector3([
        center.x - maxs2center.x,
        center.y + maxs2center.y,
        center.z + maxs2center.z,
      ])
    ); // 4
    pts8.push(
      new Vector3([
        center.x - maxs2center.x,
        center.y - maxs2center.y,
        center.z + maxs2center.z,
      ])
    ); // 5

    pts8.push(
      new Vector3([
        center.x - maxs2center.x,
        center.y + maxs2center.y,
        center.z - maxs2center.z,
      ])
    ); // 6
    pts8.push(
      new Vector3([
        center.x - maxs2center.x,
        center.y - maxs2center.y,
        center.z - maxs2center.z,
      ])
    ); // 7
  }

  public static boundBoxTransform(mat: Matrix4, mins: Vector3, maxs: Vector3): void {
    let pts: Vector3[] = []; // 分配数组内存，类型为Vector3
    MathHelper.boundBoxGet8Points(mins, maxs, pts); // 获得局部坐标系表示的AABB的8个顶点坐标
    let out: Vector3 = new Vector3(); // 变换后的顶点
    // 遍历局部坐标系的8个AABB包围盒的顶点坐标
    for (let i: number = 0; i < pts.length; i++) {
      // 将局部坐标表示的顶点变换到mat坐标空间中去，变换后的结果放在out变量中
      mat.multiplyVector3(pts[i], out);
      // 重新构造新的，与世界坐标系轴对称的AABB包围盒
      this.boundBoxAddPoint(out, mins, maxs);
    }
  }

  public static boundBoxContainsPoint(
    point: Vector3,
    mins: Vector3,
    maxs: Vector3
  ): boolean {
    return (
      point.x >= mins.x &&
      point.x <= maxs.x &&
      point.y >= mins.y &&
      point.y <= maxs.y &&
      point.z >= mins.z &&
      point.z <= maxs.z
    );
  }

  public static boundBoxBoundBoxOverlap(
    min1: Vector3,
    max1: Vector3,
    min2: Vector3,
    max2: Vector3
  ): boolean {
    if (min1.x > max2.x) return false;
    if (max1.x < min2.x) return false;

    if (min1.y > max2.y) return false;
    if (max1.y < min2.y) return false;

    if (min1.z > max2.z) return false;
    if (max1.z < min2.z) return false;

    return true;
  }

  public static convertVector3IDCoord2GLCoord(
    v: Vector3,
    scale: number = 10.0
  ): void {
    let f: number = v.y; // opengl right = dooom3 x
    v.y = v.z; //opengl up = doom3 z
    v.z = -f; //opengl forward = doom3 -y
    if (
      !MathHelper.numberEquals(scale, 0) &&
      !MathHelper.numberEquals(scale, 1.0)
    ) {
      v.x /= scale;
      v.y /= scale;
      v.z /= scale;
    }
  }

  public static convertVector2IDCoord2GLCoord(v: Vector2): void {
    v.y = 1.0 - v.y;
  }

  public static matrixFrom(pos: Vector3, q: quat, dest: Matrix4 | null = null): Matrix4 {
    if (dest === null) {
      dest = new Matrix4();
    }
    q.toMatrix4(dest);
    dest.values[12] = pos.x;
    dest.values[13] = pos.y;
    dest.values[14] = pos.z;
    return dest;
  }
}
