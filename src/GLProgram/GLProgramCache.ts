import { GLProgram } from "./GLProgram";

export class GLProgramCache {

    static readonly instance: GLProgramCache = new GLProgramCache();
    private _dict: Map<string, GLProgram>;
    constructor() {
        this._dict = new Map<string, GLProgram>();
    }
    public set(key: string, value: GLProgram) {
        this._dict.set(key, value)
    }
    public getMaybe(key: string): GLProgram | undefined {
        return this._dict.get(key)
    }
    public remove(key: string): boolean {
        return this._dict.delete(key)
    }

}
