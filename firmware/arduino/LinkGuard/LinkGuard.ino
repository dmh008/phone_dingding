/**
 * LinkGuard — Arduino IDE 版本
 * 板型：ESP32C3 Dev Module
 * 与 ../src/main.cpp 逻辑相同，方便只用 Arduino IDE 的用户烧录。
 */

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

static const int PIN_BUZZER = 4;
static const int PIN_LED = 5;
static const int PIN_MUTE = 6;
static const char *DEVICE_NAME = "LinkGuard";

#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHAR_STATUS_UUID    "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

enum class LinkState : uint8_t { Advertising, Connected, Alarming, Muted };

static volatile bool g_connected = false;
static volatile bool g_justDisconnected = false;
static LinkState g_state = LinkState::Advertising;
static unsigned long g_alarmPhaseMs = 0;
static bool g_buzzerOn = false;
static bool g_lastMute = true;
static unsigned long g_lastMuteChangeMs = 0;
BLECharacteristic *g_statusChar = nullptr;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer *) override {
    g_connected = true;
    g_justDisconnected = false;
  }
  void onDisconnect(BLEServer *server) override {
    g_connected = false;
    g_justDisconnected = true;
    server->getAdvertising()->start();
  }
};

void setBuzzer(bool on) {
  digitalWrite(PIN_BUZZER, on ? HIGH : LOW);
  g_buzzerOn = on;
}
void setLed(bool on) { digitalWrite(PIN_LED, on ? HIGH : LOW); }

void publishStatus(const char *text) {
  if (!g_statusChar) return;
  g_statusChar->setValue(text);
  g_statusChar->notify();
}

void enterState(LinkState next) {
  if (g_state == next) return;
  g_state = next;
  g_alarmPhaseMs = millis();
  setBuzzer(false);
  switch (next) {
    case LinkState::Advertising: setLed(false); break;
    case LinkState::Connected: setLed(true); publishStatus("connected"); break;
    case LinkState::Alarming: publishStatus("alarm"); break;
    case LinkState::Muted: setLed(false); publishStatus("muted"); break;
  }
}

void setupBle() {
  BLEDevice::init(DEVICE_NAME);
  BLEServer *server = BLEDevice::createServer();
  server->setCallbacks(new ServerCallbacks());
  BLEService *service = server->createService(SERVICE_UUID);
  g_statusChar = service->createCharacteristic(
      CHAR_STATUS_UUID,
      BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY);
  g_statusChar->addDescriptor(new BLE2902());
  g_statusChar->setValue("boot");
  service->start();
  BLEAdvertising *adv = BLEDevice::getAdvertising();
  adv->addServiceUUID(SERVICE_UUID);
  adv->setScanResponse(true);
  BLEDevice::startAdvertising();
}

bool mutePressedEdge() {
  const bool level = digitalRead(PIN_MUTE);
  const unsigned long now = millis();
  if (level != g_lastMute && (now - g_lastMuteChangeMs) > 40) {
    g_lastMute = level;
    g_lastMuteChangeMs = now;
    if (level == LOW) return true;
  }
  return false;
}

void updateAlarmPattern() {
  const bool shouldOn = ((millis() - g_alarmPhaseMs) % 500UL) < 250UL;
  if (shouldOn != g_buzzerOn) setBuzzer(shouldOn);
  setLed(shouldOn);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_MUTE, INPUT_PULLUP);
  setBuzzer(false);
  setLed(false);
  setupBle();
  enterState(LinkState::Advertising);
}

void loop() {
  if (g_connected) {
    if (g_state != LinkState::Connected) enterState(LinkState::Connected);
  } else if (g_justDisconnected) {
    g_justDisconnected = false;
    enterState(LinkState::Alarming);
  }

  if (mutePressedEdge()) {
    if (g_state == LinkState::Alarming) enterState(LinkState::Muted);
    else if (g_state == LinkState::Muted) enterState(LinkState::Alarming);
  }

  switch (g_state) {
    case LinkState::Advertising:
      setLed(((millis() / 600UL) % 2UL) == 0UL);
      break;
    case LinkState::Connected:
      break;
    case LinkState::Alarming:
      updateAlarmPattern();
      break;
    case LinkState::Muted:
      setBuzzer(false);
      setLed(((millis() / 1200UL) % 2UL) == 0UL);
      break;
  }
  delay(10);
}
