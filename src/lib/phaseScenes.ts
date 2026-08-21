import * as THREE from 'three';
import type { PhaseVisual } from '../data/phases';

type AnimatedItem = {
  mesh: THREE.Object3D;
  mode: 'bob' | 'spin' | 'orbit' | 'stack' | 'scan' | 'packet' | 'layer' | 'gate';
  seed: number;
  base?: THREE.Vector3;
  radius?: number;
  speed?: number;
  curve?: THREE.CatmullRomCurve3;
};

class PhaseScene {
  readonly renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  private root = new THREE.Group();
  private items: AnimatedItem[] = [];
  private progress = 0;
  private targetProgress = 0;
  private visible = false;
  private observer: IntersectionObserver;
  private resizeObserver: ResizeObserver;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private container: HTMLElement, private type: PhaseVisual) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 7.2);
    this.scene.add(this.root);
    this.scene.add(new THREE.AmbientLight(0xbce9ff, 1.15));
    const a = new THREE.PointLight(0x6ee7ff, 22, 24, 2); a.position.set(3, 3, 5); this.scene.add(a);
    const b = new THREE.PointLight(0xc7a6ff, 18, 24, 2); b.position.set(-3, -2, 4); this.scene.add(b);
    const c = new THREE.PointLight(0xb8ff9e, 12, 20, 2); c.position.set(0, -3, 3); this.scene.add(c);

    this.build();
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
    }, { rootMargin: '300px 0px 300px 0px' });
    this.observer.observe(container);
  }

  private mat(color: number, emissive = .16) {
    return new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: emissive,
      roughness: .18, metalness: .1, clearcoat: 1, clearcoatRoughness: .16
    });
  }

  private lineMat(color: number, opacity = .38) {
    return new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  }

  private build() {
    switch (this.type) {
      case 'discovery': this.buildDiscovery(); break;
      case 'diagnosis': this.buildDiagnosis(); break;
      case 'inception': this.buildInception(); break;
      case 'requirements': this.buildRequirements(); break;
      case 'backlog': this.buildBacklog(); break;
      case 'architecture': this.buildArchitecture(); break;
      case 'approval': this.buildApproval(); break;
      case 'delivery': this.buildDelivery(); break;
    }
  }

  private buildDiscovery() {
    const points = [
      new THREE.Vector3(-1.8,.8,.1), new THREE.Vector3(-.9,-1.1,.3), new THREE.Vector3(.3,.2,-.1),
      new THREE.Vector3(1.7,-.8,.2), new THREE.Vector3(1.2,1.4,-.3), new THREE.Vector3(-1.1,1.55,-.25),
      new THREE.Vector3(.2,-1.65,-.35)
    ];
    const geo = new THREE.IcosahedronGeometry(.27, 1);
    points.forEach((p, i) => {
      const mesh = new THREE.Mesh(geo, this.mat(i === 2 ? 0xb8ff9e : i % 2 ? 0xc7a6ff : 0x6ee7ff));
      mesh.position.copy(p);
      this.root.add(mesh);
      this.items.push({ mesh, mode: 'bob', seed: i, base: p.clone() });
    });
    const pairs = [[0,1],[0,2],[1,2],[2,3],[2,4],[4,5],[1,6],[6,3],[5,2]];
    pairs.forEach(([a,b]) => {
      const curve = new THREE.LineCurve3(points[a], points[b]);
      const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, .014, 6, false), this.lineMat(0x77dbef, .36));
      this.root.add(tube);
    });
  }

  private buildDiagnosis() {
    const group = new THREE.Group();
    this.root.add(group);
    for (let x = -2; x <= 2; x++) {
      for (let y = -1; y <= 1; y++) {
        const height = .42 + ((x + y + 6) % 4) * .22;
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(.62, height, .62), this.mat([0x6ee7ff,0x83b6ff,0xc7a6ff,0xb8ff9e][(x+y+8)%4]));
        mesh.position.set(x * .82, y * 1.0, 0);
        group.add(mesh);
        this.items.push({ mesh, mode: 'scan', seed: (x + 2) * 3 + (y + 1), base: mesh.position.clone() });
      }
    }
    const scan = new THREE.Mesh(new THREE.PlaneGeometry(4.8, .035), new THREE.MeshBasicMaterial({ color: 0xb8ff9e, transparent: true, opacity: .65, side: THREE.DoubleSide }));
    scan.position.z = 1.0;
    this.root.add(scan);
    this.items.push({ mesh: scan, mode: 'scan', seed: 99, base: scan.position.clone() });
  }

  private buildInception() {
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(.68, 2), this.mat(0x6ee7ff, .24));
    this.root.add(core);
    this.items.push({ mesh: core, mode: 'spin', seed: 0 });
    [1.15, 1.7, 2.2].forEach((radius, i) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, .022, 8, 110), this.lineMat([0x6ee7ff,0xc7a6ff,0xb8ff9e][i], .46));
      ring.rotation.x = Math.PI / (2.15 + i * .25);
      ring.rotation.y = i * .46;
      this.root.add(ring);
      this.items.push({ mesh: ring, mode: 'spin', seed: i + 2 });
      const sat = new THREE.Mesh(new THREE.SphereGeometry(.13 + i * .025, 14, 14), this.mat([0xc7a6ff,0xb8ff9e,0x6ee7ff][i]));
      this.root.add(sat);
      this.items.push({ mesh: sat, mode: 'orbit', seed: i, radius, speed: .5 + i * .18 });
    });
  }

  private buildRequirements() {
    const outer = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.5, 2.5), new THREE.MeshBasicMaterial({ color: 0x78daf1, wireframe: true, transparent: true, opacity: .45 }));
    this.root.add(outer);
    this.items.push({ mesh: outer, mode: 'spin', seed: 0 });
    const inner = new THREE.Mesh(new THREE.OctahedronGeometry(1.0, 0), this.mat(0xc7a6ff, .22));
    this.root.add(inner);
    this.items.push({ mesh: inner, mode: 'spin', seed: 1 });
    for (let i = 0; i < 4; i++) {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(1.1, .12, .72), this.mat(i % 2 ? 0xb8ff9e : 0x6ee7ff));
      plate.position.set(i % 2 ? 1.8 : -1.8, -1.1 + i * .72, 0);
      this.root.add(plate);
      this.items.push({ mesh: plate, mode: 'layer', seed: i, base: plate.position.clone() });
    }
  }

  private buildBacklog() {
    const xs = [-1.7, 0, 1.7];
    xs.forEach((x, col) => {
      for (let i = 0; i < 4; i++) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.1, .24, .75), this.mat([0x6ee7ff,0xc7a6ff,0xb8ff9e][col]));
        mesh.position.set(x, -1.25 + i * .7, 0);
        this.root.add(mesh);
        this.items.push({ mesh, mode: 'stack', seed: col * 4 + i, base: mesh.position.clone() });
      }
    });
    const base = new THREE.Mesh(new THREE.BoxGeometry(5.4, .12, 1.2), this.lineMat(0xffffff, .08));
    base.position.y = -1.55;
    this.root.add(base);
  }

  private buildArchitecture() {
    const layers = [
      { y: -1.3, size: 3.8, color: 0x6ee7ff },
      { y: -.45, size: 3.2, color: 0x83b6ff },
      { y: .4, size: 2.6, color: 0xc7a6ff },
      { y: 1.25, size: 2.0, color: 0xb8ff9e }
    ];
    layers.forEach((layer, i) => {
      const platform = new THREE.Mesh(new THREE.BoxGeometry(layer.size, .16, layer.size * .48), this.mat(layer.color, .13));
      platform.position.y = layer.y;
      this.root.add(platform);
      this.items.push({ mesh: platform, mode: 'layer', seed: i, base: platform.position.clone() });
      for (let j = 0; j < 3; j++) {
        const node = new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.34,12), this.mat(layer.color));
        node.position.set((j - 1) * layer.size * .27, layer.y + .27, 0);
        this.root.add(node);
        this.items.push({ mesh: node, mode: 'bob', seed: i * 3 + j, base: node.position.clone() });
      }
    });
  }

  private buildApproval() {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, .22, 20, 120), this.mat(0xb8ff9e, .22));
    ring.rotation.x = Math.PI / 2.5;
    this.root.add(ring);
    this.items.push({ mesh: ring, mode: 'gate', seed: 0 });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.05, .028, 8, 120), this.lineMat(0x6ee7ff, .5));
    ring2.rotation.x = Math.PI / 2;
    this.root.add(ring2);
    this.items.push({ mesh: ring2, mode: 'spin', seed: 2 });

    const pts = [new THREE.Vector3(-.75,0,0), new THREE.Vector3(-.2,-.55,0), new THREE.Vector3(.9,.65,0)];
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .1);
    const check = new THREE.Mesh(new THREE.TubeGeometry(curve, 30, .10, 12, false), this.mat(0xffffff, .15));
    check.position.z = .4;
    this.root.add(check);
    this.items.push({ mesh: check, mode: 'gate', seed: 1 });
  }

  private buildDelivery() {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.3,-.9,0), new THREE.Vector3(-1.0,.45,.15),
      new THREE.Vector3(.5,-.2,-.1), new THREE.Vector3(2.2,.9,0)
    ], false, 'catmullrom', .45);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 100, .10, 12, false), this.lineMat(0x6ee7ff, .5));
    this.root.add(tube);
    const packet = new THREE.Mesh(new THREE.BoxGeometry(.55,.35,.35), this.mat(0xb8ff9e, .22));
    this.root.add(packet);
    this.items.push({ mesh: packet, mode: 'packet', seed: 0, curve });
    [-1.1,.5,1.7].forEach((x, i) => {
      const gate = new THREE.Mesh(new THREE.TorusGeometry(.55,.035,8,80), this.lineMat([0xc7a6ff,0x6ee7ff,0xb8ff9e][i], .52));
      gate.position.set(x, i === 0 ? .35 : i === 1 ? -.18 : .68, 0);
      gate.rotation.y = Math.PI / 2.2;
      this.root.add(gate);
      this.items.push({ mesh: gate, mode: 'spin', seed: i + 1 });
    });
  }

  setProgress(value: number) {
    this.targetProgress = THREE.MathUtils.clamp(value, 0, 1);
  }

  render(timeMs: number) {
    if (!this.visible) return;
    const t = timeMs * .001;
    this.progress += (this.targetProgress - this.progress) * (this.reducedMotion ? 1 : .08);
    const p = this.progress;

    this.items.forEach((item) => {
      const mesh = item.mesh;
      const base = item.base;
      switch (item.mode) {
        case 'bob':
          if (base) mesh.position.y = base.y + Math.sin(t * 1.1 + item.seed) * .08 + (p - .5) * .08;
          mesh.rotation.y += .006;
          break;
        case 'spin':
          mesh.rotation.y += .005 + p * .006;
          mesh.rotation.z += .0018;
          break;
        case 'orbit': {
          const r = item.radius ?? 1.5;
          const speed = item.speed ?? .6;
          const angle = t * speed + item.seed * 2 + p * Math.PI * 1.4;
          mesh.position.set(Math.cos(angle) * r, Math.sin(angle) * .55, Math.sin(angle) * r * .22);
          break;
        }
        case 'stack':
          if (base) {
            mesh.position.y = base.y + (1 - p) * (item.seed % 4) * .12 + Math.sin(t + item.seed) * .025;
            mesh.position.z = (1 - p) * ((item.seed % 3) - 1) * .45;
            mesh.rotation.y = (1 - p) * .4 * Math.sin(item.seed);
          }
          break;
        case 'scan':
          if (base && item.seed !== 99) {
            mesh.position.z = Math.sin(t * 1.3 + item.seed) * .08;
            const mat = mesh instanceof THREE.Mesh ? mesh.material as THREE.MeshPhysicalMaterial : null;
            if (mat?.emissive) mat.emissiveIntensity = .1 + p * .25;
          } else if (base) {
            mesh.position.y = -2.0 + ((t * .7 + p * 2.2) % 4.0);
          }
          break;
        case 'layer':
          if (base) {
            mesh.position.y = base.y + (1 - p) * (item.seed - 1.5) * .35;
            mesh.position.z = (1 - p) * Math.sin(item.seed * 2) * .55;
          }
          mesh.rotation.y = Math.sin(t * .35 + item.seed) * .12;
          break;
        case 'gate': {
          const s = .72 + p * .28;
          mesh.scale.setScalar(s);
          mesh.rotation.y += .004 + p * .004;
          break;
        }
        case 'packet':
          if (item.curve) {
            const pp = (t * .12 + p * .35) % 1;
            mesh.position.copy(item.curve.getPoint(pp));
            mesh.rotation.z = -.7;
            mesh.rotation.y += .02;
          }
          break;
      }
    });

    this.root.rotation.y = Math.sin(t * .22) * .14 + (p - .5) * .18;
    this.root.rotation.x = Math.cos(t * .17) * .045;
    this.camera.position.x = Math.sin(t * .25) * .15;
    this.camera.position.y = Math.cos(t * .2) * .09;
    this.camera.lookAt(0, 0, 0);
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.observer.disconnect();
    this.resizeObserver.disconnect();
    this.renderer.dispose();
  }
}

export class PhaseSceneManager {
  private scenes: PhaseScene[] = [];
  private raf = 0;

  constructor() {
    const canvases = Array.from(document.querySelectorAll<HTMLElement>('[data-phase-canvas]'));
    canvases.forEach((container) => {
      const type = container.dataset.scene as PhaseVisual;
      this.scenes.push(new PhaseScene(container, type));
    });
    this.raf = requestAnimationFrame(this.render);
  }

  setProgress(index: number, value: number) {
    this.scenes[index]?.setProgress(value);
  }

  private render = (time: number) => {
    this.scenes.forEach(scene => scene.render(time));
    this.raf = requestAnimationFrame(this.render);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.scenes.forEach(scene => scene.destroy());
  }
}
