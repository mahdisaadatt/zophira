'use client'

import Image from 'next/image'
import { useStore } from '@/store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProductDetailDialogProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    image: string
  }
  isOpen: boolean
  onClose: () => void
}

export default function ProductDetailDialog({
  product,
  isOpen,
  onClose
}: ProductDetailDialogProps) {
  const addToCart = useStore((state) => state.addToCart)

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: 1 })
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl overflow-hidden bg-secondary backdrop-opacity-80">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                <DialogDescription className="text-lg font-semibold text-primary">
                  {product.price.toLocaleString('fa-IR')} تومان
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="relative h-80 md:h-96 overflow-hidden rounded-lg"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                      className="text-foreground/70 leading-relaxed"
                    >
                      {product.description}
                    </motion.p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      افزودن به سبد خرید
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
