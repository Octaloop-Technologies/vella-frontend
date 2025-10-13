import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Knowledge() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Knowledge Base</h1>
            <p className="text-gray-600 mt-2">Manage documents and content for your AI agents</p>
          </div>
          <button className="px-6 py-2.5 bg-brand-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-all flex items-center space-x-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            <span>Upload Document</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Total Documents</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">5</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Published Documents</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">2</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Processing</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">1</p>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Errors</span>
            </div>
            <p className="text-3xl font-bold text-brand-black">1</p>
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
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <select className="px-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white min-w-[150px]">
            <option>All Types</option>
            <option>PDF</option>
            <option>Word</option>
            <option>Text</option>
          </select>

          <select className="px-4 py-2.5 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white min-w-[150px]">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Processing</option>
            <option>Error</option>
          </select>
        </div>

        {/* View Toggle and Knowledge Base Section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-brand-black">Knowledge Base</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded hover:bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
            <button className="p-2 rounded bg-gray-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8266D4" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product FAQ Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#8266D4] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M12 19c.946 0 1.81-.278 2.54-.75H9.46c.73.472 1.594.75 2.54.75zM12 5c-3.86 0-7 3.14-7 7 0 2.38 1.19 4.47 3 5.74V19c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm3.5 9.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm0-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm0-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">Product FAQ</h3>
                    <span className="inline-block text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium mt-1">Published</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Frequently asked questions about our product features</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-brand-black">125 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modified</span>
                  <span className="font-medium text-brand-black">2024-01-20</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">product</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">support</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">faq</span>
              </div>
            </div>
          </div>

          {/* Sales Playbook Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#8266D4] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">Sales Playbook</h3>
                    <span className="inline-block text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium mt-1">Published</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Complete sales process and objection handling guide</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-brand-black">125 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modified</span>
                  <span className="font-medium text-brand-black">2024-01-20</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">product</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">support</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">faq</span>
              </div>
            </div>
          </div>

          {/* Customer Data Export Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#8266D4] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M3 3v18h18"/>
                      <path d="M18 17V9"/>
                      <path d="M13 17V5"/>
                      <path d="M8 17v-3"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">Customer Data Export</h3>
                    <span className="inline-block text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium mt-1">Processing</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Customer contact information and preferences</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-brand-black">125 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modified</span>
                  <span className="font-medium text-brand-black">2024-01-20</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">product</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">support</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">faq</span>
              </div>
            </div>
          </div>

          {/* Support Guidelines Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#8266D4] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="12" y1="18" x2="12" y2="12"/>
                      <line x1="9" y1="15" x2="15" y2="15"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">Support Guidelines</h3>
                    <span className="inline-block text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium mt-1">Draft</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Internal support team guidelines and procedures</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-brand-black">125 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modified</span>
                  <span className="font-medium text-brand-black">2024-01-20</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">product</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">support</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">faq</span>
              </div>
            </div>
          </div>

          {/* API Documentation Card */}
          <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#8266D4] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-black">API Documentation</h3>
                    <span className="inline-block text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium mt-1">Error</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Technical API documentation for developers</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Size</span>
                  <span className="font-medium text-brand-black">125 KB</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modified</span>
                  <span className="font-medium text-brand-black">2024-01-20</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">product</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">support</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">faq</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}