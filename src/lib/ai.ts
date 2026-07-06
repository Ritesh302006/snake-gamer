import { Point, Direction } from '../types';
import { GRID_SIZE } from '../constants';

const getNeighbors = (point: Point): Point[] => {
  return [
    { x: point.x, y: point.y - 1 }, // UP
    { x: point.x, y: point.y + 1 }, // DOWN
    { x: point.x - 1, y: point.y }, // LEFT
    { x: point.x + 1, y: point.y }, // RIGHT
  ].filter(
    (p) => p.x >= 0 && p.x < GRID_SIZE && p.y >= 0 && p.y < GRID_SIZE
  );
};

const isCollision = (point: Point, snake: Point[]): boolean => {
  // Check against all body parts except the tail (since it will move)
  // But to be safe, if we just eat, it might grow, so we consider full snake for now.
  return snake.some((segment) => segment.x === point.x && segment.y === point.y);
};

const heuristic = (a: Point, b: Point) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const getNextAIDirection = (
  snake: Point[],
  food: Point,
  currentDirection: Direction
): Direction => {
  const head = snake[0];

  // A* pathfinding
  const openSet: { point: Point; fScore: number; gScore: number; parent: any }[] = [];
  const closedSet = new Set<string>();
  
  openSet.push({ point: head, fScore: heuristic(head, food), gScore: 0, parent: null });
  
  let current = null;

  while (openSet.length > 0) {
    // Sort by fScore
    openSet.sort((a, b) => a.fScore - b.fScore);
    current = openSet.shift();

    if (!current) break;

    const currentKey = `${current.point.x},${current.point.y}`;
    
    if (current.point.x === food.x && current.point.y === food.y) {
      break; // Path found
    }

    closedSet.add(currentKey);

    const neighbors = getNeighbors(current.point);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      
      // Treat the tail differently? For now, strict collision.
      if (closedSet.has(neighborKey) || isCollision(neighbor, snake)) {
        continue;
      }

      const tentative_gScore = current.gScore + 1;
      
      const existingOpenNode = openSet.find(n => n.point.x === neighbor.x && n.point.y === neighbor.y);

      if (!existingOpenNode) {
        openSet.push({
          point: neighbor,
          gScore: tentative_gScore,
          fScore: tentative_gScore + heuristic(neighbor, food),
          parent: current
        });
      } else if (tentative_gScore < existingOpenNode.gScore) {
        existingOpenNode.gScore = tentative_gScore;
        existingOpenNode.fScore = tentative_gScore + heuristic(neighbor, food);
        existingOpenNode.parent = current;
      }
    }
  }

  // Backtrack to find the first move
  if (current && current.point.x === food.x && current.point.y === food.y) {
    let node = current;
    while (node.parent && node.parent.parent) {
      node = node.parent;
    }
    if (node.parent) {
      const nextPoint = node.point;
      return getDirectionFromPoints(head, nextPoint);
    }
  }

  // Fallback: If no path to food, find any safe adjacent move
  const safeNeighbors = getNeighbors(head).filter(n => !isCollision(n, snake));
  if (safeNeighbors.length > 0) {
      // Prioritize moves that give us more space (simple flood fill approximation or just furthest from walls/snake)
      // For simplicity, just pick the first safe neighbor that doesn't immediately trap us, or random safe.
      // Better: try to follow tail or move away from other body parts.
      return getDirectionFromPoints(head, safeNeighbors[Math.floor(Math.random() * safeNeighbors.length)]);
  }

  return currentDirection; // Continue and die if trapped
};

const getDirectionFromPoints = (from: Point, to: Point): Direction => {
  if (to.y < from.y) return Direction.UP;
  if (to.y > from.y) return Direction.DOWN;
  if (to.x < from.x) return Direction.LEFT;
  return Direction.RIGHT;
};
