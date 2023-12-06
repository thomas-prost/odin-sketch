const DEFAULT_GRID = 16;
const DEFAULT_COLOR = "black";
const DEFAULT_FILL = "background";
const DEFAULT_BRUSH = "cell";
const MAX_GRID = 100;
const MAX_GRID_ITEMS = 10000;

const gridContainer = document.querySelector(".gridContainer");
const gridItem = document.querySelectorAll(".gridItem");
const reset = document.querySelector("#reset");
const btnGrid = document.querySelector("#grid");
const rangeInput = document.querySelector("#rangeInput");
const rangeCaption = document.querySelector("#rangeCaption");
const colorMode = document.querySelectorAll(".colorBox");
const idInfo = document.querySelector("#idInfo");
const colInfo = document.querySelector("#colInfo");
const rowInfo = document.querySelector("#rowInfo");
const gridMinus = document.querySelector(".gridMinus");
const gridPlus = document.querySelector(".gridPlus");
const fillMode = document.querySelectorAll(".fillMode");
const brushMode = document.querySelectorAll(".brushMode")

let box = DEFAULT_GRID;
let color = DEFAULT_COLOR;
let currentFill = DEFAULT_FILL; 
let currentBrush = DEFAULT_BRUSH;
let boxNumber = box * box;
let isDrawing = false;
let isColorRandom = false;

reset.addEventListener("click", erase);
btnGrid.addEventListener("click", toggleGridVisibility);
gridContainer.addEventListener("mousedown", handleMouseDown);
gridContainer.addEventListener("mouseleave", handleMouseUp);
document.body.addEventListener("mouseup", handleMouseUp);
gridContainer.addEventListener("dragstart", (e) => {
  e.preventDefault();
  return false;
});

// Init grid on loading
window.onload = () => {
  initGrid(box);
};

// Grid first Init
function initGrid(box) {
  for (let i = 1; i <= MAX_GRID_ITEMS; i++) {
    const createGridItem = document.createElement("div");
    const itemId = i.toString().padStart(5, "0");
    createGridItem.id = itemId;
    createGridItem.classList.add("gridItem");
    createGridItem.addEventListener("mouseover", handleMouseOver);
    gridContainer.appendChild(createGridItem);
  };
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

// Define grid setting
function updateRangeCaption() {
  rangeCaption.textContent = "Current Grid: " + box + " \u00d7 " + box;
  rangeInput.value = box;
};

// Re-init grid with input range
rangeInput.addEventListener("change", () => {
  box = Number(rangeInput.value);
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

// Re-init grid with increment -
gridMinus.addEventListener("click", () => {
  box == 4 ? box : box--;
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

// Re-init grid with increment +
gridPlus.addEventListener("click", () => {
  box == 100 ? box : box++;
  updateRangeCaption();
  resetGrid();
  gridUpdate(box);
});

// Erase drawing
function erase() {
  while (gridContainer.firstChild) {
    gridContainer.removeChild(gridContainer.firstChild);
  }
  initGrid(box);
};

function updateSelectedBox(button, modes) {
  modes.forEach((button) => {
    button.classList.remove("boxSelected");
  });
  button.classList.add("boxSelected");
}

// Setup colorMode
colorMode.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id == "rainbow") {
      isColorRandom = true;
    } else {
      isColorRandom = false;
      color = button.id;
    }
    updateSelectedBox(button, colorMode);
  });
});

// Setup fillMode
fillMode.forEach((button) => {
  button.addEventListener("click", () => {
    currentFill = button.id;
    updateSelectedBox(button, fillMode);
  })
});

// Setup brushMode
brushMode.forEach((button) => {
  button.addEventListener("click", () => {
    currentBrush = button.id;
    updateSelectedBox(button, brushMode);
  })
});

// Random RGB generator
function generateRGB() {
  const getRandom = (max) => Math.floor(Math.random() * max);
  const r = getRandom(255);
  const g = getRandom(255);
  const b = getRandom(255);
  return r + "," + g + "," + b;
}

function drawBackground(event) {
  event.target.classList.remove("black", "grey", "white", "red", "yellow", "green", "blue", "purple", "brown");
  if (isColorRandom) {
    event.target.style.backgroundColor = "rgb(" + generateRGB() + ")";
  } else {
    event.target.style.removeProperty("background-color");
    event.target.classList.add(color);
  }
};

function drawBorder(event) {
  event.target.classList.remove("border-black", "border-grey", "border-white", "border-red", "border-yellow", "border-green", "border-blue", "border-purple", "border-brown");
  if (isColorRandom) {
    event.target.style.border = "5px solid rgb(" + generateRGB() + ")";
  } else {
    event.target.style.removeProperty("border");
    event.target.classList.add("border-" + color);
  }
};

function drawBackgroundById(divId) {
  const targetDiv = document.getElementById(divId);
  targetDiv.classList.remove("black", "grey", "white", "red", "yellow", "green", "blue", "purple", "brown");
  if (isColorRandom) {
    targetDiv.style.backgroundColor = "rgb(" + generateRGB() + ")";
  } else {
    targetDiv.style.removeProperty("background-color");
    targetDiv.classList.add(color);
  }
};

function drawBorderById(divId) {
  const targetDiv = document.getElementById(divId);
  targetDiv.classList.remove("border-black", "border-grey", "border-white", "border-red", "border-yellow", "border-green", "border-blue", "border-purple", "border-brown");
  if (isColorRandom) {
    targetDiv.style.border = "5px solid rgb(" + generateRGB() + ")";
  } else {
    targetDiv.style.removeProperty("border");
    targetDiv.classList.add("border-" + color);
  }
};

function applyDrawBackgroundToIds(idArray) {
  idArray.forEach(function (divId) {
    drawBackgroundById(divId);
  });
};

function applyDrawBorderToIds(idArray) {
  idArray.forEach(function (divId) {
    drawBorderById(divId);
  });
};

function handleMouseDown(event) {
  isDrawing = true;
  const idsOfCol = getIdOfCol(event);
  const idsOfRow = getIdOfRow(event);
  if (currentBrush == "cell") {
    if (currentFill == "background"){
      drawBackground(event);
    } else if (currentFill == "border") {
      drawBorder(event);
    };
  }
  else if (currentBrush == "col") {
    if (currentFill == "background"){
      applyDrawBackgroundToIds(idsOfCol);
    } else if (currentFill == "border") {
      applyDrawBorderToIds(idsOfCol);
    }
  }
  else if (currentBrush == "row") {
    if (currentFill == "background") {
      applyDrawBackgroundToIds(idsOfRow);
    } else if (currentFill == "border") {
      applyDrawBorderToIds(idsOfRow);
    };
  }
};

function handleMouseOver(event) {
  const idsOfCol = getIdOfCol(event);
  const idsOfRow = getIdOfRow(event);
  if (isDrawing == true) {
    if (currentBrush == "cell") {
      if (currentFill == "background"){
        drawBackground(event);
      } else if (currentFill == "border") {
        drawBorder(event);
      }
    }
    else if (currentBrush == "col") {
      if (currentFill == "background"){
        applyDrawBackgroundToIds(idsOfCol);
      } else if (currentFill == "border") {
        applyDrawBorderToIds(idsOfCol);
      }
    }
    else if (currentBrush == "row") {
      console.log(currentBrush);
      if (currentFill == "background") {
        applyDrawBackgroundToIds(idsOfRow);
      } else if (currentFill == "border") {
        applyDrawBorderToIds(idsOfRow);
      };
    }
  }
  // getCoord(event);
};

function handleMouseUp() {
  isDrawing = false;
  // getCoord(event);
};

function getCoord(event) {
  const uniqueId = event.target.id;
  const column = Math.floor((uniqueId - 1)% box) + 1;
  const row = Math.floor((uniqueId - 1)/ box) + 1;
  idInfo.textContent = "Id: " + uniqueId;
  colInfo.textContent = "Column: " + column;
  rowInfo.textContent = "Row: " + row;
  return {uniqueId, column, row};
};

function getIdOfCol(event) {
  const cellInfos = getCoord(event);
  const cellId = Number(cellInfos.uniqueId);
  const idInCol = [];
  for (let i = cellInfos.column; i < cellId; i += box) {
    idInCol.push(i.toString().padStart(5, '0'));
  }
  for (let i = cellId; i <= box * box; i += box) {
    idInCol.push(i.toString().padStart(5, '0'));
  }
  return idInCol;
};

function getIdOfRow(event) {
  const cellInfos = getCoord(event);
  const idInRow = [];
  for (let i = box * (cellInfos.row - 1) + 1; i <= box * cellInfos.row; i++) {
    idInRow.push(i.toString().padStart(5, '0'));
  }
  return idInRow;
};

// Show or Hide grid
function toggleGridVisibility() {
  gridContainer.classList.toggle("showGrid");
  btnGrid.classList.toggle("visible");
};

function resetGrid() {
  const hiddenChildren = document.querySelectorAll(".boxHidden");
  hiddenChildren.forEach(child => {
    child.classList.remove("boxHidden");
  });
};