import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function Workflows() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-black">Workflows</h1>
          <p className="text-gray-600 mt-2">Create and manage your automated workflows</p>
        </div>
        
        <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
          <p className="text-gray-600">Workflows interface coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}