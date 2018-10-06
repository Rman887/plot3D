var vertexShaderSource = `#version 300 es
in vec4 a_position;

void main() {
	gl_Position = a_position;
}
`

void fragmentShaderSource = `#version 300 es
precision mediump float;

out vec4 outColor;

void main() {
	outColor = vec4(1, 0, 0.5, 1);
}
`

function Application(canvas, gl) {
	this.canvas = canvas;
	this.gl = gl;

	this.util = new Util();

	this.positions = [
		0, 0,
		0, 0.5,
		0.7, 0
	]

	this.setup = function() {
		var vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		var fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		var program = util.createProgram(gl, vertexShader, fragmentShader);
	}

	this.update = function() {

	}

	this.render = function() {

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
}
