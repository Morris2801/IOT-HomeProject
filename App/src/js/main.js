import feather from 'feather-icons';

export function initializeApp(sensorData, ChartManager) {
    console.log('Inicializando aplicación...');

    // Initialize Feather icons
    if (window.feather) {
        feather.replace();
    }

    // Initialize charts
    const chartManager = new ChartManager(sensorData);

    // Page navigation
    const navItems = document.querySelectorAll(".nav-item");
    const pages = document.querySelectorAll(".page");

    if (navItems && pages) {
        console.log('Configurando navegación...');
        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                const targetPage = item.dataset.page;
                
                // Update navigation
                navItems.forEach((nav) => nav.classList.remove("active"));
                item.classList.add("active");
                
                // Update pages
                pages.forEach((page) => {
                    page.classList.remove("active");
                    if (page.id === targetPage) {
                        page.classList.add("active");
                    }
                });
            });
        });
    }

    function updateUI(data) {
        console.log('Actualizando UI con datos:', data);
        const elements = {
            temperature: document.getElementById("temperature"),
            humidity: document.getElementById("humidity"),
            airQuality: document.getElementById("air-quality"),
            peopleCount: document.getElementById("people-count")
        };

        // Update metrics if elements exist
        if (elements.temperature) elements.temperature.textContent = `${data.temperature.toFixed(1)}°C`;
        if (elements.humidity) elements.humidity.textContent = `${data.humidity}%`;
        if (elements.airQuality) elements.airQuality.textContent = `${data.airQuality}%`;
        if (elements.peopleCount) elements.peopleCount.textContent = data.peopleCount;

        // Update timestamps
        const times = document.querySelectorAll(".update-time");
        const now = new Date().toLocaleTimeString();
        times.forEach((time) => {
            time.textContent = `Updated at ${now}`;
        });
    }

    // Set up control buttons
    setupControlButtons();

    // Set up settings
    setupSettings();

    // Subscribe to sensor data updates
    sensorData.subscribe((data, historicalData) => {
        updateUI(data);
        chartManager.updateCharts(data, historicalData);
    });

    // Start sensor data updates
    sensorData.startUpdates();

    function setupControlButtons() {
        const controlButtons = {
            windows: document.getElementById("windows-btn"),
            fan: document.getElementById("fan-btn"),
            ac: document.getElementById("ac-btn"),
            reset: document.getElementById("reset-btn")
        };

        let deviceStates = {
            windows: false,
            fan: false,
            ac: false
        };

        // Toggle device states
        Object.entries(controlButtons).forEach(([device, button]) => {
            if (button && device !== "reset") {
                button.addEventListener("click", () => {
                    deviceStates[device] = !deviceStates[device];
                    button.classList.toggle("active", deviceStates[device]);
                    console.log(`${device} turned ${deviceStates[device] ? "on" : "off"}`);
                });
            }
        });

        // Reset button
        if (controlButtons.reset) {
            controlButtons.reset.addEventListener("click", () => {
                Object.keys(deviceStates).forEach((device) => {
                    deviceStates[device] = false;
                    if (controlButtons[device]) {
                        controlButtons[device].classList.remove("active");
                    }
                });
                console.log("All devices reset to off state");
            });
        }
    }

    function setupSettings() {
        const thresholdInputs = {
            temperature: document.getElementById("temp-threshold"),
            humidity: document.getElementById("humidity-target"),
            airQuality: document.getElementById("air-quality-min")
        };

        Object.entries(thresholdInputs).forEach(([setting, input]) => {
            if (input) {
                input.addEventListener("input", (e) => {
                    console.log(`${setting} threshold set to: ${e.target.value}`);
                });
            }
        });
    }
}
