import type { SiteNavigationElement } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import {
  HEADER_HEIGHT_DESKTOP,
  NAVBAR_HEIGHT_DESKTOP,
} from "../../constants.ts";

function NavItem({ item }: { item: SiteNavigationElement }) {
  const { url, name, children } = item;
  const image = item?.image?.[0];

  return (
    <li
      class="group flex items-center"
      style={{ height: NAVBAR_HEIGHT_DESKTOP }}
    >
      <a
        href={url}
        class="group-hover:underline text-sm font-bold text-primary"
      >
        {name}
      </a>

      {children && children.length > 0 && (
        <div
          class="fixed hidden hover:flex group-hover:flex bg-base-200 z-40 items-center justify-center gap-2 max-w-[1440px] mx-auto  top-[150px]"
          style={{
            // top: "0px",
            // left: "0px",
            //marginTop: HEADER_HEIGHT_DESKTOP,
          }}
        >
          {image?.url && (
            <Image
              class="p-6"
              src={image.url}
              alt={image.alternateName}
              width={300}
              height={332}
              loading="lazy"
            />
          )}
          <ul class="flex flex-col  items-start justify-start  p-6">
            {children.map((node) => (
              <li class="">
                <a
                  class="hover:underline text-primary text-sm font-semibold pr-3"
                  href={node.url}
                >
                  <span>{node.name}</span>
                </a>

                <ul class="flex flex-col gap-1 mt-4">
                  {node.children?.map((leaf) => (
                    <li>
                      <a class="hover:underline " href={leaf.url}>
                        <span class="text-secondary text-sm">{leaf.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default NavItem;
