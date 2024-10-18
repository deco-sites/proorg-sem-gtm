import { AnalyticsItem, Product } from "apps/commerce/types.ts";
import { useScript } from "deco/hooks/useScript.ts";
import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";
import { useId } from "../../sdk/useId.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import QuantitySelector from "../ui/QuantitySelector.tsx";
import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

/** @titleby title */
export interface ProductIcon {
  /** @title Icone */
  icon: ImageWidget;
  /** @title Titulo */
  title: string;
  subtitle: string;
}

export interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  product: Product;
  seller: string;
  item: AnalyticsItem;
  /** @maximum 4 */
  icons?: ProductIcon[];
}

const onClick = () => {
  event?.stopPropagation();
  const button = event?.currentTarget as HTMLButtonElement | null;
  const container = button!.closest<HTMLDivElement>("div[data-cart-item-pd]")!;
  const { item, platformProps } = JSON.parse(
    decodeURIComponent(container.getAttribute("data-cart-item-pd")!),
  );
  const totalValue = document.getElementById(
    "productDetailValue",
  ) as HTMLInputElement;
  platformProps.quantity = totalValue.valueAsNumber;
  window.STOREFRONT.CART.addToCart(item, platformProps);
};

const onChange = () => {
  const input = event!.currentTarget as HTMLInputElement;
  const productID = input!
    .closest("div[data-cart-item-pd]")!
    .getAttribute("data-item-id-pd")!;
  const quantity = Number(input.value);

  if (!input.validity.valid) {
    return;
  }

  window.STOREFRONT.CART.setQuantity(productID, quantity);
};

// Copy cart form values into AddToCartButton
const onLoad = (id: string) => {
  window.STOREFRONT.CART.subscribe((sdk) => {
    const container = document.getElementById(id);
    const checkbox = container?.querySelector<HTMLInputElement>(
      'input[type="checkbox"]',
    );
    const input = container?.querySelector<HTMLInputElement>(
      'input[type="number"]',
    );
    const itemID = container?.getAttribute("data-item-id-pd")!;

    const quantity = sdk.getQuantity(itemID) || 0;

    if (!input || !checkbox) {
      return;
    }

    input.value = quantity.toString();
    checkbox.checked = quantity > 0;

    // enable interactivity
    container
      ?.querySelectorAll<HTMLButtonElement>("button")
      .forEach((node) => (node.disabled = false));
    container
      ?.querySelectorAll<HTMLButtonElement>("input")
      .forEach((node) => (node.disabled = false));
  });
};

const useAddToCart = ({ product, seller }: Props) => {
  const platform = usePlatform();
  const { additionalProperty = [], isVariantOf, productID } = product;
  const productGroupID = isVariantOf?.productGroupID;

  if (platform === "vnda") {
    return {
      quantity: 1,
      itemId: productID,
      attributes: Object.fromEntries(
        additionalProperty.map(({ name, value }) => [name, value]),
      ),
    };
  }

  return null;
};

function AddToCartProductDetail(props: Props) {
  const { icons, product, item, class: _class } = props;
  const platformProps = useAddToCart(props);
  const id = useId();

  return (
    <div>
      <div
        id={id}
        class="flex flex-col md:flex-row border-t border-neutral pt-4"
        data-item-id-pd={product.productID}
        data-cart-item-pd={encodeURIComponent(
          JSON.stringify({ item, platformProps }),
        )}
      >
        <div class="flex w-[290px] flex-wrap gap-10 mx-auto md:mx-0">
          {icons &&
            icons.map((item) => (
              <div class="flex items-center gap-2 w-[120px]">
                <div class="border border-primary rounded-full w-11 h-11 flex items-center justify-center">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={28}
                    height={23}
                    class="w-[28px] h-[23px] object-contain"
                  />
                </div>
                <div>
                  <p class="font-semibold text-sm">{item.title}</p>
                  <p class="text-sm">{item.subtitle}</p>
                </div>
              </div>
            ))}
        </div>
        {/* Quantity Input */}
        <div class="md:ml-[82px] mt-11">
          <p class="text-sm">
            Escolha a <strong>quantidade</strong>
          </p>
          <QuantitySelector
            min={0}
            max={100}
            value={1}
            hx-on:change={useScript(onChange)}
            id={"productDetailValue"}
          />
        </div>
      </div>
      <div
        id={id}
        class="flex border-t border-neutral mt-4 "
        data-item-id-pd={product.productID}
        data-cart-item-pd={encodeURIComponent(
          JSON.stringify({ item, platformProps }),
        )}
      >
        <button
          class={clx(
            "flex w-full h-[48px] bg-primary text-base-200 min-h-0 mt-4 ",
            _class?.toString(),
          )}
          hx-on:click={useScript(onClick)}
        >
          <span class="text-base-200 font-medium text-[12px] text-center w-full hover:text-sm">
            Comprar
          </span>
        </button>
      </div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad, id) }}
      />
    </div>
  );
}

export default AddToCartProductDetail;
