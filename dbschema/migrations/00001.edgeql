CREATE MIGRATION m173d5k4l5uhyh5l6dpqxxghbvgqckyu5izgiggmvqjfbnqr4utbvq
    ONTO initial
{
  CREATE SCALAR TYPE default::Website EXTENDING enum<DavidMoran, Ubrimaq>;
  CREATE TYPE default::Product {
      CREATE PROPERTY brand: std::str;
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY language: fts::Language;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE INDEX fts::index ON ((fts::with_options(.name, language := .language), fts::with_options(.description, language := .language), fts::with_options(.brand, language := .language)));
      CREATE PROPERTY barcode: std::str;
      CREATE PROPERTY category: std::str;
      CREATE REQUIRED PROPERTY deduplication_key: std::str;
      CREATE PROPERTY url: std::str;
      CREATE REQUIRED PROPERTY web: default::Website;
  };
};
