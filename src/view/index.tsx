import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import Application from '../wzzgl'; 
import "./index.less"

function App() {
    const canvas = useRef<HTMLCanvasElement>(null); 
    let app: Application; 
    const init = () => {
        app = new Application(canvas.current);
        app.main(); 
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