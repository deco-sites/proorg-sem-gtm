import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

/** @titleBy title */
export interface TopItem {
  /**
   * @title Imagem
   * @description Tamanho da imagem (largura: 50px, altura: 50px) */
  image?: ImageWidget;
  /**
   * @title Link
   */
  href?: string;
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Subtitulo
   */
  subtitle?: string;
}

interface Props {
  /**
   * @title Conteudo
   * @maximum 4 */
  content: TopItem[];
}

export default function TopBar({ content }: Props) {
  return (
    <div class="w-screen h-auto bg-secondary bg-opacity-20 md:bg-base-200 flex md:max-w-[1075px] mx-auto md:justify-between md:mt-9 mt-5 mb-[55px] items-center py-auto overflow-x-auto md:overflow-x-hidden">
      {content.map((item) => (
        <a
          href={item.href}
          target="blank"
          class="flex items-center mr-7 md:mr-0 ml-6 h-[70px]"
        >
          <div class="flex items-center justify-center w-[50px] h-[50px] ">
            {item.image && (
              <Image
                class="object-contain w-[50px] h-[50px]"
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
              />
            )}
          </div>
          <div class="ml-6 text-base text-secondary w-[200px]">
            <p>{item.title}</p>
            <p>{item.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
