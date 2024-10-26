import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

const generateHeightMap = () => {
  // create html image
  return new Promise<Array<number>>((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 1000, 1000)
      const imageData = ctx?.getImageData(0, 0, 1000, 1000, {
        colorSpace: 'srgb',
      })
      resolve(imageData)
    }
    img.src = '/denali.png'
  })
}

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

const HeightMapScene = () => {
  const camera = new THREE.PerspectiveCamera()
  camera.far = 5000
  camera.position.set(-110, 102.5, -105)

  const vmapTemp = new Array(1000).fill(0)
  const vmap = vmapTemp.map(() => new Array(1000))

  const plane = useRef()

  React.useEffect(() => {
    const data = generateHeightMap()
    data.then((value) => {
      for (let y = 0; y < 1000; y++) {
        for (let x = 0; x < 1000; x++) {
          const index = (x + y * 1000) * 4
          const index_vertex = (x + y * 1000) * 3
          const r = value.data[index]
          const g = value.data[index + 1]
          const b = value.data[index + 2]

          const height = calculateHeight(r, g, b, 500)
          vmap[y][x] = height
          plane.current.geometry.attributes.position.array[index_vertex + 2] =
            -height
          plane.current.geometry.attributes.position.needsUpdate = true
        }
      }
    })
  }, [])

  return (
    <Canvas shadows className='bg-black' camera={camera}>
      <mesh
        rotation={[Math.PI / 2, 0, 5]}
        ref={plane}
        scale={[0.1, 0.1, 0.1]}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[1000, 1000, 999, 999]} />
        <meshStandardMaterial
          wireframe={false}
          color='#3f7b9d'
          side={THREE.DoubleSide}
        />
      </mesh>
      <axesHelper args={[1000]} />
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
  )
}

export default HeightMapScene
