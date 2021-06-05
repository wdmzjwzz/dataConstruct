attribute vec3 aPosition;
attribute vec4 aColor;
uniform mat4 uMVMatrix;
varying vec4 vColor;

void main() {
    gl_PointSize = 20.0;
    gl_Position = uMVMatrix * vec4(aPosition, 1);
    vColor = aColor;
}