import * as THREE from './libs/js/three.js/build/three.module.js';
import Stats from './libs/js/three.js/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './libs/js/three.js/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './libs/js/three.js/examples/jsm/loaders/FBXLoader.js';

let container, stats, controls;
let camera, scene, renderer, mixer, light;

let clock = new THREE.Clock();

// Audios
let listener = new THREE.AudioListener();
let MagikarpSong = new THREE.Audio(listener);
let JigglypuffSong = new THREE.Audio(listener);
let ArcanineSong = new THREE.Audio(listener);
let SnivySong = new THREE.Audio(listener);

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
    specularTexture: './src/models/fbx/Jigglypuff/images/pm0039_00_Body2.png',
    music: './libs/audio/Jigglypuff.mp3',
    show: false,
  }

  let Magikarp = {
    name: 'Magikarp',
    rotation: {x:0,y:0,z:0},
    translation: {x:300,y:5,z:-70},
    fbx_path: './src/models/fbx/Magikarp/MagikarpF.FBX',
    texture: './src/models/fbx/Magikarp/images/pm0129_00_Body1.png',
    specularTexture: './src/models/fbx/Magikarp/images/pm0129_00_Body1Id.png',
    music: './libs/audio/Magikarp.mp3',
    show: false,
  }

  let Snivy = {
    name: 'Snivy',
    rotation: {x:0,y:0,z:0},
    translation: {x:-100,y:0,z:-70},
    fbx_path: './src/models/fbx/Snivy/Snivy.FBX',
    texture: './src/models/fbx/Snivy/images/pm0495_00_Body1.png',
    specularTexture: './src/models/fbx/Snivy/images/pm0495_00_Body1Id.png',
    music: './libs/audio/Snivy.mp3',
    show: false,
  }

  let Arcanine = {
    name: 'Arcanine',
    show: false,
    rotation: {x:0,y:0,z:0},
    translation: {x:-300,y:0,z:-70},
    fbx_path: './src/models/fbx/Arcanine/Arcanine.FBX',
    texture: './src/models/fbx/Arcanine/images/pm0059_00_BodyA1.png',
    specularTexture: './src/models/fbx/Arcanine/images/pm0059_00_BodyA1Id.png',
    music: './libs/audio/Arcanine.mp3',
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
  loadAudio(Snivy, SnivySong);
  loadAudio(Arcanine, ArcanineSong);
  loadAudio(Jigglypuff, JigglypuffSong);
  loadAudio(Magikarp, MagikarpSong);

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
    document.addEventListener("keydown", keyboardCommands, false);
    renderer.render( scene, camera );
}

function loadAddModel(model){
  let loader = new FBXLoader();
  loader.load( model.fbx_path, function ( object ) {
      object.name = model.name;

      // Translations
      object.translateX(model.translation.x);
      //object.translateY(model.translation.y);
      object.translateY(500);
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
}

function keyboardCommands(event){
  var Arcanine = scene.getObjectByName( "Arcanine" );
  var Jigglypuff = scene.getObjectByName( "Jigglypuff" );
  var Snivy = scene.getObjectByName( "Snivy" );
  var Magikarp = scene.getObjectByName( "Magikarp" );

  let keyCode = event.which;
  //console.log('keyCode', keyCode);

  switch(keyCode){
    case KEYS.ONE:
      Arcanine.show = !(Arcanine.show);
      showModel(Arcanine, ArcanineSong);
      break;

    case KEYS.TWO:
      Snivy.show = !(Snivy.show);
      showModel(Snivy, SnivySong);
      break;

    case KEYS.THREE:
      Jigglypuff.show = !(Jigglypuff.show);
      showModel(Jigglypuff, JigglypuffSong);

      if(Jigglypuff.show)
        singJigglypuff([Arcanine, Snivy, Magikarp]);
      else
        wakeUpPokemons([Arcanine, Snivy, Magikarp]);

      break;

    case KEYS.FOUR:
      Magikarp.show = !(Magikarp.show);
      showModel(Magikarp, MagikarpSong);
      break;

    case KEYS.FIVE:
      SnivySong.pause();
      MagikarpSong.pause();
      ArcanineSong.pause();
      JigglypuffSong.pause();
      break;
  }
}

function showModel(model, song){
  if(model.show){
    song.play();
    model.translateY(-500);
  } else {
    song.pause();
    model.translateY(500);
  }
}

function singJigglypuff(pokemons){
  pokemons.map( pokemon => {
    let song = pokemon.name + 'Song';
    if(pokemon.show){
      eval(song).pause();
      pokemon.rotateZ(1.5);
    }
  })
}

function wakeUpPokemons(pokemons){
  pokemons.map( pokemon => {
    let song = pokemon.name + 'Song';
    if(pokemon.show){
      eval(song).play();
      pokemon.rotateZ(-1.5);
    }
  })
}