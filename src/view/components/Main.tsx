import React, { useEffect, useRef, useState } from "react";
import "./main.less";
import "../assets/font/iconfont.css";
import { MeshBuilderApplication } from "../../demo/MeshBuilderApplication";
import { Face } from "../../theWorld/Geometry/Face";
import { Point } from "../../theWorld/Geometry/Point";

export default () => {
  const [fps, setFps] = useState<number>(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const resizeFun = () => {
    canvas.current?.setAttribute("width", document.body.clientWidth + "");
    canvas.current?.setAttribute(
      "height",
      document.body.clientHeight - 40 + ""
    );
  };
  let app: MeshBuilderApplication;
  const frameCallback = () => {
    setFps(Math.ceil(app.fps));
  };
  const init = () => {
    app = new MeshBuilderApplication(canvas.current);
    app.addTimer(frameCallback, 1);
    app.run();
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
