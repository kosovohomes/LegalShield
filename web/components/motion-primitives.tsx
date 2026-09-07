"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

export const FadeIn = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { delay?: number; y?: number }>(
  function FadeIn({ delay = 0, y = 12, className, children, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE, delay }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

export const Stagger = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { stagger?: number }>(
  function Stagger({ stagger = 0.06, className, children, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

export const StaggerItem = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  function StaggerItem({ className, children, ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        variants={{
          hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
          show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
        }}
        className={cn(className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);
