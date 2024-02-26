let gridSize = 20; // 20x20 grid
let cellSize = 40;
let grid;

function setup() {
  createCanvas(800, 800);
  noLoop();
  grid = initializeGrid(gridSize);
  fillGridWithBuildings();
}

function draw() {
  background(255);
  drawGrid();
}

function initializeGrid(size) {
  let grid = new Array(size);
  for (let i = 0; i < size; i++) {
    grid[i] = new Array(size).fill("potential"); // Mark all as potential building spaces initially
  }
  return grid;
}

function drawGrid() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      stroke(0);
      if (grid[x][y] === "building") {
        fill("green"); // Building cell
      } else {
        fill("grey"); // Road cell
      }
      rect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
}

function fillGridWithBuildings() {
  let attempts = 0;
  let maxAttempts = 100; // Adjust based on testing
  let sizeOptions = 6; // Number of building size options

  while (attempts < maxAttempts) {
    let buildingSize = randomBuildingSize();
    let placed = false;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (checkSpace(x, y, buildingSize)) {
          placeBuilding(x, y, buildingSize);
          placed = true;
          break;
        }
      }
      if (placed) break;
    }

    if (!placed) {
      attempts++;
      if (attempts % (maxAttempts / sizeOptions) == 0) {
        // Try a smaller building size after every (maxAttempts / sizeOptions) failed attempts
        sizeOptions = max(1, sizeOptions - 1); // Ensure sizeOptions doesn't go below 1
      }
    } else {
      attempts = 0; // Reset attempts if a building was placed
    }
  }
}

function randomBuildingSize() {
  const sizes = [
    { w: 3, h: 3 },
    { w: 2, h: 3 },
    { w: 3, h: 2 },
    { w: 4, h: 2 },
    { w: 4, h: 3 },
    { w: 4, h: 4 },
    { w: 5, h: 4 },
    { w: 5, h: 5 },
  ];
  return random(sizes);
}

function checkSpace(x, y, size) {
  // Only check the starting point is within the grid
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
    return false; // Starting point is out of bounds
  }

  // Check surrounding space within the grid boundaries
  for (let i = max(0, x - 1); i <= min(x + size.w, gridSize - 1); i++) {
    for (let j = max(0, y - 1); j <= min(y + size.h, gridSize - 1); j++) {
      if (grid[i][j] === "building") {
        return false; // Adjacent to a building
      }
    }
  }
  return true; // Space is available
}

function placeBuilding(x, y, size) {
  // Mark the building cells within the grid boundaries
  for (let i = 0; i < size.w; i++) {
    for (let j = 0; j < size.h; j++) {
      if (x + i < gridSize && y + j < gridSize) {
        // Check if within grid bounds
        grid[x + i][y + j] = "building";
      }
    }
  }

  // Mark the perimeter as road, ensuring exactly one cell of road around the building within grid boundaries
  for (let i = x - 1; i <= x + size.w; i++) {
    for (let j = y - 1; j <= y + size.h; j++) {
      if (i >= 0 && i < gridSize && j >= 0 && j < gridSize) {
        // Check if within grid bounds
        if (grid[i][j] !== "building") {
          grid[i][j] = "road"; // Mark as road if it's not part of a building
        }
      }
    }
  }
}
