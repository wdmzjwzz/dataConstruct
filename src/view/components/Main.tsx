import React, { useEffect, useRef, useState } from "react";
import "./main.less";
import "../assets/font/iconfont.css";
// import { MeshBuilderApplication } from "../../demo/MeshBuilderApplication";
import { MeshApplication } from "../../system/MeshApplication";
import { Point } from "../../theWorld/Geometry/Point";

export default () => {
  const [fps, setFps] = useState<number>(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const resizeFun = () => {
    canvas.current?.setAttribute("width", document.body.clientWidth.toString());
    canvas.current?.setAttribute(
      "height",
      document.body.clientHeight.toString()
    );
  };
  let app: MeshApplication;
  const frameCallback = () => {
    setFps(Math.ceil(app.fps));
  };
  const init = () => {
    app = new MeshApplication(canvas.current);
    app.addTimer(frameCallback, 1);
    app.run();
    app.createPoints([new Point(0, 0, 0)])
  };
  useEffect(() => {
    resizeFun();
    init();
    window.addEventListener("resize", resizeFun);
    return () => {
      app.stop();
    };
  }, []);
  return (
    <div className="content">
      <div className="fps">
        FPS: <span> {fps}</span>
      </div>
      <div className="canvasContent">
        <canvas id="canvas" ref={canvas}></canvas>
      </div>
    </div>
  );
};
