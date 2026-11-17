# LinkGuard — 苹果手机蓝牙断连报警电路

一块基于 **ESP32-C3** 的小型电路：与 iPhone 建立 BLE 连接后，一旦蓝牙断开或超距掉线，板载蜂鸣器立即间歇报警。

## 你能得到什么

| 内容 | 路径 |
|------|------|
| 设计说明网页 | 本仓库前端（`npm run dev`） |
| 固件源码 | `firmware/` |
| 物料清单 | `hardware/bom.csv` |
| 接线说明 | `hardware/WIRING.md` |

## 硬件一览

- **主控**：ESP32-C3 DevKit（内置 BLE 5）
- **报警**：有源蜂鸣器 → GPIO4
- **状态灯**：LED + 330Ω → GPIO5
- **静音键**：轻触开关 → GPIO6 ↔ GND
- **供电**：USB-C，或可选 3.7V 锂电 + TP4056

## 快速开始（固件）

1. 按 `hardware/WIRING.md` 接好蜂鸣器、LED、按键。
2. 安装 [PlatformIO](https://platformio.org/)（或 Arduino IDE + ESP32 板支持包）。
3. 烧录：

```bash
cd firmware
pio run -t upload
pio device monitor -b 115200
```

4. iPhone 安装 **LightBlue** 或 **nRF Connect**，搜索并连接设备名 **`LinkGuard`**。
5. 断开连接或远离手机 → 板子报警；按静音键可暂时关闭声音。

> **注意**：苹果「设置 → 蓝牙」通常不会显示自定义 GATT 设备，请用上述 BLE App 连接。

## 本地打开设计页

```bash
npm install
npm run dev -- -p 3847
```

浏览器访问 `http://127.0.0.1:3847`。

## 工作原理（简述）

1. 固件以 BLE Peripheral 广播，服务 UUID 见 `firmware/src/main.cpp`。
2. 手机 App 建立连接后，板子进入「监控」状态（安静 + LED 常亮）。
3. `onDisconnect` 触发 → 进入报警状态（蜂鸣器 250ms 间歇）。
4. 重新连接后自动恢复安静。

## 许可与声明

本仓库为学习 / 自制参考设计，未做 FCC/SRRC 等射频认证。商用前请自行合规评估。
