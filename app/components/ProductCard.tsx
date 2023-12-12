/**
 * v0 by Vercel.
 * @see https://v0.dev/t/BDOsqJAiuKw
 */
import { Button } from "@/components/ui/button"
import { CardContent, Card } from "@/components/ui/card"

interface Props {
  hit: {
    name: string;
    image: string;
  };
}

export default function ProductCard ({
  hit: {
    name,
    image,
  }
}: Props) {
  return (
    <Card className="flex flex-col pt-10 items-center border rounded-lg overflow-hidden shadow-lg max-w-xs mx-auto">
      <img
        alt={`Imagen del producto ${name}`}
        className="object-cover object-center"
        height="150"
        src={image}
        style={{
          aspectRatio: "150/150",
          objectFit: "cover",
        }}
        width="150"
      />
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">{name}</h2>
        {/* <p className="text-gray-700 dark:text-gray-300 mb-4">$99.99</p> */}
        <Button className="w-full" variant="default">
          Comprar ahora
        </Button>
      </CardContent>
    </Card>
  )
}

