import { Button } from "@/components/ui/button";
import {
  type ActionFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { typesenseAdmin } from "~/utils/typesense.server";

type Product = {
  odoo_id: number;
  default_code: string;
  full_name: string;
  deduplication_key: string;
  barcode?: string;
  description?: string;
  category?: string;
  url_key: string;
  backend: string;
  lang: "eng" | "spa";
  brand?: string;
  medium_image_url?: string;
  small_image_url?: string;
  index: string;
};

const FieldsMap = {
  default_code: 0,
  full_name: 2,
  lang: 6,
  brand: 8,
  index: 9,
  deduplication_key: 3,
  url_key: 3,
  small_image_url: 10,
  medium_image_url: 11,
};

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 13000000,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const file = formData.get("file") as File;
  const textFile = await file.text();

  const array = textFile.split("\n");
  array.shift();

  if (array[array.length - 1] === "") array.pop();

  const lines = array.map((line) => line.replace("\r", "").split("\t"));

  const products: Product[] = [];

  let cont = 0
  for (const line of lines) {
    const product: Product = {
      odoo_id: cont,
      default_code: line[FieldsMap.default_code],
      full_name: line[FieldsMap.full_name],
      lang: line[FieldsMap.lang] as "eng" | "spa",
      index: line[FieldsMap.index],
      backend: "DavidMoran",
      brand: line[FieldsMap.brand],
      url_key: line[FieldsMap.url_key],
      deduplication_key: line[FieldsMap.deduplication_key],
      small_image_url: line[FieldsMap.small_image_url],
      medium_image_url: line[FieldsMap.medium_image_url]
    };

    products.push(product);
    cont++
  }

  for (const line of lines) {
    const product: Product = {
      odoo_id: cont,
      default_code: line[FieldsMap.default_code],
      full_name: line[FieldsMap.full_name],
      lang: line[FieldsMap.lang] as "eng" | "spa",
      index: line[FieldsMap.index],
      backend: "Ubrimaq",
      brand: line[FieldsMap.brand],
      url_key: line[FieldsMap.url_key],
      deduplication_key: line[FieldsMap.deduplication_key],
      small_image_url: line[FieldsMap.small_image_url],
      medium_image_url: line[FieldsMap.medium_image_url]
    };

    products.push(product);
    cont++
  }

  console.time('Productos subidos 😎')
  for (const product of products) {
    try {
      await typesenseAdmin
        .collections('products')
        .documents()
        .create(product)
    } catch (e) {
      const error = e as Error
      console.log(error.message)
    }
  }
  console.timeEnd('Productos subidos 😎')

  return null;
}

export default function () {
  const [tsvFile, setTsvFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setTsvFile(file);
  };

  return (
    <Form method="post" encType="multipart/form-data">
      <input
        type="file"
        name="file"
        accept=".tsv"
        onChange={handleFileChange}
        required
      />

      {/* Otros campos del formulario */}
      <Button type="submit">Enviar</Button>
    </Form>
  );
}

