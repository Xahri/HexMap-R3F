import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from "react";

export function Foliage({ foliageArr, season }) {
  const { nodes: stlNodes } = useGLTF('/SummerTreeLeaves.glb');
  const { nodes: sttNodes } = useGLTF('/SummerTreeTrunk.glb');
  
  useEffect(() => {
    useGLTF.preload('/SummerTreeLeaves.glb')
    useGLTF.preload('/SummerTreeTrunk.glb')
  }, []);

  // Show foliage after 300ms, after the grid scale animation is over.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShow(true);
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const min = 0.2;
  const max = 0.6;

  if (!show) {
    return null;
  }

  return (
    <>
      {foliageArr.map((point, index) => {
        const scale = Math.random() * (max - min) + min;
        const randomLightness = season === "Summer" ? Math.random() * (0.4 - 0.35) + 0.35 : Math.random() * (1 - 0.7) + 0.7;
        const treeColor = season === "Summer" ? `hsl(120, 12%, ${randomLightness * 100}%)` : `hsl(0, 0%, ${randomLightness * 100}%)`;
        return (
          <group key={index} position={point}>
            <mesh
              castShadow
              receiveShadow
              geometry={stlNodes.SummerTreeLeaves.geometry}
              scale={scale}
              position={[0, 0, 0]}
            >
              <meshStandardMaterial color={treeColor} roughness={0.8} metalness={0.1} />
            </mesh>
            <mesh
              castShadow
              receiveShadow
              geometry={sttNodes.SummerTreeTrunk.geometry}
              scale={scale}
              position={[0, 0, 0]}
            >
              <meshStandardMaterial color={"#ac7339"} roughness={0.8} metalness={0.1} />
            </mesh>
          </group>
        )
      })}
    </>
  );
}