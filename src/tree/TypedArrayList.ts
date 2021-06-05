export class TypedArrayList<T extends Uint16Array | Float32Array | Uint8Array>{
    constructor(typedArrayConstructor: (new (length: number) => T), capacity: number = 8) {
        this._typedArrayConstructor = typedArrayConstructor;
        this._capacity = capacity
        if (this._capacity === 0) {
            this._capacity = 8
        }
        this._array = new this._typedArrayConstructor(this._capacity)
    }
    private _array: T;
    private _typedArrayConstructor: (new (length: number) => T);
    private _length: number = 0;
    private _capacity: number;

    public push(num: number): number {
        if (this._length >= this._capacity) {
            if (this._capacity > 0) {
                this._capacity += this._capacity
            }
            let oldArr = this._array;
            this._array = new this._typedArrayConstructor(this._capacity)
            this._array.set(oldArr)
        }
        this._array[this._length++] = num;
        return this._length
    }
    public subArray(start: number = 0, end: number = this._length): T {
        return this._array.subarray(start, end) as T
    }
    public slice(start: number, end: number = this._length): T {
        return this._array.slice(start, end) as T
    }
    public get length() {
        return this._length
    }
    public get capacity() {
        return this._capacity
    }
    public get typeArray() {
        return this._array
    }
    public clear() {
        this._length = 0;
    }
    public pushArray(arr: number[]) {
        for (let index = 0; index < arr.length; index++) {
            this.push(arr[index])
        }
    }
    public at(idx: number): number {
        if (idx < 0 || idx >= this.length) {
            throw new Error("越界");
        }
        return this._array[idx]
    }
}