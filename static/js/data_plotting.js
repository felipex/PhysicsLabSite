// Global variable to store the chart instance
let dataChart = null;

// Function to parse CSV data from textarea
function parseCSVData(csvText) {
    const lines = csvText.trim().split('\n');
    const data = {
        x: [],
        y: []
    };

    lines.forEach(line => {
        const [x, y] = line.trim().split(',').map(Number);
        if (!isNaN(x) && !isNaN(y)) {
            data.x.push(x);
            data.y.push(y);
        }
    });

    return data;
}

// Function to calculate linear regression
function calculateRegression(data) {
    const n = data.x.length;
    if (n < 2) return null;

    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += data.x[i];
        sumY += data.y[i];
        sumXY += data.x[i] * data.y[i];
        sumX2 += data.x[i] * data.x[i];
        sumY2 += data.y[i] * data.y[i];
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    let totalSS = 0, residualSS = 0;

    for (let i = 0; i < n; i++) {
        const yPred = slope * data.x[i] + intercept;
        residualSS += Math.pow(data.y[i] - yPred, 2);
        totalSS += Math.pow(data.y[i] - yMean, 2);
    }

    const rSquared = 1 - (residualSS / totalSS);

    return {
        slope,
        intercept,
        rSquared,
        // Generate points for regression line
        line: {
            x: [Math.min(...data.x), Math.max(...data.x)],
            y: [
                slope * Math.min(...data.x) + intercept,
                slope * Math.max(...data.x) + intercept
            ]
        }
    };
}

// Function to create or update the chart
function plotData() {
    const chartType = document.getElementById('chartType').value;
    const showRegression = document.getElementById('showRegression').checked;
    const rawData = document.getElementById('dataInput').value;
    const xLabel = document.getElementById('xAxisLabel').value || 'X';
    const yLabel = document.getElementById('yAxisLabel').value || 'Y';

    const data = parseCSVData(rawData);
    const regression = calculateRegression(data);

    // Destroy existing chart if it exists
    if (dataChart) {
        dataChart.destroy();
    }

    // Get the canvas context
    const ctx = document.getElementById('dataChart').getContext('2d');

    // Create datasets
    const datasets = [{
        label: 'Dados',
        data: data.x.map((x, i) => ({x: x, y: data.y[i]})),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: chartType === 'scatter' ? 5 : 0,
        pointHoverRadius: 8,
        showLine: chartType !== 'scatter'
    }];

    // Add regression line if requested and available
    if (showRegression && regression) {
        datasets.push({
            label: 'Regressão Linear',
            data: regression.line.x.map((x, i) => ({x: x, y: regression.line.y[i]})),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            showLine: true
        });

        // Update regression info display
        const regressionInfo = document.getElementById('regressionInfo');
        regressionInfo.innerHTML = `
            <strong>Equação:</strong> y = ${regression.slope.toFixed(4)}x + ${regression.intercept.toFixed(4)}<br>
            <strong>R²:</strong> ${regression.rSquared.toFixed(4)}
        `;
        regressionInfo.style.display = 'block';
    } else {
        document.getElementById('regressionInfo').style.display = 'none';
    }

    // Create chart configuration
    const config = {
        type: chartType === 'bar' ? 'bar' : 'scatter',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: xLabel
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `(${context.parsed.x}, ${context.parsed.y})`;
                        }
                    }
                }
            }
        }
    };

    // Create new chart
    dataChart = new Chart(document.getElementById('dataChart').getContext('2d'), config);
}

// Function to download chart as PNG
function downloadChartAsPNG() {
    const canvas = document.getElementById('dataChart');
    const link = document.createElement('a');
    link.download = 'grafico.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// Function to download chart as SVG
function downloadChartAsSVG() {
    const canvas = document.getElementById('dataChart');
    const ctx = canvas.getContext('2d');
    const svgString = new XMLSerializer().serializeToString(ctx.__proto__._svg);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'grafico.svg';
    link.href = url;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Initialize tooltips and chart when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add example data to textarea
    const exampleData = "0,0\n1,2.1\n2,4.3\n3,6.2\n4,8.1\n5,10.2";
    document.getElementById('dataInput').value = exampleData;

    // Plot initial data
    plotData();
    
    // Add event listeners for download buttons (assuming buttons with ids 'downloadPNG' and 'downloadSVG' exist)
    document.getElementById('downloadPNG').addEventListener('click', downloadChartAsPNG);
    document.getElementById('downloadSVG').addEventListener('click', downloadChartAsSVG);
});