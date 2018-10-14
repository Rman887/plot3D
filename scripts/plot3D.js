require(["util"], function(util) {
	var vertexShaderSource = document.getElementById("object-vs").text;
	var fragmentShaderSource = document.getElementById("object-fs").text;

	this.Application = function(canvas, gl) {
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
		this.rotation = [util.degToRad(0), util.degToRad(0), util.degToRad(180)];
		this.scale = [1, 1, 1];

		this.cameraPos = [0, 0, 50];
		this.cameraFront = [0, 0, -1];
		this.cameraUp = [0, 0, 1];
		this.cameraAngleRadians = util.degToRad(0);
		this.fieldOfViewRadians = util.degToRad(60);

		this.color = [Math.random(), Math.random(), Math.random(), 1];

		this.positionBuffer;
		this.positionAttributeLocation;

		this.colorLocation;
		this.matrixLocation;
		this.positionAttributeLocation;

		this.setup = function() {
			var vertexShader = util.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
			var fragmentShader = util.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
			this.program = util.createProgram(gl, vertexShader, fragmentShader);

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
			//this.cameraAngleRadians += util.degToRad(delta);
		}

		this.render = function() {
			util.resize(canvas);
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

			// Compute the camera's matrix using look at.
			var cameraMatrix = util.m4.lookAt(this.cameraPos, [0, 0, 0], this.cameraUp);

			// Make a view matrix from the camera matrix
			var viewMatrix = util.m4.inverse(cameraMatrix);

			var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		    var zNear = 1;
		    var zFar = 2000;
		    var projectionMatrix = util.m4.perspective(this.fieldOfViewRadians, aspect, zNear, zFar);

			// Compute a view projection matrix
			var viewProjectionMatrix = util.m4.multiply(projectionMatrix, viewMatrix);
			var matrix = util.m4.translate(viewProjectionMatrix, this.translation[0], this.translation[1], this.translation[2]);
			matrix = util.m4.xRotate(matrix, this.rotation[0]);
			matrix = util.m4.yRotate(matrix, this.rotation[1]);
			matrix = util.m4.zRotate(matrix, this.rotation[2]);
			matrix = util.m4.scale(matrix, this.scale[0], this.scale[1], this.scale[2]);

			gl.uniformMatrix4fv(this.matrixLocation, false, matrix);

			var primitiveType = gl.TRIANGLES;
			var offset = 0;
			var count = 16 * 6;
			gl.drawArrays(primitiveType, offset, count);
		}

		this.translateCamera = function(dx, dy, dz) {
			this.cameraPos[0] += dx;
			this.cameraPos[1] += dy;
			this.cameraPos[2] += dz;
		}
	}

	var app;
	var lastRender;
	var targetFPS = 60;

	this.run = function(timestamp) {
		var progress = timestamp - lastRender;
		var delta = progress / (1000.0 / targetFPS);
		app.update(delta);
		app.render();
		lastRender = timestamp;
		window.requestAnimationFrame(run);
	}

	this.start = function() {
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

	this.keydown = function(e) {
		var code = e.keyCode;
		switch (code) {
			case 65: app.translateCamera(-1, 0, 0); break; //Left key
			case 87: app.translateCamera(0, 1, 0); break; //Up key
			case 68: app.translateCamera(1, 0, 0); break; //Right key
			case 83: app.translateCamera(0, -1, 0); break; //Down key
			default: console.log(code); //Everything else
		}
	}

	window.addEventListener('keydown', this.keydown, false);

	start();
});
