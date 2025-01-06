import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductRecommendationsProps {
  results: {
    skinType: string;
    concerns: string[];
  };
}

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Gentle Cleansing Foam",
    description: "Perfect for sensitive and combination skin types",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1600417098578-1e858e93dc88",
  },
  {
    id: 2,
    name: "Hydrating Serum",
    description: "Deeply moisturizes and improves skin texture",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
  },
  {
    id: 3,
    name: "Balancing Moisturizer",
    description: "Helps maintain optimal hydration levels",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1591130901921-3f0652bb3915",
  },
];

export default function ProductRecommendations({ results }: ProductRecommendationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Products</CardTitle>
        <CardDescription>
          Based on your skin analysis, we recommend these products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">${product.price}</span>
                  <Button>Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
