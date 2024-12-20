// HTML structure for the calculator
document.body.innerHTML = `
  <style>
  html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(270deg, #A5DEFF 0%, #FCFEFF 100%);
    }
    #container {
      display: flex;
      align-items: flex-start;
      justify-content: center;
      gap: 20px;
      font-family: Arial, sans-serif;
    }

    #calculator-container {
    margin-left: 400px;
      margin-top: 50px;
      flex: 1;
      max-width: 400px;
    }

    h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }

    label {
      display: block;
      margin: 10px 0 5px;
      font-weight: bold;
    }

    input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    button {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      background-color: #007BFF;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
    }

    button:hover {
      background-color: #0056b3;
    }

    #matrixContainer {
      margin-top: 20px;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 20px;
    }

    td {
      padding: 5px;
    }

    .matrixInput {
      width: 100%;
      padding: 5px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 14px;
    }

    #results {
      margin-top: 20px;
      font-size: 16px;
      color: #333;
    }

    #graph-container {
    margin-top: 50px;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    canvas {
      width: 100%;
      max-width: 600px;
      
    }
  </style>

  <div id="container">
    <div id="calculator-container">
      <h1>Minimax Criterion Calculator</h1>

      <label for='strategies'>Number of Strategies:</label>
      <input id='strategies' type='number' min='1' value='2'>



      <button id='generateMatrix'>Generate Matrix</button>

      <div id="matrixContainer"></div>

      <button id='calculate' style='display:none;'>Calculate</button>
      <div id='results'></div>
    </div>
    
    <div id="graph-container">
      <canvas id='resultChart' width='600' height='400' style='display:none;'></canvas>
    </div>
  </div>
`;


// Event listeners
const generateMatrixButton = document.getElementById('generateMatrix');
generateMatrixButton.addEventListener('click', generateMatrix);

const calculateButton = document.getElementById('calculate');
calculateButton.addEventListener('click', () => {
    calculate();
    calculateMinimaxCriterion();
});

// Function to generate the input matrix
function generateMatrix() {
    const strategies = parseInt(document.getElementById('strategies').value);
    const states = 2;
    const matrixContainer = document.getElementById('matrixContainer');
    matrixContainer.innerHTML = '';

    const table = document.createElement('table');
    for (let i = 0; i < strategies; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < states; j++) {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrixInput';
            input.placeholder = `S${j + 1}`;
            input.dataset.strategy = i;
            input.dataset.state = j;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixContainer.appendChild(table);

    calculateButton.style.display = 'block';
}

// Function to calculate the minimax criterion and plot the graph
function calculate() {
    const matrixInputs = document.querySelectorAll('.matrixInput');
    const strategies = parseInt(document.getElementById('strategies').value);
    const states = 2;

    // Build the matrix from inputs
    const matrix = [];
    let index = 0;
    for (let i = 0; i < strategies; i++) {
        const row = [];
        for (let j = 0; j < states; j++) {
            row.push(parseFloat(matrixInputs[index].value));
            index++;
        }
        matrix.push(row);
    }

    // Extract coordinates for alpha points
    const points = matrix.map((row, i) => ({ x: row[0], y: row[1], label: `a${i + 1}` }));

    // Find extreme points (min/max x and y)
    const minXPoint = points.reduce((min, p) => (p.x < min.x ? p : min), points[0]);
    const maxXPoint = points.reduce((max, p) => (p.x > max.x ? p : max), points[0]);
    const minYPoint = points.reduce((min, p) => (p.y < min.y ? p : min), points[0]);
    const maxYPoint = points.reduce((max, p) => (p.y > max.y ? p : max), points[0]);

    // Select points for the boundary
    const boundaryPoints = [minXPoint, maxXPoint, maxYPoint, minYPoint];

    // Remove duplicates and sort for connecting
    const uniqueBoundaryPoints = Array.from(new Set(boundaryPoints));

    // Draw the graph
    const canvas = document.getElementById('resultChart');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(50, 350);
    ctx.lineTo(550, 350); // X-axis
    ctx.moveTo(50, 350);
    ctx.lineTo(50, 50); // Y-axis
    ctx.stroke();

    // Draw points and lines connecting extreme points
    ctx.beginPath();
    const startPoint = uniqueBoundaryPoints[0];
    ctx.moveTo(50 + startPoint.x * 50, 350 - startPoint.y * 50);
    uniqueBoundaryPoints.forEach((point) => {
        const x = 50 + point.x * 50;
        const y = 350 - point.y * 50;
        ctx.lineTo(x, y);
        ctx.fillText(point.label, x + 5, y - 5);
        ctx.arc(x, y, 3, 0, Math.PI * 2);
    });
    ctx.closePath();
    ctx.strokeStyle = 'green';
    ctx.stroke();

    // Draw bisector
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.moveTo(50, 350);
    let intersectionX = 0;
    let intersectionY = 0;
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if ((p1.x - p1.y) * (p2.x - p2.y) <= 0) {
            // Calculate intersection
            const t = (p1.y - p1.x) / ((p1.y - p1.x) - (p2.y - p2.x));
            intersectionX = p1.x + t * (p2.x - p1.x);
            intersectionY = p1.y + t * (p2.y - p1.y);
            break;
        }
    }
    const bx = 50 + intersectionX * 50;
    const by = 350 - intersectionY * 50;
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Draw perpendicular lines
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, 350); // Perpendicular to X-axis
    ctx.moveTo(bx, by);
    ctx.lineTo(50, by); // Perpendicular to Y-axis
    ctx.stroke();
}

// Function to calculate minimax criterion
function calculateMinimaxCriterion() {
    const strategies = parseInt(document.getElementById("strategies").value);
    const states = 2;
    const lossMatrix = [];

    for (let i = 0; i < strategies; i++) {
        const row = [];
        for (let j = 0; j < states; j++) {
            const input = document.querySelector(`input[data-strategy='${i}'][data-state='${j}']`);
            row.push(parseFloat(input.value));
        }
        lossMatrix.push(row);
    }

    // Step 1: Calculate maximum losses for each strategy
    const maxLosses = lossMatrix.map(row => Math.max(...row));

    // Step 2: Find strategies with minimum max losses
    const minMaxLoss = Math.min(...maxLosses);
    const optimalStrategies = maxLosses
        .map((loss, index) => (loss === minMaxLoss ? index : -1))
        .filter(index => index !== -1);

    const results = document.getElementById("results");
    results.innerHTML = `<h2>Results</h2>`;
    results.innerHTML += `<p>Max losses per strategy: ${maxLosses.join(", ")}</p>`;
    results.innerHTML += `<p>Minimum of max losses: ${minMaxLoss}</p>`;

    if (optimalStrategies.length === 1) {
        results.innerHTML += `<p>Optimal strategy: S${optimalStrategies[0] + 1}</p>`;
        return;
    }

    // Step 3: Randomization for multiple optimal strategies
    results.innerHTML += `<p>Optimal strategies: ${optimalStrategies.map(i => `S${i + 1}`).join(", ")}</p>`;

    const [s1, s2] = optimalStrategies;

    // Step 4: Build equations for expected losses
    const equations = [];
    for (let j = 0; j < states; j++) {
        const equation = {
            coefficient: lossMatrix[s1][j] - lossMatrix[s2][j],
            constant: lossMatrix[s2][j]
        };
        equations.push(equation);
    }

    // Step 5: Solve for p
    const p = (equations[1].constant - equations[0].constant) /
        (equations[0].coefficient - equations[1].coefficient);
    const p1 = Math.max(0, Math.min(1, p));
    const p2 = 1 - p1;

    results.innerHTML += `<p>Randomization probabilities:</p>`;
    results.innerHTML += `<p>Strategy S${s1 + 1}: ${p1.toFixed(2)}</p>`;
    results.innerHTML += `<p>Strategy S${s2 + 1}: ${p2.toFixed(2)}</p>`;
}

