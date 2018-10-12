var vertexShaderSource = document.getElementById("object-vs").text;
var fragmentShaderSource = document.getElementById("object-fs").text;

function Application(canvas, gl) {
	this.util = new Util();
	this.program;

	this.positions = [0,   0,  0,
           30,   0,  0,
            0, 150,  0,
            0, 150,  0,
           30,   0,  0,
           30, 150,  0,

          // top rung front
           30,   0,  0,
          100,   0,  0,
           30,  30,  0,
           30,  30,  0,
          100,   0,  0,
          100,  30,  0,

          // middle rung front
           30,  60,  0,
           67,  60,  0,
           30,  90,  0,
           30,  90,  0,
           67,  60,  0,
           67,  90,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   30,  30,
          30,   60,  30,
          30,   30,   0,
          30,   60,  30,
          30,   60,   0,

          // top of middle rung
          30,   60,   0,
          30,   60,  30,
          67,   60,  30,
          30,   60,   0,
          67,   60,  30,
          67,   60,   0,

          // right of middle rung
          67,   60,   0,
          67,   60,  30,
          67,   90,  30,
          67,   60,   0,
          67,   90,  30,
          67,   90,   0,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,   90,  30,
          30,  150,  30,
          30,   90,   0,
          30,  150,  30,
          30,  150,   0,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0];
	this.translation = [45, 150, 1];
	this.rotation = [3.14/180 * 120, 3.14/180 * 120, 3.14/180 * 0];
	this.rotation = [0, 0, 0];
	this.scale = [1, 1, 1];
	this.color = [Math.random(), Math.random(), Math.random(), 1];

	this.positionBuffer;
	this.positionAttributeLocation;

	this.colorLocation;
	this.matrixLocation;
	this.positionAttributeLocation;

	this.setup = function() {
		var vertexShader = this.util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
		var fragmentShader = this.util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
		this.program = this.util.createProgram(gl, vertexShader, fragmentShader);

		this.colorLocation = gl.getUniformLocation(this.program, "u_color");
		this.matrixLocation = gl.getUniformLocation(this.program, "u_matrix");
		this.positionAttributeLocation = gl.getAttribLocation(this.program, "a_position");

		this.positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);

		gl.enable(gl.DEPTH_TEST);
	}

	this.update = function(delta) {
		//this.scale[0] += delta * 1.1;
		//this.scale[1] += delta * 1.1;
		//this.scale[1] += delta * 1.1;
		//this.translation[0] = 150;
		//this.translation[2] -= delta;
		//this.rotation[1] += 3.14 * 1/360 * delta;
		//this.rotation[1] %= 6.28;
	}

	this.render = function() {
		this.util.resize(canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.useProgram(this.program);
		gl.enableVertexAttribArray(this.positionAttributeLocation);

		// Bind the position buffer.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 3;          // 2 components per iteration
		var type = gl.FLOAT;   // the data is 32bit floats
		var normalize = false; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

		gl.uniform4fv(this.colorLocation, this.color);

		var matrix = this.util.m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
		matrix = this.util.m4.translate(matrix, this.translation[0], this.translation[1], this.translation[2]);
		matrix = this.util.m4.xRotate(matrix, this.rotation[0]);
		matrix = this.util.m4.yRotate(matrix, this.rotation[1]);
		matrix = this.util.m4.zRotate(matrix, this.rotation[2]);
		matrix = this.util.m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);

		gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

		var primitiveType = gl.TRIANGLES;
		var offset = 0;
		var count = 16 * 6;
		gl.drawArrays(primitiveType, offset, count);
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

		this.resize = function(canvas) {
			var cssToRealPixels = window.devicePixelRatio || 1;

			var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
			var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

			if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;
			}
		}

		this.m4 = {
			projection: function(width, height, depth) {
				// Note: This matrix flips the Y axis so 0 is at the top.
				return [
					2 / width, 0, 0, 0,
					0, -2 / height, 0, 0,
					0, 0, 2 / depth, 0,
					-1, 1, 0, 1,
				];
			},
			multiply: function(a, b) {
				var a00 = a[0 * 4 + 0];
				var a01 = a[0 * 4 + 1];
				var a02 = a[0 * 4 + 2];
				var a03 = a[0 * 4 + 3];
				var a10 = a[1 * 4 + 0];
				var a11 = a[1 * 4 + 1];
				var a12 = a[1 * 4 + 2];
				var a13 = a[1 * 4 + 3];
				var a20 = a[2 * 4 + 0];
				var a21 = a[2 * 4 + 1];
				var a22 = a[2 * 4 + 2];
				var a23 = a[2 * 4 + 3];
				var a30 = a[3 * 4 + 0];
				var a31 = a[3 * 4 + 1];
				var a32 = a[3 * 4 + 2];
				var a33 = a[3 * 4 + 3];
				var b00 = b[0 * 4 + 0];
				var b01 = b[0 * 4 + 1];
				var b02 = b[0 * 4 + 2];
				var b03 = b[0 * 4 + 3];
				var b10 = b[1 * 4 + 0];
				var b11 = b[1 * 4 + 1];
				var b12 = b[1 * 4 + 2];
				var b13 = b[1 * 4 + 3];
				var b20 = b[2 * 4 + 0];
				var b21 = b[2 * 4 + 1];
				var b22 = b[2 * 4 + 2];
				var b23 = b[2 * 4 + 3];
				var b30 = b[3 * 4 + 0];
				var b31 = b[3 * 4 + 1];
				var b32 = b[3 * 4 + 2];
				var b33 = b[3 * 4 + 3];
				return [
					b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
					b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
					b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
					b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
					b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
					b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
					b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
					b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
					b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
					b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
					b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
					b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
					b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
					b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
					b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
					b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
				];
			},

			translation: function(tx, ty, tz) {
				return [
					1,  0,  0,  0,
					0,  1,  0,  0,
					0,  0,  1,  0,
					tx, ty, tz, 1,
				];
			},

			xRotation: function(angleInRadians) {
				var c = Math.cos(angleInRadians);
				var s = Math.sin(angleInRadians);

				return [
					1, 0, 0, 0,
					0, c, s, 0,
					0, -s, c, 0,
					0, 0, 0, 1,
				];
			},

			yRotation: function(angleInRadians) {
				var c = Math.cos(angleInRadians);
				var s = Math.sin(angleInRadians);

				return [
					c, 0, -s, 0,
					0, 1, 0, 0,
					s, 0, c, 0,
					0, 0, 0, 1,
				];
			},

			zRotation: function(angleInRadians) {
				var c = Math.cos(angleInRadians);
				var s = Math.sin(angleInRadians);

				return [
					c, s, 0, 0,
					-s, c, 0, 0,
					0, 0, 1, 0,
					0, 0, 0, 1,
				];
			},

			scaling: function(sx, sy, sz) {
				return [
					sx, 0,  0,  0,
					0, sy,  0,  0,
					0,  0, sz,  0,
					0,  0,  0,  1,
				];
			},

			translate: function(m, tx, ty, tz) {
				return this.multiply(m, this.translation(tx, ty, tz));
			},

			xRotate: function(m, angleInRadians) {
				return this.multiply(m, this.xRotation(angleInRadians));
			},

			yRotate: function(m, angleInRadians) {
				return this.multiply(m, this.yRotation(angleInRadians));
			},

			zRotate: function(m, angleInRadians) {
				return this.multiply(m, this.zRotation(angleInRadians));
			},

			scale: function(m, sx, sy, sz) {
				return this.multiply(m, this.scaling(sx, sy, sz));
			}
		};
	}
}

var app;
var lastRender;
var targetFPS = 60;

function run(timestamp) {
	var progress = timestamp - lastRender;
	var delta = progress / (1000.0 / targetFPS);
	app.update(delta);
	app.render();
	lastRender = timestamp;
	window.requestAnimationFrame(run);
}

function start() {
	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext("webgl");
	if (!gl) {
		console.log("WebGL1 not available");
		canvas.innerHTML = "WebGL not available";
	}

	app = new Application(canvas, gl);
	app.setup();

	lastRender = 0;
	window.requestAnimationFrame(run);
}
