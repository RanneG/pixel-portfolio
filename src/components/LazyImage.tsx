import React, { useState, useRef, useEffect } from "react";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string; // Base64 blur placeholder
  webpSrc?: string; // WebP version for better compression
}

/**
 * Lazy-loaded image component with WebP support and blur-up placeholder
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  placeholder,
  webpSrc
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true
  });

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isIntersecting && imgRef.current) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = webpSrc || src;
    }
  }, [isIntersecting, src, webpSrc]);

  return (
    <div ref={imageRef as React.RefObject<HTMLDivElement>} className={`relative ${className}`}>
      {placeholder && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm scale-110"
          style={{
            backgroundImage: `url(${placeholder})`,
            filter: "blur(10px)",
            transform: "scale(1.1)"
          }}
          aria-hidden="true"
        />
      )}
      {isIntersecting && (
        <picture>
          {webpSrc && (
            <source srcSet={webpSrc} type="image/webp" />
          )}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </div>
  );
};

