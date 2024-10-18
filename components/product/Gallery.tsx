import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import ProductImageZoom from "./ProductImageZoom.tsx";
import Icon from "../ui/Icon.tsx";
import Slider from "../ui/Slider.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

const WIDTH = 820;
const HEIGHT = 615;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * @title Product Image Slider
 * @description Creates a three columned grid on destkop, one for the dots preview, one for the image slider and the other for product info
 * On mobile, there's one single column with 3 rows. Note that the orders are different from desktop to mobile, that's why
 * we rearrange each cell with col-start- directives
 */
export default function GallerySlider(props: Props) {
  const id = useId();
  const zoomId = `${id}-zoom`;

  if (!props.page) {
    throw new Error("Missing Product Details Page Info");
  }

  const {
    page: {
      product: { name, isVariantOf, image: pImages, offers },
    },
  } = props;

  const { listPrice } = useOffer(offers);

  // % of Discount
  const percent = listPrice && offers?.lowPrice
    ? Math.round(((listPrice - offers?.lowPrice) / listPrice) * 100)
    : 0;

  // Filter images when image's alt text matches product name
  // More info at: https://community.shopify.com/c/shopify-discussions/i-can-not-add-multiple-pictures-for-my-variants/m-p/2416533
  const groupImages = isVariantOf?.image ?? pImages ?? [];

  const filtered = groupImages.filter((img) =>
    name?.includes(img.alternateName || "")
  );

  const images = filtered.length > 0 ? filtered : groupImages;

  // Função para extrair o ID do vídeo e gerar o embedLink
  function getEmbedLink(videoLink: string) {
    // Extrair o ID do vídeo:
    const videoId = videoLink.split("v=")[1].split("&")[0];

    // Criar o link embeddable:
    if (videoId) {
      const embedLink = `https://www.youtube.com/embed/${videoId}`;
      return embedLink;
    } else {
      return "Vídeo não encontrado"; // Ou retorne um erro se o ID não for encontrado
    }
  }

  return (
    <>
      <div
        id={id}
        class="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-[min-content_1fr] gap-5"
      >
        {/* Image Slider */}
        <div class="col-start-1 col-span-1 sm:col-start-2">
          <div class="relative h-min flex-grow">
            <Slider class="carousel carousel-center gap-6 w-full ">
              {groupImages.map((item, index) => (
                <Slider.Item index={index} class="carousel-item w-full">
                  {percent > 1 && (
                    <div
                      class={clx(
                        "text-[12px] font-bold text-base-200 bg-primary text-center rounded-badge w-[50px] h-[50px] uppercase",
                        "absolute top-2 left-2 flex flex-col items-center justify-center",
                        percent < 1 && "opacity-0",
                      )}
                    >
                      <p>{percent} % off</p>
                    </div>
                  )}
                  {item.encodingFormat === "image" && (
                    <Image
                      class="object-contain w-full"
                      sizes="(max-width: 640px) 100vw, 40vw"
                      style={{ aspectRatio: ASPECT_RATIO }}
                      src={item.url || ""}
                      alt={item.alternateName}
                      width={535}
                      height={535}
                      // Preload LCP image for better web vitals
                      preload={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  )}
                  {item.encodingFormat === "video" && (
                    <div class="flex items-center justify-center w-full lg:h-[535px]">
                      <iframe
                        class="w-full"
                        width="560"
                        height="315"
                        src={getEmbedLink(item.contentUrl || "")}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      >
                      </iframe>
                    </div>
                  )}
                </Slider.Item>
              ))}
            </Slider>

            <Slider.PrevButton
              class="no-animation absolute left-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              disabled
            >
              <Icon id="chevron-right" class="rotate-180" />
            </Slider.PrevButton>

            <Slider.NextButton
              class="no-animation absolute right-2 top-1/2 btn btn-circle btn-outline disabled:invisible"
              disabled={images.length < 2}
            >
              <Icon id="chevron-right" />
            </Slider.NextButton>

            <div class="absolute top-2 right-2 bg-base-100 rounded-full">
              <label
                class="btn btn-ghost btn-circle hidden sm:inline-flex"
                for={zoomId}
              >
                <Icon id="pan_zoom" />
              </label>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div class="col-start-1 col-span-1">
          <ul
            class={clx(
              "carousel carousel-center",
              "sm:carousel-vertical",
              "gap-2",
              "max-w-full max-h-[535px]",
              "overflow-x-auto",
              "sm:overflow-y-auto",
            )}
          >
            {groupImages.map((item, index) => (
              <li class="carousel-item w-[95px] h-[101px] border border-primary   rounded">
                <Slider.Dot index={index}>
                  {item.encodingFormat === "image" && (
                    <>
                      <Image
                        style={{ aspectRatio: "1 / 1" }}
                        class="group-disabled:border-secondary object-cover w-full h-full"
                        width={84}
                        height={84}
                        src={item.url || ""}
                        alt={item.alternateName}
                      />
                    </>
                  )}
                  {item.encodingFormat === "video" && (
                    <div class="flex items-center justify-center">
                      <iframe
                        class="w-full"
                        width="84"
                        height="57"
                        src={getEmbedLink(item.contentUrl || "")}
                        title="YouTube video player"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      >
                      </iframe>
                    </div>
                  )}
                </Slider.Dot>
              </li>
            ))}
          </ul>
        </div>

        <Slider.JS rootId={id} />
      </div>
      <ProductImageZoom
        id={zoomId}
        images={groupImages}
        width={700}
        height={Math.trunc((700 * HEIGHT) / WIDTH)}
      />
    </>
  );
}
