/*
 * Copyright 2021, GFXFundamentals.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of GFXFundamentals. nor the names of his
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
// structure of this has been altered, so don't blame the above if it looks ugly.

function createShader(gl, type, shaderText){
    let shader = gl.createShader(type);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if( !success ){
        const lastError =  gl.getShaderInfoLog(shader)
        console.log(`WARNING: ${type} did not compile`)
        console.log( `${lastError} \n ${shaderText}` )
        gl.deleteShader(shader) 
        shader = null;       
    } 

    return shader
}

function linkProgram(gl, vertexShader, fragmentShader){
    let prog = gl.createProgram();
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);

    const success = gl.getProgramParameter(prog, gl.LINK_STATUS)
    if( !success ){
        const lastError = gl.getProgramInfoLog(prog);
        console.log(`WARNING:  POGRAM did not compile`)
        console.log(`${lastError}`);
        gl.deleteProgram(prog)
        prog = null
    }

    return prog
}

function programFromShaderText(gl, vertexShaderText, fragmentShaderText){

    const vert = createShader( gl, gl.VERTEX_SHADER, vertexShaderText );
    const frag = createShader( gl, gl.FRAGMENT_SHADER, fragmentShaderText );

    let prog;
    if(vert != null && frag != null){
        prog = linkProgram(gl, vert, frag);
    } else {
        prog = null;
    }

    return prog;
}

//copied directly from webgl2 fundamentals - 
function resizeCanvasToDisplaySize(canvas, multiplier) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
      canvas.width  = width;
      canvas.height = height;
      return true;
    }
    return false;
}

export {createShader, linkProgram, programFromShaderText, resizeCanvasToDisplaySize}