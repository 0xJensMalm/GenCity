class Texture {
  constructor(front, left, top) {
    this.front = front; // Front face texture
    this.left = left; // Left face texture
    this.top = top; // Top face texture
  }
}

// Plain colored texture
const plainTexture = new Texture("plain_front", "plain_left", "plain_top");

// Texture with windows
const windowTexture = new Texture("window_front", "window_left", "window_top");

class Building {
  constructor(x, y, size, height, texture) {
    this.x = x; // X position on the grid
    this.y = y; // Y position on the grid
    this.size = size; // Size { w, h } of the building base
    this.height = height; // Height of the building (3-8 cells)
    this.texture = texture; // Texture class for the building
  }

  // Implement the display method
  display() {
    push(); // Save the current drawing settings
    translate(this.x * cellSize, this.y * cellSize); // Position the building on the grid

    // Draw the front face of the building
    fill(this.texture.front); // Use the front texture color
    rect(
      0,
      -this.height * cellSize,
      this.size.w * cellSize,
      this.size.h * cellSize
    );

    // Draw the left face of the building
    fill(this.texture.left); // Use the left texture color
    // Example drawing for the left face - adjust as needed
    beginShape();
    vertex(0, -this.height * cellSize);
    vertex(-cellSize / 2, -this.height * cellSize - cellSize / 2);
    vertex(-cellSize / 2, this.size.h * cellSize - cellSize / 2);
    vertex(0, this.size.h * cellSize);
    endShape(CLOSE);

    // Draw the top face of the building
    fill(this.texture.top); // Use the top texture color
    // Example drawing for the top face - adjust as needed
    beginShape();
    vertex(0, -this.height * cellSize);
    vertex(this.size.w * cellSize, -this.height * cellSize);
    vertex(
      this.size.w * cellSize - cellSize / 2,
      -this.height * cellSize - cellSize / 2
    );
    vertex(-cellSize / 2, -this.height * cellSize - cellSize / 2);
    endShape(CLOSE);

    pop(); // Restore the previous drawing settings
  }
}

function generateBuilding(x, y, size) {
  const height = Math.floor(Math.random() * (8 - 3 + 1)) + 3; // Random height between 3 and 8
  const textures = [plainTexture, windowTexture];
  const texture = textures[Math.floor(Math.random() * textures.length)]; // Randomly select a texture

  return new Building(x, y, size, height, texture);
}
