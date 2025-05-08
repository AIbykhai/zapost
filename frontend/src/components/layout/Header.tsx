import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className={`${playfair.className} text-2xl font-bold`}>
            <span className="bg-[#F8C4A9] px-2 py-1 rounded">AI Social Person</span>
          </h1>
        </div>
        <div className={`${inter.className} flex items-center space-x-4`}>
          <div className="text-gray-600">Welcome, User!</div>
          <div className="flex space-x-2">
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              Posts: 0
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              Reach: 0
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 