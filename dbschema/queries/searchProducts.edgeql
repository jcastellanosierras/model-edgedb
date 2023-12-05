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
order by .key.score desc;