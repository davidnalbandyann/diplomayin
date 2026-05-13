const SPRING = 0.02
const REPULSE = 0.08
const DAMPING = 0.95
const REST_LENGTH = 1.2
const MIN_VELOCITY = 0.0001

export function forceDirectedLayout(vertices, edges, n, startCoords) {
  const count = vertices.length
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)

  if (startCoords) {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = startCoords[i * 3]
      positions[i * 3 + 1] = startCoords[i * 3 + 1]
      positions[i * 3 + 2] = startCoords[i * 3 + 2]
    }
  } else {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
  }

  function tick() {
    const forces = new Float32Array(count * 3)
    let maxForce = 0

    for (let ei = 0; ei < edges.length; ei++) {
      const [a, b] = edges[ei]
      const ax = positions[a * 3], ay = positions[a * 3 + 1], az = positions[a * 3 + 2]
      const bx = positions[b * 3], by = positions[b * 3 + 1], bz = positions[b * 3 + 2]
      let dx = bx - ax, dy = by - ay, dz = bz - az
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001
      dx /= dist; dy /= dist; dz /= dist
      const displacement = dist - REST_LENGTH
      const f = SPRING * displacement
      forces[a * 3] += f * dx; forces[a * 3 + 1] += f * dy; forces[a * 3 + 2] += f * dz
      forces[b * 3] -= f * dx; forces[b * 3 + 1] -= f * dy; forces[b * 3 + 2] -= f * dz
    }

    for (let i = 0; i < count; i++) {
      const ix = positions[i * 3], iy = positions[i * 3 + 1], iz = positions[i * 3 + 2]
      for (let j = i + 1; j < count; j++) {
        const jx = positions[j * 3], jy = positions[j * 3 + 1], jz = positions[j * 3 + 2]
        let dx = jx - ix, dy = jy - iy, dz = jz - iz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001
        dx /= dist; dy /= dist; dz /= dist
        const f = REPULSE / (dist * dist)
        forces[i * 3] -= f * dx; forces[i * 3 + 1] -= f * dy; forces[i * 3 + 2] -= f * dz
        forces[j * 3] += f * dx; forces[j * 3 + 1] += f * dy; forces[j * 3 + 2] += f * dz
      }
    }

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      velocities[i3] = (velocities[i3] + forces[i3]) * DAMPING
      velocities[i3 + 1] = (velocities[i3 + 1] + forces[i3 + 1]) * DAMPING
      velocities[i3 + 2] = (velocities[i3 + 2] + forces[i3 + 2]) * DAMPING
      const speed = Math.sqrt(
        velocities[i3] ** 2 + velocities[i3 + 1] ** 2 + velocities[i3 + 2] ** 2
      )
      if (speed > MIN_VELOCITY) {
        positions[i3] += velocities[i3]
        positions[i3 + 1] += velocities[i3 + 1]
        positions[i3 + 2] += velocities[i3 + 2]
      }
      const fm = Math.sqrt(forces[i3] ** 2 + forces[i3 + 1] ** 2 + forces[i3 + 2] ** 2)
      if (fm > maxForce) maxForce = fm
    }

    return maxForce
  }

  return { positions, velocities, tick }
}

export function directLayout(vertices, n) {
  const count = vertices.length
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const b = vertices[i].bits
    positions[i * 3] = (b[0] || 0) - 0.5
    positions[i * 3 + 1] = b.length > 1 ? (b[1] || 0) - 0.5 : 0
    positions[i * 3 + 2] = b.length > 2 ? (b[2] || 0) - 0.5 : 0
  }
  return positions
}
