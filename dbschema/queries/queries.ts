// GENERATED by @edgedb/generate v0.4.1

import type {Executor} from "edgedb";

export type SearchProductsArgs = {
  "language": ("ara" | "hye" | "eus" | "cat" | "dan" | "nld" | "eng" | "fin" | "fra" | "deu" | "ell" | "hin" | "hun" | "ind" | "gle" | "ita" | "nor" | "por" | "ron" | "rus" | "spa" | "swe" | "tur");
  "website": ("DavidMoran" | "Ubrimaq");
  "search": string;
};

export type SearchProductsReturns = {
  "key": {
    "score": number;
    "deduplication_key": string;
  };
  "grouping": string[];
  "elements": {
    "name": string;
    "brand": string | null;
    "medium_image_url": string | null;
  }[];
}[];

export async function searchProducts(client: Executor, args: SearchProductsArgs): Promise<SearchProductsReturns> {
  return client.query(`\
with language := <fts::Language>$language,
website := <Website>$website,
products := (
  select Product filter .language = language and .web = website
),
res := (
  select fts::search(products, <str>$search, language := <str>language)
),
products_res := (
  select res.object { name, description, deduplication_key, score := res.score }
  filter res.score > 0.6
  order by res.score desc
),
select (group products_res { name, brand, medium_image_url } using score := .score by .deduplication_key, score)
order by .key.score desc;`, args);

}
