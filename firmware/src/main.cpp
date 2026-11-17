/**
 * LinkGuard — 苹果手机 BLE 断连声光报警
 *
 * 工作流程：
 * 1. 上电后广播 BLE，设备名 "LinkGuard"
 * 2. 用 iPhone 的 LightBlue / nRF Connect 连接该设备
 * 3. 保持连接期间安静（状态灯常亮）
 * 4. 蓝牙断开或超距掉线 → 蜂鸣器间歇报警
 * 5. 按静音键可暂时静音；重新连上后自动解除报警
 *
 * 引脚（ESP32-C3 DevKit）：
 *   GPIO4  → 有源蜂鸣器正极（负极接 GND）
 *   GPIO5  → 状态 LED（经 330Ω 到 GND）
 *   GPIO6  → 静音按键（一端 GPIO6，一端 GND，内部上拉）
 */

#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// ---------- 引脚 ----------
static const int PIN_BUZZER = 4;
static const int PIN_LED = 5;
static const int PIN_MUTE = 6;

// ---------- BLE ----------
static const char *DEVICE_NAME = "LinkGuard";
// 自定义 GATT：手机 App 连上即可，不必读写特征值
#define SERVICE_UUID        "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
#define CHAR_STATUS_UUID    "6e400003-b5a3-f393-e0a9-e50e24dcca9e"

enum class LinkState : uint8_t {
  Advertising,  // 等待手机连接
  Connected,    // 已连接，监控中
  Alarming,     // 已断连，正在报警
  Muted,        // 用户静音，仍等待重连
};

static volatile bool g_connected = false;
static volatile bool g_justDisconnected = false;
static LinkState g_state = LinkState::Advertising;
static unsigned long g_alarmPhaseMs = 0;
static bool g_buzzerOn = false;
static bool g_lastMute = true;
static unsigned long g_lastMuteChangeMs = 0;

BLECharacteristic *g_statusChar = nullptr;

class ServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer * /*server*/) override {
    g_connected = true;
    g_justDisconnected = false;
  }

  void onDisconnect(BLEServer *server) override {
    g_connected = false;
    g_justDisconnected = true;
    // 重新开始广播，便于再次连接
    server->getAdvertising()->start();
  }
};

void setBuzzer(bool on) {
  digitalWrite(PIN_BUZZER, on ? HIGH : LOW);
  g_buzzerOn = on;
}

void setLed(bool on) { digitalWrite(PIN_LED, on ? HIGH : LOW); }

void publishStatus(const char *text) {
  if (g_statusChar == nullptr) return;
  g_statusChar->setValue(text);
  g_statusChar->notify();
}

void enterState(LinkState next) {
  if (g_state == next) return;
  g_state = next;
  g_alarmPhaseMs = millis();
  setBuzzer(false);

  switch (next) {
    case LinkState::Advertising:
      setLed(false);
      Serial.println("[LinkGuard] 等待连接…");
      break;
    case LinkState::Connected:
      setLed(true);
      publishStatus("connected");
      Serial.println("[LinkGuard] 已连接，监控中");
      break;
    case LinkState::Alarming:
      publishStatus("alarm");
      Serial.println("[LinkGuard] 蓝牙断开 — 报警！");
      break;
    case LinkState::Muted:
      setLed(false);
      publishStatus("muted");
      Serial.println("[LinkGuard] 已静音，仍等待重连");
      break;
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
  // iPhone 对可连接外设更友好
  adv->setMinPreferred(0x06);
  adv->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("[LinkGuard] BLE 广播已开启，设备名: LinkGuard");
}

bool mutePressedEdge() {
  const bool level = digitalRead(PIN_MUTE);  // INPUT_PULLUP：按下 = LOW
  const unsigned long now = millis();
  if (level != g_lastMute && (now - g_lastMuteChangeMs) > 40) {
    g_lastMute = level;
    g_lastMuteChangeMs = now;
    if (level == LOW) return true;  // 按下边沿
  }
  return false;
}

void updateAlarmPattern() {
  // 250ms 开 / 250ms 关，尖锐间歇声
  const unsigned long phase = (millis() - g_alarmPhaseMs) % 500UL;
  const bool shouldOn = phase < 250UL;
  if (shouldOn != g_buzzerOn) setBuzzer(shouldOn);

  // LED 与蜂鸣同步闪烁
  setLed(shouldOn);
}

void blinkAdvertising() {
  // 慢闪：表示在等连接
  const bool on = ((millis() / 600UL) % 2UL) == 0UL;
  setLed(on);
}

void setup() {
  Serial.begin(115200);
  delay(200);

  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_MUTE, INPUT_PULLUP);
  setBuzzer(false);
  setLed(false);

  Serial.println();
  Serial.println("==============================");
  Serial.println(" LinkGuard BLE Disconnect Alarm");
  Serial.println("==============================");

  setupBle();
  enterState(LinkState::Advertising);
}

void loop() {
  if (g_connected) {
    if (g_state != LinkState::Connected) {
      enterState(LinkState::Connected);
    }
  } else if (g_justDisconnected) {
    g_justDisconnected = false;
    enterState(LinkState::Alarming);
  }

  if (mutePressedEdge()) {
    if (g_state == LinkState::Alarming) {
      enterState(LinkState::Muted);
    } else if (g_state == LinkState::Muted) {
      // 再按一次恢复报警（仍未连接时）
      enterState(LinkState::Alarming);
    }
  }

  switch (g_state) {
    case LinkState::Advertising:
      blinkAdvertising();
      break;
    case LinkState::Connected:
      // 保持安静，灯常亮
      break;
    case LinkState::Alarming:
      updateAlarmPattern();
      break;
    case LinkState::Muted:
      setBuzzer(false);
      // 极慢闪提示仍未连接
      setLed(((millis() / 1200UL) % 2UL) == 0UL);
      break;
  }

  delay(10);
}
