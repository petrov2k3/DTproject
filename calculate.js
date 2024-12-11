// HTML structure for the calculator
document.body.innerHTML = `
  <div>
    <h1>Minimax Criterion Calculator</h1>

    <label for='strategies'>Number of Strategies:</label>
    <input id='strategies' type='number' min='1' value='2'>

    <label for='states'>Number of States:</label>
    <input id='states' type='number' min='1' value='2'>

    <button id='generateMatrix'>Generate Matrix</button>

    <div id='matrixContainer'></div>

    <button id='calculate' style='display:none;'>Calculate</button>

    <div id='results'></div>
  </div>
`;

// Generate input fields for the loss matrix
document.getElementById("generateMatrix").addEventListener("click", () => {
    const strategies = parseInt(document.getElementById("strategies").value);
    const states = parseInt(document.getElementById("states").value);
    const matrixContainer = document.getElementById("matrixContainer");
    matrixContainer.innerHTML = "";

    const table = document.createElement("table");
    for (let i = 0; i < strategies; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < states; j++) {
            const cell = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.placeholder = `S${j + 1}`;
            input.dataset.strategy = i;
            input.dataset.state = j;
            cell.appendChild(input);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixContainer.appendChild(table);

    document.getElementById("calculate").style.display = "block";
});

// Calculate minimax criterion
document.getElementById("calculate").addEventListener("click", () => {
    const strategies = parseInt(document.getElementById("strategies").value);
    const states = parseInt(document.getElementById("states").value);
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
});