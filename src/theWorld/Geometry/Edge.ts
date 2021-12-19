import { Point } from "./Point";

export class Edge {
    public vertexA: Point;
    public vertexB: Point;
    constructor(vertexA: Point, vertexB: Point) {
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