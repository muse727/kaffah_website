'use client';

import { useEffect } from 'react';
import AOS from 'aos';

export const AOSInit = () => {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800, // Durasi animasi bisa kita atur di sini
      easing: 'ease-in-out',
    });
  }, []);

  return null;
};