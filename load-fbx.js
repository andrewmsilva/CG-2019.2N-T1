import * as THREE from './libs/js/three.js/build/three.module.js';
import Stats from './libs/js/three.js/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './libs/js/three.js/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './libs/js/three.js/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, mixer, light;

var clock = new THREE.Clock();
const KEYS = {
  ONE:49,
  TWO:50,
  THREE:51,
  FOUR:52,
}


init();
animate();

function init(){

  // Models structures
  var Jigglypuff = {
    name: 'Jigglypuff',
    rotation: {x:0,y:0,z:0},
    translation: {x:0,y:0,z:-70},
    fbx_path: './src/models/fbx/Jigglypuff/Jigglypuff.FBX',
    texture: './src/models/fbx/Jigglypuff/images/pm0039_00_Body1.png',
    music: './libs/audio/jigglypuff.mp3',
  }

  var Magikarp = {
    name: 'Magikarp',
    rotation: {x:0,y:0,z:0},
    translation: {x:200,y:5,z:-70},
    fbx_path: './src/models/fbx/Magikarp/MagikarpF.FBX',
    texture: './src/models/fbx/Magikarp/images/pm0129_00_Body1.png',
    music: './libs/audio/magikarp.mp3',
  }

  var Eevee = {
    name: 'Eevee',
    rotation: {x:0,y:3.14,z:0},
    translation: {x:-200,y:0,z:70},
    fbx_path: './src/models/fbx/Eevee/Eevee.FBX',
    texture: './src/models/fbx/Eevee/images/pm0133_00_Body1.png',
    music: './libs/audio/eevee.mp3',
  }

  var Charmander = {
    name: 'Charmander',
    rotation: {x:0,y:0,z:0},
    translation: {x:-300,y:0,z:-70},
    fbx_path: './src/models/fbx/Charmander/Charmander.FBX',
    texture: './src/models/fbx/Charmander/images/pm0004_00_Body1.png',
    music: './libs/audio/charmander.mp3',
  }

  var Arcanine = {
    name: 'Arcanine',
    rotation: {x:0,y:0,z:0},
    translation: {x:-200,y:0,z:-70},
    fbx_path: './src/models/fbx/Arcanine/Arcanine.FBX',
    texture: './src/models/fbx/Arcanine/images/pm0059_00_BodyA1.png',
  }


  // Render localization
  container = document.createElement('div');
  document.body.appendChild( container );
  //document.addEventListener('keydown', onDocumentKeyDown, false);

  // Camera ajusts
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 0, 200, 300 );

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xb3ecff );   // blue background
  light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  light.position.set( 0, 200, 0 );
  scene.add( light );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 200, 100 );
  light.castShadow = true;
  light.shadow.camera.top = 180;
  light.shadow.camera.bottom = - 100;
  light.shadow.camera.left = - 120;
  light.shadow.camera.right = 120;
  scene.add( light );

  // Create Ground
  var mesh = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry( 2000, 2000 ),
    new THREE.MeshPhongMaterial({
      color: 0x228B22,
      depthWrite: false 
    })
  );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
  
  // Load Models
  loadModel(Jigglypuff);
  loadModel(Magikarp);
  loadModel(Eevee);
  loadModel(Charmander);
  loadModel(Arcanine);

  // Audio
  var loader = new THREE.AudioLoader();
  loader.load('./libs/audio/magikarp.mp3',
      function ( audioBuffer ) {
          ambientSound.name = 'magikarp';
          ambientSound.setBuffer( audioBuffer );
          ambientSound.setVolume(0.5).setLoop(true);
          ambientSound.play();
      },
  );        
  var ambientSound = new THREE.Audio( new THREE.AudioListener() );
  scene.add( ambientSound );

  // Render Model
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;

  // Include model on Render localization
  container.appendChild( renderer.domElement);

  // Turn on the controls
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 100, 0 );
  controls.update();
}

// Function to run all render
function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    renderer.render( scene, camera );
    stats.update();
}

function loadModel(model){
  var loader = new FBXLoader();
  loader.load( model.fbx_path, function ( object ) {
      object.name = model.name;
      // Translation
      object.translateX(model.translation.x);
      object.translateY(model.translation.y);
      object.translateZ(model.translation.z);
      // Rotations
      object.rotateX(model.rotation.x);
      object.rotateY(model.rotation.y);
      object.rotateZ(model.rotation.z);
      // Textures
      var texture = new THREE.TextureLoader().load(model.texture);
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.material = new THREE.MeshBasicMaterial( { map: texture } );
          child.receiveShadow = true;
          child.castShadow = true;
        }
      } );

    scene.add( object );
  } );
}

/*function audioS(keyCode){
    var listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    var pagode = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    camera.add( listener );

    // create a global audio source
    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( './modelos/sambinha.ogg', function( buffer ) {
        pagode.setBuffer( buffer );
        //sound.setLoop(true);
        pagode.setVolume(0.5);
        if (keyCode == 49){
            //console.log(sound.play())
            pagode.play();
        }
    });
    if (keyCode == 98){
        camera.remove( listener)
    }

} */

function onDocumentKeyDown(event){
  //var Eevee = scene.getObjectByName("Eevee");

}