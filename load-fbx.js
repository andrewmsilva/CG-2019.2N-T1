import * as THREE from './libs/js/three.js/build/three.module.js';
import Stats from './libs/js/three.js/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './libs/js/three.js/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './libs/js/three.js/examples/jsm/loaders/FBXLoader.js';

let container, stats, controls;
let camera, scene, renderer, mixer, light;

let clock = new THREE.Clock();

// Audios
let listener = new THREE.AudioListener();
let magikarpSong = new THREE.Audio(listener);
let jigglypuffSong = new THREE.Audio(listener);
let charmanderSong = new THREE.Audio(listener);
let eeveeSong = new THREE.Audio(listener);
let audioContext = new AudioContext();

const KEYS = {
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
}

init();
animate();

function init(){

  // Models structures
  let Jigglypuff = {
    name: 'Jigglypuff',
    rotation: {x:0,y:0,z:0},
    translation: {x:100,y:0,z:-70},
    fbx_path: './src/models/fbx/Jigglypuff/Jigglypuff.FBX',
    texture: './src/models/fbx/Jigglypuff/images_shiny/pm0039_00_Body1.png',
    normalTexture: './src/models/fbx/Jigglypuff/images/pm0039_00_BodyNor.png',
    specularTexture: './src/models/fbx/Jigglypuff/images/pm0039_00_Body2.png',
    music: './libs/audio/jigglypuff.mp3',
  }

  let Magikarp = {
    name: 'Magikarp',
    rotation: {x:0,y:0,z:0},
    translation: {x:300,y:5,z:-70},
    fbx_path: './src/models/fbx/Magikarp/MagikarpF.FBX',
    texture: './src/models/fbx/Magikarp/images/pm0129_00_Body1.png',
    specularTexture: './src/models/fbx/Magikarp/images/pm0129_00_Body1Id.png',
    music: './libs/audio/magikarp.mp3',
  }

  let Snivy = {
    name: 'Snivy',
    rotation: {x:0,y:0,z:0},
    translation: {x:-100,y:0,z:-70},
    fbx_path: './src/models/fbx/Snivy/Snivy.FBX',
    texture: './src/models/fbx/Snivy/images/pm0495_00_Body1.png',
    specularTexture: './src/models/fbx/Snivy/images/pm0495_00_Body1Id.png',
    music: './libs/audio/eevee.mp3',
  }

  let Arcanine = {
    name: 'Arcanine',
    rotation: {x:0,y:0,z:0},
    translation: {x:-300,y:0,z:-70},
    fbx_path: './src/models/fbx/Arcanine/Arcanine.FBX',
    texture: './src/models/fbx/Arcanine/images/pm0059_00_BodyA1.png',
    specularTexture: './src/models/fbx/Arcanine/images/pm0059_00_BodyA1Id.png',
    music: './libs/audio/charmander.mp3',
  }


  // Render localization
  container = document.createElement('div');
  document.body.appendChild( container );

  // Camera ajusts
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set( 0, 200, 300 );

  // Create scene and add lights
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xb3ecff );
  light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
  light.position.set( 0, 200, 0 );
  scene.add( light );
  light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 100, 0 );
  light.castShadow = true;
  light.shadow.camera.top = 380;
  light.shadow.camera.bottom = -300;
  light.shadow.camera.left = -360;
  light.shadow.camera.right = 360;
  scene.add( light );

  // Create Ground: forest green
  let mesh = new THREE.Mesh( 
    new THREE.PlaneBufferGeometry( 2000, 2000 ),
    new THREE.MeshPhongMaterial({
      color: 0x228B22,
      depthWrite: false,
    })
  );
  mesh.rotation.x = - Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add( mesh );
  
  // Load and add Models to the scene
  loadAddModel(Jigglypuff);
  loadAddModel(Magikarp);
  loadAddModel(Snivy);
  loadAddModel(Arcanine);

  // Load audios
  camera.add(listener);
  loadAudio(Snivy, eeveeSong);
  loadAudio(Arcanine, charmanderSong);
  loadAudio(Jigglypuff, jigglypuffSong);
  loadAudio(Magikarp, magikarpSong);
/*
  // Audio
  let loader = new THREE.AudioLoader();
  loader.load('./libs/audio/magikarp.mp3',
    function ( audioBuffer ) {
      ambientSound.name = 'music';
      ambientSound.setBuffer( audioBuffer );
      ambientSound.setVolume(0.5).setLoop(true);
      ambientSound.play();
    },
  );        
  let ambientSound = new THREE.Audio( new THREE.AudioListener() );
  scene.add( ambientSound );*/

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

  // stats
  stats = new Stats();
  container.appendChild( stats.dom );
}

// Function to run all render
function animate() {
    requestAnimationFrame( animate );
    let delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );
    document.addEventListener("keydown", Commands, false);
    renderer.render( scene, camera );
    //stats.update();
}

function loadAddModel(model){
  let loader = new FBXLoader();
  loader.load( model.fbx_path, function ( object ) {
      object.name = model.name;

      // Translations
      object.translateX(model.translation.x);
      object.translateY(model.translation.y);
      object.translateZ(model.translation.z);

      // Rotations
      object.rotateX(model.rotation.x);
      object.rotateY(model.rotation.y);
      object.rotateZ(model.rotation.z);

      // Textures
      let textureLoader = new THREE.TextureLoader();
      object.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.material = new THREE.MeshPhongMaterial( {
            color: 0xaaaaaa,
            specular: 0x333333,
            shininess: 15,
            map: textureLoader.load(model.texture),
            specularMap: textureLoader.load(model.specularTexture),
          });
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });

    scene.add( object );
  } );
}

function loadAudio(model, audio){
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load( model.music, function( buffer ) {
    audio.setBuffer( buffer );
    audio.setVolume(1);
  });
  /*    audioLoader.load( './modelos/sambinha.ogg', function( buffer ) {
        pagode.setBuffer( buffer );
        pagode.setVolume(1);
    });
    //funk natalino
    audioLoader.load( './modelos/funkNatal.ogg', function( buffer ) {
        funkN.setBuffer( buffer );
        funkN.setVolume(1);
    }); */
}

/*function audioS(keyCode){
    let listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    let pagode = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    camera.add( listener );

    // create a global audio source
    let audioLoader = new THREE.AudioLoader();
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

function Commands(event){
  let keyCode = event.which;
  console.log('keyCode', keyCode);

  if(keyCode == KEYS.ONE) {
    magikarpSong.pause();
    eeveeSong.pause();
    jigglypuffSong.pause();
    charmanderSong.play();
  } 

  if(keyCode == KEYS.TWO) {
    charmanderSong.pause();
    magikarpSong.pause();
    jigglypuffSong.pause();
    eeveeSong.play();
  }

  if (keyCode == KEYS.THREE){
    eeveeSong.pause();
    magikarpSong.pause();
    charmanderSong.pause();
    jigglypuffSong.play();
  }

  if (keyCode == KEYS.FOUR){
    jigglypuffSong.pause();
    eeveeSong.pause();
    charmanderSong.pause();
    magikarpSong.play();
  }

  if (keyCode == KEYS.FIVE){
    eeveeSong.pause();
    magikarpSong.pause();
    charmanderSong.pause();
    jigglypuffSong.pause();
  }
}