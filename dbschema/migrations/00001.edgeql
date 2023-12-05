CREATE MIGRATION m17rwsgjtltt4smqsmgwquappdqaacfcw7epivgdi4sf4fah26jzga
    ONTO initial
{
  CREATE SCALAR TYPE default::Website EXTENDING enum<DavidMoran, Ubrimaq>;
  CREATE TYPE default::Product {
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY language: fts::Language;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE INDEX fts::index ON ((fts::with_options(.name, language := .language), fts::with_options(.description, language := .language)));
      CREATE REQUIRED PROPERTY barcode: std::str;
      CREATE PROPERTY category: std::str;
      CREATE PROPERTY url: std::str;
      CREATE REQUIRED PROPERTY web: default::Website;
  };
};
