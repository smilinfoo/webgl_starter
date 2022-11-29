#version 300 es
 
precision highp float;
 
in vec4 v_color;
out vec4 outColor;
 
void main() {
  outColor = vec4(v_color.r, v_color.g, v_color.b, 1.0);
}