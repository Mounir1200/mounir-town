const STRAIGHT_COST = 1;
const DIAGONAL_COST = Math.SQRT2;
const NEIGHBOURS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

function octileDistance(a, b) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return STRAIGHT_COST * (dx + dy) + (DIAGONAL_COST - 2 * STRAIGHT_COST) * Math.min(dx, dy);
}

class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(item) {
    this.items.push(item);
    let index = this.items.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (this.items[parent].priority <= item.priority) break;
      this.items[index] = this.items[parent];
      index = parent;
    }
    this.items[index] = item;
  }

  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length === 0) return top;
    let index = 0;
    for (;;) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      let smallestPriority = last.priority;
      if (left < this.items.length && this.items[left].priority < smallestPriority) {
        smallest = left;
        smallestPriority = this.items[left].priority;
      }
      if (right < this.items.length && this.items[right].priority < smallestPriority) smallest = right;
      if (smallest === index) break;
      this.items[index] = this.items[smallest];
      index = smallest;
    }
    this.items[index] = last;
    return top;
  }
}

// A* on the tile grid. Diagonal steps never cut a blocked corner.
// Returns the tiles to walk through (start excluded), or null when unreachable.
export function findPath(isWalkable, start, goal) {
  if (!isWalkable(goal.x, goal.y)) return null;
  const key = (x, y) => `${x},${y}`;
  const cameFrom = new Map();
  const cost = new Map([[key(start.x, start.y), 0]]);
  const open = new MinHeap();
  open.push({ x: start.x, y: start.y, priority: octileDistance(start, goal) });

  while (open.size > 0) {
    const current = open.pop();
    if (current.x === goal.x && current.y === goal.y) return rebuildPath(cameFrom, current, key);
    const currentCost = cost.get(key(current.x, current.y));
    for (const [dx, dy] of NEIGHBOURS) {
      const x = current.x + dx;
      const y = current.y + dy;
      if (!isWalkable(x, y)) continue;
      const isDiagonal = dx !== 0 && dy !== 0;
      if (isDiagonal && (!isWalkable(current.x + dx, current.y) || !isWalkable(current.x, current.y + dy))) continue;
      const nextCost = currentCost + (isDiagonal ? DIAGONAL_COST : STRAIGHT_COST);
      const nextKey = key(x, y);
      if (nextCost >= (cost.get(nextKey) ?? Infinity)) continue;
      cost.set(nextKey, nextCost);
      cameFrom.set(nextKey, current);
      open.push({ x, y, priority: nextCost + octileDistance({ x, y }, goal) });
    }
  }
  return null;
}

function rebuildPath(cameFrom, end, key) {
  const path = [];
  let node = end;
  while (cameFrom.has(key(node.x, node.y))) {
    path.unshift({ x: node.x, y: node.y });
    node = cameFrom.get(key(node.x, node.y));
  }
  return path;
}

// Closest walkable tile around `tile`, searched ring by ring.
export function nearestWalkable(isWalkable, tile, maxRadius = 3) {
  if (isWalkable(tile.x, tile.y)) return tile;
  for (let radius = 1; radius <= maxRadius; radius++) {
    let best = null;
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
        const candidate = { x: tile.x + dx, y: tile.y + dy };
        if (!isWalkable(candidate.x, candidate.y)) continue;
        const distance = dx * dx + dy * dy;
        if (!best || distance < best.distance) best = { ...candidate, distance };
      }
    }
    if (best) return { x: best.x, y: best.y };
  }
  return null;
}
