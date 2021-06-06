# ifdef GL_ES
precision highp float;
   #endif
attribute vec3 aPositon;
attribute vec2 aTexCoord;
uniform mat4 uMVPMatrix;
varying vec2 vTextureCoord;

void main() {
    gl_Position = uMVPMatrix * vec4(aPositon, 1.0);
    vTextureCoord = aTexCoord;
}