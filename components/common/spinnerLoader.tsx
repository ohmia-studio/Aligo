'use client';
import { Spinner } from '@/components/ui/spinner';
import { AnimatePresence, motion } from 'framer-motion';

export function SpinnerLoader({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Spinner className="text-base-color h-16 w-16" />
            <p className="text-base-color mt-4 text-lg font-medium">
              Procesando...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
