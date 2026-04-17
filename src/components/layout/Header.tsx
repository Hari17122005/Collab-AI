import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Bell, Settings, Plus, ChevronDown, MessageCircle } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title: string;
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Header({ title, currentPath = '/', onNavigate = () => {} }: HeaderProps) {
  const { userProfile, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: 'Your work', path: '/board' },
    { label: 'Projects', path: '/roadmap' },
    { label: 'Dashboards', path: '/' },
    { label: 'AI Insights', path: '/ai-insights' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-[#0F1115] border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
      {/* Left: Navigation Links */}
      <div className="flex items-center gap-6">
        {navLinks.map((link, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(link.path)}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-colors",
              currentPath === link.path ? "text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {link.label}
          </button>
        ))}
        
        <button 
          onClick={() => onNavigate('/board')}
          className="ml-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create
        </button>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-12">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <Mic className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <span className="text-xs text-slate-400 group-focus-within:hidden">Voice search</span>
          </div>
          
          {/* Waveform placeholder */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-40 group-focus-within:hidden">
            {[1,2,3,4,5,4,3,2,1].map((h, i) => (
              <div key={i} className="w-0.5 bg-blue-500 rounded-full" style={{ height: `${h * 3}px` }} />
            ))}
          </div>

          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          
          <input 
            type="text" 
            className="w-full h-12 rounded-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#1A1D23] px-12 text-sm text-slate-900 dark:text-white transition-all outline-none"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
          <MessageCircle className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-green-500 rounded-full border-2 border-white dark:border-[#0F1115]" />
        </button>
        
        <button className="relative p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-amber-500 rounded-full border-2 border-white dark:border-[#0F1115]" />
        </button>

        <button 
          onClick={() => onNavigate('/protection')}
          className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2" />

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 group"
          >
            <Avatar fallback={userProfile?.name?.charAt(0) || '?'} className="h-10 w-10 border-2 border-transparent group-hover:border-blue-500 transition-all" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{userProfile?.name || 'User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{userProfile?.email || 'No email'}</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { logout(); setIsProfileOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
