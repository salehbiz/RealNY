import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import type { Residence } from './AvailabilitySection';

interface FloorplanModalProps {
  residence: Residence | null;
  onClose: () => void;
  onInquire: (residenceName: string) => void;
}

export const FloorplanModal: React.FC<FloorplanModalProps> = ({
  residence,
  onClose,
  onInquire,
}) => {
  if (!residence) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#ECE7DF] border border-[#1F261E]/20 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="bg-[#1F261E] text-[#ECE7DF] p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="font-sans-clean text-[10px] tracking-[0.25em] text-[#ECE7DF]/70 uppercase font-semibold">
              FLOORPLAN & SPECIFICATIONS
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal tracking-wide">
              {residence.name}
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

        {/* Modal Content */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#1F261E]/15 bg-white p-4">
              <img
                src={residence.interiorImg}
                alt={`${residence.name} preview`}
                className="w-full h-[320px] sm:h-[400px] object-cover rounded-xl"
              />
              <div className="absolute top-6 left-6 bg-[#2C382A] text-[#ECE7DF] font-sans-clean text-[10px] tracking-widest px-3 py-1 rounded-full uppercase">
                {residence.type}
              </div>
            </div>
          </div>

          {/* Right Column: Key Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4 font-sans-clean text-xs text-[#1F261E]">
              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">OFFERING PRICE</span>
                <span className="font-serif-luxury text-xl font-semibold text-[#2C382A]">
                  {residence.price}
                </span>
              </div>

              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">BEDROOMS / BATHS</span>
                <span className="font-semibold">{residence.beds} Beds / {residence.baths} Baths</span>
              </div>

              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">INTERIOR SQUARE FEET</span>
                <span className="font-semibold">{residence.sqft.toLocaleString()} SF</span>
              </div>

              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">EXPOSURE</span>
                <span className="font-semibold">{residence.exposure}</span>
              </div>

              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">ESTIMATED MAINTENANCE</span>
                <span>{residence.maintenance}</span>
              </div>

              <div className="flex justify-between border-b border-[#1F261E]/15 pb-2">
                <span className="text-[#1F261E]/60 uppercase tracking-wider">ESTIMATED TAXES</span>
                <span>{residence.taxes}</span>
              </div>
            </div>

            {/* Highlights List */}
            <div className="space-y-2 pt-2">
              <span className="block font-sans-clean text-[10px] tracking-[0.2em] font-semibold text-[#2C382A] uppercase">
                RESIDENCE FEATURES
              </span>
              <ul className="space-y-1.5 font-sans-clean text-xs text-[#1F261E]/80">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2C382A] shrink-0" />
                  <span>Custom wide-plank white oak flooring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2C382A] shrink-0" />
                  <span>Gaggenau suite of integrated appliances</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2C382A] shrink-0" />
                  <span>Calacatta marble primary bath with radiant heating</span>
                </li>
              </ul>
            </div>

            {/* Inquire Action Button */}
            <button
              onClick={() => {
                onClose();
                onInquire(residence.name);
              }}
              className="w-full py-3.5 rounded-full bg-[#2C382A] text-[#ECE7DF] hover:bg-[#1F261E] hover:scale-[1.01] font-sans-clean text-xs tracking-[0.2em] font-semibold uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>INQUIRE ABOUT THIS RESIDENCE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
