import { type ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import Section from "../../components/ui/Section.tsx";

export interface Props {
  /**
   * @title Imagem do Banner
   * @description Inserir a imagem na largura especificada, a altura vai se ajustar automaticamente (mobile: largura 342px, desktop: 1143px)
   */
  images: {
    mobile: ImageWidget;
    desktop: ImageWidget;
  };
  /**
   * @description Descrição de acessibilidade e SEO
   */
  alt: string;
  /**
   * @description Link opcional
   */
  href?: string;
}

function Banner({ images, href, alt }: Props) {
  return (
    <Section.Container>
      <a class="relative bg-base-200 mx-auto" href={href}>
        <Picture>
          <Source media="(max-width: 640px)" src={images.mobile} width={342} />
          <Source
            media="(min-width: 640px)"
            src={images.desktop}
            width={1143}
          />
          <img
            src={images.desktop}
            alt={alt}
            class="w-full h-auto object-cover max-w-[1143px]"
          />
        </Picture>
      </a>
    </Section.Container>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;

export default Banner;
