with language := <fts::Language>$language,
website := <Website>$website,
products := (
  select Product filter .language = language and .web = website
),
res := (
  select fts::search(products, 'cinturon elastico', language := <str>language)
),
products_res := (
  select res.object { name, description, deduplication_key, score := res.score }
  filter res.score > 0.6
  order by res.score desc
),
group products_res {name} using score := .score by .deduplication_key, score;