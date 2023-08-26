
// Declaration of Variables

// const boxesGenerated = document.querySelector('.boxes-generated');
const borderButton = document.querySelector('.border-button'); // Toggle borderButton
let toggleBorderButton = true; // Borders are turned on by default

// The next two variables are declared that way because I'll be using them in my toggleButton() function. 
// That function will loop through each object and toggle each button and then either add or remove a CSS class respectively. 
let buttonStates = {
  shade: false,
  erase: false,
  eraseShader: false,
  rainbow: false,
  brush: false
};

const buttons = document.querySelectorAll('.shading-button, .rainbow-button, .clear-button, .erase-button, .erase-shader-button, .brush-button');

// These two buttons were declared again with specific use in mind
const clearButton = document.querySelector('.clear-button'); // Added a setTimeout() in its function
const brushButton = document.querySelector('.brush-button'); // Default active button.

// Variables for the color treatment 
const colorChange = document.querySelector('#base'); // Targets the color palette button
let hexColor = '#000000';
let rgbaColor = `rgba(0, 0, 0, 1)` // I'm using both hex code and RGBA color values. 
let opacity = '0.1';

let isMouseDown = false; // This variable uses boolean values to check the mouse activity

//CSS Grid Variables
const gridContainer = document.querySelector('.grid-container');
const gridSizeInput = document.getElementById('grid-size');
const gridSizeValue = document.getElementById('grid-size-value');

//Functions
function updateGrid() {
  const gridSize = gridSizeInput.value;
  gridSizeValue.textContent = `${gridSize} x ${gridSize}`;

  gridContainer.innerHTML = ''; // Clear existing grid items

  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 1; i <= gridSize ** 2; i++) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('grid-item');
    // gridItem.textContent = i;
    
    gridItem.classList.add('grid-element');
    gridItem.textContent = " ";

    // Add a custom attribute to the new div
    gridItem.setAttribute('data-opacity', '0'); // Replace 'your-value-here' with your desired value // FOR FATHOMING 
    gridContainer.appendChild(gridItem);
  }

  boxesListener(toggleBorderButton);
}

// Initial call to populate the grid
updateGrid();


function handleMouseDown() {

    isMouseDown = true;

    // The if statements will check which button is active upon clicking
    if (buttonStates['shade']) {
      opacityShades(this); // Handles the shading function 
    }

    else if (buttonStates['erase']) {
      eraser(this); // Handles the erase function
    }

    else if (buttonStates['rainbow']) {
      hexColor = rainbowMode(); // Assigns a random hex code to the variable. 
      colorChange.value = hexColor; // Assigns the current color to colorChange. When the user switches to brush mode or shading button, the last color generated by rainbowMode() wil be used. 
      this.style.backgroundColor = hexColor;
      this.setAttribute('data-opacity', '1');
    }

    else if (buttonStates['eraseShader']) {
      eraserShader(this); // Handles the eraserShader function
    }

    else {
      this.style.backgroundColor = hexColor;
      this.setAttribute('data-opacity', '1');
    }
}

function handleMouseUp(){
    isMouseDown = false;
}

function handleMouseEnter(event) {
  if (isMouseDown) {
    handleMouseDown.call(this, event);
  }
}

//This function converts the Hex code for the colors to RGBA
//I need the RGBA values because of its alpha properties which are used in the shading and erase shading function

function hexToRgbA(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b})`;
}


//Assigns the new color value
function handleColorChange() { 
  hexColor = this.value;
}

function opacityShades(div) {
    // First it will check if the data-color attribute matches the current color
    // If it doesn't then that means the user has selected a new color and the program must reset the opacity value    
    if (!(div.getAttribute('data-color') == hexColor)) {
      div.setAttribute('data-opacity', '0');
    }

    let currentAlpha = parseFloat(div.getAttribute('data-opacity')) + 0.1; // Convert to number using parseFloat()
    currentAlpha = parseFloat(currentAlpha.toFixed(2)); // Round to 2 decimal places
    currentAlpha = Math.min(currentAlpha, 1); // Limit opacity to a maximum of 1

    div.setAttribute('data-opacity', currentAlpha); //Increments the opacity value of the target DOM element by updating the values of the attribute 

    const indexOfLastComma = hexToRgbA(hexColor).lastIndexOf(')');     // Find the index of the last ) in the rgbaColor string
    rgbaColor = `${hexToRgbA(hexColor).slice(0, indexOfLastComma)},${currentAlpha})`;  // Slice the rgbaColor string up to the last comma and replace with the new alpha value
    div.style.backgroundColor = rgbaColor; // Applies the RGBA values to the styling of the div
    div.setAttribute('data-color', hexColor); // Apply the hex code as an attribute. This is used for checking if the current color matches to what was already applied to the div
    //If the colors match, then it will start incrementing the opacity value. 

    // In this code:
    // indexOfLastComma is used to find the index of the last comma in the rgbaColor string.
    // The slice() operation is then applied to remove everything after the last comma and replace it with the new alpha value.
    // This approach should work regardless of whether the alpha value is 0.1 or 1. It ensures that the alpha value is properly replaced while preserving the original color components.
 
}

function eraser (div) {

  //In this code: 
  // The stylings and the attributes applied are removed 
  // The opacity shade attribute is set to zero. 

  div.removeAttribute('style');
  div.removeAttribute('data-color');
  div.setAttribute('data-opacity', '0');
}

// Toggle Borders

function toggleBorders(){
  (!toggleBorderButton) ? toggleBorderButton = true :  toggleBorderButton = false;
  console.log(`Border Button: ${toggleBorderButton}`);

  boxesListener(toggleBorderButton);
}

// Toggles the buttons on and off. Only one button can be active at a time

function toggleButton(event) {
  console.clear();
  const clickedButtonId = event.target.id; // Get the ID of the button that was clicked
  const isAlreadyActive = event.target.classList.contains('active');  // Check if the clicked button is already active

  buttons.forEach(button => button.classList.remove('active')); // Remove the 'active' class from all buttons

  // Reset all other button states objects
    for (const buttonId in buttonStates) {
      if (buttonId !== clickedButtonId || isAlreadyActive) {
         // Set the state of buttons other than the clicked one to false
        buttonStates[buttonId] = false;

        if (isAlreadyActive) {
          brushButton.classList.add('active'); // If the button clicked is already active, it will toggle off and the brush button will be activated by default
          buttonStates['brush'] = true;
        }
      }
      else {
        // Set the state of the clicked button to true
        buttonStates[buttonId] = true;
        event.target.classList.add('active'); 
      }
      console.log(`${buttonId} :  ${ buttonStates[buttonId]}`);
    }
} 

function clearArtBoard() {
  const boxes = document.querySelectorAll('.grid-element');
  boxes.forEach(box => {
    eraser(box); //calls the erase function on each div element
  });

  clearButton.classList.add('active'); //Briefly adds the active CSS style for visual feedback

  console.clear();

  //Deactivates clear button and then turns on the default mode which is the brush button
  setTimeout(() => {
      clearButton.classList.remove('active'); 
      brushButton.classList.add('active');
      buttonStates['brush'] = true;
      console.log(`brush : ${buttonStates['brush']}`);
  }, 500);
}

function eraserShader(div) {

  const currentOpacity = parseFloat(div.getAttribute('data-opacity'));  // converts the string to integer using parseFloat 
    
    // At maximum opacity, the Alpha in RGBA values disappear. this code will bring it back manually.
    if (currentOpacity === 1) {

      const indexOfLastComma = div.style.backgroundColor.lastIndexOf(')');

      let currentAlpha = currentOpacity - 0.1;
      currentAlpha = parseFloat(currentAlpha.toFixed(2)); // Rounded to 2 decimal places and converted to a number
      rgbaColor = `${div.style.backgroundColor.slice(0, indexOfLastComma)},${currentAlpha})`;  // Slice the parenthesis from the RGB color value and concatenate the new alpha value
      div.style.backgroundColor = rgbaColor;
      div.setAttribute('data-opacity', currentAlpha); // Manually assign the current opacity to the attribute for future reference
    }

    // Eraser Shader works by decrementing the alpha values.
    else if (currentOpacity > 0.1) {

      const indexOfLastComma = div.style.backgroundColor.lastIndexOf(',');

      let currentAlpha = currentOpacity - 0.1;
      currentAlpha = parseFloat(currentAlpha.toFixed(2)); // Rounded to 2 decimal places and converted to a number
      rgbaColor = `${div.style.backgroundColor.slice(0, indexOfLastComma)},${currentAlpha})`;  // Slice the rgbaColor string up to the last comma and concatenate the new alpha value
      div.style.backgroundColor = rgbaColor;
      div.setAttribute('data-opacity', currentAlpha); // Manually assign the current opacity to the attribute for future reference
    }
    
    //Once it reaches 0.1, and the user passes that div again, it will remove all the added attributes. 
    else if (currentOpacity === 0.1) {
      eraser(div);
    }

    else {
      return; //currentOpacity's value is zero, the target DOM element has no color in it. 
    }

}

//Random Hex code generator

function rainbowMode() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Adds the event listener to all the div
function boxesListener(grid) {
  const boxes = document.querySelectorAll('.grid-element');
  boxes.forEach(box => {
    box.addEventListener('mousedown', handleMouseDown);
    box.addEventListener('mouseup', handleMouseUp);
    box.addEventListener('mouseenter', handleMouseEnter);
    // box.addEventListener('mouseleave', handleMouseLeave);
      // box.addEventListener('mouseleave', stopClick)

    // Toggles the borders for each div

    if (grid) {
      box.classList.add('grid-border');
      borderButton.classList.add('active'); 
    }

    else {
      box.classList.remove('grid-border')
      borderButton.classList.remove('active');
    }

  });
}

// Event Listeners

colorChange.addEventListener('input', handleColorChange); //changed from "change" to "input".
buttons.forEach(button => button.addEventListener('mousedown', toggleButton)); 
borderButton.addEventListener('mousedown', toggleBorders);
clearButton.addEventListener('mousedown', clearArtBoard);
gridSizeInput.addEventListener('input', updateGrid);

// To achieve a smooth transition from mousedown to mouseenter while continuously pressing and dragging the mouse, you can use a combination of event listeners and a flag variable to track the mouse state. Here's a step-by-step approach to implementing this behavior:

// Add a flag variable, let's call it isMouseDown, to keep track of whether the mouse button is currently pressed or not. Initialize it as false.
// Add event listeners for mousedown, mouseup, mouseenter, and mouseleave on the target elements (.grid-element in your case).
// When the mousedown event is triggered, set isMouseDown to true.
// When the mouseup event is triggered, set isMouseDown to false.
// In the mouseenter event listener, check if isMouseDown is true. If it is, add the class to apply the pressed style (.classList.add('pressed')).
// In the mouseleave event listener, check if isMouseDown is true. If it is, remove the class to revert to the default style (.classList.remove('pressed')).
// This way, when you press the mouse down and drag it across the elements, they will continuously transition between the pressed and default styles.

// Here's an example code for the JavaScript part:

// const boxes = document.querySelectorAll('.grid-element');
// let isMouseDown = false;

// function handleMouseDown() {
//   isMouseDown = true;
// }

// function handleMouseUp() {
//   isMouseDown = false;
// }

// function handleMouseEnter() {
//   if (isMouseDown) {
//     this.classList.add('pressed');
//   }
// }

// function handleMouseLeave() {
//   if (isMouseDown) {
//     this.classList.remove('pressed');
//   }
// }

// boxes.forEach(box => {
//   box.addEventListener('mousedown', handleMouseDown);
//   box.addEventListener('mouseup', handleMouseUp);
//   box.addEventListener('mouseenter', handleMouseEnter);
//   box.addEventListener('mouseleave', handleMouseLeave);
// });

