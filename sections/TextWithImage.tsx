import type { ImageWidget } from "apps/admin/widgets.ts";
import type { HTMLWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleby label */
export interface ServiceProps {
  /** @title titulo */
  label?: string;
  description?: HTMLWidget;
  image: ImageWidget;
  placement: "left" | "right";
}

export interface Props {
  services?: ServiceProps[];
}

const PLACEMENT = {
  left: "flex-col lg:flex-row-reverse",
  right: "flex-col lg:flex-row",
};

export default function Services({
  services = [
    {
      label: "Your Title Here",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam id tincidunt dapibus, elit arcu ultricies massa, quis ornare nisl libero vitae urna.",
      image:
        "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/3290/488e5dc5-9a24-48c9-9795-09b97394fb5f",
      placement: "right",
    },
  ],
}: Props) {
  return (
    <div class="flex flex-col w-screen items-center pt-11">
      {services?.map((service, index) => (
        <div class="lg:w-[1440px] ">
          <div
            key={index}
            class={`flex first:pt-0 py-[33px] flex-wrap gap-4 ${
              PLACEMENT[service.placement]
            } text-left items-center justify-center px-10`}
          >
            <div class=" xl:w-[695px] xl:h-[495px] lg:w-[495px]  w-[324px] h-[295px] ">
              <Image
                class="w-full h-full object-cover p-2 max-w-[695px]"
                src={service.image}
                alt={service.label}
                decoding="async"
                loading="lazy"
                width={695}
                height={495}
              />
            </div>
            <div class="xl:w-[581px] lg:w-[450px] text-primary text-xs flex items-start justify-center flex-col lg:mx-0">
              <p class="text-secondary text-2xl font-bold uppercase">
                {service.label}
              </p>
              <p
                class="text-secondary text-xs"
                dangerouslySetInnerHTML={{ __html: service.description || "" }}
              >
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
