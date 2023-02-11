import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Stats, Environment } from "@react-three/drei";
import { PCFSoftShadowMap, sRGBEncoding } from "three";
import { useState, Suspense } from "react";
import { useControls } from 'leva'

import useHexGridPoints from "./hooks/useHexGridPoints";
import HexGrid from "./components/HexGrid";
import Lights from "./components/Lights";
import { Overlay } from './components/Overlay';

export default function App() {

  const gridSize = 16;
  const spacing = 1.02;
  const points = useHexGridPoints(gridSize, spacing);

  let [generate, setGenerate] = useState(0);
  const setGenerateValue = () => {
    setGenerate(generate === 0 ? 1 : 0);
  };

  const controls = useControls({
    AutoRotate: true,
    Sunset: true
  });


  const seasons = ["Summer", "Winter"];
  const [selectedSeason, setSelectedSeason] = useState("Summer");
  
  useControls({
    Themes: {
      options: [...seasons],
      onChange: (value) => {
        setSelectedSeason(value);
      },
    }
  });

  const Sunset = () => {
    return (controls.Sunset) && <Environment preset="sunset" background blur={0.4} />
  }


  return (
    <>
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, physicallyCorrectLights: true, toneMappingExposure: 0.5, shadowMap: { enabled: true, type: PCFSoftShadowMap }, outputEncoding: sRGBEncoding }} camera={{ fov: 75, position: [38, 38, 40]}} orthographic={false} >

        <Suspense fallback={null}>
          <group position={[0, 0, 0]} key={generate+selectedSeason} >
            <HexGrid points={points} season={selectedSeason} />
          </group>
        </Suspense>

        <OrbitControls autoRotate={controls.AutoRotate} autoRotateSpeed={0.4} enablePan={false}/>
        <Stars radius={50} depth={50} count={400} factor={2} />
        <Stats />
        <Lights />
        <Sunset />

      </Canvas>

      <div className='btnContainer'>
        <button onClick={setGenerateValue} className="genBtn" >Regenerate</button>
      </div>

      <Overlay />
    </>
  )
}