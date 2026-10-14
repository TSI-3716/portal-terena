"use client";

import Image from "next/image";
import * as React from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
};

type HeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  contained?: boolean;
  slides?: HeroSlide[];
};

export function Hero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
  contained = true,
  slides,
}: HeroProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api || !slides || slides.length <= 1) {
      return;
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };

    updateCurrent();

    api.on("select", updateCurrent);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      api.off("select", updateCurrent);
    };
  }, [api, slides]);

  function renderSlide(slide: HeroSlide, index = 0) {
    return (
      <section className="relative overflow-hidden rounded-xl bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-green2 to-brown" />

        {slide.imageSrc ? (
          <Image
            src={slide.imageSrc}
            alt={slide.imageAlt || ""}
            fill
            preload={index === 0}
            sizes="(max-width: 768px) 100vw, 1152px"
            className="object-cover object-center"
          />
        ) : null}

        <div
          className={
            slide.imageSrc
              ? "absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/65 to-primary/20"
              : "absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/20"
          }
        />

        <div className="relative z-10 flex min-h-[260px] max-w-xl flex-col justify-center gap-3 px-6 py-10 text-primary-foreground md:min-h-[280px] md:px-10">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase opacity-90">
            {slide.eyebrow}
          </p>

          <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
            {slide.title}
          </h1>

          <p className="text-base leading-relaxed text-primary-foreground/85">
            {slide.description}
          </p>
        </div>
      </section>
    );
  }

  let content;

  if (slides && slides.length > 0) {
    content = (
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              {renderSlide(slide, index)}
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />

        {/* Indicadores */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir para o slide ${index + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </Carousel>
    );
  } else {
    content = renderSlide({
      eyebrow: eyebrow || "",
      title: title || "",
      description: description || "",
      imageSrc,
      imageAlt,
    });
  }

  if (!contained) {
    return content;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
      {content}
    </div>
  );
}