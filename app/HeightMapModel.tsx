import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import heightMapVertexShader from './shaders/heightMapVertexShader.glsl'
import heightMapFragmentShader from './shaders/heightMapFragmentShader.glsl'
import * as THREE from 'three'


const HeightMapModel = ({ imagePath, resolution  }: { imagePath: string, resolution: number  }) => {
  const clock = new THREE.Clock()
  const shader = useRef<THREE.ShaderMaterial>(null)

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(imagePath, (texture) => {
      if (shader.current) shader.current.uniforms.u_texture.value = texture
    })
  }, [imagePath])

  const uniforms = useMemo(() => ({
    u_texture: {value: null},
    u_maxHeight: {value: 100},
    u_elapsedTime: {value: 0}
  }), [])
  
  useFrame(() => {
    uniforms.u_elapsedTime.value = clock.getElapsedTime()
    if (shader.current) shader.current.uniforms.u_elapsedTime.value = clock.getElapsedTime()
  })

  return (
    <mesh
      rotation={[Math.PI / 2, 0, 5]}
      scale={[0.1, 0.1, 0.1]}
      receiveShadow
      castShadow
    >
      <planeGeometry args={[100, 100, resolution - 1, resolution - 1]} />
      <shaderMaterial
        ref={shader}
        uniforms={uniforms}
        vertexShader={heightMapVertexShader}
        fragmentShader={heightMapFragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export { HeightMapModel }
