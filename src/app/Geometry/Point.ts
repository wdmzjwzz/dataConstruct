import { Vector3 } from "../math/TSM"; 

export class Point {
    public x: number;
    public y: number;
    public z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z
    }
    public subtract(point: Point) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        const dz = this.z - point.z;
        return new Vector3([dx, dy, dz])
    }
    public add(point: Point) {
        const dx = this.x + point.x;
        const dy = this.y + point.y;
        const dz = this.z + point.z;
        return new Vector3([dx, dy, dz])
    }
    public multiplied(num: number) {
        const dx = this.x * num;
        const dy = this.y * num;
        const dz = this.z * num;
        return new Vector3([dx, dy, dz])
    }
}