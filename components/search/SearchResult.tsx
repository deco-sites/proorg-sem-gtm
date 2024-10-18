import type { ProductListingPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { useScript } from "deco/hooks/useScript.ts";
import { useSection } from "deco/hooks/useSection.ts";
import { SectionProps } from "deco/mod.ts";
import ProductCard from "../../components/product/ProductCard.tsx";
import Filters from "../../components/search/Filters.tsx";
import Icon from "../../components/ui/Icon.tsx";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import Breadcrumb from "../ui/Breadcrumb.tsx";
import Drawer from "../ui/Drawer.tsx";
import Sort from "./Sort.tsx";
import { useDevice } from "deco/hooks/useDevice.ts";
import type { CategoryFilter } from "./Filters.tsx";

export interface Layout {
  /**
   * @title Pagination
   * @description Format of the pagination
   */
  pagination?: "show-more" | "pagination";
}

export interface Props {
  /** @title Integration */
  page: ProductListingPage | null;
  layout?: Layout;

  /** @description 0 for ?page=0 as your first page */
  startingPage?: 0 | 1;

  /** @hidden */
  partial?: "hideMore" | "hideLess";
  /** @title Título */
  title?: string;
  /** @title subtitulo */
  subtitle?: string;
  categoryList?: CategoryFilter;
}

function NotFound() {
  return (
    <div class="w-full flex justify-center items-center py-10">
      <span>Nenhum produto encontrado!</span>
    </div>
  );
}

const useUrlRebased = (overrides: string | undefined, base: string) => {
  let url: string | undefined = undefined;

  if (overrides) {
    const temp = new URL(overrides, base);
    const final = new URL(base);

    final.pathname = temp.pathname;
    for (const [key, value] of temp.searchParams.entries()) {
      final.searchParams.set(key, value);
    }

    url = final.href;
  }

  return url;
};

function PageResult(props: SectionProps<typeof loader>) {
  const { layout, startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, pageInfo } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const nextPageUrl = useUrlRebased(pageInfo.nextPage, url);
  const prevPageUrl = useUrlRebased(pageInfo.previousPage, url);
  const partialPrev = useSection({
    href: prevPageUrl,
    props: { partial: "hideMore" },
  });
  const partialNext = useSection({
    href: nextPageUrl,
    props: { partial: "hideLess" },
  });

  const infinite = layout?.pagination !== "pagination";

  return (
    <div class="grid grid-flow-row grid-cols-1 place-items-center">
      {
        /* <div
        class={clx(
          "pb-2 sm:pb-10",
          (!prevPageUrl || partial === "hideLess") && "hidden",
        )}
      >
        <a
          rel="prev"
          class="btn btn-ghost border border-primary"
          hx-swap="outerHTML show:parent:top"
          hx-get={partialPrev}
        >
          <span class="inline [.htmx-request_&]:hidden">Show Less</span>
          <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
        </a>
      </div> */
      }
      <div>
        <h2 class="font-bold text-2xl text-secondary">{props.title}</h2>
        <p class="text-secondary pt-1 pr-2">{props.subtitle}</p>
      </div>

      <div
        data-product-list
        class={clx(
          "grid items-center",
          "grid-cols-2 gap-2",
          "xl:grid-cols-3 sm:gap-10",
          "2xl:grid-cols-4",
          "w-full",
        )}
      >
        {products?.map((product, index) => (
          <ProductCard
            key={`product-card-${product.productID}`}
            product={product}
            preload={index === 0}
            index={offset + index}
            class="w-[167px]"
          />
        ))}
      </div>

      <div class={clx("pt-2 sm:pt-10 lg:w-[400px] mx-auto")}>
        {infinite
          ? (
            <div class="flex justify-center [&_section]:contents border border-primary">
              <a
                rel="next"
                class={clx(
                  "btn btn-ghost",
                  (!nextPageUrl || partial === "hideMore") && "hidden",
                )}
                hx-swap="outerHTML show:parent:top"
                hx-get={partialNext}
              >
                <span class="inline [.htmx-request_&]:hidden">Veja mais</span>
                <span class="loading loading-spinner hidden [.htmx-request_&]:block" />
              </a>
            </div>
          )
          : (
            <div
              class={clx(
                "join w-full flex justify-center",
                infinite && "hidden",
              )}
            >
              <a
                rel="prev"
                aria-label="previous page link"
                href={prevPageUrl ?? "#"}
                disabled={!prevPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" class="rotate-180" />
              </a>
              <span class="btn btn-ghost join-item ">
                Página {zeroIndexedOffsetPage + 1}
              </span>
              <a
                rel="next"
                aria-label="next page link"
                href={nextPageUrl ?? "#"}
                disabled={!nextPageUrl}
                class="btn btn-ghost join-item"
              >
                <Icon id="chevron-right" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
}

const setPageQuerystring = (page: string, id: string) => {
  const element = document.getElementById(id)?.querySelector(
    "[data-product-list]",
  );

  if (!element) {
    return;
  }

  new IntersectionObserver((entries) => {
    const url = new URL(location.href);

    const prevPage = url.searchParams.get("page");

    for (let it = 0; it < entries.length; it++) {
      if (entries[it].isIntersecting) {
        url.searchParams.set("page", page);
      } else if (
        typeof history.state?.prevPage === "string" &&
        history.state?.prevPage !== page
      ) {
        url.searchParams.set("page", history.state.prevPage);
      }
    }

    history.replaceState({ prevPage }, "", url.href);
  }).observe(element);
};

function Result(props: SectionProps<typeof loader>) {
  const container = useId();
  const controls = useId();
  const device = useDevice();

  const { startingPage = 0, url, partial } = props;
  const page = props.page!;
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const perPage = pageInfo?.recordPerPage || products.length;
  const zeroIndexedOffsetPage = pageInfo.currentPage - startingPage;
  const offset = zeroIndexedOffsetPage * perPage;

  const viewItemListEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item_list",
      params: {
        // TODO: get category name from search or cms setting
        item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
        item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
        items: page.products?.map((product, index) =>
          mapProductToAnalyticsItem({
            ...(useOffer(product.offers)),
            index: offset + index,
            product,
            breadcrumbList: page.breadcrumb,
          })
        ),
      },
    },
  });

  const results = (
    <span class="text-sm font-normal">
      {page.pageInfo.recordPerPage} of {page.pageInfo.records} results
    </span>
  );

  const sortBy = sortOptions.length > 0 && (
    <Sort sortOptions={sortOptions} url={url} />
  );

  return (
    <>
      <div
        id={container}
        {...viewItemListEvent}
        class=" max-w-[1440px] mx-auto pt-5"
      >
        {partial
          ? <PageResult {...props} />
          : (
            <div class="container flex flex-col gap-4 sm:gap-5 w-full py-4 sm:py-5 px-5 sm:px-0">
              {/* <Breadcrumb itemListElement={breadcrumb?.itemListElement} /> */}

              {device === "mobile" && (
                <Drawer
                  id={controls}
                  aside={
                    <div class="bg-base-100 flex flex-col h-full divide-y overflow-y-hidden">
                      <div class="flex justify-between items-center text-secondary">
                        <h1 class="px-4 py-3">
                          <span class="font-medium text-2xl">Filtros</span>
                        </h1>
                        <label class="btn btn-ghost" for={controls}>
                          <Icon id="close" />
                        </label>
                      </div>
                      <div class="flex-grow overflow-auto">
                        <Filters
                          filters={filters}
                          categoryList={props.categoryList}
                        />
                        <div class="ml-3">{sortBy}</div>
                      </div>
                    </div>
                  }
                >
                  <div class="flex sm:hidden justify-between items-end">
                    <label
                      class="btn btn-outline btn-secondary min-h-0 "
                      for={controls}
                    >
                      Filtros
                    </label>
                  </div>
                </Drawer>
              )}

              <div class="grid place-items-center grid-cols-1 sm:grid-cols-[250px_1fr]">
                {device === "desktop" && (
                  <aside class="place-self-start flex flex-col gap-9 ml-3">
                    <span class="text-base font-bold  flex items-center uppercase">
                      Filtros
                    </span>

                    <Filters
                      filters={filters}
                      categoryList={props.categoryList}
                    />

                    <div>{sortBy}</div>
                  </aside>
                )}

                <div class="flex flex-col gap-9">
                  {device === "desktop" && (
                    <div class="flex justify-between items-center">
                      {/* {results} */}
                    </div>
                  )}
                  <PageResult {...props} />
                </div>
              </div>
            </div>
          )}
      </div>

      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            setPageQuerystring,
            `${pageInfo.currentPage}`,
            container,
          ),
        }}
      />
    </>
  );
}

function SearchResult({
  page,
  ...props
}: SectionProps<typeof loader>) {
  if (!page) {
    return <NotFound />;
  }

  return <Result {...props} page={page} />;
}

export const loader = (props: Props, req: Request) => {
  return {
    ...props,
    url: req.url,
  };
};

export default SearchResult;
