import { SectionProps } from "deco/mod.ts";
import { AppContext } from "../apps/site.ts";
import Icon from "../components/ui/Icon.tsx";
import Section from "../components/ui/Section.tsx";
import { clx } from "../sdk/clx.ts";
import { usePlatform } from "../sdk/usePlatform.tsx";
import { useComponent } from "./Component.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";

interface NoticeProps {
  title?: string;
  description?: string;
}

export interface Props {
  title: string;
  description: string;
  whatsapp: string;
  success?: NoticeProps;
  failed?: NoticeProps;

  /** @description Nome placeholder */
  placeholderName?: string;

  /** @description Email placeholder */
  placeholderEmail?: string;

  /** @description Assunto placeholder */
  placeholderTitle?: string;

  /** @description Mensagem placeholder */
  placeholderMessage?: string;

  image?: ImageWidget;
  alt?: string;

  /** @hide true */
  status?: "success" | "failed";
}

export async function action(props: Props, req: Request, ctx: AppContext) {
  const platform = usePlatform();

  const form = await req.formData();
  const email = `${form.get("email") ?? ""}`;
  const name = `${form.get("name") ?? ""}`;
  const title = `${form.get("title") ?? ""}`;
  const message = `${form.get("message") ?? ""}`;

  if (platform === "vnda") {
    // deno-lint-ignore no-explicit-any
    await (ctx as any).invoke("site/actions/sendContactEmailJS.ts", {
      name,
      email,
      title,
      message,
      
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
      <span class="font-normal text-secondary text-center text-sm sm:text-start">
        {description}
      </span>
    </div>
  );
}

function Contact({
  title,
  description,
  image,
  alt,
  whatsapp,
  success = {
    title: "Muito obrigado por nos enviar uma mensagem",
    description: "Responderemos o mais breve possível",
  },
  failed = {
    title: "Oops. Tivemos um probleminha ao enviar seu e-mail",
    description: "Por favor, tente novamente",
  },
  placeholderName = "Digite seu nome!",
  placeholderEmail = "Digite seu e-mail",
  placeholderTitle = "Digite o assunto da sua mensagem",
  placeholderMessage = "Deixe sua mensagem...",
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
    <div class="mx-auto mt-14 mb-10  w-80 lg:w-[1400px] text-secondary">
      <div class="flex lg:flex-row flex-col gap-10 mx-auto lg:border lg:border-primary border-0 rounded-md justify-center">
        <div class="flex flex-col ">
          <div class="flex flex-col justify-center items-center pt-4">
            <span class="pt-9 font-semibold text-center text-xl uppercase">
              {title}
            </span>
            <span class="px-4 pt-4 w-[330px] md:w-[550px] font-normal text-base text-center">
              {description}
            </span>
            <a
              href={`https://api.whatsapp.com/send/?phone=${whatsapp}&text&type=phone_number&app_absent=0`}
              target="blank"
            >
              Ou ligue para nós no{" "}
              <span class="font-semibold text-primary">{whatsapp}</span>
            </a>
          </div>

          <form
            hx-target="closest section"
            hx-swap="outerHTML"
            hx-post={useComponent(import.meta.url)}
            class="flex flex-col items-start gap-4 mx-auto pt-[60px] pb-12"
          >
            <input
              name="name"
              class="input-bordered w-[330px] lg:w-[500px] h-[46px] text-secondary input"
              type="text"
              placeholder={placeholderName}
            />
            <input
              name="email"
              class="input-bordered w-[330px] lg:w-[500px] h-[46px] text-secondary input"
              type="text"
              placeholder={placeholderEmail}
            />
            <input
              name="title"
              class="input-bordered w-[330px] lg:w-[500px] h-[46px] text-secondary input"
              type="text"
              placeholder={placeholderTitle}
            />
            <textarea
              name="message"
              class="pt-2 input-bordered w-[330px] lg:w-[500px] h-[96px] text-secondary input"
              placeholder={placeholderMessage}
            />

            <button class="w-[189px] h-[56px] btn btn-primary" type="submit">
              <span class="inline [.htmx-request_&]:hidden uppercase">
                Enviar
              </span>
              <span class="[.htmx-request_&]:inline hidden loading loading-spinner" />
            </button>
          </form>
        </div>
        {image && (
          <div class="hidden lg:flex">
            <Image
              src={image}
              alt={alt}
              width={450}
              height={650}
              loading="lazy"
              fit="contain"
              class="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="412px" />;

export default Contact;
