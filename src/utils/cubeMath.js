export function generateVertices(n) {
  const count = 1 << n
  const vertices = []
  for (let i = 0; i < count; i++) {
    const bits = []
    for (let b = n - 1; b >= 0; b--) {
      bits.push((i >> b) & 1)
    }
    vertices.push({ id: i, bits, label: bits.join('') })
  }
  return vertices
}

export function runCount(bits) {
  if (!bits.length) return 0
  let runs = 1
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] !== bits[i - 1]) runs++
  }
  return runs
}

export function binomial(n, k) {
  if (k < 0 || k > n) return 0
  if (k === 0 || k === n) return 1
  let res = 1
  for (let i = 1; i <= k; i++) {
    res = (res * (n - k + i)) / i
  }
  return Math.round(res)
}

export function theoreticalSize(n, k) {
  if (k < 1 || k > n) return 0
  return 2 * binomial(n - 1, k - 1)
}

export function groupByK(vertices, n) {
  const map = new Map()
  for (let k = 1; k <= n; k++) {
    const group = vertices.filter(v => runCount(v.bits) === k)
    map.set(k, {
      k,
      vertices: group,
      actual: group.length,
      theoretical: theoreticalSize(n, k),
      match: group.length === theoreticalSize(n, k),
    })
  }
  return map
}

export function aggregationVector(bits) {
  if (!bits.length) return []
  const result = []
  let count = 1
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] === bits[i - 1]) {
      count++
    } else {
      result.push(count)
      count = 1
    }
  }
  result.push(count)
  return result
}

export function generateGrayCode(n) {
  if (n === 0) return [0]
  const prev = generateGrayCode(n - 1)
  const reflected = [...prev].reverse()
  const leadingBit = 1 << (n - 1)
  return [...prev, ...reflected.map(v => v | leadingBit)]
}

export function generateEdges(vertices, n) {
  const edges = []
  const len = vertices.length
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      let diff = 0
      for (let b = 0; b < n; b++) {
        if (vertices[i].bits[b] !== vertices[j].bits[b]) diff++
        if (diff > 1) break
      }
      if (diff === 1) edges.push([i, j])
    }
  }
  return edges
}

const COLOR_STOPS = [
  { pos: 0, hex: '#3b82f6' },
  { pos: 0.2, hex: '#06b6d4' },
  { pos: 0.4, hex: '#10b981' },
  { pos: 0.6, hex: '#eab308' },
  { pos: 0.8, hex: '#f97316' },
  { pos: 1, hex: '#ef4444' },
]

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function lerp(a, b, t) {
  return a + (b - a) * t
}

export function colorForK(k, n) {
  if (n === 1) return '#3b82f6'
  const t = (k - 1) / (n - 1)
  let lower = COLOR_STOPS[0]
  let upper = COLOR_STOPS[COLOR_STOPS.length - 1]
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    if (t >= COLOR_STOPS[i].pos && t <= COLOR_STOPS[i + 1].pos) {
      lower = COLOR_STOPS[i]
      upper = COLOR_STOPS[i + 1]
      break
    }
  }
  const segmentT = (t - lower.pos) / (upper.pos - lower.pos)
  const [r1, g1, b1] = hexToRgb(lower.hex)
  const [r2, g2, b2] = hexToRgb(upper.hex)
  const r = Math.round(lerp(r1, r2, segmentT))
  const g = Math.round(lerp(g1, g2, segmentT))
  const b = Math.round(lerp(b1, b2, segmentT))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
