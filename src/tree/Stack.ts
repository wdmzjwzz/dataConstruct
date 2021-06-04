import { IAdapterBase } from "./IAdapter";

export class Stack<T> extends IAdapterBase<T> {
    constructor(useList: boolean) {
        super(useList)
    }
    public remove(): T | undefined {
        if (this._arr.length > 0) {
            return this._arr.pop()
        } else {
            return undefined
        }
    }

}