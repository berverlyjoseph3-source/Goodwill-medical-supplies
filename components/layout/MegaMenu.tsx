import Link from 'next/link';

export const MegaMenu = () => {
  return (
    <div className="group relative">
      <button className="text-slate-700 hover:text-medical-blue font-medium">
        Categories
      </button>
      <div className="absolute left-0 top-full pt-4 hidden group-hover:block">
        <div className="bg-white rounded-lg shadow-xl p-6 w-96">
          <div className="grid grid-cols-2 gap-4">
            <Link href="/category/mobility" className="hover:text-medical-blue">
              Mobility Aids
            </Link>
            <Link href="/category/respiratory" className="hover:text-medical-blue">
              Respiratory
            </Link>
            <Link href="/category/furniture" className="hover:text-medical-blue">
              Hospital Furniture
            </Link>
            <Link href="/category/diagnostic" className="hover:text-medical-blue">
              Diagnostic
            </Link>
            <Link href="/category/ppe" className="hover:text-medical-blue">
              PPE & Disposables
            </Link>
            <Link href="/category/home-care" className="hover:text-medical-blue">
              Home Care
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
