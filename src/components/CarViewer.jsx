import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCarStore } from '../state/useCarStore'
import { PAINT_OPTIONS, ENVIRONMENT_OPTIONS, WEATHER_OPTIONS, CAMERA_OPTIONS } from '../config/carOptions'

const RIM_MATERIALS = {
  0: { metalness: 0.6, roughness: 0.3 },   // Stock GT2 RS
  1: { metalness: 0.8, roughness: 0.1 },   // Cup 2 Spoke (polished)
  2: { metalness: 0.7, roughness: 0.2 },   // Turbo Twist
  3: { metalness: 0.4, roughness: 0.5 },   // Carrera Classic
  4: { metalness: 0.3, roughness: 0.8 },   // Matte Black Sport
  5: { metalness: 1.0, roughness: 0.05 },  // Chrome Sport
}

const WEATHER_LIGHTING = {
  clear:    { ambientIntensity: 0.4, dirIntensity: 1.0, dirColor: '#ffffff', fog: false },
  golden:   { ambientIntensity: 0.6, dirIntensity: 1.5, dirColor: '#ffaa44', fog: false },
  overcast: { ambientIntensity: 0.8, dirIntensity: 0.3, dirColor: '#aabbcc', fog: true  },
  rain:     { ambientIntensity: 0.3, dirIntensity: 0.2, dirColor: '#8899aa', fog: true  },
  sunset:   { ambientIntensity: 0.5, dirIntensity: 1.2, dirColor: '#ff6633', fog: false },
}

function SceneLighting({ weatherId }) {
  const w = WEATHER_LIGHTING[weatherId] || WEATHER_LIGHTING.clear
  return (
    <>
      <ambientLight intensity={w.ambientIntensity} />
      <directionalLight position={[5, 5, 5]} intensity={w.dirIntensity} color={w.dirColor} />
      {w.fog && <fog attach="fog" args={['#334455', 10, 30]} />}
    </>
  )
}

function CameraRig({ cameraIndex }) {
  const { camera } = useThree()
  const target = CAMERA_OPTIONS[cameraIndex]
  const targetPos = new THREE.Vector3(...target.position)

  useFrame(() => {
    camera.position.lerp(targetPos, 0.05)
    camera.lookAt(...target.target)
  })

  return null
}

function LoadingBar() {
  const { progress } = useProgress()
  return (
    <Html fullscreen>
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Html>
  )
}

function ScreenshotCapture({ onRendererReady }) {
  const { gl } = useThree()
  useEffect(() => { onRendererReady(gl) }, [gl, onRendererReady])
  return null
}

// No separate aero/body kit meshes exist in the GLB — body kit visibility toggling is skipped.
// The GLB has no nodes/materials matching splitter, spoiler, wing, skirt, diffuser, bumper, lip, or aero.

function CarModel({ paintColor, rimIndex, bodyKitIndex }) {
  const { scene } = useGLTF('/models/gt2rs.glb')
  const rimProps = RIM_MATERIALS[rimIndex] ?? RIM_MATERIALS[0]

  scene.traverse((child) => {
    if (!child.isMesh) return

    const matName = child.material?.name?.toLowerCase() ?? ''

    // Apply paint color to paint materials
    if (matName.includes('paint')) {
      child.material = child.material.clone()
      child.material.color.set(paintColor)
    }

    // Apply rim metalness/roughness to rim materials (Rims.FL, Rims.FL.001, etc.)
    if (matName.startsWith('rims.')) {
      child.material = child.material.clone()
      child.material.metalness = rimProps.metalness
      child.material.roughness = rimProps.roughness
    }
  })

  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />
}

export default function CarViewer({ onRendererReady }) {
  const { paint, rims, bodyKit, environment, weather, camera: cameraState } = useCarStore()
  const paintColor = PAINT_OPTIONS[paint.index].color
  const envOption = ENVIRONMENT_OPTIONS[environment.index]
  const weatherId = WEATHER_OPTIONS[weather.index].id

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [3, 1.2, 3], fov: 45 }}
      style={{ background: '#000000' }}
    >
      <SceneLighting weatherId={weatherId} />

      {envOption.preset && <Environment preset={envOption.preset} />}

      <Suspense fallback={<LoadingBar />}>
        <CarModel paintColor={paintColor} rimIndex={rims.index} bodyKitIndex={bodyKit.index} />
      </Suspense>

      <CameraRig cameraIndex={cameraState.index} />

      <OrbitControls
        key={cameraState.index}
        enablePan={false}
        minDistance={2}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {onRendererReady && <ScreenshotCapture onRendererReady={onRendererReady} />}
    </Canvas>
  )
}
