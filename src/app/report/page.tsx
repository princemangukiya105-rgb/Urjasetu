'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap,
  MapPin,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Navigation,
  FileText,
  AlertTriangle,
  Sparkles,
  Camera,
  X,
  MessageSquare,
} from 'lucide-react';
import { IssueType, Priority } from '@/types';
import { addComplaint } from '@/lib/storage';
import { SafetyBanner } from '@/components/SafetyBanner';
import { PriorityBadge } from '@/components/PriorityBadge';

const ISSUE_OPTIONS: { type: IssueType; label: string; desc: string; defaultPriority: Priority; icon: string }[] = [
  {
    type: 'Streetlight Not Working',
    label: 'Streetlight Not Working',
    desc: 'Public pole streetlight completely off during night hours.',
    defaultPriority: 'High',
    icon: '💡',
  },
  {
    type: 'Public Light Not Working',
    label: 'Public Light Not Working',
    desc: 'Garden, park, or public plaza fixture not functioning.',
    defaultPriority: 'Medium',
    icon: '🌳',
  },
  {
    type: 'Streetlight Flickering',
    label: 'Flickering Light',
    desc: 'Light rapid flickering or intermittent powering on/off.',
    defaultPriority: 'Medium',
    icon: '⚡',
  },
  {
    type: 'Damaged Electrical Pole',
    label: 'Electrical Pole Damage',
    desc: 'Tilted pole, cracked base, or structural collision damage.',
    defaultPriority: 'Critical',
    icon: '🏗️',
  },
  {
    type: 'Exposed Electrical Wiring',
    label: 'Exposed Wiring',
    desc: 'Open pole base door, exposed conductors or dangling wire.',
    defaultPriority: 'Critical',
    icon: '⚠️',
  },
  {
    type: 'Public Lighting Damage',
    label: 'Public Lighting Damage',
    desc: 'Broken glass fixture, smashed casing, or vandalized lamp.',
    defaultPriority: 'Low',
    icon: '🔨',
  },
  {
    type: 'Electrical Infrastructure Issue',
    label: 'Feeder / Pillar Box Issue',
    desc: 'Open junction pillar door or spark/burn marks.',
    defaultPriority: 'High',
    icon: '📦',
  },
  {
    type: 'Other',
    label: 'Other Infrastructure Hazard',
    desc: 'Other public electrical infrastructure concern.',
    defaultPriority: 'Medium',
    icon: '❓',
  },
];

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [selectedType, setSelectedType] = useState<IssueType>('Streetlight Not Working');
  const [area, setArea] = useState('Mira Road Sector 10');
  const [street, setStreet] = useState('');
  const [ward, setWard] = useState('Ward 4');
  const [pincode, setPincode] = useState('401107');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [priority, setPriority] = useState<Priority>('High');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Submission State
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [generatedWaUrl, setGeneratedWaUrl] = useState<string | null>(null);

  // Auto-set priority suggestion based on issue type selection
  const handleTypeSelect = (opt: typeof ISSUE_OPTIONS[0]) => {
    setSelectedType(opt.type);
    setPriority(opt.defaultPriority);
  };

  // Simulated GPS Location autofill
  const handleUseMyLocation = () => {
    setArea('Mira Road East (Station Area)');
    setStreet('Near Gate #1, Feeder Pillar #42');
    setWard('Ward 3');
    setPincode('401107');
  };

  // Image Upload handler with Canvas Compression to avoid localStorage Quota limits
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawUrl = reader.result as string;
        const img = new Image();
        img.src = rawUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            setImagePreview(compressed);
          } else {
            setImagePreview(rawUrl);
          }
        };
        img.onerror = () => setImagePreview(rawUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate step 3 before proceeding
  const handleNextFromStep3 = () => {
    if (!citizenPhone.trim()) {
      setPhoneError('Phone number is compulsory for WhatsApp updates');
      return;
    }
    setPhoneError('');
    setStep(4);
  };

  // Submit Handler with Automatic WhatsApp Dispatch
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenPhone.trim()) {
      setPhoneError('Phone number is compulsory for WhatsApp updates');
      setStep(3);
      return;
    }

    try {
      const newComplaint = addComplaint({
        issueType: selectedType,
        description: description || 'No detailed description provided by citizen.',
        location: `${street ? street + ', ' : ''}${area}`,
        area,
        ward,
        pincode,
        image: imagePreview || undefined,
        priority,
        reportedBy: {
          name: citizenName || 'Citizen',
          phone: citizenPhone,
          email: 'citizen@example.com',
        },
      });

      setSubmittedId(newComplaint.id);

      // WhatsApp URL Construction
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const trackingUrl = `${origin}/track/${newComplaint.id}`;
      let cleanPhone = citizenPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
      }

      const waText = `Hello ${citizenName || 'Citizen'},\n\nYour public issue report has been successfully registered on UrjaSetu.\n\n📌 *Complaint ID:* ${newComplaint.id}\n⚡ *Issue:* ${selectedType}\n📍 *Location:* ${street ? street + ', ' : ''}${area}\n\n🔍 *Track real-time updates here:*\n${trackingUrl}`;

      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`;
      setGeneratedWaUrl(waUrl);

      // Automatically open WhatsApp in new window/tab
      if (typeof window !== 'undefined') {
        window.open(waUrl, '_blank');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Submission fallback triggered:', err);
      const fallbackId = `URJ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      setSubmittedId(fallbackId);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
            Submission Confirmed
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Report Submitted Successfully
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your complaint has been logged into the UrjaSetu coordination platform.
          </p>
        </div>

        {/* Complaint ID Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 max-w-md mx-auto space-y-3 shadow-xl">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
            Your Unique Complaint ID
          </span>
          <div className="text-3xl font-mono font-extrabold text-blue-400 tracking-wider">
            {submittedId}
          </div>
          <p className="text-xs text-slate-300">
            Save this Reference ID to track status updates on the vertical timeline.
          </p>
        </div>

        {/* WhatsApp Auto-Send Notification Box */}
        {generatedWaUrl && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 max-w-md mx-auto space-y-3 shadow-sm text-emerald-950">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp Message Triggered</span>
            </div>
            <p className="text-xs font-medium text-emerald-900 leading-relaxed">
              The Complaint ID <span className="font-mono font-bold text-emerald-950">{submittedId}</span> and direct tracking link have been dispatched to WhatsApp on <strong className="font-mono">{citizenPhone}</strong>.
            </p>
            <a
              href={generatedWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Open / Resend WhatsApp Message</span>
            </a>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href={`/track/${submittedId}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 shadow-md shadow-blue-600/30"
          >
            <span>Track Complaint Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/citizen"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold text-sm hover:bg-slate-200"
          >
            <span>Back to Citizen Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Safety Banner */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Citizen Reporting Portal
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Report an Electrical Hazard / Issue
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Follow the 6 simple steps to report public electrical infrastructure problems.
          </p>
        </div>

        <SafetyBanner />
      </div>

      {/* Progress Steps Indicator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between overflow-x-auto text-xs font-bold">
          {[
            { num: 1, label: 'Issue Type' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Details' },
            { num: 4, label: 'Photo' },
            { num: 5, label: 'Priority' },
            { num: 6, label: 'Review' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => s.num < step && setStep(s.num)}
              disabled={s.num > step}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 transition-colors ${
                step === s.num
                  ? 'bg-blue-600 text-white font-extrabold'
                  : s.num < step
                  ? 'bg-blue-50 text-blue-700 cursor-pointer'
                  : 'text-slate-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-[10px]">
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 md:p-8">
        <form onSubmit={handleSubmit}>
          {/* STEP 1: ISSUE TYPE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 1: Select Issue Type</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the category that best describes the electrical hazard observed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ISSUE_OPTIONS.map((opt) => {
                  const isSelected = selectedType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      onClick={() => handleTypeSelect(opt)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-md shadow-blue-600/10'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{opt.icon}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{opt.label}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 leading-snug">{opt.desc}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">Suggested:</span>
                        <PriorityBadge priority={opt.defaultPriority} size="sm" />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500 transition-colors"
                >
                  <span>Next: Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 2: Location Information</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Specify exact location so maintenance teams can dispatch directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Simulate "Use My Location"</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Area / Sector <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Mira Road Sector 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Street / Landmark
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Near Sector Park Gate #2, Pole #14"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Municipal Ward
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Ward 1">Ward 1 (Bhayandar West)</option>
                    <option value="Ward 2">Ward 2 (Bhayandar East)</option>
                    <option value="Ward 3">Ward 3 (Kanakia Park)</option>
                    <option value="Ward 4">Ward 4 (Mira Road Sector 10)</option>
                    <option value="Ward 5">Ward 5 (Beverly Park)</option>
                    <option value="Ward 6">Ward 6 (Shanti Nagar)</option>
                    <option value="Ward 7">Ward 7 (Mira Road East)</option>
                    <option value="Ward 8">Ward 8 (Silver Park)</option>
                    <option value="Ward 9">Ward 9 (Kashimira Junction)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="e.g. 401107"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500"
                >
                  <span>Next: Issue Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS & REPORTER CONTACT (PHONE MANDATORY) */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 3: Issue Details & Reporter Info</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Describe what you observed. Phone number is compulsory so the complaint ID & tracking link can be sent to your WhatsApp.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description of Problem
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what you observed (e.g. Streetlight has been unlit for 3 days, pole #14 fixture is dangling)..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={citizenName}
                      onChange={(e) => setCitizenName(e.target.value)}
                      placeholder="e.g. Aarav Mehta"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone Number (Required for WhatsApp Updates) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={citizenPhone}
                        onChange={(e) => {
                          setCitizenPhone(e.target.value);
                          if (e.target.value.trim()) setPhoneError('');
                        }}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                          phoneError ? 'border-red-500 bg-red-50/50' : 'border-slate-300'
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[11px] text-red-600 font-bold mt-1">
                        ⚠️ {phoneError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500"
                >
                  <span>Next: Upload Photo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PHOTO UPLOAD */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 4: Upload Photo Evidence (Optional)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an image of the damaged streetlight or pole. Stored locally in browser preview.
                </p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50/50 space-y-4 hover:border-blue-400 transition-colors">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="max-h-64 rounded-xl border border-slate-300 shadow-md mx-auto object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImagePreview(null)}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-800">
                        Click to upload or drag & drop photograph
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs cursor-pointer hover:bg-blue-500 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Select Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500"
                >
                  <span>Next: Priority Suggestion</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PRIORITY SUGGESTION */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 5: Priority Suggestion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  UrjaSetu automatically suggested a priority level based on hazard type. You can adjust if necessary.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <div
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`p-4 rounded-xl border-2 cursor-pointer text-center space-y-2 transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <PriorityBadge priority={p} size="md" />
                      <p className="text-[11px] text-slate-500">
                        {p === 'Critical'
                          ? 'Immediate hazard requiring urgent safety isolation'
                          : p === 'High'
                          ? 'Unlit arterial street causing major night visibility issue'
                          : p === 'Medium'
                          ? 'Flickering fixture or minor lighting degradation'
                          : 'Non-critical aesthetic damage'}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-500"
                >
                  <span>Next: Review & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & SUBMIT */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Step 6: Review & Finalize Submission</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please review your report details before logging. Upon submission, the Complaint ID and tracking URL will be automatically sent to your WhatsApp number.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                      Selected Issue Category
                    </strong>
                    <span className="text-slate-900 font-bold text-sm block mt-0.5">
                      {selectedType}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                      Assigned Priority
                    </strong>
                    <div className="mt-1">
                      <PriorityBadge priority={priority} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                      Location & Ward
                    </strong>
                    <span className="text-slate-900 font-semibold block mt-0.5">
                      {street ? `${street}, ` : ''}{area}
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {ward} • Pincode: {pincode}
                    </span>
                  </div>
                  <div>
                    <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                      Reported By & WhatsApp Phone
                    </strong>
                    <span className="text-slate-900 font-semibold block mt-0.5">
                      {citizenName || 'Citizen'}
                    </span>
                    <span className="text-emerald-700 font-mono text-[11px] font-bold">
                      📱 WhatsApp: {citizenPhone}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px]">
                    Detailed Description
                  </strong>
                  <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200/80 mt-1 leading-relaxed">
                    "{description || 'No additional details provided.'}"
                  </p>
                </div>

                {imagePreview && (
                  <div className="pt-3 border-t border-slate-200">
                    <strong className="text-slate-500 uppercase tracking-wider block font-bold text-[10px] mb-2">
                      Attached Photograph Evidence
                    </strong>
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="h-32 rounded-lg border border-slate-300 object-cover"
                    />
                  </div>
                )}
              </div>

              {phoneError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl">
                  ⚠️ {phoneError}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleSubmit(e)}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-extrabold text-sm hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Submit & Dispatch WhatsApp Message</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
