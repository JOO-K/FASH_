import * as THREE from './three/build/three.module.js';

import { OrbitControls } from './three/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from './three/examples/jsm/loaders/GLTFLoader.js';

let canvas, renderer;

const scenes = [];

init();
animate();

function init() {

    canvas = document.getElementById( "c" );

    const content = document.getElementById( 'content' );

    for ( let i = 0; i < 8; i ++ ) {

        const scene = new THREE.Scene();

        // make a list item
        const element = document.createElement( 'div' );
        element.className = 'list-item';

        const sceneElement = document.createElement( 'div' );
        element.appendChild( sceneElement );

        const descriptionElement = document.createElement( 'div' );
        descriptionElement.innerText = 'Scene ' + ( i + 1 );
        element.appendChild( descriptionElement );

        // the element that represents the area we want to render the scene
        scene.userData.element = sceneElement;
        content.appendChild( element );

        const camera = new THREE.PerspectiveCamera( 50, 1, 1, 100 );
        camera.position.set(0, 0, 12);
        camera.lookAt(0, 0, 0);
        scene.userData.camera = camera;

        const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
        controls.minDistance = 1;
        controls.maxDistance = 30;
        controls.enablePan = false;
        controls.enableZoom = true;
        scene.userData.controls = controls;

        const loader = new GLTFLoader();
        
        loader.load( './obj/mfdoom4.gltf', function(gltf) {
            scenes[0].add( gltf.scene );
        }, undefined, function (error) {
            console.error( error );
        });

        loader.load( './obj/thrasher2.gltf', function(gltf) {
            scenes[1].add( gltf.scene );
        }, undefined, function (error) {
            console.error( error );
        });
        
        loader.load( './obj/hoodie.gltf', function(gltf) {
            scenes[2].add( gltf.scene );
        }, undefined, function (error) {
            console.error( error );
        });

        

        const light = new THREE.DirectionalLight( 0xffffff, 10 );
        light.position.set( 20, 20, -100 );
        light.lookAt(0,0,0);
        scene.add( light );
        
        const light2 = new THREE.DirectionalLight( 0xffffff, 10 );
        light.position.set( 60, 50, 100 );
        light.lookAt(0,0,0);
        scene.add( light2 );
        

        
        
        
        const light3 = new THREE.AmbientLight( 0xffffff, 20 ); // soft white light
        scene.add( light3 );
        
        scenes.push( scene );

    }


    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
    renderer.setClearColor( 0xffffff, 1 );
    renderer.setPixelRatio( window.devicePixelRatio );

}

function updateSize() {

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if ( canvas.width !== width || canvas.height !== height ) {

        renderer.setSize( width, height, false );

    }

}

function animate() {
    
    render();
    requestAnimationFrame( animate );

}

function render() {

    updateSize();

    canvas.style.transform = `translateY(${window.scrollY}px)`;

    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();

    renderer.setClearColor( 0xf0f0f0 );
    renderer.setScissorTest( true );

    scenes.forEach( function ( scene ) {

        // so something moves
        //scene.children[ 0 ].rotation.y = Date.now() * 0.05;
        scenes[ 0 ].rotation.y = Date.now() * 0.0005;
        scenes[ 1 ].rotation.y = Date.now() * 0.0005;
        scenes[ 2 ].rotation.y = Date.now() * 0.0005;

        // get the element that is a place holder for where we want to
        // draw the scene
        const element = scene.userData.element;

        // get its position relative to the page's viewport
        const rect = element.getBoundingClientRect();

        // check if it's offscreen. If so skip it
        if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
        rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {

            return; // it's off screen

        }

        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;

        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );

        const camera = scene.userData.camera;

        //camera.aspect = width / height; // not changing in this example
        //camera.updateProjectionMatrix();

        //scene.userData.controls.update();
        
        renderer.render( scene, camera );

    } );

}