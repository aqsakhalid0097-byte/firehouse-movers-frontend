'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Orbit, Sparkles } from 'lucide-react';
import { AnimatedHeading } from '@/components/AnimatedHeading';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const MvpScrollDriven3DTruck: React.FC = () => {
  const triggerContainerRef = useRef<HTMLDivElement | null>(null);
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [is360Mode, setIs360Mode] = useState<boolean>(false);

  // Mutable animation state reference shared between GSAP and Three.js render loop
  const animStateRef = useRef({
    rotationY: 0,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 14.5,
    bounceY: 0,
    progress: 0,
  });

  // Mirrors `is360Mode` for use inside the render loop closure (avoids stale state)
  const is360ModeRef = useRef<boolean>(false);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orbitControlsRef = useRef<OrbitControls | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !canvasContainerRef.current || !pinSectionRef.current || !triggerContainerRef.current)
      return;

    const container = canvasContainerRef.current;
    const pinSection = pinSectionRef.current;
    const triggerContainer = triggerContainerRef.current;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 580;
    const aspect = width / height;

    // Helper: keep desktop (window.innerWidth >= 1024) strictly at 14.5;
    // On mobile and tablet, calculate the exact camera distance so the 13.5-unit truck
    // fits completely within the screen with comfortable padding on both sides.
    const computeBaseZ = (asp: number, winWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1200) => {
      if (winWidth >= 1024) return 14.5;
      // In Three.js: visibleWidth = 2 * tan(36°/2) * Z * asp = 0.6498 * Z * asp
      // For visibleWidth to be ~18 units (so 13.5-unit truck takes ~75% of screen width with generous breathing room):
      // Z = 18 / (0.6498 * asp) = 27.7 / asp
      return Math.max(14.5, 27.5 / Math.max(0.42, asp));
    };

    const initialZ = computeBaseZ(aspect, typeof window !== 'undefined' ? window.innerWidth : 1200);
    animStateRef.current.cameraZ = initialZ;

    // 1. Three.js Scene Setup (Straight on X and Y axis)
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 1000);
    camera.position.set(0, 0, initialZ);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

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

    // 360° Free-Orbit Controls (only active while the "360° View" button is
    // toggled on; the scroll-driven rotation above stays the default,
    // untouched experience)
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enabled = false;
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.08;
    orbitControls.enablePan = false;
    orbitControls.rotateSpeed = 0.7;
    orbitControls.minDistance = 9;
    orbitControls.maxDistance = 50;
    orbitControls.minPolarAngle = 0.15;
    orbitControls.maxPolarAngle = Math.PI - 0.15;
    orbitControls.target.set(0, 0, 0);
    orbitControlsRef.current = orbitControls;

    // 2. Cinematic Lighting for Floating Vehicle
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(0, 15, 20);
    mainKeyLight.castShadow = true;
    scene.add(mainKeyLight);

    const redRimLight = new THREE.PointLight(0xef4444, 6.0, 40);
    redRimLight.position.set(-14, 5, -10);
    scene.add(redRimLight);

    const amberFillLight = new THREE.PointLight(0xf59e0b, 4.0, 35);
    amberFillLight.position.set(12, -2, 10);
    scene.add(amberFillLight);

    const topSoftLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topSoftLight.position.set(0, 15, 0);
    scene.add(topSoftLight);

    // 3. Floating Spark / Particle Embers in Void
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      color: 0xff8833,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. Instant Procedural Placeholder Chassis (ensures instant 3D presence)
    const placeholderGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(6.8, 3.0, 2.4);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.7, roughness: 0.3 });
    const cabGeo = new THREE.BoxGeometry(2.8, 2.4, 2.4);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, metalness: 0.8, roughness: 0.2 });

    const trailerMesh = new THREE.Mesh(boxGeo, boxMat);
    trailerMesh.position.set(-1.4, 0, 0);
    placeholderGroup.add(trailerMesh);

    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.position.set(3.4, -0.3, 0);
    placeholderGroup.add(cabMesh);

    scene.add(placeholderGroup);

    // 5. Load Realistic GLB Model Asynchronously with Straight Centering
    let truckModel: THREE.Group | null = null;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      '/models/truck_trailer.glb',
      (gltf) => {
        scene.remove(placeholderGroup);
        truckModel = gltf.scene;

        // Compute bounding box
        const box = new THREE.Box3().setFromObject(truckModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 13.5 / maxDim;
        truckModel.scale.setScalar(scale);

        // Perfectly center vertically and horizontally around (0, 0, 0)
        truckModel.position.x = -center.x * scale;
        truckModel.position.y = -center.y * scale;
        truckModel.position.z = -center.z * scale;
        truckModel.rotation.y = 0;

        truckModel.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            const mesh = node as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
          }
        });

        scene.add(truckModel);

        // Refresh ScrollTrigger to sync pin calculations
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 100);
      },
      undefined,
      (err) => {
        console.error('Error loading 3D truck model:', err);
      }
    );

    // 6. Synchronous GSAP ScrollTrigger Pinned Timeline (Rotates truck 180° on scroll from straight position)
    const st = ScrollTrigger.create({
      trigger: triggerContainer,
      start: 'top top',
      end: '+=1800',
      pin: pinSection,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress; // 0 to 1
        animStateRef.current.progress = p;
        // Starts completely straight (0 rad) and rotates 180° (Math.PI) to the other straight side
        animStateRef.current.rotationY = p * Math.PI;

        setScrollProgress(Math.round(p * 100));

        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${p * 100}%`;
        }
      },
    });

    // 7. Render Loop with Visibility Culling (Zero GPU drain when off-screen)
    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: '200px' }
    );
    observer.observe(triggerContainer);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Skip rendering when offscreen

      const state = animStateRef.current;
      const activeObj = truckModel || placeholderGroup;

      if (is360ModeRef.current) {
        // Free-orbit mode: the model holds still at whatever angle it was
        // facing, and OrbitControls drives the camera around it.
        orbitControls.update();
      } else {
        if (activeObj) {
          activeObj.rotation.y = state.rotationY;
        }
        camera.position.set(state.cameraX, state.cameraY, state.cameraZ);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler — also watches the container itself (not just
    // window resizes) so the "360° View" broaden toggle keeps the canvas
    // crisp while it animates to its larger size.
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 580;
      const asp = newWidth / newHeight;
      camera.aspect = asp;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

      const targetZ = computeBaseZ(asp, window.innerWidth);
      animStateRef.current.cameraZ = targetZ;
      if (!is360ModeRef.current) {
        camera.position.z = targetZ;
      }
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      st.kill();
      orbitControls.dispose();
      renderer.dispose();
      boxGeo.dispose();
      boxMat.dispose();
      cabGeo.dispose();
      cabMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // React to the "360° View" toggle: hand control between the scroll-driven
  // camera and the free-orbit camera, and keep the transition seamless by
  // starting the orbit from the truck's current on-screen angle.
  useEffect(() => {
    is360ModeRef.current = is360Mode;

    const controls = orbitControlsRef.current;
    const camera = cameraRef.current;
    if (!controls || !camera) return;

    controls.enabled = is360Mode;

    if (is360Mode) {
      // Pull back to a broader vantage point so the whole rig is visible
      // while orbiting, starting from the same straight-on angle the model
      // was already facing so nothing jumps.
      camera.position.set(0, 3.2, 18);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    } else {
      // Hand back to the scroll-driven camera exactly where scroll progress
      // currently is, so resuming feels continuous.
      const state = animStateRef.current;
      camera.position.set(state.cameraX, state.cameraY, state.cameraZ);
      camera.lookAt(0, 0, 0);
    }
  }, [is360Mode]);

  return (
    <div ref={triggerContainerRef} className="relative bg-black text-white w-full">
      {/* Pinned Screen Viewport */}
      <div
        ref={pinSectionRef}
        className="h-screen min-h-[520px] w-full flex flex-col justify-between p-3 sm:p-6 lg:p-10 overflow-hidden bg-black relative"
      >
        {/* Ambient Radial Red Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none"></div>

        {/* Section Header */}
        <AnimatedHeading
          as="h2"
          text="Why American Homeowners"
          gradientText="Choose Us"
          subtitle="Scroll down to rotate our 26-foot commercial fleet in 360° and inspect purpose-built moving engineering."
          align="center"
          scrollTrigger={true}
          className="relative z-20 max-w-5xl mx-auto w-full pt-1 sm:pt-2"
        />

        {/* Center Pure 3D Canvas Stage (Unobstructed & Clean) */}
        <div
          className={`relative z-10 mx-auto w-full flex items-center justify-center transition-all duration-500 ease-out ${
            is360Mode ? 'max-w-none h-[72vh] sm:h-[82vh]' : 'max-w-7xl h-[50vh] sm:h-[62vh] lg:h-[70vh]'
          }`}
        >
          <div
            ref={canvasContainerRef}
            className={`w-full h-full ${is360Mode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
          />

          {/* 360° View Toggle */}
          <button
            type="button"
            onClick={() => setIs360Mode((prev) => !prev)}
            className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-30 inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border backdrop-blur-md text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wide transition-all cursor-pointer shadow-lg ${
              is360Mode
                ? 'bg-red-600/90 border-red-500 text-white shadow-red-950/50'
                : 'bg-black/70 border-neutral-700 text-gray-200 hover:text-white hover:border-neutral-500'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{is360Mode ? 'Exit 360° View' : '360° View'}</span>
          </button>

          {/* Drag hint, only shown while exploring */}
          {is360Mode && (
            <div className="absolute top-14 right-3 sm:top-16 sm:right-4 z-30 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-[10px] sm:text-[11px] text-gray-300 font-mono pointer-events-none">
              <span>Hold &amp; drag to orbit &bull; Scroll to zoom</span>
            </div>
          )}
        </div>

        {/* Bottom Pinned Footer - Only Bar */}
        <div className="relative z-20 max-w-xl mx-auto w-full border-t border-neutral-800/80 pt-3 pb-2 flex justify-center">
          <div className="w-56 sm:w-96 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-emerald-500 transition-all duration-75"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MvpScrollDriven3DTruck;
