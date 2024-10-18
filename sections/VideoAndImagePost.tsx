import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Icon from "../components/ui/Icon.tsx";
import Slider from "../components/ui/Slider.tsx";
import { useId } from "../sdk/useId.ts";
import IframeLoader from "../islands/ytOtimization.tsx";

/** @titleby titleNews */
export interface GroupNews {
  titleNews?: string;
  subtitleNews?: string;
  image?: {
    src: ImageWidget;
    alt?: string;
  };
  video?: string;
  post?: HTMLWidget;
}

export interface Props {
  title?: string;
  news: GroupNews[];
  layout?: {
    variation?: "Grid" | "Slider";
  };
  // dots?: boolean;
  // /**
  //  * @title Autoplay interval
  //  * @description time (in seconds) to start the carousel autoplay
  //  */
  // interval?: number;
}

const DEFAULT_PROPS: Props = {
  title: "NOTÍCIAS DO GRUPO",
  news: [
    {
      titleNews: "TÍTULO: XXXXXXXX",
      subtitleNews: "XXXXXXXXXXXXXXX",
      image: {
        src:
          "",
        alt: "",
      },
      video: "",
      post:
        "Lorem ipsum dolor sit amet consectetur. Non arcu nisl posuere eget proin maecenas ante quisque risus. Ut lorem penatibus lectus venenatis integer. Volutpat id habitasse duis phasellus pulvinar purus. Non arcu nisl posuere eget proin maecenas ante quisque risus. Ut lorem penatibus lectus venenatis integer. Volutpat id habitasse duis phasellus pulvinar purus.",
    },
    {
      titleNews: "TÍTULO: XXXXXXXX",
      subtitleNews: "XXXXXXXXXXXXXXX",
      image: {
        src:
          "",
        alt: "",
      },
      video: "",
      post:
        " ",
    },
    {
      titleNews: "TÍTULO: XXXXXXXX",
      subtitleNews: "XXXXXXXXXXXXXXX",
      image: {
        src: "",
        alt: "",
      },
      video: "",
      post:
        ""
    }
  ],
  layout: {
    variation: "Grid",
  },
};

const NewsPost = ({
  video,
  image,
  titleNews,
  post,
  subtitleNews,
}: GroupNews) => (
  <div class="flex flex-col items-center gap-9 text-center">
    <div class="flex flex-col items-center">
      <div class="sm:w-[351px] sm:h-[218px] w-[316px] h-[217px] rounded-xl flex items-center justify-center border border-accent">
        {image
          ? (
            <Image
              src={image.src}
              alt={image?.alt || titleNews}
              width={316}
              height={217}
              class="rounded-xl object-cover"
            />
          )
          : (
            <div class="">
              <IframeLoader
                videoLink={video || ""}
                preload={false}
                width={316}
                height={178}
              />
            </div>
          )}
      </div>
      <div class="flex flex-col text-primary w-[316px]">
        <h3 class="text-2xl font-semibold text-center py-[28px]">
          {titleNews}
        </h3>
        <p class="text-base lg:text-2xl pb-[18px]  ">{subtitleNews}</p>
        <p class="text-[12px] h-[92px] overflow-y-auto">{post}</p>
      </div>
    </div>
  </div>
);

export default function NewsPosts(props: Props) {
  const id = useId();
  const { title, news, layout } = {
    ...DEFAULT_PROPS,
    ...props,
  };

  return (
    <div class="w-full container px-4 py-8 flex flex-col gap-[104px] lg:gap-20 lg:py-10 lg:px-0 lg:w-[1300px]">
      <h2 class="font-bold text-2xl text-center text-primary">{title}</h2>
      {layout?.variation === "Grid" && (
        <div class="flex flex-col lg:flex-row flex-wrap gap-10 md:max-h-[940px] max-h-[450px] overflow-x-auto">
          {news?.map(({ video, image, titleNews, post, subtitleNews }) => (
            <NewsPost
              key={titleNews} // Add a unique key for each NewsPost
              image={image}
              titleNews={titleNews}
              post={post}
              subtitleNews={subtitleNews}
              video={video}
            />
          ))}
        </div>
      )}
      {layout?.variation !== "Grid" && (
        <div class="relative w-full px-8" id={id}>
          <Slider class="carousel carousel-start gap-4 lg:gap-8 w-full mx-auto">
            {news?.map(
              ({ video, image, titleNews, post, subtitleNews }, index) => (
                <Slider.Item
                  key={titleNews}
                  index={index}
                  class="flex flex-col gap-4 carousel-item"
                >
                  <NewsPost
                    image={image}
                    titleNews={titleNews}
                    post={post}
                    subtitleNews={subtitleNews}
                    video={video}
                  />
                </Slider.Item>
              ),
            )}
          </Slider>
          <>
            <div class="hidden md:flex z-10 absolute -left-2 lg:-left-8 top-1/2">
              <Slider.PrevButton class="btn btn-circle btn-outline btn-primary">
                <Icon
                  size={24}
                  id="chevron-right"
                  strokeWidth={3}
                  class="rotate-180"
                />
              </Slider.PrevButton>
            </div>
            <div class="hidden md:flex z-10 absolute -right-2 lg:-right-8 top-1/2">
              <Slider.NextButton class="btn btn-circle btn-outline btn-primary">
                <Icon size={24} id="chevron-right" strokeWidth={3} />
              </Slider.NextButton>
            </div>
          </>
          <Slider.JS rootId={id} />
        </div>
      )}
    </div>
  );
}
