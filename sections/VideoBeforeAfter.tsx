import { useSection } from "deco/hooks/useSection.ts";
import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Sub-titulo
   * @description Texto auxiliar
   */
  subtile?: string;
  /**
   * @title Texto do link
   * @description Texto do link do produto do video
   */
  text: string;
  /**
   * @title Link
   * @description Link para a pagina do produto
   */
  href: string;
  /**
   * @title You Tube Video
   * @description Link do youTube (link copiado do navegador e nao do botao de Compartilhar)
   */
  imageYoutube: ImageWidget;
  videoyt: string;
  /** @hide renderVideo*/
  renderVideo: boolean;
}

export default function Section({
  title,
  subtile,
  text,
  href,
  videoyt,
  imageYoutube,
  renderVideo = false,
}: Props) {
  // Extrair o ID do vídeo:
  const videoId = videoyt.split("v=")[1].split("&")[0];
  function getEmbedLink(videoId: string) {
    if (!videoId) return "Vídeo não encontrado";
    // Criar o link embeddable:
    if (videoId) {
      const embedLink = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      return embedLink;
    }
  }


  return (
    <div class="w-screen pt-[30px] mb-8 px-4">
      <div class="lg:w-[1300px] md:mx-auto flex flex-col-reverse md:gap-10 items-center justify-center xl:flex-row md:flex-wrap ">
        <div class="md:w-[667px] md:h-[474px] w-[350px] h-[235px] mx-auto mt-5 md:mt-0 md:mx-0">
          {renderVideo ? (
            <iframe
              class="w-full"
              width="560"
              height="415"
              src={getEmbedLink(videoId) || ""}
              title="YouTube video player"
              frameborder="0"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          ) : (
            <div
              hx-get={useSection({ props: { renderVideo: true } })}
              hx-target="closest section"
                hx-swap="outerHTML"
                class="mb-5"
            >
              <Image
                src={imageYoutube || ""}
                class=""
                width={560}
                height={315}
                loading="lazy"
              />
            </div>
          )}
        </div>
        <div class="md:max-w-[425px] mx-auto md:mx-0 flex flex-col items-center md:items-start">
          <h2 class="text-2xl font-semibold text-secondary md:pb-5 md:pt-3 pt-10 pb-3 text-center">
            {title}
          </h2>
          <h4 class="text-sm  text-secondary md:pb-10 pb-4 ">{subtile}</h4>
          <a
            href={href}
            class="text-base text-secondary font-semibold sm:max-h-[276px] hover:underline "
          >
            {text} →
          </a>
        </div>
      </div>
    </div>
  );
}
