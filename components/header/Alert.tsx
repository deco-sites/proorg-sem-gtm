import { ImageWidget } from "apps/admin/widgets.ts";
import Slider from "../../components/ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleby alt */
export interface SocialMedia {
  icon: ImageWidget;
  alt: string;
  link: string;
}

export interface Props {
  alerts?: string[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
  icons?: SocialMedia[];
}

function Alert({ alerts = [], interval = 5, icons }: Props) {
  const id = useId();

  return (
    <div id={id} class="bg-primary w-screen">
      <div class=" flex items-center lg:max-w-[1440px] mx-auto">
        <div class="flex gap-2 pl-3 ">
          {icons &&
            icons.map((item) => (
              <a
                href={item.link}
                target="blank"
                class="w-[26px] h-[26px] border border-base-200 rounded flex items-center justify-center"
              >
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={18}
                  height={18}
                  class="object-contain w-[18px] h-[18px]"
                />
              </a>
            ))}
        </div>
        <div class="flex justify-center items-center lg:w-full">
          <Slider class="carousel carousel-center text-secondary-content text-[12px]">
            {alerts.map((alert, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-[250px] lg:w-[500px] "
              >
                <span
                  class="py-3 text-center "
                  dangerouslySetInnerHTML={{ __html: alert }}
                />
              </Slider.Item>
            ))}
          </Slider>
        </div>

        <Slider.JS rootId={id} interval={interval && interval * 1e3} />
      </div>
    </div>
  );
}

export default Alert;
