var vertexShaderSource = document.getElementById("object-vs").text;
var fragmentShaderSource = document.getElementById("object-fs").text;

function Application(canvas, gl) {
	this.util = new Util();
	this.program;

	this.positions = [
		// left column
		0,   0,  0,
		30,   0,  0,
		0, 150,  0,
		0, 150,  0,
		30,   0,  0,
		30, 150,  0,

		// top rung
		30,   0,  0,
		100,   0,  0,
		30,  30,  0,
		30,  30,  0,
		100,   0,  0,
		100,  30,  0,

		// middle rung
		30,  60,  0,
		67,  60,  0,
		30,  90,  0,
		30,  90,  0,
		67,  60,  0,
		67,  90,  0]
		this.positionBuffer;
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
		}

		this.update = function() {
			this.translation = [45, 150, 0];
			this.rotation = [3.14 * 2/9, 3.14 * 1/6, 3.14 * 5/6];
			this.scale = [1, 1, 1];
			this.color = [Math.random(), Math.random(), Math.random(), 1];
		}

		this.render = function() {
			this.util.resize(canvas);
			gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

			// Clear the canvas
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);

			gl.useProgram(this.program);
			gl.enableVertexAttribArray(this.positionAttributeLocation);


			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 3;
			gl.drawArrays(primitiveType, offset, count);

			// Bind the position buffer.
			gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

			// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
			var size = 3;          // 2 components per iteration
			var type = gl.FLOAT;   // the data is 32bit floats
			var normalize = false; // don't normalize the data
			var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
			var offset = 0;        // start at the beginning of the buffer
			gl.vertexAttribPointer(this.positionAttributeLocation, size, type, normalize, stride, offset);

			gl.uniform4fv(colorLocation, color);

			var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
			matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
			matrix = m4.xRotate(matrix, rotation[0]);
			matrix = m4.yRotate(matrix, rotation[1]);
			matrix = m4.zRotate(matrix, rotation[2]);
			matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

			gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

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

		this.resize = function(canvas) {
			var cssToRealPixels = window.devicePixelRatio || 1;

			var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
			var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

			if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
				canvas.width = displayWidth;
				canvas.height = displayHeight;
			}
		}

		var m4 = {
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
				return m4.multiply(m, m4.translation(tx, ty, tz));
			},

			xRotate: function(m, angleInRadians) {
				return m4.multiply(m, m4.xRotation(angleInRadians));
			},

			yRotate: function(m, angleInRadians) {
				return m4.multiply(m, m4.yRotation(angleInRadians));
			},

			zRotate: function(m, angleInRadians) {
				return m4.multiply(m, m4.zRotation(angleInRadians));
			},

			scale: function(m, sx, sy, sz) {
				return m4.multiply(m, m4.scaling(sx, sy, sz));
			}
		};
	}
