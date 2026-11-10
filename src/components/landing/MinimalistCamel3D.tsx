import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Eye, RotateCw } from 'lucide-react';

export const MinimalistCamel3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // 2. Camera setup
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 15;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    // Warm orange rim light (Brand accent #ff5900)
    const rimLight = new THREE.DirectionalLight(0xff5900, 1.8);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    const softFillLight = new THREE.PointLight(0xffedd5, 1.0, 10);
    softFillLight.position.set(0, -1, 3);
    scene.add(softFillLight);

    // 5. Materials (Modern Minimalist Warm Matte Palette)
    const camelMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5a242,       // Warm golden camel color
      roughness: 0.35,
      metalness: 0.05,
      flatShading: false,
    });

    const humpMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b1a,       // Brand orange tone for the hump
      roughness: 0.3,
      metalness: 0.08,
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x27272a,       // Hooves & eyes dark zinc
      roughness: 0.5,
      metalness: 0.1,
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });

    const muzzleMaterial = new THREE.MeshStandardMaterial({
      color: 0xfde3c2,       // Light cream snout
      roughness: 0.4,
    });

    // 6. Root camel group
    const camelRoot = new THREE.Group();
    scene.add(camelRoot);
    camelRoot.position.y = -0.4;

    // --- BODY (Curved Capsule / Rounded box) ---
    const bodyGeometry = new THREE.CapsuleGeometry(0.55, 0.9, 16, 24);
    const body = new THREE.Mesh(bodyGeometry, camelMaterial);
    body.rotation.z = Math.PI / 2; // Lay horizontally
    body.castShadow = true;
    body.receiveShadow = true;
    camelRoot.add(body);

    // --- ICONIC HUMP ---
    const humpGroup = new THREE.Group();
    const humpGeo = new THREE.ConeGeometry(0.42, 0.65, 24);
    const hump = new THREE.Mesh(humpGeo, humpMaterial);
    hump.position.set(0, 0.58, 0);
    hump.castShadow = true;
    humpGroup.add(hump);

    // Round top sphere on hump
    const humpTopGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const humpTop = new THREE.Mesh(humpTopGeo, humpMaterial);
    humpTop.position.set(0, 0.78, 0);
    humpTop.scale.set(1, 0.8, 1);
    humpTop.castShadow = true;
    humpGroup.add(humpTop);

    humpGroup.position.set(0.05, 0.15, 0);
    camelRoot.add(humpGroup);

    // Second smaller anterior hump accent (minimalist stylized)
    const smallHumpGeo = new THREE.SphereGeometry(0.28, 16, 16);
    const smallHump = new THREE.Mesh(smallHumpGeo, camelMaterial);
    smallHump.position.set(0.48, 0.42, 0);
    smallHump.scale.set(0.9, 0.9, 0.8);
    smallHump.castShadow = true;
    camelRoot.add(smallHump);

    // --- NECK AND HEAD (Animated group) ---
    const neckBaseGroup = new THREE.Group();
    neckBaseGroup.position.set(0.65, 0.25, 0);
    camelRoot.add(neckBaseGroup);

    // Lower Neck (Angled forward-up)
    const lowerNeckGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.65, 16);
    const lowerNeck = new THREE.Mesh(lowerNeckGeo, camelMaterial);
    lowerNeck.position.set(0.18, 0.28, 0);
    lowerNeck.rotation.z = -Math.PI / 6; // Angled forward
    lowerNeck.castShadow = true;
    neckBaseGroup.add(lowerNeck);

    // Upper Neck / Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0.35, 0.65, 0);
    neckBaseGroup.add(headGroup);

    // Head base
    const headGeo = new THREE.SphereGeometry(0.26, 18, 18);
    const head = new THREE.Mesh(headGeo, camelMaterial);
    head.scale.set(1.25, 1, 0.95);
    head.castShadow = true;
    headGroup.add(head);

    // Snout / Muzzle
    const snoutGeo = new THREE.CapsuleGeometry(0.16, 0.22, 12, 16);
    const snout = new THREE.Mesh(snoutGeo, muzzleMaterial);
    snout.rotation.z = Math.PI / 2;
    snout.position.set(0.22, -0.05, 0);
    snout.scale.set(1.1, 1, 0.95);
    snout.castShadow = true;
    headGroup.add(snout);

    // Cute minimalist nose nostrils
    const nostrilGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const nostrilL = new THREE.Mesh(nostrilGeo, darkAccentMaterial);
    nostrilL.position.set(0.35, -0.02, 0.07);
    headGroup.add(nostrilL);

    const nostrilR = new THREE.Mesh(nostrilGeo, darkAccentMaterial);
    nostrilR.position.set(0.35, -0.02, -0.07);
    headGroup.add(nostrilR);

    // Big friendly stylized eyes
    const eyeWhiteGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const eyePupilGeo = new THREE.SphereGeometry(0.038, 12, 12);

    // Left Eye
    const eyeWhiteL = new THREE.Mesh(eyeWhiteGeo, whiteMaterial);
    eyeWhiteL.position.set(0.12, 0.09, 0.19);
    const eyePupilL = new THREE.Mesh(eyePupilGeo, darkAccentMaterial);
    eyePupilL.position.set(0.15, 0.09, 0.22);
    headGroup.add(eyeWhiteL);
    headGroup.add(eyePupilL);

    // Right Eye
    const eyeWhiteR = new THREE.Mesh(eyeWhiteGeo, whiteMaterial);
    eyeWhiteR.position.set(0.12, 0.09, -0.19);
    const eyePupilR = new THREE.Mesh(eyePupilGeo, darkAccentMaterial);
    eyePupilR.position.set(0.15, 0.09, -0.22);
    headGroup.add(eyeWhiteR);
    headGroup.add(eyePupilR);

    // Minimalist Ears
    const earGeo = new THREE.ConeGeometry(0.08, 0.22, 8);
    const earL = new THREE.Mesh(earGeo, humpMaterial);
    earL.position.set(-0.12, 0.28, 0.16);
    earL.rotation.z = -0.3;
    earL.rotation.x = 0.3;
    earL.castShadow = true;
    headGroup.add(earL);

    const earR = new THREE.Mesh(earGeo, humpMaterial);
    earR.position.set(-0.12, 0.28, -0.16);
    earR.rotation.z = -0.3;
    earR.rotation.x = -0.3;
    earR.castShadow = true;
    headGroup.add(earR);

    // --- LEGS (4 stylized articulated legs) ---
    const createLeg = (xOffset: number, zOffset: number) => {
      const legRoot = new THREE.Group();
      legRoot.position.set(xOffset, -0.35, zOffset);

      // Upper Leg
      const upperGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.5, 12);
      const upperLeg = new THREE.Mesh(upperGeo, camelMaterial);
      upperLeg.position.y = -0.25;
      upperLeg.castShadow = true;
      legRoot.add(upperLeg);

      // Knee joint
      const kneeGeo = new THREE.SphereGeometry(0.095, 10, 10);
      const knee = new THREE.Mesh(kneeGeo, camelMaterial);
      knee.position.y = -0.5;
      legRoot.add(knee);

      // Lower Leg
      const lowerGeo = new THREE.CylinderGeometry(0.08, 0.065, 0.5, 12);
      const lowerLeg = new THREE.Mesh(lowerGeo, camelMaterial);
      lowerLeg.position.y = -0.75;
      lowerLeg.castShadow = true;
      legRoot.add(lowerLeg);

      // Hoof / Foot (Minimalist rounded cylinder)
      const hoofGeo = new THREE.CylinderGeometry(0.09, 0.12, 0.1, 14);
      const hoof = new THREE.Mesh(hoofGeo, darkAccentMaterial);
      hoof.position.y = -1.02;
      hoof.castShadow = true;
      legRoot.add(hoof);

      camelRoot.add(legRoot);
      return legRoot;
    };

    const frontRightLeg = createLeg(0.55, 0.26);
    const frontLeftLeg = createLeg(0.55, -0.26);
    const backRightLeg = createLeg(-0.55, 0.26);
    const backLeftLeg = createLeg(-0.55, -0.26);

    // --- TAIL ---
    const tailGroup = new THREE.Group();
    tailGroup.position.set(-0.7, 0.15, 0);
    const tailStickGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.45, 8);
    const tailStick = new THREE.Mesh(tailStickGeo, camelMaterial);
    tailStick.position.set(-0.1, -0.18, 0);
    tailStick.rotation.z = 0.5;
    tailStick.castShadow = true;
    tailGroup.add(tailStick);

    const tailTuftGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const tailTuft = new THREE.Mesh(tailTuftGeo, humpMaterial);
    tailTuft.position.set(-0.2, -0.38, 0);
    tailGroup.add(tailTuft);
    camelRoot.add(tailGroup);

    // --- FLOATING STYLIZED MINIMALIST PLATFORM (Pedestal) ---
    const platformGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.15, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
      metalness: 0.05,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -1.48;
    platform.receiveShadow = true;
    scene.add(platform);

    // Subtle orange ring on platform rim
    const ringGeo = new THREE.TorusGeometry(1.61, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff5900, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1.41;
    scene.add(ring);

    // Soft floating particles / sparkles
    const particleCount = 20;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 3.5;
      positions[i + 1] = Math.random() * 2.5 - 0.8;
      positions[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffa043,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse Interaction Tracking
    let targetRotationY = 0.45;
    let targetRotationX = 0.08;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Dynamic Idle Gait / Breathing
      const breath = Math.sin(elapsed * 2.2) * 0.035;
      camelRoot.position.y = -0.4 + breath;

      // Hump subtle rhythmic pulse
      hump.scale.y = 1 + Math.sin(elapsed * 3) * 0.03;
      hump.scale.x = 1 + Math.cos(elapsed * 3) * 0.02;

      // Head curiosity nodding
      headGroup.rotation.z = Math.sin(elapsed * 2.0) * 0.08 - 0.05;
      headGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.12 + mouseX * 0.4;
      headGroup.rotation.x = -mouseY * 0.35;

      // Tail swish
      tailGroup.rotation.y = Math.sin(elapsed * 4.5) * 0.35;
      tailGroup.rotation.z = 0.1 + Math.cos(elapsed * 4.5) * 0.15;

      // Legs gentle rhythmic gait (stepping subtly)
      const walkCycle = elapsed * 2.2;
      frontRightLeg.rotation.z = Math.sin(walkCycle) * 0.15;
      frontLeftLeg.rotation.z = -Math.sin(walkCycle) * 0.15;
      backRightLeg.rotation.z = -Math.sin(walkCycle) * 0.12;
      backLeftLeg.rotation.z = Math.sin(walkCycle) * 0.12;

      // Ear twitches
      earL.rotation.y = Math.sin(elapsed * 5.0) * 0.15;
      earR.rotation.y = -Math.sin(elapsed * 5.0) * 0.15;

      // Floating particles slow rotation & drift
      particles.rotation.y = elapsed * 0.08;

      // Auto rotation or mouse look
      if (autoRotate) {
        targetRotationY += 0.005;
      } else {
        targetRotationY = 0.45 + mouseX * 0.7;
      }
      targetRotationX = 0.08 - mouseY * 0.25;

      // Smooth interpolation (lerp)
      camelRoot.rotation.y += (targetRotationY - camelRoot.rotation.y) * 0.06;
      camelRoot.rotation.x += (targetRotationX - camelRoot.rotation.x) * 0.06;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer for fluid responsiveness
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      humpGeo.dispose();
      camelMaterial.dispose();
      humpMaterial.dispose();
    };
  }, [autoRotate]);

  return (
    <div
      className="relative w-full max-w-[480px] h-[420px] md:h-[480px] mx-auto flex items-center justify-center select-none"
      onMouseEnter={() => {
        setIsHovered(true);
        setAutoRotate(false);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setAutoRotate(true);
      }}
    >
      {/* Soft aesthetic background aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5900]/10 via-[#ffa242]/10 to-transparent blur-2xl pointer-events-none" />

      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing relative z-10" />

      {/* Top Floating Badge */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#b9bbc6]/40 shadow-xs text-[11px] font-semibold text-black">
        <Sparkles className="w-3.5 h-3.5 text-[#ff5900] animate-pulse" />
        <span>Three.js 3D Interactivo</span>
      </div>

      {/* Bottom Interactive Hints & Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] text-[#60646c] bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#b9bbc6]/30 shadow-xs">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#ff5900]" />
          <span>{isHovered ? '¡Mueve el cursor para dirigir la mirada!' : 'Pasa el cursor para interactuar'}</span>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
            autoRotate ? 'bg-[#ff5900] text-white' : 'bg-[#f3f3f7] text-black hover:bg-[#e4e4e9]'
          }`}
          title="Alternar rotación automática"
        >
          <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? 'Giro Activo' : 'Girar'}</span>
        </button>
      </div>
    </div>
  );
};
