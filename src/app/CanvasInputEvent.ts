import { vec2 } from "../math/tsm"
export enum EInputEventType {
    MOUSEEVENT,
    MOUSEDOWN,
    MOUSEUP,
    MOUSEMOVE,
    MOUSEDRAG,
    KEYBOARDEVENT,
    KEYUP,
    KEYDOWN,
    KEYPRESS
}

export class CanvasInputEvent {
    constructor(altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false, type: EInputEventType = EInputEventType.MOUSEDOWN) {
        this.altKey = altKey;
        this.ctrlKey = ctrlKey;
        this.shiftKey = shiftKey;
        this.type = type
    }
    public altKey: boolean;
    public ctrlKey: boolean;
    public shiftKey: boolean;

    public type: EInputEventType;

}
export class CanvasMouseEvent extends CanvasInputEvent {
    constructor(altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false, type: EInputEventType = EInputEventType.MOUSEDOWN, button: number, canvasPos: vec2) {
        super(altKey, ctrlKey, shiftKey, type)
        this.button = button;
        this.canvasPostion = canvasPos;
        console.log(this.button)
    }
    public button: number //0：鼠标左键，1：鼠标中键，2：鼠标右键
    public canvasPostion: vec2;

}
export class CanvasKeyBoardEvent extends CanvasInputEvent {
    constructor(altKey: boolean = false, ctrlKey: boolean = false, shiftKey: boolean = false,
        type: EInputEventType = EInputEventType.MOUSEDOWN, key: number, keyCode: number, repeat: boolean = false) {
        super(altKey, ctrlKey, shiftKey, type)
        this.key = key;
        this.keyCode = keyCode;
        this.repeat = repeat
    }
    public key: number //0：鼠标左键，1：鼠标中键，2：鼠标右键
    public keyCode: number;
    public repeat: boolean
}