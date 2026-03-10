import React from 'react';
import { 
  useLoaderData, 
  useSearchParams, 
  useNavigate 
} from 'react-router-dom';

/**
 * Fungsi Loader untuk mengambil data wilayah dari JSON.
 * Sesuai instruksi: fetch('/data/indonesia_regions.json')
 */
export async function regionLoader() {
  const response = await fetch('/data/indonesia_regions.json');
  if (!response.ok) throw new Error("Gagal memuat data wilayah");
  return response.json();
}

/**
 * Komponen Utama: FilterPage
 * Merangkum seluruh kebutuhan UI dan logika filter dalam satu halaman.
 */
export default function FilterPage() {
  const data = useLoaderData() as any;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mendapatkan ID wilayah dari URL Search Params (State Persistence)
  const provinceId = searchParams.get('province');
  const regencyId = searchParams.get('regency');
  const districtId = searchParams.get('district');

  // Filter data berdasarkan pilihan hierarki
  const filteredRegencies = data?.regencies?.filter((r: any) => String(r.province_id) === provinceId) || [];
  const filteredDistricts = data?.districts?.filter((d: any) => String(d.regency_id) === regencyId) || [];

  // Mendapatkan Nama wilayah untuk tampilan Breadcrumb & Content
  const provinceName = data?.provinces?.find((p: any) => String(p.id) === provinceId)?.name;
  const regencyName = data?.regencies?.find((r: any) => String(r.id) === regencyId)?.name;
  const districtName = data?.districts?.find((d: any) => String(d.id) === districtId)?.name;

  // Fungsi untuk memperbarui filter di URL agar anti-refresh
  const handleUpdateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset filter anak jika induk berubah (Chained Logic)
    if (key === 'province') {
      params.delete('regency');
      params.delete('district');
    } else if (key === 'regency') {
      params.delete('district');
    }
    
    setSearchParams(params);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Filter */}
      <aside className="w-80 bg-white border-r p-6 flex flex-col gap-8 shadow-sm">
        <div className="font-bold text-lg border-b pb-4 text-blue-600 flex items-center gap-2">
          <span>🌏</span> Frontend Assessment
        </div>

        <div className="space-y-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Wilayah</p>
          
          {/* Dropdown Provinsi */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Provinsi</label>
            <div className="relative flex items-center group">
              <span className="absolute left-3 text-lg pointer-events-none">🗺️</span>
              <select 
                name="province"
                value={provinceId || ""}
                onChange={(e) => handleUpdateFilter('province', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Pilih Provinsi</option>
                {data?.provinces?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <span className="absolute right-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

          {/* Dropdown Kota/Kabupaten */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Kota/Kabupaten</label>
            <div className="relative flex items-center group">
              <span className="absolute left-3 text-lg pointer-events-none">🏢</span>
              <select 
                name="regency"
                disabled={!provinceId}
                value={regencyId || ""}
                onChange={(e) => handleUpdateFilter('regency', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {filteredRegencies.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <span className="absolute right-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

          {/* Dropdown Kecamatan */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Kecamatan</label>
            <div className="relative flex items-center group">
              <span className="absolute left-3 text-lg pointer-events-none">📍</span>
              <select 
                name="district"
                disabled={!regencyId}
                value={districtId || ""}
                onChange={(e) => handleUpdateFilter('district', e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg disabled:opacity-40 outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer transition-all"
              >
                <option value="">Pilih Kecamatan</option>
                {filteredDistricts.map((d: any) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <span className="absolute right-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </span>
            </div>
          </div>

          {/* Tombol Reset */}
          <button 
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-xs uppercase flex items-center justify-center gap-2"
          >
            <span>🔄</span> Reset Filter
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header Breadcrumb */}
        <header className="bg-white p-5 border-b sticky top-0 z-10">
          <nav className="breadcrumb text-[13px] text-slate-400 flex items-center gap-2">
            <span className="hover:text-blue-500 cursor-default">Indonesia</span>
            {provinceName && (
              <>
                <span className="text-slate-300 text-[10px]">▶</span> 
                <span className="text-blue-600 font-semibold">{provinceName}</span>
              </>
            )}
            {regencyName && (
              <>
                <span className="text-slate-300 text-[10px]">▶</span> 
                <span className="text-blue-600 font-semibold">{regencyName}</span>
              </>
            )}
            {districtName && (
              <>
                <span className="text-slate-300 text-[10px]">▶</span> 
                <span className="text-blue-600 font-semibold">{districtName}</span>
              </>
            )}
          </nav>
        </header>

        {/* Konten Utama menggunakan tag <main> */}
        <main className="flex-1 flex flex-col items-center justify-center p-12 bg-white m-4 rounded-3xl shadow-sm border border-slate-100">
          {!provinceId ? (
            <div className="flex flex-col items-center gap-4 text-slate-300 italic">
              <span className="text-5xl animate-bounce">📍</span>
              <p className="text-sm font-medium">Silakan tentukan wilayah pada filter di samping</p>
            </div>
          ) : (
            <div className="text-center space-y-12">
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Provinsi</p>
                <h1 className="text-7xl font-black text-slate-800 tracking-tight">{provinceName}</h1>
              </section>

              {regencyName && (
                <>
                  <div className="text-slate-200 text-3xl font-light">↓</div>
                  <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Kota / Kabupaten</p>
                    <h2 className="text-5xl font-extrabold text-slate-700 tracking-tight">{regencyName}</h2>
                  </section>
                </>
              )}

              {districtName && (
                <>
                  <div className="text-slate-200 text-3xl font-light">↓</div>
                  <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Kecamatan</p>
                    <h3 className="text-4xl font-bold text-slate-600 tracking-tight">{districtName}</h3>
                  </section>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}