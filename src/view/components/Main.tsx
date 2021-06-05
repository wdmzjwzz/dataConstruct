
import React, { useEffect, useRef, useState } from 'react';
import "./main.less"
import "../assets/font/iconfont.css"
import { BasicWebGLApplication } from "../../app/BasicWebGLApplication"
export default () => {
    const [fps, setFps] = useState<number>(0)
    const canvas = useRef<HTMLCanvasElement>(null)
    const resizeFun = () => {
        canvas.current?.setAttribute("width", (document.body.clientWidth - 480) + "")
        canvas.current?.setAttribute("height", (document.body.clientHeight - 40) + "")
    }
    const updateFps = (app: BasicWebGLApplication) => () => {
        setFps(Math.ceil(app.fps))
    }

    useEffect(() => {
        resizeFun()
        window.addEventListener("resize", resizeFun)
        let app: BasicWebGLApplication | null = null;
        let timerId: number = -1
        if (canvas.current) {
            app = new BasicWebGLApplication(canvas.current)
            timerId = app.addTimer(updateFps(app), 800, false, 999)
            app.start()
            app.drawRectByInterleavedVBO()
        }

        return () => {
            window.removeEventListener("resize", resizeFun)
            if (app) {
                app.removeTimer(timerId)
                app.stop()
            }

        }
    }, [])
    return (
        <div className="content">
            <div className="fps">
                FPS: <span> {fps}</span>
            </div>
            <div className="canvasContent">
                <canvas id="canvas" ref={canvas} ></canvas>
            </div >
        </div>

    );
};
