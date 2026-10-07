import { Edges, useGLTF } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import { Mesh, type BufferGeometry, type Group, type Matrix4 } from 'three'
import { useFitCameraToObject } from './useFitCameraToObject'

type ModelMesh = {
  /** Unique per mesh; names can repeat in real exports. */
  id: string
  name: string
  geometry: BufferGeometry
  matrix: Matrix4
}

/** Flattens the glTF scene graph into meshes with their world transforms. */
function useModelMeshes(src: string): ModelMesh[] {
  const { scene } = useGLTF(src)

  return useMemo(() => {
    scene.updateMatrixWorld(true)
    const meshes: ModelMesh[] = []
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        meshes.push({
          id: object.uuid,
          name: object.name,
          geometry: object.geometry,
          matrix: object.matrixWorld,
        })
      }
    })
    return meshes
  }, [scene])
}

type BuildingModelProps = {
  src: string
}

/**
 * Renders the building model as a white card model with black edges,
 * ignoring the file's own materials so any export gets the same look.
 */
export function BuildingModel({ src }: BuildingModelProps) {
  const meshes = useModelMeshes(src)
  const groupRef = useRef<Group>(null)
  useFitCameraToObject(groupRef)

  return (
    <group ref={groupRef}>
      {meshes.map((mesh) => (
        <mesh
          key={mesh.id}
          name={mesh.name}
          geometry={mesh.geometry}
          matrix={mesh.matrix}
          matrixAutoUpdate={false}
        >
          <meshStandardMaterial color="white" roughness={1} />
          <Edges color="#141414" threshold={15} />
        </mesh>
      ))}
    </group>
  )
}
