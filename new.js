

// console.log("Heelo");
// let person = window.prompt("Please enter your name", "Harry Potter");
// console.log(person);
let rwidth = window.innerWidth;
let rheight = window.innerHeight;
 
let iwidth = rwidth/3.03;
let ilength = rheight/2.4;
const myImage = new Image(iwidth, iwidth);
myImage.src = 'field.jpeg';

let foot = iwidth/12;
let finch = foot/12;
let currentUnit = 'inch';
const unitConversions = {
  'inch': 1,
  'foot': 1/12,
  'mm': 25.4,
  'cm': 2.54,
  'meter': 0.0254
};

const unitLabels = {
  'inch': 'in',
  'foot': 'ft',
  'mm': 'mm',
  'cm': 'cm',
  'meter': 'm'
};

// Field size configuration
let fieldSizeL = 140.4;
let fieldSizeW = 140.4;

let inch = iwidth/fieldSizeL;

function updateInchCalculation() {
  inch = iwidth / fieldSizeL;
  recomputeAllPositions();
  if (selectedPoint) {
    updateCoordFields(selectedPoint);
  }
  updateDataSidebar();
}

let pwidth = iwidth/20;

let activePrimaryIndex = null;
let drivebaseColor = '#ffffff'; // white
let robotSizeColor = '#0066ff'; // blue
let headingColor = '#ff0000'; // red default
let pointHeadings = new Map(); // Store custom headings for each point

// const colorCircleStyles = `
//   .color-circle {
//     width: 20px;
//     height: 20px;
//     border-radius: 50%;
//     cursor: pointer;
//     border: 2px solid #555;
//     transition: transform 0.15s, box-shadow 0.15s;
//     flex-shrink: 0;
//   }
  
//   .color-circle:hover {
//     transform: scale(1.1);
//     box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
//   }
  
//   .color-circle-container {
//     display: flex;
//     align-items: center;
//     gap: 8px;
//   }
// `;

// Color schemes configuration
// Updated color schemes configuration
let currentColorScheme = 'blue-red';
const colorSchemes = {
  'black': { 
    name: 'Black only', 
    type: 'simple',
    colors: ['hsl(0, 0%, 10%)', 'hsl(0, 0%, 10%)'] 
  },
  'blue-green': { 
  name: 'Blue - Green', 
  type: 'simple',
  colors: ['hsl(210, 100%, 50%)', 'hsl(120, 60%, 50%)']  // Back to original brightness
},
'yellow-purple': { 
  name: 'Yellow - Purple', 
  type: 'custom',
  customFunction: (normalized) => {
    let hue, saturation, lightness;
    
    if (normalized < 0.25) {
      // Yellow to orange
      const localT = normalized / 0.25;
      hue = 70 - (70 - 20) * localT;  // 60° to 30°
      saturation = 100;
      lightness = 50;
    } else if (normalized < 0.6) {
      // Orange to red
      const localT = (normalized - 0.25) / 0.35;
      hue = 20 * (1 - localT);  // 30° to 0°
      saturation = 100;
      lightness = 50 - 5 * localT;
    } else {
      // Red to dark purple (go the RIGHT way around color wheel)
      const localT = (normalized - 0.6) / 0.4;
      hue = 340 - (340 - 280) * localT;  // 360° to 280° (stays in red/purple range)
      saturation = 100 - 30 * localT;
      lightness = 45 - 15 * localT;
    }
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
},
  // Replace the entire blue-red scheme with this more complex one
'blue-red': { 
  name: 'Blue - Red', 
  type: 'custom',  // Special type for custom logic
  customFunction: (normalized) => {
    let hue, saturation, lightness;
    
    if (normalized < 0.33) {
      // Light blue to blue (190° to 240°)
      const localT = normalized / 0.33;
      hue = 190 + (240 - 190) * localT;
      saturation = 80 + 20 * localT;
      lightness = 60 - 10 * localT;
    } else if (normalized < 0.66) {
      // Blue to red-purple (240° to 320°)
      const localT = (normalized - 0.33) / 0.33;
      hue = 240 + (320 - 240) * localT;
      saturation = 100;
      lightness = 50;
    } else {
      // Red-purple to dark purple (320° to 280°)
      const localT = (normalized - 0.66) / 0.34;
      hue = 320 + (280 - 320) * localT;
      saturation = 100 - 20 * localT;
      lightness = 50 - 15 * localT;
    }
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
},
  'green-purple': { 
    name: 'Green - Purple', 
    type: 'simple',
    colors: ['hsl(120, 60%, 50%)', 'hsl(280, 70%, 50%)'] 
  },
  'white-blue': { 
    name: 'White - Blue', 
    type: 'simple',
    colors: ['hsl(0, 0%, 90%)', 'hsl(210, 80%, 35%)']  // Darker blue
  },
  'white-red': { 
    name: 'White - Red', 
    type: 'simple',
    colors: ['hsl(0, 0%, 90%)', 'hsl(0, 80%, 35%)']  // Darker red
  },
  'white-green': { 
    name: 'White - Green', 
    type: 'simple',
    colors: ['hsl(0, 0%, 90%)', 'hsl(120, 60%, 30%)']  // Darker green
  },
  'rgb': {  // NEW SCHEME
    name: 'RGB Spectrum',
    type: 'multi',
    stops: [
      { pos: 0, color: 'hsl(280, 100%, 50%)' },    // Violet
      { pos: 0.17, color: 'hsl(240, 100%, 50%)' }, // Blue
      { pos: 0.33, color: 'hsl(180, 100%, 50%)' }, // Cyan
      { pos: 0.5, color: 'hsl(120, 100%, 50%)' },  // Green
      { pos: 0.67, color: 'hsl(60, 100%, 50%)' },  // Yellow
      { pos: 0.83, color: 'hsl(30, 100%, 50%)' },  // Orange
      { pos: 1, color: 'hsl(0, 100%, 50%)' }       // Red
    ]
  }
};

// make sure images are not dragged by the browser default

document.body.style.display = "flex";
document.body.style.justifyContent = "center"; 
document.body.style.alignItems = "center";     
document.body.style.height = "100vh";        
document.body.style.margin = "0";           
document.body.appendChild(myImage);

const rect = myImage;
console.log(rect.width);
console.log(rect.height);
console.log(rwidth);
console.log(rheight);
console.log(window.innerWidth);
console.log(window.innerHeight);

let inwidth = (rwidth / 2) - (rect.width / 2);
let outwidth = (rwidth/ 2) + (rect.width / 2);
let inHeight = (rheight / 2) - (rect.height / 2);
let outHeight = (rheight / 2) + (rect.height / 2);

const myElement = document.getElementById('myButton');

const imageSet = [
  "pinkbg.png",
  "purplebg.png",
  "bluebg.png",
  "greenbg.png",
  "yellowbg.png",
  "orangebg.png"
];

let spawnedImages = []; 
let spawnedCurves = [];
let cumulativeDistances = [];
let dragging = null;
let offsetX = 0; 
let offsetY = 0;
let isDragging = false;
let activeCurve = null;
let isDraggingCurve = false;
let startAtZero = false;

let spawnedPoints = [];
let selectedPoint = null;
let drivebaseL = null;
let drivebaseW = null;
let robotSizeL = null;
let robotSizeW = null;
let visualizationGroup = null;
let currentHoveredCurve = null;
let lineTrackingActive = false;
let curveMouseMoveHandler = null;

window.clickedOnPoint = false;

let pointOriginalPositions = new Map();

const sidebar = document.getElementById("sidebar");
sidebar.innerHTML = "<h3>Points</h3>";

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.style.position = "absolute";
svg.style.top = "0";
svg.style.left = "0";
svg.style.width = "100%";
svg.style.height = "100%";
svg.style.pointerEvents = "auto";
svg.style.zIndex = "1";
document.body.appendChild(svg);

const settingsSidebar = document.getElementById("settingsSidebar");


function calculateNaturalHeading(point) {
  const pointIndex = spawnedPoints.indexOf(point);
  if (pointIndex === -1) return null;
  
  // Check if there's a next point
  if (pointIndex < spawnedPoints.length - 1) {
    const nextPoint = spawnedPoints[pointIndex + 1];
    const [x1, y1] = getCenter(point);
    const [x2, y2] = getCenter(nextPoint);
    
    // Calculate angle from current point to next point
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Convert to compass heading (0° = up/north, 90° = right/east, etc.)
    // In screen coordinates: positive X is right, positive Y is down
    // Math.atan2 gives: 0° = right, 90° = down
    // We want: 0° = up, 90° = right, 180° = down, 270° = left
    let heading = (90 + angle + 360) % 360;
    return heading;
  }
  
  // If this is the last point, try to use the curve tangent
  const curve = spawnedCurves.find(c => c.img1 === point);
  if (curve && curve.allPoints && curve.allPoints.length > 1) {
    const tangent = getBezierTangentGlobal(0, curve.allPoints);
    const angle = Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI;
    let heading = (90 - angle + 360) % 360;
    return heading;
  }
  
  return null; // Default heading for last point with no curve
}

// Global version of getBezierTangent for use outside createCurve
function getBezierTangentGlobal(t, points) {
  const n = points.length - 1;
  let dx = 0;
  let dy = 0;
  
  for (let i = 0; i < n; i++) {
    const binomial = binomialCoefficientGlobal(n - 1, i);
    const term = binomial * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i);
    dx += n * term * (points[i + 1].x - points[i].x);
    dy += n * term * (points[i + 1].y - points[i].y);
  }
  
  return { dx, dy };
}

function binomialCoefficientGlobal(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result *= (n - i + 1) / i;
  }
  return result;
}

function updateHeadingField(point) {
  const headingInput = window.headingTheta;
  if (!headingInput || !point) {
    if (headingInput) headingInput.value = "";
    return;
  }
  
  let heading;
  if (pointHeadings.has(point)) {
    heading = pointHeadings.get(point);
  } else {
    heading = calculateNaturalHeading(point);
  }
  
  headingInput.value = Math.round(heading);
}

function updateSettingsSidebar() {
settingsSidebar.innerHTML = `
<div style = "margin top: 10px">
  <h3>Data / Settings</h3>
</div>
  
  <div class="setting-item">
    <label class="checkbox-label">
      <input type="checkbox" id="startAtZeroCheckbox">
      <span class="checkbox-text">Start at (0, 0)</span>
    </label>
  </div>

  <div class="setting-item" style="margin-top: 20px; display: flex; align-items: center; gap: 12px;">
    <label style="font-size:16px;color:#f0f0f0; flex-shrink: 0;">Color</label>
    <select id="colorSchemeDropdown" class="color-dropdown" style="flex: 1;">
      <option value="black">Black only</option>
      <option value="blue-green">Blue - Green</option>
      <option value="yellow-purple">Yellow - Purple</option>
      <option value="blue-red" selected>Blue - Red</option>
      <option value="green-purple">Green - Purple</option>
      <option value="white-blue">White - Blue</option>
      <option value="white-red">White - Red</option>
      <option value="white-green">White - Green</option>
      <option value="rgb">RGB Spectrum</option>
    </select>
  </div>

  <div class="setting-item" style="margin-top: 20px; display: flex; align-items: center; gap: 12px;">
    <label style="font-size:16px;color:#f0f0f0; flex-shrink: 0;">Unit</label>
    <select id="unitsDropdown" class="color-dropdown" style="flex: 1;">
      <option value="inch">Inches</option>
      <option value="foot">Feet</option>
      <option value="mm">Millimeters</option>
      <option value="cm">Centimeters</option>
      <option value="meter">Meters</option>
    </select>
  </div>

  <div class="setting-item" style="margin-top: 20px; display: block;">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
      <label style="font-size:16px;color:#f0f0f0;">Field Size (in)</label>
      <button id="resetFieldSizeBtn" class="reset-field-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
        </svg>
      </button>
    </div>
    <div style="display:flex;gap:8px;align-items:center;">
      <div style="flex:1;">
        <label style="display:block;margin-bottom:4px;font-size:14px;color:#ccc;">L:</label>
        <input type="number" id="fieldSizeL" class="coord-input" step="0.1" value="${fieldSizeL.toFixed(1)}" />
      </div>
      <div style="flex:1;">
        <label style="display:block;margin-bottom:4px;font-size:14px;color:#ccc;">W:</label>
        <input type="number" id="fieldSizeW" class="coord-input" step="0.1" value="${fieldSizeW.toFixed(1)}" />
      </div>
    </div>
  </div>

  <div id="coordFields" style="margin-top: 20px;">
    <label style="display:block;margin-bottom:6px;font-size:16px;">X (${unitLabels[currentUnit]})</label>
    <input type="number" id="coordX" class="coord-input" step="0.01" placeholder="—" />
    <label style="display:block;margin-top:10px;margin-bottom:6px;font-size:16px;">Y (${unitLabels[currentUnit]})</label>
    <input type="number" id="coordY" class="coord-input" step="0.01" placeholder="—" />
  </div>

<div class="setting-item" style="margin-top: 10px; display: block;">
  <div style="margin-bottom:4px; display: flex; align-items: center; gap: 8px;">
    <div class="color-circle" id="drivebaseColorCircle" style="background-color: ${drivebaseColor};"></div>
    <label style="font-size:16px;color:#f0f0f0;">Drivebase (in)</label>
  </div>
  <div style="display:flex;gap:8px;align-items:center;">
    <div style="flex:1;">
      <label style="display:block;margin-bottom:1px;font-size:14px;color:#ccc;">L:</label>
      <input type="number" id="drivebaseL" class="coord-input" step="0.1" placeholder="—" />
    </div>
    <div style="flex:1;">
      <label style="display:block;margin-bottom:1px;font-size:14px;color:#ccc;">W:</label>
      <input type="number" id="drivebaseW" class="coord-input" step="0.1" placeholder="—" />
    </div>
  </div>
</div>

<div class="setting-item" style="margin-top: 10px; display: block;">
  <div style="margin-bottom:4px; display: flex; align-items: center; gap: 8px;">
    <div class="color-circle" id="robotSizeColorCircle" style="background-color: ${robotSizeColor};"></div>
    <label style="font-size:16px;color:#f0f0f0;">Robot Size (in)</label>
  </div>
  <div style="display:flex;gap:8px;align-items:center;">
    <div style="flex:1;">
      <label style="display:block;margin-bottom:1px;font-size:14px;color:#ccc;">L:</label>
      <input type="number" id="robotSizeL" class="coord-input" step="0.1" placeholder="—" />
    </div>
    <div style="flex:1;">
      <label style="display:block;margin-bottom:1px;font-size:14px;color:#ccc;">W:</label>
      <input type="number" id="robotSizeW" class="coord-input" step="0.1" placeholder="—" />
    </div>
  </div>
</div>

<div class="setting-item" style="margin-top: 1px; display: block;">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <div class="color-circle" id="headingColorCircle" style="background-color: ${headingColor};"></div>
      <label style="font-size:16px;color:#f0f0f0;">Heading</label>
    </div>
    <button id="resetHeadingBtn" class="reset-field-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
      </svg>
    </button>
  </div>
  <div style="display:flex;gap:8px;align-items:center;">
    <label style="font-size:14px;color:#ccc;white-space:nowrap;">θ (deg):</label>
    <input type="number" id="headingTheta" class="coord-input" style="flex:1;" step="1" placeholder="—" min="0" max="359" />
  </div>
</div>
`;

  const startAtZeroCheckbox = document.getElementById("startAtZeroCheckbox");
  startAtZeroCheckbox.checked = startAtZero;

  startAtZeroCheckbox.addEventListener("change", (e) => {
    startAtZero = e.target.checked;
    
    if (spawnedPoints[0]) {
      spawnedPoints[0].isAtZero = startAtZero;
    }
    
    recomputeAllPositions();
    if (selectedPoint) {
      updateCoordFields(selectedPoint);
    }
    updateSidebar();
  });

  // Color scheme dropdown handler
  const colorSchemeDropdown = document.getElementById("colorSchemeDropdown");
  colorSchemeDropdown.value = currentColorScheme;
  
  colorSchemeDropdown.addEventListener("change", (e) => {
    currentColorScheme = e.target.value;
    console.log("Color scheme changed to:", currentColorScheme);
    updateAllCurves();
    updateSidebar();
  });

  // Units dropdown handler
  const unitsDropdown = document.getElementById("unitsDropdown");
  unitsDropdown.value = currentUnit;
  
  unitsDropdown.addEventListener("change", (e) => {
    currentUnit = e.target.value;
    updateSettingsSidebar();
    if (selectedPoint) {
      updateCoordFields(selectedPoint);
    }
    updateDataSidebar();
  });

  // Field size handlers
  const fieldSizeLInput = document.getElementById("fieldSizeL");
  const fieldSizeWInput = document.getElementById("fieldSizeW");
  const resetFieldSizeBtn = document.getElementById("resetFieldSizeBtn");

  fieldSizeLInput.addEventListener("input", (e) => {
    const newL = parseFloat(e.target.value);
    if (!isNaN(newL) && newL > 0) {
      fieldSizeL = newL;
      fieldSizeW = newL;
      fieldSizeWInput.value = newL.toFixed(1);
      updateInchCalculation();
    }
  });

  fieldSizeWInput.addEventListener("input", (e) => {
    const newW = parseFloat(e.target.value);
    if (!isNaN(newW) && newW > 0) {
      fieldSizeW = newW;
      fieldSizeL = newW;
      fieldSizeLInput.value = newW.toFixed(1);
      updateInchCalculation();
    }
  });

  resetFieldSizeBtn.addEventListener("click", () => {
    fieldSizeL = 140.4;
    fieldSizeW = 140.4;
    fieldSizeLInput.value = fieldSizeL.toFixed(1);
    fieldSizeWInput.value = fieldSizeW.toFixed(1);
    updateInchCalculation();
  });

  const drivebaseColorCircle = document.getElementById("drivebaseColorCircle");
const robotSizeColorCircle = document.getElementById("robotSizeColorCircle");

drivebaseColorCircle.addEventListener("click", (e) => {
  e.stopPropagation();
  const input = document.createElement("input");
  input.type = "color";
  input.value = drivebaseColor;
  input.addEventListener("change", (event) => {
    drivebaseColor = event.target.value;
    drivebaseColorCircle.style.backgroundColor = drivebaseColor;
  });
  input.click();
});

robotSizeColorCircle.addEventListener("click", (e) => {
  e.stopPropagation();
  const input = document.createElement("input");
  input.type = "color";
  input.value = robotSizeColor;
  input.addEventListener("change", (event) => {
    robotSizeColor = event.target.value;
    robotSizeColorCircle.style.backgroundColor = robotSizeColor;
  });
  input.click();
});

// Heading color circle
const headingColorCircle = document.getElementById("headingColorCircle");
headingColorCircle.addEventListener("click", (e) => {
  e.stopPropagation();
  const input = document.createElement("input");
  input.type = "color";
  input.value = headingColor;
  input.addEventListener("change", (event) => {
    headingColor = event.target.value;
    headingColorCircle.style.backgroundColor = headingColor;
  });
  input.click();
});

// Heading theta input
const headingThetaInput = document.getElementById("headingTheta");
headingThetaInput.addEventListener("input", (e) => {
  if (!selectedPoint) return;
  let value = parseFloat(e.target.value);
  if (!isNaN(value)) {
    // Normalize to 0-359
    value = ((value % 360) + 360) % 360;
    pointHeadings.set(selectedPoint, value);
  }
});

// Reset heading button
const resetHeadingBtn = document.getElementById("resetHeadingBtn");
resetHeadingBtn.addEventListener("click", () => {
  if (!selectedPoint) return;
  pointHeadings.delete(selectedPoint);
  updateHeadingField(selectedPoint);
});

window.headingTheta = headingThetaInput;

const drivebaseLInput = document.getElementById("drivebaseL");
const drivebaseWInput = document.getElementById("drivebaseW");
const robotSizeLInput = document.getElementById("robotSizeL");
const robotSizeWInput = document.getElementById("robotSizeW");

drivebaseLInput.addEventListener("input", (e) => {
  drivebaseL = parseFloat(e.target.value) || null;
});

drivebaseWInput.addEventListener("input", (e) => {
  drivebaseW = parseFloat(e.target.value) || null;
});

robotSizeLInput.addEventListener("input", (e) => {
  robotSizeL = parseFloat(e.target.value) || null;
});

robotSizeWInput.addEventListener("input", (e) => {
  robotSizeW = parseFloat(e.target.value) || null;
});

  window.coordX = document.getElementById("coordX");
  window.coordY = document.getElementById("coordY");
}

document.addEventListener('dragstart', (e) => {
  if (e.target.tagName.toLowerCase() === 'img') {
    e.preventDefault();
  }
});

function recomputeAllPositions() {
  spawnedPoints.forEach((img, i) => {
    const rect = img.getBoundingClientRect();
    const pointCenterX = rect.left + rect.width / 2;
    const pointCenterY = rect.top + rect.height / 2;

    let xIn, yIn;

    if (img.isAtZero) {
      xIn = 0;
      yIn = 0;
    } else {
      let referencePoint = null;
      for (let j = i - 1; j >= 0; j--) {
        if (spawnedPoints[j].isAtZero) {
          referencePoint = spawnedPoints[j];
          break;
        }
      }

      if (referencePoint) {
        const refRect = referencePoint.getBoundingClientRect();
        const baseX = refRect.left + refRect.width / 2;
        const baseY = refRect.top + refRect.height / 2;
        xIn = (pointCenterX - baseX) / inch;
        yIn = (pointCenterY - baseY) / inch;
      } else {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        xIn = (pointCenterX - centerX) / inch;
        yIn = (pointCenterY - centerY) / inch;
      }
    }

    img.xIn = xIn;
    img.yIn = -yIn;
  });

  updateAllCurves();
  updateDataSidebar();
}

updateSettingsSidebar();

// const coordX = document.getElementById("coordX");
// const coordY = document.getElementById("coordY");
// const startAtZeroCheckbox = document.getElementById("startAtZeroCheckbox");

function updateCoordFields(point) {
  if (!point) {
    coordX.value = "";
    coordY.value = "";
    return;
  }

  const rect = point.getBoundingClientRect();
  const pointCenterX = rect.left + rect.width / 2;
  const pointCenterY = rect.top + rect.height / 2;

  let xIn, yIn;

  if (point.isAtZero) {
    xIn = 0;
    yIn = 0;
  } else {
    const currentIndex = spawnedPoints.indexOf(point);
    let referencePoint = null;
    
    for (let j = currentIndex - 1; j >= 0; j--) {
      if (spawnedPoints[j].isAtZero) {
        referencePoint = spawnedPoints[j];
        break;
      }
    }

    if (referencePoint) {
      const refRect = referencePoint.getBoundingClientRect();
      const baseX = refRect.left + refRect.width / 2;
      const baseY = refRect.top + refRect.height / 2;
      xIn = (pointCenterX - baseX) / inch;
      yIn = (pointCenterY - baseY) / inch;
    } else {
      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      xIn = (pointCenterX - screenCenterX) / inch;
      yIn = (pointCenterY - screenCenterY) / inch;
    }
  }

  yIn *= -1;
  
  const conversion = unitConversions[currentUnit];
  window.coordX.value = (xIn * conversion).toFixed(2);
  window.coordY.value = (yIn * conversion).toFixed(2);
  updateHeadingField(point);
}

function moveSelectedPointFromInputs() {
  if (!selectedPoint) return;

  const newX = parseFloat(window.coordX.value);
  const newY = parseFloat(window.coordY.value);
  if (isNaN(newX) || isNaN(newY)) return;

  // Convert from current unit back to inches
  const conversion = unitConversions[currentUnit];
  const xInInches = newX / conversion;
  const yInInches = newY / conversion;

  const inchVal = inch;
  let targetX, targetY;

  const currentIndex = spawnedPoints.indexOf(selectedPoint);
  let referencePoint = null;
  
  for (let j = currentIndex - 1; j >= 0; j--) {
    if (spawnedPoints[j].isAtZero) {
      referencePoint = spawnedPoints[j];
      break;
    }
  }

  if (referencePoint) {
    const refRect = referencePoint.getBoundingClientRect();
    const baseX = refRect.left + refRect.width / 2;
    const baseY = refRect.top + refRect.height / 2;
    targetX = baseX + xInInches * inchVal;
    targetY = baseY - yInInches * inchVal;
  } else {
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    targetX = screenCenterX + xInInches * inchVal;
    targetY = screenCenterY - yInInches * inchVal;
  }

  selectedPoint.style.left = `${targetX - selectedPoint.offsetWidth / 2}px`;
  selectedPoint.style.top = `${targetY - selectedPoint.offsetHeight / 2}px`;

  updateAllCurves();
}

["change", "blur", "keyup"].forEach(eventType => {
  document.addEventListener(eventType, (e) => {
    if (e.target.id === "coordX" || e.target.id === "coordY") {
      moveSelectedPointFromInputs();
    }
  });
  });

function getCenter(img) {
  const rect = img.getBoundingClientRect();
  return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

// Add this function to create the visualization group
function getOrCreateVisualizationGroup() {
  if (!visualizationGroup) {
    visualizationGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    visualizationGroup.setAttribute("id", "visualization-group");
    visualizationGroup.setAttribute("pointer-events", "none"); // ADD THIS
    // Insert at the beginning of SVG, not at the end
    if (svg.firstChild) {
      svg.insertBefore(visualizationGroup, svg.firstChild);
    } else {
      svg.appendChild(visualizationGroup);
    }
  }
  return visualizationGroup;
}

// Function to calculate angle between two points in degrees
function calculateAngle(x1, y1, x2, y2) {
  const radians = Math.atan2(y2 - y1, x2 - x1);
  return (radians * 180) / Math.PI;
}

// Function to draw the drivebase and robot size rectangles
function drawDrivebaseVisualization(centerX, centerY, angle, vizGroup = null) {
  // Use provided vizGroup or the global one
  const targetGroup = vizGroup || getOrCreateVisualizationGroup();
  
  // Clear previous visualization
  while (targetGroup.firstChild) {
    targetGroup.removeChild(targetGroup.firstChild);
  }
  
  // Convert values to pixel measurements
  const drivebaseLPx = (drivebaseL || 0) * inch;
  const drivebaseWPx = (drivebaseW || 0) * inch;
  const robotSizeLPx = (robotSizeL || 0) * inch;
  const robotSizeWPx = (robotSizeW || 0) * inch;
  
  // Check if robot size is bigger than drivebase
  const robotSizeIsBigger = (robotSizeL && robotSizeW && drivebaseL && drivebaseW) &&
    (robotSizeLPx > drivebaseLPx || robotSizeWPx > drivebaseWPx);
  
  // Create group for transformations
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.setAttribute("transform", `translate(${centerX}, ${centerY}) rotate(${angle})`);
  
// Draw robot size if set (regardless of drivebase)
if (robotSizeL && robotSizeW) {
  const robotRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  robotRect.setAttribute("x", -robotSizeLPx / 2);
  robotRect.setAttribute("y", -robotSizeWPx / 2);
  robotRect.setAttribute("width", robotSizeLPx);
  robotRect.setAttribute("height", robotSizeWPx);
  robotRect.setAttribute("fill", robotSizeColor);
  robotRect.setAttribute("fill-opacity", "0.5");
  robotRect.setAttribute("stroke", "black");
  robotRect.setAttribute("stroke-width", "1");
  robotRect.setAttribute("pointer-events", "none");
  group.appendChild(robotRect);
}

// Draw drivebase if set (on top, centered)
if (drivebaseL && drivebaseW) {
  const drivebaseRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  drivebaseRect.setAttribute("x", -drivebaseLPx / 2);
  drivebaseRect.setAttribute("y", -drivebaseWPx / 2);
  drivebaseRect.setAttribute("width", drivebaseLPx);
  drivebaseRect.setAttribute("height", drivebaseWPx);
  drivebaseRect.setAttribute("fill", drivebaseColor);
  drivebaseRect.setAttribute("fill-opacity", "0.5");
  drivebaseRect.setAttribute("stroke", "black");
  drivebaseRect.setAttribute("stroke-width", "1");
  drivebaseRect.setAttribute("pointer-events", "none");
  group.appendChild(drivebaseRect);
}
  // Add heading indicator dot at the front of the robot
const dotRadius = 3;
const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
// Position at front-center of the larger rectangle
const largerL = Math.max(drivebaseLPx, robotSizeLPx);
dot.setAttribute("cx", largerL / 2 * .7);
dot.setAttribute("cy", 0);
dot.setAttribute("r", dotRadius);
dot.setAttribute("fill", headingColor);
dot.setAttribute("stroke", "white");
dot.setAttribute("stroke-width", "1");
dot.setAttribute("pointer-events", "none");
group.appendChild(dot);
  targetGroup.appendChild(group);
}

// Function to clear visualization
function clearVisualization() {
  if (visualizationGroup) {
    while (visualizationGroup.firstChild) {
      visualizationGroup.removeChild(visualizationGroup.firstChild);
    }
  }
}

// Replace the createCurve function with this corrected version
// This goes after the clearVisualization function and before connectLastTwo

function createCurve(img1, img2) {
  const circleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(circleGroup);

  const handleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(handleGroup);

  let controlOffsets = [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }];
  let activeHandleIndex = null;

  let handleBasePositions = [null, null, null, null];

  const CIRCLE_RADIUS = 2.5;
  const CIRCLE_SPACING = 6;

  const HANDLER_DISTANCE_THRESHOLDS = {
    1: 0,
    2: 220,
    3: 350,
    4: 450
  };

  function getCenter(el) {
    const rect = el.getBoundingClientRect();
    return [rect.left + rect.width / 2, rect.top + rect.height / 2];
  }

  function getColorAtDistance(distTraveled, maxDist) {
    const scheme = colorSchemes[currentColorScheme];
    const normalized = Math.min(distTraveled / 300, 1);
    
    if (scheme.type === 'custom' && scheme.customFunction) {
      return scheme.customFunction(normalized);
    }
    
    const parseHSL = (hslStr) => {
      const match = hslStr.match(/hsl\((\d+\.?\d*),\s*(\d+)%,\s*(\d+)%\)/);
      return {
        h: parseFloat(match[1]),
        s: parseInt(match[2]),
        l: parseInt(match[3])
      };
    };
    
    if (scheme.type === 'simple') {
      const start = parseHSL(scheme.colors[0]);
      const end = parseHSL(scheme.colors[1]);
      
      const h = start.h + (end.h - start.h) * normalized;
      const s = start.s + (end.s - start.s) * normalized;
      const l = start.l + (end.l - start.l) * normalized;
      
      return `hsl(${h}, ${s}%, ${l}%)`;
    } else if (scheme.type === 'multi') {
      const stops = scheme.stops;
      
      for (let i = 0; i < stops.length - 1; i++) {
        const currentStop = stops[i];
        const nextStop = stops[i + 1];
        
        if (normalized >= currentStop.pos && normalized <= nextStop.pos) {
          const localT = (normalized - currentStop.pos) / (nextStop.pos - currentStop.pos);
          const start = parseHSL(currentStop.color);
          const end = parseHSL(nextStop.color);
          
          const h = start.h + (end.h - start.h) * localT;
          const s = start.s + (end.s - start.s) * localT;
          const l = start.l + (end.l - start.l) * localT;
          
          return `hsl(${h}, ${s}%, ${l}%)`;
        }
      }
      
      return stops[stops.length - 1].color;
    }
  }

  function generalBezier(t, points) {
    const n = points.length - 1;
    let x = 0;
    let y = 0;
    
    for (let i = 0; i <= n; i++) {
      const binomial = binomialCoefficient(n, i);
      const term = binomial * Math.pow(1 - t, n - i) * Math.pow(t, i);
      x += term * points[i].x;
      y += term * points[i].y;
    }
    
    return { x, y };
  }

  function binomialCoefficient(n, k) {
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i;
    }
    return result;
  }

  // NEW: Function to get the tangent (derivative) of the Bezier curve at point t
  function getBezierTangent(t, points) {
    const n = points.length - 1;
    let dx = 0;
    let dy = 0;
    
    for (let i = 0; i < n; i++) {
      const binomial = binomialCoefficient(n - 1, i);
      const term = binomial * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i);
      dx += n * term * (points[i + 1].x - points[i].x);
      dy += n * term * (points[i + 1].y - points[i].y);
    }
    
    return { dx, dy };
  }

  function update() {
    const [x1, y1] = getCenter(img1);
    const [x2, y2] = getCenter(img2);

    const straightDist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let numHandles = 1;
    if (straightDist >= HANDLER_DISTANCE_THRESHOLDS[4]) numHandles = 4;
    else if (straightDist >= HANDLER_DISTANCE_THRESHOLDS[3]) numHandles = 3;
    else if (straightDist >= HANDLER_DISTANCE_THRESHOLDS[2]) numHandles = 2;

    const controlPoints = [];
    for (let i = 0; i < numHandles; i++) {
      const t = (i + 1) / (numHandles + 1);
      const baseX = x1 + t * (x2 - x1);
      const baseY = y1 + t * (y2 - y1);
      
      if (!handleBasePositions[i]) {
        handleBasePositions[i] = { x: baseX, y: baseY };
        if (!controlOffsets[i]) {
          controlOffsets[i] = { x: 0, y: 0 };
        }
      }
      
      controlPoints.push({
        x: baseX + controlOffsets[i].x,
        y: baseY + controlOffsets[i].y
      });
    }

    while (circleGroup.firstChild) {
      circleGroup.removeChild(circleGroup.firstChild);
    }

    while (handleGroup.firstChild) {
      handleGroup.removeChild(handleGroup.firstChild);
    }

    function evaluateCurve(t) {
      const p0 = { x: x1, y: y1 };
      const pN = { x: x2, y: y2 };
      const allPoints = [p0, ...controlPoints, pN];
      return generalBezier(t, allPoints);
    }

    // NEW: Store the all points for tangent calculation
    curveObj.allPoints = [{ x: x1, y: y1 }, ...controlPoints, { x: x2, y: y2 }];
    curveObj.evaluateCurve = evaluateCurve;

    let totalLength = 0;
    let prev = { x: x1, y: y1 };
    const lengthSamples = 100;
    for (let i = 1; i <= lengthSamples; i++) {
      const t = i / lengthSamples;
      const point = evaluateCurve(t);
      const dx = point.x - prev.x;
      const dy = point.y - prev.y;
      totalLength += Math.sqrt(dx * dx + dy * dy);
      prev = point;
    }

    const numCircles = Math.max(2, Math.floor(totalLength / CIRCLE_SPACING));

    let distTraveled = 0;
    for (let i = 0; i < numCircles; i++) {
      const t = i / (numCircles - 1);
      const point = evaluateCurve(t);

      if (i > 0) {
        const prevT = (i - 1) / (numCircles - 1);
        const prevPoint = evaluateCurve(prevT);
        distTraveled += Math.sqrt((point.x - prevPoint.x) ** 2 + (point.y - prevPoint.y) ** 2);
      }

      const color = getColorAtDistance(distTraveled, totalLength);

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", CIRCLE_RADIUS);
      circle.setAttribute("fill", color);
      circle.style.pointerEvents = "auto";
      circle.style.cursor = "pointer";
      
      circleGroup.appendChild(circle);
    }

    for (let i = 0; i < numHandles; i++) {
      const cp = controlPoints[i];
      
      const t = (i + 1) / (numHandles + 1);
      const distToHandle = totalLength * t;
      const handleColor = getColorAtDistance(distToHandle, totalLength);

      const handle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      const handleR = Math.max(5, (pwidth || 24) * 0.1);
      handle.setAttribute("cx", cp.x);
      handle.setAttribute("cy", cp.y);
      handle.setAttribute("r", handleR);
      handle.setAttribute("fill", handleColor);
      handle.setAttribute("fill-opacity", "0.75");
      handle.setAttribute("stroke", "white");
      handle.setAttribute("stroke-width", "2");
      handle.style.cursor = "grab";
      handle.style.opacity = "0";
      handle.style.transition = "opacity 0.15s ease";
      handle.style.pointerEvents = "auto";
      handle.dataset.handleIndex = i;

      // NEW: Hide visualization when hovering over handle
      // NEW: Hide visualization when hovering over handle
handle.addEventListener("mouseenter", () => {
  showHandles();
  // Temporarily hide visualization when over handle so it doesn't block interaction
  if (curveObj.vizGroup) {
    curveObj.vizGroup.style.display = "none";
  }
});

handle.addEventListener("mouseleave", (e) => {
  // Show visualization again
  if (curveObj.vizGroup) {
    curveObj.vizGroup.style.display = "block";
  }
  // Only hide handles if we're not actively dragging and curve isn't selected
  if (!curveObj.isSelected && activeHandleIndex === null) {
    hideHandles();
  }
});
    handle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.ignoreNextClick = true;
        onHandleMouseDown(e, i);
      });
      handle.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        window.ignoreNextClick = true;
      });

      handleGroup.appendChild(handle);
    }

    const avgColor = getColorAtDistance(totalLength);
    curveObj.color = avgColor;
    curveObj.maxDistance = totalLength;
    updateSidebarLineColor(curveObj, avgColor);
  }

  function showHandles() {
    const handles = handleGroup.querySelectorAll("circle");
    handles.forEach(h => {
      h.style.opacity = "1";
      h.style.display = "block";
    });
  }

  function hideHandles() {
    if (!curveObj.isSelected && activeHandleIndex === null) {
      const handles = handleGroup.querySelectorAll("circle");
      handles.forEach(h => {
        h.style.opacity = "0";
      });
    }
  }

  function onHandleMouseDown(e, handleIndex) {
    e.preventDefault();
    e.stopPropagation();
    window.ignoreNextClick = true;

    activeHandleIndex = handleIndex;
    activeCurve = curveObj;
    
    const handle = handleGroup.children[handleIndex];
    handle.style.cursor = "grabbing";
    handle.style.opacity = "1";

    const startX = e.pageX;
    const startY = e.pageY;
    const startOffset = { ...controlOffsets[handleIndex] };

    function onMove(ev) {
      const dx = ev.pageX - startX;
      const dy = ev.pageY - startY;
      controlOffsets[handleIndex].x = startOffset.x + dx;
      controlOffsets[handleIndex].y = startOffset.y + dy;
      update();
    }

    function onUp() {
      if (handle) handle.style.cursor = "grab";
      activeHandleIndex = null;
      activeCurve = null;

      setTimeout(() => window.ignoreNextClick = false, 50);

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  const curveObj = { circleGroup, handleGroup, img1, img2, update, controlOffsets, handleBasePositions };
  curveObj.id = "curve-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  curveObj.vizGroup = null;
  curveObj.curveMouseMoveHandler = null;

  // Create invisible hitbox overlay for smoother hover detection
  const hitboxPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  hitboxPath.setAttribute("stroke", "transparent");
  hitboxPath.setAttribute("stroke-width", "20");
  hitboxPath.setAttribute("fill", "none");
  hitboxPath.style.pointerEvents = "stroke";
  hitboxPath.style.cursor = "pointer";
  // Insert hitbox BEFORE the handle group so handles are on top
  svg.insertBefore(hitboxPath, handleGroup);
  curveObj.hitboxPath = hitboxPath;
  
  // Update hitbox path whenever curve updates
  const originalUpdate = curveObj.update;
  curveObj.update = function() {
    originalUpdate.call(this);
    const [x1, y1] = getCenter(curveObj.img1);
    const [x2, y2] = getCenter(curveObj.img2);
    hitboxPath.setAttribute("d", `M ${x1} ${y1} L ${x2} ${y2}`);
  };
  
  hitboxPath.addEventListener("mouseenter", () => {
    showHandles();
    currentHoveredCurve = curveObj;
    lineTrackingActive = true;
    
    // Only proceed if we have drivebase or robot size values
    if (!drivebaseL && !drivebaseW && !robotSizeL && !robotSizeW) {
      return;
    }
    
    // Create a dedicated visualization group if it doesn't exist for this curve
    if (!curveObj.vizGroup) {
      curveObj.vizGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      curveObj.vizGroup.setAttribute("pointer-events", "none");
      svg.appendChild(curveObj.vizGroup);
    }
    
    // NEW: Set up the mousemove handler to follow the CURVE, not straight line
    curveObj.curveMouseMoveHandler = (e) => {
  if (!lineTrackingActive) return;

  const mouseX = e.clientX;
  const mouseY = e.clientY;
  
  let closestT = 0;
  let minDist = Infinity;
  const samples = 50;
  
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const point = curveObj.evaluateCurve(t);
    const dist = Math.sqrt((point.x - mouseX) ** 2 + (point.y - mouseY) ** 2);
    
    if (dist < minDist) {
      minDist = dist;
      closestT = t;
    }
  }
  
  const position = curveObj.evaluateCurve(closestT);
  
  // Check if img1 has custom heading
  let angle;
  if (pointHeadings.has(curveObj.img1)) {
    // Use custom heading (convert from compass heading to math angle)
    const heading = pointHeadings.get(curveObj.img1);
    angle = 90 - heading; // Convert compass to math angle
  } else {
    // Use curve tangent
    const tangent = getBezierTangent(closestT, curveObj.allPoints);
    angle = Math.atan2(tangent.dy, tangent.dx) * 180 / Math.PI;
  }
  
  drawDrivebaseVisualization(position.x, position.y, angle, curveObj.vizGroup);
};
    
    document.addEventListener("mousemove", curveObj.curveMouseMoveHandler);
  });

  hitboxPath.addEventListener("mouseleave", () => {
    hideHandles();
    currentHoveredCurve = null;
    lineTrackingActive = false;
    
    // Remove the mousemove listener
    if (curveObj.curveMouseMoveHandler) {
      document.removeEventListener("mousemove", curveObj.curveMouseMoveHandler);
      curveObj.curveMouseMoveHandler = null;
    }
    
    // Clear the visualization group
    if (curveObj.vizGroup) {
      while (curveObj.vizGroup.firstChild) {
        curveObj.vizGroup.removeChild(curveObj.vizGroup.firstChild);
      }
    }
  });
  
  spawnedCurves.push(curveObj);
  update();
  return curveObj;
}

function updateAllCurves() {
  spawnedCurves.forEach((c) => c.update());
  updateSidebar();
  updateDataSidebar();
}

function connectLastTwo(img1 = null, img2 = null) {
  if (!img1 || !img2) {
    if (spawnedPoints.length < 2) return;
    img1 = spawnedPoints[spawnedPoints.length - 2];
    img2 = spawnedPoints[spawnedPoints.length - 1];
  }

  const curve = createCurve(img1, img2);
  spawnedCurves.push(curve);
}

function clicked(event) {
  if (event.target.closest("#sidebar")) return;

  const mouseX = event.pageX;
  const mouseY = event.pageY;

  const clickedPoint = spawnedPoints.find(p => {
    const rect = p.getBoundingClientRect();
    return (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    );
  });

  if (clickedPoint) {
    return;
  }

  if (
    mouseX > inwidth + pwidth / 2 &&
    mouseX < outwidth - pwidth / 2 &&
    mouseY > inHeight + pwidth / 2 &&
    mouseY < outHeight - pwidth / 2
  ) {
    const imgSrc = imageSet[spawnedPoints.length % imageSet.length];
    const image2 = new Image(pwidth, pwidth);
    image2.src = imgSrc;
    image2.style.opacity = "0.75";
    image2.style.position = "absolute";
    image2.style.left = mouseX - pwidth / 2 + "px";
    image2.style.top = mouseY - pwidth / 2 + "px";
    image2.draggable = false;
    image2.classList.add("spawned-point");
    document.body.appendChild(image2);

    spawnedPoints.push(image2);
    spawnedImages.push(image2);

    connectLastTwo();

    const centerX = rwidth / 2;
    const centerY = rheight / 2;
    image2.relX = (mouseX - centerX) / iwidth;
    image2.relY = (mouseY - centerY) / iwidth;

    image2.oncontextmenu = () => false;

    image2.addEventListener("mousedown", function (e) {
      if (e.button === 0) {
        e.stopPropagation();
        window.clickedOnPoint = true;
        dragging = image2;
        isDragging = true;

        const rect = image2.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        image2.style.transition = "none";
        selectPoint(image2);
      }
    });

    image2.addEventListener("click", (e) => {
      e.stopPropagation();

      const rect = image2.getBoundingClientRect();
      const pointCenterX = rect.left + rect.width / 2;
      const pointCenterY = rect.top + rect.height / 2;

      let xIn, yIn;

      if (startAtZero) {
        if (spawnedPoints.length === 1) {
          xIn = 0;
          yIn = 0;
        } else {
          const firstRect = spawnedPoints[0].getBoundingClientRect();
          const baseX = firstRect.left + firstRect.width / 2;
          const baseY = firstRect.top + firstRect.height / 2;

          xIn = (pointCenterX - baseX) / inch;
          yIn = (pointCenterY - baseY) / inch;
        }
      } else {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        xIn = (pointCenterX - centerX) / inch;
        yIn = (pointCenterY - centerY) / inch;
      }
      yIn *= -1;
      console.log(`🆕 New point created — X: ${xIn.toFixed(2)} in, Y: ${yIn.toFixed(2)} in`);
    });

    selectPoint(image2);
    updateCoordFields(image2);
    updateHeadingField(image2);
    resetLineStyles();
    updateSidebar();
    setTimeout(() => updateAllCurves(), 10);
  }
}

window.ignoreNextClick = window.ignoreNextClick || false;

document.addEventListener("click", function (e) {
  if (window.ignoreNextClick) {
    window.ignoreNextClick = false;
    return;
  }

  if (window.clickedOnPoint) {
    window.clickedOnPoint = false;
    return;
  }

  if (!isDragging && !isDraggingCurve) {
    clicked(e);
  }
});

document.addEventListener("mousedown", function(e) {
  const clickedPoint = spawnedPoints.find(p => {
    const rect = p.getBoundingClientRect();
    return (
      e.pageX >= rect.left &&
      e.pageX <= rect.right &&
      e.pageY >= rect.top &&
      e.pageY <= rect.bottom
    );
  });

  if (clickedPoint) {
    e.stopPropagation();
    window.clickedOnPoint = true;
    dragging = clickedPoint;
    isDragging = true;
    
    const rect = clickedPoint.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    
    clickedPoint.style.transition = "none";
    selectPoint(clickedPoint);
    updateCoordFields(clickedPoint);
  }
});

document.addEventListener("mousemove", function (e) {
  if (dragging) {
    dragging.style.left = e.pageX - offsetX + "px";
    dragging.style.top = e.pageY - offsetY + "px";

    spawnedCurves.forEach(c => {
      if (c.img1 === dragging || c.img2 === dragging) {
        c.update();
      }
    });

    updateAllCurves();
    updateCoordFields(dragging);
    updateDataSidebar();
  } else if (isDraggingCurve && activeCurve) {
    activeCurve.update();
  }

  if (activeCurve && activeCurve.handle) {
    activeCurve.handle.style.cursor = isDraggingCurve ? "grabbing" : "grab";
  }
});

document.addEventListener("mouseup", function (e) {
  if (dragging) {
    updateAllCurves();
    updateCoordFields(dragging);

    dragging = null;
    isDragging = false;
    window.clickedOnPoint = false;
    window.ignoreNextClick = false;

    spawnedCurves.forEach(c => {
      if (c.handle && !(isDraggingCurve && activeCurve === c)) {
        c.handle.style.opacity = "0";
      }
    });
  }
});

document.addEventListener("keydown", (e) => {
  // Check if the user is focused on an input field
  const isInputFocused = e.target.tagName === "INPUT" && 
                        (e.target.id === "coordX" || 
                         e.target.id === "coordY" || 
                         e.target.id === "drivebaseL" || 
                         e.target.id === "drivebaseW" || 
                         e.target.id === "robotSizeL" || 
                         e.target.id === "robotSizeW" ||
                         e.target.id === "fieldSizeL" ||
                         e.targer.id == "headingTheta" ||
                         e.target.id === "fieldSizeW");
  
  // Only delete selected point if NOT in an input field
  if ((e.key === "Backspace" || e.key === "Delete") && selectedPoint && !isInputFocused) {
    e.preventDefault();

    const deletedIndex = spawnedPoints.indexOf(selectedPoint);

    selectedPoint.remove();

    spawnedCurves.forEach((c) => {
      if (c.img1 === selectedPoint || c.img2 === selectedPoint) {
        if (c.circleGroup) c.circleGroup.remove();
        if (c.handleGroup) c.handleGroup.remove();
        if (c.handle) c.handle.remove();
      }
    });

    spawnedCurves = spawnedCurves.filter(
      (c) => c.img1 !== selectedPoint && c.img2 !== selectedPoint
    );
    spawnedPoints = spawnedPoints.filter((p) => p !== selectedPoint);

    isDragging = false;
    dragging = null;
    isDraggingCurve = false;
    activeCurve = null;
    window.ignoreNextClick = false;

    const prevPoint = spawnedPoints[deletedIndex - 1];
    const nextPoint = spawnedPoints[deletedIndex];
    if (prevPoint && nextPoint) {
      connectLastTwo(prevPoint, nextPoint);
    }

    spawnedPoints.forEach((p, i) => {
      p.src = imageSet[i % imageSet.length];
    });

    selectedPoint = null;
    updateSidebar();
  }
});

sidebar.addEventListener('dragstart', (e) => {
  // Only allow dragging if the user grabbed the queue icon
  const queueIcon = e.target.closest('.queue-icon');
  if (!queueIcon) {
    e.preventDefault();
    return;
  }

  const item = e.target.closest('.point-item');
  if (!item) {
    e.preventDefault();
    return;
  }
  
  e.dataTransfer.setData('text/plain', item.dataset.index);
  item.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
});

sidebar.addEventListener('dragend', (e) => {
  const dragging = sidebar.querySelector('.dragging');
  if (dragging) dragging.classList.remove('dragging');
});

sidebar.addEventListener('dragover', (e) => {
  e.preventDefault();
  const dragging = sidebar.querySelector('.dragging');
  if (!dragging || !dragging.classList.contains('point-item')) return;
  
  const afterElement = getDragAfterElement(sidebar, e.clientY);
  if (afterElement == null) {
    sidebar.appendChild(dragging);
  } else {
    sidebar.insertBefore(dragging, afterElement);
  }
});

sidebar.addEventListener('drop', (e) => {
  e.preventDefault();
  
  const newOrder = Array.from(sidebar.querySelectorAll('.point-item'))
    .map(item => parseInt(item.dataset.index, 10));

  const reorderedPoints = newOrder.map(i => spawnedPoints[i]);
  spawnedPoints = reorderedPoints.slice();
  spawnedImages = spawnedPoints.slice();

  // Remove all curves
  spawnedCurves.forEach(c => {
    if (c.circleGroup) c.circleGroup.remove();
    if (c.handleGroup) c.handleGroup.remove();
    if (c.handle) c.handle.remove(); // Legacy support
  });
  spawnedCurves = [];

  // Recreate curves in new order
  for (let i = 0; i < spawnedPoints.length - 1; i++) {
    createCurve(spawnedPoints[i], spawnedPoints[i + 1]);
  }

  // Update colors
  spawnedPoints.forEach((p, i) => {
    p.src = imageSet[i % imageSet.length];
  });

  updateSidebar();
  updateAllCurves();
});

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.point-item:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSidebar() {
  sidebar.innerHTML = "<h3>Points</h3>";

  spawnedPoints.forEach((p, idx) => {
    const pointItem = document.createElement("div");
    pointItem.classList.add("point-item", "sidebar-item");
    pointItem.draggable = true;
    pointItem.dataset.index = idx;

    if (p === selectedPoint) pointItem.classList.add("selected");

    pointItem.style.display = "flex";
    pointItem.style.alignItems = "center";
    pointItem.style.justifyContent = "space-between";
    pointItem.style.padding = "6px 8px";

    const left = document.createElement("div");
    left.style.display = "flex";
    left.style.alignItems = "center";
    left.style.gap = "6px";

    const colorDot = document.createElement("span");
    colorDot.classList.add("color-dot");
    colorDot.style.backgroundImage = `url(${p.src})`;

    const label = document.createElement("span");
    label.textContent = `Point ${idx + 1}`;
    left.appendChild(colorDot);
    left.appendChild(label);

    // Right side container for refresh and queue icons
    const rightContainer = document.createElement("div");
    rightContainer.style.display = "flex";
    rightContainer.style.alignItems = "center";
    rightContainer.style.gap = "8px";

    // Refresh icon (initially hidden)
    const refreshIcon = document.createElement("div");
    refreshIcon.classList.add("refresh-icon");
    refreshIcon.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
      </svg>
    `;
    refreshIcon.style.cursor = "pointer";
    refreshIcon.style.opacity = "0";
    refreshIcon.style.transition = "opacity 0.2s";
    refreshIcon.style.display = "flex";
    refreshIcon.style.alignItems = "center";
    refreshIcon.style.color = p.isAtZero ? "#2196f3" : "white";

    // Store original position if not already stored
    if (!pointOriginalPositions.has(p)) {
      const rect = p.getBoundingClientRect();
      pointOriginalPositions.set(p, {
        left: p.style.left,
        top: p.style.top
      });
    }

    refreshIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePointZero(p, idx);
    });

    // Show/hide refresh icon on hover
    pointItem.addEventListener("mouseenter", () => {
      refreshIcon.style.opacity = "1";
    });
    pointItem.addEventListener("mouseleave", () => {
      refreshIcon.style.opacity = "0";
    });

    const queueIcon = document.createElement("div");
    queueIcon.classList.add("queue-icon");
    queueIcon.style.display = "flex";
    queueIcon.style.flexDirection = "column";
    queueIcon.style.justifyContent = "center";
    queueIcon.style.gap = "3px";
    queueIcon.style.cursor = "grab";
    queueIcon.style.padding = "2px";
    queueIcon.draggable = true;

    for (let i = 0; i < 3; i++) {
      const bar = document.createElement("div");
      bar.style.width = "14px";
      bar.style.height = "2px";
      bar.style.background = "white";
      bar.style.pointerEvents = "none";
      queueIcon.appendChild(bar);
    }

    rightContainer.appendChild(refreshIcon);
    rightContainer.appendChild(queueIcon);

    pointItem.appendChild(left);
    pointItem.appendChild(rightContainer);

    pointItem.addEventListener("click", (e) => {
      e.stopPropagation();
      selectPoint(p);
      updateCoordFields(p);
    });

    sidebar.appendChild(pointItem);

    const nextPoint = spawnedPoints[idx + 1];
    if (!nextPoint) return;

    const line = spawnedCurves.find(
      (c) =>
        (c.img1 === p && c.img2 === nextPoint) ||
        (c.img2 === p && c.img1 === nextPoint)
    );

    if (line) {
      const lineItem = document.createElement("div");
      lineItem.classList.add("line-item");
      lineItem.dataset.curveId = line.id;

      const color = line.color || `hsl(200, 100%, 50%)`;

      const lineDot = document.createElement("span");
      lineDot.classList.add("line-dot");
      lineDot.style.background = color;

      const lineLabel = document.createElement("span");
      lineLabel.textContent = `Line ${idx + 1}`;

      lineItem.appendChild(lineDot);
      lineItem.appendChild(lineLabel);

      lineItem.addEventListener("click", (e) => {
        e.stopPropagation();
        selectLine(line);
      });

      sidebar.appendChild(lineItem);
    }
  });
  updateDataSidebar();
}

// New function to toggle point as reference (0,0) without moving it
function togglePointZero(point, currentIndex) {
  if (!point.isAtZero) {
    // Mark this point as (0,0) reference
    point.isAtZero = true;
    
    // If this is the first point, update the checkbox
    if (currentIndex === 0) {
      startAtZero = true;
      const checkbox = document.getElementById("startAtZeroCheckbox");
      if (checkbox) checkbox.checked = true;
    }

  } else {
    // Remove (0,0) reference
    point.isAtZero = false;
    
    // If this is the first point, update the checkbox
    if (currentIndex === 0) {
      startAtZero = false;
      const checkbox = document.getElementById("startAtZeroCheckbox");
      if (checkbox) checkbox.checked = false;
    }
  }

  // Update coordinate displays for all points
  recomputeAllPositions();
  if (selectedPoint) {
    updateCoordFields(selectedPoint);
  }
  updateSidebar();
}

function resetLineStyles() {
  spawnedCurves.forEach(c => {
    c.isSelected = false;
    if (c.circleGroup) {
      c.circleGroup.style.filter = "";
    }
    if (c.handleGroup) {
      const handles = c.handleGroup.querySelectorAll("circle");
      handles.forEach(h => {
        h.style.opacity = "0";
        h.style.display = "block";
      });
    }
    // Legacy support
    if (c.handle) {
      c.handle.style.opacity = "0";
      c.handle.style.display = "block";
    }
  });
}

function selectLine(line) {
  resetLineStyles();

  if (selectedPoint) {
    selectedPoint.style.outline = "";
    selectedPoint = null;
  }

  updateSidebar();

  if (line) {
    if (line.circleGroup) {
      line.circleGroup.style.filter = "drop-shadow(0 0 4px rgba(255,255,255,0.8))";
    }
    if (line.handleGroup) {
      const handles = line.handleGroup.querySelectorAll("circle");
      handles.forEach(h => {
        h.style.display = "block";
        h.style.opacity = 1;
      });
    }
    line.isSelected = true;
  }
}

function selectPoint(point) {
  resetLineStyles();
  selectedPoint = point;
  updateSidebar();

  spawnedPoints.forEach(p => (p.style.outline = ""));
  if (point) {
    point.style.outline = "2px solid white";
    point.style.outlineOffset = "1px";
  }

  window.ignoreNextClick = false;
}

function updateSidebarLineColor(curveObj, color) {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar || !curveObj.id) return;

  const lineItem = sidebar.querySelector(`.line-item[data-curve-id="${curveObj.id}"]`);
  if (!lineItem) return;

  const lineDot = lineItem.querySelector(".line-dot");
  if (lineDot) lineDot.style.background = color;
}

function updateLayout() {
  rwidth = window.innerWidth;
  rheight = window.innerHeight;

  iwidth = Math.min(rwidth / 3.03, rheight / 2.4);
  ilength = iwidth;

  foot = iwidth / 12;
  finch = foot / 12;
  inch = iwidth / 140.4;
  pwidth = iwidth / 20;

  inwidth = (rwidth / 2) - (iwidth / 2);
  outwidth = (rwidth / 2) + (iwidth / 2);
  inHeight = (rheight / 2) - (iwidth / 2);
  outHeight = (rheight / 2) + (iwidth / 2);

  const centerX = rwidth / 2;
  const centerY = rheight / 2;

  myImage.style.position = "absolute";
  myImage.style.transition = "all 0.3s ease";
  myImage.style.left = inwidth + "px";
  myImage.style.top = inHeight + "px";
  myImage.style.width = iwidth + "px";
  myImage.style.height = iwidth + "px";

  spawnedImages.forEach((img) => {
    img.style.transition = "all 0.3s ease";

    const newCenterX = centerX + img.relX * iwidth;
    const newCenterY = centerY + img.relY * iwidth;

    img.style.width = pwidth + "px";
    img.style.height = pwidth + "px";
    img.style.left = (newCenterX - pwidth / 2) + "px";
    img.style.top = (newCenterY - pwidth / 2) + "px";
  });

  setTimeout(updateAllCurves, 300);
}

window.addEventListener("resize", () => {
  updateLayout();

  clearTimeout(window.curveTimeout);
  window.curveTimeout = setTimeout(() => {
    updateAllCurves();
  }, 300);
});

// Add this code at the end of your new.js file

// Create right sidebar buttons (Settings sidebar)
function createRightSidebarButtons() {
  const rightButtonsContainer = document.createElement('div');
  rightButtonsContainer.className = 'sidebar-buttons right';
  
  // Upload icon
  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'sidebar-button';
  uploadBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  `;
  
  // Download icon
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'sidebar-button';
  downloadBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `;
  
  // Delete/Trash icon
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'sidebar-button';
  deleteBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  `;
  
  // Question icon
  const questionBtn = document.createElement('button');
  questionBtn.className = 'sidebar-button';
  questionBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  `;
  
  rightButtonsContainer.appendChild(uploadBtn);
  rightButtonsContainer.appendChild(downloadBtn);
  rightButtonsContainer.appendChild(deleteBtn);
  rightButtonsContainer.appendChild(questionBtn);
  
  document.body.appendChild(rightButtonsContainer);
}

// Create left sidebar buttons (Points sidebar)
function createLeftSidebarButtons() {
  const leftButtonsContainer = document.createElement('div');
  leftButtonsContainer.className = 'sidebar-buttons left';
  
  // Button 1: Flip selected point across Y axis
  const horizontalBtn = document.createElement('button');
  horizontalBtn.className = 'sidebar-button';
  horizontalBtn.innerHTML = `
    <svg viewBox="0 0 24 24" class="point-icon">
      <line x1="12" y1="2" x2="12" y2="24" stroke="white" stroke-width="2"></line>
      <circle cx="5" cy="13" r="2.8" fill="white"></circle>
      <circle cx="19" cy="13" r="2.8" fill="white"></circle>
    </svg>
  `;
  horizontalBtn.addEventListener('click', () => flipSelectedPointAcrossYAxis());
  
  // Button 2: Flip selected point across X axis
  const verticalBtn = document.createElement('button');
  verticalBtn.className = 'sidebar-button';
  verticalBtn.innerHTML = `
    <svg viewBox="0 0 24 24" class="point-icon">
      <line x1="2" y1="12" x2="24" y2="12" stroke="white" stroke-width="2"></line>
      <circle cx="13" cy="5" r="2.8" fill="white"></circle>
      <circle cx="13" cy="19" r="2.8" fill="white"></circle>
    </svg>
  `;
  verticalBtn.addEventListener('click', () => flipSelectedPointAcrossXAxis());
  
  // Button 3: Flip all points across Y axis
  const threeHorizontalBtn = document.createElement('button');
  threeHorizontalBtn.className = 'sidebar-button';
  threeHorizontalBtn.innerHTML = `
    <svg viewBox="0 0 24 24" class="point-icon">
      <line x1="12" y1="2" x2="12" y2="25" stroke="white" stroke-width="2"></line>
      <circle cx="4" cy="5" r="1.8" fill="white"></circle>
      <circle cx="4" cy="13" r="1.8" fill="white"></circle>
      <circle cx="4" cy="21" r="1.8" fill="white"></circle>
      <circle cx="20" cy="5" r="1.8" fill="white"></circle>
      <circle cx="20" cy="13" r="1.8" fill="white"></circle>
      <circle cx="20" cy="21" r="1.8" fill="white"></circle>
    </svg>
  `;
  threeHorizontalBtn.addEventListener('click', () => flipAllPointsAcrossYAxis());
  
  // Button 4: Flip all points across X axis
  const threeVerticalBtn = document.createElement('button');
  threeVerticalBtn.className = 'sidebar-button';
  threeVerticalBtn.innerHTML = `
    <svg viewBox="0 0 24 24" class="point-icon">
      <line x1="1" y1="12" x2="24" y2="12" stroke="white" stroke-width="2"></line>
      <circle cx="4" cy="4" r="1.8" fill="white"></circle>
      <circle cx="12" cy="4" r="1.8" fill="white"></circle>
      <circle cx="20" cy="4" r="1.8" fill="white"></circle>
      <circle cx="4" cy="20" r="1.8" fill="white"></circle>
      <circle cx="12" cy="20" r="1.8" fill="white"></circle>
      <circle cx="20" cy="20" r="1.8" fill="white"></circle>
    </svg>
  `;
  threeVerticalBtn.addEventListener('click', () => flipAllPointsAcrossXAxis());
  
  leftButtonsContainer.appendChild(horizontalBtn);
  leftButtonsContainer.appendChild(verticalBtn);
  leftButtonsContainer.appendChild(threeHorizontalBtn);
  leftButtonsContainer.appendChild(threeVerticalBtn);
  
  document.body.appendChild(leftButtonsContainer);
}

// Create top-left collapse button
function createCollapseButton() {
  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'collapse-button';
  collapseBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  
  collapseBtn.addEventListener('click', toggleDataSidebar);
  
  document.body.appendChild(collapseBtn);
}

let dataSidebarOpen = false;

function toggleDataSidebar() {
  dataSidebarOpen = !dataSidebarOpen;
  const dataSidebar = document.getElementById('dataSidebar');
  const collapseBtn = document.querySelector('.collapse-button');
  const leftButtons = document.querySelector('.sidebar-buttons.left');
  
  if (dataSidebarOpen) {
    // Open the data sidebar
    if (!dataSidebar) {
      createDataSidebar();
    } else {
      dataSidebar.style.display = 'block';
    }
    
    // Move buttons to the right
    // 180px (main sidebar) + 180px (data sidebar) = 360px
    leftButtons.style.left = '435px';
    collapseBtn.style.left = '435px';
    
    // Change arrow to point left
    collapseBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    `;
    
    updateDataSidebar();
  } else {
    // Close the data sidebar
    if (dataSidebar) {
      dataSidebar.style.display = 'none';
    }
    
    // Move buttons back
    // Back to just past the main sidebar: 180px
    leftButtons.style.left = '206px';
    collapseBtn.style.left = '206px';
    
    // Change arrow to point right
    collapseBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
  }
}

function createDataSidebar() {
  const dataSidebar = document.createElement('div');
  dataSidebar.id = 'dataSidebar';
  dataSidebar.className = 'data-sidebar';
  dataSidebar.innerHTML = '<h3>Data</h3>';
  document.body.appendChild(dataSidebar);
  updateDataSidebar();
}

function updateDataSidebar() {
  const dataSidebar = document.getElementById('dataSidebar');
  if (!dataSidebar || dataSidebar.style.display === 'none') return;
  
  dataSidebar.innerHTML = '<h3>Data</h3>';
  
  spawnedPoints.forEach((p, idx) => {
    // Add point coordinates - NO LABEL, just coords
    const pointData = document.createElement('div');
    pointData.className = 'data-item point-data';
    
    const rect = p.getBoundingClientRect();
    const pointCenterX = rect.left + rect.width / 2;
    const pointCenterY = rect.top + rect.height / 2;
    
    let xIn, yIn;
    
    if (p.isAtZero) {
      xIn = 0;
      yIn = 0;
    } else {
      let referencePoint = null;
      for (let j = idx - 1; j >= 0; j--) {
        if (spawnedPoints[j].isAtZero) {
          referencePoint = spawnedPoints[j];
          break;
        }
      }
      
      if (referencePoint) {
        const refRect = referencePoint.getBoundingClientRect();
        const baseX = refRect.left + refRect.width / 2;
        const baseY = refRect.top + refRect.height / 2;
        xIn = (pointCenterX - baseX) / inch;
        yIn = (pointCenterY - baseY) / inch;
      } else {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        xIn = (pointCenterX - screenCenterX) / inch;
        yIn = (pointCenterY - screenCenterY) / inch;
      }
    }
    
    yIn *= -1;
    
    // Convert to current unit
    const conversion = unitConversions[currentUnit];
    const unitLabel = unitLabels[currentUnit];
    
    // No label - just coordinates
    // Calculate heading for display
let heading;
if (pointHeadings.has(p)) {
  heading = pointHeadings.get(p);
} else {
  heading = calculateNaturalHeading(p);
}

// No label - just coordinates with heading in green
pointData.innerHTML = `
  <span class="coord-display">
    <span class="x-coord">X: ${(xIn * conversion).toFixed(2)}</span>, 
    <span class="y-coord">Y: ${(yIn * conversion).toFixed(2)}</span>
    <span style="color: #4CAF50;"> (${Math.round(heading)}°)</span>
  </span>
`;
    
    dataSidebar.appendChild(pointData);
    
    // Add line data if there's a next point - NO LABEL
    const nextPoint = spawnedPoints[idx + 1];
    if (nextPoint) {
      const lineData = document.createElement('div');
      lineData.className = 'data-item line-data';
      
      const nextRect = nextPoint.getBoundingClientRect();
      const nextCenterX = nextRect.left + nextRect.width / 2;
      const nextCenterY = nextRect.top + nextRect.height / 2;
      
      // Calculate distances in pixels
      const dxPx = nextCenterX - pointCenterX;
      const dyPx = nextCenterY - pointCenterY;
      
      // Convert to inches
      // Convert to inches
      const dxIn = Math.abs(dxPx / inch);
      const dyIn = Math.abs(dyPx / inch);
      const totalLength = Math.sqrt(dxIn * dxIn + dyIn * dyIn);
      
      // Convert to current unit
      const conversion = unitConversions[currentUnit];
      const unitLabel = unitLabels[currentUnit];
      const dxConverted = dxIn * conversion;
      const dyConverted = dyIn * conversion;
      const totalConverted = totalLength * conversion;
      
      // No label - just length data
      lineData.innerHTML = `
        <span class="length-display">
          ${totalConverted.toFixed(2)}
          (<span class="x-coord">${dxConverted.toFixed(2)}</span>, 
          <span class="y-coord">${dyConverted.toFixed(2)}</span>)
        </span>
      `;
      
      dataSidebar.appendChild(lineData);
    }
  });
}

// Flip functions
function flipSelectedPointAcrossYAxis() {
  if (!selectedPoint) {
    console.log('No point selected');
    return;
  }
  
  const rect = selectedPoint.getBoundingClientRect();
  const pointCenterX = rect.left + rect.width / 2;
  
  // Always use screen center as reference
  const referenceX = window.innerWidth / 2;
  
  // Calculate new X position (flip across Y axis means mirror X coordinate)
  const distanceFromReference = pointCenterX - referenceX;
  const newX = referenceX - distanceFromReference;
  
  selectedPoint.style.left = `${newX - selectedPoint.offsetWidth / 2}px`;
  
  updateAllCurves();
  updateCoordFields(selectedPoint);
  updateDataSidebar();
}

function flipSelectedPointAcrossXAxis() {
  if (!selectedPoint) {
    console.log('No point selected');
    return;
  }
  
  const rect = selectedPoint.getBoundingClientRect();
  const pointCenterY = rect.top + rect.height / 2;
  
  // Always use screen center as reference
  const referenceY = window.innerHeight / 2;
  
  // Calculate new Y position (flip across X axis means mirror Y coordinate)
  const distanceFromReference = pointCenterY - referenceY;
  const newY = referenceY - distanceFromReference;
  
  selectedPoint.style.top = `${newY - selectedPoint.offsetHeight / 2}px`;
  
  updateAllCurves();
  updateCoordFields(selectedPoint);
  updateDataSidebar();
}

function flipAllPointsAcrossYAxis() {
  if (spawnedPoints.length === 0) {
    console.log('No points to flip');
    return;
  }
  
  // Always use screen center as reference
  const referenceX = window.innerWidth / 2;
  
  spawnedPoints.forEach(point => {
    const rect = point.getBoundingClientRect();
    const pointCenterX = rect.left + rect.width / 2;
    
    // Flip across Y axis
    const distanceFromReference = pointCenterX - referenceX;
    const newX = referenceX - distanceFromReference;
    
    point.style.left = `${newX - point.offsetWidth / 2}px`;
  });
  
  // Recalculate all positions to maintain correct coordinate readings
  recomputeAllPositions();
  
  updateAllCurves();
  if (selectedPoint) {
    updateCoordFields(selectedPoint);
  }
  updateDataSidebar();
}

function flipAllPointsAcrossXAxis() {
  if (spawnedPoints.length === 0) {
    console.log('No points to flip');
    return;
  }
  
  // Always use screen center as reference
  const referenceY = window.innerHeight / 2;
  
  spawnedPoints.forEach(point => {
    const rect = point.getBoundingClientRect();
    const pointCenterY = rect.top + rect.height / 2;
    
    // Flip across X axis
    const distanceFromReference = pointCenterY - referenceY;
    const newY = referenceY - distanceFromReference;
    
    point.style.top = `${newY - point.offsetHeight / 2}px`;
  });
  
  // Recalculate all positions to maintain correct coordinate readings
  recomputeAllPositions();
  
  updateAllCurves();
  if (selectedPoint) {
    updateCoordFields(selectedPoint);
  }
  updateDataSidebar();
}

// Initialize all buttons when page loads
window.addEventListener('load', () => {
  createRightSidebarButtons();
  createLeftSidebarButtons();
  createCollapseButton();
  createDataSidebar(); // Create data sidebar on load (but keep it hidden)
});

const iconPositions1a = [
  { x: -0.1, y: -0.16 },
  { x: 0.1, y: -0.16 },
  { x: -0.1, y: 0.16 },
  { x: 0.1, y: 0.16 }, 
  { x: 0, y: -0.27 },
  { x: 0, y: 0.27 }
];

const iconPositions1b = [
  { x: -0.52, y: -0.345 },
  { x: 0.52, y: -0.345 },
  { x: -0.52, y: 0.345 },
  { x: 0.52, y: 0.345 }
];

const iconPositions1c = [
  { x: 0.42, y: 0.005},
  { x: -0.42, y: 0.005}
];

const iconPositions2a = [
  { x: -0.12, y: 0.38 },
  { x: 0.12, y: -0.337 },
  { x: -.05, y: -0.05 },
  { x: -0.05, y: 0.05 }
];

const iconPositions2b = [
  { x: 0.12, y: 0.38 },
  { x: -0.12, y: -0.337 },
  { x: .05, y: -0.05 },
  { x: 0.05, y: 0.05 }
];

const iconsGroup1a = [];
const iconsGroup1b = [];
const iconsGroup1c = [];
const iconsGroup2 = [];
const ballPositionUsage = [0, 0, 0, 0]; 

let group2Visible = false;
let activePrimaryGroup = null; 
const iconNormalSrc = "before2.png";
const iconAltSrc = "after.png";
const iconSizeRatio = 1/27;

const icon2aSrc = "bluebg.png";
const icon2bSrc = "orangebg.png";

const iconsGroup2a = [];
const iconsGroup2b = [];

const ball1Src = "bluebg.png";
const ball2Src = "orangebg.png";
const balls = [];

const ballLimits = {
  "1a": { "2a": { ball1: 2, ball2: 2 }, "2b": { ball1: 2, ball2: 2 } },
  "1b": { "2a": { ball1: 3, ball2: 3 }, "2b": { ball1: 3, ball2: 3 } },
  "1c": { "2a": { ball1: 6, ball2: 0 }, "2b": { ball1: 0, ball2: 6 } },
};

const ballCounts = {
  "1a": {},
  "1b": {},
  "1c": {}
};

function createIcons() {
  // Group 1a
  iconPositions1a.forEach((pos, i) => {
    const icon = document.createElement("img");
    icon.src = iconNormalSrc;
    icon.className = "icon";
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.dataset.group = "1a";
    icon.dataset.index = i;
    document.body.appendChild(icon);
    iconsGroup1a.push({ el: icon, relX: pos.x, relY: pos.y });
    icon.addEventListener("click", onIconClick);
  });

  // Group 1b
  iconPositions1b.forEach((pos, i) => {
    const icon = document.createElement("img");
    icon.src = iconNormalSrc;
    icon.className = "icon";
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.dataset.group = "1b";
    icon.dataset.index = i;
    document.body.appendChild(icon);
    iconsGroup1b.push({ el: icon, relX: pos.x, relY: pos.y });
    icon.addEventListener("click", onIconClick);
  });

  // Group 1c
  iconPositions1c.forEach((pos, i) => {
    const icon = document.createElement("img");
    icon.src = iconNormalSrc;
    icon.className = "icon";
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.dataset.group = "1c";
    icon.dataset.index = i;
    document.body.appendChild(icon);
    iconsGroup1c.push({ el: icon, relX: pos.x, relY: pos.y });
    icon.addEventListener("click", onIconClick);
  });

  // Group 2a (blue icons) - hidden initially
  iconPositions2a.forEach((pos, i) => {
    const icon = document.createElement("img");
    icon.src = icon2aSrc || iconAltSrc;
    icon.className = "icon";
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.style.opacity = "0";
    icon.style.pointerEvents = "none";
    icon.dataset.group = "2a";
    icon.dataset.index = i;
    document.body.appendChild(icon);
    iconsGroup2a.push({ el: icon, relX: pos.x, relY: pos.y });
    icon.addEventListener("click", onIconClick);
  });

  // Group 2b (orange icons) - hidden initially
  iconPositions2b.forEach((pos, i) => {
    const icon = document.createElement("img");
    icon.src = icon2bSrc || iconAltSrc;
    icon.className = "icon";
    icon.style.position = "absolute";
    icon.style.cursor = "pointer";
    icon.style.opacity = "0";
    icon.style.pointerEvents = "none";
    icon.dataset.group = "2b";
    icon.dataset.index = i;
    document.body.appendChild(icon);
    iconsGroup2b.push({ el: icon, relX: pos.x, relY: pos.y });
    icon.addEventListener("click", onIconClick);
  });

  updateIconPositions();
}

function updateIconPositions() {
  const centerX = rwidth / 2;
  const centerY = rheight / 2;
  const iconSize = iwidth * iconSizeRatio;

  // position icons
  [
    ...iconsGroup1a,
    ...iconsGroup1b,
    ...iconsGroup1c,
    ...iconsGroup2a,
    ...iconsGroup2b
  ].forEach(iconObj => {
    const { el, relX, relY } = iconObj;
    const newX = centerX + relX * iwidth;
    const newY = centerY + relY * iwidth;
    el.style.width = iconSize + "px";
    el.style.height = iconSize + "px";
    el.style.left = (newX - iconSize / 2) + "px";
    el.style.top = (newY - iconSize / 2) + "px";
    el.style.transition = "opacity 0.25s ease, left 0.25s ease, top 0.25s ease";
  });

  // position balls (they store relX/relY so they track with field)
  balls.forEach(ballObj => {
    const { el, relX, relY } = ballObj;
    const newX = centerX + relX * iwidth;
    const newY = centerY + relY * iwidth;
    const ballSize = iconSize * 0.8;
    el.style.width = ballSize + "px";
    el.style.height = ballSize + "px";
    el.style.left = (newX - ballSize / 2) + "px";
    el.style.top = (newY - ballSize / 2) + "px";
    el.style.transition = "left 0.25s ease, top 0.25s ease";
  });
}

function showGroup2() {
  group2Visible = true;
  [...iconsGroup2a, ...iconsGroup2b].forEach(obj => {
    obj.el.style.opacity = "1";
    obj.el.style.pointerEvents = "auto";
  });
}

function hideGroup2() {
  group2Visible = false;
  activePrimaryGroup = null;
  [...iconsGroup2a, ...iconsGroup2b].forEach(obj => {
    obj.el.style.opacity = "0";
    obj.el.style.pointerEvents = "none";
  });
}

const ballPositions1 = [
  {x : -.17, y : .335},
  {x : -.145, y : .335},
  {x : -.12, y : .335},
  {x : -.095, y : .335},
  {x : -.07, y : .335},
  {x : -.045, y : .335},
  {x : -.02, y : .335},
  {x : .005, y : .335},
  {x : .03, y : .335},
  {x : .055, y : .335},
  {x : .08, y : .335},
  {x : .105, y : .335},
  {x : .13, y : .335},
  {x : .155, y : .335},
];
const ballPositions2 = [];
const ballPositions3 = [];
const ballPositions4 = [];

const ballPositionSets = [ballPositions1, ballPositions2, ballPositions3, ballPositions4];
const ballSpawnCounters = [0, 0, 0, 0];

function onIconClick(e) {
  e.stopPropagation();
  const group = e.target.dataset.group;
  const index = parseInt(e.target.dataset.index, 10);

  if (group === "1a" || group === "1b" || group === "1c") {
    activePrimaryGroup = group;
    activePrimaryIndex = index;
    showGroup2();
    return;
  }

  if ((group === "2a" || group === "2b") && group2Visible && activePrimaryGroup !== null) {
    const color = group === "2a" ? "blue" : "orange";
    const limits = (ballLimits[activePrimaryGroup] || {})[group];
    const key = color === "blue" ? "ball1" : "ball2";
    const limit = limits?.[key] ?? 0;

    ballCounts[activePrimaryGroup][activePrimaryIndex] ??= { blue: 0, orange: 0 };

    const current = ballCounts[activePrimaryGroup][activePrimaryIndex][color];
    if (current >= limit) {
      console.log(`Limit reached for ${activePrimaryGroup} icon ${activePrimaryIndex} (${color})`);
      hideGroup2();
      return;
    }

    const posArray = ballPositionSets[index];
    if (!posArray || posArray.length === 0) {
      console.warn("No position array for Group 2 index", index);
      hideGroup2();
      return;
    }

    const usageIndex = ballPositionUsage[index];
    if (usageIndex >= posArray.length) {
      console.warn(`No more valid positions left in ballPositions${index + 1}`);
      hideGroup2();
      return;
    }

    const pos = posArray[usageIndex];
    ballPositionUsage[index]++;
    
    if (!pos) {
      console.warn("Position undefined for", group, index, current);
      hideGroup2();
      return;
    }

    addBallAtPosition(pos, color, activePrimaryGroup, group, index);
    ballCounts[activePrimaryGroup][activePrimaryIndex][color]++;
    hideGroup2();
  }
}

function addBallAtPosition(pos, color, primaryGroup, group2, group2Index) {
  const ballEl = document.createElement("img");
  ballEl.src = color === "blue" ? ball1Src : ball2Src;
  ballEl.className = "ball";
  ballEl.style.position = "absolute";
  ballEl.style.pointerEvents = "none";
  ballEl.style.opacity = "0.95";
  document.body.appendChild(ballEl);

  balls.push({
    el: ballEl,
    relX: pos.x,
    relY: pos.y,
    type: color === "blue" ? "ball1" : "ball2",
    primaryGroup,
    group2,
    group2Index
  });

  updateIconPositions();
}

document.addEventListener("click", function (e) {
  if (group2Visible && !e.target.classList.contains("icon")) {
    hideGroup2();
  }
});

window.addEventListener("resize", updateIconPositions);
window.addEventListener("load", createIcons);

document.addEventListener("keydown", e => {
  const target = e.target;
  if ((target.id === "coordX" || target.id === "coordY") && 
      (e.key === "Backspace" || e.key === "Delete")) {
    e.stopPropagation();
  }
});
//   input.addEventListener("keydown", e => {
//     if ((e.key === "Backspace" || e.key === "Delete")) {
//       e.stopPropagation();
//     }
//   });
// });