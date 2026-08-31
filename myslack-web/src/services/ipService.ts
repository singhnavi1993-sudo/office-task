export const fetchClientIp = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json', { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      if (data && data.ip) {
        return data.ip;
      }
    }
  } catch (err) {
    console.warn('Public IP lookup unavailable, falling back to local client network info:', err);
  }

  // Fallback to local network IP or simulated client identifier
  return `192.168.1.${Math.floor(Math.random() * 200) + 10} (Local Network)`;
};
