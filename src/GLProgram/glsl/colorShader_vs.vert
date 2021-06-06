attribute vec3 aPosition;
attribute vec4 aColor;
uniform mat4 uMVPMatrix;
varying vec4 vColor;

void main() {
    gl_PointSize = 20.0;
    gl_Position = uMVPMatrix * vec4(aPosition, 1);
    vColor = aColor;
}