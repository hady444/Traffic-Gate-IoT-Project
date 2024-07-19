#include <Firebase_ESP_Client.h>
#include <LiquidCrystal_I2C.h>
#include <Keypad.h>
#include <WiFi.h>
#include <FirebaseESP32.h>
#include <Wire.h>
#include "time.h"
/ Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"
// Insert your network credentials
#define WIFI_SSID "POCO X3 Pro"
#define WIFI_PASSWORD "00000000"

// Insert Firebase project API Key
#define API_KEY "AIzaSyAtXqjTi1oh8yoN9uS5oR6Zjs7DQdyUNHw"

// Insert Authorized Email and Corresponding Password
#define USER_EMAIL "iot@habda.com"
#define USER_PASSWORD "123456"

// Insert RTDB URL
#define DATABASE_URL "https://smart-gate-63101-default-rtdb.europe-west1.firebasedatabase.app"

/ Define Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// Variable to save USER UID
String uid;

// Database main path (to be updated in setup with the user UID)
String databasePath;
// Database child nodes
String GateLogs = "/GateLogs";

// Parent Node (to be updated in every loop)
String parentPath;

int timestamp;
FirebaseJson json;

const char* ntpServer = "pool.ntp.org";

// Timer variables (send new readings every three minutes)
unsigned long sendDataPrevMillis = 0;
unsigned long timerDelay = 180000; // 3 minutes

// Initialize WiFi
void initWiFi() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println();
}
// Function that gets current epoch time
unsigned long getTime() {
  time_t now;
  struct tm timeinfo;
  if (!getLocalTime(&timeinfo)) {
    //Serial.println("Failed to obtain time");
    return(0);
  }
  time(&now);
  return now;
}


const uint8_t ROWS = 4;
const uint8_t COLS = 1;
char keys[ROWS][COLS] = {
  { '1'},
  { '4'},
  { '7' },
  { '*' }
};
//keypad pins
uint8_t colPins[COLS] = { 26 }; // Pins connected to C1, C2, C3, C4
uint8_t rowPins[ROWS] = { 13, 12, 14, 27 }; // Pins connected to R1, R2, R3, R4

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
Servo servo1;
Servo servo2;  // create servo object to control a servo
LiquidCrystal_I2C lcd(0x27,16,2);
int pos = 0;    // variable to store the servo position
char key;
#define Trigg1 5
#define echo1 15
#define Trig2 17
#define echo2 16

#define irsensor 32

void setup() {
  Serial.begin(115200);

  initWiFi();
  configTime(0, 0, ntpServer);

  // Assign the API key (required)
  config.api_key = API_KEY;

  // Assign the user sign-in credentials
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  // Assign the RTDB URL (required)
  config.database_url = DATABASE_URL;

  Firebase.reconnectWiFi(true);
  fbdo.setResponseSize(4096);

  // Assign the callback function for the long-running token generation task
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Assign the maximum retry of token generation
  config.max_token_generation_retry = 5;

  // Initialize the library with the Firebase auth and config
  Firebase.begin(&config, &auth);

  // Getting the user UID might take a few seconds
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  // Print user UID
  uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);
// Update database path
  databasePath = "/UsersData/" + uid + "/GateLogs";


//  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  servo1.attach(18);
  servo2.attach(19);  // attaches the servo on GPIO 18 to the servo object
  pinMode(Trigg1, OUTPUT);
  pinMode(echo1, INPUT);
  pinMode(irsensor,INPUT);
  pinMode(Trig2, OUTPUT);
  pinMode(echo2, INPUT);
}

void loop() {

  digitalWrite(Trig2, HIGH);
  delayMicroseconds(10);
  digitalWrite(Trig2, LOW);
  int duration3 = pulseIn(echo2, HIGH) /58;
Serial.print("snensor 2= ");
      Serial.print(duration3);
      Serial.println();
  int sensorValue = analogRead(irsensor);
  float sensorDistance=sensorValue/9.765;
  Serial.println(sensorDistance);
  if (sensorDistance > 0 && sensorDistance <= 210){
    Serial.println("im in");
    servo1.write(90);
    delay(2000);
    servo1.write(0);
  }
  digitalWrite(Trigg1, HIGH);
  delayMicroseconds(10);
  digitalWrite(Trigg1, LOW);
  int duration2 = pulseIn(echo1, HIGH) /58;

  Serial.println(duration2);
  if (duration2 > 0 && duration2 <= 50){
    bool carCome = true;
    key = keypad.getKey();
    lcd.setCursor(0,0);
    lcd.print("pay 1000 coin");
    


    if (key == '1'){
      bool paid1 = true;
      Serial.println("in pay");
      Serial.println("snensor 1= " + duration2);
      Serial.println("snensor 2= " + duration3);
      servo2.write(90);
      while (((duration3 > 0 && duration3 <= 50) || paid1 && carCome)){
        Serial.println("in while");
    digitalWrite(Trig2, HIGH);
  delayMicroseconds(10);
  digitalWrite(Trig2, LOW);
    duration3 = pulseIn(echo2, HIGH) /58;
    if (duration3 > 50){
      paid1 = false;
      carCome = false;
      sendData(1);
      break;
    }
      }
      servo2.write(90);
      delay(2000);
    servo2.write(0);}
  }else{
    lcd.clear();
    lcd.setCursor(0,0);
  lcd.print("welcome to alex");
  }


    
  
/*  for (pos = 0; pos <= 180; pos += 1) { // goes from 0 degrees to 180 degrees
    servo1.write(pos);
    servo2.write(pos);        // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  delay(1000);  // wait for a second
  for (pos = 180; pos >= 0; pos -= 1) { // goes from 180 degrees to 0 degrees
    servo1.write(pos);
    servo2.write(pos);              // tell servo to go to position in variable 'pos'
    delay(15);                       // waits 15ms for the servo to reach the position
  }
  */delay(1000);  // wait for a second
}

void sendData(bool paid) {
  // Send new log to the database
  if (Firebase.ready() && (millis() - sendDataPrevMillis > timerDelay || sendDataPrevMillis == 0)) {
    sendDataPrevMillis = millis();

    // Get current timestamp
    timestamp = getTime();
    Serial.print("Time: ");
    Serial.println(timestamp);

    // Generate unique ID for each log entry
    parentPath = databasePath + "/" + String(timestamp);

    // Set car plate number, photo (dummy value here), and payment status
    json.set("/paidorno", paid); // Example payment status

    Serial.printf("Set json... %s\n", Firebase.RTDB.setJSON(&fbdo, parentPath.c_str(), &json) ? "ok" : fbdo.errorReason().c_str());
  }
}