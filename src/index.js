import { programFromShaderText, resizeCanvasToDisplaySize } from './utils/wegl_utils';
import './style.css'
import vertText from './shaders/ndc.vert'
import fragText from './shaders/ndc.frag'


function createShader(gl, type, source){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS )
    if(success){
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShaer(shader);
}

function createProgram(gl, vertexShader, fragmentShader){
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if(success){
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function compo(){

    const canvas = document.createElement('canvas');
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        //do more
        console.log("GL NOT SUPPORTED")
    } else {
        //remove
        console.log("YAY")
    }

    let positions = [
        -0.5, -0.5,
        0, 0.5,
        0.5, -0.5
    ];

    let color = [
        1,0,1,0,
        1,0.5,0,0,
        0,0,1,0
    ]
    let program = programFromShaderText(gl, vertText, fragText);
    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution')
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position" );
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color" );

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    let positionBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();
    let posef32 = new Float32Array(positions)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, posef32, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset );
    

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    let sizeC = 4;
    let typeC = gl.FLOAT;
    let normalizeC = false;
    let strideC = 0;
    let offsetC = 0;
    gl.vertexAttribPointer(colorAttributeLocation, sizeC, typeC, normalizeC, strideC, offsetC );


    //resizeCanvasToDisplaySize(gl.canvas, 1);
    gl.clearColor(0, 0, 0, 0 );
    

    let primitiveType = gl.TRIANGLES;
    offset = 0;
    let count = 3;
    
    function renderLoop(){

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.drawArrays(primitiveType, offset, count);
        requestAnimationFrame(renderLoop)
    
    }

    renderLoop();

    return canvas;
    
}



document.body.appendChild( compo( ) );

