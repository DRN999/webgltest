
var VSHADER_SOURCE = document.getElementById("vertex-shader").text;// Vertex Shader
var FSHADER_SOURCE = document.getElementById("fragment-shader").text;// Fragment Shader
var VSHADER_SOURCE_TEXTURE = document.getElementById("vertex-shader-texture").text;// Vertex Shader
var FSHADER_SOURCE_TEXTURE = document.getElementById("fragment-shader-texture").text;// Fragment Shader
var canvas = document.getElementById('webgl'); // canvas
var gl = WebGLUtils.setupWebGL(canvas,{preserveDrawingBuffer: true}, {premultipliedAlpha: false});
var program = new Array();
var imageLoaded = new Array(20);
var textures = new Array();


function main()
{
	initShaders();
	if(!gl)
	{
		console.log("failed to load context");
		return -1;
	}
	
	initImages("../resources/blue.jpg", 0);
	imageLoaded[0] = false;

	gl.clearColor(1,1,1,1);
	gl.enable(gl.DEPTH_TEST);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var tick = function()
	{// animation tick
		drawThings();
		if(imageLoadedCheck())
			drawThingsTexture();
		requestAnimationFrame(tick, canvas);					
	}// End tick()
	tick();
}

function initImages(name, index)
{
	textures.push(gl.createTexture());
	var image = new Image();
	image.onload = function()
	{
		console.log("loaded");
		imageLoaded[index] = true;
		handleTextureLoaded(image, textures[index], index);
		gl.activeTexture(gl.TEXTURE0 + index);
		gl.bindTexture(gl.TEXTURE_2D, textures[index]);
		gl.useProgram(program[1]);
		gl.program = program[1];
		var u_Texture = gl.getUniformLocation(gl.program, "u_Texture");
		gl.uniform1i(u_Texture, 0);
	}
	image.crossOrigin = "";
	image.src = name;
	console.log(image);
}

function handleTextureLoaded(image, texture, index)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	if(isPowerOf2(image.width) && isPowerOf2(image.height))
	{
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
	}
	
}

function isPowerOf2(value) 
{
	return (value & (value - 1)) == 0;
}

function imageLoadedCheck()
{
	
	for(var i = 0; i < imageLoaded.length; i++)
	{
		if(!imageLoaded[i] && typeof imageLoaded[i] !== "undefined")
		{
			return false;
		}
	}
	console.log("return true");
	return true;
}

function initShaders()
{
	program.push(createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE));
	program.push(createProgram(gl, VSHADER_SOURCE_TEXTURE, FSHADER_SOURCE_TEXTURE));
}

function drawThings()
{

	gl.useProgram(program[0]);
	gl.program = program[0];

	var vertices = 	[	
						-100, 100, 0,
						-100, -100, 0,
						100, 100, 0,
						100, -100, 0
					];
	var colors =	[
						1, 0, 0, 1,
						1, 0, 0, 1,
						1, 0, 0, 1,
						1, 0, 0, 1
					];
	var indices =	[
						0, 1, 2,
						1, 3, 2
					];
	
	var f_vertices = new Float32Array(vertices); 
	var f_colors = new Float32Array(colors);
	var u_indices = new Uint16Array(indices);
	var mvpMatrix = new Matrix4();
	var vertex_buffer = gl.createBuffer();
	var index_buffer = gl.createBuffer();
	var color_buffer = gl.createBuffer();
	
	var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	
	mvpMatrix.setOrtho
	(
		-250, 250,
		-250, 250,
		-250, 250
	);
	
	if(!vertex_buffer || ! index_buffer || !color_buffer)
	{// check if both buffer created succesfully 
		console.log("failed to create buffer");
		return -1;
	}
				
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

	init_array_buffer(vertex_buffer, 3, "a_Position", f_vertices, gl.program);
	init_array_buffer(color_buffer, 4, "a_Colors", f_colors, gl.program);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, u_indices, gl.STATIC_DRAW);
	
	gl.drawElements(gl.TRIANGLES, u_indices.length, gl.UNSIGNED_SHORT, 0); 	
}

function drawThingsTexture()
{
	gl.useProgram(program[1]);
	gl.program = program[1];
	var vertices = 	[	
						-300, 100, 0,
						-300, -100, 0,
						-100, 100, 0,
						-100, -100, 0
					];
	var tex_coord =	[
						0, 0,
						0, 1,
						1, 0,
						1, 1	
					];
	var indices =	[
						0, 1, 2,
						1, 3, 2
					];
					
					
	
	var f_vertices = new Float32Array(vertices);
	var f_tex_coord = new Float32Array(tex_coord);
	var u_indices = new Uint16Array(indices);
	
	var mvpMatrix = new Matrix4();
	var vertex_buffer = gl.createBuffer();
	var index_buffer = gl.createBuffer();
	var tex_buffer = gl.createBuffer();
	
	var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
	
	mvpMatrix.setOrtho
	(
		-250, 250,
		-250, 250,
		-250, 250
	);
	
	if(!vertex_buffer || ! index_buffer || !tex_buffer)
	{// check if both buffer created succesfully 
		console.log("failed to create buffer");
		return -1;
	}
				
	gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
	//gl.activeTexture(gl.TEXTURE0);
	//gl.bindTexture(gl.TEXTURE_2D, textures[0]);
	init_array_buffer(vertex_buffer, 3, "a_Position", f_vertices, gl.program);
	init_array_buffer(tex_buffer, 2, "a_Texcoord", f_tex_coord, gl.program);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, u_indices, gl.STATIC_DRAW);
	
	gl.drawElements(gl.TRIANGLES, u_indices.length, gl.UNSIGNED_SHORT, 0);
		
}



function init_array_buffer(buffer, vert, name, buffer_element, program)
{// init array buttons  **does not work for element array buffer

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, buffer_element, gl.STATIC_DRAW);
	var attribute = gl.getAttribLocation(program, name);
	if(attribute < 0)
	{
		console.log("failed to load attribute");
		return -1;
	}
	gl.vertexAttribPointer(attribute, vert, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(attribute);

}// End init_array_buffer