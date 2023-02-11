import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import { DirectionalLightHelper } from "three";
import { PointLightHelper } from "three";
import { useControls } from 'leva'

export default function Lights() {
  const ref = useRef();
  const refP = useRef();

   useHelper(ref, DirectionalLightHelper);
   useHelper(refP, PointLightHelper);

   const controls = useControls({
    Shadows: false
  });

  return (
    <group>
      
        <ambientLight intensity={2} position={[0, 10, 10]} />
        <ambientLight intensity={0.4} />

        {controls.Shadows ? (
          <pointLight
            ref={refP}
            position={[40, 30, -20]}
            intensity={8000}
            color={"#FFE0BB"}
            castShadow
            shadowBias={-0.0002}
            shadowMapSizeHeight={512 * 4}
            shadowMapSizeWidth={512 * 4}
          />
        ) : (
          <pointLight
            ref={refP}
            position={[40, 30, -20]}
            intensity={8000}
            color={"#FFE0BB"}
          />
        )}

    </group>
  );
}