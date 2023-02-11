import { useMemo } from 'react'
import { Vector2 } from 'three';
import * as THREE from "three";

export default function HexPointsScatter(gridSize = 10, spacing = 1) {

  const points = useMemo (() => {

    const tempBox = [];

    for (let q = -gridSize; q <= gridSize; q++) {
      // for (let r = -gridSize; r <= gridSize; r++){
        for (let r = Math.max(-gridSize, -q - gridSize); r <= Math.min(gridSize, -q + gridSize); r++) {
        // if (Math.abs(q + r) > gridSize) continue;
        let x = (3/2 * q) * spacing;
        let y = (Math.sqrt(3) * (r + q/2)) * spacing;

        let pos = new Vector2(x, y);
        // Mark the points of the 6 sides 'true'
        if (r === Math.max(-gridSize, -q - gridSize) || r === Math.min(gridSize, -q + gridSize) || q === -gridSize || q === gridSize)
          tempBox.push([new THREE.Vector3(pos.x, pos.y, pos.z), true]);
        else
          tempBox.push([new THREE.Vector3(pos.x, pos.y, pos.z), false]);
      } 
    }

    return tempBox;

  },[gridSize, spacing])

return points;
}