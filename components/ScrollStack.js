'use client';

import { useLayoutEffect, useRef, useCallback, useState } from 'react';
import Lenis from 'lenis';
import styles from '../styles/ScrollStack.module.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`${styles['scroll-stack-card']} ${itemClassName}`.trim()}>
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemStackDistance = 25,
  stackPosition = '25%',
  baseScale = 0.85,
  itemScale = 0.04,
  rotationAmount = 0.3,
  blurAmount = 0.5,
  onStackComplete,
  height = '70vh',
}) => {
  const scrollerRef = useRef(null);
  const containerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const scroller = scrollerRef.current;
    const scrollTop = scroller.scrollTop;
    const containerHeight = scroller.clientHeight;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);

    let allCardsStacked = true;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = card.offsetTop;
      
      // PERBAIKAN: Reverse index untuk stacking order yang benar
      // Kartu pertama (i=0) -> paling BOTTOM dalam tumpukan
      // Kartu terakhir -> paling TOP dalam tumpukan
      const reverseIndex = cardsRef.current.length - 1 - i;
      
      const stackStart = cardTop - stackPositionPx - (itemStackDistance * reverseIndex);
      
      // Hitung progress berdasarkan scroll position
      let progress = 0;
      if (scrollTop >= stackStart) {
        progress = Math.min(1, (scrollTop - stackStart) / 500);
      }

      // Scale: kartu di bawah (reverseIndex kecil) lebih kecil
      const targetScale = Math.min(0.95, baseScale + (reverseIndex * itemScale));
      const scale = 1 - (progress * (1 - targetScale));
      
      // Rotation
      const rotation = rotationAmount ? (reverseIndex * rotationAmount * progress) : 0;

      // Blur effect
      let blur = 0;
      if (blurAmount && reverseIndex > 0) {
        blur = reverseIndex * blurAmount * progress;
      }

      // TranslateY untuk efek stacking
      let translateY = 0;
      if (scrollTop >= stackStart) {
        translateY = scrollTop - cardTop + stackPositionPx + (itemStackDistance * reverseIndex);
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : 'none';

        card.style.transform = transform;
        card.style.filter = filter;
        
        // PERBAIKAN: Z-index yang benar - kartu terakhir (paling atas) z-index tertinggi
        card.style.zIndex = i + 1;

        lastTransformsRef.current.set(i, newTransform);
      }

      // Cek apakah kartu ini sudah stacked
      if (scrollTop < stackStart) {
        allCardsStacked = false;
      }
    });

    // Trigger callback ketika semua kartu stacked
    if (allCardsStacked && !stackCompletedRef.current) {
      stackCompletedRef.current = true;
      onStackComplete?.();
    }

    isUpdatingRef.current = false;
  }, [
    itemStackDistance,
    stackPosition,
    baseScale,
    itemScale,
    rotationAmount,
    blurAmount,
    parsePercentage,
    onStackComplete,
  ]);

  const handleScroll = useCallback(() => {
    if (!isUpdatingRef.current) {
      updateCardTransforms();
    }
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const lenis = new Lenis({
      wrapper: scroller,
      content: scroller.querySelector(`.${styles['scroll-stack-inner']}`),
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
    });

    lenis.on('scroll', handleScroll);
    
    const raf = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    
    lenisRef.current = lenis;
  }, [handleScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll(`.${styles['scroll-stack-card']}`));
    cardsRef.current = cards;
    lastTransformsRef.current.clear();

    // Setup initial styles untuk setiap kartu
    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.position = 'relative';
      card.style.zIndex = i + 1; // Initial z-index
    });

    setupLenis();
    
    // Initial update
    setTimeout(() => {
      updateCardTransforms();
    }, 100);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, setupLenis, updateCardTransforms]);

  return (
    <div 
      className={styles['scroll-stack-container']}
      style={{ height }}
      ref={containerRef}
    >
      <div
        className={`${styles['scroll-stack-scroller']} ${className}`.trim()}
        ref={scrollerRef}
      >
        <div className={styles['scroll-stack-inner']}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollStack;