import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Integration() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-black">Integrations</h1>
          <p className="text-gray-600 mt-2">Connect your favorite tools and platforms</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <p className="text-sm text-gray-600 mb-1">Total Integrations</p>
            <p className="text-4xl font-bold text-brand-black">5</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <p className="text-sm text-gray-600 mb-1">Connected</p>
            <p className="text-4xl font-bold text-brand-black">2</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-4xl font-bold text-brand-black">1</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <p className="text-sm text-gray-600 mb-1">Available</p>
            <p className="text-4xl font-bold text-brand-black">1</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search integration..."
              className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <select className="px-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white min-w-[150px]">
            <option>All Categories</option>
            <option>CRM</option>
            <option>Communication</option>
            <option>Social Media</option>
            <option>Analytics</option>
          </select>

          <select className="px-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white min-w-[150px]">
            <option>All Status</option>
            <option>Connected</option>
            <option>Not Connected</option>
            <option>Popular</option>
          </select>
        </div>

        {/* Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* HubSpot Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#FF7A59] rounded-xl flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M18.5 8.5c-1.4 0-2.5 1.1-2.5 2.5v2c0 1.4 1.1 2.5 2.5 2.5s2.5-1.1 2.5-2.5v-2c0-1.4-1.1-2.5-2.5-2.5zm-13 0C4.1 8.5 3 9.6 3 11v2c0 1.4 1.1 2.5 2.5 2.5S8 14.4 8 13v-2c0-1.4-1.1-2.5-2.5-2.5zm6.5 7c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm0-13C10.6 2.5 9.5 3.6 9.5 5S10.6 7.5 12 7.5s2.5-1.1 2.5-2.5S13.4 2.5 12 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black text-lg">HubSpot</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Frequently asked questions about our product features</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Connected</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">Popular</span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Connected</span>
                  <span className="font-medium text-brand-black">2025/01/15</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last sync</span>
                  <span className="font-medium text-brand-black">2 minutes ago</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Contact Sync</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Deal Management</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Activity Tracking</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">+1</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 border border-brand-gray-light rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
                  </svg>
                  <span>Configure</span>
                </button>
                <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Facebook Messenger Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#0084FF] rounded-xl flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.5 2 2 6.14 2 11.25c0 2.9 1.47 5.48 3.77 7.18V22l3.47-1.9c.93.25 1.91.4 2.93.4 5.5 0 9.83-4.14 9.83-9.25S17.5 2 12 2zm.88 12.48l-2.5-2.67-4.88 2.67 5.37-5.7 2.56 2.67 4.82-2.67-5.37 5.7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black text-lg">Facebook Messenger</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Frequently asked questions about our product features</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium">Not Connected</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">Popular</span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Connected</span>
                  <span className="font-medium text-brand-black">2025/01/15</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last sync</span>
                  <span className="font-medium text-brand-black">2 minutes ago</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Contact Sync</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Deal Management</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Activity Tracking</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">+1</span>
              </div>

              <button className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-all">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                <span>Connect</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Business Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black text-lg">WhatsApp Business</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Frequently asked questions about our product features</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Connected</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">Popular</span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Connected</span>
                  <span className="font-medium text-brand-black">2025/01/15</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last sync</span>
                  <span className="font-medium text-brand-black">2 minutes ago</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Contact Sync</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Deal Management</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Activity Tracking</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">+1</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 border border-brand-gray-light rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
                  </svg>
                  <span>Configure</span>
                </button>
                <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Instagram Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] rounded-xl flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black text-lg">Instagram</h3>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">Frequently asked questions about our product features</p>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">Connected</span>
                <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">Popular</span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Connected</span>
                  <span className="font-medium text-brand-black">2025/01/15</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Contact Sync</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Deal Management</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Activity Tracking</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">+1</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 border border-brand-gray-light rounded-lg font-medium hover:bg-gray-50 transition-all">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"/>
                  </svg>
                  <span>Configure</span>
                </button>
                <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}