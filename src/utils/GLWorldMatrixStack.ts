import { mat4, vec3 } from "../math/tsm";

export class GLWorldMatrixStack {
    private _worldMatrixStack: mat4[];
    constructor() {
        this._worldMatrixStack = [];
        this._worldMatrixStack.push(new mat4().setIdentity())
    }
    public get worldMatrixStack(): mat4 {
        if (this._worldMatrixStack.length === 0) {
            throw new Error("worldMatrixStack null");

        }
        return this._worldMatrixStack[this._worldMatrixStack.length - 1]
    }
    public pushMatrix(): GLWorldMatrixStack {
        let mv = new mat4()
        this.worldMatrixStack.copy(mv)
        this._worldMatrixStack.push(mv)
        return this
    }
    public popMatrix(): GLWorldMatrixStack {
        this._worldMatrixStack.pop();
        return this
    }
    public loadIdentity(): GLWorldMatrixStack {
        this.worldMatrixStack.setIdentity()
        return this
    }
    public loadMatrix(mat: mat4) {
        mat.copy(this.worldMatrixStack)
        return this
    }
    public multMatrix(mat: mat4) {
        this.worldMatrixStack.multiply(mat);
        return this
    }
    public translate(pos: vec3) {
        this.worldMatrixStack.translate(pos);
        return this
    }
    public rotate(angle: number, axis: vec3) {
        this.worldMatrixStack.rotate(angle, axis)
        return this
    }
    public scale(s: vec3) {
        this.worldMatrixStack.scale(s)
        return this
    }
}