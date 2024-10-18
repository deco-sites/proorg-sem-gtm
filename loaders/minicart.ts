import { AppContext } from "../apps/site.ts";
import { Minicart } from "../components/minicart/Minicart.tsx";
import { usePlatform } from "../sdk/usePlatform.tsx";

import vnda from "../sdk/cart/vnda/loader.ts";

// deno-lint-ignore no-explicit-any
const loaders: Record<string, any> = {
  vnda,
};

function loader(
  props: unknown,
  req: Request,
  ctx: AppContext,
): Promise<Minicart> {
  const platform = usePlatform();

  const loader = loaders[platform];

  if (!loader) {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  return loader(props, req, ctx);
}

export default loader;
