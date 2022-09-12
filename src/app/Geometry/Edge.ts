import { Point3 } from "./Point";

export class Edge {
    public vertexA: Point3;
    public vertexB: Point3;
    constructor(vertexA: Point3, vertexB: Point3) {
        this.vertexA = vertexA;
        this.vertexB = vertexB
    }
    get normal() {
        return this.vertexB.subtract(this.vertexA).normalize()
    }
    get length(){
        return this.vertexB.subtract(this.vertexA).length
    }
}