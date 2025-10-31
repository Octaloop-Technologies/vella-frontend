'use client';

import { useState, useEffect } from 'react';
import { configService } from '@/lib/configApi';
import type { 
  AgentTypesResponse,
  AgentTypeConfig,
  Language, 
  Gender, 
  Accent,
  Persona, 
  Tune,
  VoiceDetailsResponse
} from '@/lib/configApi';

export function useAgentTypes() {
  const [agentTypes, setAgentTypes] = useState<AgentTypesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgentTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await configService.getAgentTypes();
        setAgentTypes(response);
      } catch (err) {
        console.error('Failed to fetch agent types:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch agent types');
      } finally {
        setLoading(false);
      }
    };

    fetchAgentTypes();
  }, []);

  return { agentTypes, loading, error };
}

export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getLanguages();
        setLanguages(data);
      } catch (err) {
        console.error('Failed to fetch languages:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch languages');
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  return { languages, loading, error };
}

export function useGenders() {
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getGenders();
        setGenders(data);
      } catch (err) {
        console.error('Failed to fetch genders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch genders');
      } finally {
        setLoading(false);
      }
    };

    fetchGenders();
  }, []);

  return { genders, loading, error };
}

export function usePersonasByGender(gender?: string) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gender) {
      setPersonas([]);
      return;
    }

    const fetchPersonas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getPersonasByGender(gender);
        setPersonas(data);
      } catch (err) {
        console.error('Failed to fetch personas:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch personas');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [gender]);

  return { personas, loading, error };
}

export function useAccentsByGender(gender?: string) {
  const [accents, setAccents] = useState<Accent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gender) {
      setAccents([]);
      return;
    }

    const fetchAccents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getAccentsByGender(gender);
        setAccents(data);
      } catch (err) {
        console.error('Failed to fetch accents:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch accents');
      } finally {
        setLoading(false);
      }
    };

    fetchAccents();
  }, [gender]);

  return { accents, loading, error };
}

export function usePersonasByAccent(accent?: string, gender?: string) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accent || !gender) {
      setPersonas([]);
      return;
    }

    const fetchPersonas = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getPersonasByAccent(accent, gender);
        console.log('Fetched personas by accent:', data);
        setPersonas(data);
      } catch (err) {
        console.error('Failed to fetch personas by accent:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch personas');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonas();
  }, [accent, gender]);

  return { personas, loading, error };
}

export function useTunes() {
  const [tunes, setTunes] = useState<Tune[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTunes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getTunes();
        setTunes(data);
      } catch (err) {
        console.error('Failed to fetch tunes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tunes');
      } finally {
        setLoading(false);
      }
    };

    fetchTunes();
  }, []);

  return { tunes, loading, error };
}



// Combined hook for all configurations
export function useAllConfigurations() {
  const agentTypesHook = useAgentTypes();
  const languagesHook = useLanguages();
  const gendersHook = useGenders();
  const tunesHook = useTunes();

  const isLoading = agentTypesHook.loading || languagesHook.loading || gendersHook.loading || tunesHook.loading;
  const hasError = agentTypesHook.error || languagesHook.error || gendersHook.error || tunesHook.error;

  return {
    agentTypes: agentTypesHook.agentTypes,
    languages: languagesHook.languages,
    genders: gendersHook.genders,
    tunes: tunesHook.tunes,
    loading: isLoading,
    error: hasError,
    individual: {
      agentTypes: agentTypesHook,
      languages: languagesHook,
      genders: gendersHook,
      tunes: tunesHook,
    }
  };
}

export function useVoiceDetails(voiceId?: string) {
  const [voiceDetails, setVoiceDetails] = useState<VoiceDetailsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!voiceId) {
      setVoiceDetails(null);
      return;
    }

    const fetchVoiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await configService.getVoiceDetails(voiceId);
        setVoiceDetails(data);
      } catch (err) {
        console.error('Failed to fetch voice details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch voice details');
      } finally {
        setLoading(false);
      }
    };

    fetchVoiceDetails();
  }, [voiceId]);

  return { voiceDetails, loading, error };
}