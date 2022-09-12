import { Matrix4, quat, Vector3 } from "../math/TSM";

export class Point3 {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z
    }
    public subtract(point: Point3) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
        return new Vector3([dx, dy, dz])
    }
    public add(vector3: Vector3) {
        const dx = this.x + vector3.x;
        const dy = this.y + vector3.y;
        const dz = this.z + vector3.z;
        return new Point3(dx, dy, dz)
    }
    public multiplied(num: number) {
        const dx = this.x * num;
        const dy = this.y * num;
        const dz = this.z * num;
        return new Vector3([dx, dy, dz])
    }

    public equals(point: Point3) {
        const subtract = this.subtract(point)
        if (Math.abs(subtract.length) < 1e-4) {
            return true
        }
        return false
    }
    public copy() {
        return new Point3(this.x, this.y, this.z)
    }
    public applyQuaternion(q: quat) {

        const x = this.x, y = this.y, z = this.z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

        return this;

    }
    applyMatrix4(m: Matrix4) {

        const x = this.x, y = this.y, z = this.z;
        const e = m.values;

        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;

    }

}