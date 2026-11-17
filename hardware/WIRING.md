# LinkGuard 接线说明

## 最小可用接线（USB 供电）

```
ESP32-C3 DevKit
───────────────
GPIO4  ─────►  有源蜂鸣器正极
GND    ─────►  有源蜂鸣器负极

GPIO5  ─────►  330Ω ─────►  LED 正极
GND    ─────►  LED 负极

GPIO6  ─────►  轻触开关 ─────►  GND

USB-C  ─────►  电脑（烧录）或 5V 充电器（日常供电）
```

## 便携电池版（可选）

```
锂电池 + ──► TP4056 BAT+
锂电池 − ──► TP4056 BAT−

TP4056 OUT+ ──► ESP32-C3 5V（或 3V3，视模块输出而定）
TP4056 OUT− ──► ESP32-C3 GND

TP4056 USB  ──► 日常充电口
```

> 注意：多数 ESP32-C3 开发板可直接用 USB 供电。电池方案请确认模块输出电压与板子供电引脚匹配，避免过压。

## 原理要点

1. **MCU**：ESP32-C3 内置 Bluetooth LE，作为外设（Peripheral）广播。
2. **连接**：iPhone 用 LightBlue / nRF Connect 搜索并连接 `LinkGuard`。
3. **断连检测**：固件在 `onDisconnect` 回调里进入报警状态。
4. **报警**：GPIO4 驱动有源蜂鸣器间歇发声；GPIO5 LED 同步闪烁。
5. **静音**：GPIO6 按键边沿触发，可暂时关闭蜂鸣。

## 为什么不用「系统蓝牙设置」直接配对？

苹果系统设置主要展示经典蓝牙 / 特定 Profile 设备。本板是自定义 GATT 外设，请用 **LightBlue** 或 **nRF Connect** 建立连接并保持 App 在后台/前台连接状态。手机远离或手动断开后，板子即报警。
