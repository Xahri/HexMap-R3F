import { useCallback, useEffect, useRef, useMemo, useState } from "react";
import * as THREE from "three";
import SimplexNoise from 'simplex-noise';
import useColor, { colors } from "../hooks/useColor";
import { Foliage } from "./Foliage";
import { useFrame } from '@react-three/fiber'

// Constants
const MINIMUM_HEIGHT = colors.Water.value;
const tempObject = new THREE.Object3D(); // Temporary object to be used for scaling and positioning
const foliageObj = new THREE.Object3D(); // Temporary object to be used for positioning foliage
const height = 20;                       // Object scale on Y axis multiplier

let newFoliageArr = []; // Used to store the position for the foliage

// HexMeshScatter component
export default function HexMeshScatter( {points, season} ) {
  const ref = useRef(); // Reference to the instancedMesh component
  const color = useColor(MINIMUM_HEIGHT, season); // Custom hook to generate color based on height
  const simplex = useMemo(() => new SimplexNoise(), []); // Simplex noise instance

  const [foliageArr, setFoliageArr] = useState([]);
  const [firstRender, setFirstRender] = useState(true);

  // Generate function to update the instancedMesh component with new scales and positions
  const generate = useCallback(
    (scale) => {
      if (ref.current) {
        // let newFoliageArr = [];
        const mesh = ref.current; // Reference to the instancedMesh component

        // Loop through the points
        points.forEach((point, i) => {
          let pos = new THREE.Vector3(point[0].y, point[0].z, point[0].x); // Get position from point
          tempObject.position.copy(pos); // Set position on temp object
          tempObject.scale.setScalar(10); // Set initial scale

          // We need this object because it's unrelated to the scale animation unlike tempObject
          foliageObj.position.copy(pos);
          foliageObj.scale.setScalar(10);

          // Scale the object based on the given scale or the minimum height
          if (scale) {
            tempObject.scale.y *= scale;
          }
          else {
            tempObject.scale.y = MINIMUM_HEIGHT;
          }
          
          tempObject.updateMatrix(); // Update the matrix of the temp object

          // Generate noise
          const p = tempObject.position.clone().multiplyScalar(1);
          const genH = 1;
          let n = (((simplex.noise2D(p.x*.02, p.z*.02) + 1) * 0.5) * 0.75) * genH;
          n = Math.pow(n, 1.5);

          // Give the sides a unique color
          let c;
          if (point[1] === false){
            c = color(n, season, false)
          }
          else{
            c = color(n, season, true)
          }

          // Limit the height to the minimum height
          if (n <= MINIMUM_HEIGHT) n = MINIMUM_HEIGHT;

          if (point[1] === false) {
            tempObject.scale.y *= height * n; // Scale the temp object based on the generated height
          }
          else{
            tempObject.scale.y *= 4;
          }
          tempObject.position.y = (tempObject.scale.y) / 20; // Update the position
          tempObject.updateMatrix(); // Update the matrix

          foliageObj.scale.y *= height * n; // Scale the temp object based on the generated height
          foliageObj.position.y = (foliageObj.scale.y) / height; // Update the position

          // Set the matrix and color on the instancedMesh component
          mesh.setMatrixAt(i, tempObject.matrix);
          if (firstRender) // To stop color flickering
            mesh.setColorAt(i, c);

          // Populate the foliage array (Trees)
          if (n > 0.1+MINIMUM_HEIGHT && n < 0.29+MINIMUM_HEIGHT && firstRender) {
            let chance = Math.random() < 0.4 ? 0 : 1 // 40% chance of being 0
            if (chance === 0 && point[1] === false)
              newFoliageArr.push(new THREE.Vector3(tempObject.position.x, foliageObj.position.y * height/10, tempObject.position.z));
          }

        });

        if (firstRender) { // This is need it because useSpring calls generate() multiple times for the animtion.
          setFirstRender(false);
          setFoliageArr(newFoliageArr);
          newFoliageArr = [];
        }
        

        // Update the instancedMesh component
        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor.needsUpdate = true;
      }
    },
    [points, color, simplex, firstRender, season]
  );

  const elapsedTimeRef = useRef(0);
  const animSpeed = 3;

  useFrame((state, delta) => {
    elapsedTimeRef.current += delta * animSpeed;
    if (elapsedTimeRef.current <= 1) {
      generate(Math.cbrt(elapsedTimeRef.current));
      // generate(Math.cbrt(Math.cbrt(elapsedTimeRef.current)));
      // generate((1 - Math.cos(elapsedTimeRef.current * Math.PI)) / 2);
    }
  });
  
  useEffect(() => {
    elapsedTimeRef.current = 0;
  }, [points, season]);
  

  return (
    <group >
      <instancedMesh castShadow receiveShadow ref={ref} args={[null, null, points.length]} >
        <cylinderGeometry args={[.1, .1, .1, 6, 1, false]} />
        <meshStandardMaterial flatShading={true} />
      </instancedMesh>
      {foliageArr.length > 0 && (
        <Foliage foliageArr={foliageArr} season={season} /> // key={Math.random()}
      )}
    </group>
  );
}