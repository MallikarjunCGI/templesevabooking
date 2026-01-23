import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import HomeSearchSection from '../components/home/HomeSearchSection';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="pb-20 bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="px-4 mb-4 sm:mb-8 pt-6">
                <HeroCarousel />
                {/* Search Box: Partially overlaps Hero on Desktop, follows after on Mobile */}
                <div className="mt-6 sm:-mt-8 relative z-10">
                    <HomeSearchSection />
                </div>
            </section>

            {/* Featured Section */}
            <section className="container mx-auto px-4 max-w-7xl mt-12 sm:mt-16">
                <div className="mb-10 text-center">
                    <h3 className="text-3xl font-bold text-gray-800 mb-2">
                        {t('home.featured_title')}
                    </h3>
                    <p className="text-gray-500 opacity-60 text-sm font-medium uppercase tracking-wide text-[10px] sm:text-xs">
                        {t('home.featured_temple')}
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-2xl sm:text-4xl font-black text-gray-900 mb-4 font-serif leading-tight">
                            {t('home.grace_title')}
                        </h4>
                        <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base opacity-80">
                            {t('home.grace_desc')}
                        </p>
                        <button
                            onClick={() => navigate('/sevas')}
                            className="inline-flex items-center px-6 sm:px-10 py-4 sm:py-5 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 group active:scale-95 text-sm sm:text-base"
                        >
                            {t('home.explore_btn')}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-6 mt-6 md:mt-0">
                        <div className="space-y-3 sm:space-y-6 pt-6 sm:pt-12">
                            <img src="/images/Home-1.jpeg" alt="Temple" className="rounded-2xl sm:rounded-3xl h-32 sm:h-56 w-full object-cover shadow-lg" />
                            <img src="/images/Home-2.jpeg" alt="Devotion" className="rounded-2xl sm:rounded-3xl h-28 sm:h-48 w-full object-cover shadow-lg" />
                        </div>
                        <div className="space-y-3 sm:space-y-6">
                            <img src="/images/Home-3.jpeg" alt="Rituals" className="rounded-2xl sm:rounded-3xl h-28 sm:h-48 w-full object-cover shadow-lg" />
                            <img src="/images/Home-4.jpeg" alt="Grace" className="rounded-2xl sm:rounded-3xl h-32 sm:h-56 w-full object-cover shadow-lg" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
