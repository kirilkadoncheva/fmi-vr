var renderer, scene, camera, light, clock, t, animate;

function vaxInit()
{
	if ( !THREE.WEBGL.isWebGLAvailable() )
		alert( THREE.WEBGL.getWebGLErrorMessage() );
	
	renderer = new THREE.WebGLRenderer( {antialias:true} );
	document.body.appendChild( renderer.domElement );
	document.body.style.margin = 0;
	document.body.style.overflow = 'hidden';
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color('white');

	clock = new THREE.Clock(true);
	
	camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
	camera.position.set(0,0,100);
	camera.lookAt(new THREE.Vector3(0,0,0));
	
	light = new THREE.PointLight();
	light.position.set(0,150,300);
	scene.add( light );
	
	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();
	
	renderer.setAnimationLoop( frame );
}

function onWindowResize( event )
{
	camera.aspect = window.innerWidth/window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight, true );
}			

function frame( )
{
	t = clock.getElapsedTime();

	if (animate) animate();
	
	renderer.render( scene, camera );
}

function pillar(center, material)
{
	var height = center.y;
	center = new THREE.Vector3(center.x,0,center.z);
	
	var spline = new THREE.QuadraticBezierCurve( 
		new THREE.Vector3(Math.max(1+height/1.5,10),0,0),
		new THREE.Vector3(-3,0,0),
		new THREE.Vector3(4,height-4,0)
		);
	var points = [];
	for ( var i = 0; i <= 32; i ++ )
	{
		var p = spline.getPoint(i/32);
		points.push( new THREE.Vector2(p.x,p.y) );
	}

	var spline = new THREE.CubicBezierCurve( 
		new THREE.Vector3(4,height-4,0),
		new THREE.Vector3(4+6*4/(height-4),height,0),
		new THREE.Vector3(6,height+5,0),
		new THREE.Vector3(0.01,height+5,0) );
	for ( var i = 0+1; i <= 10; i ++ )
	{
		var p = spline.getPoint(i/10);
		points.push( new THREE.Vector2(p.x,p.y) );
	}

	var pillar = new THREE.Mesh(
		new THREE.LatheBufferGeometry(points,20),
		material
	);
	pillar.castShadow = true;
	pillar.receiveShadow = true;
	pillar.position.copy( center );	
	
	return pillar;
}



// елемент на робот
var robotMaterial = new THREE.MeshPhongMaterial( {color: 'crimson', shininess: 100} );
	
// клас за елемент на робот
function robotElement( sizeX, sizeY, sizeZ, parent )
{
	var robotGeometry = new THREE.CylinderBufferGeometry( 0.4, 1, 1 );
	robotGeometry.scale( sizeX, sizeY, sizeZ );
	robotGeometry.translate( 0, sizeY/2, 0 );
	
	var object = new THREE.Mesh( robotGeometry, robotMaterial );
	object.length = sizeY;
	object.castShadow = true;
		
	// ако има родител, регистрира елемента като негов подобект
	if( parent )
	{
		object.position.set( 0, parent.length, 0 );
		parent.add( object );
	}
	
	return object;
}
	
// клас за елемент на робот
function robotElementShape( geometry, length, parent )
{
	var object = new THREE.Mesh( geometry, robotMaterial );
	object.length = length;
	object.castShadow = true;
		
	// ако има родител, регистрира елемента като негов подобект
	if( parent )
	{
		object.position.set( 0, parent.length, 0 );
		parent.add( object );
	}
	
	return object;
}
