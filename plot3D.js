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

	this.translation = [-150, 0, -360];
	this.rotation = [this.util.degToRad(190), this.util.degToRad(40), this.util.degToRad(320)];
	this.scale = [1, 1, 1];

	this.cameraZ = 100;
	this.cameraAngleRadians = this.util.degToRad(0);
	this.fieldOfViewRadians = this.util.degToRad(60);

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
	}

	this.update = function(delta) {
		//this.scale[0] += delta * 1.1;
		//this.scale[1] += delta * 1.1;
		//this.scale[1] += delta * 1.1;
		//this.translation[0] += delta * 2;
		//this.translation[2] -= delta;
		//this.rotation[1] += 3.14 * 1/360 * delta;
		//this.rotation[1] %= 6.28;
		//this.cameraAngleRadians += this.util.degToRad(delta);
		this.cameraZ += delta;
	}

	this.render = function() {
		this.util.resize(canvas);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Clear the canvas
		gl.clearColor(0, 0, 0, 0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Turn on culling. By default backfacing triangles
	    // will be culled.
	    //gl.enable(gl.CULL_FACE);

	    // Enable the depth buffer
	    gl.enable(gl.DEPTH_TEST);

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

		var cameraMatrix = this.util.m4.yRotation(this.cameraAngleRadians);
	    cameraMatrix = this.util.m4.translate(cameraMatrix, 0, 0, this.cameraZ);

		// Get the camera's postion from the matrix we computed
		var cameraPosition = [
		  cameraMatrix[12],
		  cameraMatrix[13],
		  cameraMatrix[14],
		];

    	var up = [0, 1, 0];

		// Compute the camera's matrix using look at.
		var cameraMatrix = this.util.m4.lookAt(cameraPosition, [0, 0, 0], up);

		// Make a view matrix from the camera matrix
		var viewMatrix = this.util.m4.inverse(cameraMatrix);

		var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	    var zNear = 1;
	    var zFar = 2000;
	    var projectionMatrix = this.util.m4.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

		// Compute a view projection matrix
		var viewProjectionMatrix = this.util.m4.multiply(projectionMatrix, viewMatrix);
		var matrix = this.util.m4.translate(viewProjectionMatrix, this.translation[0], this.translation[1], this.translation[2]);
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
		this.radToDeg = function(r) {
			return r * 180 / Math.PI;
		}

		this.degToRad = function(d) {
			return d * Math.PI / 180;
		}

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
			perspective: function(fieldOfViewInRadians, aspect, near, far) {
				var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
				var rangeInv = 1.0 / (near - far);

				return [
					f / aspect, 0, 0, 0,
					0, f, 0, 0,
					0, 0, (near + far) * rangeInv, -1,
					0, 0, near * far * rangeInv * 2, 0
				];
			},

			cross: function(a, b) {
				return [a[1] * b[2] - a[2] * b[1],
						a[2] * b[0] - a[0] * b[2],
						a[0] * b[1] - a[1] * b[0]];
			},
			subtractVectors: function(a, b) {
			  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
			},
			normalize: function(v) {
				var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
				// make sure we don't divide by 0.
				if (length > 0.00001) {
					return [v[0] / length, v[1] / length, v[2] / length];
				} else {
					return [0, 0, 0];
				}
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

			lookAt: function(cameraPosition, target, up) {
				var zAxis = this.normalize(this.subtractVectors(cameraPosition, target));
				var xAxis = this.cross(up, zAxis);
				var yAxis = this.cross(zAxis, xAxis);

				return [
					xAxis[0], xAxis[1], xAxis[2], 0,
					yAxis[0], yAxis[1], yAxis[2], 0,
					zAxis[0], zAxis[1], zAxis[2], 0,
					cameraPosition[0],
					cameraPosition[1],
					cameraPosition[2],
					1,
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
			},

			inverse: function(m) {
				var m00 = m[0 * 4 + 0];
				var m01 = m[0 * 4 + 1];
				var m02 = m[0 * 4 + 2];
				var m03 = m[0 * 4 + 3];
				var m10 = m[1 * 4 + 0];
				var m11 = m[1 * 4 + 1];
				var m12 = m[1 * 4 + 2];
				var m13 = m[1 * 4 + 3];
				var m20 = m[2 * 4 + 0];
				var m21 = m[2 * 4 + 1];
				var m22 = m[2 * 4 + 2];
				var m23 = m[2 * 4 + 3];
				var m30 = m[3 * 4 + 0];
				var m31 = m[3 * 4 + 1];
				var m32 = m[3 * 4 + 2];
				var m33 = m[3 * 4 + 3];
				var tmp_0  = m22 * m33;
				var tmp_1  = m32 * m23;
				var tmp_2  = m12 * m33;
				var tmp_3  = m32 * m13;
				var tmp_4  = m12 * m23;
				var tmp_5  = m22 * m13;
				var tmp_6  = m02 * m33;
				var tmp_7  = m32 * m03;
				var tmp_8  = m02 * m23;
				var tmp_9  = m22 * m03;
				var tmp_10 = m02 * m13;
				var tmp_11 = m12 * m03;
				var tmp_12 = m20 * m31;
				var tmp_13 = m30 * m21;
				var tmp_14 = m10 * m31;
				var tmp_15 = m30 * m11;
				var tmp_16 = m10 * m21;
				var tmp_17 = m20 * m11;
				var tmp_18 = m00 * m31;
				var tmp_19 = m30 * m01;
				var tmp_20 = m00 * m21;
				var tmp_21 = m20 * m01;
				var tmp_22 = m00 * m11;
				var tmp_23 = m10 * m01;

				var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
				(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
				var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
				(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
				var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
				(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
				var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
				(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

				var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

				return [
					d * t0,
					d * t1,
					d * t2,
					d * t3,
					d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
					    (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
					d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
					    (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
					d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
					    (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
					d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
					    (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
					d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
					    (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
					d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
					    (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
					d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
					    (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
					d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
					    (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
					d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
					    (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
					d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
					    (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
					d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
					    (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
					d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
					    (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
				];
			},

			vectorMultiply: function(v, m) {
			  var dst = [];
			  for (var i = 0; i < 4; ++i) {
				dst[i] = 0.0;
				for (var j = 0; j < 4; ++j)
				  dst[i] += v[j] * m[j * 4 + i];
			  }
			  return dst;
			},
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
