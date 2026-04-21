import type { DragEventHandler, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type Props = {
  children: ReactNode;
  onDropToCanvas: DragEventHandler<HTMLDivElement>;
};

export function IPhonePreview(props: Props) {
  const previewWrapRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [timeText, setTimeText] = useState(() => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  });
  const [batteryPercent, setBatteryPercent] = useState<number | null>(null);

  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;

    const phoneW = 390;
    const phoneH = 844;
    const phoneOuterPadding = 10;
    const frameW = phoneW + phoneOuterPadding * 2;
    const frameH = phoneH + phoneOuterPadding * 2;

    const recompute = () => {
      const { width, height } = el.getBoundingClientRect();
      const safeW = Math.max(0, width - 24);
      const safeH = Math.max(0, height - 24);
      const next = Math.min(1, safeW / frameW, safeH / frameH);
      setPreviewScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recompute();
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => recompute())
        : null;
    ro?.observe(el);
    window.addEventListener('resize', recompute);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      setTimeText(`${hh}:${mm}`);
    };
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const navAny = navigator as any;
    if (!navAny?.getBattery) return;

    let battery: any = null;
    const sync = () => {
      if (cancelled || !battery) return;
      const level = typeof battery.level === 'number' ? battery.level : null;
      if (typeof level !== 'number' || !Number.isFinite(level)) {
        setBatteryPercent(null);
        return;
      }
      setBatteryPercent(Math.round(level * 100));
    };

    navAny
      .getBattery()
      .then((b: any) => {
        if (cancelled) return;
        battery = b;
        sync();
        battery.addEventListener?.('levelchange', sync);
        battery.addEventListener?.('chargingchange', sync);
      })
      .catch(() => setBatteryPercent(null));

    return () => {
      cancelled = true;
      battery?.removeEventListener?.('levelchange', sync);
      battery?.removeEventListener?.('chargingchange', sync);
    };
  }, []);

  return (
    <div
      ref={previewWrapRef}
      style={{
        height: '100%',
        padding: 12,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 390,
          height: 844,
          background: '#0b0b0b',
          borderRadius: 56,
          padding: 10,
          boxShadow:
            '0 24px 80px rgba(0,0,0,0.22), 0 10px 30px rgba(0,0,0,0.18)',
          position: 'relative',
          transform: `scale(${previewScale})`,
          transformOrigin: 'top center',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            borderRadius: 46,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* iPhone 状态栏（简化） */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 54,
              padding: '10px 14px 0',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              zIndex: 3,
              pointerEvents: 'none',
              color: '#111',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.2,
            }}
          >
            <div style={{ width: 64, paddingTop: 4 }}>{timeText}</div>
            {/* 灵动岛 */}
            <div
              style={{
                width: 156,
                height: 34,
                background: '#0b0b0b',
                borderRadius: 18,
                opacity: 0.95,
              }}
            />
            <div
              style={{
                width: 64,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 6,
                alignItems: 'center',
                color: '#111',
                height: 34,
                transform: 'translateY(-1px)',
              }}
            >
              {/* Wi‑Fi：一个圆点 + 两段弧 */}
              <span
                style={{
                  position: 'relative',
                  width: 18,
                  height: 12,
                  display: 'inline-block',
                }}
                aria-hidden
              >
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 2,
                    width: 18,
                    height: 18,
                    border: '1.6px solid transparent',
                    borderTopColor: '#111',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 5,
                    width: 12,
                    height: 12,
                    border: '1.6px solid transparent',
                    borderTopColor: '#111',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: 0,
                    width: 3.2,
                    height: 3.2,
                    background: '#111',
                    borderRadius: '50%',
                    transform: 'translateX(-50%)',
                  }}
                />
              </span>
              {typeof batteryPercent === 'number' ? (
                <span style={{ fontSize: 11, lineHeight: '12px' }}>
                  {batteryPercent}%
                </span>
              ) : null}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              inset: 0,
              paddingTop: 54,
              paddingBottom: 0,
              background: '#f2f2f7',
            }}
          >
            <div
              style={{
                height: '100%',
                overflow: 'auto',
                padding: 0,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={props.onDropToCanvas}
            >
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

