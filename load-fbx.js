import * as THREE from './libs/js/three.js/build/three.module.js';
import Stats from './libs/js/three.js/examples/jsm/libs/stats.module.js';

import { OrbitControls } from './libs/js/three.js/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './libs/js/three.js/examples/jsm/loaders/FBXLoader.js';

var container, stats, controls;
var camera, scene, renderer, mixer;

var clock = new THREE.Clock();

init();
animate();

function init(){
    // Render localization
    container = document.createElement('div');
    document.body.appendChild( container );

    // Camera ajusts
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( 100, 200, 400 );

    // Create scene
    scene = new THREE.Scene();

    // Load Model
    var loader = new FBXLoader();
    const fbx_path = './src/models/fbx/Jigglypuff/Jigglypuff.FBX';
    const texture_path = './src/models/fbx/Jigglypuff/images_shiny/pm0039_00_Body1.png';
    loader.load(fbx_path, function ( object ) {
        var texture = new THREE.TextureLoader().load(texture_path);
        object.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material = new THREE.MeshBasicMaterial( { map: texture } )
            }
        } );
        scene.add( object );
    } );

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