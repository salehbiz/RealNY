import { media } from '../lib/media';
import React from 'react';

interface InteriorsSectionProps {
  onExploreResidences: () => void;
  onImageClick: (src: string, title: string) => void;
}

export const InteriorsSection: React.FC<InteriorsSectionProps> = ({
  onExploreResidences: _onExploreResidences,
  onImageClick,
}) => {
  const livingRoomSrc = media('/images/residences-living-room.webp');
  const livingRoomTitle = 'Sunlit living room with custom oak floors and oversized windows by INC Architecture';
  const kitchenSrc = media('/images/residences-kitchen.webp');
  const kitchenTitle = 'Custom kitchen with honed marble countertops and premium integrated appliances by INC Architecture';

  return (
    <section id="residences" className="bg-[#F4F5F8] text-[#101535] py-12 lg:py-16 px-4 sm:px-8 lg:px-16 w-full border-b border-[#101535]/10 select-none min-h-screen lg:h-screen lg:min-h-[800px] flex flex-col justify-center">
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-between h-full space-y-12 lg:space-y-0 py-2">
        {/* Row 1: Image Left, Text Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1">
          {/* Image */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-start">
            <div
              onClick={() => onImageClick(livingRoomSrc, livingRoomTitle)}
              className="relative overflow-hidden shadow-2xl group cursor-pointer border border-[#101535]/10 w-full max-w-[500px] aspect-[3/2] rounded-none"
            >
              <img
                src={livingRoomSrc}
                alt={livingRoomTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 right-4 bg-[#101535]/90 text-[#F4F5F8] border border-[#D6B585]/40 backdrop-blur-md px-4 py-2 rounded-none text-xs font-sora opacity-0 group-hover:opacity-100 transition-opacity">
                Enlarge Image
              </div>
            </div>
          </div>
          {/* Text */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center w-full max-w-xl mx-auto">
            <p className="font-sora text-base md:text-lg leading-relaxed text-[#101535]/80 font-light text-center">
              Light-filled living spaces feature custom oak flooring, oversized windows, and high ceilings that create a bright and airy sanctuary designed by INC Architecture.
            </p>
          </div>
        </div>

        {/* Row 2: Text Left, Image Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1">
          {/* Text */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center w-full max-w-xl mx-auto order-2 lg:order-1">
            <p className="font-sora text-base md:text-lg leading-relaxed text-[#101535]/80 font-light text-center">
              The custom kitchens are beautifully equipped with honed marble countertops, custom wood cabinetry, and premium integrated appliances for a sophisticated culinary experience.
            </p>
          </div>
          {/* Image */}
          <div className="w-full flex justify-center lg:justify-end order-1 lg:order-2 lg:col-span-6">
            <div
              onClick={() => onImageClick(kitchenSrc, kitchenTitle)}
              className="relative overflow-hidden shadow-2xl group cursor-pointer border border-[#101535]/10 w-full max-w-[500px] aspect-[3/2] rounded-none"
            >
              <img
                src={kitchenSrc}
                alt={kitchenTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 right-4 bg-[#101535]/90 text-[#F4F5F8] border border-[#D6B585]/40 backdrop-blur-md px-4 py-2 rounded-none text-xs font-sora opacity-0 group-hover:opacity-100 transition-opacity">
                Enlarge Image
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
