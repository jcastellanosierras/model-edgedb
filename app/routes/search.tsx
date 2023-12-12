import { type Filter, FiltersMenu } from "@/components/filters-menu";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import ProductCard from "~/components/ProductCard";
import { json } from "@remix-run/node";
import { serverConfig } from "~/utils/typesense.server";
import { Pagination } from "@/components/pagination";

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
  setProducts: Dispatch<SetStateAction<Product[]>>,
  setCount: Dispatch<SetStateAction<number>>,
  params: {
    search: string,
    filters?: string[],
    limit?: number,
    offset?: number
  }
) {
  try {
    const url = new URL("/api/products", 'http://localhost:3000')

    if (params.search) {
      url.searchParams.set("search", params.search)
    }

    params.filters?.forEach((filter) => {
      url.searchParams.append("filter", filter)
    })

    if (params.limit) {
      url.searchParams.set("limit", params.limit.toString())
    }

    if (params.offset) {
      url.searchParams.set("offset", params.offset.toString())
    }

    const response = await fetch(url.toString());
    const json = await response.json();
    setProducts(json.products);
    setCount(json.length);
  } catch (error) {
    const e = error as Error;
    console.error(e.message);
  }
}

export default function () {
  const [count, setCount] = useState<number>(0)
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState<string>("")
  const [filters, setFilters] = useState<Filter[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [limit, setLimit] = useState<number>(10)
  const [offset, setOffset] = useState<number>(0)

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
    // Reinciamos el offset para no acabar en una página vacía
    setOffset(0)
  }, [search])

  useEffect(() => {
    fetchProducts(setProducts, setCount, {
      search: search,
      filters: selectedFilters,
      limit: limit,
      offset: offset * limit
    })
  }, [search, selectedFilters, limit, offset])

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
          <Pagination
            count={count}
            limit={limit}
            onLimitChange={(value) => setLimit(value)}
            offset={offset}
            onOffsetChange={(value) => setOffset(value)}
          />
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
