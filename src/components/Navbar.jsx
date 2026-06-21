'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { Menu, X, User, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSession, signOut } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Handle escape key closure for dropdowns & mobile menu
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully logged out");
            setIsDropdownOpen(false);
            router.push("/");
            router.refresh();
          }
        }
      });
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const isPremium = user?.plan === 'user_premium' || user?.role === 'admin';

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Public Lessons', href: '/lessons' },
  ];

  if (user) {
    menuItems.push({ label: 'Add Lesson', href: '/dashboard/add-lesson' });
    menuItems.push({ label: 'My Lessons', href: '/dashboard/my-lessons' });
    menuItems.push({ label: 'Dashboard', href: '/dashboard' });
  }

  if (!user || !isPremium) {
    menuItems.push({ label: 'Pricing', href: '/plans' });
  }

  return (
    <nav aria-label="Main Navigation" className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/40 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md outline-none px-1">
              <span className="font-bold text-xl tracking-tight text-zinc-900 dark:text-white font-headline">
                Lexmora
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden sm:flex items-center gap-8 h-full">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <div key={item.label} className="relative flex items-center h-full">
                  <Link
                    href={item.href}
                    className={`text-sm font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md outline-none px-2 py-1 ${isActive
                        ? 'text-zinc-950 dark:text-white'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                  >
                    {item.label}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-900 dark:bg-blue-500 rounded-t-full" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions: Theme Toggle & Auth Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg outline-none px-2 py-1"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    <img
                      src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 object-cover"
                    />
                    {isPremium && (
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center border border-white dark:border-zinc-900 shadow animate-pulse">
                        ⭐
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden md:block">
                    {user.name}
                  </span>
                  {isPremium && (
                    <span className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                      Premium
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="menu"
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0f1224] border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl shadow-xl z-20 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-850">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                        </div>
                        <div className="p-1.5 space-y-1">
                          <Link
                            href="/dashboard?tab=profile"
                            onClick={() => setIsDropdownOpen(false)}
                            role="menuitem"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800/50 outline-none"
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href="/dashboard"
                            onClick={() => setIsDropdownOpen(false)}
                            role="menuitem"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded-lg transition focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800/50 outline-none"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <button
                            onClick={handleSignOut}
                            role="menuitem"
                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition text-left cursor-pointer focus-visible:bg-red-50 dark:focus-visible:bg-red-950/20 outline-none"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md outline-none px-2 py-1"
                >
                  Login
                </Link>
                <Button
                  as={Link}
                  href="/auth/signup"
                  color="primary"
                  className="bg-zinc-900 text-white dark:bg-blue-600 dark:text-white font-semibold text-sm px-5 py-2 h-9 rounded-md transition-all hover:bg-zinc-800 dark:hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 outline-none"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden border-b border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-[#0A0D1A] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-4 space-y-1" role="menu">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                    className={`block px-3 py-2 rounded-md text-base font-semibold transition-all focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${isActive
                        ? 'text-zinc-950 dark:text-white bg-zinc-50 dark:bg-zinc-900'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="relative">
                        <img
                          src={user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name)}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {isPremium && (
                          <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full text-[10px] w-5 h-5 flex items-center justify-center border border-white dark:border-zinc-900 shadow">
                            ⭐
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[120px]">{user.name}</p>
                          {isPremium && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400">
                              Premium
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[180px]">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      color="danger"
                      variant="flat"
                      className="w-full font-semibold rounded-md focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                    >
                      Log Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      as={Link}
                      href="/auth/signin"
                      variant="bordered"
                      className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Button>
                    <Button
                      as={Link}
                      href="/auth/signup"
                      className="w-full bg-zinc-900 text-white dark:bg-blue-600 dark:text-white rounded-md font-semibold focus-visible:ring-2 focus-visible:ring-blue-500 outline-none"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
