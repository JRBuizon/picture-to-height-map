import React, { useEffect, useRef, useState } from 'react'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { HeightMapModel } from './HeightMapModel'

const RESOLUTION = 500

const calculateHeight = (
  r: number,
  g: number,
  b: number,
  maxHeight: number,
) => {
  const maxPixelColor = 256 * 256 * 256
  const pixelColor = r * g * b

  return (pixelColor / maxPixelColor) * maxHeight
}

const HeightMapScene = ({ inputImage }: { inputImage: string | null }) => {
  const [imageData, setImageData] = useState<ImageData | undefined>(undefined)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const data = ctx?.getImageData(0, 0, canvas.width, canvas.height, {
          colorSpace: 'srgb',
        })
        console.log(data)
        setImageData(data)
      }
      img.src = inputImage ? inputImage : ''
    }
  }, [inputImage])

  const camera = new THREE.PerspectiveCamera()
  camera.far = 5000
  camera.position.set(-RESOLUTION/15, RESOLUTION/15, -RESOLUTION/15)

  const plane =
    useRef<
      THREE.Mesh<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.Material | THREE.Material[],
        THREE.Object3DEventMap
      >
    >(null)
  const mesh = useRef<THREE.MeshStandardMaterial>(null)

  return (
    <div className='w-full h-full'>
      <canvas
        className='hidden'
        ref={canvasRef}
        width={RESOLUTION}
        height={RESOLUTION}
      />
      <Canvas shadows className='bg-black' camera={camera}>
      { inputImage && imageData ? <HeightMapModel
        calculateHeight={calculateHeight}
        data={imageData}
        resolution={RESOLUTION}
      /> : '' }
        <axesHelper args={[RESOLUTION]} />
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[200, 200, 200]}
          intensity={5}
          shadow-mapSize={[1024, 1024]}
          castShadow
        >
          <orthographicCamera
            attach='shadow-camera'
            args={[-100, 100, 100, -100]}
          />
        </directionalLight>
        <directionalLight
          position={[0, 200, 0]}
          intensity={2}
          shadow-mapSize={[1024, 1024]}
          castShadow
        >
          <orthographicCamera
            attach='shadow-camera'
            args={[-100, 100, 100, -100]}
          />
        </directionalLight>
      </Canvas>
    </div>
  )
}

export default HeightMapScene
