import type { ImageWidget } from "apps/admin/widgets.ts";
import Slider from "../components/ui/Slider.tsx";
import { clx } from "../sdk/clx.ts";
import { useId } from "../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";
import { useSendEvent } from "../sdk/useSendEvent.ts";

/**
 * @titleBy alt
 */
export interface Banner {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 364px, altura: 417px) */
  desktop: ImageWidget;

  /** @description Descrição de acessibilidade e SEO */
  alt: string;

  /** @description Link */
  href: string;
}

export interface Props {
  images?: Banner[];

  /**
   * @title Tempo do intervalo de autoplay
   * @description tempo em segundos para a rolagem automática das imagens
   */
  interval?: number;
}

function BannerItem({ image, lcp }: { image: Banner; lcp?: boolean }) {
  const { alt, desktop, href } = image;
  const params = { promotion_name: image.alt };

  const selectPromotionEvent = useSendEvent({
    on: "click",
    event: { name: "select_promotion", params },
  });

  const viewPromotionEvent = useSendEvent({
    on: "view",
    event: { name: "view_promotion", params },
  });
  return (
    <a
      {...selectPromotionEvent}
      href={href ?? "#"}
      class="relative block overflow-y-hidden md:w-full mx-auto w-screen mt-8 lg:mt-0"
    >
      <Image
        preload={lcp}
        {...viewPromotionEvent}
        loading="eager"
        fetchPriority="high"
        src={desktop}
        width={364}
        height={417}
        class="object-cover w-11/12 h-11/12 md:w-[364px] md:h-[417px] mx-auto"
        alt={alt}
      />
    </a>
  );
}

function Carousel({ images = [], interval }: Props) {
  const id = useId();

  return (
    <>
      {/* dispositivos mobile */}
      <div id={id} class="w-screen mx-auto lg:hidden ">
        <div class="">
          <Slider class="carousel carousel-center w-full ">
            {images.map((image, index) => (
              <Slider.Item index={index} class="carousel-item w-full ">
                <BannerItem image={image} />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <ul class={clx("z-10", "carousel flex justify-center gap-3")}>
          {images.map((_, index) => (
            <li class="carousel-item">
              <Slider.Dot
                index={index}
                class={clx(
                  "bg-primary h-2 w-2 no-animation rounded-full",
                  "disabled:w-8 disabled:bg-neutral disabled:opacity-100 transition-[width]",
                )}
              >
              </Slider.Dot>
            </li>
          ))}
        </ul>

        <Slider.JS rootId={id} interval={interval && interval * 1e3} infinite />
      </div>

      {/* desktop */}
      <div class="hidden lg:flex lg:max-w-[1140px] lg:mx-auto lg:justify-between  lg:gap-2 ">
        {images.map((item) => <BannerItem image={item} />)}
      </div>
    </>
  );
}

export default Carousel;
