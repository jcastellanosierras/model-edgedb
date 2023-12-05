CREATE MIGRATION m1xerjic25sfyd6jmaz5pegoqshnqfwslmgvmptjfljabqqqjik5aa
    ONTO m17rwsgjtltt4smqsmgwquappdqaacfcw7epivgdi4sf4fah26jzga
{
  ALTER TYPE default::Product {
      ALTER PROPERTY barcode {
          RESET OPTIONALITY;
      };
  };
};
