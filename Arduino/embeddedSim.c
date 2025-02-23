#include <ArduinoJson.h>

// Connect your Arduino to your computer serially through USB
// Say yes to popups: Ex: "Allow this device to connect" or "Install drivers for Arduino Uno"
// Go to Tools > Manage Libraries > Search: "ArduinoJson" > Cick "Install"
// Create new sketch (sketch.c by default is created)
// Press the Upload (Right Arrow symbol) button in the top right
// This code is now compiled, running asynchronously on the Arduino 

// House configuration
const char* HOUSE_ID = "HouseA";
const int SEND_INTERVAL = 2000;
unsigned long lastSendTime = 0;

// Pin configuration
const int LED_RED = 11;
const int LED_YELLOW = 12;
const int LED_GREEN = 13;

// State tracking variables
float currentProduction = 2000;    // Starting at 2kW (typical daytime solar)
float currentConsumption = 1500;   // Starting at 1.5kW (typical home use)
float batteryLevel = 75;          // Starting at 75%
bool donateEnabled = true;

// Change rate limits (per interval)
const float MAX_PRODUCTION_CHANGE = 200;    // Larger changes for realistic solar variations
const float MAX_CONSUMPTION_CHANGE = 300;   // Larger changes for realistic consumption spikes
const float MAX_BATTERY_CHANGE = 1.0;      // Battery change rate

// Boundaries (in Watts)
const float MIN_PRODUCTION = 800;           // Minimum daytime production
const float MAX_PRODUCTION = 4000;          // Maximum production on a good day
const float MIN_CONSUMPTION = 500;          // Base home load
const float MAX_CONSUMPTION = 5000;         // Peak home usage
const float MIN_BATTERY = 60;
const float MAX_BATTERY = 100;

// Battery thresholds
const float BATTERY_CRITICAL = 65.0;
const float BATTERY_WARNING = 75.0;
const float BATTERY_GOOD = 85.0;

// Helper function for smooth random changes with bias
float smoothChange(float currentValue, float minValue, float maxValue, float maxChange) {
    float bias = (maxValue - minValue) * 0.1;  // 10% bias
    float change = random(-maxChange * 100, maxChange * 100) / 100.0;
    
    if (currentValue == currentProduction) {
      change -= bias;  // Bias towards decreasing production
    } else if (currentValue == currentConsumption) {
      change += bias;  // Bias towards increasing consumption
    }
    
    float newValue = currentValue + change;
    
    if (newValue < minValue) newValue = minValue;
    if (newValue > maxValue) newValue = maxValue;
    
    return newValue;
  }
  
  void updateLEDs(float battery) {
    // Turn off all LEDs first
    digitalWrite(LED_RED, LOW);
    digitalWrite(LED_YELLOW, LOW);
    digitalWrite(LED_GREEN, LOW);
    
    // Turn on appropriate LED based on battery level
    if (battery < BATTERY_CRITICAL) {
      digitalWrite(LED_RED, HIGH);
    } else if (battery < BATTERY_WARNING) {
      digitalWrite(LED_YELLOW, HIGH);
    } else {
      digitalWrite(LED_GREEN, HIGH);
    }
  }
  
  void setup() {
    Serial.begin(9600);
    Serial.println("Energy Monitor Starting...");
    randomSeed(analogRead(0));
    
    // Setup LED pins
    pinMode(LED_RED, OUTPUT);
    pinMode(LED_YELLOW, OUTPUT);
    pinMode(LED_GREEN, OUTPUT);
    
    // Initial LED state
    updateLEDs(batteryLevel);
  }
  
  void loop() {
    unsigned long currentTime = millis();
    
    if (currentTime - lastSendTime >= SEND_INTERVAL) {
      // Update state with smooth changes
      currentProduction = smoothChange(currentProduction, MIN_PRODUCTION, MAX_PRODUCTION, MAX_PRODUCTION_CHANGE);
      currentConsumption = smoothChange(currentConsumption, MIN_CONSUMPTION, MAX_CONSUMPTION, MAX_CONSUMPTION_CHANGE);
      
      // Battery level changes based on production vs consumption
      float powerDelta = currentProduction - currentConsumption;
      float batteryChange = (powerDelta / 500.0) * MAX_BATTERY_CHANGE;
      batteryLevel = constrain(batteryLevel + batteryChange, MIN_BATTERY, MAX_BATTERY);
      
      // Update LEDs based on battery level
      updateLEDs(batteryLevel);
      
      // Create and send JSON document
      StaticJsonDocument<200> doc;
      doc["id"] = HOUSE_ID;
      doc["currentProduction"] = round(currentProduction);
      doc["currentConsumption"] = round(currentConsumption);
      doc["batteryLevel"] = round(batteryLevel * 10) / 10.0;
      doc["donateEnabled"] = donateEnabled;
      
      // Add power status to JSON
      if (batteryLevel < BATTERY_CRITICAL) {
        doc["powerStatus"] = "CRITICAL";
      } else if (batteryLevel < BATTERY_WARNING) {
        doc["powerStatus"] = "WARNING";
      } else {
        doc["powerStatus"] = "GOOD";
      }
      
      serializeJson(doc, Serial);
      Serial.println();
      
      lastSendTime = currentTime;
    }
  }
  L