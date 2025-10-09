'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import styles from '../styles/Testimonial.module.css';

// SIAPKAN DATA TESTIMONI DI SINI
// DATA TESTIMONI DENGAN LINK VIMEO BARU
const testimonialsData = [
  {
    // --- DATA TESTIMONI 1 ---
    name: 'Orang Tua Siswi SMPIT', // Ganti dengan nama yang sesuai
    title: 'Wali Murid Angkatan Pertama', // Ganti dengan title yang sesuai
    quote: '"Alhamdulillah, putri kami mendapatkan lingkungan belajar yang sangat mendukung di SMPIT Al Mubarak. Guru-gurunya peduli dan fasilitasnya lengkap."', // Ganti dengan kutipan testimoni
    thumbnail: '/testimonial-photo-1.png', // Ganti dengan path thumbnail kamu
    avatar: '/author-avatar-1.png',      // Ganti dengan path avatar kamu
    videoUrl: 'https://player.vimeo.com/video/1123886147?autoplay=1&title=0&byline=0&portrait=0'
  },
  {
    // --- DATA TESTIMONI 2 ---
    name: 'H. Ismail, S.Pd., M.H', // Ganti dengan nama yang sesuai
    title: 'Anggota Komisi B DPRD DKI Jakarta Wali Murid SMPIT Al Mubarak', // Ganti dengan title yang sesuai
    quote: '"Kurikulum di Al Mubarak sangat seimbang antara pendidikan agama dan umum. Anak saya senang sekolah di sini dan perkembangan akhlaknya sangat terlihat."', // Ganti dengan kutipan testimoni
    thumbnail: '/testimonial-photo-2.png', // Ganti dengan path thumbnail kamu
    avatar: '/author-avatar-2.jpeg',      // Ganti dengan path avatar kamu
    videoUrl: 'https://player.vimeo.com/video/1123887901?autoplay=1&title=0&byline=0&portrait=0'
  },
  {
    // --- DATA TESTIMONI 3 ---
    name: 'Muhammad Nurohman', // Ganti dengan nama yang sesuai
    title: 'Drummer Band Ungu Wali Murid SMPIT Al Mubarak', // Ganti dengan title yang sesuai
    quote: '"Sebagai angkatan pertama, kami melihat langsung komitmen yayasan dalam memberikan yang terbaik. Kami bangga menjadi bagian dari keluarga besar Al Mubarak."', // Ganti dengan kutipan testimoni
    thumbnail: '/testimonial-photo-3.png', // Ganti dengan path thumbnail kamu
    avatar: '/author-avatar-3.jpg',      // Ganti dengan path avatar kamu
    videoUrl: 'https://player.vimeo.com/video/1123888522?autoplay=1&title=0&byline=0&portrait=0'
  },
];

const Testimonial = () => {
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);

  return (
    <>
      <section className={styles.section} id="testimonial">
        <div className="container">
          <div className={styles.header} data-aos="fade-up">
            <span className={styles.subTitle}>TESTIMONI</span>
            <h2 className={styles.title}>
              Pengalaman Nyata, Hasil Terbukti: Apa Kata Orang Tua Murid Kami?
            </h2>
            <p className={styles.description}>
              Temukan cerita-cerita inspiratif dari para wali murid mengenai perkembangan anak-anak mereka dan kualitas pendidikan di Yayasan Al Mubarak.
            </p>
          </div>

          <div className={styles.sliderWrapper} data-aos="fade-up" data-aos-delay="200">
            <Swiper
              modules={[Navigation]}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              loop={true}
              spaceBetween={30}
              slidesPerView={1}
              className={styles.swiper}
            >
              {testimonialsData.map((testimonial, index) => (
                <SwiperSlide key={index}>
                  <div className={styles.mainBlock}>
                    <div className={styles.videoThumbnail} onClick={() => setActiveVideoUrl(testimonial.videoUrl)}>
                      <Image src={testimonial.thumbnail} alt="Testimonial Thumbnail" fill sizes="40vw" style={{ objectFit: 'cover' }} />
                      <div className={styles.playButton}><Image src="/icons/play-icon.svg" alt="Play Video" width={80} height={80} /></div>
                    </div>
                    <div className={styles.quoteContent}>
                      <div className={styles.quoteIcon}><Image src="/icons/quote-icon.svg" alt="Quote" width={40} height={40} /></div>
                      <p className={styles.quoteText}>{testimonial.quote}</p>
                      <div className={styles.authorInfo}>
                        <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} style={{ borderRadius: '50%' }} />
                        <div className={styles.authorDetails}>
                          <span className={styles.authorName}>{testimonial.name}</span>
                          <span className={styles.authorTitle}>{testimonial.title}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Tombol Navigasi Custom */}
            <div className="swiper-button-prev-custom"><Image src="/icons/arrow-left.svg" alt="Previous" width={24} height={24} /></div>
            <div className="swiper-button-next-custom"><Image src="/icons/arrow-right.svg" alt="Next" width={24} height={24} /></div>
          </div>
        </div>
      </section>

      {/* MODAL VIDEO (Tidak berubah) */}
      {activeVideoUrl && (
        <div className={styles.modalOverlay} onClick={() => setActiveVideoUrl(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setActiveVideoUrl(null)}>×</button>
            <div className={styles.videoPlayer}>
              <iframe src={activeVideoUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Testimonial;