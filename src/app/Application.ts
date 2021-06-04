
import { Vector2 } from "./Vector2"
import { CanvasMouseEvent, CanvasKeyBoardEvent, EInputEventType } from "./CanvasInputEvent"
import { Timer, TimerCallback } from "./Timer"
export class Application implements EventListenerObject {
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.isSupportMouseMove = false
        this._isMouseDown = false;
        this.frameCallback = null;
        // 禁止右键上下文
        document.oncontextmenu = function () {
            return false
        }
        this.canvas.addEventListener("mousedown", this, false)
        this.canvas.addEventListener("mouseup", this, false)
        this.canvas.addEventListener("mousemove", this, false)
        window.addEventListener("keydown", this, false);
        window.addEventListener("keypress", this, false)
        window.addEventListener("keyup", this, false)
    }

    public timers: Timer[] = [];
    private _timeId: number = -1;
    public isFlipYCoord: boolean = false;
    public canvas: HTMLCanvasElement;
    public isSupportMouseMove: boolean;

    protected _isMouseDown: boolean;
    protected _start: boolean = false;
    protected _requestId: number = -1;
    protected _lastTime!: number;
    protected _startTime!: number;
    private _fps: number = 0
    private _isRightMouseDown: boolean = false
    /**
     * frameCallback
     */
    public frameCallback: ((app: Application) => void) | null;
    public get fps() {
        return this._fps
    }
    /**
     * start
     */
    public start(): void {
        if (!this._start) {
            this._start = true;
            this._requestId = -1;
            this._startTime = -1;
            this._lastTime = -1;
            this._requestId = requestAnimationFrame(() => {
                this.step(new Date().getTime())
            })
        }
    }
    /**
     * isRunning
     */
    public isRunning() {
        return this._start
    }
    /**
     * stop
     */
    public stop(): void {
        if (this._start) {
            cancelAnimationFrame(this._requestId)
            this._start = false;
            this._requestId = -1;
            this._startTime = -1;
            this._lastTime = -1;
        }
    }
    /**
     * step
     */
    public step(timeStamp: number) {
        if (this._startTime === -1) {
            this._startTime = timeStamp
        }
        if (this._lastTime === -1) {
            this._lastTime = timeStamp
        }
        let elap = timeStamp - this._startTime
        let intervalSec = timeStamp - this._lastTime
        if (intervalSec !== 0) {
            this._fps = 1000 / intervalSec
        }
        this._lastTime = timeStamp;
        this._handleTimer(intervalSec)
        this.update(elap, intervalSec)
        this.render()
        if (this.frameCallback) {
            this.frameCallback(this)
        }
        requestAnimationFrame(() => {
            this.step(new Date().getTime())
        })
    }

    /**
     * update
     */
    public update(elap: number, intervalSec: number): void { }
    /**
     * render
     */
    public render(): void { }
    protected viewportToCanvasCoordinate(evt: MouseEvent): Vector2 {
        let rect: ClientRect = this.getMouseCanvas().getBoundingClientRect();
        if (evt.target) {
            let x: number = evt.clientX - rect.left
            let y: number = evt.clientY - rect.top
            if (this.isFlipYCoord) {
                y = this.getMouseCanvas().height - y
            }
            return new Vector2(x, y)
        }
        return new Vector2(0, 0)
    }
    private getMouseCanvas(): HTMLCanvasElement {
        return this.canvas
    }
    private _toCanvasMouseEvent(evt: Event, type: EInputEventType): CanvasMouseEvent {
        let event: MouseEvent = evt as MouseEvent
        if (type === EInputEventType.MOUSEDOWN && event.button === 2) {
            this._isRightMouseDown = true
        } else if (type === EInputEventType.MOUSEUP && event.button === 2) {
            this._isRightMouseDown = false
        }
        let buttonNum: number = event.button;
        if (this._isRightMouseDown && type === EInputEventType.MOUSEDRAG) {
            buttonNum = 2
        }
        let mousePostion: Vector2 = this.viewportToCanvasCoordinate(event)
        return new CanvasMouseEvent(event.altKey, event.ctrlKey, event.shiftKey, type, buttonNum, mousePostion)
    }
    private _toCanvasKeyBoardEvent(evt: Event, type: EInputEventType): CanvasKeyBoardEvent {
        let event: KeyboardEvent = evt as KeyboardEvent;
        return new CanvasKeyBoardEvent(event.altKey, event.ctrlKey, event.shiftKey, type, Number(event.key), event.keyCode, event.repeat)
    }
    public handleEvent(evt: Event): void {
        switch (evt.type) {
            case "mousedown":
                this._isMouseDown = true;
                this.dispatchMouseDown(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDOWN))
                break;
            case "mouseup":
                this._isMouseDown = false;
                this.dispatchMouseUp(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEUP))
                break;
            case "mousemove":
                if (this.isSupportMouseMove) {
                    this.dispatchMouseMove(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEMOVE))
                }
                if (this._isMouseDown) {
                    this.dispatchMouseDrag(this._toCanvasMouseEvent(evt, EInputEventType.MOUSEDRAG))
                }

                break;
            case "keypress":
                this.dispatchKeyPress(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYPRESS))
                break;
            case "keydown":
                this.dispatchKeyDown(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYDOWN))
                break;
            case "keyup":
                this.dispatchKeyUp(this._toCanvasKeyBoardEvent(evt, EInputEventType.KEYUP))
                break;
            default:
                break;
        }
    }
    public dispatchMouseDown(evt: CanvasMouseEvent): void {
        console.log("mousedown", evt.canvasPostion)
    }
    public dispatchMouseUp(evt: CanvasMouseEvent): void {
        console.log("mouseup",evt.canvasPostion)
    }
    public dispatchMouseMove(evt: CanvasMouseEvent): void {
        console.log("mousemove",evt.canvasPostion)
    }
    public dispatchMouseDrag(evt: CanvasMouseEvent): void {
        console.log("drag", evt.canvasPostion)
    }
    public dispatchKeyPress(evt: CanvasKeyBoardEvent): void {}
    public dispatchKeyDown(evt: CanvasKeyBoardEvent): void {}
    public dispatchKeyUp(evt: CanvasKeyBoardEvent): void {}


    public removeTimer(id: number): boolean {
        let foundTimer = this.timers.find((timer) => {
            return timer.id === id
        })
        if (foundTimer) {
            foundTimer.enabled = false
            return true
        }
        return false
    }
    public addTimer(callback: TimerCallback, timeout: number = 1000, onlyOnce: boolean = false, data: any = undefined): number {
        let timer: Timer;
        for (let index = 0; index < this.timers.length; index++) {
            const timer = this.timers[index];
            if (timer.enabled === false) {
                timer.callback = callback;
                timer.callbackData = data;
                timer.countdown = timeout;
                timer.timeout = timeout;
                timer.enabled = true;
                timer.onlyOnce = onlyOnce
                return timer.id
            }

        }
        timer = new Timer(callback)
        timer.callback = callback;
        timer.callbackData = data;
        timer.countdown = timeout;
        timer.timeout = timeout;
        timer.enabled = true;
        timer.id = ++this._timeId;
        timer.onlyOnce = onlyOnce;
        this.timers.push(timer)
        return timer.id
    }
    private _handleTimer(intervalSec: number) {
        for (let index = 0; index < this.timers.length; index++) {
            const timer = this.timers[index];
            if (timer.enabled === false) {
                continue
            }
            timer.countdown -= intervalSec;
            if (timer.countdown < 0) {
                timer.callback(timer.id, timer.callbackData)
                if (timer.onlyOnce) {
                    this.removeTimer(timer.id)
                } else {
                    timer.countdown = timer.timeout
                }
            }

        }
    }
}