'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import {
  ShoppingCart,
  Search,
  X,
  Menu,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStore } from '@/store/useStore';

interface Product {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
}

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useStore(state => state.cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/products/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error('خطا در جستجو');
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setLogoutOpen(false);
    toast.success('با موفقیت خارج شدید');
    router.push('/');
  };

  return (
    <nav className="relative border-b border-border/40 bg-white z-50">
      {/* Main Navbar Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20">
          <div className="flex items-center lg:w-[240px]">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden relative -mr-2 self-center focus:outline-none"
            >
              <div
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:bg-primary/10`}
              >
                {/* Hamburger icon */}
                <div className="relative h-4 w-6">
                  {/* Top bar */}
                  <span
                    className={`absolute left-0 bg-black top-1/2 block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? '-translate-y-1/2 rotate-45'
                        : '-translate-y-[4px]'
                    }`}
                  />
                  {/* Bottom bar */}
                  <span
                    className={`absolute left-0 bg-black top-1/2 block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ease-in-out ${
                      isMobileMenuOpen
                        ? '-translate-y-1/2 -rotate-45'
                        : 'translate-y-[4px]'
                    }`}
                  />
                </div>
              </div>
            </button>

            <Link
              href="/"
              className="text-2xl font-bold gradient-text mr-2 self-center"
            >
              <Image
                src="/images/logotype.svg"
                alt="لوگوی زوفیرا"
                width={96}
                height={48}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div
            className="hidden lg:flex flex-1 items-center justify-center space-x-reverse space-x-2 relative"
            onMouseLeave={() => setHoveredItem(null)}
          >
            <AnimatePresence>
              {[
                { href: '/products', label: 'محصولات' },
                { href: '/about', label: 'درباره ما' },
                { href: '/contact', label: 'تماس با ما' },
                { href: '/blog', label: 'وبلاگ' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-md font-medium text-foreground/80 transition-colors hover:text-foreground z-10"
                  onMouseEnter={() => setHoveredItem(item.href)}
                >
                  {item.label}
                  {hoveredItem === item.href && (
                    <motion.div
                      className="absolute inset-0 -z-10 bg-primary/10 rounded-md"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                    />
                  )}
                </Link>
              ))}
            </AnimatePresence>
          </div>

          {/* آیکون‌های جستجو، سبد خرید و کاربر */}
          <div className="flex flex-1 lg:flex-none items-center lg:w-[240px] justify-end">
            <div className="flex items-center border border-border/50 rounded-full bg-secondary/20">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 cursor-pointer hover:bg-primary/10 transition-colors duration-200 rounded-r-full"
              >
                <Search className="h-5 w-5 text-foreground/80" />
              </button>

              {isClient && (
                <Link
                  href="/cart"
                  className="relative p-3 border-r border-border/50 hover:bg-primary/10 transition-colors duration-200"
                >
                  <ShoppingCart className="h-5 w-5 text-foreground/80" />
                  {itemCount > 0 && (
                    <span className="absolute z-10 top-1 right-0.5 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium">
                      {itemCount}
                    </span>
                  )}
                </Link>
              )}

              {isClient &&
                (session ? (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="p-3 border-r cursor-pointer border-border/50 hover:bg-primary/10 transition-colors duration-200 rounded-l-full">
                      <User className="h-5 w-5 text-foreground/80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <div className="px-2 py-1.5 text-sm font-medium">
                        {session.user?.name || 'کاربر'}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <User className="w-4 h-4" />
                          <span>پروفایل</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                        onClick={() => setLogoutOpen(true)}
                      >
                        <LogOut className="w-4 h-4" />
                        <span>خروج</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="p-3 border-r cursor-pointer border-border/50 hover:bg-primary/10 transition-colors duration-200 rounded-l-full">
                      <User className="h-5 w-5 text-foreground/80" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href="/login"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>ورود</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/register"
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>ثبت‌نام</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
            </div>
          </div>
          {/* Logout Confirmation Dialog */}
          <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
            <AlertDialogContent onOverlayClick={() => setLogoutOpen(false)}>
              <AlertDialogHeader>
                <AlertDialogTitle>خروج از حساب</AlertDialogTitle>
                <AlertDialogDescription>
                  آیا از خروج از حساب کاربری خود مطمئن هستید؟
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-start sm:flex-row-reverse gap-2">
                <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
                  خروج
                </AlertDialogAction>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Mobile Menu - Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="absolute top-full left-0 w-full bg-white lg:hidden border-b border-border/40 shadow-lg z-40"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-2 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
              <Link
                href="/products"
                className="block px-4 py-2 text-base rounded-md hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                محصولات
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-base rounded-md hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                درباره ما
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-base rounded-md hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تماس با ما
              </Link>
              <Link
                href="/blog"
                className="block px-4 py-2 text-base rounded-md hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                وبلاگ
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      {isSearchOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={handleCloseSearch}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" />
          </div>
          <div className="fixed inset-x-0 top-0 z-[51] border-b border-border/40 bg-white/80 backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center">
              <div
                className="relative flex-1 max-w-2xl mx-auto"
                onClick={e => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="جستجو در محصولات..."
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-right pr-12 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
                  autoFocus
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      e.preventDefault();
                      router.push(`/products?search=${searchQuery}`);
                      handleCloseSearch();
                    }
                  }}
                />
                {isLoading ? (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-r-transparent" />
                  </div>
                ) : (
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                )}
                {suggestions.length > 0 && (
                  <div
                    className="absolute mt-2 w-full bg-white rounded-lg border border-border/40 shadow-lg animate-in fade-in-50 slide-in-from-top-2 duration-200"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="p-2">
                      {suggestions.map(product => (
                        <Link
                          key={product.id}
                          href={`/products/${product.slug}`}
                          className="w-full text-right px-4 py-2 text-sm rounded-md hover:bg-secondary/50 focus:bg-secondary/50 focus:outline-none transition-colors flex items-center gap-4"
                          onClick={handleCloseSearch}
                        >
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={30}
                            height={30}
                            className="rounded-md object-contain"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleCloseSearch();
                }}
                className="mr-4 p-2 cpoi rounded-full hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <X className="h-5 w-5 text-foreground/80" />
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
