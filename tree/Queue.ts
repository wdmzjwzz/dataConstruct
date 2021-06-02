import { IAdapterBase } from "./IAdapter";
import { List } from "./List"
export class Queue<T> extends IAdapterBase<T> {
    constructor(useList: boolean) {
        super(useList)
    }
    public remove(): T | undefined {
        if (this._arr.length > 0) {
            if (this._arr instanceof List) {
                return this._arr.pop_front()
            } else {
                return this._arr.shift()
            }
        } else {
            return undefined
        }
    }

}