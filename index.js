const express = require('express');
const axios = require('axios');

// Initialize express app
const app = express();
const port = 3000; // You can use any port

// Counter to track the number of requests sent
let requestCount = 0;

// Dynamic values
const source_ids = [
    "f34aa993-5681-4297-91da-323208fd58a6",
    "aeb7fd8e-d4cf-4c84-ba92-69250ea28bff",
    "34c80a77-cc59-49f2-a186-23e7178abde4",
];

const eventTypes = [
    "page-view",
    "click",
    "scroll",
    "form-submit",
    "video-play",
    "video-pause",
    "purchase"
];

const timeZones = [
    "Asia/Calcutta",
    "America/New_York",
    "Europe/London",
    "Australia/Sydney",
    "Africa/Johannesburg"
];

const browserNames = [
    "chrome",
    "firefox",
    "safari",
    "edge",
    "opera"
];

const screenResolutions = [
    { width: 1920, height: 1080 },  // Full HD
    { width: 1366, height: 768 },   // HD
    { width: 1280, height: 800 },   // WXGA
    { width: 1440, height: 900 },   // HD+
    { width: 2560, height: 1440 }   // QHD
];

const platforms = [
    "Win32",    // Windows
    "MacIntel", // macOS
    "Linux",    // Linux
    "Android",  // Android
    "iOS"       // iOS
];

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 11; Pixel 4 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_2 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/537.36"
];

// Function to get random element from an array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Function to get a random payload with dynamic data
function getRandomPayload() {
    const timeZone = getRandomElement(timeZones);
    const browserName = getRandomElement(browserNames);
    const screenResolution = getRandomElement(screenResolutions);
    const platform = getRandomElement(platforms);
    const userAgent = getRandomElement(userAgents);
    const sourceId = getRandomElement(source_ids);

    // Random event data
    const eventType = getRandomElement(eventTypes);
    const eventUrl = `http://127.0.0.1:5500/app/demo/${eventType}.html`;
    const eventTitle = eventType === 'page-view' ? "Ludus - Electronics, Apparel, Computers, Books, DVDs & more" : "User Interaction Event";

    return {
        "source": { "id": sourceId },
        "context": {
            "time": {
                "local": new Date(Date.now() - Math.floor(Math.random() * 5000)).toLocaleString(), // Small random time offset
                "tz": timeZone
            },
            "browser": {
                "local": {
                    "browser": { "name": browserName },
                    "engine": "Gecko", // You can adjust the engine if needed
                    "appVersion": userAgent,
                    "userAgent": userAgent,
                    "language": "en-GB",
                    "onLine": true,
                    "javaEnabled": false,
                    "cookieEnabled": true
                },
                "device": {
                    "platform": platform
                }
            },
            "screen": {
                "local": {
                    "width": screenResolution.width,
                    "height": screenResolution.height,
                    "innerWidth": screenResolution.width * 0.75,
                    "innerHeight": screenResolution.height * 0.75,
                    "availWidth": screenResolution.width,
                    "availHeight": screenResolution.height - 100,
                    "colorDepth": 24,
                    "pixelDepth": 24,
                    "orientation": "landscape-primary"
                }
            }
        },
        "profile": { "id": "32d2eb40-933b-4ec1-1234-4848ed8059f1" },
        "session": { "id": "0fe01c01-cdce-43ca-9824-09855deb1fd5" },
        "options": {},
        "events": [
            {
                "properties": { "category": "user-interaction" },
                "type": eventType,
                "options": {},
                "context": {
                    "page": {
                        "url": eventUrl,
                        "path": `/app/demo/${eventType}.html`,
                        "hash": "",
                        "title": eventTitle,
                        "referer": { "host": null, "query": null },
                        "history": { "length": Math.floor(Math.random() * 20) + 1 } // Random history length
                    }
                }
            }
        ]
    };
}

// Function to send the POST request
function sendPostRequest() {
    const payload = { ...getRandomPayload(), timestamp: new Date().toISOString() };

    axios.post('https://aidna.exyntra.com/service/track', payload, { headers: { 'Content-Type': 'application/json' } })
        .then(response => {
            console.log('Success:', response.data);
            requestCount++; // Increment the request count after a successful request
        })
        .catch(error => {
            console.error('Error:', error.message);
        });

    // Schedule the next request with an average of 2 seconds interval (0.5 events per second)
    setTimeout(sendPostRequest, Math.floor(Math.random() * 1500) + 3000); // Random delay between 1.5s to 2.5s
}

// Root route to show how many requests have been sent
app.get('/', (req, res) => {
    res.send(`Server up! Requests sent: ${requestCount}`);
});

// Start the loop of sending requests
sendPostRequest();

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
