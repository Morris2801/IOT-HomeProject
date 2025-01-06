import { Chart } from 'chart.js';

class ChartManager {
    constructor(sensorData) {
        this.sensorData = sensorData;
        this.charts = {};
    }

    initializeCharts(tempHumCtx, airOccCtx) {
        // Temperature & Humidity Chart
        this.charts.tempHum = new Chart(tempHumCtx, {
            type: 'line',
            data: {
                labels: this.sensorData.historicalData.labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: this.sensorData.historicalData.temperature,
                        borderColor: '#3b82f6',
                        backgroundColor: '#93c5fd50',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Humidity (%)',
                        data: this.sensorData.historicalData.humidity,
                        borderColor: '#10b981',
                        backgroundColor: '#6ee7b750',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: this.getChartOptions('Temperature & Humidity Over Time')
        });

        // Air Quality & Occupancy Chart
        this.charts.airOcc = new Chart(airOccCtx, {
            type: 'line',
            data: {
                labels: this.sensorData.historicalData.labels,
                datasets: [
                    {
                        label: 'Air Quality (%)',
                        data: this.sensorData.historicalData.airQuality,
                        borderColor: '#f59e0b',
                        backgroundColor: '#fcd34d50',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'People Count',
                        data: this.sensorData.historicalData.peopleCount,
                        borderColor: '#6366f1',
                        backgroundColor: '#a5b4fc50',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: this.getChartOptions('Air Quality & Occupancy Over Time')
        });
    }

    getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'normal'
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e5e7eb'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        };
    }

    updateCharts(data, historicalData) {
        // Update Temperature & Humidity Chart
        this.charts.tempHum.data.labels = historicalData.labels;
        this.charts.tempHum.data.datasets[0].data = historicalData.temperature;
        this.charts.tempHum.data.datasets[1].data = historicalData.humidity;
        this.charts.tempHum.update('none');

        // Update Air Quality & Occupancy Chart
        this.charts.airOcc.data.labels = historicalData.labels;
        this.charts.airOcc.data.datasets[0].data = historicalData.airQuality;
        this.charts.airOcc.data.datasets[1].data = historicalData.peopleCount;
        this.charts.airOcc.update('none');
    }
}

export default ChartManager;
