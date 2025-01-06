// ThingSpeak configuration 
class ThingSpeakData {
    constructor() {
        // Replace with your ThingSpeak channel data
        this.channelID = '2739575';
        this.readAPIKey = 'MOM63169N1QBIC3I';
        
        // Initial data structure for current data and historical data
        this.data = {
            temperature: 0,
            humidity: 0,
            airQuality: 0,
            peopleCount: 0
        };

        this.historicalData = {
            labels: [],
            temperature: [],
            humidity: [],
            airQuality: [],
            peopleCount: []
        };

        this.subscribers = [];
    }

    // Get current data from ThingSpeak
    async fetchCurrentData() {
        try {
            const response = await fetch(`https://api.thingspeak.com/channels/${this.channelID}/feeds/last.json?api_key=${this.readAPIKey}`);
            const data = await response.json();
            
            // Map fields to your data structure
            this.data = {
                temperature: parseFloat(data.field1) || 0,  // Assume field1 is temperature
                humidity: parseFloat(data.field2) || 0,    // Assume field2 is humidity
                airQuality: parseFloat(data.field3) || 0,  // Assume field3 is air quality
                peopleCount: parseInt(data.field4) || 0    // Assume field4 is people count
            };

            this.notifySubscribers();  // Notify subscribers with the updated data
        } catch (error) {
            console.error('Error fetching ThingSpeak data:', error);
        }
    }

    // Get historical data from ThingSpeak
    async fetchHistoricalData() {
        try {
            // Fetch the last 100 entries from ThingSpeak
            const response = await fetch(`https://api.thingspeak.com/channels/${this.channelID}/feeds.json?api_key=${this.readAPIKey}&results=100`);
            const data = await response.json();
            
            // Initialize historical data object if it's not already initialized
            this.historicalData = {
                labels: [],
                temperature: [],
                humidity: [],
                airQuality: [],
                peopleCount: []
            };

            // Check if data.feeds exists and has data
            if (!data.feeds || data.feeds.length === 0) {
                console.error('No historical data available');
                return;  // Return early if no data
            }

            // Process the historical data from ThingSpeak
            data.feeds.forEach(feed => {
                const date = new Date(feed.created_at);
                this.historicalData.labels.push(
                    date.toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                );

                // Push data values to the corresponding arrays
                this.historicalData.temperature.push(parseFloat(feed.field1) || 0);
                this.historicalData.humidity.push(parseFloat(feed.field2) || 0);
                this.historicalData.airQuality.push(parseFloat(feed.field3) || 0);
                this.historicalData.peopleCount.push(parseInt(feed.field4) || 0);
            });

            this.notifySubscribers();  // Notify subscribers with the updated historical data
        } catch (error) {
            console.error('Error fetching ThingSpeak historical data:', error);
        }
    }

    // Start periodic updates for current and historical data
    startUpdates() {
        // Fetch initial data
        this.fetchCurrentData();
        this.fetchHistoricalData();

        // Update current data every 15 seconds
        setInterval(() => {
            this.fetchCurrentData();
        }, 15000);

        // Update historical data every minute
        setInterval(() => {
            this.fetchHistoricalData();
        }, 60000);
    }

    // Subscribe to data updates (for charting or UI update)
    subscribe(callback) {
        this.subscribers.push(callback);
    }

    // Notify all subscribers with the updated data
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.data, this.historicalData));
    }
    
}

// Export the ThingSpeakData instance for use in other parts of the app
const thingSpeakData = new ThingSpeakData();
export default thingSpeakData;
