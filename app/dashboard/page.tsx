import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your agents.</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#8266D4">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Active Agents</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-brand-black">12</p>
                <p className="text-sm text-green-600">+2 this month</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#007BFF">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Inbound Chats</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-brand-black">1,247</p>
                <p className="text-sm text-green-600">+16% from last week</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF8C00">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Knowledge Docs</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-brand-black">89</p>
                <p className="text-sm text-green-600">+5 added today</p>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#28A745">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-brand-black">23.4%</p>
                <p className="text-sm text-green-600">+21% improvement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Create New Agent</h3>
                <p className="text-sm text-gray-600">Set up a new AI agent in minutes</p>
              </div>
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Connect CRM</h3>
                <p className="text-sm text-gray-600">Integrate with your favorite tools</p>
              </div>
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600">Expand your knowledge base</p>
              </div>
              <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="bg-brand-white rounded-lg shadow-sm border border-brand-gray-light">
          <div className="p-6 border-b border-brand-gray-light">
            <h2 className="text-xl font-semibold text-brand-black">Top Performing Agents</h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#007BFF">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-brand-black">Sales Assistant</p>
                    <p className="text-sm text-gray-500">342 conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full" style={{width: '89%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">89% success</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#28A745">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-brand-black">Support Bot</p>
                    <p className="text-sm text-gray-500">256 conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">89% success</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#8266D4">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-brand-black">Lead Qualifier</p>
                    <p className="text-sm text-gray-500">342 conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full" style={{width: '92%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">89% success</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF8C00">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-brand-black">FAQ Helper</p>
                    <p className="text-sm text-gray-500">342 conversations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16">89% success</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Draft</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}