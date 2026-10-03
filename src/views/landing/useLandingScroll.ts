import { useEffect, type RefObject } from "react";

// The scroll engine of the DocMind Landing design. Every animated element carries `data-r="start end"` (or
// `"enter start end"`, or four numbers for in-then-out); the engine turns the scroll position of its scene into a
// 0..1 value and writes it to the element as the CSS variable `--t`, which the element's inline styles read.
// `data-scene` marks a scene: "hero", "pin" (a tall section with a sticky stage inside) or "reveal".
//   data-len     scene height in vh (scaled by SCROLL_LENGTH)
//   data-stagger "a b" spreads the ranges of the children across that interval
//   data-ease    "linear" for no easing
//   data-count / data-dec / data-pre / data-suf   count a number up as `--t` grows

const SCROLL_LENGTH = 1; // 0.7 = shorter scenes, 1.4 = longer

interface Item {
  node: HTMLElement;
  enter: boolean;
  v: number[];
  linear: boolean;
  count: number | null;
  dec: number;
  pre: string;
  suf: string;
  last: number;
}

interface Scene {
  el: HTMLElement;
  type: string;
  lp: number;
  le: number;
  items: Item[];
}

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => x * x * (3 - 2 * x);

export function useLandingScroll(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const header = root.querySelector<HTMLElement>("[data-header]");
    const mqReduce = matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = matchMedia("(max-width: 760px)");
    let scenes: Scene[] = [];
    let raf = 0;

    const collect = () => {
      root.querySelectorAll<HTMLElement>("[data-len]").forEach((el) => {
        el.style.height = `${parseFloat(el.dataset.len ?? "0") * SCROLL_LENGTH}vh`;
      });
      root
        .querySelectorAll<HTMLElement>("[data-stagger]")
        .forEach((container) => {
          const [a = 0, b = 1] = (container.dataset.stagger ?? "")
            .split(" ")
            .map(Number);
          const kids = Array.from(container.children) as HTMLElement[];
          const n = kids.length;
          if (!n) return;
          const step = (b - a) / n;
          const width = Math.min(b - a, step * 2.5);
          kids.forEach((kid, i) => {
            const start = a + i * step;
            kid.dataset.r = `${start.toFixed(3)} ${Math.min(b, start + width).toFixed(3)}`;
          });
        });
      scenes = Array.from(
        root.querySelectorAll<HTMLElement>("[data-scene]"),
      ).map((el) => ({
        el,
        type: el.dataset.scene ?? "",
        lp: -1,
        le: -1,
        items: Array.from(el.querySelectorAll<HTMLElement>("[data-r]")).map(
          (node) => {
            const parts = (node.dataset.r ?? "").trim().split(/\s+/);
            const enter = parts[0] === "enter";
            return {
              node,
              enter,
              v: (enter ? parts.slice(1) : parts).map(Number),
              linear: node.dataset.ease === "linear",
              count: node.hasAttribute("data-count")
                ? parseFloat(node.dataset.count ?? "0")
                : null,
              dec: Number(node.dataset.dec ?? 0),
              pre: node.dataset.pre ?? "",
              suf: node.dataset.suf ?? "",
              last: -1,
            };
          },
        ),
      }));
    };

    const update = (force: boolean) => {
      const vh = innerHeight;
      const y = scrollY;
      const reduce = mqReduce.matches;
      const mobile = mqMobile.matches;
      const max = document.documentElement.scrollHeight - vh;
      root.style.setProperty(
        "--pg",
        (max > 0 ? Math.min(1, y / max) : 0).toFixed(4),
      );
      header?.style.setProperty("--hs", y > 8 ? "1" : "0");
      for (const scene of scenes) {
        let p: number;
        let e: number;
        if (reduce) {
          p = 1;
          e = 1;
        } else {
          const r = scene.el.getBoundingClientRect();
          if (r.bottom < -vh || r.top > vh * 2) {
            p = r.top > 0 ? 0 : 1;
            e = p;
          } else if (scene.type === "hero") {
            p = clamp(y / (vh * 0.8));
            e = p;
          } else if (scene.type === "pin" && !mobile) {
            p = clamp(-r.top / Math.max(1, r.height - vh));
            e = clamp((vh - r.top) / vh);
          } else if (scene.type === "pin") {
            p = clamp(
              (vh * 0.85 - r.top) / Math.max(vh * 0.5, r.height * 0.75),
            );
            e = clamp((vh - r.top) / (vh * 0.6));
          } else {
            p = clamp((vh * 0.92 - r.top) / (Math.min(r.height, vh) * 0.7));
            e = p;
          }
        }
        if (!force && p === scene.lp && e === scene.le) continue;
        scene.lp = p;
        scene.le = e;
        for (const item of scene.items) {
          const x = item.enter ? e : p;
          const v = item.v;
          const ease = item.linear ? (z: number) => z : smooth;
          const seg = (a: number, b: number) =>
            a >= b ? (x >= b ? 1 : 0) : ease(clamp((x - a) / (b - a)));
          let t = seg(v[0] ?? 0, v[1] ?? 1);
          if (v.length === 4) t = Math.min(t, 1 - seg(v[2] ?? 0, v[3] ?? 1));
          if (!force && Math.abs(t - item.last) < 0.0005) continue;
          item.last = t;
          item.node.style.setProperty("--t", t.toFixed(4));
          if (item.count !== null && item.node.firstChild) {
            item.node.firstChild.nodeValue =
              item.pre + (item.count * t).toFixed(item.dec) + item.suf;
          }
        }
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update(false);
      });
    };
    const onResize = () => {
      collect();
      update(true);
    };

    mqReduce.addEventListener("change", onResize);
    mqMobile.addEventListener("change", onResize);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    collect();
    update(true);

    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      mqReduce.removeEventListener("change", onResize);
      mqMobile.removeEventListener("change", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootRef]);
}
