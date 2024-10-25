import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { BufferGeometry, Material, Mesh, MeshStandardMaterial, NormalBufferAttributes, Object3DEventMap } from 'three'
import { useEffect, useRef } from 'react'
import { TextureLoader } from "three";

const HeightMapScene = ({ inputTexture }: { inputTexture: string | null }) => {

  const mesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>(null)
  const material = useRef<MeshStandardMaterial>(null)

  useEffect(() => {
    if (inputTexture) {
      const textureLoader = new TextureLoader()
      textureLoader.load(inputTexture, (t) => {
        if (material.current) {
          material.current.displacementMap = t
          material.current.map = t
          material.current.needsUpdate = true
        }
      })
    }
  }, [inputTexture])
  return (
    <Canvas className='bg-black'>
      <mesh ref={mesh}>
        <sphereGeometry />
        {/* <meshPhongMaterial wireframe={true} /> */}
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} intensity={10} />
        <meshStandardMaterial ref={material} />
      </mesh>
      <OrbitControls autoRotate />
    </Canvas>
  )
}

export default HeightMapScene
