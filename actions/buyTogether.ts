import cartLoader, { Cart } from "apps/vnda/loaders/cart.ts";
import { AppContext } from "apps/vnda/mod.ts";
import { getCartCookie } from "apps/vnda/utils/cart.ts";

export interface ProductItem {
  itemId: string;
  quantity: number;
  attributes: Record<string, string>;
}

export interface Props {
  productsList: ProductItem[];
}

const action = async (
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<Cart> => {
  const { api } = ctx;
  // const { itemId, quantity, attributes } = props;
  const cartId = getCartCookie(req.headers);

  if (!cartId) {
    throw new Error("Missing cart cookie");
  }

  const list = props.productsList.map((product) => ({
    sku: product.itemId,
    quantity: product.quantity,
    atributes: product.attributes,
  }));

  await api["POST /api/v2/carts/:cartId/items/bulk"](
    { cartId },
    {
      body: {
        list,
      },
    },
  );

  return cartLoader({}, req, ctx);
};

export default action;
