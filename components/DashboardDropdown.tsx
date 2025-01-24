import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';

type SavedDashboard = {
  id: string;
  created_at: string;
  allocation: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  risk_score: number;
  expected_return: number;
};

export default function DashboardDropdown() {
  const [dashboards, setDashboards] = useState<SavedDashboard[]>([]);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth.currentUser) {
      loadSavedDashboards();
    }
  }, [auth.currentUser]);

  const loadSavedDashboards = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_dashboards')
        .select('*')
        .eq('user_id', auth.currentUser?.uid)
        .order('created_at', { ascending: false })
        .limit(5); // Limit to last 5 dashboards

      if (error) throw error;

      setDashboards(data as SavedDashboard[]);
    } catch (error) {
      console.error('Error loading dashboards:', error);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (dashboards.length === 0) {
    return (
      <div className="px-4 py-2 text-sm text-gray-500">
        No saved dashboards yet
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-auto">
      {dashboards.map((dashboard) => (
        <div
          key={dashboard.id}
          className="px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-900">
              {formatDate(dashboard.created_at)}
            </span>
            <span className="text-sm text-gray-500">
              Risk: {dashboard.risk_score} | Return: {dashboard.expected_return}%
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex flex-wrap gap-2">
              {dashboard.allocation.map((item) => (
                <span 
                  key={item.name}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {item.name}: {item.value}%
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 