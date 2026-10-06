export interface HealthResponse {
  status: 'ok';
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const response = await fetch('/api/health', { signal });

  if (!response.ok) {
    throw new Error('La API devolvió una respuesta de salud inesperada.');
  }

  return response.json() as Promise<HealthResponse>;
}