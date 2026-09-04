'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Interactive3DFirehouseCanvasProps {
  className?: string;
  variant?: 'hero' | 'about' | 'compact';
}

export const Interactive3DFirehouseCanvas: React.FC<Interactive3DFirehouseCanvasProps> = ({
  className = '',
  variant = 'hero',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Cinematic Firehouse Palette: Vivid Red, Gold, Cool White)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const redPointLight = new THREE.PointLight(0xef4444, 4, 30);
    redPointLight.position.set(8, 6, 8);
    scene.add(redPointLight);

    const amberPointLight = new THREE.PointLight(0xf59e0b, 3, 30);
    amberPointLight.position.set(-8, -4, 6);
    scene.add(amberPointLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    blueRimLight.position.set(0, 10, -5);
    scene.add(blueRimLight);

    // 3. Central 3D Group: Firefighter Shield & Geometric Core
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Outer Shield Ring
    const torusGeometry = new THREE.TorusGeometry(3.6, 0.14, 32, 100);
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const outerRing = new THREE.Mesh(torusGeometry, goldMaterial);
    mainGroup.add(outerRing);

    // Second Inner Ring with Counter Rotation
    const innerTorusGeom = new THREE.TorusGeometry(3.0, 0.08, 24, 80);
    const redMetallicMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x991b1b,
      emissiveIntensity: 0.4,
    });
    const innerRing = new THREE.Mesh(innerTorusGeom, redMetallicMat);
    innerRing.rotation.x = Math.PI / 4;
    mainGroup.add(innerRing);

    // Central Maltese Cross / Shield Geometry
    const shieldShape = new THREE.Shape();
    // Shield outline coordinates
    shieldShape.moveTo(0, 2.8);
    shieldShape.quadraticCurveTo(2.4, 2.5, 2.4, 0.8);
    shieldShape.quadraticCurveTo(2.4, -1.2, 0, -2.8);
    shieldShape.quadraticCurveTo(-2.4, -1.2, -2.4, 0.8);
    shieldShape.quadraticCurveTo(-2.4, 2.5, 0, 2.8);

    const extrudeSettings = {
      steps: 2,
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.15,
      bevelSegments: 5,
    };

    const shieldGeometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeometry.center();

    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x991b1b,
      emissive: 0x450a0a,
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });

    const shieldMesh = new THREE.Mesh(shieldGeometry, shieldMaterial);
    mainGroup.add(shieldMesh);

    // Core Star Emblem inside Shield
    const emblemGeom = new THREE.OctahedronGeometry(1.1, 0);
    const emblemMaterial = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.5,
    });
    const emblemMesh = new THREE.Mesh(emblemGeom, emblemMaterial);
    emblemMesh.position.z = 0.5;
    mainGroup.add(emblemMesh);

    // 4. Orbiting Satellites (Floating Firehouse Badges / Cubes)
    const satellitesCount = 6;
    const satellites: THREE.Mesh[] = [];
    const satGroup = new THREE.Group();
    mainGroup.add(satGroup);

    for (let i = 0; i < satellitesCount; i++) {
      const satGeom = new THREE.IcosahedronGeometry(0.35, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xef4444 : 0xf59e0b,
        metalness: 0.8,
        roughness: 0.2,
        emissive: i % 2 === 0 ? 0xdc2626 : 0xd97706,
        emissiveIntensity: 0.4,
      });
      const sat = new THREE.Mesh(satGeom, satMat);
      const angle = (i / satellitesCount) * Math.PI * 2;
      const radius = 4.8;
      sat.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.5);
      satGroup.add(sat);
      satellites.push(sat);
    }

    // 5. 3D Glowing Particle Embers / Sparks Field (Lusion-style atmospheric depth)
    const particleCount = 450;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 35;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      particleScales[i] = Math.random() * 0.15 + 0.05;
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.015,
        y: Math.random() * 0.02 + 0.005, // floating upwards like real sparks
        z: (Math.random() - 0.5) * 0.015,
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Custom Spark Shader / Points Material
    const sparkTexture = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 230, 150, 1)');
        grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.8)');
        grad.addColorStop(0.7, 'rgba(220, 38, 38, 0.2)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    })();

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.45,
      map: sparkTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffaa44,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 6. Interactive Mouse & Gyro Parallax Tracking
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = event.clientX - rect.left;
      const clientY = event.clientY - rect.top;
      targetX = (clientX / width - 0.5) * 2;
      targetY = (clientY / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Render Loop with Smooth Damping
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation (lerp) for fluid tracking
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Group rotation
      mainGroup.rotation.y = elapsedTime * 0.4 + currentX * 0.8;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15 - currentY * 0.6;
      mainGroup.rotation.z = Math.sin(elapsedTime * 0.2) * 0.05;

      // Inner ring counter spin
      innerRing.rotation.z = -elapsedTime * 0.6;
      innerRing.rotation.y = Math.cos(elapsedTime * 0.4) * 0.5;

      // Core emblem rotation
      emblemMesh.rotation.x = elapsedTime * 1.2;
      emblemMesh.rotation.y = elapsedTime * 1.5;

      // Orbiting satellites
      satGroup.rotation.z = elapsedTime * 0.5;
      satellites.forEach((sat, idx) => {
        sat.rotation.x = elapsedTime * 2 + idx;
        sat.rotation.y = elapsedTime * 1.5 + idx;
      });

      // Floating gentle bobbing
      mainGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.25;

      // Animate particles (sparks floating upward)
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const vel = particleVelocities[i];
        positions[i * 3] += vel.x;
        positions[i * 3 + 1] += vel.y;
        positions[i * 3 + 2] += vel.z;

        // Reset if floated out of bounds
        if (positions[i * 3 + 1] > 14) {
          positions[i * 3 + 1] = -14;
          positions[i * 3] = (Math.random() - 0.5) * 35;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Dynamic light tracking
      redPointLight.position.x = Math.sin(elapsedTime * 0.8) * 8;
      redPointLight.position.y = Math.cos(elapsedTime * 0.6) * 6;
      amberPointLight.position.x = -Math.sin(elapsedTime * 0.7) * 8;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 9. Cleanup on Unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      shieldGeometry.dispose();
      shieldMaterial.dispose();
      torusGeometry.dispose();
      goldMaterial.dispose();
      innerTorusGeom.dispose();
      redMetallicMat.dispose();
      emblemGeom.dispose();
      emblemMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      sparkTexture.dispose();
      renderer.dispose();
    };
  }, [variant]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[420px] sm:min-h-[520px] pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};

export default Interactive3DFirehouseCanvas;
