"use client";
import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import styles from "../styles/ProgramUnggulan.module.css";
import { useMediaQuery } from "../hooks/useMediaQuery";

const programUnggulanSMP = [
    {
        title: "Pesantren City",
        description: "Program unggulan yang memadukan pendidikan formal dengan pembinaan karakter dan keagamaan intensif dalam lingkungan modern, membentuk pribadi sholih yang siap menghadapi tantangan global.",
        content: ( <Image src="/images/program/pesantren-city.jpg" layout="fill" className="h-full w-full object-cover" alt="Pesantren City" /> ),
    },
    {
        title: "Tahfizh 3 Juz",
        description: "Siswa dibimbing untuk menghafal minimal 3 Juz Al-Quran selama masa pendidikan, dengan metode yang terstruktur dan didampingi oleh para hafidz/hafidzah yang kompeten.",
        content: ( <div className={styles.contentCard}> <p>Tahfizh 3 Juz</p> </div> ),
    },
    {
        title: "Outdoor Activity",
        description: "Kegiatan belajar di luar ruangan seperti outbound, camping, dan studi alam untuk melatih kemandirian, kerjasama tim, dan kepemimpinan siswa.",
        content: ( <Image src="/images/program/outdoor-activity.jpg" layout="fill" className="h-full w-full object-cover" alt="Outdoor Activity" /> ),
    },
    {
        title: "Public Speaking 3 Bahasa",
        description: "Melatih kepercayaan diri dan kemampuan berkomunikasi siswa dalam tiga bahasa (Indonesia, Arab, dan Inggris) melalui program pidato, presentasi, dan debat.",
        content: ( <div className={styles.contentCard}> <p>Public Speaking 3 Bahasa</p> </div> ),
    },
    {
        title: "Entrepreneur",
        description: "Membekali siswa dengan jiwa kewirausahaan melalui program seperti Market Day, business plan, dan pelatihan keterampilan untuk menciptakan produk kreatif.",
        content: ( <Image src="/images/program/entrepreneur.jpg" layout="fill" className="h-full w-full object-cover" alt="Entrepreneur" /> ),
    },
    {
        title: "Tahsin Al-Quran",
        description: "Program intensif untuk memperbaiki dan memperindah bacaan Al-Quran sesuai dengan kaidah tajwid, memastikan setiap siswa dapat membaca Kitabullah dengan baik dan benar.",
        content: ( <div className={styles.contentCard}> <p>Tahsin Al-Quran</p> </div> ),
    },
];

// --- KITA BUAT KOMPONEN UNTUK SETIAP LAYOUT ---

const DesktopLayout = () => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const cardLength = programUnggulanSMP.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const newActiveCard = Math.floor(latest * cardLength);
    const clampedIndex = Math.min(newActiveCard, cardLength - 1);
    if (clampedIndex !== activeCard) {
      setActiveCard(clampedIndex);
    }
  });

  return (
    <div className={styles.mainWrapper}>
      <div className={styles.leftColumn} ref={ref}>
        {programUnggulanSMP.map((program) => (
          <div key={program.title} className={styles.textItem}>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
          </div>
        ))}
      </div>
      <div className={styles.rightColumn}>
        {programUnggulanSMP.map((program, index) => (
          <motion.div
            key={program.title + "-image"}
            className={styles.imageCard}
            animate={{ opacity: activeCard === index ? 1 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {program.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const MobileLayout = () => (
  <div className={styles.mobileWrapper}>
    {programUnggulanSMP.map((program) => (
      <div key={program.title} className={styles.mobileItem} data-aos="fade-up">
        <div className={styles.mobileImageWrapper}>
          {program.content}
        </div>
        <div className={styles.mobileTextWrapper}>
          <h3>{program.title}</h3>
          <p>{program.description}</p>
        </div>
      </div>
    ))}
  </div>
);


const ProgramUnggulan = () => {
  const isMobile = useMediaQuery(992);

  if (isMobile === null) {
    return null; // Atau tampilkan skeleton/loading
  }

  return (
    <section className={styles.programSection}>
      <div className={`${styles.header} container`} data-aos="fade-up">
        <span className={styles.subtitle}>SMPIT Al Mubarak</span>
        <h2 className={styles.title}>Program Unggulan SMPIT</h2>
      </div>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </section>
  );
};

export default ProgramUnggulan;