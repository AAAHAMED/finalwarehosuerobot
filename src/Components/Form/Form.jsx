import React, { useState } from 'react';
import { dijkstra } from '../../algorithms/dijkstraAlgorithm';
import { database } from '../../firebase';
import { ref, set } from "firebase/database";
import './Form.css';

const Form = () => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [grid, setGrid] = useState([]);
  const [isGridCreated, setIsGridCreated] = useState(false);
  const [selectMode, setSelectMode] = useState(null);
  const [startNode, setStartNode] = useState(null);
  const [goalNode, setGoalNode] = useState(null);
  const [path, setPath] = useState([]);
  const [isBlockMode, setIsBlockMode] = useState(false);

  const handleWidthChange = (e) => setWidth(e.target.value);
  const handleHeightChange = (e) => setHeight(e.target.value);

  const createGrid = () => {
    const newGrid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
    setGrid(newGrid);
    setIsGridCreated(true);
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (selectMode === 'start') {
      setStartNode({ row: rowIndex, col: cellIndex });
      setSelectMode('goal');
      updateGrid(rowIndex, cellIndex, 'S');
    } else if (selectMode === 'goal') {
      setGoalNode({ row: rowIndex, col: cellIndex });
      setSelectMode(null);
      updateGrid(rowIndex, cellIndex, 'G');
    } else if (isBlockMode) {
      updateGrid(rowIndex, cellIndex, 'B');
    }
  };

  const updateGrid = (rowIndex, cellIndex, value) => {
    const newGrid = grid.map((row, rIdx) =>
      row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === cellIndex ? value : cell))
    );
    setGrid(newGrid);
  };

  const findPath = () => {
    if (startNode && goalNode) {
      const resultPath = dijkstra(grid, startNode, goalNode);
      setPath(resultPath);
      const formattedPath = formatPath(resultPath);
      console.log('Found Path:', formattedPath);
      sendPathToFirebase(formattedPath);
      updatePathOnGrid(resultPath);

      // Reset for the next pathfinding
      setTimeout(() => {
        resetGridForNextPath(goalNode);
      }, 2000); // delay to allow the user to see the path
    }
  };

  const formatPath = (path) => {
    const directions = [];
    for (let i = 1; i < path.length; i++) {
      const prev = path[i - 1];
      const curr = path[i];
      if (curr.row < prev.row) directions.push('up');
      else if (curr.row > prev.row) directions.push('down');
      else if (curr.col < prev.col) directions.push('left');
      else if (curr.col > prev.col) directions.push('right');
    }
    return directions;
  };

  const sendPathToFirebase = (path) => {
    const pathRef = ref(database, 'path');
    set(pathRef, path)
      .then(() => {
        console.log('Path sent to Firebase');
      })
      .catch((error) => {
        console.error('Error sending path to Firebase:', error);
      });
  };

  const updatePathOnGrid = (path) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        const isPath = path.some(node => node.row === rowIndex && node.col === cellIndex);
        if (isPath && cell !== 'S' && cell !== 'G') return 'P';
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const resetGridForNextPath = (newStartNode) => {
    const newGrid = grid.map((row, rowIndex) =>
      row.map((cell, cellIndex) => {
        if (cell === 'P' || cell === 'G') return 0;
        if (rowIndex === newStartNode.row && cellIndex === newStartNode.col) return 'S';
        return cell;
      })
    );

    setGrid(newGrid);
    setStartNode(newStartNode);
    setGoalNode(null);
    setSelectMode('goal');
  };

  return (
    <div className="container">
      <h1>Welcome to the Warehouse Automation System</h1>
      {!isGridCreated && (
        <div className="setup">
          <h2>Create your warehouse grid</h2>
          <div className="input-group">
            <div className="input">
              <h4>Board Width</h4>
              <input 
                type='number' 
                placeholder='Board Width' 
                value={width} 
                onChange={handleWidthChange} 
                required 
              />
            </div>
            <div className="input">
              <h4>Board Height</h4>
              <input 
                type='number' 
                placeholder='Board Height' 
                value={height} 
                onChange={handleHeightChange} 
                required 
              />
            </div>
          </div>
          <button 
            className="favorite styled" 
            type="button" 
            onClick={createGrid}
          >
            Create Grid
          </button>
        </div>
      )}

      {isGridCreated && selectMode === null && (
        <button 
          className="favorite styled" 
          type="button" 
          onClick={() => setSelectMode('start')}
        >
          Select Start Node
        </button>
      )}

      {selectMode === 'start' && (
        <p>Select the start node position by clicking on the grid.</p>
      )}

      {selectMode === 'goal' && (
        <p>Select the goal node position by clicking on the grid.</p>
      )}

      {isGridCreated && !selectMode && startNode && goalNode && (
        <button 
          className="favorite styled" 
          type="button"
          onClick={findPath}
        >
          Find Path
        </button>
      )}

      {isGridCreated && (
        <button 
          className="favorite styled" 
          type="button"
          onClick={() => setIsBlockMode(!isBlockMode)}
        >
          {isBlockMode ? 'Stop Adding Blocks' : 'Add Blocks'}
        </button>
      )}

      {isGridCreated && (
        <div className="grid">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, cellIndex) => (
                <div 
                  key={cellIndex} 
                  className={`cell ${startNode?.row === rowIndex && startNode?.col === cellIndex ? 'start-node' : ''} ${goalNode?.row === rowIndex && goalNode?.col === cellIndex ? 'goal-node' : ''} ${cell === 'P' ? 'path-node' : ''} ${cell === 'B' ? 'block-node' : ''}`} 
                  onClick={() => handleCellClick(rowIndex, cellIndex)}
                >
                  {cell === 'S' ? 'S' : cell === 'G' ? 'G' : cell === 'P' ? 'P' : cell === 'B' ? 'B' : 0}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Form;
