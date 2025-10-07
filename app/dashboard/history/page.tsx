import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function History() {
  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-brand-black">History</h1>
          <p className="text-gray-600 mt-2">View your conversation and activity history</p>
        </div>
        
        <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-brand-gray-light">
          <p className="text-gray-600">History interface coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
}