// Общи настройки на сцената
function sceneInit()
{
	vaxInit();
	
	// включваме сенки
	renderer.shadowMap.enabled = true;
				
	// фиксирана гледна точка
	camera.position.set( 0, 100, 150 );
	camera.lookAt( new THREE.Vector3(0,20,0) );

	// наличната светлина я правим по-слаба
	light.intensity = 0.75;
	
	// околна светлина за по-бледи сенки
	ambientLight = new THREE.AmbientLight('gold',0.25);
	scene.add( ambientLight );
	
	// прожекторна светлина за сенки
	spotLight = new THREE.SpotLight('white',0.5,0,1.0,1.0);
	spotLight.shadow.mapSize = new THREE.Vector2( 1024*2, 1024*2 );
	spotLight.position.set( 0, 100, 10 );
	spotLight.target = new THREE.Object3D();
	spotLight.castShadow = true;
	scene.add( spotLight );
	scene.add( spotLight.target );
}



// Създаване на обектите в сцената
function sceneObjects()
{
	// земя
	ground = new THREE.Mesh(
		new THREE.BoxBufferGeometry(200,4,50),
		new THREE.MeshPhongMaterial({color:'gold'})
	);
	ground.position.set( 0, -2, 0 );
	ground.receiveShadow = true;
	scene.add( ground );

	// обект
	p = new THREE.Mesh(
		new THREE.IcosahedronBufferGeometry(2,2),
		new THREE.MeshPhongMaterial({color:'dodgerblue',shininess:100})
	);
	p.scale.z = 5;
	p.castShadow = true;
	scene.add( p );
}