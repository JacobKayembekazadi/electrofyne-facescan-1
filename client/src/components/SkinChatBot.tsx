import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Scan } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/ui/product-card";
import { Link } from "wouter";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Product data with detailed information
const PRODUCTS = {
  "LED Face Mask": {
    name: "LED Face Mask",
    description: "Advanced light therapy for deep cleansing and skin rejuvenation",
    price: "$299.99",
    imageUrl: "/products/led-face-mask.jpg",
    productUrl: "/products/led-face-mask"
  },
  "Facial Sculptor": {
    name: "Facial Sculptor",
    description: "Premium facial massager for improved circulation and skin toning",
    price: "$149.99",
    imageUrl: "/products/facial-sculptor.jpg",
    productUrl: "/products/facial-sculptor"
  },
  "Hydrating Facial Toner": {
    name: "Hydrating Facial Toner",
    description: "Alcohol-free toner for deep hydration and skin balancing",
    price: "$39.99",
    imageUrl: "/products/hydrating-toner.jpg",
    productUrl: "/products/hydrating-toner"
  }
};

// Function to check if message suggests face scan
function shouldShowScanButton(text: string): boolean {
  const scanKeywords = [
    "skin analysis",
    "face scan",
    "analyze your skin",
    "scan your face",
    "start scanning",
    "take a photo",
  ];
  return scanKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

// Function to format messages and create product cards
function formatMessageContent(text: string) {
  const productCards: JSX.Element[] = [];
  const mentionedProducts = new Set<string>();

  // Find all mentioned products
  Object.keys(PRODUCTS).forEach(productName => {
    if (text.includes(productName)) {
      mentionedProducts.add(productName);
    }
  });

  // Create product cards for mentioned products
  Array.from(mentionedProducts).forEach((productName, index) => {
    const productData = PRODUCTS[productName as keyof typeof PRODUCTS];
    productCards.push(
      <motion.div
        key={`product-${index}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
        className="my-2"
      >
        <ProductCard {...productData} />
      </motion.div>
    );
  });

  return (
    <div>
      <div className="mb-4">{text}</div>
      {shouldShowScanButton(text) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <Link href="/analysis">
            <Button className="w-full">
              <Scan className="mr-2 h-4 w-4" />
              Start Face Scan
            </Button>
          </Link>
        </motion.div>
      )}
      {productCards.length > 0 && (
        <div className="mt-4 space-y-4">
          <div className="text-sm font-medium text-muted-foreground">Recommended Products:</div>
          {productCards}
        </div>
      )}
    </div>
  );
}

export default function SkinChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your skin care assistant. I can help diagnose your skin concerns and provide personalized recommendations. Would you like to start with a quick skin analysis?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }]
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the chatbot. Please try again.",
        variant: "destructive",
      });
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex mb-4 ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "assistant"
                      ? "bg-muted text-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {message.role === "assistant"
                    ? formatMessageContent(message.content)
                    : message.content}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start mb-4"
              >
                <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}