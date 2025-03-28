
import React from "react";
import Navbar from "@/components/Navbar";

const SettingsPage: React.FC = () => {
  return (
    <div className="pb-16 min-h-screen bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="p-4">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-2">Account</h2>
            <div className="bg-white rounded-lg divide-y">
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Profile</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Notifications</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">Appearance</h2>
            <div className="bg-white rounded-lg divide-y">
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Theme</span>
                <div className="flex items-center">
                  <span className="mr-2">Light</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Text Size</span>
                <div className="flex items-center">
                  <span className="mr-2">Medium</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-2">About</h2>
            <div className="bg-white rounded-lg divide-y">
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Version</span>
                <span className="text-gray-500">1.0.0</span>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Terms of Service</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
              <div className="px-4 py-3 flex justify-between items-center">
                <span>Privacy Policy</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default SettingsPage;
