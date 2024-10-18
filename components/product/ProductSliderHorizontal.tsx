import { Product } from "apps/commerce/types.ts";
import ProductCardHorizontal from "./ProductCardHorizontal.tsx";
import { useId } from "../../sdk/useId.ts";

interface Props {
  products?: Product[];
  itemListName?: string;
}

function ProductSliderHorizontal({ products, itemListName }: Props) {
  const id = useId();

  return (
    <>
      <div id={id} class="flex flex-col px-0">
        <div class="">
          <div class="flex flex-col gap-4  w-full pb-5  px-3">
            {products?.map((product, index) => (
              <div class="">
                <ProductCardHorizontal
                  index={index}
                  product={product}
                  itemListName={itemListName}
                  class={`w-[272px] ${index} `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductSliderHorizontal;
