import { vec3 } from "../math/tsm";

export class WebGLCoordSystem {
    public viewport: number[] = [];
    public axis: vec3;
    public angle: number;
    public pos: vec3;

    public isDrawAxis: boolean; //是否绘制旋转轴
    public isD3D: boolean //是否绘制左手坐标系

    constructor(viewport: number[], pos: vec3 = vec3.zero, axis: vec3 = vec3.up, angle: number = 0, isDrawAxis: boolean = false, isD3D: boolean = false) {
        this.viewport = viewport;
        this.axis = axis;
        this.angle = angle;
        this.pos = pos;
        this.isDrawAxis = isDrawAxis;
        this.isD3D = isD3D
    }
}