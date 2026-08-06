You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
```tsx
scroll-image-tunnel.tsx
"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

export interface ScrollImageTunnelImage {
  /** Image URL. */
  src: string;
  /** Alt text. */
  alt: string;
}

export interface ScrollImageTunnelProps {
  /** Photos shown in sequence, one per scroll segment. */
  images: ScrollImageTunnelImage[];
  /** Hint shown above the pinned stage before the user starts scrolling. */
  hint?: React.ReactNode;
  /** Scroll distance dedicated to each photo (taller = slower reveal). Default `"200vh"`. */
  stepHeight?: string;
  /**
   * Scrollable ancestor to track instead of the page — pass this when pinning
   * inside a bounded panel (e.g. a preview container) rather than the window.
   */
  container?: React.RefObject<HTMLElement | null>;
  className?: string;
}

function TunnelFrame({
  src,
  alt,
  index,
  total,
  progress,
}: {
  src: string;
  alt: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const local = useTransform(
    progress,
    [index / total, (index + 1) / total],
    [0, 1],
  );
  // Each photo starts as a small point in the middle of the frame and scales
  // up until it fully covers it. Never blurred: it starts punchy — oversaturated,
  // overcontrasted, "unclear" the way an overdeveloped print is unclear — and
  // settles into the true, correctly graded image as it finishes growing.
  // Opacity stays at 0 until its own turn begins, so frames waiting their
  // turn stay fully hidden instead of lingering as a stray speck.
  const scale = useTransform(local, [0, 0.8], [0.05, 1]);
  const y = useTransform(local, [0, 0.75], [40, 0]);
  const opacity = useTransform(local, [0, 0.03, 1], [0, 1, 1]);
  const contrast = useTransform(local, [0, 0.7], [2.2, 1]);
  const saturate = useTransform(local, [0, 0.7], [2.6, 1]);
  const filter = useMotionTemplate`contrast(${contrast}) saturate(${saturate})`;

  return (
    <div
      style={{ zIndex: index }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {/* Flexbox handles centering so it never fights with the scale/y
          transform below — motion owns the transform property once a
          motion value drives it, so a translate-based centering class on
          the same element would get silently clobbered. */}
      <motion.div
        style={{ scale, y, opacity, filter }}
        className="h-[70%] w-full max-w-xl overflow-hidden"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
}

export function ScrollImageTunnel({
  images,
  hint = "Scroll down to reveal the images",
  stepHeight = "200vh",
  container,
  className,
}: ScrollImageTunnelProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);

  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const el = containerRef.current;
    if (!el) return;
    const containerEl = container?.current ?? null;
    const win = el.ownerDocument.defaultView ?? window;
    const target: HTMLElement | Window = containerEl ?? win;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewport = containerEl ? containerEl.clientHeight : win.innerHeight;
      const top = containerEl
        ? rect.top - containerEl.getBoundingClientRect().top
        : rect.top;
      const denom = rect.height - viewport || 1;
      progress.set(Math.min(1, Math.max(0, -top / denom)));
    };
    const onScroll = () => {
      if (!raf) raf = win.requestAnimationFrame(update);
    };

    update();
    target.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onScroll);
    const ro = containerEl ? new ResizeObserver(onScroll) : null;
    if (containerEl && ro) ro.observe(containerEl);

    return () => {
      target.removeEventListener("scroll", onScroll);
      win.removeEventListener("resize", onScroll);
      ro?.disconnect();
      if (raf) win.cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion, progress, container]);

  if (prefersReducedMotion) {
    return (
      <div className={cn("grid gap-4 bg-muted p-6", className)}>
        {images.map((image) => (
          <div
            key={image.src}
            className="mx-auto aspect-[3/4] w-full max-w-xl overflow-hidden bg-background"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-clip", className)}>
      <div className="my-20 grid content-start justify-items-center gap-6 text-center">
        <span className="relative text-xs uppercase leading-tight text-muted-foreground after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-transparent after:to-muted-foreground/40 after:content-['']">
          {hint}
        </span>
      </div>

      <div
        ref={containerRef}
        style={{ height: `calc(${images.length} * ${stepHeight})` }}
        className="w-full"
      >
        <section className="sticky top-0 h-screen w-full overflow-hidden bg-background">
          {images.map((image, index) => (
            <TunnelFrame
              key={image.src}
              src={image.src}
              alt={image.alt}
              index={index}
              total={images.length}
              progress={progress}
            />
          ))}
        </section>
      </div>
    </div>
  );
}

export default ScrollImageTunnel;


demo.tsx
"use client";

import { useRef } from "react";

import { ScrollImageTunnel } from "@/components/ui/scroll-image-tunnel";

const IMAGES = [
  {
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/767d99bb371a54d0d36751e8cecae43c.jpg",
    alt: "Surreal illustration of a diver silhouetted inside a sunset seascape shaped like a profile",
  },
  {
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/821d815affa6496c39cbdeeec7a84603.jpg",
    alt: "Double-exposure portrait of a profile blended with a city skyline at dusk",
  },
  {
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/937438c560ada1c83317f2c11b3454b0.jpg",
    alt: "Motion-blurred side-profile portrait against a deep orange backdrop",
  },
  {
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/98f89cb9994f5c382ab964062c4039db.jpg",
    alt: "Illustration of a figure holding a racket that dissolves into a swirling colorful cloud at dusk",
  },
  {
    src: "https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/stock-images/ddcbee38be8b7274e19e132d7ab35b53.jpg",
    alt: "Black-and-white photo of a hand gesture with a colorful cutout of a bird flying through the fingers",
  },
];

export default function DemoOne() {
  const containerRef = useRef<HTMLDivElement>(null);
 
  return (
    <div
      ref={containerRef}
      data-scroll-image-tunnel-demo
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden"
      style={{ scrollbarWidth: "none" }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `[data-scroll-image-tunnel-demo]::-webkit-scrollbar{display:none}`,
        }}
      />
      <ScrollImageTunnel
        images={IMAGES}
        container={containerRef}
        stepHeight="150vh"
      />
    </div>
  );
}

```

Install NPM dependencies:
```bash
framer-motion
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
