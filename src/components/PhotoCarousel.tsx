import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";
// @ts-expect-error importação correta
import "swiper/css";
// @ts-expect-error importação correta
import "swiper/css/navigation";
// @ts-expect-error importação correta
import "swiper/css/pagination";
// @ts-expect-error importação correta
import "swiper/css/effect-coverflow";

type Props = {
  photos?: Array<{
    preview: string;
    title: string;
  }>;
};


export default function PhotoCarousel({ photos }: Props) {
  const hasPhotos = Array.isArray(photos) && photos.length > 0;

  if (!hasPhotos) {
    return (
      <div className="w-full max-w-sm mx-auto mb-12 rounded-2xl overflow-hidden shadow-xl fade-in">
        <div className="flex items-center justify-center h-96">
          <DotLottieReact
            src="https://lottie.host/abff1569-1ee2-46ad-8f23-838a54e88744/U1zENOKCEN.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mb-12 rounded-2xl overflow-hidden overflow-x-hidden shadow-xl fade-in">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        effect="coverflow"
        coverflowEffect={{
          rotate: 25,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        navigation
        pagination={{ 
          clickable: true,
          // Ajustamos a posição da paginação para não sobrepor os títulos
          dynamicBullets: true,
          dynamicMainBullets: 3
        }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={photos.length > 2}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        className="mySwiper"
        style={{ maxWidth: "100vw" }}
      >
        {photos.map((photo, i) => (
          <SwiperSlide key={i} style={{ width: "min(300px, 90vw)" }}>
            <div className="aspect-[3/4] rounded-xl overflow-hidden relative group">
              <img
                src={photo.preview}
                alt={`Nosso momento ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Overlay com título */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-8">
                <h3 className="text-white text-sm font-medium text-center drop-shadow-md">
                  {photo.title}
                </h3>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}