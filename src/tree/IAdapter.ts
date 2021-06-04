import { List } from "./List"
export interface IAdapter<T> {
    add(t: T): void;
    remove(): T | undefined;
    clear(): void;
    length: number;
    isEmpty: boolean;
}
export abstract class IAdapterBase<T> implements IAdapter<T>  {
    protected _arr: Array<T> | List<T>;
    constructor(useList: boolean) {
        if (useList) {
            this._arr = new List<T>()
        } else {
            this._arr = new Array<T>()
        }
    }
    add(t: T): void {
        this._arr.push(t)
    }
    public abstract remove(): T | undefined
    clear(): void {
        if (this._arr instanceof List) {
            this._arr = new List<T>()
        } else {
            this._arr = new Array<T>()
        }
    }
    public get isEmpty(): boolean {
        return this._arr.length === 0
    }
    public get length(): number {
        return this._arr.length
    }
}