'use client'

import { useRouter } from 'next/navigation';  // Correct import for client-side navigation
import Link from 'next/link';  // Import Next.js Link component
import { Upload, Home, Calculator } from 'lucide-react';

const Navbar = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.asPath === path ? 'bg-green-700' : '';
  };

  return (
    <nav className="bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              PowerShare
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              href="/dashboard"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/dashboard')}`}
            >
              <Home className="w-4 h-4 mr-2" />
              Dashboard
            </Link>
            
            <Link
              href="/upload"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/upload')}`}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload & Analyze
            </Link>
            
            <Link
              href="/calculator"
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 ${isActive('/calculator')}`}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calculator
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
