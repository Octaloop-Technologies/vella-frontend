import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Knowledge() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-black">Knowledge Base</h1>
          <p className="text-gray-600 mt-2">Manage your knowledge base and documents</p>
        </div>
        
        <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
          <p className="text-gray-600">Knowledge base interface coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}