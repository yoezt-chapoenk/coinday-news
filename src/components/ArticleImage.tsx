'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ArticleImageProps {
  src: string;
  alt: string;
  fallbackSrc: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export default function ArticleImage({ 
  src, 
  alt, 
  fallbackSrc, 
  className = '', 
  fill = false,
  width,
  height,
  priority = false,
  sizes
}: ArticleImageProps) {
  const [imageError, setImageError] = useState(false);

  const imageProps = {
    src: imageError ? fallbackSrc : src,
    alt: alt || '',
    className,
    onError: () => setImageError(true),
    priority,
    ...(fill ? { fill: true, sizes } : { width: width || 800, height: height || 400 })
  };

  return <Image {...imageProps} alt={alt || ''} />;
}