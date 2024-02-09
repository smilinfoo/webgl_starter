#version 300 es
 
in vec4 a_position;
in vec3 a_position_b;
in vec4 a_color;

out vec4 v_color;

uniform vec2 u_resolution;
 
void main() {
 
  v_color = vec4(a_position_b, 1.0);
  gl_Position = a_position;
  
}