const DEFAULT_GRID = 16;
const DEFAULT_COLOR = "black";

const gridContainer = document.querySelector(".gridContainer");
const gridItem = document.querySelectorAll(".gridItem");
const reset = document.querySelector("#reset");
const btnGrid = document.querySelector("#grid");
const rangeInput = document.querySelector("#rangeInput");
const rangeCaption = document.querySelector("#rangeCaption");
const colorBoxes = document.querySelectorAll(".colorBox");

let box = DEFAULT_GRID;
let color = DEFAULT_COLOR;
let boxNumber = box * box;
let isDrawing = false;
let isColorRandom = false;

function updateRangeCaption() {
  rangeCaption.textContent = "Current Grid: " + box + " \u00d7 " + box;
}

// Init grid
function initGrid(box) {
  for (let i = 0; i < box * box; i++) {
    const createGridItem = document.createElement("div");
    createGridItem.classList.add("gridItem");
    createGridItem.addEventListener("mousedown", handleMouseDown);
    createGridItem.addEventListener("mouseup", handleMouseUp);
    createGridItem.addEventListener("mouseover", handleMouseOver);
    document.documentElement.style.setProperty("--gridItemSize", 100 / box + "%");
    gridContainer.appendChild(createGridItem);
    updateRangeCaption();
  };
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

// Avoid multiple grids
function removeGrid() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
  btnGrid.textContent = "Show Grid";
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
rangeInput.addEventListener("input", () => {
  removeGrid();
  box = rangeInput.value;
  initGrid(box);
});

// Erase drawing
function erase() {
  removeGrid();
  initGrid(box);
}
reset.addEventListener("click", erase);

function handleMouseDown(event) {
  isDrawing = true;
  event.target.classList.remove("black", "grey", "white", "red", "yellow", "green", "blue", "purple", "brown");
  if (isColorRandom == true) {
    event.target.style.backgroundColor = "rgb(" + generateRGB() + ")";
  } else {
    event.target.removeAttribute("style");
    event.target.classList.add(color);
  }
}

function handleMouseUp() {
  isDrawing = false
}

function handleMouseOver(event) {
  if (isDrawing == true) {
    event.target.classList.remove("black", "grey", "white", "red", "yellow", "green", "blue", "purple", "brown");
    if (isColorRandom == true) {
      event.target.style.backgroundColor = "rgb(" + generateRGB() + ")";
    } else {
      event.target.removeAttribute("style");
      event.target.classList.add(color);
    }
  }
}

// Show or Hide grid
function toggleGrid() {
  const gridItemExisting  = document.querySelectorAll(".gridItem");
  const btnGridText = btnGrid.textContent;
  gridItemExisting.forEach(gridItem => {
    gridItem.classList.toggle("showGrid");
  });
  btnGrid.textContent = btnGridText === "Show Grid" ? "Hide Grid" : "Show Grid";
}
btnGrid.addEventListener("click", toggleGrid);

// Init grid on loading
window.onload = () => {
  initGrid(box)
}