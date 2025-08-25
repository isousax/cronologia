import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/effect-coverflow";

const imageNames = ["1.jpg", "2.jpg", "3.jpg", "4.jpg"];
const GITHUB_BASE =
  "https://raw.githubusercontent.com/isousax/static-assets/main/projects/our-history/";

export default function PhotoCarousel() {
  return (
    <div className="w-full max-w-md mx-auto mb-12 rounded-2xl overflow-hidden shadow-xl fade-in">
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
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        className="mySwiper"
        style={{ maxWidth: "100vw" }}
      >
        {imageNames.map((name, i) => (
          <SwiperSlide key={i} style={{ width: "min(300px, 90vw)" }}>
            <div className="aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={`${GITHUB_BASE}${name}`}
                alt={`Nosso momento ${i + 1}`}
                className="w-full h-full object-cover"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
