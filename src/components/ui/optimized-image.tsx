
import React, { useState, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { lazyLoadImage, generateSrcSet } from "@/utils/image-optimization";

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number; 
  height?: number;
  priority?: boolean; // Similar to Next.js, for LCP images
  placeholder?: string;
  loadingStrategy?: 'lazy' | 'eager';
  fallbackSrc?: string; // Fallback image on error
  lazyBoundary?: string; // Root margin for lazy loading
  sizes?: string; // Responsive sizes attribute
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder,
  loadingStrategy = 'lazy',
  fallbackSrc = '/placeholder.svg',
  lazyBoundary = '200px',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(priority ? src : placeholder || src);
  
  // Generate srcSet for responsive images
  const srcSet = src ? generateSrcSet(src) : '';
  
  useEffect(() => {
    // Skip if image should be eagerly loaded or is already loaded
    if (priority || loaded) return;
    
    let isMounted = true;
    
    const loadImageAsync = async () => {
      try {
        // Use our utility for loading images with placeholder support
        await lazyLoadImage(src, placeholder);
        
        if (isMounted) {
          setImageSrc(src);
          setLoaded(true);
          onLoad?.();
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load image:', err);
          setError(true);
          setImageSrc(fallbackSrc);
          onError?.();
        }
      }
    };
    
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window && loadingStrategy === 'lazy') {
      const element = document.getElementById(`image-${src}`);
      if (!element) return;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !loaded) {
              loadImageAsync();
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: lazyBoundary }
      );
      
      observer.observe(element);
      
      return () => {
        isMounted = false;
        if (element) observer.unobserve(element);
      };
    } else {
      // Fallback or eager loading
      loadImageAsync();
    }
    
    return () => {
      isMounted = false;
    };
  }, [src, priority, loaded, placeholder, fallbackSrc, lazyBoundary, loadingStrategy, onLoad, onError]);
  
  // Custom aspect ratio placeholder for better CLS
  const aspectRatioStyle = width && height
    ? { aspectRatio: `${width} / ${height}` }
    : {};
  
  return (
    <img
      id={`image-${src}`}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      srcSet={srcSet}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      style={{
        ...aspectRatioStyle,
        opacity: loaded || priority ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }}
      className={cn(
        "transition-opacity",
        !loaded && !priority && "bg-muted/10",
        error && "object-contain bg-muted/20",
        className
      )}
      onLoad={() => {
        setLoaded(true);
        onLoad?.();
      }}
      onError={() => {
        if (!error) {
          setError(true);
          setImageSrc(fallbackSrc);
          onError?.();
        }
      }}
      {...props}
    />
  );
}
