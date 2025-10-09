"use client";
import { useState, useEffect } from 'react';

export const useMediaQuery = (width) => {
  // 1. Nilai awalnya null, agar tidak langsung render
  const [targetReached, setTargetReached] = useState(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${width}px)`);

    // 2. Fungsi untuk update state
    const handleMediaChange = (event) => {
      setTargetReached(event.matches);
    };

    // 3. Panggil sekali di awal untuk set state awal di client
    handleMediaChange(mediaQuery);

    // 4. Tambahkan listener untuk perubahan
    mediaQuery.addEventListener('change', handleMediaChange);

    // 5. Cleanup listener
    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, [width]);

  return targetReached;
};