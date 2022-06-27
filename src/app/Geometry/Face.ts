 
import { Vector3 } from "../math/TSM";
import { HalfEdge } from "./HalfEdge";
import { Point } from "./Point";
export class Face {
    public _halfedges: HalfEdge[] = [];
    public points: Point[] = [];
    constructor(points: Point[]) {
        if (points.length < 3) {
            throw new Error("绘制面至少需要三个顶点");
        }
        this.points = points
        for (let index = 0; index < points.length - 1; index++) {
            const currentHalfEdge = new HalfEdge(points[index], points[index + 1]);
            this._halfedges.push(currentHalfEdge)
        }
        this._linkEdges(this._halfedges)
        const vector1 = this.points[0].subtract(this.points[1])
        const vector2 = this.points[1].subtract(this.points[2])
        const normal = Vector3.cross(vector1, vector2).normalize()
        const valid = this._halfedges.some(edge => Math.abs(Vector3.dot(edge.normal, normal)) > 1e-6)
        if (valid) {
            throw new Error("顶点不在同一个平面内");
        }
    }
    private _linkEdges(edges: HalfEdge[]) {
        edges[0].nextHalfEdge = edges[1]
        edges[0].preHalfEdge = edges[edges.length - 1]
        for (let index = 1; index < edges.length; index++) {
            const edge = edges[index];
            edge.nextHalfEdge = edges[(index + 1) % edges.length]
            edge.preHalfEdge = edges[index - 1]
        }
    }
    public getHalfEdges() {
        return this._halfedges
    }
    public get normal() {
        const vector1 = this.points[1].subtract(this.points[0])
        const vector2 = this.points[2].subtract(this.points[1])
        const normal = Vector3.cross(vector1, vector2).normalize()
        return normal
    }

}