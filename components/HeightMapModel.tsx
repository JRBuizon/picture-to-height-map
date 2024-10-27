import React, { useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTimer } from "use-timer";
import * as THREE from "three";

const HeightMapModel = ({ calculateHeight, data }) => {
  const [vmap, setVmap] = useState([]);

  const plane = React.useRef();

  const { time, start, pause, reset, status } = useTimer({
    initialTime: 4,
    endTime: 10,
  });

  React.useEffect(() => {
    const mapTemp = new Array(64).fill(0);
    const map = mapTemp.map(() => new Array(64));
    data.then((value) => {
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          const index = (x + y * 64) * 4;
          const r = value.data[index];
          const g = value.data[index + 1];
          const b = value.data[index + 2];

          const height = calculateHeight(r, g, b, 100);
          map[y][x] = -height;
        }
      }
      setVmap(map);
      start();
    });
  }, []);

  useFrame(() => {
    if (status === "RUNNING") {
      for (let y = 0; y < 64; y++) {
        for (let x = 0; x < 64; x++) {
          const index = (x + y * 64) * 3;
          if (
            plane.current.geometry.attributes.position.array[index + 2] >=
            vmap[y][x]
          ) {
            plane.current.geometry.attributes.position.array[index + 2]--;
          }
        }
      }
      console.log("running");
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
      <planeGeometry args={[200, 200, 63, 63]} />
      <meshStandardMaterial
        wireframe={false}
        color="#FFA500"
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export { HeightMapModel };
