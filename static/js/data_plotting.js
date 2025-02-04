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

// Function to create or update the chart
function plotData() {
    const chartType = document.getElementById('chartType').value;
    const rawData = document.getElementById('dataInput').value;
    const xLabel = document.getElementById('xAxisLabel').value || 'X';
    const yLabel = document.getElementById('yAxisLabel').value || 'Y';
    
    const data = parseCSVData(rawData);
    
    // Destroy existing chart if it exists
    if (dataChart) {
        dataChart.destroy();
    }
    
    // Get the canvas context
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    // Create dataset configuration based on chart type
    const dataset = {
        label: 'Dados',
        data: data.x.map((x, i) => ({x: x, y: data.y[i]})),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: chartType === 'scatter' ? 5 : 0,
        pointHoverRadius: 8,
        showLine: chartType !== 'scatter'
    };
    
    // Create chart configuration
    const config = {
        type: chartType === 'bar' ? 'bar' : 'scatter',
        data: {
            datasets: [dataset]
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
    dataChart = new Chart(ctx, config);
}

// Initialize tooltips when document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add example data to textarea
    const exampleData = "0,0\n1,2.1\n2,4.3\n3,6.2\n4,8.1\n5,10.2";
    document.getElementById('dataInput').value = exampleData;
    
    // Plot initial data
    plotData();
});
