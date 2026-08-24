import React, { useEffect, useRef, useState } from "react";
import { Renderer, Camera, Transform, Texture, Program, Geometry, Mesh } from "ogl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

// Types
interface Perspective {
  title: string;
  description?: string;
  position: "top" | "top-left" | "left" | "center" | "top-right" | "bottom" | "bottom-left" | "bottom-right";
}

interface ParticleUserData {
  baseAngle: number;
  angleSpan: number;
  baseY: number;
  speed: number;
  radius: number;
}

type ParticleMesh = Mesh & { userData: ParticleUserData };

interface ExplorationsProps {
  isActive?: boolean;
  isViewActive?: boolean;
}

// Cohesive project imagery representing web development and digital experiences
const images = [
  "/gym.png",
  "/compass2.png",
  "/fabric.png",
  "/freelance_agency_1787475751822.jpg",
  "/f.shop.png",
  "/gym.png",
  "/compass2.png",
  "/fabric.png",
  "/freelance_agency_1787475751822.jpg",
  "/f.shop.png",
];

// Re-themed captions reflecting premium creative coding & digital experiences
const perspectives: Perspective[] = [
  {
    title: "Interactive Interfaces",
    description: "Crafting memorable digital narratives",
    position: "top",
  },
  {
    title: "Creative Technology",
    description: "Where code meets aesthetic design",
    position: "center",
  },
  {
    title: "Robust Engineering",
    description: "Building fast, scalable web systems",
    position: "center",
  },
  {
    title: "Digital Experiences",
    description: "Elevating brands through technology",
    position: "bottom",
  },
];

const cylinderConfig = {
  radius: window.innerWidth > 768 ? 2.5 : 2.2,
  height: window.innerWidth > 768 ? 2 : 1.2,
  radialSegments: 64,
  heightSegments: 1,
};

const particleConfig = {
  numParticles: 12,
  particleRadius: 3.3, // cylinderRadius + 0.8
  segments: 20,
  angleSpan: 0.3,
};

const imageConfig = {
  width: 1024,
  height: 1024,
};

// Shaders
const cylinderVertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec3 position;
  
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const cylinderFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D tMap;
  uniform float uDarkness;

  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(tMap, vUv);
    tex.rgb *= (1.0 - uDarkness);
    gl_FragColor = tex;
  }
`;

const particleVertex = /* glsl */ `
  attribute vec3 position;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const particleFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

// Helper functions
function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;

  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = img.naturalWidth;
  let sourceHeight = img.naturalHeight;

  if (imgRatio > canvasRatio) {
    sourceWidth = img.naturalHeight * canvasRatio;
    sourceX = (img.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = img.naturalWidth / canvasRatio;
    sourceY = (img.naturalHeight - sourceHeight) / 2;
  }

  ctx.save();
  ctx.translate(x, y + h);
  ctx.scale(1, -1);
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, w, h);
  ctx.restore();
}

function getPositionClasses(position: Perspective["position"]): string {
  switch (position) {
    case "top":
      return "top-24 left-1/2 -translate-x-1/2 max-md:top-[25vh]";
    case "top-left":
      return "top-24 left-20";
    case "left":
      return "left-20 top-1/2 -translate-y-1/2";
    case "center":
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
    case "top-right":
      return "top-24 right-20 max-md:top-12 max-md:right-12 flex flex-col items-end";
    case "bottom":
      return "bottom-24 left-1/2 -translate-x-1/2 text-center max-md:px-6";
    case "bottom-left":
      return "bottom-24 left-20 max-md:bottom-[10vh] max-md:left-6 flex flex-col items-start text-left";
    case "bottom-right":
      return "bottom-24 right-20 max-md:bottom-12 max-md:right-12 flex flex-col items-end text-right";
    default:
      return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
  }
}

function createCylinderGeometry(gl: any, config: any) {
  const { radius, height, radialSegments, heightSegments } = config;

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let y = 0; y <= heightSegments; y++) {
    const v = y / heightSegments;
    const yPos = (v - 0.5) * height;

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;

      const xPos = Math.cos(theta) * radius;
      const zPos = Math.sin(theta) * radius;

      positions.push(xPos, yPos, zPos);
      uvs.push(u, 1 - v);
    }
  }

  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < radialSegments; x++) {
      const a = y * (radialSegments + 1) + x;
      const b = a + radialSegments + 1;
      const c = a + 1;
      const d = b + 1;

      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }

  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(positions) },
    uv: { size: 2, data: new Float32Array(uvs) },
    index: { data: new Uint16Array(indices) },
  });
}

function createParticleGeometry(
  gl: any,
  config: any,
  index: number,
  height: number
) {
  const { numParticles, particleRadius, segments, angleSpan } = config;

  const linePositions: number[] = [];
  const startAngle = (index / numParticles) * Math.PI * 2;

  const isTopHalf = index < numParticles / 2;
  const yPosition = isTopHalf
    ? height * 0.7 + Math.random() * height * 0.3
    : -height * 1.0 + Math.random() * height * 0.3;

  for (let j = 0; j <= segments; j++) {
    const t = j / segments;
    const angle = startAngle + angleSpan * t;
    const x = Math.cos(angle) * particleRadius;
    const z = Math.sin(angle) * particleRadius;

    linePositions.push(x, yPosition, z);
  }

  return {
    geometry: new Geometry(gl, {
      position: { size: 3, data: new Float32Array(linePositions) },
    }),
    userData: {
      baseAngle: startAngle,
      angleSpan: angleSpan,
      baseY: yPosition,
      speed: 0.5 + Math.random() * 1.0,
      radius: particleRadius,
    },
  };
}

export default function Explorations({ isActive }: ExplorationsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<Transform | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const cylinderRef = useRef<Mesh | null>(null);
  
  const cameraAnimRef = useRef({ x: 0, y: 0, z: 8, rotY: 0 });
  const particlesRef = useRef<ParticleMesh[]>([]);
  const lastRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumRef = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    
    // Register custom curves for cinematic feel
    CustomEase.create("cinematicSilk", "0.45, 0.05, 0.55, 0.95");
    CustomEase.create("cinematicSmooth", "0.25, 0.1, 0.25, 1");
    CustomEase.create("cinematicFlow", "0.33, 0, 0.2, 1");
    CustomEase.create("cinematicLinear", "0.4, 0, 0.6, 1");
  }, []);

  // Force ScrollTrigger measurements refresh when page tab goes display: block
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.disable(gl.CULL_FACE);
    rendererRef.current = renderer;

    const getResponsiveDimensions = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;

      const maxRadius = isMobile ? 1.8 : isTablet ? 2.2 : 2.5;
      const cylinderHeight = isMobile ? 0.8 : isTablet ? 1.0 : 1.2;
      const cameraZ = isMobile ? 6 : isTablet ? 7 : 8;
      const fov = isMobile ? 50 : 45;

      return {
        cylinderScale: maxRadius / cylinderConfig.radius,
        cylinderHeight,
        cameraZ,
        fov,
        isMobile,
      };
    };

    const dimensions = getResponsiveDimensions();

    const cameraOptions: any = { fov: dimensions.fov };
    if (dimensions.isMobile) {
      cameraOptions.aspect = window.innerWidth / window.innerHeight;
    }
    const camera = new Camera(gl, cameraOptions);
    camera.position.set(0, 0, dimensions.cameraZ);
    cameraRef.current = camera;

    const scene = new Transform();
    sceneRef.current = scene;

    const geometry = createCylinderGeometry(gl, cylinderConfig);

    const hardwareLimit = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    const isMobileDevice = window.innerWidth < 768;
    const safeLimit = isMobileDevice ? 2048 : Math.min(hardwareLimit, 8192);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: false, alpha: false })!;
    const numImages = images.length;

    const totalWidthOriginal = imageConfig.width * numImages;
    const heightOriginal = imageConfig.height;

    const scale = Math.min(1, safeLimit / totalWidthOriginal);

    canvas.width = Math.floor(totalWidthOriginal * scale);
    canvas.height = Math.floor(heightOriginal * scale);

    let loadedImages = 0;
    const imageElements: HTMLImageElement[] = [];

    const circumference = 2 * Math.PI * cylinderConfig.radius;
    const textureAspectRatio = imageConfig.height / (imageConfig.width * images.length);
    const idealHeight = circumference * textureAspectRatio;
    const heightCorrection = idealHeight / cylinderConfig.height;

    let lastWidth = window.innerWidth;

    const handleResize = () => {
      if (rendererRef.current && cameraRef.current && cylinderRef.current) {
        const currentWidth = window.innerWidth;
        const newDimensions = getResponsiveDimensions();

        if (newDimensions.isMobile && currentWidth === lastWidth) {
          return;
        }
        lastWidth = currentWidth;

        rendererRef.current.setSize(currentWidth, window.innerHeight);

        cameraRef.current.perspective({
          fov: newDimensions.fov,
          aspect: currentWidth / window.innerHeight,
        });

        if (newDimensions.isMobile) {
          cylinderRef.current.scale.set(
            newDimensions.cylinderScale,
            newDimensions.cylinderScale * heightCorrection,
            newDimensions.cylinderScale
          );
        } else {
          cylinderRef.current.scale.set(
            newDimensions.cylinderScale,
            newDimensions.cylinderScale,
            newDimensions.cylinderScale
          );
        }

        if (cameraAnimRef.current.z === 8 || cameraAnimRef.current.z === 7 || cameraAnimRef.current.z === 6) {
          cameraAnimRef.current.z = newDimensions.cameraZ;
        }
      }
    };

    images.forEach((imageSrc, index) => {
      const img = new Image();
      img.onload = () => {
        imageElements[index] = img;
        loadedImages++;

        const totalCanvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        if (loadedImages === numImages) {
          imageElements.forEach((img, i) => {
            const xStartExact = (i / numImages) * totalCanvasWidth;
            const xEndExact = ((i + 1) / numImages) * totalCanvasWidth;

            const xPos = Math.floor(xStartExact);
            const xEnd = Math.floor(xEndExact);
            const drawWidthActual = xEnd - xPos;
            
            const gap = 60; // Reduced gap between screens

            drawImageCover(
              ctx,
              img,
              xPos + (gap / 2),
              0,
              drawWidthActual - gap,
              canvasHeight
            );
          });

          const texture = new Texture(gl, {
            wrapS: gl.CLAMP_TO_EDGE,
            wrapT: gl.CLAMP_TO_EDGE,
            minFilter: gl.LINEAR,
            magFilter: gl.LINEAR,
            generateMipmaps: false,
          });

          texture.image = canvas;
          texture.needsUpdate = true;

          const program = new Program(gl, {
            vertex: cylinderVertex,
            fragment: cylinderFragment,
            uniforms: {
              tMap: { value: texture },
              uDarkness: { value: 0.3 },
            },
            cullFace: null,
          });

          const cylinder = new Mesh(gl, { geometry, program });
          cylinder.setParent(scene);
          cylinder.rotation.y = 0.5;
          cylinder.scale.set(dimensions.cylinderScale, dimensions.cylinderScale, dimensions.cylinderScale);
          cylinderRef.current = cylinder;

          setIsLoading(false);

          // Configure ScrollTrigger camera positions relative to the slide container
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              scroller: document.getElementById("page-container-1") || window,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.6, // Slightly faster response (down from 2.2)
            },
          });
          
          tl.to(cameraAnimRef.current, {
            x: 0,
            y: 0,
            z: dimensions.cameraZ,
            duration: 1,
            ease: "cinematicSilk",
          })
            .to(cameraAnimRef.current, {
              x: 0,
              y: 5,
              z: 5,
              duration: 1,
              ease: "cinematicFlow",
            })
            .to(cameraAnimRef.current, {
              x: 1.5,
              y: 2,
              z: 2,
              duration: 2,
              ease: "cinematicLinear",
            })
            .to(cameraAnimRef.current, {
              x: 0.5,
              y: 0,
              z: 0.8,
              duration: 3.5,
              ease: "power1.inOut",
            })
            .to(cameraAnimRef.current, {
              x: -6,
              y: -1,
              z: dimensions.cameraZ,
              duration: 1,
              ease: "cinematicSmooth",
            });

          tl.to(
            cylinderRef.current.rotation,
            {
              y: "+=28.27",
              duration: 8.5,
              ease: "none",
            },
            0
          );

          // Configure text visibility timelines with higher scrub (1.1s) for smooth fades
          textRefs.current.forEach((textEl, idx) => {
            if (!textEl) return;

            const sectionDuration = 100 / perspectives.length;
            const start = idx * sectionDuration;
            const end = (idx + 1) * sectionDuration;

            const textTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                scroller: "#page-container-1",
                start: `${start}% top`,
                end: `${end}% top`,
                scrub: 1.1, // Faster fade updates (down from 1.5)
              },
            });

            textTimeline
              .fromTo(
                textEl,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.2,
                  ease: "cinematicSmooth",
                }
              )
              .to(textEl, {
                opacity: 1,
                duration: 0.6,
                ease: "none",
              })
              .to(textEl, {
                opacity: 0,
                duration: 0.2,
                ease: "cinematicSmooth",
              });
          });
          
          // Create WebGL orbit lines/particles
          for (let i = 0; i < particleConfig.numParticles; i++) {
            const { geometry: lineGeometry, userData } = createParticleGeometry(
              gl,
              particleConfig,
              i,
              cylinderConfig.height
            );

            const lineProgram = new Program(gl, {
              vertex: particleVertex,
              fragment: particleFragment,
              uniforms: {
                uColor: { value: [1.0, 1.0, 1.0] },
                uOpacity: { value: 0.0 },
              },
              transparent: true,
              depthTest: true,
            });

            const particle = new Mesh(gl, {
              geometry: lineGeometry,
              program: lineProgram,
              mode: gl.LINE_STRIP,
            }) as ParticleMesh;

            particle.userData = userData;
            particle.setParent(scene);
            particlesRef.current.push(particle);
          }

          window.addEventListener("resize", handleResize);

          let animationFrameId: number;
          const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            camera.position.set(cameraAnimRef.current.x, cameraAnimRef.current.y, cameraAnimRef.current.z);
            camera.lookAt([0, 0, 0]);

            if (cylinderRef.current) {
              const currentRotation = cylinderRef.current.rotation.y;
              velocityRef.current = currentRotation - lastRotationRef.current;
              lastRotationRef.current = currentRotation;

              const inertiaFactor = 0.15;
              const decayFactor = 0.92;

              momentumRef.current = momentumRef.current * decayFactor + velocityRef.current * inertiaFactor;

              const speed = Math.abs(velocityRef.current) * 100;
              const isRotating = Math.abs(velocityRef.current) > 0.0001;

              particlesRef.current.forEach((particle) => {
                const userData = particle.userData;

                const targetOpacity = isRotating ? Math.min(speed * 3, 0.95) : 0;
                const currentOpacity = particle.program.uniforms.uOpacity.value as number;
                particle.program.uniforms.uOpacity.value = currentOpacity + (targetOpacity - currentOpacity) * 0.15;

                if (isRotating) {
                  const rotationOffset = velocityRef.current * userData.speed * 1.5;
                  const newBaseAngle = userData.baseAngle + rotationOffset;
                  userData.baseAngle = newBaseAngle;

                  const segments = particleConfig.segments;
                  const positions = particle.geometry.attributes.position.data as Float32Array;

                  for (let j = 0; j <= segments; j++) {
                    const t = j / segments;
                    const angle = newBaseAngle + userData.angleSpan * t;
                    const radiusWithSpeed = userData.radius;

                    positions[j * 3] = Math.cos(angle) * radiusWithSpeed;
                    positions[j * 3 + 1] = userData.baseY;
                    positions[j * 3 + 2] = Math.sin(angle) * radiusWithSpeed;
                  }

                  particle.geometry.attributes.position.needsUpdate = true;
                }
              });
            }

            renderer.render({ scene, camera });
          };
          animate();

          // Clean up loop frame on unmount
          return () => {
            cancelAnimationFrame(animationFrameId);
          };
        }
      };
      img.src = imageSrc;
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative w-full select-none" style={{ background: "#000000", height: "400vh" }} ref={containerRef}>
      
      {/* Sticky container that stays on screen for 400vh */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden">
        {/* OGL canvas */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
        </div>

        {/* Floating typography overlays */}
        <div className="absolute inset-0 pointer-events-none z-10 text-white">
          {perspectives.map((perspective, index) => (
            <div
              key={index}
              ref={(el) => {
                textRefs.current[index] = el;
              }}
              className={`absolute text-center opacity-0 max-md:w-full ${getPositionClasses(perspective.position)}`}
            >
              <h2 className="text-5xl md:text-7xl font-light font-display italic leading-tight tracking-tight text-white drop-shadow-lg">
                {perspective.title}
              </h2>
              {perspective.description && (
                <p className="text-base md:text-xl font-light font-sans text-white/50 tracking-wide mt-2 drop-shadow-md">
                  {perspective.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Scroll indicator overlay */}
        <div className="absolute bottom-8 right-8 z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/60"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Scroll</span>
          </div>
        </div>
      </div>
    </div>
  );
}
