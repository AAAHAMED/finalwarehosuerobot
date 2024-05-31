// src/algorithms/dijkstraAlgorithm.js

export const dijkstra = (grid, startNode, goalNode) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const previous = Array.from({ length: rows }, () => Array(cols).fill(null));

  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  distances[startNode.row][startNode.col] = 0;

  const getNextNode = () => {
    let minDistance = Infinity;
    let nextNode = null;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!visited[row][col] && distances[row][col] < minDistance) {
          minDistance = distances[row][col];
          nextNode = { row, col };
        }
      }
    }

    return nextNode;
  };

  while (true) {
    const currentNode = getNextNode();

    if (!currentNode || (currentNode.row === goalNode.row && currentNode.col === goalNode.col)) {
      break;
    }

    visited[currentNode.row][currentNode.col] = true;

    for (const direction of directions) {
      const newRow = currentNode.row + direction.row;
      const newCol = currentNode.col + direction.col;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        grid[newRow][newCol] !== 'B'
      ) {
        const newDist = distances[currentNode.row][currentNode.col] + 1;
        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          previous[newRow][newCol] = currentNode;
        }
      }
    }
  }

  const path = [];
  let currentNode = goalNode;

  while (currentNode) {
    path.unshift(currentNode);
    currentNode = previous[currentNode.row][currentNode.col];
  }

  if (path[0].row === startNode.row && path[0].col === startNode.col) {
    return path;
  } else {
    return [];
  }
};
