'use client';

import { UserCircleIcon, Cog6ToothIcon, ArrowLeftIcon, PencilIcon, CheckIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';

interface UserProfile {
  name: string;
  email: string;
  password: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    sessionTimeout: string;
  };
  connectedAccounts: {
    google: boolean;
    apple: boolean;
    spotify: boolean;
  };
  profilePicture: string;
}

export default function ProfilePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Your Name',
    email: 'your.email@example.com',
    password: '********',
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: '30 minutes'
    },
    connectedAccounts: {
      google: false,
      apple: false,
      spotify: true
    },
    profilePicture: ''
  });
  const [editValue, setEditValue] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    // Load saved profile data from localStorage if available
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      // Ensure all required fields are present
      setProfile({
        name: parsedProfile.name || 'Your Name',
        email: parsedProfile.email || 'your.email@example.com',
        password: parsedProfile.password || '********',
        notifications: {
          email: parsedProfile.notifications?.email ?? true,
          push: parsedProfile.notifications?.push ?? true,
          marketing: parsedProfile.notifications?.marketing ?? false
        },
        security: {
          twoFactor: parsedProfile.security?.twoFactor ?? false,
          loginAlerts: parsedProfile.security?.loginAlerts ?? true,
          sessionTimeout: parsedProfile.security?.sessionTimeout || '30 minutes'
        },
        connectedAccounts: {
          google: parsedProfile.connectedAccounts?.google ?? false,
          apple: parsedProfile.connectedAccounts?.apple ?? false,
          spotify: parsedProfile.connectedAccounts?.spotify ?? true
        },
        profilePicture: parsedProfile.profilePicture || ''
      });
    }
  }, []);

  const handleEditStart = (field: string, value: string) => {
    setIsEditing(field);
    setEditValue(value);
  };

  const handleEditSave = (field: keyof UserProfile) => {
    if (field === 'password' && editValue.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    if (field === 'email' && !editValue.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    const updatedProfile = { ...profile, [field]: editValue };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setIsEditing(null);
  };

  const handleEditCancel = () => {
    setIsEditing(null);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('File size should be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedProfile = {
          ...profile,
          profilePicture: base64String
        };
        setProfile(updatedProfile);
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        showToast('Profile picture updated successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <button 
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors duration-200"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                router.push('/');
              }, 300);
            }}
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
        </div>

        {/* Profile Section */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                />
              ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-400" />
              )}
              <label className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-600 transition-colors">
                <PhotoIcon className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>
            </div>
            <div className="flex-1">
              {isEditing === 'name' ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="bg-white/10 text-white px-3 py-1 rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave('name')}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold">{profile.name}</h2>
                  <button
                    onClick={() => handleEditStart('name', profile.name)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <PencilIcon className="w-4 h-4 text-white/60" />
                  </button>
                </div>
              )}
              <p className="text-white/60">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Email</span>
                {isEditing === 'email' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-white/10 text-white px-3 py-1 rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave('email')}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <XMarkIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60">{profile.email}</span>
                    <button
                      onClick={() => handleEditStart('email', profile.email)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <PencilIcon className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>Password</span>
                {isEditing === 'password' ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-white/10 text-white px-3 py-1 rounded"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave('password')}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <CheckIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <XMarkIcon className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-white/60">••••••••</span>
                    <button
                      onClick={() => handleEditStart('password', '')}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <PencilIcon className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Notification Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.notifications.email}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        notifications: {
                          ...profile.notifications,
                          email: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                      showToast(
                        e.target.checked 
                          ? 'Email notifications enabled' 
                          : 'Email notifications disabled',
                        'success'
                      );
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Push Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.notifications.push}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        notifications: {
                          ...profile.notifications,
                          push: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                      showToast(
                        e.target.checked 
                          ? 'Push notifications enabled' 
                          : 'Push notifications disabled',
                        'success'
                      );
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Marketing Emails</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.notifications.marketing}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        notifications: {
                          ...profile.notifications,
                          marketing: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                      showToast(
                        e.target.checked 
                          ? 'Marketing emails enabled' 
                          : 'Marketing emails disabled',
                        'success'
                      );
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Two-Factor Authentication</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.security.twoFactor}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        security: {
                          ...profile.security,
                          twoFactor: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Login Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.security.loginAlerts}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        security: {
                          ...profile.security,
                          loginAlerts: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Session Timeout</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white/10 rounded-lg px-4 py-2 pr-10 text-white cursor-pointer hover:bg-white/15 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    value={profile.security.sessionTimeout}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        security: {
                          ...profile.security,
                          sessionTimeout: e.target.value
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  >
                    <option className="bg-gray-800">15 minutes</option>
                    <option className="bg-gray-800">30 minutes</option>
                    <option className="bg-gray-800">1 hour</option>
                    <option className="bg-gray-800">Never</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/60">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Accounts */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Connected Accounts</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Google</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.connectedAccounts.google}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        connectedAccounts: {
                          ...profile.connectedAccounts,
                          google: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Apple</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.connectedAccounts.apple}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        connectedAccounts: {
                          ...profile.connectedAccounts,
                          apple: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
              <div className="flex justify-between items-center">
                <span>Spotify</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={profile.connectedAccounts.spotify}
                    onChange={(e) => {
                      const updatedProfile = {
                        ...profile,
                        connectedAccounts: {
                          ...profile.connectedAccounts,
                          spotify: e.target.checked
                        }
                      };
                      setProfile(updatedProfile);
                      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
                    }}
                  />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className="fixed inset-0 pointer-events-none">
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
} 