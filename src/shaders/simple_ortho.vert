#version 300 es

in vec4 a_position;
in vec3 a_color;

out vec4 v_color;

uniform vec4 u_color;
uniform vec2 u_resolution;
uniform mat4 u_matrix;

void main(){
    
     v_color = vec4(a_color, 1.0);
     gl_Position = u_matrix * a_position;

}