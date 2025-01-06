#include <HTTPClient.h>
#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <ESP32Servo.h>

#define DHTTYPE DHT11
#define TRIG_PIN 26
#define ECHO_PIN 25
#define MqAnalogPin 32 
#define MqDigitalPin 19
#define BUTTON_PIN 13  
#define LIGHT_SENSOR 33
#define Solar_sensor 39

// Creacion LCD
LiquidCrystal_I2C lcd(0x27, 16, 2);

// Selectores
int s1 = 23;
int s2 = 17;
int s3 = 4;
int ledAir = 12;
int ledDHT = 14;
int ledButt = 5;
int ledDist = 27;
//Cosas para PanelSolar https://how2electronics.com/iot-based-solar-power-monitoring-system-with-esp32/
float R1 = 30000; 
float R2 = 7500; 
int value = 0; 
float Vout = 0;
float Vin = 0 ;

Servo myServo; // Servo object

// Configuración Wi-Fi
const char* ssid = "Mau";
const char* password = "carspotter1";

/* const char* ssid = "InMorris-WiFi";
const char* password = "Umpalumpa.149"; 
 */
// Configuración de Thingspeak 
String apiKey = "858RKIG8JVX5DXJQ";
const char* server = "http://api.thingspeak.com";

// Sensores
DHT dht(18, DHTTYPE);
float duration_us, distance_cm;

//Cosas para PushButtn
volatile int count = 0; 
volatile unsigned long lastPressTime = 0; // Variable to track the last press time
void botonPulsado() {
  unsigned long currentTime = millis();
  if (currentTime - lastPressTime > 200) { // Debounce delay (200ms)
    count++;
    digitalWrite(ledButt, HIGH);
    lastPressTime = currentTime; // Update the last press time
  }
}

void setup() { 
  // LCD 
  lcd.init(); 
  lcd.backlight(); 
  // Serial 
  Serial.begin(115200); 
  // PinModes 
  pinMode(TRIG_PIN, OUTPUT); 
  pinMode(ECHO_PIN, INPUT); 
  pinMode(MqDigitalPin, INPUT); 
  pinMode(BUTTON_PIN, INPUT_PULLUP); 
  pinMode(s1, INPUT); 
  pinMode(s2, INPUT); 
  pinMode(s3, INPUT);
  pinMode(ledAir, OUTPUT); 
  pinMode(ledDist, OUTPUT); 
  pinMode(ledDHT, OUTPUT); 
  pinMode(ledButt, OUTPUT);
  analogSetAttenuation(ADC_11db);
  // DHT 
  dht.begin();
  // WiFi 
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi"); 
  while (WiFi.status() != WL_CONNECTED) { 
    delay(500);
    Serial.print(".");
    lcd.print("Connecting...");
  } 
  Serial.println("\nConnected to Wi-Fi");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP()); 
  delay(2000); 
  //Interrupt 
  attachInterrupt(BUTTON_PIN, botonPulsado, FALLING);
  ///Servo
  myServo.attach(15); // P15
}

void loop() {
  // Botón
  if(digitalRead(BUTTON_PIN) == HIGH){
    digitalWrite(ledButt, LOW); 
  }
  else{
    digitalWrite(ledButt, HIGH);
    //delay(1);
  }
  // Lectura de DHT
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(true);
  float temperatureC = dht.readTemperature();
      
  // Lectura del sensor ultrasónico
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  duration_us = pulseIn(ECHO_PIN, HIGH);
  distance_cm = 0.017 * duration_us;
      
  // Calidad de aire
  int analogValue = analogRead(MqAnalogPin);
  int digitalValue = digitalRead(MqDigitalPin);

  // LDR
  int LDRAnalog = analogRead(LIGHT_SENSOR);
  // SolarP
  value = analogRead(Solar_sensor);
  Vout = (value * 1.1) / 4095.0;
  Vin = Vout / (R2 / (R1 + R2));

  // Mover Servo
  if (analogValue > 2480) {
    myServo.write(180); // Mover servo a 90 grados
  } else {
    myServo.write(0); // Mover servo a 0 grados
  }
      
  // Imprimir datos Serial
  Serial.print("Humedad: ");
  Serial.print(humidity);
  Serial.print("%  Temperatura: ");
  Serial.print(temperature);
  Serial.print("°F  Temperatura (C): ");
  Serial.print(temperatureC);
  Serial.println("°C");
  Serial.print("Valor analógico del MQ: ");
  Serial.println(analogValue);
  Serial.print("Valor digital del MQ: ");
  Serial.println(digitalValue);
  Serial.print("Distancia: ");
  Serial.println(distance_cm);
  Serial.print("Pulsaciones: ");
  Serial.println(count);
  Serial.print("LDR Analog Value = ");
  Serial.print(LDRAnalog);
  if (LDRAnalog < 40) {
    Serial.println(" => Dark");
  } 
  else if (LDRAnalog < 800) {
    Serial.println(" => Dim");
  } 
  else if (LDRAnalog < 2000) {
    Serial.println(" => Light");
  } 
  else if (LDRAnalog < 3200) {
    Serial.println(" => Bright");
  } 
  else {
    Serial.println(" => Very bright");
  }
  Serial.print("SolarPanel Voltage: ");
  Serial.println(Vin);
  Serial.print("AnalogoSP: "); 
  Serial.println(value); 
  Serial.print("----------\n");

  // Imprimir LCD
  lcd.clear();
  lcd.setCursor(0,0);
  
  if (digitalRead(s3) == LOW) {
      if (digitalRead(s2) == LOW && digitalRead(s1) == LOW){ // 000 - temp
        lcd.print("Temp: "); 
        lcd.print(temperatureC);
        lcd.print("C");
        digitalWrite(ledDHT, HIGH);
        digitalWrite(ledAir, LOW);
        digitalWrite(ledDist, LOW);
      }
      else if(digitalRead(s2) == LOW && digitalRead(s1) == HIGH){ // 001 - hum
        lcd.print("Humedad: ");
        lcd.print(humidity);
        lcd.print("%");
        digitalWrite(ledDHT, HIGH);
        digitalWrite(ledAir, LOW);
        digitalWrite(ledDist, LOW);
      }
      else if(digitalRead(s2) == HIGH && digitalRead(s1) == LOW){ // 010 - dist
        lcd.print("Dist: "); 
        lcd.print(distance_cm);
        lcd.print("cm");
        digitalWrite(ledDHT, LOW);
        digitalWrite(ledAir, LOW);
        digitalWrite(ledDist, HIGH);
      }
      else if(digitalRead(s2) == HIGH && digitalRead(s1) == HIGH){ // 011 - airQ
        lcd.print("AirQuality: ");
        lcd.print(analogValue);
        digitalWrite(ledDHT, LOW);
        digitalWrite(ledAir, HIGH);
        digitalWrite(ledDist, LOW);
      }
  }
  else {
      if (digitalRead(s2) == LOW && digitalRead(s1) == LOW){ // 100 - pulses
        lcd.print("Pulses: ");
        lcd.print(count);
        digitalWrite(ledDHT, LOW);
        digitalWrite(ledAir, LOW);
        digitalWrite(ledDist, LOW);
      }
      else if (digitalRead(s2) == LOW && digitalRead(s1) == HIGH){ // 101 - light level
        lcd.print("Light: ");
        lcd.print(LDRAnalog);
        digitalWrite(ledDHT, LOW);
        digitalWrite(ledAir, LOW);
        digitalWrite(ledDist, LOW);
      }
      else if (digitalRead(s2) == HIGH && digitalRead(s1) == LOW){ // 110 - sOLAR pANEL 
        lcd.print("S.Panel: "); 
        lcd.print(Vin);
      }
  }

  // Verificar DHT
  if (isnan(humidity) || isnan(temperatureC)) {
    Serial.println("Error al leer del sensor DHT11");
    return;
  }

  if (WiFi.status() == WL_CONNECTED) {
    // Enviar datos a ThingSpeak
    HTTPClient http;
    String url = String(server) + "/update?api_key=" + apiKey + "&field1=" + String(temperatureC) + "&field2=" + String(humidity) + "&field3=" + String(analogValue) + "&field4=" + String(distance_cm) + "&field5=" + String(count) + "&field6=" + String(LDRAnalog) + "&field7=" + String(Vin);
    http.begin(url);
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      Serial.println("Datos enviados a ThingSpeak!");
      Serial.println("Código de respuesta HTTP: " + String(httpResponseCode));
    } 
    else {
      Serial.println("Error en la conexión: " + String(httpResponseCode));
    }
    http.end();
  } 
  else {
    Serial.println("No conectado a Wi-Fi");
  }
  delay(2000);
}