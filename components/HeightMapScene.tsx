import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const HeightMapScene = () => {
  return (
    <Canvas className='bg-black'>
      <mesh>
        <sphereGeometry />
        <meshPhongMaterial wireframe={true} />
        <ambientLight intensity={0.2} />
        <spotLight position={[5, 5, 5]} intensity={10} />
      </mesh>
      <OrbitControls />
    </Canvas>
  )
}

export default HeightMapScene
