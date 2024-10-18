import type { Product } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { LoadingFallbackProps } from "deco/mod.ts";
import ProductSlider from "../../components/product/ProductSlider.tsx";
import Section, {
  Props as SectionHeaderProps,
} from "../../components/ui/Section.tsx";
import { useOffer } from "../../sdk/useOffer.ts";
import { useSendEvent } from "../../sdk/useSendEvent.ts";
import { useDevice } from "deco/hooks/useDevice.ts";

export interface Props extends SectionHeaderProps {
  products: Product[] | null;
}

export default function ProductHorizontalCard(
  { products, title, cta, subtitle }: Props,
) {
  return (
    <div>
      <h2>"teste"</h2>
    </div>
  );
}
export const LoadingFallback = ({
  title,
  cta,
}: LoadingFallbackProps<Props>) => (
  <Section.Container>
    <Section.Header title={title} cta={cta} />
    <Section.Placeholder height="508px" />;
  </Section.Container>
);
