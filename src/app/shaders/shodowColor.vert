#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec4 a_color;

out vec4 u_color;
uniform mat4 u_mvpMat4;
// all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  u_color = a_color;
  gl_Position = u_mvpMat4 * a_position;
  
}