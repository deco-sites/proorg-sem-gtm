import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";
import { parseRange } from "apps/commerce/utils/filters.ts";
import Avatar from "../../components/ui/Avatar.tsx";
import { clx } from "../../sdk/clx.ts";
import { formatPrice } from "../../sdk/format.ts";

export interface CategoryFilter {
  title: string;
  links: {
    label: string;
    url: string;
  }[];
}

interface Props {
  filters: ProductListingPage["filters"];
  categoryList?: CategoryFilter;
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem({ url, selected, label, quantity }: FilterToggleValue) {
  const startsWithLetter = /^[a-zA-Z]/.test(label);
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2">
      <div aria-checked={selected} class="checkbox" />
      <span class="text-sm first-letter:uppercase">
        {startsWithLetter ? label.replace("-", " ") : label
          .split("_")
          .map(
            (parte) => `R$${parseFloat(parte).toFixed(2).replace(".", ",")}`,
          )
          .join(" ~ ")}
      </span>
      {quantity > 0 && <span class="text-sm text-base-400">({quantity})</span>}
    </a>
  );
}

function FilterValues({ key, values }: FilterToggle) {
  const avatars = key === "tamanho" || key === "cor";
  const flexDirection = avatars ? "flex-row items-center" : "flex-col";

  return (
    <ul class={clx(`flex flex-wrap gap-2 `, flexDirection)}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (avatars) {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price-range") {
          const range = parseRange(item.value);

          return range && <ValueItem {...item} />;
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

function Filters({ filters, categoryList }: Props) {
  return (
    <div>
      <span class="text-sm font-semibold first-letter:uppercase mt-3">
        {categoryList?.title}
      </span>
      {categoryList && (
        <ul class="flex flex-col mt-5 p-4 sm:p-0 gap-4">
          {categoryList.links.map((item) => (
            <li class="text-sm">
              <a href={item.url}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
      <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
        {filters.filter(isToggle).map(
          (filter) =>
            filter.label === "marca" && (
              <li class="flex flex-col gap-4">
                <span class="text-sm font-semibold first-letter:uppercase">
                  {filter.label}
                </span>
                <FilterValues {...filter} />
              </li>
            ),
        )}
      </ul>
      <ul class="flex flex-col gap-6 p-4 sm:p-0 mt-6">
        {filters.filter(isToggle).map(
          (filter) =>
            filter.label === "filtro-preco" && (
              <li class="flex flex-col gap-4">
                <span class="text-sm font-semibold first-letter:uppercase">
                  {filter.label}
                </span>
                <FilterValues {...filter} />
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

export default Filters;
