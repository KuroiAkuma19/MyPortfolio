import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function ThreeBackdrop() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mountNode = mountRef.current

    if (!mountNode) {
      return undefined
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mountNode.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.2, 0.34, 180, 24),
      new THREE.MeshStandardMaterial({
        color: 0xD6CAB7,
        emissive: 0x0a0a0a,
        emissiveIntensity: 0.25,
        metalness: 0.75,
        roughness: 0.22,
      }),
    )
    group.add(knot)

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.4, 1),
      new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      }),
    )
    group.add(shell)

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(3, 0.06, 16, 160),
      new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.4,
      }),
    )
    halo.rotation.x = Math.PI / 2.4
    group.add(halo)

    const particlePositions = new Float32Array(360 * 3)
    for (let index = 0; index < particlePositions.length; index += 3) {
      const radius = 4 + Math.random() * 4
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 6

      particlePositions[index] = Math.cos(angle) * radius
      particlePositions[index + 1] = height
      particlePositions[index + 2] = Math.sin(angle) * radius
    }

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3),
    )

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xe2e8ff,
        size: 0.03,
        transparent: true,
        opacity: 0.8,
      }),
    )
    group.add(particles)

    scene.add(new THREE.AmbientLight(0xffffff, 1.6))

    const keyLight = new THREE.DirectionalLight(0x9d7bff, 2.2)
    keyLight.position.set(-3, 4, 5)
    scene.add(keyLight)

    const fillLight = new THREE.PointLight(0x22d3ee, 22, 20)
    fillLight.position.set(4, -1.5, 5)
    scene.add(fillLight)

    const accentLight = new THREE.PointLight(0x10b981, 15, 16)
    accentLight.position.set(-2, -3, 4)
    scene.add(accentLight)

    const pointer = { x: 0, y: 0 }

    const handlePointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const resize = () => {
      const { width, height } = mountNode.getBoundingClientRect()

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('resize', resize)
    resize()

    let frameId = 0

    const animate = () => {
      group.rotation.y += 0.003 + pointer.x * 0.0015
      group.rotation.x += 0.0012 + pointer.y * 0.0007

      knot.rotation.z += 0.0035
      shell.rotation.y -= 0.0014
      halo.rotation.z += 0.0008

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.05)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.3, 0.05)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', resize)
      particleGeometry.dispose()
      knot.geometry.dispose()
      shell.geometry.dispose()
      halo.geometry.dispose()
      knot.material.dispose()
      shell.material.dispose()
      halo.material.dispose()
      particles.material.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />
}

export default ThreeBackdrop