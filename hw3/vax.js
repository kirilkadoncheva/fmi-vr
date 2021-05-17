/**
 * FMI VR/AR/XR Library
 * 2020-08-30
 * v 0.011
 *
 * vaxInit(opt)	инициализира на моно режим и поддържа
 *				анимационен цикъл с animate() -- проверява
 *				за наличието на Physijs
 *
 * vaxInitAnaglyph(eyeSep) инициализира на анаглифен режим и поддържа
 *				анимационен цикъл с animate()
 *
 * vaxInitParallax(eyeSep) инициализира на паралаксен режим и поддържа
 *				анимационен цикъл с animate()
 *
 * animate()	потребителска функция, която генерира нов
 *				кадър; извиква се автоматично
 *
 * t			променлива за изминалото време (в секунди)
 *				от стартирането на vax.js
 *
 * pillar(center, material) създава пилон с връх center,
 *              материал и стигащ до y=0
 *
 * robotMaterial - подразбиращ се материал за елемент на робот
 *
 * robotElement( sizeX, sizeY, sizeZ, parent ) създава елемент
 * 				на робот, свързан към ротителски елемент
 * 
 */

 var renderer, scene, camera, light, stats, clock, t, dT, animate, perspective = true;

 function vaxInit( rendererOptions = {antialias:true} )
 {
	 if ( !THREE.WEBGL.isWebGLAvailable() )
		 alert( THREE.WEBGL.getWebGLErrorMessage() );
	 
	 renderer = new THREE.WebGLRenderer( rendererOptions );
	 document.body.appendChild( renderer.domElement );
	 document.body.style.margin = 0;
	 document.body.style.overflow = 'hidden';
	 
	 if( typeof Stats !== 'undefined' )
	 {
		 stats = new Stats();
		 document.body.appendChild( stats.dom );
	 }
	 
	 if( typeof Physijs !== 'undefined' )
		 scene = new Physijs.Scene();
	 else
		 scene = new THREE.Scene();
	 
	 if( rendererOptions.alpha )
	 {
		 renderer.setClearColor( 0, 0 );
	 }
	 else
	 {
		 scene.background = new THREE.Color('white');
	 }
	 
	 clock = new THREE.Clock(true);
 
	 if(	perspective )
		 camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
	 else
		 camera = new THREE.OrthographicCamera( -window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, 1, 1000 );
	 camera.position.set(0,0,100);
	 camera.lookAt(new THREE.Vector3(0,0,0));
	 
	 light = new THREE.PointLight();
	 light.position.set(0,150,300);
	 scene.add( light );
	 
	 window.addEventListener( 'resize', onWindowResize, false );
	 onWindowResize();
	 
	 renderer.setAnimationLoop( frame );
 }
 
 function vaxInitAnaglyph( eyeSep = 1 )
 {
	 if ( !THREE.WEBGL.isWebGLAvailable() )
		 alert( THREE.WEBGL.getWebGLErrorMessage() );
	 
	 renderer = new THREE.WebGLRenderer( {antialias:true} );
	 document.body.appendChild( renderer.domElement );
	 document.body.style.margin = 0;
	 document.body.style.overflow = 'hidden';
	 
	 if( typeof Stats !== 'undefined' )
	 {
		 stats = new Stats();
		 document.body.appendChild( stats.dom );
	 }
	 
	 if( typeof Physijs !== 'undefined' )
		 scene = new Physijs.Scene();
	 else
		 scene = new THREE.Scene();
	 scene.background = new THREE.Color('white');
	 renderer.setClearColor( new THREE.Color('red') );
 
	 clock = new THREE.Clock(true);
 
	 camera = new THREE.PerspectiveCamera( 60, 1, 1, 10000 );
	 camera.focalLength = 30;
				 
	 camera.position.set(0,0,100);
	 camera.lookAt(new THREE.Vector3(0,0,0));
	 
	 light = new THREE.PointLight();
	 light.position.set(0,150,300);
	 scene.add( light );
 
	 effect = new THREE.AnaglyphEffect( renderer, eyeSep );
	 effect.setSize( window.innerWidth, window.innerHeight );
				 
				 
	 window.addEventListener( 'resize', onWindowResizeAnaglyph, false );
	 onWindowResizeAnaglyph();
	 
	 renderer.setAnimationLoop( frameAnaglyph );
 }
 
 function vaxInitParallax( eyeSep = 1 )
 {
	 if ( !THREE.WEBGL.isWebGLAvailable() )
		 alert( THREE.WEBGL.getWebGLErrorMessage() );
	 
	 renderer = new THREE.WebGLRenderer( {antialias:true} );
	 document.body.appendChild( renderer.domElement );
	 document.body.style.margin = 0;
	 document.body.style.overflow = 'hidden';
	 
	 if( typeof Stats !== 'undefined' )
	 {
		 stats = new Stats();
		 document.body.appendChild( stats.dom );
	 }
	 
	 if( typeof Physijs !== 'undefined' )
		 scene = new Physijs.Scene();
	 else
		 scene = new THREE.Scene();
	 scene.background = new THREE.Color('white');
	 renderer.setClearColor( new THREE.Color('red') );
 
	 clock = new THREE.Clock(true);
 
	 camera = new THREE.PerspectiveCamera( 60, 1, 1, 10000 );
	 camera.focalLength = 30;
				 
	 camera.position.set(0,0,100);
	 camera.lookAt(new THREE.Vector3(0,0,0));
	 
	 light = new THREE.PointLight();
	 light.position.set(0,150,300);
	 scene.add( light );
 
	 effect = new THREE.StereoEffect( renderer );
	 effect.setSize( window.innerWidth, window.innerHeight );
	 effect.setEyeSeparation( eyeSep );
				 
				 
	 window.addEventListener( 'resize', onWindowResizeAnaglyph, false ); // преизползваме анаглифния случай
	 onWindowResizeAnaglyph();
	 
	 renderer.setAnimationLoop( frameAnaglyph ); // преизползваме анаглифния случай
 }
 
 function onWindowResize( event )
 {
	 if(	perspective ) camera.aspect = window.innerWidth/window.innerHeight;
	 camera.updateProjectionMatrix();
 
	 renderer.setSize( window.innerWidth, window.innerHeight, true );
 }			
 
 function onWindowResizeAnaglyph( event )
 {
	 camera.aspect = window.innerWidth/window.innerHeight;
	 camera.updateProjectionMatrix();
 
	 effect.setSize( window.innerWidth, window.innerHeight, true );
 }			
 
 function frame( )
 {
	 dT = clock.getDelta();
	 t = clock.getElapsedTime();
 
	 if (animate) animate();
	 
	 if (stats) stats.update();
	 
	 renderer.render( scene, camera );
 }
 
 function frameAnaglyph( )
 {
	 dT = clock.getDelta();
	 t = clock.getElapsedTime();
 
	 if (animate) animate();
	 
	 if (stats) stats.update();
	 
	 effect.render( scene, camera );
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
 var robotMaterial = new THREE.MeshPhongMaterial( {color: 'tomato', shininess: 100} );
	 
 // клас за елемент на робот
 function robotElement( sizeX, sizeY, sizeZ, parent )
 {
	 var robotGeometry = new THREE.BoxBufferGeometry( sizeX, sizeY, sizeZ );
	 robotGeometry.translate( 0, sizeY/2, 0 );
	 
	 var object = new THREE.Mesh( robotGeometry, robotMaterial );
	 object.castShadow = true;
		 
	 // ако има родител, регистрира елемента като негов подобект
	 if( parent )
	 {
		 object.position.set( 0, parent.geometry.parameters.height, 0 );
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

var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);


THREE.StereoEffect = function (renderer) {

    var _stereo = new THREE.StereoCamera();
    _stereo.eyeSep = 2;
    _stereo.aspect = 0.5;
    var size = new THREE.Vector2();

    this.setEyeSeparation = function (eyeSep) {
        _stereo.eyeSep = eyeSep;
    };

    this.setSize = function (width, height) {
        renderer.setSize(width, height);
    };


    this.render = function (scene, camera) {
        scene.updateMatrixWorld();
        if (camera.parent === null) camera.updateMatrixWorld();
        _stereo.update(camera);
        renderer.getSize(size);
        if (renderer.autoClear) renderer.clear();
        renderer.setScissorTest(true);

        renderer.setScissor(0, 0, size.width / 2, size.height);
        renderer.setViewport(0, 0, size.width / 2, size.height);
        renderer.render(scene, _stereo.cameraL);

        renderer.setScissor(size.width / 2, 0, size.width / 2, size.height);
        renderer.setViewport(size.width / 2, 0, size.width / 2, size.height);
        renderer.render(scene, _stereo.cameraR);

        renderer.setScissorTest(false);
    };

};