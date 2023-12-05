module default {
  scalar type Website extending enum<DavidMoran, Ubrimaq>;

  type Product {
    required name: str;
    barcode: str;
    description: str;
    category: str;
    url: str;
    brand: str;
    
    required deduplication_key: str;

    required language: fts::Language;
    required web: Website;

    index fts::index on ((
      fts::with_options(
        .name,
        language := .language,
      ),
      fts::with_options(
        .description,
        language := .language,
      ),
      fts::with_options(
        .brand,
        language := .language,
      ),
      # como se hace esto?
      #fts::with_options(
      #    .keywords,
      #    language := fts::Language.eng,
      #)
    ));
  };
}
        
