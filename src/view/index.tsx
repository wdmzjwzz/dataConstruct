import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import { MeshApplication } from '../universe/MeshApplication';
import "./index.less"

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);
    let app: MeshApplication;
    const init = () => {
        app = new MeshApplication(canvas.current);
        app.run()
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