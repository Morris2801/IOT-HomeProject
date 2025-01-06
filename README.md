# IOT - Home Monitoring Interface

This project was created using a ESP-32 microcontroller, with sensors and actuators in order to compile data. Information about the physical environment is attached in the .pdf presentation.

To use: 
1. Configure a ThingSpeak Channel with the appropriate API ReadKey and receiving-end fields and save it. 
2. Update the .ino file with the network the ESP-32 will use, the ThingSpeak ReadKey and download the .ino file to the ESP-32 board and execute it. This will start the data collection and transmission process.
3. To run the developed App, open the App folder until the /dashboardIOT root is found. 
4. In VisualStudioCode (or other), change the directory with cd C:\...\dashboard2iot
5. Run the following command: *npm run dev*
6. Open the running localhost link and click around the App.
7. If everything went correctly, you should see data update in almost real time (limited by ThingSpeak's refresh rate). 


Developed using React+Vite, Tailwind, HTML, JavaScript, CSS, and with help of my teammates and Microsoft Copilot and Claude.ai.
