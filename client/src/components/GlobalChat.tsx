import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { motion, AnimatePresence } from "framer-motion";
import SkinChatBot from "./SkinChatBot";

export default function GlobalChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          size="icon"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="mx-auto w-full max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DrawerHeader className="flex justify-between items-center border-b pb-2 mb-4">
                <DrawerTitle>Skin Care Assistant</DrawerTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-destructive/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5 text-destructive" />
                </Button>
              </DrawerHeader>
              <SkinChatBot />
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}