
export interface AttribInfo {
    [key: string]: AttribItem
}

export interface AttribItem {
    numComponents: number,
    buffer: Uint16Array | Float32Array | Uint8Array | Int8Array,
    type?: Uint16ArrayConstructor | Float32ArrayConstructor | Uint8ArrayConstructor | Int8ArrayConstructor,
    drawType?: number,
    normalize?: boolean,
    stride?: number,
    offset?: number,
    divisor?: any
}