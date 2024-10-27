import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTimer } from "use-timer";
import * as THREE from "three";

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

const HeightMapModel = ({ data, resolution }: { data: ImageData, resolution: number }) => {
  const [vmap, setVmap] = useState<number[][]>([[]]);

  const plane =
    useRef<
      THREE.Mesh<
        THREE.BufferGeometry<THREE.NormalBufferAttributes>,
        THREE.Material | THREE.Material[],
        THREE.Object3DEventMap
      >
    >(null)

  const { start, status } = useTimer({
    initialTime: 0,
    endTime: 100,
  });

  React.useEffect(() => {
    console.log('rerunning useeffect')
    const mapTemp = new Array(resolution).fill(0);
    const map = mapTemp.map(() => new Array(resolution));
    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const index = (x + y * resolution) * 4;
        const r = data.data[index];
        const g = data.data[index + 1];
        const b = data.data[index + 2];

        const height = calculateHeight(r, g, b, 200);
        map[y][x] = -height;
      }
    }
    setVmap(map);
    start();
  }, [data, resolution, start]);

  useFrame(() => {
    if (status === "RUNNING" && plane.current) {
      for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
          const index = (x + y * resolution) * 3;
          if (
            plane.current.geometry.attributes.position.array[index + 2] >
            vmap[y][x]
          ) {
            plane.current.geometry.attributes.position.array[index + 2]--;
          }
          if (
            plane.current.geometry.attributes.position.array[index + 2] <
            vmap[y][x]
          ) {
            plane.current.geometry.attributes.position.array[index + 2]++;
          }
        }
      }
      plane.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <mesh
      rotation={[Math.PI / 2, 0, 5]}
      ref={plane}
      scale={[0.1, 0.1, 0.1]}
      receiveShadow
      castShadow
    >
      <planeGeometry args={[250, 250, resolution - 1, resolution - 1]} />
      <meshStandardMaterial
        wireframe={false}
        color="#FFA500"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export { HeightMapModel };
