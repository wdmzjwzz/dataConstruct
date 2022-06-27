import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Camera } from '../app/Camera';
import { CameraApplication } from '../app/CameraApplication';
import "./index.less"

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    let app: CameraApplication;
    const init = () => {
        const camera = new Camera(canvas.current.clientWidth, canvas.current.clientHeight);
        app = new CameraApplication(canvas.current,camera);
        app.start()
    };
    useEffect(() => {
        init();

    }, []);
    return (
        <div className="content">
            <div className="fps">
                FPS: <span> { }</span>
            </div>
            <div className="canvasContent">
                <canvas id="canvas" ref={canvas} width={document.documentElement.clientWidth} height={document.documentElement.clientHeight}></canvas>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))