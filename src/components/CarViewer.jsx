import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import { useCarStore } from '../state/useCarStore'
import { PAINT_OPTIONS, ENVIRONMENT_OPTIONS } from '../config/carOptions'

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

function CarModel({ paintColor }) {
  const { scene } = useGLTF('/models/gt2rs.glb')

  scene.traverse((child) => {
    if (child.isMesh && child.material?.name?.toLowerCase().includes('paint')) {
      child.material = child.material.clone()
      child.material.color.set(paintColor)
    }
  })

  return <primitive object={scene} scale={1} position={[0, -0.5, 0]} />
}

export default function CarViewer({ onRendererReady }) {
  const { paint, environment } = useCarStore()
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
        <CarModel paintColor={paintColor} />
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
