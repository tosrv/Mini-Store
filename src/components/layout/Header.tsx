"use client";

// import { useCart } from "@/context/CartContext";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { supabase } from "@/lib/supabase/client";
import { LogoutButton } from "../auth/logout-button";
import { useCartStore } from "@/store/cart-store";
import ProductSearch from "../product/Search";

export default function Header() {
  const cart = useCartStore((state) => state.cart);
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const params = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.get("q") ?? "");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const submitSearch = () => {
    const p = new URLSearchParams(params.toString());
    searchQuery ? p.set("q", searchQuery) : p.delete("q");
    router.push(`/?${p.toString()}`);
  };

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();

      if (!error) {
        const user = data.name.trim().split(" ")[0];
        setUser(user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const isActivePath = (path: string) => pathname === path;

  const navItems = [{ href: "/contact", label: "Contact" }];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8 lg:space-x-12">
            <Link
              className="text-2xl tracking-tight text-gray-900 hover:text-gray-700 transition-colors"
              href="/"
              aria-label="YellowShop Home"
            >
              YELLOW<span className="text-primary">SHOP</span>
            </Link>

            <nav
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`relative py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePath(href)
                      ? "bg-orange-100 shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <ProductSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={submitSearch}
            className="hidden lg:flex"
          />

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-700" />
            </button>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-gray-900 transition-colors" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
                  aria-label={`${cartCount} items in cart`}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="text-sm">
                    {user}
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" variant="default" className="text-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="flex justify-center">
            <ProductSearch
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={submitSearch}
              className="lg:hidden mt-4"
            />
          </div>
        )}

        {isMobileOpen && (
          <nav
            className="md:hidden mt-4 animate-in slide-in-from-top duration-200"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-3 pb-4 border-b border-gray-200">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                    isActivePath(href)
                      ? "bg-orange-100"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  aria-current={isActivePath(href) ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="flex flex-col space-y-3 pt-4 sm:hidden">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href="/profile" onClick={closeMobileMenu}>
                    Profile
                  </Link>
                </Button>

                <LogoutButton />
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4 sm:hidden">
                <Button variant="outline" className="w-full text-sm" asChild>
                  <Link href="/auth/login" onClick={closeMobileMenu}>
                    Sign In
                  </Link>
                </Button>
                <Button className="w-full text-sm" variant="default" asChild>
                  <Link href="/auth/sign-up" onClick={closeMobileMenu}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
