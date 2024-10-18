import type { HTMLWidget, ImageWidget } from "apps/admin/widgets.ts";
import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import { LoadingFallbackProps } from "deco/mod.ts";
import Alert from "../../components/header/Alert.tsx";
import Bag from "../../components/header/Bag.tsx";
import User from "../../components/header/User.tsx";
import Menu from "../../components/header/Menu.tsx";
import NavItem from "../../components/header/NavItem.tsx";
import Searchbar, {
  type SearchbarProps,
} from "../../components/search/Searchbar/Form.tsx";
import Drawer from "../../components/ui/Drawer.tsx";
import Icon from "../../components/ui/Icon.tsx";
import Modal from "../../components/ui/Modal.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  NAVBAR_HEIGHT_MOBILE,
  SEARCHBAR_DRAWER_ID,
  SEARCHBAR_POPUP_ID,
  SIDEMENU_CONTAINER_ID,
  SIDEMENU_DRAWER_ID,
} from "../../constants.ts";
import ImageLinks from "../../components/header/ImageLinks.tsx";
import type { ImageLink, Sale } from "../../components/header/ImageLinks.tsx";
import type { SocialMedia } from "../../components/header/Alert.tsx";

// export interface FreeShipping{
//   /** @title Frete Grátis
//    * @description Colocar o valor da compra minima (usar . no lugar da ,)
//    */
//   freeShippingValue: number;
// }

export interface Logo {
  src: ImageWidget;
  alt: string;
  width?: number;
  height?: number;
}

export interface SectionProps {
  
  alerts?: HTMLWidget[];
  icons?: SocialMedia[];
  interval?: number;

  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: SiteNavigationElement[] | null;

  /**
   * @title Searchbar
   * @description Searchbar configuration
   */
  searchbar: SearchbarProps;

  /** @title Logo */
  logo: Logo;

  /**
   * @title Links com Icones
   * @maximum 3
   * @description Links que vão ao lado da barra de pesquisa */
  topLinks: ImageLink[];

  /**
   * @title Banner de Promoção
   */
  sales?: Sale;

  /**
   * @description Usefull for lazy loading hidden elements, like hamburguer menus etc
   * @hide true */
  loading?: "eager" | "lazy";
}

type Props = Omit<SectionProps, "alert">;

const Desktop = ({
  navItems,
  logo,
  searchbar,
  loading,
  topLinks,
  sales,
}: Props) => (
  <>
    <div class="flex flex-col container max-w-[1440px] ">
      <div class="flex justify-between items-center border-b border-primary h-20">
        <div class=" pl-6 w-[148px] h-[50px] flex flex-shrink-0">
          <a href="/" aria-label="Store logo">
            <Image
              class="w-[148px] h-[50px] "
              src={logo.src}
              alt={logo.alt}
              width={logo.width || 141}
              height={logo.height || 48}
            />
          </a>
        </div>

        <div class=" flex items-center justify-center gap-2 w-screen mx-8">
          <Searchbar {...searchbar} />
          <ImageLinks links={topLinks} sales={sales} />
        </div>

        <div class="flex gap-4  pr-6">
          <Bag />
          <User />
        </div>
      </div>

      <div class="flex justify-between items-center w-full">
        <ul class="flex justify-between mx-center px-6 w-full">
          {navItems?.slice(0, 10).map((item) => (
            <NavItem item={item} />
          ))}
        </ul>
      </div>
    </div>
  </>
);

const Mobile = ({
  logo,
  searchbar,
  navItems,
  loading,
  topLinks,
  sales,
}: Props) => (
  <>
    <Drawer
      id={SEARCHBAR_DRAWER_ID}
      aside={
        <Drawer.Aside title="Pesquisar" drawer={SEARCHBAR_DRAWER_ID}>
          <div class="w-screen overflow-y-auto">
            {loading === "lazy"
              ? (
                <div class="h-full w-full flex items-center justify-center">
                  <span class="loading loading-spinner" />
                </div>
              )
              : <Searchbar {...searchbar} />}
          </div>
        </Drawer.Aside>
      }
    />
    <Drawer
      id={SIDEMENU_DRAWER_ID}
      aside={
        <Drawer.Aside title="Menu" drawer={SIDEMENU_DRAWER_ID}>
          {loading === "lazy"
            ? (
              <div
                id={SIDEMENU_CONTAINER_ID}
                class="h-full flex items-center justify-center w-screen"
              >
                <span class="loading loading-spinner" />
              </div>
            )
            : (
              <Menu
                navItems={navItems ?? []}
                topLinks={topLinks}
                sales={sales}
              />
            )}
        </Drawer.Aside>
      }
    />

    <div
      class="grid place-items-center w-screen px-5 gap-4"
      style={{
        height: NAVBAR_HEIGHT_MOBILE,
        gridTemplateColumns:
          "min-content auto min-content min-content min-content",
      }}
    >
      <label
        for={SIDEMENU_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost"
        aria-label="open menu"
      >
        <Icon id="menu" />
      </label>

      {logo && (
        <a
          href="/"
          class="flex-grow inline-flex items-center justify-center"
          style={{ minHeight: NAVBAR_HEIGHT_MOBILE }}
          aria-label="Store logo"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width || 100}
            height={logo.height || 13}
          />
        </a>
      )}

      <label
        for={SEARCHBAR_DRAWER_ID}
        class="btn btn-square btn-sm btn-ghost"
        aria-label="search icon button"
      >
        <Icon id="search" />
      </label>
      <Bag />
      <User />
    </div>
  </>
);

function Header({
  alerts = [],
  icons = [],
  interval,
  logo = {
    src:
      "https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/2291/986b61d4-3847-4867-93c8-b550cb459cc7",
    width: 100,
    height: 16,
    alt: "Logo",
  },
  ...props
}: Props) {
  const device = useDevice();

  return (
    <header
      style={{
        height: device === "desktop"
          ? HEADER_HEIGHT_DESKTOP
          : HEADER_HEIGHT_MOBILE,
      }}
    >
      <div class="bg-base-100 fixed z-40">
        {alerts.length > 0 && (
          <Alert alerts={alerts} icons={icons} interval={interval} />
        )}
        {device === "desktop"
          ? <Desktop logo={logo} {...props} />
          : <Mobile logo={logo} {...props} />}
      </div>
    </header>
  );
}

export const LoadingFallback = (props: LoadingFallbackProps<Props>) => (
  // deno-lint-ignore no-explicit-any
  <Header {...(props as any)} loading="eager" />
);

export default Header;
