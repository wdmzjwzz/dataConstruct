
import { GLShaderSource } from "./glsl";
import Attributes from "./twgl/attributes";

const twgl = (window as any).twgl
const m4 = (window as any).m4
const textureUtils = (window as any).textureUtils
const chroma = (window as any).chroma
export default class Application {
    // 可以直接操作WebGL相关内容
    public gl: WebGL2RenderingContext;

    constructor(canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext("webgl2");
        if (!this.gl) {
            throw new Error("webgl2 not support");
        }

    }
    main() {
        const { vs, fs } = GLShaderSource;
        const gl = this.gl
        // Tell the twgl to match position with a_position, n
        // normal with a_normal etc..
        twgl.setAttributePrefix("a_");

        // an indexed quad
        // var arrays = {
        //     position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
        //     texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
        //     normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        //     indices: [0, 1, 2, 1, 2, 3],
        // };
        var arrays2 = {
            a_position: [0, 0, 0, 10, 0, 0, 0, 10, 0, 10, 10, 0],
            a_texcoord: [0, 0, 0, 1, 1, 0, 1, 1],
            a_normal: [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
            indices: [0, 1, 2, 1, 2, 3],
        };
        // var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);


        var bufferInfo  = new Attributes().createBufferInfoFromArrays(gl, arrays2)
        console.log(bufferInfo);

        // setup GLSL program
        var program = twgl.createProgramFromSources(gl, [vs, fs]);
        var uniformSetters = twgl.createUniformSetters(gl, program);
        var attribSetters = twgl.createAttributeSetters(gl, program);

        var vao = twgl.createVAOFromBufferInfo(
            gl, attribSetters, bufferInfo);

        function degToRad(d: number) {
            return d * Math.PI / 180;
        }

        var fieldOfViewRadians = degToRad(60);

        var uniformsThatAreTheSameForAllObjects = {
            u_lightWorldPos: [-50, 30, 100],
            u_viewInverse: m4.identity(),
            u_lightColor: [1, 1, 1, 1],
        };

        var uniformsThatAreComputedForEachObject = {
            u_worldViewProjection: m4.identity(),
            u_world: m4.identity(),
            u_worldInverseTranspose: m4.identity(),
        };

        var rand = function (min: number, max?: number) {
            if (max === undefined) {
                max = min;
                min = 0;
            }
            return min + Math.random() * (max - min);
        };

        var randInt = function (range: number) {
            return Math.floor(Math.random() * range);
        };

        var textures = [
            textureUtils.makeStripeTexture(gl, { color1: "#FFF", color2: "#CCC", }),
            textureUtils.makeCheckerTexture(gl, { color1: "#FFF", color2: "#CCC", }),
            textureUtils.makeCircleTexture(gl, { color1: "#FFF", color2: "#CCC", }),
        ];

        var objects: { radius: number; xRotation: number; yRotation: number; materialUniforms: { u_colorMult: any; u_diffuse: any; u_specular: number[]; u_shininess: number; u_specularFactor: number; }; }[] = [];
        var numObjects = 300;
        var baseColor = rand(240);
        for (var ii = 0; ii < numObjects; ++ii) {
            objects.push({
                radius: rand(150),
                xRotation: rand(Math.PI * 2),
                yRotation: rand(Math.PI),
                materialUniforms: {
                    u_colorMult: chroma.hsv(rand(baseColor, baseColor + 120), 0.5, 1).gl(),
                    u_diffuse: textures[randInt(textures.length)],
                    u_specular: [1, 1, 1, 1],
                    u_shininess: rand(500),
                    u_specularFactor: rand(1),
                },
            });
        }

        requestAnimationFrame(drawScene);

        // Draw the scene.
        function drawScene(time: number) {
            time = 5 + time * 0.0001;

            twgl.resizeCanvasToDisplaySize(gl.canvas);

            // Tell WebGL how to convert from clip space to pixels
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);

            // Compute the projection matrix
            var aspect = gl.canvas.width / gl.canvas.height;
            var projectionMatrix =
                m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

            // Compute the camera's matrix using look at.
            var cameraPosition = [0, 0, 100];
            var target = [0, 0, 0];
            var up = [0, 1, 0];
            var cameraMatrix = m4.lookAt(cameraPosition, target, up, uniformsThatAreTheSameForAllObjects.u_viewInverse);

            // Make a view matrix from the camera matrix.
            var viewMatrix = m4.inverse(cameraMatrix);

            var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

            gl.useProgram(program);

            // Setup all the needed attributes.
            gl.bindVertexArray(vao);

            // Set the uniforms that are the same for all objects.
            twgl.setUniforms(uniformSetters, uniformsThatAreTheSameForAllObjects);

            // Draw objects
            objects.forEach(function (object) {

                // Compute a position for this object based on the time.
                var worldMatrix = m4.identity();
                worldMatrix = m4.yRotate(worldMatrix, object.yRotation * time);
                worldMatrix = m4.xRotate(worldMatrix, object.xRotation * time);
                worldMatrix = m4.translate(worldMatrix, 0, 0, object.radius,
                    uniformsThatAreComputedForEachObject.u_world);

                // Multiply the matrices.
                m4.multiply(viewProjectionMatrix, worldMatrix, uniformsThatAreComputedForEachObject.u_worldViewProjection);
                m4.transpose(m4.inverse(worldMatrix), uniformsThatAreComputedForEachObject.u_worldInverseTranspose);

                // Set the uniforms we just computed
                twgl.setUniforms(uniformSetters, uniformsThatAreComputedForEachObject);

                // Set the uniforms that are specific to the this object.
                twgl.setUniforms(uniformSetters, object.materialUniforms);

                // Draw the geometry.
                gl.drawElements(gl.TRIANGLES, bufferInfo.numElements, gl.UNSIGNED_SHORT, 0);
            });

            requestAnimationFrame(drawScene);
        }
    }
}