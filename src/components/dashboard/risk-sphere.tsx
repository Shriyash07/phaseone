'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RiskSphereProps {
  riskScore: number;
}

const RiskSphere: React.FC<RiskSphereProps> = ({ riskScore }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return;

    const currentMount = mountRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(2, 6);
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    
    const material = new THREE.MeshPhongMaterial({
      shininess: 100,
      specular: 0xffffff,
      flatShading: true,
    });
    const wireframeMaterial = new THREE.LineBasicMaterial({
      opacity: 0.2,
      transparent: true,
      linewidth: 1,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
    sphere.add(wireframe);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4.5;

    let time = 0;
    let pulseFrequency = 2; // Default pulse

    const animate = () => {
      if (!mountRef.current) return;
      requestAnimationFrame(animate);
      time += 0.01;

      const scale = 1 + 0.02 * Math.sin(time * pulseFrequency);
      sphere.scale.set(scale, scale, scale);

      sphere.rotation.y += 0.0005;
      sphere.rotation.x += 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    const color = new THREE.Color();
    const wireColor = new THREE.Color();
    
    if (riskScore > 70) {
      color.set(0xfa0404); // Pulsating Red
      wireColor.set(0xffffff);
      pulseFrequency = 5;
      material.emissiveIntensity = 0.6;
    } else if (riskScore > 40) {
      color.set(0x08f7fe); // Neon Blue
      wireColor.set(0x08f7fe);
      pulseFrequency = 2;
      material.emissiveIntensity = 0.4;
    } else {
      color.set(0x00ff00); // Neon Green
      wireColor.set(0x00ff00);
      pulseFrequency = 1;
      material.emissiveIntensity = 0.3;
    }
    material.color = color;
    material.emissive = color;
    wireframeMaterial.color = wireColor;

    const handleResize = () => {
      if (currentMount) {
        const width = currentMount.clientWidth;
        const height = currentMount.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentMount) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [riskScore]);

  return <div ref={mountRef} className="w-full h-full min-h-[300px]" />;
};

export default RiskSphere;
