import { Button } from "@/components/ui/button";
import {
  type ActionFunctionArgs,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import React, { useState } from "react";
import { client } from "~/utils/db.server";

// export async function action ({ request }: ActionFunctionArgs) {
//   const uploadHandler = unstable_createMemoryUploadHandler({
//     maxPartSize: 6000000,
//   })
//   const formData = await unstable_parseMultipartFormData(request, uploadHandler)

//   const file = formData.get('file') as File;
//   const textFile = await file.text()

//   const parser = parse({
//     delimiter: '\t',
//     columns: true,
//     skip_empty_lines: true,
//     quote: '"'
//   })

//   parser.on('readable', () => {
//     let record
//     while ((record = parser.read())) {
//       console.log(record)
//     }
//   })

//   parser.on('error', (err) => {
//     console.error(err.message)
//   })

//   parser.on('end', () => {
//     console.log('TSV file successfully processed')
//   })

//   parser.write(textFile)

//   parser.end()

//   // await syncronizeAlgoliaWithEdgeDB()

//   return redirect('/')
// }

type Product = {
  name: string;
  barcode?: string;
  description?: string;
  category?: string;
  url?: string;
  website: string;
  language?: "eng" | "spa";
  brand?: string;
  deduplication_key: string;
  medium_image_url?: string;
};

const FieldsMap = {
  name: 2,
  language: 6,
  brand: 8,
  deduplication_key: 3,
  medium_image_url: 11
};

export async function action({ request }: ActionFunctionArgs) {
  console.log('hola')
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

  for (const line of lines) {
    const product: Product = {
      name: line[FieldsMap.name],
      language: line[FieldsMap.language] as "eng" | "spa",
      website: "DavidMoran",
      brand: line[FieldsMap.brand],
      deduplication_key: line[FieldsMap.deduplication_key],
      medium_image_url: line[FieldsMap.medium_image_url]
    };

    products.push(product);
  }

  for (const line of lines) {
    const product: Product = {
      name: line[FieldsMap.name],
      language: line[FieldsMap.language] as "eng" | "spa",
      website: "Ubrimaq",
      brand: line[FieldsMap.brand],
      deduplication_key: line[FieldsMap.deduplication_key],
      medium_image_url: line[FieldsMap.medium_image_url]
    };

    products.push(product);
  }

  console.time('Productos subidos 😎')
  for (const product of products) {
    const query = `
      INSERT Product {
        name := <str>"${product.name}",
        language := <fts::Language>"${product.language}",
        web := <Website>"${product.website}",
        brand := <str>"${product.brand}",
        deduplication_key := <str>"${product.deduplication_key}",
        medium_image_url := <str>"${product.medium_image_url}"
      }
    `;

    try {
      await client.query(query);
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

