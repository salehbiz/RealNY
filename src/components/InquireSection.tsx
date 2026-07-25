import React, { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

interface InquireSectionProps {
  initialResidence?: string;
  sideImage?: string;
}

export const InquireSection: React.FC<InquireSectionProps> = ({ initialResidence, sideImage }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isBroker: 'No',
    size: 'One Bedroom',
    hearAbout: 'Online Search',
    comments: initialResidence ? `Interested in ${initialResidence}` : '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSizes = [
    'Studio',
    'One Bedroom',
    'One Bedroom + Den',
    'Two Bedroom',
    'Two Bedroom + Den',
    'Three Bedroom',
    'Penthouse',
  ];

  const hearOptions = [
    'Agent / Broker',
    'Friends & Family',
    'Site Signage',
    'Online Ads',
    'Listing Website',
    'Online Search',
    'Social Media',
    'Word of Mouth',
    'Events',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(async () => {
      setIsSubmitting(false);
      setSubmitted(true);
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#101535', '#D6B585', '#242C5B', '#F4F5F8'],
      });
    }, 800);
  };

  return (
    <section id="inquire" className={`text-[#101535] border-b border-[#101535]/10 bg-[#ECE7DF] ${sideImage ? 'mt-16 md:mt-24' : 'py-14 md:py-20 px-6'}`}>
      <div className={sideImage ? '' : 'max-w-4xl mx-auto'}>
        {/* Two-column layout when sideImage is provided */}
        <div className={sideImage ? 'grid grid-cols-1 lg:grid-cols-2 items-stretch' : ''}>
          {/* Side Image Column */}
          {sideImage && (
            <div className="relative min-h-[400px] lg:min-h-0">
              <img
                src={sideImage}
                alt="The Eastline New York"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
          )}

          {/* Form Column */}
          <div className={`space-y-10 bg-[#ECE7DF] ${sideImage ? 'px-8 md:px-16 lg:px-20 py-14 md:py-20' : ''}`}>
            {/* Header */}
            <div className={`space-y-3 ${sideImage ? 'text-left' : 'text-center'}`}>
              <span className="font-sora text-xs tracking-[0.2em] font-semibold text-[#D6B585] uppercase">
                38 East 35th Street • New York, NY 10016
              </span>
              <h2 className="font-rexton text-[35px] font-bold text-[#101535] leading-[1.0] tracking-[-0.15em]">
                Inquire Now
              </h2>
              <p className={`font-sora text-xs sm:text-sm tracking-wider text-[#101535]/70 ${sideImage ? 'max-w-md' : 'max-w-lg mx-auto'}`}>
                Please complete the form below to receive floor plans, pricing, and schedule a private visit to The Eastline New York sales gallery.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#101535] text-[#F4F5F8] border border-[#D6B585]/30 rounded-3xl p-8 md:p-12 text-center space-y-5 shadow-2xl animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-[#242C5B] border border-[#D6B585]/40 flex items-center justify-center mx-auto text-[#D6B585]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-rexton text-2xl md:text-3xl text-[#D6B585]">
                  Thank You For Your Inquiry
                </h3>
                <p className="font-sora text-sm text-[#F4F5F8]/80 max-w-md mx-auto leading-relaxed">
                  A sales representative from Corcoran New Development will contact you shortly with availability details and appointment options for The Eastline New York.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full border border-[#D6B585]/40 hover:bg-[#D6B585] hover:text-[#101535] font-sora text-xs tracking-wider uppercase transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className={`space-y-6 ${sideImage ? '' : 'bg-[#ECE7DF] border border-[#101535]/15 rounded-3xl p-6 md:p-12 shadow-sm'}`}
              >
                {/* Row 1: First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block font-sora text-xs font-semibold text-[#101535]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sora text-xs font-semibold text-[#101535]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block font-sora text-xs font-semibold text-[#101535]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john.smith@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-sora text-xs font-semibold text-[#101535]">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(212) 555-0199"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Are you a broker? */}
                <div className="space-y-2">
                  <label className="block font-sora text-xs font-semibold text-[#101535]">
                    Are You A Broker? *
                  </label>
                  <div className="flex gap-3">
                    {['Yes, I am a broker', 'No, I am not a broker'].map((bOpt) => (
                      <button
                        key={bOpt}
                        type="button"
                        onClick={() => setFormData({ ...formData, isBroker: bOpt })}
                        className={`px-4 py-2 rounded-full font-sora text-xs transition-all cursor-pointer ${
                          formData.isBroker === bOpt
                            ? 'bg-[#101535] text-[#D6B585] font-semibold shadow-sm border border-[#D6B585]/40'
                            : 'bg-transparent border border-[#101535]/20 text-[#101535]/80 hover:bg-[#101535]/10'
                        }`}
                      >
                        {bOpt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 4: Residence Size Pills */}
                <div className="space-y-2">
                  <label className="block font-sora text-xs font-semibold text-[#101535]">
                    Residence Size *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setFormData({ ...formData, size })}
                        className={`px-3.5 py-1.5 rounded-full font-sora text-xs transition-all cursor-pointer ${
                          formData.size === size
                            ? 'bg-[#101535] text-[#D6B585] font-semibold shadow-sm border border-[#D6B585]/40'
                            : 'bg-transparent border border-[#101535]/20 text-[#101535]/80 hover:bg-[#101535]/10'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Row 5: How did you hear about us? */}
                <div className="space-y-2">
                  <label htmlFor="hear-about" className="block font-sora text-xs font-semibold text-[#101535]">
                    How Did You Hear About Us?
                  </label>
                  <select
                    id="hear-about"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={(e) => setFormData({ ...formData, hearAbout: e.target.value })}
                    className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none cursor-pointer"
                  >
                    {hearOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#ECE7DF] text-[#101535]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Comments */}
                <div className="space-y-1.5">
                  <label className="block font-sora text-xs font-semibold text-[#101535]">
                    Comments or Questions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your timing, preferred floor levels, or questions..."
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-2.5 text-sm font-sora text-[#101535] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Legal Consent Disclaimer */}
                <p className="font-sora text-[11px] leading-relaxed text-[#101535]/60 pt-1">
                  By providing your information, you consent to receiving communications from Corcoran New Development regarding The Eastline New York.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#101535] text-[#D6B585] border border-[#D6B585]/40 hover:bg-[#242C5B] hover:scale-[1.01] font-sora text-xs tracking-wider font-bold uppercase transition-all duration-300 shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
