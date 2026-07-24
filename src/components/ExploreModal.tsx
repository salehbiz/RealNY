import { media } from '../lib/media';
import React, { useState } from 'react';
import { X, ArrowRight, Check } from 'lucide-react';

export type ExploreType = 'amenities' | 'residences' | 'neighborhood' | 'building' | null;

interface ExploreModalProps {
  type: ExploreType;
  onClose: () => void;
  onOpenInquire: () => void;
  onSelectImage: (src: string, title: string) => void;
}

export const ExploreModal: React.FC<ExploreModalProps> = ({
  type,
  onClose,
  onOpenInquire,
  onSelectImage,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (!type) return null;

  const modalData = {
    amenities: {
      title: 'SHARED AMENITIES & WELLNESS',
      subtitle: 'Curated spaces for work, relaxation, and entertainment',
      items: [
        {
          title: 'Private Courtyard Garden',
          desc: 'A lushly landscaped outdoor sanctuary featuring lounge seating, flowering walls, and soft lighting for evening gatherings.',
          image: media('/images/amenities-1-courtyard.webp'),
        },
        {
          title: 'Fitness & Movement Studio',
          desc: 'State-of-the-art cardiovascular and strength training equipment, pilates reformer, and dedicated yoga space.',
          image: media('/images/amenities-2-gym.webp'),
        },
        {
          title: 'Cedar Sauna & Thermal Spa',
          desc: 'Scandinavian cedar-lined sauna with glowing heater stones, adjacent rain showers, and peaceful relaxation benches.',
          image: media('/images/amenities-3-sauna.webp'),
        },
        {
          title: 'Private Cinema Room',
          desc: 'Acoustically tuned cinema lounge with 4K projection, plush seating, and surround sound technology.',
          image: media('/images/amenities-4-cinema.webp'),
        },
        {
          title: 'PGA Golf Simulator Suite',
          desc: 'Immersive virtual golf simulator experience with precision tracking, world-class courses, and lounge seating.',
          image: media('/images/amenities-5-golf.webp'),
        },
      ],
    },
    residences: {
      title: 'LUXURY RESIDENCES',
      subtitle: 'High ceilings, natural light, and bespoke Italian craftsmanship',
      items: [
        {
          title: 'Open-Concept Living Areas',
          desc: 'Expansive living rooms featuring 10-foot ceilings, custom wide-plank white oak flooring, and floor-to-ceiling corner windows.',
          image: media('/images/residences-living-room.webp'),
        },
        {
          title: 'Custom Chef Kitchens',
          desc: 'Handcrafted oak cabinetry, Calacatta marble waterfall counter islands, and fully integrated Gaggenau appliances.',
          image: media('/images/residences-kitchen.webp'),
        },
        {
          title: 'Primary Bath Suites',
          desc: 'Calacatta marble walls, floating wood vanities, radiant heated flooring, and glass-enclosed thermostatic rain showers.',
          image: media('/images/residences-primary-bathroom.webp'),
        },
        {
          title: 'Powder Rooms',
          desc: 'Sculptural stone pedestal sinks, bronze wall sconces, and textured wall coverings for guest entertaining.',
          image: media('/images/residences-powder-room.webp'),
        },
      ],
    },
    neighborhood: {
      title: 'PARK & MADISON NEIGHBORHOOD',
      subtitle: 'The cultural, dining, and architectural capital of Midtown Manhattan',
      items: [
        {
          title: 'The Morgan Library & Museum',
          desc: 'Located just steps away, offering world-renowned art exhibitions, historic manuscripts, and stunning Gilded Age architecture.',
          image: media('/images/neighborhood-park-and-madison-morgan-museum.webp'),
        },
        {
          title: 'Bryant Park & New York Public Library',
          desc: 'Iconic public green space with seasonal flower gardens, outdoor dining, winter ice skating, and literary culture.',
          image: media('/images/neighborhood-bryant-park-lawn.webp'),
        },
        {
          title: 'NoMad & Madison Square Park Dining',
          desc: 'Home to Eleven Madison Park, Eataly NYC Flatiron, The Ned NoMad, and vibrant cocktail lounges.',
          image: media('/images/neighborhood-eataly.webp'),
        },
        {
          title: 'Grand Central & Transit Access',
          desc: 'Unrivaled connectivity via Grand Central Terminal (4, 5, 6, 7, S, Metro-North, LIRR) within minutes of your front door.',
          image: media('/images/neighborhood-park-and-madison-grand-central.webp'),
        },
      ],
    },
    building: {
      title: 'THE BUILDING & ARCHITECTURE',
      subtitle: 'Ten stories of limestone, bronze, and timeless Manhattan elegance',
      items: [
        {
          title: 'Street-Level Arrival Entrance',
          desc: 'Fluted stone facade with bronze-framed glass entry doors, landscaped planters, and a 24-hour attended lobby desk.',
          image: media('/images/building-entrance.webp'),
        },
        {
          title: 'Attended Lobby & Concierge',
          desc: 'Curated lobby lounge featuring custom art, plush seating, and professional concierge services for package management and reservations.',
          image: media('/images/building-lobby.webp'),
        },
        {
          title: 'Private Terraces & Penthouse Setbacks',
          desc: 'Tiered architectural setbacks providing sweeping views of the Empire State Building and Midtown skyline.',
          image: media('/images/building-upper-exterior.webp'),
        },
      ],
    },
  }[type];

  const currentItem = modalData.items[activeTab] || modalData.items[0];

  return (
    <div className="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
      <div className="bg-[#ECE7DF] border border-[#1F261E]/20 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="bg-[#1F261E] text-[#ECE7DF] p-6 sm:p-8 flex items-center justify-between border-b border-[#ECE7DF]/10">
          <div>
            <span className="font-sans-clean text-[10px] tracking-[0.25em] text-[#ECE7DF]/70 uppercase font-semibold">
              EXPLORE THE MORGAN
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal tracking-wide">
              {modalData.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-[#ECE7DF]/20 hover:bg-[#ECE7DF]/10 text-[#ECE7DF] transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Item Navigation Tabs */}
        <div className="bg-[#ECE7DF] border-b border-[#1F261E]/10 px-6 py-3 flex overflow-x-auto gap-2 scrollbar-none">
          {modalData.items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-4 py-2 rounded-full font-sans-clean text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-[#2C382A] text-[#ECE7DF] font-semibold shadow-sm'
                  : 'text-[#1F261E]/70 hover:bg-[#1F261E]/10'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {/* Item Content Showcase */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Large Photo */}
          <div className="lg:col-span-7">
            <div
              onClick={() => onSelectImage(currentItem.image, currentItem.title)}
              className="relative rounded-2xl overflow-hidden border border-[#1F261E]/15 shadow-xl group cursor-pointer aspect-[4/3]"
            >
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 right-4 bg-[#1F261E]/80 text-[#ECE7DF] backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-sans-clean tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                CLICK TO ENLARGE
              </div>
            </div>
          </div>

          {/* Right Text Description */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="font-sans-clean text-[10px] tracking-[0.2em] font-semibold text-[#2C382A] uppercase">
                FEATURE HIGHLIGHT 0{activeTab + 1}
              </span>
              <h3 className="font-serif-luxury text-3xl font-medium text-[#1F261E]">
                {currentItem.title}
              </h3>
              <p className="font-sans-clean text-sm leading-relaxed text-[#1F261E]/80 font-light">
                {currentItem.desc}
              </p>
            </div>

            <div className="pt-4 space-y-3 border-t border-[#1F261E]/10">
              <div className="flex items-center gap-2 font-sans-clean text-xs text-[#2C382A] font-medium">
                <Check className="w-4 h-4" />
                <span>Tailored finishes & highest building standards</span>
              </div>
              <div className="flex items-center gap-2 font-sans-clean text-xs text-[#2C382A] font-medium">
                <Check className="w-4 h-4" />
                <span>Exclusive to residents of The Morgan</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenInquire();
                }}
                className="w-full py-3.5 rounded-full bg-[#2C382A] text-[#ECE7DF] hover:bg-[#1F261E] font-sans-clean text-xs tracking-[0.2em] font-semibold uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>REQUEST COMPLETE BROCHURE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
