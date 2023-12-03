const DEFAULT_GRID = 16;
const DEFAULT_COLOR = "black";
const MAX_GRID = 100;
const MAX_GRID_ITEMS = 10000;
const DEFAULT_MODE = "draw";

const gridContainer = document.querySelector(".gridContainer");
const gridItem = document.querySelectorAll(".gridItem");
const reset = document.querySelector("#reset");
const btnGrid = document.querySelector("#grid");
const rangeInput = document.querySelector("#rangeInput");
const rangeCaption = document.querySelector("#rangeCaption");
const colorBoxes = document.querySelectorAll(".colorBox");
const colMode = document.querySelector("#colMode");
const colInfo = document.querySelector("#colInfo");
const rowInfo = document.querySelector("#rowInfo");
const gridMinus = document.querySelector(".gridMinus");
const gridPlus = document.querySelector(".gridPlus");

let box = DEFAULT_GRID;
let color = DEFAULT_COLOR;
let boxNumber = box * box;
let isDrawing = false;
let isColorRandom = false;

reset.addEventListener("click", erase);
btnGrid.addEventListener("click", toggleGridVisibility);
colMode.addEventListener("click", toggleColMode);
gridContainer.addEventListener("mousedown", handleMouseDown);
gridContainer.addEventListener("mouseleave", handleMouseUp);
document.body.addEventListener("mouseup", handleMouseUp);
gridContainer.addEventListener("dragstart", (e) => {
  e.preventDefault();
  return false;
});

// Define grid setting
function updateRangeCaption() {
  rangeCaption.textContent = "Current Grid: " + box + " \u00d7 " + box;
  rangeInput.value = box;
};

// Grid first Init
function initGrid(box) {
  for (let i = 1; i <= MAX_GRID_ITEMS; i++) {
    const createGridItem = document.createElement("div");
    const itemId = i.toString().padStart(5, '0');
    createGridItem.id = itemId;
    createGridItem.classList.add("gridItem");
    createGridItem.addEventListener("mouseover", handleMouseOver);
    gridContainer.appendChild(createGridItem);
  };
  document.documentElement.style.setProperty("--gridItemSize", 100 / box + "%");
  updateRangeCaption();
  gridUpdate(box);
};

// Grid Update
function gridUpdate(box) {
  const startIndex = box * box;
  const childrenArray = Array.from(gridContainer.children);
  const childrenToHide = childrenArray.slice(startIndex);
  for (const child of childrenToHide) {
    child.classList.add("boxHidden");
  }
  document.documentElement.style.setProperty("--gridItemSize", 100 / box + "%");
};

// Random RGB generator
function getRandom(max) {
  return Math.floor(Math.random() * max);
}

function generateRGB() {
  const r = getRandom(255);
  const g = getRandom(255);
  const b = getRandom(255);
  return r + "," + g + "," + b;
}

function toggleColMode() {
  
}

// Avoid multiple grids
function removeGrid() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
}

// Setup Colorbox
colorBoxes.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id == "rainbow") {
      isColorRandom = true;
      color = button.id;
    } else {
      isColorRandom = false;
      color = button.id;
    }
    colorBoxes.forEach((button) => {
      button.classList.remove("colorBoxSelected");
    })
    button.classList.add("colorBoxSelected");
  });
});

// Re-init grid with new box value
rangeInput.addEventListener("change", () => {
  box = rangeInput.value;
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

gridMinus.addEventListener("click", () => {
  if (box == 4) {}
  else {
    box--;
  }
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

gridPlus.addEventListener("click", () => {
  if (box == 100) {}
  else {
    box++;
  }
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

function resetGrid() {
  const hiddenChildren = document.querySelectorAll(".boxHidden");
  hiddenChildren.forEach(child => {
    child.classList.remove("boxHidden");
  });
};

// Erase drawing
function erase() {
  removeGrid();
  initGrid(box);
};

function draw(event) {
  event.target.classList.remove(
    "black", "grey", "white", "red", "yellow", "green", "blue", "purple", "brown");
    if (isColorRandom == true) {
      event.target.style.backgroundColor = "rgb(" + generateRGB() + ")";
    } else {
      event.target.removeAttribute("style");
      event.target.classList.add(color);
    }
  };
  
  function handleMouseDown(event) {
    isDrawing = true;
    draw(event);
    getCoord(event);
  };
  
  function handleMouseUp(event) {
    isDrawing = false;
    getCoord(event);
  };
  
  function handleMouseOver(event) {
    if (isDrawing == true) {
      draw(event);
    }
    getCoord(event);
  };
  
  function getCoord(event) {
    const uniqueId = event.target.id;
    const row = Math.floor((uniqueId - 1)/ box) + 1;
    const column = Math.floor((uniqueId - 1)% box) + 1;
    colInfo.textContent = "Column: " + column;
    rowInfo.textContent = "Row: " + row;
  };
  
  // Show or Hide grid
  function toggleGridVisibility() {
    gridContainer.classList.toggle("showGrid");
    btnGrid.classList.toggle("visible")
  };
  
  // Init grid on loading
  window.onload = () => {
    initGrid(box)
  }
  
  function test() {
    console.log("bravo!")
  };