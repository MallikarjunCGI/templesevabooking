import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { useTranslation } from 'react-i18next';

const HeroCarousel = () => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;

    const [slides, setSlides] = useState([]);
    const defaultSlides = [
        {
            id: 1,
            image: '/images/hero-hampi.jpg',
            title: t('home.hero_title_1'),
            subtitle: t('home.hero_subtitle_1'),
            location: t('home.hero_location_1')
        },
        {
            id: 2,
            image: '/images/hero-mysore.jpg',
            title: t('home.hero_title_2'),
            subtitle: t('home.hero_subtitle_2'),
            location: t('home.hero_location_2')
        },
        {
            id: 3,
            image: '/images/hero-udupi.jpg',
            title: t('home.hero_title_3'),
            subtitle: t('home.hero_subtitle_3'),
            location: t('home.hero_location_3')
        }
    ];

    useEffect(() => {
        const fetchHeroSlides = async () => {
            try {
                const { data } = await api.get('/hero');
                if (data && data.length > 0) {
                    setSlides(data);
                } else {
                    setSlides(defaultSlides);
                }
            } catch (error) {
                console.error("Failed to fetch hero slides", error);
                setSlides(defaultSlides);
            }
        };
        fetchHeroSlides();
    }, []);
    return (
        <div className="relative h-[500px] w-full mt-4 rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-7xl group z-0">
            <style>
                {`
                    .swiper-button-next, .swiper-button-prev {
                        color: white !important;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(4px);
                        width: 44px;
                        height: 44px;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    }
                    .swiper-button-next:hover, .swiper-button-prev:hover {
                        background: rgba(234, 88, 12, 0.8); /* Orange-600 */
                        transform: scale(1.1);
                    }
                    .swiper-button-next:after, .swiper-button-prev:after {
                        font-size: 18px !important;
                        font-weight: bold;
                    }
                    .swiper-pagination-bullet {
                        background: white !important;
                        opacity: 0.5;
                        width: 10px;
                        height: 10px;
                    }
                    .swiper-pagination-bullet-active {
                        opacity: 1;
                        background: #ea580c !important; /* Orange-600 */
                        width: 24px;
                        border-radius: 6px;
                    }
                `}
            </style>

            <Swiper
                spaceBetween={0}
                effect={'fade'}
                fadeEffect={{ crossFade: true }}
                centeredSlides={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                className="mySwiper h-full w-full"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            onClick={() => navigate('/sevas')}
                            className="relative h-full w-full cursor-pointer group/slide"
                        >
                            {/* Image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover/slide:scale-105 transition-transform duration-700"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Text Content */}
                            <div className="absolute bottom-20 left-8 md:left-16 text-white max-w-3xl z-10 animate-fade-in-up">
                                <span className="inline-flex items-center px-3 py-1 bg-orange-600 text-xs font-bold tracking-wider uppercase rounded-full mb-6">
                                    <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                                    {currentLang === 'kn' ? (slide.locationKn || slide.locationEn || slide.location) : (slide.locationEn || slide.locationKn || slide.location)}
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold mb-4 font-serif leading-tight drop-shadow-lg group-hover/slide:text-orange-200 transition-colors">
                                    {currentLang === 'kn' ? (slide.titleKn || slide.titleEn || slide.title) : (slide.titleEn || slide.titleKn || slide.title)}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-100 font-light tracking-wide drop-shadow-md">
                                    {currentLang === 'kn' ? (slide.subtitleKn || slide.subtitleEn || slide.subtitle) : (slide.subtitleEn || slide.subtitleKn || slide.subtitle)}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroCarousel;
