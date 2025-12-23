'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Navbar from '@/app/components/Navbar';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  user_fname: string;
  user_lname: string;
  user_email: string;
}

export default function Active() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [tagData, setTagData] = useState({
    tagId: '',
    category: '',
    customCategory: '',
    description: ''
  });
  const [userItems, setUserItems] = useState<any[]>([]);
  const [itemStatus, setItemStatus] = useState<{ [key: string]: boolean }>({});
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Retrieve user profile from localStorage
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setUserProfile(parsed);
        console.log('Profile loaded from localStorage:', parsed);
      } catch (e) {
        console.error('Failed to parse stored profile:', e);
      }
    } else {
      console.log('No profile found in localStorage');
    }

    // Also check Supabase session to ensure current user
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Active Supabase session for user:', session.user.id);
      }
    };
    checkSession();
  }, []);

  const fetchUserItems = async () => {
    try {
      setIsLoadingItems(true);
      setUserItems([]); // Clear previous items first
      
      // Get authenticated session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        alert('Please log in to view items');
        return;
      }

      const userId = session.user.id;
      console.log('Fetching items for current user:', userId);

      // Verify this matches stored profile
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        if (parsed.user_id !== userId) {
          console.warn('User ID mismatch! Clearing old data.');
          localStorage.removeItem('userProfile');
          setUserProfile(null);
        }
      }

      // Fetch items from Supabase using current session
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching items:', error);
        return;
      }

      console.log('Items fetched for user:', userId, data);
      setUserItems(data || []);
      // Initialize all items as active (true)
      const initialStatus: { [key: string]: boolean } = {};
      (data || []).forEach((item: any, index: number) => {
        initialStatus[item.tag_id] = true;
      });
      setItemStatus(initialStatus);
      setShowItemsModal(true);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera not supported on this device');
        return;
      }

      // Request camera access with mobile-friendly constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      // Show camera UI after stream is successfully obtained
      setShowCamera(true);
      
      // Set stream immediately to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // For mobile, ensure the video plays
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video playing successfully');
            })
            .catch((error) => {
              console.error('Play error:', error);
              setCameraError('Unable to play camera stream. Please try again.');
              setShowCamera(false);
            });
        }
      }
    } catch (error) {
      setShowCamera(false);
      const err = error as Error;
      console.error('Camera error full:', error);
      
      if (err.name === 'NotAllowedError') {
        setCameraError('Camera permission denied. Please allow access in browser settings.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is already in use. Please close other apps using the camera.');
      } else if (err.name === 'OverconstrainedError') {
        setCameraError('Your device camera does not support the requested resolution.');
      } else {
        setCameraError('Unable to access camera: ' + err.message);
      }
    }
  };

  const stopCamera = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch (error) {
      console.error('Error stopping camera:', error);
    }
    setShowCamera(false);
    setCameraError(null);
  };

  const saveTagToSupabase = async () => {
    try {
      setIsSubmitting(true);
      setSubmitMessage(null);

      // Validation
      if (!tagData.tagId || tagData.tagId.length !== 8) {
        setSubmitMessage({ type: 'error', text: 'Tag ID must be exactly 8 digits' });
        setIsSubmitting(false);
        return;
      }

      if (!tagData.category) {
        setSubmitMessage({ type: 'error', text: 'Please select a category' });
        setIsSubmitting(false);
        return;
      }

      if (tagData.category === 'other' && !tagData.customCategory) {
        setSubmitMessage({ type: 'error', text: 'Please specify the category' });
        setIsSubmitting(false);
        return;
      }

      // Get authenticated session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error('No active session');
        setSubmitMessage({ type: 'error', text: 'User session expired. Please login again.' });
        setIsSubmitting(false);
        return;
      }

      const userId = session.user.id;
      console.log('Using user ID from session:', userId);

      // Determine final category
      const finalCategory = tagData.category === 'other' ? tagData.customCategory : tagData.category;

      // Insert data into items table using Supabase client
      const { data, error } = await supabase
        .from('items')
        .insert([
          {
            user_id: userId,
            tag_id: tagData.tagId,
            tag_category: finalCategory,
            tag_description: tagData.description || null,
          },
        ]);

      if (error) {
        console.error('Supabase insert error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        setSubmitMessage({ type: 'error', text: `Failed to save tag: ${error.message}` });
        setIsSubmitting(false);
        return;
      }

      console.log('Tag saved successfully:', data);
      
      // Success
      setSubmitMessage({ type: 'success', text: 'Tag activated successfully!' });
      
      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setShowTagModal(false);
        setTagData({ tagId: '', category: '', customCategory: '', description: '' });
        setSubmitMessage(null);
      }, 2000);
    } catch (error) {
      console.error('Error saving tag:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      setSubmitMessage({ type: 'error', text: errorMessage });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Active Page Content - Fully Responsive */}
      <section className="py-[clamp(3rem,8vw,5rem)] bg-gradient-to-br from-blue-50 via-white to-cyan-50 min-h-[calc(100vh-64px)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,5vw,4rem)] items-center">
            {/* Image Section - Hidden on Mobile */}
            <div className="flex justify-center order-2 lg:order-1 hidden sm:flex">
              <div className="relative">
                <Image
                  src="/phone-laptop.png"
                  alt="Phone and Laptop"
                  width={400}
                  height={500}
                  className="w-full max-w-[clamp(250px,80vw,400px)] h-auto relative z-10 drop-shadow-2xl"
                  style={{ opacity: 1, backgroundColor: 'transparent' }}
                />
              </div>
            </div>

            {/* Content Section - Mobile First */}
            <div className="space-y-[clamp(1.5rem,3vw,2.5rem)] order-1 lg:order-2">
              {/* Welcome Message if User is Logged In */}
              {userProfile && (
                <div className="p-[clamp(1rem,2vw,1.5rem)] bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-lg text-blue-900">
                  <p className="font-semibold" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>
                    Welcome, <span className="text-blue-700 font-bold">{userProfile.user_fname}</span>!
                  </p>
                  <p className="text-blue-800 mt-1" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}>
                    You're logged in and ready to activate items.
                  </p>
                </div>
              )}

              <div className="space-y-[clamp(1rem,2vw,1.5rem)]">
                <div className="inline-block">
                  <span className="px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1vw,0.75rem)] bg-blue-100 border border-blue-300 rounded-full text-blue-700 font-semibold"
                    style={{fontSize: 'clamp(0.7rem, 1vw, 0.875rem)'}}>
                    🚀 Get Started
                  </span>
                </div>
                <h1 className="font-black text-gray-900 leading-tight"
                  style={{fontSize: 'clamp(1.75rem, 6vw, 3.5rem)'}}>
                  Activate Your <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Items</span> Now
                </h1>
                <p className="text-gray-700 leading-relaxed"
                  style={{fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'}}>
                  Start protecting your valuables today. Register as a new user or login to your existing account to activate your items instantly.
                </p>
              </div>

              {/* Buttons - Stack on Mobile */}
              <div className="pt-[clamp(1rem,2vw,1.5rem)] flex flex-col sm:flex-row gap-[clamp(0.75rem,2vw,1rem)] justify-center lg:justify-start">
                {userProfile ? (
                  <button
                    onClick={() => setShowTagModal(true)}
                    className={`group px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 w-full sm:w-fit ${
                      selectedOption === 'new'
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-300/50'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-2xl hover:shadow-blue-300/50'
                    }`}
                    style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                  >
                    <span>Lets Activate</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ) : (
                  <Link href="/register" className="w-full sm:w-fit">
                    <button
                      onClick={() => setSelectedOption('new')}
                      className={`group px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 w-full ${
                        selectedOption === 'new'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-2xl shadow-blue-300/50'
                          : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-2xl hover:shadow-blue-300/50'
                      }`}
                      style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                    >
                      <span>Lets Activate</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                )}

                {userProfile ? (
                  <button
                    onClick={fetchUserItems}
                    className={`group px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 w-full sm:w-fit ${
                      selectedOption === 'login'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-2xl shadow-green-300/50'
                        : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-300/50'
                    }`}
                    style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                  >
                    <span>View items</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                ) : (
                  <Link href="/login" className="w-full sm:w-fit">
                    <button
                      onClick={() => setSelectedOption('login')}
                      className={`group px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,1.5vw,1rem)] rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-3 w-full ${
                        selectedOption === 'login'
                          ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-2xl shadow-green-300/50'
                          : 'bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:shadow-2xl hover:shadow-green-300/50'
                      }`}
                      style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                    >
                      <span>View items</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </Link>
                )}
              </div>

              {/* Info Section - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)] pt-[clamp(1rem,2vw,2rem)]">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-[clamp(1rem,2vw,1.5rem)] rounded-xl border border-blue-200 hover:border-blue-300 transition-colors shadow-sm hover:shadow-md">
                  <h3 className="font-bold text-gray-900 mb-1" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>Instant Setup</h3>
                  <p className="text-gray-700" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}>Register in minutes</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 p-[clamp(1rem,2vw,1.5rem)] rounded-xl border border-cyan-200 hover:border-cyan-300 transition-colors shadow-sm hover:shadow-md">
                  <h3 className="font-bold text-gray-900 mb-1" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>Real-time Alerts</h3>
                  <p className="text-gray-700" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}>Instant notifications</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-[clamp(1rem,2vw,1.5rem)] rounded-xl border border-green-200 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
                <h3 className="font-bold text-gray-900 mb-1" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>Pan-India Reach</h3>
                <p className="text-gray-700" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}>Connect across India</p>
              </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-[clamp(1rem,2vw,1.5rem)] rounded-xl border border-purple-200 hover:border-purple-300 transition-colors shadow-sm hover:shadow-md">
                  <h3 className="font-bold text-gray-900 mb-1" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>Secure</h3>
                  <p className="text-gray-700" style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}>Protected transactions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 py-[clamp(2rem,5vw,3rem)] mt-[clamp(2rem,5vw,3rem)] px-[clamp(1rem,3vw,2rem)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,3vw,2rem)] mb-[clamp(1.5rem,2vw,2rem)]">
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Product
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/shop" className="text-gray-600 hover:text-gray-900">Shop</Link></li>
                <li><Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Company
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link></li>
                <li><Link href="/news-feed" className="text-gray-600 hover:text-gray-900">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-[clamp(0.75rem,1.5vw,1rem)]"
                style={{fontSize: 'clamp(0.9375rem, 1.5vw, 1rem)'}}>
                Legal
              </h4>
              <ul className="space-y-[clamp(0.5rem,1vw,0.75rem)]"
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>
                <li><Link href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-[clamp(1.5rem,2vw,2rem)] text-center"
            style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)', color: '#6b7280'}}>
            <p>&copy; 2024 Back2You. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* View Items Modal - Mobile Responsive */}
      {showItemsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[clamp(0.75rem,2vw,1rem)] backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[clamp(1.5rem,3vw,2rem)] shadow-2xl w-full max-w-3xl overflow-hidden my-[clamp(1rem,2vw,2rem)]">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-[clamp(1.5rem,3vw,2rem)] text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <h2 className="font-bold mb-1" style={{fontSize: 'clamp(1.5rem, 4vw, 2rem)'}}>Your Items</h2>
                <p className="text-green-100" style={{fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'}}>View all your protected items</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-[clamp(1rem,2vw,2rem)]">
              {isLoadingItems ? (
                <div className="text-center py-[clamp(2rem,4vw,3rem)]">
                  <p className="text-gray-600 font-semibold" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>Loading your items...</p>
                </div>
              ) : userItems.length === 0 ? (
                <div className="text-center py-[clamp(2rem,4vw,3rem)]">
                  <p className="text-gray-600 mb-[clamp(1rem,2vw,1.5rem)]" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'}}>
                    You haven't added any items yet.
                  </p>
                  <button
                    onClick={() => {
                      setShowItemsModal(false);
                      setShowTagModal(true);
                    }}
                    className="px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all"
                    style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}
                  >
                    Add Your First Item
                  </button>
                </div>
              ) : (
                <div className="space-y-[clamp(0.75rem,1.5vw,1rem)]">
                  {userItems.map((item: any, index: number) => {
                    const isActive = itemStatus[item.tag_id] !== false;
                    return (
                    <div key={index} className={`bg-gradient-to-r border-2 rounded-xl p-[clamp(1rem,2vw,1.5rem)] transition-all ${
                      isActive 
                        ? 'from-green-50 to-green-100 border-green-300 shadow-md' 
                        : 'from-gray-100 to-gray-200 border-gray-400 shadow-sm opacity-70'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[clamp(0.75rem,1.5vw,1rem)]">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.75rem,1.5vw,1rem)] w-full">
                          <div>
                            <p className="text-gray-600 font-semibold mb-1" style={{fontSize: 'clamp(0.7rem, 1vw, 0.8125rem)'}}>TAG ID</p>
                            <p className="font-mono font-bold text-gray-900" style={{fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)'}}>{item.tag_id}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-semibold mb-1" style={{fontSize: 'clamp(0.7rem, 1vw, 0.8125rem)'}}>CATEGORY</p>
                            <p className={`font-bold capitalize ${
                              isActive ? 'text-green-600' : 'text-gray-500'
                            }`} style={{fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)'}}>{item.tag_category}</p>
                          </div>
                        </div>
                        {/* Tiny ON/OFF Toggle (extra small, rounded) */}
                        <div className="inline-flex items-center gap-0.5 text-[9px] leading-none">
                          <button
                            onClick={() => setItemStatus(prev => ({
                              ...prev,
                              [item.tag_id]: true
                            }))}
                            className={`px-1 py-0.5 rounded-full border transition-colors duration-150 ${
                              isActive
                                ? 'bg-green-500 border-green-500 text-white'
                                : 'bg-white border-gray-300 text-gray-600'
                            }`}
                          >
                            ON
                          </button>
                          <button
                            onClick={() => setItemStatus(prev => ({
                              ...prev,
                              [item.tag_id]: false
                            }))}
                            className={`px-1 py-0.5 rounded-full border transition-colors duration-150 ${
                              !isActive
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'bg-white border-gray-300 text-gray-600'
                            }`}
                          >
                            OFF
                          </button>
                        </div>
                      </div>
                      {item.tag_description && (
                        <div className="mt-[clamp(0.75rem,1.5vw,1rem)] pt-[clamp(0.75rem,1.5vw,1rem)] border-t border-gray-300">
                          <p className="text-gray-600 font-semibold mb-1" style={{fontSize: 'clamp(0.7rem, 1vw, 0.8125rem)'}}>DESCRIPTION</p>
                          <p className="text-gray-700" style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}>{item.tag_description}</p>
                        </div>
                      )}
                      {item.created_at && (
                        <div className="mt-1" style={{fontSize: 'clamp(0.6875rem, 1vw, 0.75rem)', color: '#6b7280'}}>
                          Added on: {new Date(item.created_at).toLocaleDateString()} {isActive ? '✓ Active' : '⊘ Inactive'}
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}

              {/* Close Button */}
              <div className="mt-[clamp(1rem,2vw,2rem)] flex flex-col sm:flex-row gap-[clamp(0.75rem,1.5vw,1rem)]">
                <button
                  onClick={() => setShowItemsModal(false)}
                  className="flex-1 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all"
                  style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}
                >
                  Close
                </button>
                {userItems.length > 0 && (
                  <button
                    onClick={() => {
                      setShowItemsModal(false);
                      setShowTagModal(true);
                    }}
                    className="flex-1 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all"
                    style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}
                  >
                    Add New Item
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tag Setup Modal - Mobile Responsive */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-[clamp(0.75rem,2vw,1rem)] backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[clamp(1.5rem,3vw,2rem)] shadow-2xl w-full max-w-2xl overflow-hidden my-[clamp(1rem,2vw,2rem)]">
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 p-[clamp(1.5rem,3vw,2rem)] text-white">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
              <div className="relative z-10">
                <h2 className="font-bold mb-1" style={{fontSize: 'clamp(1.5rem, 4vw, 2rem)'}}>Set Up Your Tag</h2>
                <p className="text-orange-100" style={{fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'}}>Secure your valuable items instantly</p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-[clamp(1rem,2vw,2rem)] space-y-[clamp(1rem,2vw,1.5rem)]">
              {/* Scan option removed: only manual entry below */}

              {/* Tag ID Input */}
              <div>
                <label className="block font-bold text-gray-800 mb-[clamp(0.5rem,1vw,0.75rem)]" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>TAG / STICKER ID (8 digits only)</label>
                <input
                  type="text"
                  placeholder="00000000"
                  maxLength={8}
                  value={tagData.tagId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                    setTagData({...tagData, tagId: value});
                  }}
                  className="w-full px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center font-mono text-black font-bold transition-all"
                  style={{fontSize: 'clamp(1rem, 2vw, 1.25rem)'}}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">{tagData.tagId.length}/8 digits</p>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block font-bold text-gray-800 mb-[clamp(0.5rem,1vw,0.75rem)]" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>
                  CATEGORY <span className="text-red-500">*</span>
                </label>
                <select
                  value={tagData.category}
                  onChange={(e) => setTagData({...tagData, category: e.target.value, customCategory: ''})}
                  className="w-full px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white cursor-pointer font-medium transition-all"
                  style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                >
                  <option value="">Choose Category</option>
                  <option value="phone">Phone</option>
                  <option value="laptop">Laptop</option>
                  <option value="wallet">Wallet</option>
                  <option value="keys">Keys</option>
                  <option value="luggage">Luggage</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Custom Category Input */}
              {tagData.category === 'other' && (
                <div className="bg-blue-50 border-2 border-blue-200 p-[clamp(0.75rem,1.5vw,1rem)] rounded-xl">
                  <label className="block font-bold text-gray-800 mb-[clamp(0.5rem,1vw,0.75rem)]" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>PLEASE SPECIFY CATEGORY</label>
                  <input
                    type="text"
                    placeholder="Enter your category..."
                    value={tagData.customCategory}
                    onChange={(e) => setTagData({...tagData, customCategory: e.target.value})}
                    className="w-full px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-blue-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 font-medium transition-all"
                    style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-800 mb-[clamp(0.5rem,1vw,0.75rem)]" style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}>DESCRIPTION</label>
                <textarea
                  value={tagData.description}
                  onChange={(e) => setTagData({...tagData, description: e.target.value})}
                  placeholder="Add details about your item..."
                  className="w-full px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 resize-none h-[clamp(80px,15vw,150px)] text-gray-700 font-medium transition-all"
                  style={{fontSize: 'clamp(0.875rem, 1.5vw, 1rem)'}}
                />
              </div>

              {/* Submit Message */}
              {submitMessage && (
                <div className={`text-sm p-[clamp(0.75rem,1.5vw,1rem)] rounded-xl font-semibold ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-100 border-2 border-green-300 text-green-700' 
                    : 'bg-red-100 border-2 border-red-300 text-red-700'
                }`}
                style={{fontSize: 'clamp(0.8125rem, 1.25vw, 0.875rem)'}}
                >
                  {submitMessage.text}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-[clamp(0.75rem,1.5vw,1rem)] pt-[clamp(1rem,2vw,1.5rem)]">
                <button
                  onClick={() => setShowTagModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}
                >
                  CANCEL
                </button>
                <button
                  onClick={saveTagToSupabase}
                  disabled={isSubmitting}
                  className="flex-1 px-[clamp(0.75rem,1.5vw,1rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{fontSize: 'clamp(0.75rem, 1.25vw, 0.875rem)'}}
                >
                  {isSubmitting ? 'ACTIVATING...' : 'ACTIVATE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal - Removed, now at /return page */}
    </main>
  );
}
