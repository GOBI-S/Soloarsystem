import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from './orbitcontrols.js';

const planets = [
  { name: 'mercury', radius: 1.38, distance: 20, texture: 'textures/8k_mercury.jpg', orbitSpeed: 0.04 },
  { name: 'venus', radius: 1.82, distance: 30, texture: 'textures/8k_venus_surface.jpg', orbitSpeed: 0.015 },
  { name: 'earth', radius: 2, distance: 40, texture: 'textures/8k_earth_daymap.jpg', orbitSpeed: 0.01 },
  { name: 'mars', radius: 1.8, distance: 48, texture: 'textures/8k_mars.jpg', orbitSpeed: 0.008 },
  { name: 'jupiter', radius: 7.9, distance: 65, texture: 'textures/8k_jupiter.jpg', orbitSpeed: 0.005 },
  { name: 'saturn', radius: 7, distance: 95, texture: 'textures/8k_saturn.jpg', orbitSpeed: 0.003 },
  { name: 'uranus', radius: 4, distance: 115, texture: 'textures/2k_uranus.jpg', orbitSpeed: 0.002 },
  { name: 'neptune', radius: 3.8, distance: 130, texture: 'textures/2k_neptune.jpg', orbitSpeed: 0.0018 }
];

// Basic scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 200, 25);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.minDistance = 70;
controls.maxDistance = 500;
controls.update();

// Starfield
const starCount = 1000;
const starGeometry = new THREE.BufferGeometry();
const starVertices = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starVertices.set([
    THREE.MathUtils.randFloatSpread(700),
    THREE.MathUtils.randFloatSpread(700),
    THREE.MathUtils.randFloatSpread(700)
  ], i * 3);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Sun
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('./textures/8k_sun.jpg');
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissive: 0xFFA500,
  emissiveMap: sunTexture,
  emissiveIntensity: 3.5,
  metalness: 0.1,
  roughness: 10
});
const sun = new THREE.Mesh(new THREE.SphereGeometry(12, 32, 32), sunMaterial);
scene.add(sun);

// Lights
const sunLight = new THREE.PointLight(0xFFA500, 10 * 100 * 5 * 5, 200, 2);
sunLight.position.copy(sun.position);
sunLight.castShadow = true;
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0x404040, 10));

// Create planets and sliders
const angles = {};
const speedControls = {};

planets.forEach(planet => {
  const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load(planet.texture),
    metalness: 0.3,
    roughness: 0.7
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(planet.distance, 0, 0);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  
  angles[planet.name] = 0;

  // Create orbit
  const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);

  // Create speed control slider
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = 0.1; // Maximum speed
  slider.step = 0.001;
  slider.value = planet.orbitSpeed; // Default speed
  slider.style.position = 'absolute';
  slider.style.top = `${20 + planets.indexOf(planet) * 30}px`;
  slider.style.left = '10px';
  document.body.appendChild(slider);
  
  speedControls[planet.name] = slider;

  // Update orbit speed on slider change
  slider.addEventListener('input', () => {
    planet.orbitSpeed = parseFloat(slider.value);
  });
});

// Stop button
const stopButton = document.createElement('button');
stopButton.innerText = 'Stop Animation';
stopButton.style.position = 'absolute';
stopButton.style.top = '20px';
stopButton.style.right = '10px';
stopButton.style.background = 'transparent';
stopButton.style.border = 'none';
stopButton.style.color = 'white'; 
stopButton.style.fontSize = '16px';
stopButton.style.cursor = 'pointer';
stopButton.onmouseover = () => stopButton.style.textDecoration = 'underline';
stopButton.onmouseout = () => stopButton.style.textDecoration = 'none';
document.body.appendChild(stopButton);

let isAnimating = true;

stopButton.addEventListener('click', () => {
  isAnimating = !isAnimating; // Toggle animation state
  stopButton.innerText = isAnimating ? 'Stop Animation' : 'Resume Animation';
});

function animate() {
  requestAnimationFrame(animate);

  if (isAnimating) {
    planets.forEach(planet => {
      angles[planet.name] += planet.orbitSpeed;
      const mesh = scene.children.find(child => child.geometry && child.geometry.type === 'SphereGeometry' && child.material.map.image.src.includes(planet.texture));
      
      // Update planet position for orbit
      mesh.position.x = Math.cos(angles[planet.name]) * planet.distance;
      mesh.position.z = Math.sin(angles[planet.name]) * planet.distance;

      // Rotate the planet around its own axis
      mesh.rotation.y += 0.01; // Adjust rotation speed as needed
    });

    // Rotate the sun around its own axis
    sun.rotation.y += 0.005; // Adjust rotation speed as needed

    stars.rotation.y += 0.0005;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

