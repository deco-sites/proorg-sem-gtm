// import { ProductDetailsPage } from "apps/commerce/types.ts";

// export interface Props {
//   /** @title Integration */
//   page: ProductDetailsPage | null;
// }

// const mockReview = {
//   reviews: [
//     {
//       _id: "337892",
//       aggregateRating: 4.6,
//       recommendedPercentage: 100,
//       reviewCount: 13,
//       reviews: [
//         {
//           _id: "612a928939ff8f181675bae8",
//           customer: "tokstok",
//           sku: "337892",
//           name: "Bruna Hellen dos Santos Renalvo",
//           rating: 5,
//           text: "Simplesmente encantada com o resultado.",
//           helpful: 4,
//           unhelpful: 0,
//           verified: false,
//           created: "2020-08-30T11:32:11.000Z",
//           status: "published",
//           recommended: true,
//           updated: "2021-12-01T23:08:09.432Z",
//         },
//         {
//           _id: "612a928939ff8f181675bae9",
//           customer: "johndoe",
//           sku: "337892",
//           name: "Elisalda de De Melo Miranda",
//           rating: 3,
//           text: "Ótimo produto,.eu cabelo está crescendo muito.",
//           helpful: 2,
//           unhelpful: 1,
//           verified: true,
//           created: "2021-01-15T10:45:30.000Z",
//           status: "published",
//           recommended: true,
//           updated: "2021-12-02T15:12:00.432Z",
//         },
//       ],
//     },
//   ],
// };

export default function ReviewPDP() {
  // if (!page || !page.product) return null;

  // function formatDate(dateString: string) {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString("pt-BR");
  // }

  return (
    <div class="hidden md:flex  xl:px-[132px] md:w-[1440px]  mx-auto text-primary pt-10 mb-8">
      <div>
        <div class="konfidency-reviews-details"></div>
      </div>

      <script
        async
        src="https://reviews.konfidency.com.br/progressivaorganica/loader.js"
      />
    </div>
  );
}
