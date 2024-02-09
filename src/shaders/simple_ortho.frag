#version 300 es

precision highp float;

uniform vec4 u_color;

in vec4 v_color;
out vec4 outColor;

void main(){

    outColor = v_color;
    
}