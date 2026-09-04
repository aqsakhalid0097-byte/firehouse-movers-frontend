'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Loader2, RotateCcw, Lightbulb, Camera, Compass, Eye, Sparkles } from 'lucide-react';

interface TruckTrailer3DViewerProps {
  className?: string;
  autoRotateSpeed?: number;
  height?: string;
  showControls?: boolean;
}

export const TruckTrailer3DViewer: React.FC<TruckTrailer3DViewerProps> = ({
  className = '',
  autoRotateSpeed = 1.2,
  height = 'h-[500px] sm:h-[620px]',
  showControls = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<'hero' | 'side' | 'front' | 'top'>('hero');

  // References to mutable Three.js objects for external UI button controls
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const headlightsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.025);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(12, 6, 14);
    cameraRef.current = camera;

    // 2. WebGL Renderer with High-End Tone Mapping & Shadow Support
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 3. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Keep camera above the ground
    controls.minDistance = 6;
    controls.maxDistance = 35;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 4. Lighting Environment (Cinematic Firehouse Accent Palette)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainKeyLight.position.set(15, 20, 15);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 2048;
    mainKeyLight.shadow.mapSize.height = 2048;
    mainKeyLight.shadow.bias = -0.0001;
    scene.add(mainKeyLight);

    // Red Rim Accent Light
    const redRimLight = new THREE.PointLight(0xef4444, 4.5, 40);
    redRimLight.position.set(-15, 8, -10);
    scene.add(redRimLight);

    // Amber Fill Light
    const amberFillLight = new THREE.PointLight(0xf59e0b, 3.0, 35);
    amberFillLight.position.set(12, -2, 10);
    scene.add(amberFillLight);

    // Cool Sky Reflection Light
    const skyLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    skyLight.position.set(0, 15, -15);
    scene.add(skyLight);

    // 5. Reflective Floor Grid Plane
    const floorGeometry = new THREE.PlaneGeometry(80, 80);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f0f0f,
      roughness: 0.4,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(80, 40, 0xef4444, 0x262626);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 6. Floating Spark / Ember Particle Field
    const particleCount = 250;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = Math.random() * 15;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: Math.random() * 0.015 + 0.005,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 32;
    sparkCanvas.height = 32;
    const ctx = sparkCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 240, 180, 1)');
      grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.8)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const sparkTexture = new THREE.CanvasTexture(sparkCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffaa33,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Load 3D Truck + Trailer GLB Model
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);
    let truckModel: THREE.Group | null = null;
    const headlightsGroup = new THREE.Group();
    scene.add(headlightsGroup);
    headlightsGroupRef.current = headlightsGroup;

    loader.load(
      '/models/truck_trailer.glb',
      (gltf) => {
        truckModel = gltf.scene;

        // Auto-scale and center the bounding box
        const box = new THREE.Box3().setFromObject(truckModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 11.5 / maxDim; // Scale to fill the viewport nicely
        truckModel.scale.setScalar(scale);

        // Center on X and Z, set bottom on ground Y = 0
        truckModel.position.x = -center.x * scale;
        truckModel.position.y = -box.min.y * scale;
        truckModel.position.z = -center.z * scale;

        // Traverse meshes to enable shadows and enhance materials
        truckModel.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.envMapIntensity = 1.2;
              // Clean up reflections
              if (mat.roughness !== undefined) mat.roughness = Math.min(mat.roughness, 0.7);
            }
          }
        });

        // Add volumetric glowing headlights to cabin front
        const headlight1 = new THREE.SpotLight(0xfef08a, 6, 25, Math.PI / 5, 0.4, 1);
        headlight1.position.set(4.5, 1.8, 1.8);
        headlight1.target.position.set(18, 0, 1.8);

        const headlight2 = new THREE.SpotLight(0xfef08a, 6, 25, Math.PI / 5, 0.4, 1);
        headlight2.position.set(4.5, 1.8, -1.8);
        headlight2.target.position.set(18, 0, -1.8);

        headlightsGroup.add(headlight1);
        headlightsGroup.add(headlight1.target);
        headlightsGroup.add(headlight2);
        headlightsGroup.add(headlight2.target);

        scene.add(truckModel);
        setIsLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          setLoadProgress(percent);
        } else {
          setLoadProgress(Math.min(99, Math.round(xhr.loaded / 130000)));
        }
      },
      (err) => {
        console.error('Error loading 3D truck model:', err);
        setLoadError('Unable to render 3D model. Please check WebGL support.');
        setIsLoading(false);
      }
    );

    // 8. Render & Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // Gentle floating suspension oscillation on the truck
      if (truckModel) {
        truckModel.position.y = Math.sin(elapsedTime * 2.5) * 0.03 + (truckModel.userData.baseY || truckModel.position.y);
      }

      // Animate particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        positions[i * 3] += vel.x;
        positions[i * 3 + 1] += vel.y;
        positions[i * 3 + 2] += vel.z;

        if (positions[i * 3 + 1] > 18) {
          positions[i * 3 + 1] = 0.1;
          positions[i * 3] = (Math.random() - 0.5) * 40;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 550;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 10. Cleanup on Unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      controls.dispose();
      renderer.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      sparkTexture.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoRotateSpeed]);

  // Update OrbitControls autoRotate state dynamically
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = autoRotateSpeed;
    }
  }, [autoRotate, autoRotateSpeed]);

  // Toggle headlights visibility
  useEffect(() => {
    if (headlightsGroupRef.current) {
      headlightsGroupRef.current.visible = headlightsOn;
    }
  }, [headlightsOn]);

  // Handle Camera Presets
  const setCameraPreset = (preset: 'hero' | 'side' | 'front' | 'top') => {
    setActivePreset(preset);
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (preset) {
      case 'hero':
        camera.position.set(12, 6, 14);
        controls.target.set(0, 1.2, 0);
        break;
      case 'side':
        camera.position.set(0, 3.5, 18);
        controls.target.set(0, 1.2, 0);
        break;
      case 'front':
        camera.position.set(16, 2.8, 0);
        controls.target.set(0, 1.2, 0);
        break;
      case 'top':
        camera.position.set(1, 22, 5);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  return (
    <div className={`relative w-full ${height} rounded-3xl overflow-hidden bg-gradient-to-b from-[#141414] via-[#0c0c0c] to-black border border-neutral-800 shadow-2xl ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Overlay with Progress Ring */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-white z-30 space-y-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-white">
              {loadProgress}%
            </div>
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-sm font-bold text-white tracking-wide">Loading 3D Commercial Fleet</h4>
            <p className="text-xs text-gray-400">Initializing WebGL shaders & 3D textures ({loadProgress}%)...</p>
          </div>
        </div>
      )}

      {/* Load Error Fallback */}
      {loadError && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-6 text-center z-30">
          <p className="text-red-400 text-sm font-semibold mb-2">{loadError}</p>
          <p className="text-gray-400 text-xs">WebGL acceleration is required to inspect the 3D model.</p>
        </div>
      )}

      {/* Interactive Controls Overlay Bar */}
      {showControls && !isLoading && !loadError && (
        <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-20">
          {/* Left: Drag Hint & Preset Buttons */}
          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md border border-neutral-700/80 rounded-xl p-1.5 pointer-events-auto shadow-lg">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 px-2 font-mono">
              <Compass className="w-3.5 h-3.5 text-red-400" />
              <span>Drag to Rotate 360°</span>
            </span>

            <div className="h-4 w-px bg-neutral-700 hidden sm:block"></div>

            <button
              type="button"
              onClick={() => setCameraPreset('hero')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePreset === 'hero' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Perspective
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('side')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePreset === 'side' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Side
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('front')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePreset === 'front' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Cabin
            </button>
            <button
              type="button"
              onClick={() => setCameraPreset('top')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activePreset === 'top' ? 'bg-red-600 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              Top
            </button>
          </div>

          {/* Right: Toggle Actions */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                autoRotate
                  ? 'bg-red-600/30 border-red-500 text-white shadow-red-950/50'
                  : 'bg-black/75 border-neutral-700 text-gray-300 hover:text-white'
              }`}
              title="Toggle Auto-Rotation"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Auto-Spin</span>
            </button>

            <button
              type="button"
              onClick={() => setHeadlightsOn(!headlightsOn)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
                headlightsOn
                  ? 'bg-amber-500/30 border-amber-500 text-amber-200'
                  : 'bg-black/75 border-neutral-700 text-gray-300 hover:text-white'
              }`}
              title="Toggle Headlights"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Headlights</span>
            </button>
          </div>
        </div>
      )}

      {/* Fleet Badge Top Left */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-neutral-700 text-xs font-bold text-white shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Firehouse 26ft Air-Ride Fleet</span>
        </div>
      </div>
    </div>
  );
};

export default TruckTrailer3DViewer;
