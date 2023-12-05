CREATE MIGRATION m1vovo6dvle44yiwzwjwujerurpcugktl5nwbjg5zpgiauxcnpjqka
    ONTO m1xerjic25sfyd6jmaz5pegoqshnqfwslmgvmptjfljabqqqjik5aa
{
  ALTER TYPE default::Product {
      CREATE REQUIRED PROPERTY deduplication_key: std::str {
          SET REQUIRED USING (<std::str>{});
      };
  };
};
