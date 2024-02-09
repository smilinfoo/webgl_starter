import { programFromShaderText, resizeCanvasToDisplaySize } from './utils/wegl_utils';
import './style.css'
import vertText from './shaders/simple_ortho.vert'
import fragText from './shaders/simple_ortho.frag'
import { getRandomColorAsArray } from './utils/color_utils';
import {mat4} from "gl-matrix";

const FLOAT_SIZE = 4;

let gl;
let clearColor = [0.5, 0.3, 0.0, 1.0];
let vaoSelect = 0;


function app(){

    const canvas = document.createElement('canvas');
    gl = canvas.getContext("webgl2");
    if (!gl) {
        //do more
        console.log("GL NOT SUPPORTED")
    } else {
        //remove
        console.log("YAY")
    }



    let program = programFromShaderText(gl, vertText, fragText);
    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    let colorUnifromLocation = gl.getUniformLocation(program, 'u_color');
    let matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');



    let positionBuffer = gl.createBuffer(); 
    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.enableVertexAttribArray(colorAttributeLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let geoArray = getRectPrism(100,100,100);
    gl.bufferData(gl.ARRAY_BUFFER, geoArray, gl.STATIC_DRAW)

    let size = 3;
    let type = gl.FLOAT;
    let normalize = false;
    let stride_values = 6;
    let stride = stride_values * FLOAT_SIZE;
    let offset = 0;
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset)
    gl.vertexAttribPointer(colorAttributeLocation, size, type, normalize, stride, 3 * FLOAT_SIZE )

    var color = [Math.random(), Math.random(), Math.random(), 1];

    gl.useProgram(program);
    gl.uniform4fv(colorUnifromLocation, color )

    let rotation = [0,0,0];
    let translation = [0,0,0];

    gl.enable(gl.DEPTH_TEST);

    drawScene();

    window.onkeydown = keyCheck;

    function drawScene(){

      translation[0] = 1;
      translation[1] = 1;
      translation[2] = -200;
      rotation[0] += 0.01;
      rotation[1] += 0.011;
      rotation[2] += 0.012;

      //set canvas size and viewpoort size
      resizeCanvasToDisplaySize(canvas)
      //reset viewport
      gl.viewport(0,0, gl.canvas.width, gl.canvas.height)

      //clear the view
      gl.clearColor(...clearColor);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

      var mvp = mat4.create();
      mat4.orthoNO(mvp, -gl.canvas.clientWidth/2, gl.canvas.clientWidth/2,  -gl.canvas.clientHeight/2, gl.canvas.clientHeight/2, 0, 600);
      mat4.translate(mvp, mvp, [0,0,-100]);
      mat4.rotateX(mvp, mvp, rotation[0]);
      mat4.rotateY(mvp, mvp, rotation[1]);
      mat4.rotateZ(mvp, mvp, rotation[2]);
    
      // Set the matrix.
      gl.uniformMatrix4fv(matrixUniformLocation, false, mvp);
      if(vaoSelect == 0){
        gl.useProgram(program);
        gl.bindVertexArray(vao)
        gl.uniformMatrix4fv(matrixUniformLocation, false, mvp)
      } else {

      }
        
      // Draw the geometry.
      var primitiveType = gl.TRIANGLES;
      var offset = 0;
      var count = (geoArray.length / 6);  //triangle count
      gl.drawArrays(primitiveType, offset, count);

      requestAnimationFrame(drawScene)

    }

    return canvas;
    
}



document.body.appendChild( app( ) );


function updateClearColor(...color){
  clearColor = color;
}

function keyCheck(evt){
  switch(evt.keyCode){
    case 49:{
      //updateClearColor(Math.random(), Math.random(), Math.random(), 1.0);
      clearColor = getRandomColorAsArray();
      break;
    }
    case 50:{
      vaoSelect = (vaoSelect == 0) ? 1 : 0;
      break;
    }
  }
}

function getRectPrism(w, h, d){ 
  const halfWidth = w/2;
  const halfHeight = h/2;
  const halfDepth = d/2;
  const ftl = [-halfWidth,halfHeight,halfDepth];
  const ftr = [halfWidth,halfHeight,halfDepth];
  const fbr = [halfWidth,-halfHeight,halfDepth];
  const fbl = [-halfWidth,-halfHeight,halfDepth];
  const btl = [-halfWidth,halfHeight,-halfDepth];
  const btr = [halfWidth,halfHeight,-halfDepth];
  const bbr = [halfWidth,-halfHeight,-halfDepth];
  const bbl = [-halfWidth,-halfHeight,-halfDepth];

  const red = [1,0,0];
  const blue = [0,0,1];
  const green = [0,1,0];
  const orange = [1,0.5,0];
  const purple = [1,0,1];
  const yellow = [1,1,0];

  const newArray = new Float32Array([
    //front
    ...ftl, ...red,
    ...ftr,  ...red,
    ...fbr,  ...red,
    ...fbr, ...red,
    ...fbl, ...red,
    ...ftl, ...red,
    //back
    ...btl, ...green,
    ...btr, ...green,
    ...bbr, ...green,
    ...bbr, ...green,
    ...bbl, ...green,
    ...btl, ...green,
    //left
    ...btl, ...purple,
    ...ftl, ...purple,
    ...fbl, ...purple,
    ...fbl, ...purple,
    ...bbl, ...purple,
    ...btl, ...purple,
    //right
    ...btr, ...yellow,
    ...bbr, ...yellow,
    ...fbr, ...yellow,
    ...fbr, ...yellow,
    ...ftr, ...yellow,
    ...btr, ...yellow,
  ])


  return newArray

}

