
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => router.push("/login"), 800);
    }, 2000); // Shortened for a faster feel
    return () => clearTimeout(timer);
  }, [router]);

  const logo = PlaceHolderImages.find((img) => img.id === "college-logo");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                boxShadow: ["0 0 0px #2E5CB8", "0 0 40px #2E5CB8", "0 0 0px #2E5CB8"]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse",
                scale: { duration: 1, ease: "easeOut" }
              }}
              className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden bg-white shadow-2xl"
            >
              {logo && (
                <Image
                  src={logo.imageUrl}
                  alt={logo.description}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  data-ai-hint={logo.imageHint}
                />
              )}
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-4xl font-headline font-bold text-primary mb-2">
                Balmiki Lincoln College
              </h1>
              <p className="text-xl text-muted-foreground font-medium tracking-wide">
                EduScan Attendance System
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex justify-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
