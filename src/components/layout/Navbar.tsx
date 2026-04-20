import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="font-black text-xl text-white hover:text-white/80 transition-colors">
          ALLROUND TRAINING
        </Link>
        <div className="hidden md:flex gap-8 text-sm">
          <Link href="#" className="text-white/60 hover:text-white transition-colors">
            Activities
          </Link>
          <Link href="#" className="text-white/60 hover:text-white transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}
