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
