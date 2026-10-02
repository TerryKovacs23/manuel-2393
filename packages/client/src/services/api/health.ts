export interface HealthResponse {
  status: 'Ok';
}

export async function getHealth(signal?: AbortSignal): Promise<HealthResponse> {
    const response = await fetch('/health', { signal });
    
    if(!response.ok) {
        throw new Error('La API devolvió una respuesta de salud inesperada.');
    }

    return { status: 'Ok' };
}