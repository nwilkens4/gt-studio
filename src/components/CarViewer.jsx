import { Suspense, useEffect, useRef, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, useProgress, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useCarStore } from '../state/useCarStore'
import { CARS, PAINT_OPTIONS, FINISH_OPTIONS, ENVIRONMENT_OPTIONS, WEATHER_OPTIONS, CAMERA_OPTIONS, RIM_COLOR_OPTIONS } from '../config/carOptions'

const RIM_MATERIALS = {
  0: { metalness: 0.6, roughness: 0.3 },   // Standard
  1: { metalness: 0.8, roughness: 0.1 },   // Polished
  2: { metalness: 0.7, roughness: 0.2 },   // Brushed
  3: { metalness: 0.4, roughness: 0.5 },   // Satin
  4: { metalness: 0.3, roughness: 0.8 },   // Matte
  5: { metalness: 1.0, roughness: 0.05 },  // Chrome
}

const WEATHER_LIGHTING = {
  clear:    { ambientIntensity: 0.4, dirIntensity: 1.0, dirColor: '#ffffff', fog: false },
  golden:   { ambientIntensity: 0.6, dirIntensity: 1.5, dirColor: '#ffaa44', fog: false },
  overcast: { ambientIntensity: 0.8, dirIntensity: 0.3, dirColor: '#aabbcc', fog: true  },
  rain:     { ambientIntensity: 0.3, dirIntensity: 0.2, dirColor: '#8899aa', fog: true  },
  sunset:   { ambientIntensity: 0.5, dirIntensity: 1.2, dirColor: '#ff6633', fog: false },
}

function SceneLighting({ weatherId, hasEnv }) {
  const w = WEATHER_LIGHTING[weatherId] || WEATHER_LIGHTING.clear
  return (
    <>
      {hasEnv ? (
        // HDRI environment handles IBL — just a subtle fill to soften pitch-black shadows
        <ambientLight intensity={0.08} />
      ) : (
        // No HDRI — full manual 3-point lighting rig
        <>
          <ambientLight intensity={w.ambientIntensity} />
          <directionalLight position={[5, 8, 5]} intensity={w.dirIntensity} color={w.dirColor} />
          <directionalLight position={[-4, 3, -4]} intensity={w.dirIntensity * 0.35} color={w.dirColor} />
        </>
      )}
      {w.fog && <fog attach="fog" args={['#334455', 10, 30]} />}
    </>
  )
}

function CameraRig({ cameraIndex, orbitRef }) {
  const { camera } = useThree()

  useEffect(() => {
    if (!orbitRef.current) return
    const target = CAMERA_OPTIONS[cameraIndex]
    camera.position.set(...target.position)
    orbitRef.current.target.set(...target.target)
    orbitRef.current.update()
  }, [cameraIndex])

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

// Target longest horizontal dimension in world units — calibrated to match GT2RS at scale=1 (19.78 units)
const AUTO_FIT_SIZE = 20

function CarModel({ carConfig, paintColor, finishOpt, rimIndex, rimColor }) {
  const { scene } = useGLTF(carConfig.file)
  const rimProps = RIM_MATERIALS[rimIndex] ?? RIM_MATERIALS[0]
  const paintSet = new Set(carConfig.paintMaterials)
  const rimSet   = new Set(carConfig.rimMaterials)

  const [finalScale, finalPosition] = useMemo(() => {
    if (carConfig.scale != null) return [carConfig.scale, carConfig.position]
    const box    = new THREE.Box3().setFromObject(scene)
    const size   = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    const s      = AUTO_FIT_SIZE / (Math.max(size.x, size.z) || 1)
    return [s, [0, 0.5 - center.y * s, 0]]
  }, [scene, carConfig.id])

  scene.traverse((child) => {
    if (!child.isMesh) return
    const matName = child.material?.name ?? ''
    if (paintSet.has(matName)) {
      child.material = child.material.clone()
      child.material.color.set(paintColor)
      child.material.roughness = finishOpt.roughness
      child.material.metalness = finishOpt.metalness
    }
    if (rimSet.size > 0 && rimSet.has(matName)) {
      child.material = child.material.clone()
      child.material.color.set(rimColor)
      child.material.metalness = rimProps.metalness
      child.material.roughness = rimProps.roughness
    }
  })

  return <primitive object={scene} scale={finalScale} position={finalPosition} />
}

export default function CarViewer({ onRendererReady }) {
  const { car, paint, finish, rims, rimColor: rimColorState, environment, weather, camera: cameraState } = useCarStore()
  const carConfig  = CARS[car.index]
  const paintColor = PAINT_OPTIONS[paint.index].color
  const finishOpt  = FINISH_OPTIONS[finish.index]
  const rimColorVal = RIM_COLOR_OPTIONS[rimColorState.index].color
  const envOption  = ENVIRONMENT_OPTIONS[environment.index]
  const weatherId  = WEATHER_OPTIONS[weather.index].id
  const orbitRef = useRef()

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [12, 5, 12], fov: 45 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.85 }}
      style={{ background: '#000000' }}
    >
      <SceneLighting weatherId={weatherId} hasEnv={!!envOption.preset} />

      {envOption.preset && <Environment preset={envOption.preset} />}

      <Suspense fallback={<LoadingBar />}>
        <CarModel
          key={carConfig.id}
          carConfig={carConfig}
          paintColor={paintColor}
          finishOpt={finishOpt}
          rimIndex={rims.index}
          rimColor={rimColorVal}
        />
      </Suspense>

      <CameraRig cameraIndex={cameraState.index} orbitRef={orbitRef} />

      <OrbitControls
        ref={orbitRef}
        key={cameraState.index}
        enablePan={false}
        minDistance={2}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.5}
      />

      {onRendererReady && <ScreenshotCapture onRendererReady={onRendererReady} />}
    </Canvas>
  )
}
