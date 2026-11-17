import Link from "next/link";
import { BoardHero } from "@/components/board-hero";
import { Schematic } from "@/components/schematic";
import { Button } from "@/components/ui/button";
import { BOM, STEPS } from "@/lib/bom";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero — one composition */}
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <BoardHero />
          <div className="absolute inset-0 bg-gradient-to-r from-[#eef6f4]/95 via-[#eef6f4]/78 to-transparent md:from-[#eef6f4]/92 md:via-[#eef6f4]/55" />
        </div>

        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-8 md:px-10">
          <p className="font-display text-xl font-extrabold tracking-tight text-[var(--ink)] md:text-2xl">
            LinkGuard
          </p>
          <nav className="flex gap-5 text-sm font-medium text-[var(--teal-deep)]">
            <a href="#schematic" className="hover:text-[var(--teal)]">
              原理图
            </a>
            <a href="#bom" className="hover:text-[var(--teal)]">
              物料
            </a>
            <a href="#howto" className="hover:text-[var(--teal)]">
              使用
            </a>
          </nav>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pb-20 pt-16 md:min-h-[calc(100svh-5rem)] md:px-10 md:pt-10">
          <p className="rise-in font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-[var(--ink)] sm:text-6xl md:text-7xl lg:text-8xl">
            LinkGuard
          </p>
          <h1 className="rise-in rise-in-delay-1 mt-5 max-w-xl font-display text-2xl font-semibold leading-snug text-[var(--teal-deep)] md:text-3xl">
            手机蓝牙一断，板子立刻报警
          </h1>
          <p className="rise-in rise-in-delay-2 mt-4 max-w-md text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
            与 iPhone 保持 BLE 连接；一旦断开或走出范围，蜂鸣器间歇鸣叫。适合防丢、离位提醒。
          </p>
          <div className="rise-in rise-in-delay-3 mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-[var(--teal-deep)] text-white hover:bg-[var(--teal)]"
            >
              <a href="#schematic">查看原理图</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-[var(--teal)] text-[var(--teal-deep)]"
            >
              <a href="#howto">开始组装</a>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works — one job */}
      <section className="trace-bg border-y border-[var(--border)] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
            工作原理
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
            板子作为 BLE 外设广播；iPhone 用 LightBlue / nRF Connect 连上后保持链路。固件监听断连回调，触发声光报警。
          </p>

          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "建立连接",
                d: "ESP32-C3 广播设备名 LinkGuard，手机 App 连接并保持。",
              },
              {
                n: "02",
                t: "静默监控",
                d: "连接正常时状态灯常亮，蜂鸣器不响。",
              },
              {
                n: "03",
                t: "断连报警",
                d: "手机远离、关闭蓝牙或手动断开 → 间歇蜂鸣；按键可静音。",
              },
            ].map((s) => (
              <li key={s.n}>
                <p className="font-mono-tech text-sm font-semibold text-[var(--copper)]">
                  {s.n}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-[var(--ink)]">
                  {s.t}
                </h3>
                <p className="mt-2 text-[var(--muted-foreground)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Schematic */}
      <section id="schematic" className="scroll-mt-8 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
            电路原理图
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
            核心三路：GPIO4 蜂鸣器、GPIO5 状态灯、GPIO6 静音键。电源可用 USB，或选配锂电 + TP4056。
          </p>
          <div className="mt-10 overflow-hidden rounded-lg border border-[var(--border)] bg-white/70 shadow-[0_20px_50px_-28px_rgba(15,61,68,0.35)]">
            <Schematic />
          </div>
          <p className="mt-4 font-mono-tech text-xs text-[var(--muted-foreground)]">
            完整接线说明见仓库 hardware/WIRING.md
          </p>
        </div>
      </section>

      {/* BOM */}
      <section id="bom" className="scroll-mt-8 border-y border-[var(--border)] bg-white/40 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
            物料清单
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
            最小可用方案约 ¥20–40（开发板 + 蜂鸣器 + LED + 按键）。电池模块可选。
          </p>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--muted-foreground)]">
                  <th className="py-3 pr-4 font-medium">#</th>
                  <th className="py-3 pr-4 font-medium">位号</th>
                  <th className="py-3 pr-4 font-medium">器件</th>
                  <th className="py-3 pr-4 font-medium">数量</th>
                  <th className="py-3 pr-4 font-medium">说明</th>
                  <th className="py-3 font-medium">参考价</th>
                </tr>
              </thead>
              <tbody>
                {BOM.map((row) => (
                  <tr
                    key={row.item}
                    className="border-b border-[var(--border)]/70 text-[var(--ink)]"
                  >
                    <td className="py-3.5 pr-4 font-mono-tech text-xs">
                      {row.item}
                    </td>
                    <td className="py-3.5 pr-4 font-mono-tech font-semibold text-[var(--teal-deep)]">
                      {row.reference}
                    </td>
                    <td className="py-3.5 pr-4 font-medium">{row.part}</td>
                    <td className="py-3.5 pr-4">{row.qty}</td>
                    <td className="py-3.5 pr-4 text-[var(--muted-foreground)]">
                      {row.notes}
                    </td>
                    <td className="py-3.5 font-mono-tech text-xs">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to */}
      <section id="howto" className="scroll-mt-8 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold text-[var(--ink)] md:text-4xl">
            组装与使用
          </h2>
          <p className="mt-3 max-w-2xl text-[var(--muted-foreground)]">
            四步完成：接线 → 烧录 → 手机连接 → 断连测试。iPhone 请用 BLE 调试 App，不要只靠系统蓝牙列表。
          </p>

          <ol className="mt-12 space-y-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-5 md:gap-8">
                <span className="font-display text-3xl font-extrabold text-[var(--teal)]/40 md:text-4xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-[var(--muted-foreground)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 max-w-2xl border-l-2 border-[var(--copper)] bg-[var(--sand)]/60 py-5 pl-5 pr-4">
            <p className="font-display text-lg font-bold text-[var(--copper)]">
              iPhone 连接提示
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--accent-foreground)]">
              苹果系统「设置 → 蓝牙」通常不会列出自定义 GATT 设备。请安装免费的{" "}
              <strong>LightBlue</strong> 或 <strong>nRF Connect</strong>，搜索
              LinkGuard 并 Connect。保持 App 不要强行杀掉；断开连接或远离后板子会报警。
            </p>
          </div>
        </div>
      </section>

      {/* Firmware pin map */}
      <section className="border-t border-[var(--border)] bg-[var(--teal-deep)] py-20 text-[#ecfdf5] md:py-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="font-display text-3xl font-bold md:text-4xl">固件与引脚</h2>
          <p className="mt-3 max-w-2xl text-teal-100/80">
            源码在仓库 <span className="font-mono-tech text-teal-50">firmware/</span>
            ，基于 Arduino + ESP32 BLE。可按需改设备名、报警节奏与引脚。
          </p>

          <div className="mt-10 grid gap-4 font-mono-tech text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["GPIO4", "有源蜂鸣器 +"],
              ["GPIO5", "状态 LED"],
              ["GPIO6", "静音按键"],
              ["GND", "公共地"],
            ].map(([pin, role]) => (
              <div
                key={pin}
                className="border border-teal-400/30 bg-teal-950/30 px-4 py-4"
              >
                <p className="text-teal-200">{pin}</p>
                <p className="mt-1 text-base text-white">{role}</p>
              </div>
            ))}
          </div>

          <pre className="mt-10 overflow-x-auto rounded-md bg-black/25 p-5 text-xs leading-relaxed text-teal-50 md:text-sm">
{`cd firmware
pio run -t upload          # PlatformIO 烧录
pio device monitor -b 115200`}
          </pre>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 text-sm text-[var(--muted-foreground)] md:flex-row md:items-center md:justify-between md:px-10">
          <p className="font-display text-lg font-bold text-[var(--ink)]">LinkGuard</p>
          <p>开源参考设计 · ESP32-C3 BLE 断连报警 · 非量产认证产品</p>
          <Link href="#schematic" className="text-[var(--teal-deep)] hover:underline">
            回到原理图
          </Link>
        </div>
      </footer>
    </main>
  );
}
