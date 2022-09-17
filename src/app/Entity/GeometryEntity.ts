

import { Point3 } from "../Geometry/Point";
import { GLTexture } from "../GLTexture";
import { Matrix4 } from "../math/TSM";
import { BaseEntity } from "./BaseEntity";

export class GeometryEntity extends BaseEntity {
    public texture: GLTexture;
    public transform: Matrix4 = new Matrix4()
    public vertices: Point3[];
    constructor(texture?: GLTexture) {
        super();
        if (texture) {
            this.texture = texture;
        }
    }
    setTexture(tex: GLTexture) {
        this.texture = tex;
    }
}
