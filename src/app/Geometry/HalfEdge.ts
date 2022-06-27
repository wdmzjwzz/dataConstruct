import { Edge } from "./Edge";

export class HalfEdge extends Edge {
    public preHalfEdge: HalfEdge;
    public nextHalfEdge: HalfEdge;
}