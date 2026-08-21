import * as THREE from 'three';

/**
 * V4 background: intentionally subtle.
 * No explicit journey path, nodes or camera travel.
 * The page narrative now lives in the section-level 3D objects,
 * while the fixed background only provides atmosphere.
 */
export class BackgroundJourney {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private world = new THREE.Group();
  private stars!: THREE.Points;
  private dust!: THREE.Points;
  private veils: THREE.Sprite[] = [];
  private halos: THREE.Mesh[] = [];
  private pointer = new THREE.Vector2();
  private progress = 0;
  private targetProgress = 0;
  private raf = 0;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene.fog = new THREE.FogExp2(0x040a10, 0.032);
    this.camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 140);
    this.camera.position.set(0, 0, 14);
    this.scene.add(this.world);

    this.scene.add(new THREE.AmbientLight(0xcbefff, 0.85));
    const cyan = new THREE.PointLight(0x6ee7ff, 10, 38, 2);
    cyan.position.set(6, 4, 8);
    this.scene.add(cyan);

    const violet = new THREE.PointLight(0xc7a6ff, 9, 34, 2);
    violet.position.set(-5, -1.5, 6);
    this.scene.add(violet);

    const green = new THREE.PointLight(0xb8ff9e, 6, 26, 2);
    green.position.set(2, -4, 5);
    this.scene.add(green);

    this.buildStars();
    this.buildDust();
    this.buildVeils();
    this.buildHalos();

    window.addEventListener('pointermove', this.onPointer, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    this.raf = requestAnimationFrame(this.render);
  }

  setProgress(value: number) {
    this.targetProgress = THREE.MathUtils.clamp(value, 0, 1);
  }

  private buildStars() {
    const count = innerWidth < 800 ? 180 : 320;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = -Math.random() * 30 + 6;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xe8fbff,
      size: 0.028,
      transparent: true,
      opacity: 0.33,
      depthWrite: false
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  private buildDust() {
    const count = innerWidth < 800 ? 100 : 180;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 8;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xbad6ff,
      size: 0.05,
      transparent: true,
      opacity: 0.11,
      depthWrite: false
    });

    this.dust = new THREE.Points(geometry, material);
    this.world.add(this.dust);
  }

  private buildVeils() {
    const colors = [0x6ee7ff, 0xc7a6ff, 0xb8ff9e];
    const positions = [
      new THREE.Vector3(-5.5, 3.2, -6),
      new THREE.Vector3(5.2, -0.5, -8),
      new THREE.Vector3(-1.5, -4.4, -7)
    ];

    positions.forEach((position, index) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: this.createGlowTexture(colors[index]),
          transparent: true,
          opacity: index === 0 ? 0.12 : 0.09,
          depthWrite: false
        })
      );
      sprite.position.copy(position);
      const scale = index === 0 ? 8.5 : index === 1 ? 10 : 7.2;
      sprite.scale.set(scale, scale, 1);
      this.world.add(sprite);
      this.veils.push(sprite);
    });
  }

  private buildHalos() {
    const haloConfigs = [
      { radius: 3.4, color: 0x7ccfff, x: -1.8, y: 1.1, z: -10, ry: Math.PI / 5 },
      { radius: 5.1, color: 0xc7a6ff, x: 2.8, y: -0.8, z: -12, ry: Math.PI / 3.5 }
    ];

    haloConfigs.forEach((cfg) => {
      const halo = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.radius, 0.018, 8, 160),
        new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.08 })
      );
      halo.position.set(cfg.x, cfg.y, cfg.z);
      halo.rotation.x = Math.PI / 2.3;
      halo.rotation.y = cfg.ry;
      this.world.add(halo);
      this.halos.push(halo);
    });
  }

  private createGlowTexture(color: number) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    const rgb = new THREE.Color(color);
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, 0.85)`);
    gradient.addColorStop(0.25, `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, 0.22)`);
    gradient.addColorStop(1, `rgba(${Math.round(rgb.r * 255)}, ${Math.round(rgb.g * 255)}, ${Math.round(rgb.b * 255)}, 0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private onPointer = (event: PointerEvent) => {
    this.pointer.x = (event.clientX / innerWidth - 0.5) * 2;
    this.pointer.y = (event.clientY / innerHeight - 0.5) * 2;
  };

  private onResize = () => {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
  };

  private render = (timeMs: number) => {
    const t = timeMs * 0.001;
    this.progress += (this.targetProgress - this.progress) * (this.reducedMotion ? 1 : 0.04);

    const driftX = this.pointer.x * 0.32;
    const driftY = -this.pointer.y * 0.22;
    const pageDrift = (this.progress - 0.5) * 1.6;

    this.camera.position.x += (driftX - this.camera.position.x) * 0.04;
    this.camera.position.y += (driftY - this.camera.position.y) * 0.04;
    this.camera.position.z += (13.6 - this.camera.position.z) * 0.03;
    this.camera.lookAt(0, 0, -4.5);

    this.world.position.y = pageDrift * 0.35;
    this.world.rotation.z = Math.sin(t * 0.08) * 0.025;
    this.world.rotation.y = this.pointer.x * 0.035;

    this.stars.rotation.y = t * 0.006;
    this.stars.rotation.x = Math.sin(t * 0.04) * 0.02;
    this.dust.rotation.z = -t * 0.02;

    this.veils.forEach((sprite, index) => {
      sprite.position.y += Math.sin(t * (0.22 + index * 0.05) + index) * 0.002;
      const base = index === 0 ? 0.11 : index === 1 ? 0.085 : 0.07;
      sprite.material.opacity = base + Math.sin(t * 0.35 + index) * 0.01;
    });

    this.halos.forEach((halo, index) => {
      halo.rotation.z += 0.0008 + index * 0.0004;
      const material = halo.material as THREE.MeshBasicMaterial;
      material.opacity = (index === 0 ? 0.07 : 0.05) + Math.sin(t * 0.4 + index) * 0.008;
    });

    this.renderer.render(this.scene, this.camera);
    this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onPointer);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
