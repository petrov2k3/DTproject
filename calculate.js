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
  const states = 2; // Number of states is always 2

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

  // Extract coordinates for points
  const points = matrix.map((row, i) => ({ x: row[0], y: row[1], label: `a${i + 1}` }));

  // Function to find orientation of three points
  function orientation(p, q, r) {
    const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    if (val === 0) return 0; // Collinear
    return val > 0 ? 1 : -1; // Clockwise or counterclockwise
  }

  // Convex hull using Graham's scan
  function convexHull(points) {
    points.sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

    const lower = [];
    for (const point of points) {
      while (lower.length >= 2 && orientation(lower[lower.length - 2], lower[lower.length - 1], point) !== -1) {
        lower.pop();
      }
      lower.push(point);
    }

    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
      const point = points[i];
      while (upper.length >= 2 && orientation(upper[upper.length - 2], upper[upper.length - 1], point) !== -1) {
        upper.pop();
      }
      upper.push(point);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
  }

  // Find intersection of two lines
  function findIntersection(p1, p2, p3, p4) {
    const A1 = p2.y - p1.y;
    const B1 = p1.x - p2.x;
    const C1 = A1 * p1.x + B1 * p1.y;

    const A2 = p4.y - p3.y;
    const B2 = p3.x - p4.x;
    const C2 = A2 * p3.x + B2 * p3.y;

    const determinant = A1 * B2 - A2 * B1;

    if (determinant === 0) {
      return null; // Lines are parallel
    }

    const x = (B2 * C1 - B1 * C2) / determinant;
    const y = (A1 * C2 - A2 * C1) / determinant;

    return { x, y };
  }

  // Get convex hull points
  const hullPoints = convexHull(points);

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

  // Draw convex hull
  ctx.beginPath();
  const startPoint = hullPoints[0];
  ctx.moveTo(50 + startPoint.x * 50, 350 - startPoint.y * 50);
  hullPoints.forEach((point) => {
    const x = 50 + point.x * 50;
    const y = 350 - point.y * 50;
    ctx.lineTo(x, y);
    ctx.fillText(point.label, x + 5, y - 5);
    ctx.arc(x, y, 3, 0, Math.PI * 2);
  });
  ctx.closePath();
  ctx.strokeStyle = 'green';
  ctx.stroke();

  // Connect the last point to the first point
  const endPoint = hullPoints[hullPoints.length - 1];
  ctx.lineTo(50 + startPoint.x * 50, 350 - startPoint.y * 50);
  ctx.stroke();

  // Define the bisection line from the origin
  const bisectionLine = { p1: { x: 0, y: 0 }, p2: { x: 1, y: 1 } };

  // Find intersection of bisection line with hull edges
  let intersectionPoint = null;
  for (let i = 0; i < hullPoints.length; i++) {
    const p1 = hullPoints[i];
    const p2 = hullPoints[(i + 1) % hullPoints.length];
    const edge = { p1, p2 };

    const intersection = findIntersection(
      bisectionLine.p1,
      bisectionLine.p2,
      edge.p1,
      edge.p2
    );

    // Check if the intersection point lies on the edge segment
    if (
      intersection &&
      intersection.x >= Math.min(edge.p1.x, edge.p2.x) &&
      intersection.x <= Math.max(edge.p1.x, edge.p2.x) &&
      intersection.y >= Math.min(edge.p1.y, edge.p2.y) &&
      intersection.y <= Math.max(edge.p1.y, edge.p2.y)
    ) {
      intersectionPoint = intersection;
      break;
    }
  }

  // Draw bisection line up to the intersection
  if (intersectionPoint) {
    ctx.beginPath();
    ctx.strokeStyle = 'blue';
    ctx.moveTo(50, 350);
    ctx.lineTo(50 + intersectionPoint.x * 50, 350 - intersectionPoint.y * 50);
    ctx.stroke();

    // Draw perpendiculars to axes
    ctx.beginPath();
    ctx.strokeStyle = 'red';

    // Perpendicular to X-axis
    ctx.moveTo(50 + intersectionPoint.x * 50, 350 - intersectionPoint.y * 50);
    ctx.lineTo(50 + intersectionPoint.x * 50, 350);

    // Perpendicular to Y-axis
    ctx.moveTo(50 + intersectionPoint.x * 50, 350 - intersectionPoint.y * 50);
    ctx.lineTo(50, 350 - intersectionPoint.y * 50);

    ctx.stroke();
  }
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

