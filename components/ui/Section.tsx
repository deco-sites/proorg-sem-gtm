import { JSX } from "preact";
import { clx } from "../../sdk/clx.ts";

export interface Props {
  /**
   * @title Título
   */
  title?: string;
  subtitle?: string;
  /** @description Link para a categoria dos produtos */
  cta?: string;
}

function Header({ title, subtitle, cta }: Props) {
  if (!title) {
    return null;
  }

  return (
    <div class={clx("flex justify-between items-center gap-6", "px-5 sm:px-0")}>
      <div>
        <span class="text-2xl font-semibold text-secondary uppercase pb-4">
          {title}
        </span>
        <p class="text-secondary text-base">{subtitle}</p>
      </div>
      {cta && (
        <a class="text-sm font-medium text-secondary" href={cta}>
          Veja mais &rarr;
        </a>
      )}
    </div>
  );
}

interface Tab {
  title: string;
}

function Tabbed({ children }: { children: JSX.Element }) {
  return <>{children}</>;
}

function Container({ class: _class, ...props }: JSX.IntrinsicElements["div"]) {
  return (
    <div
      {...props}
      class={clx(
        "container flex flex-col gap-4 sm:gap-6 md:max-w-[1280px] h-auto py-5 sm:py-10 mx-auto px-8",
        _class?.toString(),
      )}
    />
  );
}

function Placeholder({
  height,
  class: _class,
}: {
  height: string;
  class?: string;
}) {
  return (
    <div
      style={{
        height,
        containIntrinsicSize: height,
        contentVisibility: "auto",
      }}
      class={clx("flex justify-center items-center", _class)}
    >
      <span class="loading loading-spinner" />
    </div>
  );
}

function Section() {}

Section.Container = Container;
Section.Header = Header;
Section.Tabbed = Tabbed;
Section.Placeholder = Placeholder;

export default Section;
