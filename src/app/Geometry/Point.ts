import { Vector3 } from "../math/TSM";

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
}