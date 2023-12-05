import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { searchProducts } from "dbschema/queries/queries";
import { client } from "~/utils/db.server";

export async function loader ({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""

  const response = await searchProducts(client, {
    language: "spa",
    website: "DavidMoran",
    search,
  })

  const products = response.map((group) => {
    const [firstProduct] = group.elements
    return {
      name: firstProduct.name,
      image: firstProduct.medium_image_url,
    }
  })

  console.log(products)

  return json({
    products
  })
}