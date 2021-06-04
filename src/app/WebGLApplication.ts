export class WebGLApplication {
    constructor() {

    }
    public gl: WebGLRenderingContext | null = null;
    public matStack: any;
    public builder: any;
    protected canvas2D: HTMLCanvasElement | null = null;
    protected ctx2D: CanvasRenderingContext2D | null = null
}