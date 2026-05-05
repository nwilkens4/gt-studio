import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import { useCarStore } from '../state/useCarStore'
import { PAINT_OPTIONS, ENVIRONMENT_OPTIONS } from '../config/carOptions'

const RIM_MATERIALS = {
  0: { metalness: 0.6, roughness: 0.3 },   // Stock GT2 RS
  1: { metalness: 0.8, roughness: 0.1 },   // Cup 2 Spoke (polished)
  2: { metalness: 0.7, roughness: 0.2 },   // Turbo Twist
  3: { metalness: 0.4, roughness: 0.5 },   // Carrera Classic
  4: { metalness: 0.3, roughness: 0.8 },   // Matte Black Sport
  5: { metalness: 1.0, roughness: 0.05 },  // Chrome Sport
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
  const { paint, rims, bodyKit, environment } = useCarStore()
  const paintColor = PAINT_OPTIONS[paint.index].color
  const envOption = ENVIRONMENT_OPTIONS[environment.index]

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [3, 1.2, 3], fov: 45 }}
      style={{ background: '#000000' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {envOption.preset && <Environment preset={envOption.preset} />}

      <Suspense fallback={<LoadingBar />}>
        <CarModel paintColor={paintColor} rimIndex={rims.index} bodyKitIndex={bodyKit.index} />
      </Suspense>

      <OrbitControls
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
