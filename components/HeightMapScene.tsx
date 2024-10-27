import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
// import { TextureLoader } from "three";
import * as THREE from 'three'
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
        setImageData(data)
      }
      img.src = inputImage ? inputImage : ''
    }
  }, [inputImage])

  const camera = new THREE.PerspectiveCamera()
  camera.far = 5000
  camera.position.set(-110, 102.5, -105)

  const vmapTemp = new Array(RESOLUTION).fill(0)
  const vmap = vmapTemp.map(() => new Array(RESOLUTION))

  const plane = useRef<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>(null)
  const mesh = useRef<THREE.MeshStandardMaterial>(null)
  useEffect(() => {
    if (imageData && plane.current) {
      for (let y = 0; y < RESOLUTION; y++) {
        for (let x = 0; x < RESOLUTION; x++) {
          const index = (x + y * RESOLUTION) * 4
          const index_vertex = (x + y * RESOLUTION) * 3
          const r = imageData.data[index]
          const g = imageData.data[index + 1]
          const b = imageData.data[index + 2]
          const height = calculateHeight(r, g, b, 500)
          vmap[y][x] = height
          plane.current.geometry.attributes.position.array[index_vertex + 2] =
            -height
          plane.current.geometry.attributes.position.needsUpdate = true
        }
      }
    }
  }, [imageData, vmap])

  return (
    <div className='w-full h-full'>
      <canvas className='hidden' ref={canvasRef} width={RESOLUTION} height={RESOLUTION} />
      <Canvas shadows className='bg-black' camera={camera}>
        <mesh
          rotation={[Math.PI / 2, 0, 5]}
          ref={plane}
          scale={[0.1, 0.1, 0.1]}
          receiveShadow
          castShadow
        >
          <planeGeometry args={[RESOLUTION, RESOLUTION, RESOLUTION - 1, RESOLUTION - 1]} />
          <meshStandardMaterial
            wireframe={false}
            color='#3f7b9d'
            side={THREE.DoubleSide}
            ref={mesh}
          />
        </mesh>
        <axesHelper args={[RESOLUTION]} />
        <OrbitControls />
        <ambientLight intensity={0.3} />
        <hemisphereLight intensity={0.3} castShadow />
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
      </Canvas>
    </div>
  )
}

export default HeightMapScene;
