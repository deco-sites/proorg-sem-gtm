import { ProductDetailsPage } from "apps/commerce/types.ts";
// import Image from "apps/website/components/Image.tsx";
// import IframeLoader from "../../islands/ytOtimization.tsx";

interface Props {
  page: ProductDetailsPage | null;
}

function ProductDescription({ page }: Props) {
  if (page === null) {
    throw new Error("Missing Product Description Page Info");
  }

  const { product } = page;
  const { isVariantOf } = product;
  const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

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

  function processDescription(description: string) {
    // Remover comentários HTML (<!-- -->)
    description = description.replace(/<!--.*?-->/g, "");

    // converter as linhas em branco
    description = description.replace(/\n/g, "<br>");

    // converter para negrito
    const regexBold = /\*\*(.*?)\*\*/gm;
    let matchBold;
    while ((matchBold = regexBold.exec(description)) !== null) {
      description = description.replace(
        matchBold[0],
        `<strong>${matchBold[1]}</strong>`,
      );
    }

    // Converter cabeçalhos Markdown para HTML com classes Tailwind

    const regexh4 = /<br>\s*####\s*(.*?)\s*<br>/gm;
    let matchH4;
    while ((matchH4 = regexh4.exec(description)) !== null) {
      description = description.replace(
        matchH4[0],
        `<h4 class="pt-5"><span class="text-base font-medium pt-7 pb-4">${
          matchH4[1]
        }</span></h4>`,
      );
    }

    const regexh3 = /<br>\s*###\s*(.*?)\s*<br>/gm;
    let matchH3;
    while ((matchH3 = regexh3.exec(description)) !== null) {
      description = description.replace(
        matchH3[0],
        `<div class="pt-10"><h3><span class="text-lg font-semibold mt-7 mb-4">${
          matchH3[1]
        }</span></h3></div>`,
      );
    }

    const regexh2 = /<br>\s*##\s*(.*?)\s*<br>/gm;
    let matchH2;
    while ((matchH2 = regexh2.exec(description)) !== null) {
      description = description.replace(
        matchH2[0],
        `<h2 class="pt-10"><span class="text-xl font-bold mt-7 mb-4">${
          matchH2[1]
        }</span></h2>`,
      );
    }

    const regexh1 = /<br>\s*#\s*(.*?)\s*<br>/gm;
    let matchH1;
    while ((matchH1 = regexh1.exec(description)) !== null) {
      description = description.replace(
        matchH1[0],
        `<h1 class="pt-10"><span class="text-2xl font-bold mb-4">${
          matchH1[1]
        }</span></h1>`,
      );
    }

    // Adicionar classes Tailwind às imagens
    const regexImg = /!\[\]\((.*?)\)/g; // Regex para encontrar o link da imagem
    let matchImg;

    while ((matchImg = regexImg.exec(description)) !== null) {
      description = description.replace(
        matchImg[0],
        ` <Image
            class="w-[70%] mx-auto"
            src="${matchImg[1]}"
            alt={"img.alternateName"}
            width={300}
            height={300}
            loading="lazy"
          />`,
      );
    }

    // Adicionar classes Tailwind aos videos
    const regexVideo =
      /!\[\]\[(?:VIDEO|Video|video|VÍDEO|Vídeo|vídeo)\]\(([^)]*)\)/gm;
    let matchVideo;
    while ((matchVideo = regexVideo.exec(description)) !== null) {
      const embedLink = getEmbedLink(matchVideo[1]);
      description = description.replace(
        matchVideo[0],
        `<iframe class="w-full" width="560" height="315" src="${embedLink}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`,
      );
    }

    return description;
  }

  return (
    <div>
      <div class="mt-4 sm:mt-6">
        <span class="text-sm">
          {description && (
            <div>
              <div
                for="myCheckbox "
                class=" font-semibold border-t border-b border-primary text-sm md:text-xl pt-4 pb-4"
              >
                Descricão Geral
              </div>
              {/* <input id="myCheckbox" type="checkbox" class="hidden peer" /> */}
              <h2 class="text-primary md:text-2xl text-lg text-center font-bold mt-8 mb-5">
                {title}
              </h2>
              <div
                class="ml-2 mt-2  px-3"
                dangerouslySetInnerHTML={{
                  __html: processDescription(description),
                }}
              />
            </div>
          )}
        </span>
      </div>
    </div>
  );
}

export default ProductDescription;
