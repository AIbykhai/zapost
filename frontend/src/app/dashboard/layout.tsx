import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Add your dashboard layout components here */}
        <main className="p-4">{children}</main>
      </div>
    </ProtectedRoute>
  );
} 