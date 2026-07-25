import { media } from '../lib/media';
import React, { useState } from 'react';
import { FileText, ArrowRight } from 'lucide-react';

export interface Residence {
  id: string;
  name: string;
  type: string; // '1 Bed', '2 Bed', '3 Bed'
  beds: number;
  baths: number;
  sqft: number;
  exposure: string;
  price: string;
  maintenance: string;
  taxes: string;
  floorplanImg: string;
  interiorImg: string;
  status: 'Available' | 'Contract Signed' | 'Inquire';
  concession: string;
}

interface AvailabilitySectionProps {
  onSelectResidence: (residence: Residence) => void;
  onOpenInquire: () => void;
}

export const sampleResidences: Residence[] = [
  {
    id: 'res-2b',
    name: 'Residence 2B',
    type: '1 Bed',
    beds: 1,
    baths: 1.5,
    sqft: 845,
    exposure: 'South / Quiet Garden',
    price: '$1,795,000',
    maintenance: '$1,120 / mo',
    taxes: '$980 / mo',
    floorplanImg: media('/images/floorplan-2b.png'),
    interiorImg: media('/images/residences-living-room.webp'),
    status: 'Available',
    concession: '1 Month Free',
  },
  {
    id: 'res-4a',
    name: 'Residence 4A',
    type: '2 Bed',
    beds: 2,
    baths: 2.5,
    sqft: 1420,
    exposure: 'North / East Historic Street',
    price: '$3,250,000',
    maintenance: '$1,890 / mo',
    taxes: '$1,650 / mo',
    floorplanImg: media('/images/floorplan-4a.png'),
    interiorImg: media('/images/residences-kitchen.webp'),
    status: 'Available',
    concession: '2 Months Free',
  },
  {
    id: 'res-5c',
    name: 'Residence 5C',
    type: '2 Bed',
    beds: 2,
    baths: 2,
    sqft: 1310,
    exposure: 'West / Tree-lined Avenue',
    price: '$2,985,000',
    maintenance: '$1,740 / mo',
    taxes: '$1,520 / mo',
    floorplanImg: media('/images/floorplan-5c.png'),
    interiorImg: media('/images/residences-living-room.webp'),
    status: 'Available',
    concession: '1 Month Free',
  },
  {
    id: 'res-7b',
    name: 'Residence 7B',
    type: '3 Bed',
    beds: 3,
    baths: 3.5,
    sqft: 2150,
    exposure: 'Corner South & East / Terraced',
    price: '$5,450,000',
    maintenance: '$2,860 / mo',
    taxes: '$2,480 / mo',
    floorplanImg: media('/images/floorplan-7b.png'),
    interiorImg: media('/images/residences-primary-bathroom.webp'),
    status: 'Available',
    concession: '3 Months Free',
  },
];

export const AvailabilitySection: React.FC<AvailabilitySectionProps> = ({
  onSelectResidence,
  onOpenInquire,
}) => {
  const [activeTab, setActiveTab] = useState<string>('All');

  const tabs = ['All', '1 Bed', '2 Bed', '3 Bed'];

  const filteredResidences = sampleResidences.filter((res) => {
    if (activeTab === 'All') return true;
    return res.type === activeTab;
  });

  return (
    <section id="availability" className="bg-[#ECE7DF] text-[#101535] py-14 md:py-20 px-6 border-t border-[#101535]/10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D6B585]/30 pb-6">
          <div>
            <span className="font-sora text-xs tracking-[0.2em] font-semibold text-[#D6B585] uppercase">
              Current Offerings
            </span>
            <h2 className="font-rexton text-3xl sm:text-4xl font-bold text-[#101535] mt-1">
              Residence <span className="text-[#D6B585]">Availability</span>
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full font-sora text-[10px] tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-[#101535] text-white shadow-sm font-semibold border border-white/20'
                    : 'bg-[#ECE7DF] border border-[#101535]/20 text-[#101535]/80 hover:bg-[#101535]/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Table Rows */}
        <div className="space-y-3">
          {filteredResidences.map((res) => (
            <div
              key={res.id}
              className="bg-[#ECE7DF] border border-[#101535]/15 hover:border-[#D6B585] rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6 group"
            >
              {/* Left Info: Residence Title & Exposure */}
              <div className="space-y-1 lg:w-1/4">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-sora text-lg sm:text-xl font-bold text-[#101535] group-hover:text-[#D6B585] transition-colors">
                    {res.name}
                  </h3>
                  <span className="font-sora text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#101535]/10 text-[#101535] border border-[#D6B585]/30">
                    {res.status}
                  </span>
                </div>
                <p className="font-sora text-xs text-[#101535]/65 font-light">
                  {res.exposure}
                </p>
              </div>

              {/* Middle Specs Grid */}
              <div className="grid grid-cols-3 gap-4 font-sora text-xs lg:w-2/5 border-y lg:border-y-0 lg:border-x border-[#101535]/10 py-3 lg:py-0 lg:px-6 items-center">
                <div>
                  <span className="block text-[#101535]/50 text-[10px] uppercase font-semibold">Beds / Baths</span>
                  <span className="font-sora text-sm sm:text-base font-bold text-[#101535] whitespace-nowrap">
                    {res.beds} Bed / {res.baths} Bath
                  </span>
                </div>

                <div>
                  <span className="block text-[#101535]/50 text-[10px] uppercase font-semibold">Concession</span>
                  <span className="font-sora text-sm sm:text-base font-bold text-[#101535] whitespace-nowrap">
                    {res.concession}
                  </span>
                </div>

                <div>
                  <span className="block text-[#101535]/50 text-[10px] uppercase font-semibold">Price</span>
                  <span className="font-sora text-sm sm:text-base font-bold text-[#D6B585] whitespace-nowrap">
                    {res.price}
                  </span>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 lg:w-1/3 lg:justify-end">
                <button
                  onClick={() => onSelectResidence(res)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#101535]/30 bg-transparent hover:bg-[#101535] hover:text-white font-sora text-[10px] tracking-wider uppercase transition-all duration-300 cursor-pointer"
                >
                  <FileText className="w-3 h-3" />
                  <span>Floorplan</span>
                </button>

                <button
                  onClick={onOpenInquire}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#101535] text-white hover:bg-[#242C5B] hover:scale-105 font-sora text-[10px] tracking-wider uppercase font-bold transition-all duration-300 cursor-pointer border border-white/20 shadow-sm"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
