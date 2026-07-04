import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = ['Field Guides', 'Geology', 'Plans', 'Live Tour'];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 256 256" fill="#ffffff">
          <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
        </svg>
        <span className="text-white text-2xl font-playfair italic">Lithos</span>
      </div>

      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
        <button className="text-white px-4 py-1.5 rounded-full text-sm font-medium">
          Course
        </button>
        {LINKS.map((link) => (
          <button
            key={link}
            className="text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
          >
            {link}
          </button>
        ))}
      </div>

      <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100">
        Sign Up
      </button>

      <button
        className="md:hidden text-white"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-1">
          <button className="text-white text-left px-4 py-2 rounded-full text-sm font-medium">
            Course
          </button>
          {LINKS.map((link) => (
            <button
              key={link}
              className="text-white/80 text-left px-4 py-2 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors"
            >
              {link}
            </button>
          ))}
          <button className="mt-2 bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100">
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
