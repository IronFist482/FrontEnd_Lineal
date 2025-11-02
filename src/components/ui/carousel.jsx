"use client";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cva } from "class-variance-authority";
import '../../styles/carousel.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

const buttonVariants = cva(
  "btn-base",
  {
    variants: {
      variant: {
        default: "btn-default",
        outline: "btn-outline",
      },
      size: {
        default: "btn-default-size",
        icon: "btn-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, children, disabled, onClick, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

const carouselContentVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        horizontal: "carousel-content-horizontal",
        vertical: "carousel-content-vertical",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const carouselItemVariants = cva(
  "carousel-item-base",
  {
    variants: {
      orientation: {
        horizontal: "carousel-item-horizontal",
        vertical: "carousel-item-vertical",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const carouselPreviousVariants = cva(
  "carousel-nav-button",
  {
    variants: {
      orientation: {
        horizontal: "carousel-prev-horizontal",
        vertical: "carousel-prev-vertical",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

const carouselNextVariants = cva(
  "carousel-nav-button",
  {
    variants: {
      orientation: {
        horizontal: "carousel-next-horizontal",
        vertical: "carousel-next-vertical",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const onSelect = React.useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);
  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);
  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );
  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);
  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);
  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          carouselContentVariants({ orientation }),
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        carouselItemVariants({ orientation }),
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        carouselPreviousVariants({ orientation }),
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="size-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        carouselNextVariants({ orientation }),
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="size-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
