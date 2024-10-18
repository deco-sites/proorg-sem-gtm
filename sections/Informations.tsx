import { HTMLWidget } from "apps/admin/widgets.ts";

interface Props {
  /**
   * @title Título
   */
  title: string;
  /**
   * @title Texto
   * @description Escrever e estilizar o texto na caixa abaixo. Apenas a cor do texto que é a do padrão do site */
  text: HTMLWidget;
}

export default function Informations({ title, text }: Props) {
  return (
    <div class="max-w-[1200px] text-secondary mx-auto min-h-[350px] pt-12">
      <h2 class="text-center text-3xl font-bold mt-10">{title}</h2>
      <div
        class="mx-10 my-8"
        dangerouslySetInnerHTML={{ __html: text }}
      >
      </div>
    </div>
  );
}
