export type BomItem = {
  item: number;
  reference: string;
  part: string;
  qty: number;
  notes: string;
  price: string;
};

export const BOM: BomItem[] = [
  {
    item: 1,
    reference: "U1",
    part: "ESP32-C3-DevKitM-1",
    qty: 1,
    notes: "内置 BLE 5，USB-C 烧录供电",
    price: "¥18–35",
  },
  {
    item: 2,
    reference: "BZ1",
    part: "有源蜂鸣器 3.3V/5V",
    qty: 1,
    notes: "正极 GPIO4，负极 GND",
    price: "¥1–3",
  },
  {
    item: 3,
    reference: "LED1",
    part: "LED 3mm",
    qty: 1,
    notes: "经 R1 接 GPIO5",
    price: "¥0.2",
  },
  {
    item: 4,
    reference: "R1",
    part: "330Ω 电阻",
    qty: 1,
    notes: "LED 限流",
    price: "¥0.1",
  },
  {
    item: 5,
    reference: "SW1",
    part: "轻触开关 6×6",
    qty: 1,
    notes: "静音键，GPIO6 ↔ GND",
    price: "¥0.5",
  },
  {
    item: 6,
    reference: "BT1",
    part: "3.7V 锂电池（可选）",
    qty: 1,
    notes: "便携供电；也可用 USB",
    price: "¥8–15",
  },
  {
    item: 7,
    reference: "U2",
    part: "TP4056 充电模块（可选）",
    qty: 1,
    notes: "电池充放电保护",
    price: "¥3–6",
  },
];

export const STEPS = [
  {
    title: "焊接 / 接线",
    body: "按原理图连接蜂鸣器、LED、静音键。最小方案只需杜邦线即可验证。",
  },
  {
    title: "烧录固件",
    body: "用 PlatformIO 或 Arduino IDE 打开 firmware/，选择 ESP32-C3 板型后上传。",
  },
  {
    title: "手机连接",
    body: "iPhone 安装 LightBlue 或 nRF Connect，搜索并连接名为 LinkGuard 的设备。",
  },
  {
    title: "测试报警",
    body: "保持连接时板子安静；断开连接或走出蓝牙范围后，蜂鸣器开始间歇报警。按静音键可暂时关闭声音。",
  },
];
