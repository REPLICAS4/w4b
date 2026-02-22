import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

import R1 from "@/assets/demo/R1.png";
import R2 from "@/assets/demo/R2.png";
import R3 from "@/assets/demo/R3.png";
import R4 from "@/assets/demo/R4.png";
import R5 from "@/assets/demo/R5.png";
import R6 from "@/assets/demo/R6.png";

const images = [R1, R2, R3, R4, R5, R6];
// Duplicate for seamless infinite scroll
const allImages = [...images, ...images];

const DemoSlideshow = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-8 text-center"
      >
        <p className="font-mono text-sm tracking-[0.3em] uppercase text-primary">
          PLATFORM PREVIEW
        </p>
      </motion.div>

      <div className="relative w-full overflow-hidden">
        <div className="flex animate-slide-left gap-6 w-max">
          {allImages.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[500px] md:w-[700px] rounded-lg overflow-hidden border border-border/50 shadow-lg"
            >
              <img
                src={src}
                alt={`Demo screenshot ${(i % images.length) + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DemoSlideshow;
