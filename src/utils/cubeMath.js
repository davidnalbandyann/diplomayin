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

export function reduceRuns(bits) {
  if (!bits || bits.length === 0) return ''
  let result = '' + bits[0]
  for (let i = 1; i < bits.length; i++) {
    if (bits[i] !== bits[i - 1]) result += bits[i]
  }
  return result
}

export function getRunLengths(bits) {
  return aggregationVector(bits)
}

export function getRunCount(bits) {
  return runCount(bits)
}

export function getCompressionStats(bits) {
  const n = bits.length
  const runLengths = aggregationVector(bits)
  const k = runCount(bits)
  return { n, k, runLengths, ratio: k / n, saved: 1 - k / n }
}

export function isAlternating(str) {
  if (!str || str.length < 2) return true
  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i - 1]) return false
  }
  return true
}

export function generateCompositions(n, k) {
  const results = []
  function helper(remaining, parts, start) {
    if (parts === 1) {
      if (remaining >= 1) results.push([...start, remaining])
      return
    }
    for (let i = 1; i <= remaining - (parts - 1); i++) {
      start.push(i)
      helper(remaining - i, parts - 1, start)
      start.pop()
    }
  }
  helper(n, k, [])
  return results
}

export function expandByRuns(reducedString, runLengths) {
  let result = ''
  for (let i = 0; i < reducedString.length; i++) {
    result += reducedString[i].repeat(runLengths[i])
  }
  return result
}

export function getPreimagesForReducedString(y, n) {
  if (!isAlternating(y)) return { k: 0, compositions: [], preimages: [], count: 0, theoretical: 0 }
  const k = y.length
  if (k > n || k < 1) return { k, compositions: [], preimages: [], count: 0, theoretical: 0 }
  const compositions = generateCompositions(n, k)
  const preimages = compositions.map(comp => expandByRuns(y, comp))
  const theoretical = binomial(n - 1, k - 1)
  return {
    k,
    compositions,
    preimages,
    count: preimages.length,
    theoretical,
    match: preimages.length === theoretical,
  }
}

export function runValidation() {
  const results = []
  // Test 1
  const bits1 = [1,1,1,0,0,1]
  const g1 = reduceRuns(bits1)
  const rl1 = getRunLengths(bits1)
  const k1 = getRunCount(bits1)
  const ok1 = g1 === '101' && JSON.stringify(rl1) === '[3,2,1]' && k1 === 3
  results.push({ test: 'reduceRuns(111001) = 101, runs=[3,2,1], k=3', pass: ok1 })

  // Test 2
  const pre2 = getPreimagesForReducedString('101', 5)
  const ok2 = pre2.count === 6 && pre2.theoretical === 6 && pre2.match
  results.push({ test: 'n=5, y=101 → 6 preimages = C(4,2)', pass: ok2 })

  // Test 3
  let sum = 0
  for (let k = 1; k <= 6; k++) sum += theoreticalSize(6, k)
  results.push({ test: 'n=6, Σ2·C(5,k-1) = 64', pass: sum === 64 })

  // Test 4
  let allPreimagesOk = true
  for (const x of pre2.preimages) {
    const bitsArr = x.split('').map(Number)
    if (reduceRuns(bitsArr) !== '101') { allPreimagesOk = false; break }
  }
  results.push({ test: 'All preimages of "101" reduce back to "101"', pass: allPreimagesOk })

  // Test 5
  let allDistributionsOk = true
  for (let n = 3; n <= 9; n++) {
    const verts = generateVertices(n)
    const groups = groupByK(verts, n)
    let total = 0
    for (let k = 1; k <= n; k++) {
      const g = groups.get(k)
      if (g) total += g.actual
    }
    if (total !== (1 << n)) { allDistributionsOk = false; break }
  }
  results.push({ test: 'n=3..9, distribution totals = 2^n', pass: allDistributionsOk })

  console.table(results)
  const allPass = results.every(r => r.pass)
  console.log(allPass ? '✓ All validation tests passed' : '✗ Some tests failed')
  return allPass
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

export function binomialBigInt(n, k) {
  if (k < 0 || k > n) return 0n
  if (k === 0 || k === n) return 1n
  if (k > n - k) k = n - k
  let res = 1n
  for (let i = 1; i <= k; i++) {
    res = (res * BigInt(n - k + i)) / BigInt(i)
  }
  return res
}

export function adjacentCollisionBalance(n, k) {
  const left = BigInt(n) * BigInt(k + 1)
  const right = BigInt(n - k) * BigInt(n - k - 1)
  return { left, right, equal: left === right, diff: left > right ? left - right : right - left }
}

export function isAdjacentCollision(n, k) {
  if (k < 1 || k > n - 2) return false
  const { equal } = adjacentCollisionBalance(n, k)
  return equal
}

export function getLyndExamples() {
  return [
    { n: 15, k: 5, label: 'Lynd 1' },
    { n: 104, k: 39, label: 'Lynd 2' },
    { n: 714, k: 272, label: 'Lynd 3' },
    { n: 4895, k: 1869, label: 'Lynd 4' },
  ]
}

export function formatBigInt(val) {
  if (typeof val !== 'bigint') val = BigInt(val)
  const str = val.toString()
  if (str.length <= 6) return str
  const mantissa = str[0] + '.' + str.slice(1, 4)
  const exp = str.length - 1
  return { short: mantissa + '×10^' + exp, full: str }
}

export function findCollisions(maxN) {
  const map = new Map()
  for (let n = 1; n <= maxN; n++) {
    for (let k = 1; k <= Math.floor(n / 2); k++) {
      const val = binomial(n, k)
      if (!map.has(val)) map.set(val, [])
      map.get(val).push({ n, k })
    }
  }
  const results = []
  for (const [value, pairs] of map) {
    if (pairs.length > 1) {
      results.push({ value, pairs })
    }
  }
  results.sort((a, b) => a.value - b.value)
  return results
}

export function findNearCollisions(maxN, threshold) {
  const entries = []
  for (let n = 1; n <= maxN; n++) {
    for (let k = 1; k <= Math.floor(n / 2); k++) {
      entries.push({ n, k, value: binomial(n, k) })
    }
  }
  entries.sort((a, b) => a.value - b.value)
  const results = []
  for (let i = 0; i < entries.length - 1; i++) {
    const diff = Math.abs(entries[i + 1].value - entries[i].value)
    if (diff > 0 && diff <= threshold) {
      results.push({ a: entries[i], b: entries[i + 1], diff })
    }
  }
  return results
}

export function buildCollisionFrequencyMap(maxN) {
  const map = new Map()
  for (let n = 1; n <= maxN; n++) {
    for (let k = 0; k <= Math.floor(n / 2); k++) {
      const val = binomial(n, k)
      map.set(val, (map.get(val) || 0) + 1)
    }
  }
  return map
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
