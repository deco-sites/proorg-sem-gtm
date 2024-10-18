import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { SalesAgreement } from "apps/shopify/utils/admin/admin.graphql.gen.ts";

/** @titleby text */
export interface ImageLink {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 38px altura: 38px) */
  image: ImageWidget;
  /**
   * @title Link
   * @description Link para o conteúdo */
  href: string;
  /**
   * @title Texto
   */
  text: string;
}

export interface Sale {
  title: string;
  href: string;
  icon: ImageWidget;
}

interface Props {
  links: ImageLink[];
  /**
   * @title Promoçao
   */
  sales?: Sale;
}

function ImageLinks({ links, sales }: Props) {
  return (
    <div class="hidden xl:flex gap-4 mx-4 items-center">
      {links.length > 0 &&
        links.map((item) => (
          <a
            href={item.href}
            class="flex justify-center w-[140px] gap-2 items-center"
          >
            <Image
              class="object-contain"
              src={item.image}
              alt={item.text}
              width={37}
              height={37}
            />
            <p class="text-[10px]">{item.text}</p>
          </a>
        ))}
      {sales && (
        <a
          class="hidden xl:flex items-center justify-center bg-primary px-3 py-1 gap-2 rounded-md 2xl:h-6 w-auto "
          href={sales.href}
        >
          <Image
            class="object-contain w-4 h-4"
            src={sales.icon}
            alt={sales.title}
            width={16}
            height={16}
          />
          <p class="text-base-200 text-[10px] font-bold text-center">
            {sales.title}
          </p>
        </a>
      )}
    </div>
  );
}

export default ImageLinks;
