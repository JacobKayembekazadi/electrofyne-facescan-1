import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
    <Card className="bg-card">
      <CardHeader className="space-y-1 px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Recommended Products</CardTitle>
        <CardDescription>
          Based on your skin analysis, we recommend these products
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-3 sm:p-4">
                <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-accent/5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2 text-base sm:text-lg">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-medium text-base sm:text-lg">${product.price}</span>
                    <Button size="sm" className="min-h-[40px] px-4">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/products">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto min-h-[48px] px-8"
            >
              View All Recommendations
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}