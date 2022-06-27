// /* eslint-disable */
// import { Application } from "./Application";
// import { Camera } from "./Camera";
// import { GLUtils } from "./lib/GLUtils";
// import vertexShader from "@/shaders/shodowShader.vert";
// import fragmentShader from "@/shaders/shodowShader.frag";
// import {
//   DrawObject,
//   drawObjectList,
//   m4,
//   ProgramInfo,
//   resizeCanvasToDisplaySize,
//   setDefaults,
// } from "twgl.js";
// import { GeometryEntity } from "./Entity/GeometryEntity"; 
// import { PointLight } from "./Light/PointLight";
// import { GLWorldMatrixStack } from "./GLMatrixStack"; 
// export class SenceApplication extends Application {
//   public entities: GeometryEntity[] = [];
//   public light: PointLight | null = null;
//   public camera: Camera | null = null;

//   public drawObjects: DrawObject[] = [];

//   public programInfo: ProgramInfo;
//   public vao: WebGLVertexArrayObject | null = null;
//   public gl: WebGL2RenderingContext;

//   public matStack: GLWorldMatrixStack;
//   constructor(canvas: HTMLCanvasElement) {
//     super(canvas);
//     const gl = this.canvas.getContext("webgl2");
//     if (!gl) {
//       throw new Error("create gl error!");
//     }
//     this.gl = gl;

//     this.vao = this.gl.createVertexArray();
//     if (!this.vao) {
//       throw new Error("createVertexArray error!");
//     }
//     this.gl.bindVertexArray(this.vao);
//     this.programInfo = GLUtils.createProgramInfo(this.gl, [
//       vertexShader,
//       fragmentShader,
//     ]);
//     this.matStack = new GLWorldMatrixStack();
//   }

//   addCamera(camera: Camera) {
//     this.camera = camera;
//   }
//   deleteCamera() {
//     this.camera = null;
//   }
//   addLight(light: PointLight) {
//     this.light = light;
//   }
//   deleteLight() {
//     this.light = null;
//   }
//   addEntity(entity: GeometryEntity) {
//     this.entities.push(entity);
//   }
//   getEntites() {
//     return this.entities;
//   }
//   deleteEntity(entityId: string) {
//     const deleteIndex = this.entities.findIndex(
//       (entity) => entity.id === entityId
//     );
//     if (deleteIndex === -1) {
//       throw new Error("要删除的entity不存在！");
//     }
//     this.entities.splice(deleteIndex, 1);
//   }
//   public start(): void {
//     super.start();
//     setDefaults({ attribPrefix: "a_" });
//     const uniforms: any = {
//       u_lightWorldPos: this.light?.position,
//       u_lightColor: this.light?.color,
//       u_diffuseMult: [0.4, 0.5, 0.8, 1],
//       u_specular: this.light?.specularColor,
//       u_shininess: this.light?.shininess,
//       u_specularFactor: 1,
//       u_diffuse: "",
//       u_viewInverse: [],
//       u_world: [],
//       u_worldInverseTranspose: [],
//       u_worldViewProjection: [],
//     };

//     this.entities.forEach((entity) => {
//       const tex = GLUtils.createTexture(
//         this.gl,
//         entity.texture!.textureOptions
//       );
//       uniforms.u_diffuse = tex;
//       uniforms.u_world = entity.transform;
//       uniforms.u_worldInverseTranspose = m4.transpose(
//         m4.inverse(uniforms.u_world, uniforms.u_worldInverseTranspose)
//       );
//       uniforms.u_worldViewProjection = m4.multiply(
//         this.camera!.viewProjection,
//         entity.transform
//       );
//       uniforms.u_viewInverse = this.camera?.viewInverseMat4;
//       const vertices = entity.vertices;
//       const bufferInfo = GLUtils.createBufferInfoFromVertices(
//         this.gl,
//         vertices
//       );
//       this.drawObjects.push({
//         programInfo: this.programInfo,
//         bufferInfo: bufferInfo,
//         uniforms: { ...uniforms },
//       });
//     });
//   }
//   render() {
//     resizeCanvasToDisplaySize(this.canvas);
//     this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
//     this.gl.enable(this.gl.DEPTH_TEST);
//     this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
//     drawObjectList(this.gl, this.drawObjects);
//   }
//   destroy() {
//     this.gl.bindVertexArray(null);
//   }
// }
