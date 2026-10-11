"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MARK_MESH_B64 } from "@/data/markData";

const VCOUNT = 41508;

// The mesh's vertex colors are stored as plain sRGB (the brand hex values,
// 0-1 normalized). three.js's lighting math expects linear input, so left
// unconverted they read as washed-out/pale once lit — convert once on load.
function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function decodeMeshBuffer(): ArrayBuffer {
  const binStr = atob(MARK_MESH_B64);
  const buf = new ArrayBuffer(binStr.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < binStr.length; i++) view[i] = binStr.charCodeAt(i);
  return buf;
}

export function Mark3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let renderer: THREE.WebGLRenderer;
    let raf = 0;
    let disposed = false;

    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x443322, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x88bbff, 0.6);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    function resize() {
      const s = stage!.clientWidth;
      renderer.setSize(s, s, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", resize);
    resize();

    let mesh: THREE.Mesh | null = null;
    let targetTiltY = 0;
    let targetTiltX = -0.15;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let autorotate = 0;

    try {
      const buf = decodeMeshBuffer();
      const floatsPer = VCOUNT * 3;
      const positions = new Float32Array(buf, 0, floatsPer);
      const normals = new Float32Array(buf, floatsPer * 4, floatsPer);
      const colors = new Float32Array(buf, floatsPer * 4 * 2, floatsPer).slice();
      for (let i = 0; i < colors.length; i++) colors[i] = srgbToLinear(colors[i]);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geo.translate(0.0064, -0.6451, 0.038);
      geo.scale(1.55, 1.55, 1.55);

      const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55, metalness: 0.05 });
      mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -0.15;
      scene.add(mesh);
    } catch {
      setFailed(true);
      return () => {
        disposed = true;
        window.removeEventListener("resize", resize);
        renderer.dispose();
        if (stage.contains(renderer.domElement)) stage.removeChild(renderer.domElement);
      };
    }

    const onDown = (x: number, y: number) => {
      dragging = true;
      lastX = x;
      lastY = y;
    };
    const onMove = (x: number, y: number) => {
      if (!dragging) return;
      targetTiltY += (x - lastX) * 0.01;
      targetTiltX += (y - lastY) * 0.01;
      targetTiltX = Math.max(-1, Math.min(1, targetTiltX));
      lastX = x;
      lastY = y;
    };
    const onUp = () => {
      dragging = false;
    };

    const el = renderer.domElement;
    const downHandler = (e: PointerEvent) => {
      onDown(e.clientX, e.clientY);
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        /* some mobile browsers reject capture on touch-cancel-prone gestures */
      }
    };
    const moveHandler = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      onMove(e.clientX, e.clientY);
    };
    el.addEventListener("pointerdown", downHandler);
    el.addEventListener("pointermove", moveHandler);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    // A touch gesture can end in "cancel" instead of "up" (e.g. the OS steals
    // it for a scroll/back-swipe) — without this, dragging gets stuck true and
    // the mark freezes in place forever on mobile.
    el.addEventListener("pointercancel", onUp);
    document.addEventListener("visibilitychange", onUp);

    // The mark's idle spin is small, slow and non-parallax, so it stays on even
    // under prefers-reduced-motion — only the drag-response follows the pointer.
    function tick() {
      raf = requestAnimationFrame(tick);
      if (!dragging) autorotate += 0.006;
      if (mesh) {
        mesh.rotation.y += (targetTiltY + autorotate - mesh.rotation.y) * 0.08;
        mesh.rotation.x += (targetTiltX - mesh.rotation.x) * 0.08;
      }
      renderer.render(scene, camera);
    }
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onUp);
      renderer.dispose();
      if (stage.contains(renderer.domElement)) stage.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="mark-stage" ref={stageRef} aria-hidden="true">
      {failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="mark-fallback" src="/logo.png" alt="" />
      )}
    </div>
  );
}
