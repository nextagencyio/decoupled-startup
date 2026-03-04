import Link from 'next/link'
import { DrupalLandingPage } from '@/lib/types'
import ResponsiveImage from './ResponsiveImage'
import { ArrowRight } from 'lucide-react'

interface LandingPageCardProps {
  item: DrupalLandingPage
}

export default function LandingPageCard({ item }: LandingPageCardProps) {
  return (
    <Link
      href={item.path || '#'}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 bg-gradient-to-br from-violet-600 to-violet-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 text-white/30 text-4xl font-bold">{item.title?.charAt(0)}</div>
        </div>
      </div>

      <div className="p-6">

        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-violet-700 transition-colors">
          {item.title}
        </h3>


        <div className="flex items-center text-violet-700 font-medium group-hover:gap-2 transition-all">
          Learn more
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}
