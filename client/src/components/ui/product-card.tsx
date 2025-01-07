import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  productUrl: string;
}

export function ProductCard({
  name,
  description,
  price,
  imageUrl,
  productUrl,
}: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="object-cover w-full h-full"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{name}</CardTitle>
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
        <p className="font-bold">{price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <a href={productUrl} className="w-full">
          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" />
            View Product
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
