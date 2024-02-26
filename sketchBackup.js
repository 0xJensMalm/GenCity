let grid;
let cols, rows;
let cellSize = 40; // Adjust the cell size as needed
let bufferPercent = 0.2; // 20% buffer on each side
let buildingQueue = [];

function setup() {
  createCanvas(800, 800);
  // Adjusting for the larger grid size with buffer
  cols = floor((width / cellSize) * (1 + bufferPercent * 2));
  rows = floor((height / cellSize) * (1 + bufferPercent * 2));
  grid = new Array(cols);

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows).fill(0); // Initialize grid as empty
  }

  setupBuildingQueue();
  fillCanvasWithBuildings();
  noLoop(); // No need to redraw unless the canvas or buildings change
}

function draw() {
  background(220);
  drawGrid();
}

function setupBuildingQueue() {
  // Prioritize square buildings
  for (let size = 6; size >= 3; size--) {
    buildingQueue.push({ width: size, height: size });
  }
  // Add rectangular buildings
  let rectangles = [
    { w: 2, h: 3 },
    { w: 3, h: 2 },
    { w: 2, h: 4 },
    { w: 4, h: 2 },
    { w: 3, h: 4 },
    { w: 4, h: 3 },
  ];
  buildingQueue = buildingQueue.concat(rectangles);
}

function fillCanvasWithBuildings() {
  let attempt = 0;
  let maxAttempts = buildingQueue.length * 100; // Arbitrary max attempts to avoid infinite loops

  while (buildingQueue.length > 0 && attempt < maxAttempts) {
    let building = buildingQueue.shift(); // Take the first building size from the queue
    if (!placeBuilding(building.width, building.height)) {
      buildingQueue.push(building); // If it doesn't fit, try again later
    }
    attempt++;
  }
}

function placeBuilding(width, height) {
  let placed = false;
  let randomStartX = floor(random(cols - width - 1));
  let randomStartY = floor(random(rows - height - 1));

  // First pass: Try from a random starting point to the end
  for (let x = randomStartX; x <= cols - width - 1 && !placed; x++) {
    for (let y = randomStartY; y <= rows - height - 1 && !placed; y++) {
      if (checkSpace(x, y, width, height)) {
        // Mark building space
        for (let i = x; i < x + width; i++) {
          for (let j = y; j < y + height; j++) {
            grid[i][j] = 1; // Building cell
          }
        }
        // Mark surrounding roads
        markRoads(x, y, width, height);
        placed = true; // Building placed
      }
    }
  }

  // Second pass: If not placed, try from the beginning to the random start
  if (!placed) {
    for (let x = 0; x < randomStartX && !placed; x++) {
      for (let y = 0; y < randomStartY && !placed; y++) {
        if (checkSpace(x, y, width, height)) {
          // Mark building space
          for (let i = x; i < x + width; i++) {
            for (let j = y; j < y + height; j++) {
              grid[i][j] = 1; // Building cell
            }
          }
          // Mark surrounding roads
          markRoads(x, y, width, height);
          placed = true; // Building placed
        }
      }
    }
  }

  return placed; // Return whether the building was successfully placed
}

function checkSpace(x, y, width, height) {
  for (let i = x; i < x + width; i++) {
    for (let j = y; j < y + height; j++) {
      if (i >= cols || j >= rows || grid[i][j] !== 0) {
        return false; // Space is not clear
      }
    }
  }
  return true; // Space is clear
}

function markRoads(x, y, width, height) {
  for (let i = x - 1; i <= x + width; i++) {
    for (let j = y - 1; j <= y + height; j++) {
      if (i >= 0 && i < cols && j >= 0 && j < rows && grid[i][j] === 0) {
        grid[i][j] = 2; // Road cell
      }
    }
  }
}

function drawGrid() {
  let offsetX = floor((cols - width / cellSize) / 2);
  let offsetY = floor((rows - height / cellSize) / 2);

  for (let i = offsetX; i < cols - offsetX; i++) {
    for (let j = offsetY; j < rows - offsetY; j++) {
      let x = (i - offsetX) * cellSize;
      let y = (j - offsetY) * cellSize;
      stroke(0); // Outline each cell

      if (grid[i][j] === 1) {
        fill("rgba(100,100,100, 1)"); // Building
        rect(x, y, cellSize, cellSize);
      } else if (grid[i][j] === 2) {
        fill("rgba(200,200,200, 1)"); // Road
        rect(x, y, cellSize, cellSize);
      }
    }
  }
}

function keyPressed() {
  setup(); // Re-initialize the setup to regenerate the grid
}
