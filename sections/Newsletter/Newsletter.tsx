import { SectionProps } from "deco/mod.ts";
import { AppContext } from "../../apps/site.ts";
import Icon from "../../components/ui/Icon.tsx";
import Section from "../../components/ui/Section.tsx";
import { clx } from "../../sdk/clx.ts";
import { usePlatform } from "../../sdk/usePlatform.tsx";
import { useComponent } from "../Component.tsx";

interface NoticeProps {
  title?: string;
  description?: string;
}

export interface Props {
  title?: string;
  description?: string;
  success?: NoticeProps;
  failed?: NoticeProps;

  /** @description Nome placeholder */
  placeholderName?: string;

  /** @description E-mail placeholder */
  placeholderEmail?: string;

  /** @hide true */
  status?: "success" | "failed";
}

export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();

  const form = await req.formData();
  const email = `${form.get("email") ?? ""}`;
  const name = `${form.get("name") ?? ""}`;

  if (platform === "vnda") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("site/actions/sendEmailJS.ts", {
      name,
      email,
    });

    return { ...props, status: "success" };
  }

  return { ...props, status: "failed" };
}

export function loader(props: Props) {
  return { ...props, status: undefined };
}

function Notice({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div class="flex flex-col justify-center items-center sm:items-start gap-4">
      <span class="font-semibold text-3xl text-center sm:text-start">
        {title}
      </span>
      <span class="font-normal text-base-400 text-center text-sm sm:text-start">
        {description}
      </span>
    </div>
  );
}

function Newsletter({
  title,
  description,
  success = {
    title: "Thank you for subscribing!",
    description:
      "You’re now signed up to receive the latest news, trends, and exclusive promotions directly to your inbox. Stay tuned!",
  },
  failed = {
    title: "Oops. Something went wrong!",
    description:
      "Something went wrong. Please try again. If the problem persists, please contact us.",
  },
  placeholderName = "Digite seu nome aqui!",
  placeholderEmail = "Digite seu e-mail aqui",
  status,
}: SectionProps<typeof loader, typeof action>) {
  if (status === "success" || status === "failed") {
    return (
      <Section.Container class="bg-base-200">
        <div class="flex sm:flex-row flex-col justify-center items-center gap-5 sm:gap-10 p-10">
          <Icon
            size={80}
            class={clx(status === "success" ? "text-primary" : "text-error")}
            id={status === "success" ? "check-circle" : "error"}
          />
          <Notice {...(status === "success" ? success : failed)} />
        </div>
      </Section.Container>
    );
  }

  return (
    <div class="bg-primary mb-8 text-base-200">
      <div class="flex flex-col">
        <div class="flex flex-col justify-center items-center pt-6">
          <span class="text-base uppercase">Newsletter</span>
          <span class="pt-9 font-semibold text-2xl text-center uppercase">
            {title}
          </span>
          <span class="pt-4 font-normal text-base text-center">
            {description}
          </span>
        </div>

        <form
          hx-target="closest section"
          hx-swap="outerHTML"
          hx-post={useComponent(import.meta.url)}
          class="flex lg:flex-row flex-col items-center gap-4 mx-auto pt-[60px] pb-12"
        >
          <input
            name="name"
            class="input-bordered w-[330px] lg:w-[365px] h-[56px] text-secondary input"
            type="text"
            placeholder={placeholderName}
          />
          <input
            name="email"
            class="input-bordered w-[330px] lg:w-[551px] h-[56px] text-secondary input"
            type="text"
            placeholder={placeholderEmail}
          />

          <button class="w-[189px] h-[56px] btn btn-base-200" type="submit">
            <span class="inline [.htmx-request_&]:hidden uppercase">
              Enviar
            </span>
            <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
          </button>
        </form>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="412px" />;

export default Newsletter;
