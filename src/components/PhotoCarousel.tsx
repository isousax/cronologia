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
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={photos.length > 2}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: "auto",
          },
          1024: {
            slidesPerView: "auto",
          },
        }}
        className="mySwiper"
        style={{ maxWidth: "100%" }}
      >
        {photos.map((photo, i) => (
          <SwiperSlide key={i} style={{ width: "min(300px, 90vw)" }}>
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={photo.preview}
                alt={`Nosso momento ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
