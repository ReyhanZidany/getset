'use client';

import Link from 'next/link';
import { Sparkles, ShoppingBag, Calendar, CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Welcome to GetSet
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Your Smart Closet Organizer with Weather-Based Outfit Suggestions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <ShoppingBag className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Virtual Wardrobe</h3>
              <p className="text-sm text-slate-600">
                Organize all your clothing items with photos and tags
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <CloudSun className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Weather Integration</h3>
              <p className="text-sm text-slate-600">
                Get outfit suggestions based on real-time weather
              </p>
            </div>

            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <Calendar className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-900 mb-2">Outfit Calendar</h3>
              <p className="text-sm text-slate-600">
                Plan and track your daily outfits effortlessly
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <p className="mt-4 text-sm text-slate-500">
              All your data is stored securely in your browser
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

