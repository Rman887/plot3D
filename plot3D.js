var vertexShaderSource = `in vec4 a_position;

void main() {
	gl_Position = a_position;
}
`

var fragmentShaderSource = `precision mediump float;

out vec4 outColor;

void main() {
	gl_fragColor = vec4(1, 0, 0.5, 1);
}
`

function Application(canvas, gl) {
	this.canvas = canvas;
	this.gl = gl;

	this.util = new Util();
	this.program;

	this.positions = [
		0, 0,
		0, 0.5,
		0.7, 0
	]
	this.positionBuffer;
	this.positionAttributeLocation;
	this.vao;

	this.setup = function() {
		var vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		var fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		this.program = util.createProgram(gl, vertexShader, fragmentShader);

		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		this.positionAttributeLocation = gl.getAttribLocation(program, "a_position");

		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

		webglUtils.resizeCanvasToDisplaySize(gl.canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	}

	this.update = function() {

	}

	this.render = function() {
		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		gl.useProgram(this.program);
		gl.enableVertexAttribArray(positionAttributeLocation);


		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);

		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 2;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(
		    positionAttributeLocation, size, type, normalize, stride, offset);

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 3;
		gl.drawArrays(primitiveType, offset, count);
	}
}

function start() {
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl2");
	if (!gl) {
		console.log("WebGL2 not available, using WebGL1")
		gl = canvas.getContext("webgl");

		if (!gl) {
			console.log("WebGL1 not available");
			canvas.innerHTML = "WebGL not available";
		}
	}

	var app = new Application(canvas, gl);
	app.setup();

	app.update();
	app.render();
}

function Util() {
    this.createShader = function(gl, type, source) {
    	var shader = gl.createShader(type);
    	gl.shaderSource(shader, source);
    	gl.compileShader(shader);

    	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    	if (!success) {
    		console.log(gl.getShaderInfoLog(shader));
    		gl.deleteShader(shader);
    		return null;
    	}

    	return shader;
    }

    this.createProgram = function(gl, vertexShader, fragmentShader) {
    	var program = gl.createProgram();
    	gl.attachShader(program, vertexShader);
    	gl.attachShader(program, fragmentShader);
    	gl.linkProgram(program);

    	var success = gl.getProgramParameter(program, gl.LINK_STATUS)
    	if (!success) {
    		console.log(gl.getProgramInfoLog(program));
    		gl.deleteProgram(program);
    	}

    	return program;
    }
}
