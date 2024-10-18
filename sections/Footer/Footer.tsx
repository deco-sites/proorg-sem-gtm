import { type ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";

/** @titleBy title */
interface Item {
  /**
   * @title Icone do link
   * @description Adicionar icones na lista de contato tam (largura: 18px altura:18px) */
  image?: ImageWidget;
  /** @title Texto do Link */
  title: string;
  /** @tile Url do Link */
  href?: string;
  /**
   * @title Abrir em uma nova janela
   * @description se quiser que o link abra em uma nova janela marque abaixo */
  isBlank?: boolean;
}

/** @titleBy title */
interface Link {
  title: string;
  links: Item[];
}

/** @titleBy alt */
interface Social {
  /** @title Nome da Rede Social */
  alt?: string;
  /** @title Link para Rede Social */
  href?: string;
  /** @title Icone (logo)
   * @description Tamanho (largura: 18px, altura: 18px)
   */
  image: ImageWidget;
}

/** @titleBy title */
interface PaymentIcon {
  /**
   * @title Título
   * @description ex: Visa */
  title: string;
  /**
   * @title Icone (logo)
   * @description Tamanho (largura: 31px, altura: 19px)
   */
  image: ImageWidget;
}

interface MobileApps {
  /** @description Link para o Aplicativo da Apple */
  apple?: string;
  /** @description Link para o Aplicativo Android */
  android?: string;
}

/** @titleBy title */
interface BadgeIcon {
  /**
   * @title Título */
  title: string;
  /**
   * @title Icone (logo)
   * @description Tamanho (largura máxima: 140px, altura máxima: 75px)
   */
  image: ImageWidget;
  href?: string;
}

interface Props {
  /** @title Nome do site */
  siteName: string;
  /**
   * @title Descrição
   * @format textarea */
  description: string;
  /** @title Lista de Links */
  links?: Link[];
  /** @title Título para redes sociais */
  socialTitle: string;
  /** @title Nome das redes sociais */
  social: Social[];
  /** @title Formas de Pagamento */
  paymentMethods?: PaymentIcon[];
  copyright: string;
  /** @title Aplicativos mobile */
  mobileApp?: boolean;
  mobileAppLink: MobileApps;
  /** @title Selos de confiança */
  badges?: BadgeIcon[];
  /** @title Formas de Envio */
  delivery?: ImageWidget[];
}

function Footer({
  siteName = "",
  description = "",
  links = [],
  socialTitle = "",
  social = [],
  paymentMethods = [],
  copyright,
  mobileApp = true,
  mobileAppLink = {},
  delivery = [],
  badges = [],
}: Props) {
  return (
    <footer class="w-screen  sm:mt-10 bg-primary text-base-200">
      <div class="container flex md:justify-between flex-col md:flex-row pt-[38px] gap-6 lg:max-w-[1400px] md:px-5 px-8">
        <div class="md:w-[255px] w-full">
          <h2 class="text-[15px] font-bold w-[168px] pb-5">{siteName}</h2>
          <p class="text-[11px] ">{description}</p>
        </div>
        <ul class="flex justify-between grow  flex-wrap">
          {links.map(({ title, links }) => (
            <li class="flex flex-col  mt-10 md:mt-0">
              <p class="text-[15px] font-semibold pb-5">{title}</p>
              <ul class="flex flex-col gap-5">
                {links.map(({ title, href, image, isBlank }) => (
                  <li>
                    <a
                      class="text-[11px] flex gap-1"
                      href={href}
                      target={isBlank ? "blank" : ""}
                    >
                      {image && (
                        <Image
                          src={image}
                          alt={title}
                          loading="lazy"
                          width={18}
                          height={18}
                        />
                      )}
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div class="w-[185px]">
          <p class="text-[15px] font-semibold pb-5">{socialTitle}</p>
          <ul class="flex gap-4 text-base-200">
            {social.map(({ image, href, alt }) => (
              <li class="text-base-200 w-6 h-6 border border-base-200 rounded flex items-center justify-center">
                <a href={href} target="blank" class="">
                  <Image
                    class="w-[18px] h-[18px]"
                    src={image}
                    alt={alt}
                    loading="lazy"
                    width={18}
                    height={18}
                  />
                </a>
              </li>
            ))}
          </ul>

          {mobileApp && (
            <div class="flex flex-nowrap  gap-6 pt-7">
              <a href={mobileAppLink.apple} target="blank">
                <Image
                  alt="apple"
                  width={72}
                  height={22}
                  loading="lazy"
                  src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/12156/5c0dade1-22e2-468c-bbc9-6c1545e3ed8a"
                />
              </a>
              <a href={mobileAppLink.android} target="blank">
                <Image
                  alt="android"
                  width={72}
                  height={22}
                  loading="lazy"
                  src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/12156/ca8bbc9d-72b0-44ae-8d63-d6ee5a9c2b70"
                />
              </a>
            </div>
          )}
        </div>
      </div>
      <div class="flex  container lg:max-w-[1400px] px-5 mt-10 lg:justify-between flex-col lg:flex-row">
        <div class="flex flex-col  gap-6 items-center sm:items-start">
          {paymentMethods && (
            <div class="flex flex-wrap">
              <p class="text-[15px] font-semibold w-[279px]">
                Meios de pagamento
              </p>
              <ul class="flex flex-wrap gap-2">
                {paymentMethods.map(({ image, title }) => (
                  <li class="w-[31px] h-[19px] bg-base-200">
                    <Image
                      src={image}
                      alt={title}
                      width={31}
                      height={19}
                      loading="lazy"
                      class="object-cover"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {delivery && (
            <div class="flex flex-wrap">
              <p class="text-[15px] font-semibold w-[279px]">Meios de envio</p>
              <ul class="flex flex-wrap gap-2">
                {delivery.map((item) => (
                  <li class="h-[25px] w-[50px] bg-base-200 border  border-base-100 rounded flex justify-center items-center">
                    <Image
                      src={item}
                      alt="metodo de entrega"
                      width={50}
                      height={25}
                      loading="lazy"
                      fit="contain"
                      class=" object-contain "
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {badges && (
          <div class="flex  items-center justify-center gap-4 pt-6 lg:pt-0">
            {badges.map((badge) => (
              <a key={badge.title} href={badge.href} target="blank">
                <Image
                  alt={badge.title}
                  width={144}
                  height={44}
                  loading="lazy"
                  src={badge.image}
                />
              </a>
            ))}
          </div>
        )}
      </div>

      <p class="text-[9px] font-normal text-center mx-3 pt-5">{copyright}</p>
      <div class="flex gap-8 mt-4 pb-8 container lg:max-w-[1400px] justify-center">
        <div class="flex gap-5 items-center mx-auto">
          <a href="https://deco.cx/" target="blank">
            <Image
              loading="lazy"
              alt="desenvolvido com deco.cx"
              width={70}
              height={30}
              src="https://deco-sites-assets.s3.sa-east-1.amazonaws.com/progres-organic/d97b3bf5-d9b4-4b91-812e-40fc89687c69/deco.svg"
            />
          </a>
          <a href="https://tec3commerce.com.br/" target="blank">
            <p class="text-[10px]">desenvolvido por:</p>
            <Image
              loading="lazy"
              alt="desenvolvido por tec3"
              width={60}
              height={20}
              src="https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/12156/cbee4272-989d-40d4-ae5a-ca5fa0afdaaa"
            />
          </a>
        </div>
      </div>
      
    </footer>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;

export default Footer;
