#version 300 es
 
in vec4 a_position;
in vec4 a_color;

out vec4 v_color;

uniform vec2 u_resolution;
 
void main() {
 
  v_color = a_color;
  gl_Position = a_position;
  
}