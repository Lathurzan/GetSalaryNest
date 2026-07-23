"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

export default function CardCarousel({ children }: { children: React.ReactNode[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-4">
          {children.map((child, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_88%] sm:flex-[0_0_60%] lg:flex-[0_0_38%]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* dots */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {children.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to card ${i + 1}`}
            onClick={() => emblaApi?.scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === selected ? "w-6 bg-teal-500" : "w-1.5 bg-neutral-300 dark:bg-neutral-700"
            )}
          />
        ))}
      </div>
    </div>
  );
}