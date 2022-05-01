 #ifdef GL_ES
precision highp float;
        #endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute float aSize;
uniform mat4 uMVPMatrix;
varying vec2 vTextureCoord;
void main(void) {
    gl_Position = uMVPMatrix * vec4(aPosition, 1.0);
    gl_PointSize = aSize;
    vTextureCoord = aTexCoord;
}