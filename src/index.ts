import * as BABYLON from "@babylonjs/core";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import { GridMaterial } from "@babylonjs/materials/grid";
import { SkyMaterial } from "@babylonjs/materials/sky";
import { WaterMaterial } from "@babylonjs/materials/water";


// Required side effects to populate the Create methods on the mesh class. Without this, the bundle would be smaller but the createXXX methods from mesh would not be accessible.
import "@babylonjs/core/Meshes/meshBuilder";

// Get the canvas element from the DOM.
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

// Associate a Babylon Engine to it.
const engine = new Engine(canvas);

// Create our first scene.
var scene = new Scene(engine);

// This creates and positions a free camera (non-mesh)
var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

// This targets the camera to scene origin
camera.setTarget(Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, true);

// This creates a light, aiming 0,1,0 - to the sky (non-mesh)
var light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

// Default intensity is 1. Let's dim the light a small amount
light.intensity = 0.7;

var skyMaterial = new SkyMaterial("skyMaterial", scene);
skyMaterial.backFaceCulling = false;
skyMaterial.inclination = 0.55;
skyMaterial.azimuth = 0.75;
skyMaterial.luminance = 0.45;
skyMaterial.turbidity = 1;

var skybox = Mesh.CreateBox("skyBox", 100.0, scene);
skybox.material = skyMaterial;

// Create a grid material
var material = new GridMaterial("grid", scene);

// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
var sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

// Move the sphere upward 1/2 its height
sphere.position.y = 3;

// Affect a material
sphere.material = material;

// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
var ground = Mesh.CreateGround("ground1", 6, 6, 2, scene);
ground.position.y = -1;

// Affect a material
ground.material = material;

var water = Mesh.CreateGround("ground", 512, 512, 32, scene);
//water.position.y = -0.5;
//const abstractPlane = Plane.FromPositionAndNormal(new Vector3(0, 0, 0), new Vector3(0, 1, 0));
//var water = MeshBuilder.CreatePlane("plane", {sourcePlane: abstractPlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE});

var waterMaterial = new WaterMaterial("water_material", scene);
waterMaterial.bumpTexture = new BABYLON.Texture("./images/waterbump.png", scene); // Set the bump texture
waterMaterial.windForce = 5; // Represents the wind force applied on the water surface
waterMaterial.windDirection = new BABYLON.Vector2(0.3, 0.3); // The wind direction on the water surface (on width and height)
waterMaterial.waveHeight = 1.0; // Represents the height of the waves
waterMaterial.bumpHeight = 1.3; // According to the bump map, represents the pertubation of reflection and refraction
waterMaterial.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6); // Represents the water color mixed with the reflected and refracted world
waterMaterial.colorBlendFactor = 0.3; // Factor to determine how the water color is blended with the reflected and refracted world
waterMaterial.waveLength = 0.35; // The lenght of waves. With smaller values, more waves are generated

waterMaterial.addToRenderList(sphere);
waterMaterial.addToRenderList(skybox);
waterMaterial.addToRenderList(ground);

water.material = waterMaterial;

// Render every frame
engine.runRenderLoop(() => {
    scene.render();
});