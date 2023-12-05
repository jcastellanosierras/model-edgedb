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
};

const FieldsMap = {
  name: 1,
  language: 4,
  brand: 6,
  deduplication_key: 10,
};

export async function action({ request }: ActionFunctionArgs) {
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: 7000000,
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
    };

    products.push(product);
  }

  for (const product of products) {
    const query = `
      INSERT Product {
        name := <str>"${product.name}",
        language := <fts::Language>"${product.language}",
        web := <Website>"${product.website}",
        brand := <str>"${product.brand}",
        deduplication_key := <str>"${product.deduplication_key}"
      }
    `;

    try {
      await client.query(query);
    } catch {
      console.log(product);
    }
  }

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
      <button type="submit">Enviar</button>
    </Form>
  );
}

