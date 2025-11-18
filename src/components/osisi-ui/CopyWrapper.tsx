"use client";
import React, {
  ReactElement,
  cloneElement,
  useState,
  MouseEvent,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CopyWrapperProps {
  textToCopy: string;
  children: ReactElement<{ onClick?: (e: MouseEvent) => void }>;
  onCopy?: () => void;
}

export const CopyWrapper: React.FC<CopyWrapperProps> = ({
  textToCopy,
  children,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClick = async (e: MouseEvent) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }

    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  return (
    <div className="relative inline-block">
      {cloneElement(children, {
        onClick: handleClick,
      })}

      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: -16 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute left-1/2 -translate-x-1/2 bottom-2 text-xs bg-black text-white rounded px-2 py-1 z-50"
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
