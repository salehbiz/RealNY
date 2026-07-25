import React, { useState } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import type { Residence } from './AvailabilitySection';

interface FloorplanModalProps {
  residence: Residence | null;
  onClose: () => void;
}

export const FloorplanModal: React.FC<FloorplanModalProps> = ({
  residence,
  onClose,
}) => {
  if (!residence) return null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    comments: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloadNotified, setDownloadNotified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(async () => {
      setIsSubmitting(false);
      setSubmitted(true);
      const confetti = (await import('canvas-confetti')).default;
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#101535', '#D6B585', '#242C5B', '#F4F5F8'],
      });
    }, 800);
  };

  const handleDownloadNotify = () => {
    console.log(`[Notification System] Email sent to broker: A visitor has downloaded the floorplan PDF for ${residence.name}`);
    setDownloadNotified(true);
    setTimeout(() => setDownloadNotified(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#ECE7DF] border border-[#101535]/20 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="bg-[#101535] text-[#F4F5F8] p-6 sm:p-8 flex items-center justify-between">
          <div>
            <span className="font-sora text-[10px] tracking-[0.25em] text-[#F4F5F8]/70 uppercase font-semibold">
              FLOORPLAN & SPECIFICATIONS
            </span>
            <h2 className="font-rexton text-3xl sm:text-4xl font-bold tracking-tight text-[#D6B585]">
              {residence.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#101535]/15 bg-[#ECE7DF] p-4">
              <img
                src={residence.floorplanImg}
                alt={`${residence.name} floorplan`}
                className="w-full h-[320px] sm:h-[400px] object-contain rounded-xl"
              />
              <div className="absolute top-6 left-6 bg-[#101535] text-white font-sora text-[10px] tracking-wider uppercase px-3 py-1 rounded-full border border-white/20">
                {residence.type}
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form or Success State */}
          <div className="lg:col-span-5 space-y-6">
            {submitted ? (
              <div className="bg-[#101535] text-[#F4F5F8] border border-[#D6B585]/30 rounded-2xl p-6 text-center space-y-4 shadow-xl animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#242C5B] border border-[#D6B585]/40 flex items-center justify-center mx-auto text-[#D6B585]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-rexton text-xl text-[#D6B585] font-semibold">
                  Inquiry Submitted
                </h3>
                <p className="font-sora text-xs text-[#F4F5F8]/80 leading-relaxed">
                  Thank you for your inquiry about <strong>{residence.name}</strong>. An email confirmation has been sent to <strong>{formData.email}</strong>. A sales representative will contact you shortly with floorplan details and pricing.
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-2 rounded-full border border-white/30 text-white hover:bg-white/10 font-sora text-[10px] tracking-wider uppercase transition-all cursor-pointer font-bold"
                  >
                    Submit Another
                  </button>
                  <a
                    href={`/documents/floorplan-${residence.id}.pdf`}
                    download={`${residence.name}_Floorplan.pdf`}
                    onClick={handleDownloadNotify}
                    className="w-full py-2 rounded-full border border-[#D6B585]/40 bg-transparent text-[#D6B585] hover:bg-[#D6B585]/10 font-sora text-[10px] tracking-wider font-bold uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    Download Floor Plan (PDF)
                  </a>
                </div>
                {downloadNotified && (
                  <p className="text-[10px] text-[#D6B585] text-center font-sora animate-pulse mt-1 font-semibold">
                    ✓ Email notification sent to broker regarding your download
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-[#101535]">
                <div className="space-y-1">
                  <h3 className="font-rexton text-lg font-bold text-[#101535] leading-tight">
                    Inquire About {residence.name}
                  </h3>
                  <p className="font-sora text-[10px] text-[#101535]/70">
                    Submit your details below to receive specific info and floor plans for this residence.
                  </p>
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="modalFirstName" className="block font-sora text-[10px] font-semibold text-[#101535]">
                      First Name *
                    </label>
                    <input
                      id="modalFirstName"
                      type="text"
                      required
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-1.5 text-xs font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="modalLastName" className="block font-sora text-[10px] font-semibold text-[#101535]">
                      Last Name *
                    </label>
                    <input
                      id="modalLastName"
                      type="text"
                      required
                      placeholder="Smith"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-1.5 text-xs font-sora text-[#101535] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label htmlFor="modalEmail" className="block font-sora text-[10px] font-semibold text-[#101535]">
                    Email Address *
                  </label>
                  <input
                    id="modalEmail"
                    type="email"
                    required
                    placeholder="john.smith@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-1.5 text-xs font-sora text-[#101535] focus:outline-none transition-colors"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-1">
                  <label htmlFor="modalPhone" className="block font-sora text-[10px] font-semibold text-[#101535]">
                    Phone Number *
                  </label>
                  <input
                    id="modalPhone"
                    type="tel"
                    required
                    placeholder="(212) 555-0199"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-1.5 text-xs font-sora text-[#101535] focus:outline-none transition-colors"
                  />
                </div>

                {/* More about your inquiry */}
                <div className="space-y-1">
                  <label htmlFor="modalComments" className="block font-sora text-[10px] font-semibold text-[#101535]">
                    More about your inquiry *
                  </label>
                  <textarea
                    id="modalComments"
                    rows={2}
                    required
                    placeholder="Tell us about your target move-in, preferred floor level, etc."
                    value={formData.comments}
                    onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    className="w-full bg-transparent border-b border-[#101535]/30 focus:border-[#D6B585] py-1.5 text-xs font-sora text-[#101535] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-full bg-[#101535] text-white border border-white/20 hover:bg-[#242C5B] hover:scale-[1.01] font-sora text-[10px] tracking-wider font-bold uppercase transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-2.5 h-2.5" />
                    </>
                  )}
                </button>

                <div className="pt-2 border-t border-[#101535]/10 mt-4 flex flex-col gap-2">
                  <a
                    href={`/documents/floorplan-${residence.id}.pdf`}
                    download={`${residence.name}_Floorplan.pdf`}
                    onClick={handleDownloadNotify}
                    className="w-full py-2 rounded-full border border-[#101535]/30 text-[#101535] hover:bg-[#101535]/5 font-sora text-[10px] tracking-wider font-bold uppercase transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    Download Floor Plan (PDF)
                  </a>
                  {downloadNotified && (
                    <p className="text-[10px] text-[#242C5B] text-center font-sora animate-pulse mt-1 font-semibold">
                      ✓ Email notification sent to broker regarding your download
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
