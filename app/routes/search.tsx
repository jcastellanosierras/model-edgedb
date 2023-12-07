import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import ProductCard from "~/components/ProductCard";

type Product = {
  name: string;
  image: string;
}

async function fetchProducts(search: string, setProducts: Dispatch<SetStateAction<Product[]>>) {
  try {
    const response = await fetch(`/api/products?search=${search}`);
    const json = await response.json();
    setProducts(json.products);
  } catch (error) {
    console.error(error);
  }
}

export default function () {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState<string>("")

  useEffect(() => {
    fetchProducts(search, setProducts)
  }, [search])

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

      <div id="products" className="w-full px-20 flex justify-center items-center flex-wrap">
        {products.length > 0 && products.map((product) => (
          <ProductCard
            key={product.name}
            name={product.name}
            image={product.image}
          />
        ))}
      </div>
    </>
  )
}