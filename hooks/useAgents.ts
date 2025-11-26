import { useState, useEffect, useCallback } from 'react';
import { apiService, AgentsParams, ApiAgent } from '@/lib/api';
import { transformApiAgentsToTable } from '@/lib/transformers';
import { AgentsTable } from '@/types/table';

export interface UseAgentsResult {
  agents: AgentsTable[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  refreshAgents: () => Promise<void>;
  searchAgents: (params: AgentsParams) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
}

export function useAgents(initialParams: AgentsParams = {}): UseAgentsResult {
  const [agents, setAgents] = useState<AgentsTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams.page || 1);
  const [limit, setLimit] = useState(initialParams.limit || 10);

  const fetchAgents = useCallback(async (params: AgentsParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAgents({
        page,
        limit,
        ...params,
      });
      // console.log("Fetched agents response:", response);
      const transformedAgents = transformApiAgentsToTable(response.agents);
      // console.log("Transformed agents data:", transformedAgents);
      setAgents(transformedAgents);
      setTotal(response.total);
      setPage(response.page);
      setLimit(response.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  const refreshAgents = useCallback(() => {
    return fetchAgents();
  }, [fetchAgents]);

  const searchAgents = useCallback(async (params: AgentsParams) => {
    return fetchAgents(params);
  }, [fetchAgents]);

  const deleteAgent = useCallback(async (id: string) => {
    try {
      setError(null);
      await apiService.deleteAgent(id);
      // Refresh the agents list after deletion
      await refreshAgents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent');
      throw err;
    }
  }, [refreshAgents]);

  useEffect(() => {
    fetchAgents(initialParams);
  }, []);

  return {
    agents,
    loading,
    error,
    total,
    page,
    limit,
    refreshAgents,
    searchAgents,
    deleteAgent,
  };
}