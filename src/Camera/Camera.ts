import { vec3, mat4 } from "../math/tsm";
import { MathHelper } from "../utils/MathHelper";

export enum ECameraType {
    FPSCAMERA,
    FLYCAMERA
}
export class Camera {
    public gl: WebGLRenderingContext;
    private _type: ECameraType = ECameraType.FLYCAMERA;
    private _position: vec3 = new vec3();
    private _xAxis: vec3 = new vec3([1, 0, 0]);
    private _yAxis: vec3 = new vec3([0, 1, 0]);
    private _zAxis: vec3 = new vec3([0, 0, 1]);
    private _mat4: mat4 = new mat4().setIdentity()
    private _viewMatrix: mat4;//视图矩阵
    private _near: number;
    private _far: number;
    private _fovY: number; //视野的仰角
    private _aspectRatio: number; //视野的纵横比
    private _projectionMatrix: mat4; //投影矩阵
    private _viewProjMatrix: mat4; //视图矩阵*投影矩阵
    private _invViewProjMatrix: mat4;  //视图矩阵*投影矩阵的逆矩阵

    constructor(gl: WebGLRenderingContext, width: number, height: number, fovY: number = 45.0, zNear: number = 1, zFar: number = 1000) {
        this.gl = gl;
        this._aspectRatio = width / height;
        this._fovY = MathHelper.toRadian(fovY);
        this._near = zNear;
        this._far = zFar;
        this._projectionMatrix = new mat4();
        this._viewProjMatrix = new mat4();
        this._invViewProjMatrix = new mat4();
    }

    public moveForward(speed: number): void {
        if (this._type === ECameraType.FPSCAMERA) {
            this._position.x += this._zAxis.x * speed;
            this._position.z += this._zAxis.z * speed;

        } else {
            this._position.x += this._zAxis.x * speed;
            this._position.y += this._zAxis.y * speed;
            this._position.z += this._zAxis.z * speed;
        }
    }
    public moveRightward(speed: number): void {
        if (this._type === ECameraType.FPSCAMERA) {
            this._position.x += this._xAxis.x * speed;
            this._position.z += this._xAxis.z * speed;

        } else {
            this._position.x += this._xAxis.x * speed;
            this._position.y += this._xAxis.y * speed;
            this._position.z += this._xAxis.z * speed;
        }
    }
    public moveUptward(speed: number): void {
        if (this._type === ECameraType.FPSCAMERA) {
            this._position.y += speed;


        } else {
            this._position.x += this._yAxis.x * speed;
            this._position.y += this._yAxis.y * speed;
            this._position.z += this._yAxis.z * speed;
        }
    }
    // 局部坐标轴的左右旋转
    public yaw(angle: number): void {
        this._mat4.setIdentity();
        let _angle = MathHelper.toRadian(angle)

        if (this._type === ECameraType.FPSCAMERA) {
            this._mat4.rotate(_angle, vec3.up)
        } else {
            this._mat4.rotate(_angle, this._yAxis)
        }
        // 获取旋转之后另外两个轴的方向
        this._xAxis = this._mat4.multiplyVec3(this._xAxis);
        this._zAxis = this._mat4.multiplyVec3(this._zAxis);
    }
    public pitch(angle: number): void {
        this._mat4.setIdentity();
        let _angle = MathHelper.toRadian(angle)
        this._mat4.rotate(_angle, this._xAxis)

        this._zAxis = this._mat4.multiplyVec3(this._zAxis);
        this._yAxis = this._mat4.multiplyVec3(this._yAxis);
    }
    public roll(angle: number): void {
        if (this._type === ECameraType.FPSCAMERA) {
            this._mat4.setIdentity();
            let _angle = MathHelper.toRadian(angle)
            this._mat4.rotate(_angle, this._zAxis)
            this._xAxis = this._mat4.multiplyVec3(this._xAxis);
            this._yAxis = this._mat4.multiplyVec3(this._yAxis);
        }
    }
    public update(intervalSec: number): void {
        this._projectionMatrix = mat4.perspective(this._fovY, this._aspectRatio, this._near, this._far);
        this.calcViewMatrix();
        mat4.product(this._projectionMatrix, this._viewMatrix, this._viewProjMatrix);
        this._invViewProjMatrix = this._viewProjMatrix.inverse()
    }
    /**
     * calcViewMatrix
     */
    public calcViewMatrix(): void {
        this._zAxis.normalize();
        this._yAxis = vec3.cross(this._zAxis, this._xAxis);
        this._yAxis.normalize();
        this._xAxis = vec3.cross(this._yAxis, this._zAxis);
        this._xAxis.normalize();

        let x: number = -vec3.dot(this._xAxis, this._position);
        let y: number = -vec3.dot(this._yAxis, this._position);
        let z: number = -vec3.dot(this._zAxis, this._position);

        this._viewMatrix.values[0] = this._xAxis.x;
        this._viewMatrix.values[1] = this._yAxis.x;
        this._viewMatrix.values[2] = this._zAxis.x;
        this._viewMatrix.values[3] = 0.0;
        this._viewMatrix.values[4] = this._xAxis.y;
        this._viewMatrix.values[5] = this._yAxis.y;
        this._viewMatrix.values[6] = this._zAxis.y;
        this._viewMatrix.values[7] = 0.0;
        this._viewMatrix.values[8] = this._xAxis.z;
        this._viewMatrix.values[9] = this._yAxis.z;
        this._viewMatrix.values[10] = this._zAxis.z;
        this._viewMatrix.values[11] = 0.0;
        this._viewMatrix.values[12] = x;
        this._viewMatrix.values[13] = y;
        this._viewMatrix.values[14] = z;
        this._viewMatrix.values[15] = 1.0;
    }

    public get fovY(): number {
        return this._fovY
    }

    public set fovY(v: number) {
        this._fovY = v;
    }


    public get near(): number {
        return this.near
    }

    public set near(v: number) {
        this._near = v;
    }


    public get far(): number {
        return this._far
    }


    public set far(v: number) {
        this._far = v;
    }

    public get aspectRatio(): number {
        return this._aspectRatio
    }


    public set aspectRatio(v: number) {
        this._aspectRatio = v;
    }

    public get position(): vec3 {
        return this._position
    }


    public set position(v: vec3) {
        this._position = v;
    }

    public get x(): number {
        return this._position.x
    }


    public set x(v: number) {
        this._position.x = v;
    }
    public get y(): number {
        return this._position.y
    }


    public set y(v: number) {
        this._position.y = v;
    }
    public get z(): number {
        return this._position.z
    }


    public set z(v: number) {
        this._position.z = v;
    }


    public get xAxis(): vec3 {
        return this._xAxis
    }
    public get yAxis(): vec3 {
        return this._yAxis
    }
    public get zAxis(): vec3 {
        return this._zAxis
    }


    public get type(): ECameraType {
        return this._type
    }

    public set type(v: ECameraType) {
        this._type = v;
    }


    public setViewport(x: number, y: number, width: number, height: number): void {
        this.gl.viewport(x, y, width, height)
    }
    public getViewport(): Int32Array {
        return this.gl.getParameter(this.gl.VIEWPORT)
    }
}
