/* eslint-disable */
import { MathHelper } from "./math/MathHelper";
import { Matrix4, Vector3 } from "./math/TSM";

export enum EMatrixMode {
  MODELVIEW,
  PROJECTION,
  TEXTURE,
}

export class GLMatrixStack {
  private _mvStack: Matrix4[];
  private _projStack: Matrix4[];
  private _texStack: Matrix4[];
  public matrixMode: EMatrixMode;

  public constructor() {
    //初始化时每个矩阵栈都先添加一个正交归一化后的矩阵
    this._mvStack = [];
    this._mvStack.push(new Matrix4());

    this._projStack = [];
    this._projStack.push(new Matrix4());

    this._texStack = [];
    this._texStack.push(new Matrix4());

    this.matrixMode = EMatrixMode.MODELVIEW;
  }

  public get modelViewMatrix(): Matrix4 {
    if (this._mvStack.length <= 0) {
      throw new Error("model view matrix stack为空！");
    }
    return this._mvStack[this._mvStack.length - 1];
  }

  public get projectionMatrix(): Matrix4 {
    if (this._projStack.length <= 0) {
      throw new Error("projection matrix stack为空！");
    }
    return this._projStack[this._projStack.length - 1];
  }

  public get modelViewProjectionMatrix(): Matrix4 {
    let ret: Matrix4 = new Matrix4();
    this.projectionMatrix.copy(ret);
    ret.multiply(this.modelViewMatrix);
    return ret;
  }

  public get normalMatrix(): Matrix4 {
    let ret = this.modelViewMatrix.copy();
    ret = this.modelViewMatrix.inverse();
    ret.transpose();
    return ret;
  }

  public get textureMatrix(): Matrix4 {
    if (this._texStack.length <= 0) {
      throw new Error("projection matrix stack为空！");
    }
    return this._texStack[this._texStack.length - 1];
  }

  public pushMatrix(): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        let mv: Matrix4 = new Matrix4();
        this.modelViewMatrix.copy(mv);
        this._mvStack.push(mv);
        break;
      case EMatrixMode.PROJECTION:
        let proj = new Matrix4();
        this.projectionMatrix.copy(proj);
        this._projStack.push(proj);
        break;
      case EMatrixMode.TEXTURE:
        let tex: Matrix4 = new Matrix4();
        this.textureMatrix.copy(tex);
        this._texStack.push(tex);
        break;
    }
    return this;
  }

  public popMatrix(): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this._mvStack.pop();
        break;
      case EMatrixMode.PROJECTION:
        this._projStack.pop();
        break;
      case EMatrixMode.TEXTURE:
        this._texStack.pop();
        break;
    }
    return this;
  }

  public loadIdentity(): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this.modelViewMatrix.setIdentity();
        break;
      case EMatrixMode.PROJECTION:
        this.projectionMatrix.setIdentity();
        break;
      case EMatrixMode.TEXTURE:
        this.textureMatrix.setIdentity();
        break;
    }
    return this;
  }

  public loadMatrix(mat: Matrix4): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        mat.copy(this.modelViewMatrix);
        break;
      case EMatrixMode.PROJECTION:
        mat.copy(this.projectionMatrix);
        break;
      case EMatrixMode.TEXTURE:
        mat.copy(this.textureMatrix);
        break;
    }
    return this;
  }

  public perspective(
    fov: number,
    aspect: number,
    near: number,
    far: number,
    isRadians: boolean = false
  ): GLMatrixStack {
    this.matrixMode = EMatrixMode.PROJECTION;
    if (isRadians == false) {
      fov = MathHelper.toRadian(fov);
    }
    let mat: Matrix4 = Matrix4.perspective(fov, aspect, near, far);
    this.loadMatrix(mat);
    this.matrixMode = EMatrixMode.MODELVIEW;
    // 是否要调用loadIdentity方法???
    this.loadIdentity();
    return this;
  }

  public frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): GLMatrixStack {
    this.matrixMode = EMatrixMode.PROJECTION;
    let mat: Matrix4 = Matrix4.frustum(left, right, bottom, top, near, far);
    this.loadMatrix(mat);
    this.matrixMode = EMatrixMode.MODELVIEW;
    // 是否要调用loadIdentity方法???
    this.loadIdentity();
    return this;
  }

  public ortho(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): GLMatrixStack {
    this.matrixMode = EMatrixMode.PROJECTION;
    let mat: Matrix4 = Matrix4.orthographic(
      left,
      right,
      bottom,
      top,
      near,
      far
    );
    this.loadMatrix(mat);
    this.matrixMode = EMatrixMode.MODELVIEW;
    // 是否要调用loadIdentity方法???
    this.loadIdentity();
    return this;
  }

  public lookAt(
    pos: Vector3,
    target: Vector3,
    up: Vector3 = Vector3.up
  ): GLMatrixStack {
    this.matrixMode = EMatrixMode.MODELVIEW;
    let mat: Matrix4 = Matrix4.lookAt(pos, target, up);
    this.loadMatrix(mat);
    return this;
  }

  public makeView(
    pos: Vector3,
    xAxis: Vector3,
    yAxis: Vector3,
    zAxis: Vector3
  ): GLMatrixStack {
    zAxis.normalize();

    //forward cross right = up
    Vector3.cross(zAxis, xAxis, yAxis);
    yAxis.normalize();

    //up cross forward = right
    Vector3.cross(yAxis, zAxis, xAxis);
    xAxis.normalize();

    let x: number = -Vector3.dot(xAxis, pos);
    let y: number = -Vector3.dot(yAxis, pos);
    let z: number = -Vector3.dot(zAxis, pos);

    let mat: Matrix4 = this._mvStack[this._mvStack.length - 1];
    mat.values[0] = xAxis.x;
    mat.values[1] = yAxis.x;
    mat.values[2] = zAxis.x;
    mat.values[3] = 0.0;

    mat.values[4] = xAxis.y;
    mat.values[5] = yAxis.y;
    mat.values[6] = zAxis.y;
    mat.values[7] = 0.0;

    mat.values[8] = xAxis.z;
    mat.values[9] = yAxis.z;
    mat.values[10] = zAxis.z;
    mat.values[11] = 0.0;

    mat.values[12] = x;
    mat.values[13] = y;
    mat.values[14] = z;
    mat.values[15] = 1.0;

    return this;
  }

  public multMatrix(mat: Matrix4): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this.modelViewMatrix.multiply(mat);
        break;
      case EMatrixMode.PROJECTION:
        this.projectionMatrix.multiply(mat);
        break;
      case EMatrixMode.TEXTURE:
        this.textureMatrix.multiply(mat);
        break;
    }
    return this;
  }

  public translate(pos: Vector3): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this.modelViewMatrix.translate(pos);
        break;
      case EMatrixMode.PROJECTION:
        this.projectionMatrix.translate(pos);
        break;
      case EMatrixMode.TEXTURE:
        this.textureMatrix.translate(pos);
        break;
    }
    return this;
  }

  public rotate(
    angle: number,
    axis: Vector3,
    isRadians: boolean = false
  ): GLMatrixStack {
    if (isRadians === false) {
      angle = MathHelper.toRadian(angle);
    }
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this.modelViewMatrix.rotate(angle, axis);
        break;
      case EMatrixMode.PROJECTION:
        this.projectionMatrix.rotate(angle, axis);
        break;
      case EMatrixMode.TEXTURE:
        this.textureMatrix.rotate(angle, axis);
        break;
    }
    return this;
  }

  public scale(s: Vector3): GLMatrixStack {
    switch (this.matrixMode) {
      case EMatrixMode.MODELVIEW:
        this.modelViewMatrix.scale(s);
        break;
      case EMatrixMode.PROJECTION:
        this.projectionMatrix.scale(s);
        break;
      case EMatrixMode.TEXTURE:
        this.textureMatrix.scale(s);
        break;
    }
    return this;
  }
}

export class GLWorldMatrixStack {
  private _worldMatrixStack: Matrix4[];

  public constructor() {
    //初始化时每个矩阵栈都先添加一个正交归一化后的矩阵
    this._worldMatrixStack = [];
    this._worldMatrixStack.push(new Matrix4());
  }

  public get modelViewMatrix(): Matrix4 {
    if (this._worldMatrixStack.length <= 0) {
      throw new Error(" model matrix stack为空！");
    }
    return this._worldMatrixStack[this._worldMatrixStack.length - 1];
  }

  public pushMatrix(): GLWorldMatrixStack {
    let mv: Matrix4 = new Matrix4();
    this.modelViewMatrix.copy(mv);
    this._worldMatrixStack.push(mv);
    return this;
  }

  public popMatrix(): GLWorldMatrixStack {
    this._worldMatrixStack.pop();
    return this;
  }

  public loadIdentity(): GLWorldMatrixStack {
    this.modelViewMatrix.setIdentity();
    return this;
  }

  public loadMatrix(mat: Matrix4): GLWorldMatrixStack {
    mat.copy(this.modelViewMatrix);
    return this;
  }

  public multMatrix(mat: Matrix4): GLWorldMatrixStack {
    this.modelViewMatrix.multiply(mat);
    return this;
  }

  public translate(pos: Vector3): GLWorldMatrixStack {
    this.modelViewMatrix.translate(pos);
    return this;
  }

  public rotate(
    angle: number,
    axis: Vector3,
    isRadians: boolean = false
  ): GLWorldMatrixStack {
    if (isRadians === false) {
      angle = MathHelper.toRadian(angle);
    }
    this.modelViewMatrix.rotate(angle, axis);
    return this;
  }

  public scale(s: Vector3): GLWorldMatrixStack {
    this.modelViewMatrix.scale(s);
    return this;
  }
}
