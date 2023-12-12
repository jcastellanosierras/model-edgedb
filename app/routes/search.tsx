import { type Filter, FiltersMenu } from "@/components/filters-menu";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import ProductCard from "~/components/ProductCard";
// import { Hits, InstantSearch, SearchBox } from 'react-instantsearch'
import { json } from "@remix-run/node";
import { serverConfig } from "~/utils/typesense.server";
// import { useLoaderData } from "@remix-run/react";
// import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

export const loader = () => {
  return json({
    serverConfig
  })
}

type Product = {
  id: string;
  name: string;
  image: string;
}

const Filters = {
  NAME: "name",
  BACKEND: "backend",
  BRAND: "brand",
  LANG: "lang",
}

async function fetchProducts(
  search: string,
  setProducts: Dispatch<SetStateAction<Product[]>>,
  filters: string[] = []
) {
  try {
    const url = new URL("/api/products", 'http://localhost:3000')

    if (search) {
      url.searchParams.set("search", search)
    }

    filters.forEach((filter) => {
      url.searchParams.append("filter", filter)
    })

    const response = await fetch(url.toString());
    const json = await response.json();
    setProducts(json.products);
  } catch (error) {
    const e = error as Error;
    console.error(e.message);
  }
}

export default function () {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState<string>("")
  const [filters, setFilters] = useState<Filter[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  useEffect(() => {
    const newFilters: Filter[] = []
    Object.values(Filters).forEach((filter) => {
      const values: string[] = []
      for (const product of products) {
        if ((product as any)[filter] && !values.includes((product as any)[filter])) {
          values.push((product as any)[filter])
        }
      }

      newFilters.push({
        name: filter === 'name' ? 'full_name' : filter,
        subfilters: values
      })
    })

    setFilters(newFilters)
  }, [products])

  useEffect(() => {
    console.log(selectedFilters)
    fetchProducts(search, setProducts, selectedFilters)
  }, [search, selectedFilters])

  return (
    <>
      <div className="w-full h-[50px] bg-destructive flex justify-center items-center" id="searchbar">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Buscar productos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <main>
        <aside>
          <FiltersMenu filters={filters} setSelectedFilters={setSelectedFilters} />
        </aside>
        <section>
          <div id="products" className="w-full px-20 flex justify-center items-center flex-wrap">
            {products.length > 0 && products.map((product) => (
              <ProductCard
                key={product.id}
                hit={{
                  name: product.name,
                  image: product.image,
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

// export default function () {
//   const { serverConfig } = useLoaderData<typeof loader>()
//   console.log(TypesenseInstantSearchAdapter)
//   const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
//     server: {
//       ...serverConfig
//     },
//     additionalSearchParameters: {
//       query_by: 'full_name,backend,brand',
//       query_by_weights: '4,1,2',
//       group_by: 'deduplication_key'
//     },
//   })
//   console.log(typesenseInstantSearchAdapter)

//   return (
//     <>
//       <InstantSearch indexName="products" searchClient={typesenseInstantSearchAdapter.searchClient}></InstantSearch>

//       <div className="flex">
//         <aside className="w-1/3 bg-gray-50 h-screen">

//         </aside>

//         <main>
//           <SearchBox />
//           <Hits hitComponent={ProductCard} />
//           Main content
//         </main>
//       </div>
//     </>
//   )
// }