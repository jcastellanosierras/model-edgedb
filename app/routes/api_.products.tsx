import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { typesenseAdmin } from "~/utils/typesense.server";
import z from 'zod'

const productSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  medium_image_url: z.string(),
  brand: z.string(),
  lang: z.enum(['spa', 'eng']),
  backend: z.string()
})

export async function loader ({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const filters = searchParams.getAll("filter")
  console.log(filters)
  console.log(filters.join(' && '))

  const filter = filters.join('&&').replace(/\(/g, "").replace(/\)/g, "")
  console.log(filter)

  const response = await typesenseAdmin.collections('products').documents().search({
    q: search,
    query_by: 'full_name, backend, brand',
    group_by: 'deduplication_key',
    filter_by: filter,
    use_cache: true,
  })

  if (
    !response.grouped_hits ||
    response.grouped_hits.length === 0  
  ) {
    return json({
      products: []
    })
  }

  const products = []
  for (const product of response.grouped_hits) {
    const firstProduct = product.hits[0].document
    
    let validateProduct
    try {
      validateProduct = productSchema.parse(firstProduct)
    } catch (e) {
      const error = e as Error
      console.error(error)
      continue
    }

    products.push({
      id: validateProduct.id,
      name: validateProduct.full_name,
      image: validateProduct.medium_image_url,
      brand: validateProduct.brand,
      lang: validateProduct.lang,
      backend: validateProduct.backend
    })
  }

  console.log(products)
  return json({
    products
  })
}