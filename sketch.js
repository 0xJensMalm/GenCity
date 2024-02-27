let buildings = [];
let cellSize = 20;
let diagonalGridSize; // This will be calculated based on the canvas size and rotation
let grid;

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  // Calculate effective grid size for diagonal layout
  diagonalGridSize = ceil(sqrt(sq(width) + sq(height)) / cellSize) * 2;
  grid = initializeGrid(diagonalGridSize);
  fillGridWithBuildings();
  noLoop();
}

function draw() {
  background(255);

  push(); // Start a new drawing state
  translate(width / 2, height / 2);
  rotate(45); // Rotate the grid by 45 degrees

  drawGrid(); // Draw the rotated grid

  pop(); // Restore original state
}

function initializeGrid(size) {
  let grid = new Array(size);
  for (let i = 0; i < size; i++) {
    grid[i] = new Array(size).fill(null);
  }
  return grid;
}

function drawGrid() {
  for (let x = 0; x < diagonalGridSize; x++) {
    for (let y = 0; y < diagonalGridSize; y++) {
      stroke(0);
      if (grid[x][y] === "building") {
        fill("green");
      } else if (grid[x][y] === "road") {
        fill("grey");
      } else {
        noFill(); // No fill for unassigned cells
      }
      rect(
        (x - diagonalGridSize / 2) * cellSize,
        (y - diagonalGridSize / 2) * cellSize,
        cellSize,
        cellSize
      );
    }
  }
}

function fillGridWithBuildings() {
  let attempts = 0;
  let maxAttempts = 100;
  let sizeOptions = 6; // Number of building size options

  while (attempts < maxAttempts) {
    let buildingSize = randomBuildingSize();
    let placed = false;

    for (let x = 0; x < diagonalGridSize; x++) {
      for (let y = 0; y < diagonalGridSize; y++) {
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
        sizeOptions = max(1, sizeOptions - 1);
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
  if (
    x < 0 ||
    x + size.w > diagonalGridSize ||
    y < 0 ||
    y + size.h > diagonalGridSize
  ) {
    return false; // Out of bounds or not enough space
  }

  for (let i = x; i < x + size.w; i++) {
    for (let j = y; j < y + size.h; j++) {
      if (grid[i][j] !== null) {
        return false; // Space is not empty
      }
    }
  }
  return true;
}

function placeBuilding(x, y, size) {
  for (let i = x; i < x + size.w; i++) {
    for (let j = y; j < y + size.h; j++) {
      grid[i][j] = "building";
    }
  }

  // Optionally, mark the roads around the building
  // This part can be adjusted based on how you want to handle the roads
  for (let i = max(x - 1, 0); i <= min(x + size.w, diagonalGridSize - 1); i++) {
    for (
      let j = max(y - 1, 0);
      j <= min(y + size.h, diagonalGridSize - 1);
      j++
    ) {
      if (grid[i][j] !== "building") {
        grid[i][j] = "road";
      }
    }
  }
}
