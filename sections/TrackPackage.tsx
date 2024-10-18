import { SectionProps } from "deco/mod.ts";
//import TrakingResult from "../components/shipping/TrakingResult.tsx";
//import type { Props as Traking } from "../components/shipping/TrakingResult.tsx";
import { useComponent } from "./Component.tsx";
import { AppContext } from "apps/vnda/mod.ts";

interface TrakingData {
  id: number;
  tracking_code: string;
  tracked_at: string;
  url: string;
  company: string;
}

interface Props {
  /** @hide true */
  status?: "";
}

export async function loader(props: Props, req: Request, _ctx: AppContext) {
  if (!req.headers.get("Content-Type")) {
    req.headers.set("Content-Type", "application/x-www-form-urlencoded");
  }

  const form = await req.formData();
  const orderCode = `${form.get("orderCode") ?? ""}`;
  const packageCode = `${form.get("packageCode") ?? ""}`;

  try {
    if (!orderCode || !packageCode) {
      // You can return a status like "incomplete" if required
      return { ...props, status: "incomplete" };
    }

    const response = await fetch(
      `https://api.vnda.com.br/api/v2/orders/${orderCode}/packages/${packageCode}/trackings`,
    );

    // Check for a successful response (status code 200)
    if (response.status === 200) {
      const data = await response.json() as TrakingData;
      console.log("Traking response:", response.status);
      console.log("Traking response:", response);

      return {
        ...props,
        data,
        status: "success", // Indicate success
      };
    } else {
      return {
        ...props,

        status: "packageNotFound",
      };
    }
  } catch (error) {
    console.error("Error traking package:", error);
    return {
      ...props,
      status: "failed",
    };
  }
}

export default function TrackPackage(
  { data, status }: SectionProps<typeof loader>,
) {
  return (
    <div class="mt-20 max-w-[1440px] mx-auto flex flex-col items-center mb-10">
      <h2 class="text-2xl text-center font-bold">Rastreio</h2>
      <form
        hx-target="closest section"
        hx-swap="outerHTML"
        hx-post={useComponent(import.meta.url)}
        class="flex flex-col gap-3 mt-12"
        enctype="application/x-www-form-urlencoded"
      >
        <input
          class="input w-[360px] border border-primary"
          type="text"
          name="orderCode"
          placeholder="Insira o código do pedido"
          required
        />
        <input
          class="input w-[360px] border border-primary"
          type="text"
          name="packageCode"
          placeholder="Insira o código do pacote"
          required
        />
        <button type="submit" class="btn btn-primary w-[360px] ">
          enviar
        </button>
      </form>
      {status !== "incomplete" &&
        (status === "success"
          ? (
            <div class="max-w-[400px] mx-center my-20 flex flex-col">
              <h3 class="text-xl text-primary font-bold  text-center">
                Informações sobre o seu pedido
              </h3>

              <p class="text-sm font-semibold pt-2">Última atualização:</p>
              <p>{data.tracked_at}</p>

              <p class="text-sm font-semibold pt-2">Nome da Transportadora:</p>
              <p>{data.company}</p>

              <p class="text-sm font-semibold pt-2">
                Link do rastreamento do pedido na transportadora:
              </p>
              <p>{data.url}</p>
            </div>
          )
          : status === "packageNotFound"
          ? (
            <div class="max-w-[400px] mx-center my-20 flex flex-col">
              <h3 class="text-xl text-primary font-bold  text-center">
                Informações sobre o seu pedido
              </h3>

              <p class="pt-3 font-semibold text-center">
                Não encontramos o seu pedido
              </p>
            </div>
          )
          : null)}
    </div>
  );
}
