import { ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
//import ShippingSimulationForm from "../shipping/Form.tsx";
import AddToCartProductDetail from "./AddToCartProductDetail.tsx";
import OutOfStock from "./OutOfStock.tsx";
import ProductSelector from "./ProductVariantSelector.tsx";
import type { ProductIcon } from "./AddToCartProductDetail.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import Modal from "../ui/Modal.tsx";

export interface PaymentIcon {
  pix?: ImageWidget;
  boleto?: ImageWidget;
  creditCard: ImageWidget[];
}

interface Props {
  page: ProductDetailsPage | null;
  icons: ProductIcon[];
  paymentIcons?: PaymentIcon;
}

function ProductInfo({ page, icons, paymentIcons }: Props) {
  const id = useId();

  if (page === null) {
    throw new Error("Missing Product Details Page Info");
  }

  const { breadcrumbList, product } = page;
  const { productID, offers, isVariantOf, additionalProperty } = product;
  //const description = product.description || isVariantOf?.description;
  const title = isVariantOf?.name ?? product.name;

  const { price = 0, listPrice, seller = "1", availability } = useOffer(offers);

  const percent = listPrice && offers?.lowPrice
    ? Math.round(((listPrice - offers?.lowPrice) / listPrice) * 100)
    : 0;

  const breadcrumb = {
    ...breadcrumbList,
    itemListElement: breadcrumbList?.itemListElement.slice(0, -1),
    numberOfItems: breadcrumbList.numberOfItems - 1,
  };

  const item = mapProductToAnalyticsItem({
    product,
    breadcrumbList: breadcrumb,
    price,
    listPrice,
  });

  const viewItemEvent = useSendEvent({
    on: "view",
    event: {
      name: "view_item",
      params: {
        item_list_id: "product",
        item_list_name: "Product",
        items: [item],
      },
    },
  });

  //Checks if the variant name is "title"/"default title" and if so, the SKU Selector div doesn't render
  const hasValidVariants = isVariantOf?.hasVariant?.some(
    (variant) =>
      variant?.name?.toLowerCase() !== "title" &&
      variant?.name?.toLowerCase() !== "default title",
  ) ?? false;

  //Calculate the Pix Price Value
  const pixPrice = offers?.lowPrice &&
    offers?.lowPrice - offers?.lowPrice * 0.05;

  //Calculate Price/6
  const dividedPrice = offers?.lowPrice && offers?.lowPrice / 6;

  //calculate if delivery is free
  const freeDelivery = additionalProperty && additionalProperty.some((item) => {
    return item.value === "frete-gratis";
  });

  return (
    <div {...viewItemEvent} class="flex flex-col" id={id}>
      {/* Free Delivery */}
      {freeDelivery && (
        <span
          class={clx(
            "text-[12px] font-normal text-base-200 bg-primary text-center rounded-badge px-2 py-1 w-[120px]"
          )}
        >
          Frete Grátis
        </span>
      )}

      {/* Product Name */}
      <h1 class={clx("md:text-3xl text-base font-semibold text-primary")}>
        {title}
      </h1>

      <div class="flex md:flex-row flex-col md:items-center gap-10">
        <div>
          {/* Prices */}
          <div class="flex flex-col gap-2 pt-1">
            <span class="line-through text-sm font-medium text-gray-400">
              {formatPrice(listPrice, offers?.priceCurrency)}
            </span>
            <span class="text-3xl font-bold text-primary">
              {formatPrice(offers?.lowPrice, offers?.priceCurrency)}
            </span>

            {/* Value with PIX discount */}
            <span class="font-bold text-[18px] text-primary">
              {formatPrice(pixPrice, offers?.priceCurrency)} no pix
            </span>
            <span class="text-sm ">
              <strong class="font-bold text-primary">5% de desconto</strong>{" "}
              pagando com Pix
            </span>

            <div>
              <p class="text-sm text-secondary">
                6x de {formatPrice(dividedPrice, offers?.priceCurrency)} sem
                juros
              </p>
            </div>

            {/* The button to open modal */}
            <label
              htmlFor="my_modal_6"
              className="text-primary text-sm cursor-pointer font-semibold"
            >
              Ver mais detalhes
            </label>

            {/* Abre em um modal as informacoes de pagamento */}
            <Modal id="my_modal_6">
              <div class="bg-base-200 w-full md:w-[700px] h-[500px] p-5 overflow-y-auto rounded-md ">
                <div class="flex justify-between bg-primary  items-center rounded">
                  <h3 class="text-lg font-bold text-base-200 pl-2">
                    Meios de Pagamento
                  </h3>
                  <div class="modal-action m-0 ">
                    <label htmlFor="my_modal_6" class="btn min-h-0 btn-ghost">
                      <span class="text-base-200 ">x</span>
                    </label>
                  </div>
                </div>
                <div class="px-3">
                  <p class="py-2 text-md font-semibold text-primary ">
                    Cartões de Crédito
                  </p>
                  <p class="text-center p-2 ">
                    Total em 1 parcela:{" "}
                    <strong>
                      {formatPrice(offers?.lowPrice, offers?.priceCurrency)}
                    </strong>{" "}
                    com todos os cartões
                  </p>
                  <div>
                    {/* Calcular o valores das parcelas */}
                    {offers?.lowPrice &&
                      Array.from({ length: 12 }, (_, index) => index + 1).map(
                        (numParcelas) => {
                          if (offers?.lowPrice / numParcelas >= 20) {
                            const parcelaComJuros =
                              numParcelas > 6
                                ? (offers?.lowPrice / numParcelas) *
                                  (1 + 0.0211) ** numParcelas
                                : offers?.lowPrice / numParcelas;
                            const totalComJuros = parcelaComJuros * numParcelas;

                            return (
                              <div
                                key={numParcelas}
                                className="flex justify-between py-2 border-b border-gray-500"
                              >
                                <p class="text-[10px] md:text-sm">
                                  <strong>{numParcelas}</strong>x de{" "}
                                  <strong>
                                    {formatPrice(
                                      parcelaComJuros,
                                      offers?.priceCurrency
                                    )}
                                  </strong>
                                  {numParcelas <= 6 ? " sem juros" : ""}
                                </p>
                                <p class="text-[10px] md:text-sm">
                                  <strong>Total:</strong>
                                  {formatPrice(
                                    totalComJuros,
                                    offers?.priceCurrency
                                  )}
                                </p>
                              </div>
                            );
                          }
                        }
                      )}
                  </div>
                </div>
                {paymentIcons?.boleto && (
                  <div class="px-3">
                    <p class="py-3 text-md font-semibold text-primary ">
                      Boleto
                    </p>
                    <Image
                      src={paymentIcons?.boleto}
                      alt="payment icon"
                      width={50}
                      height={30}
                      class="object-contain bg-base-200 border border-gray-500"
                    />
                    <p class="pt-3 text-[10px] md:text-sm">
                      Total:{" "}
                      <strong>
                        {formatPrice(offers?.lowPrice, offers?.priceCurrency)}
                      </strong>
                    </p>
                  </div>
                )}
                {paymentIcons?.pix && (
                  <div class="px-3 pb-8">
                    <p class="py-3  text-md font-semibold text-primary ">Pix</p>
                    <Image
                      src={paymentIcons?.pix}
                      alt="payment icon"
                      width={50}
                      height={30}
                      class="object-contain bg-base-200 border border-gray-500"
                    />
                    {/* Value with PIX discount */}
                    <div class="flex flex-col gap-2 pt-3">
                      <span class="text-[10px] md-text-sm">
                        <strong class="font-bold text-primary">
                          5% de desconto
                        </strong>{" "}
                        pagando com Pix
                      </span>
                      <span class="line-through text-[10px] md:text-sm font-medium text-gray-400">
                        {formatPrice(offers?.lowPrice, offers?.priceCurrency)}
                      </span>
                      <span class="font-bold text-[10px] md:text-sm">
                        {formatPrice(pixPrice, offers?.priceCurrency)} no pix
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          </div>

          {/* Sku Selector */}
          {/* {hasValidVariants && (
            <div className="mt-4 sm:mt-8">
              <ProductSelector product={product} />
            </div>
          )} */}
        </div>
        <div
          id="teste-review"
          class="konfidency-reviews-summary review-description ml-5"
          data-sku={productID}
        ></div>
      </div>

      {/* Add to Cart and Favorites button */}
      <div class="mt-4 sm:mt-10 flex flex-col gap-2">
        {availability === "https://schema.org/InStock" ? (
          <>
            <AddToCartProductDetail
              item={item}
              seller={seller}
              product={product}
              class="btn btn-primary no-animation"
              disabled={false}
              icons={icons}
            />
          </>
        ) : (
          <OutOfStock productID={productID} />
        )}
      </div>

      {/* Shipping Simulation */}
      {
        //   <div class="mt-8">
        //   <ShippingSimulationForm
        //     items={[{ id: Number(product.sku), quantity: 1, seller: seller }]}
        //   />
        // </div>
      }

     
    </div>
  );
}

export default ProductInfo;
