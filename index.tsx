import React from 'react';
import style from "./index.module.scss"
import { useEffect, useRef } from "react"
import { createVertexShader, createFragShader, initShader } from "./utils"
import { TreeNode } from "./tree/TreeNode"
import { NodeEnumeratorFactory } from "./tree/NodeEnumeratorFactory"
import { IndexerR2L } from './tree/Indexer';
import { Application } from "./app/Application"
export default () => {

  const canvas = useRef<HTMLCanvasElement>(null)
  const resizeFun = () => {
    canvas.current?.setAttribute("width", (document.body.clientWidth - 480) + "")
    canvas.current?.setAttribute("height", (document.body.clientHeight - 40) + "")
  }

  const drawMesh = () => {
    if (canvas.current) {
      const gl = canvas.current.getContext('webgl')!
      const vertexShaderSource = createVertexShader("0.0")
      const fragmentShaderSource = createFragShader()

      const program = initShader(gl, vertexShaderSource, fragmentShaderSource)
      const aposLocation = gl.getAttribLocation(program, 'apos');
      const a_color = gl.getAttribLocation(program, 'a_color');
      // const data = new Float32Array([
      //   -0.5, -0.5, 0.5,
      //   0.5, -0.5, 0.5,
      //   0.5, -0.5, -0.5,
      //   -0.5, -0.5, -0.5,

      //   -0.5, 0.5, 0.5,
      //   0.5, 0.5, 0.5,
      //   0.5, 0.5, -0.5,
      //   -0.5, 0.5, -0.5
      // ]);
      var data = new Float32Array([
        -0.5, 0.5, 0.5, 0.5, 0.5, -0.5,//第一个三角形的三个点
        -0.5, 0.5, 0.5, -0.5, -0.5, -0.5//第二个三角形的三个点
      ]);
      var colorData = new Float32Array([
        1, 0, 0, 1, 0, 0, 1, 0, 0,//三个红色点
        0, 0, 1, 0, 0, 1, 0, 0, 1//三个蓝色点
      ]);
      // var indexes = new Uint8Array([
      //   //前四个点对应索引值
      //   0, 1, 2, 3,//gl.LINE_LOOP模式四个点绘制一个矩形框
      //   //后四个顶点对应索引值
      //   4, 5, 6, 7,//gl.LINE_LOOP模式四个点绘制一个矩形框
      //   //前后对应点对应索引值  
      //   0, 4,//两个点绘制一条直线
      //   1, 5,//两个点绘制一条直线
      //   2, 6,//两个点绘制一条直线
      //   3, 7//两个点绘制一条直线
      // ]);
      //创建缓冲区对象
      var buffer = gl.createBuffer();
      // var indexesBuffer = gl.createBuffer();

      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorData, gl.STATIC_DRAW);
      gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(a_color);

      //绑定缓冲区对象,激活buffer
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      //顶点数组data数据传入缓冲区
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);


      // //绑定缓冲区对象
      // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexesBuffer);
      // //索引数组indexes数据传入缓冲区
      // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);
      //缓冲区中的数据按照一定的规律传递给位置变量apos
      gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 0, 0);
      //允许数据传递
      gl.enableVertexAttribArray(aposLocation);
      //LINE_LOOP模式绘制前四个点
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.drawArrays(gl.TRIANGLES, 3, 3);
      //LINE_LOOP模式从第五个点开始绘制四个点
      // gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_BYTE, 4);
      // //LINES模式绘制后8个点
      // gl.drawElements(gl.LINES, 8, gl.UNSIGNED_BYTE, 8);
    }

  }
  useEffect(() => {
    resizeFun()
    drawMesh()
    window.addEventListener("resize", resizeFun)

    if (canvas.current) {
      const app: Application = new Application(canvas.current)
      const timerId = app.addTimer(() => {
        console.log("fps====", app.fps)
        console.log("isRunning===", app.isRunning())
      }, 800, false, 999)
      app.start()
      setTimeout(() => {
        app.removeTimer(timerId)
        app.stop()
        console.log("isRunning===", app.isRunning())
      }, 4000)

    }

    return () => {
      window.removeEventListener("resize", resizeFun)
    }
  }, [])
  return (
    <div className={style.canvasContent}>
      <canvas id="canvas" ref={canvas} ></canvas>
    </div >
  );
};
