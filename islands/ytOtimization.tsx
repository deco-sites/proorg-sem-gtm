import { useEffect, useRef } from "preact/hooks";

interface Props {
  /**
   * @title Link do vídeo
   */
  videoLink: string | "";
  /**
   * @description A largura padrão é 477
   * @title Largura do Iframe
   */
  width?: number;
  /**
   * @description A altura padrão é 311
   * @title Altura do Iframe
   */
  height?: number;
  preload?: boolean;
}

const IframeLoader = ({ videoLink, width = 477, height = 311 }: Props) => {
  const targetElement = useRef<HTMLIFrameElement | null>(null);
  const embedLink = getEmbedLink(videoLink);

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

  // Usa o IntersectionObserver para carregar o iframe quando estiver na tela
  useEffect(() => {
    const currentElement = targetElement.current;

    if (!currentElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }, // Define o limiar de visibilidade para o carregamento
    );

    observer.observe(currentElement);

    return () => observer.disconnect();
  }, []); // Dependência vazia, pois só queremos observar uma vez

  return (
    <div class="h-full w-full">
      <iframe
        style={{ maxWidth: width, maxHeight: height, borderRadius: 12 }}
        width={width}
        height={height}
        src={embedLink} // Defina o src aqui!
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        class="w-full h-full"
        allowFullScreen
        ref={targetElement}
        loading="lazy" // Carrega o iframe quando estiver visível
      >
      </iframe>
    </div>
  );
};

export default IframeLoader;
