import { headers } from 'next/headers';

export interface AuthentikUser {
  id: string;
  username: string;
  email: string;
  name: string;
  groups?: string[];
}

/**
 * Parse Authentik forward auth headers from Traefik
 * These headers are set by the Authentik middleware in Traefik
 */
export async function getAuthentikUser(): Promise<AuthentikUser | null> {
  const headersList = await headers();

  const uid = headersList.get('x-authentik-uid');
  const username = headersList.get('x-authentik-username');
  const email = headersList.get('x-authentik-email');
  const name = headersList.get('x-authentik-name');
  const groupsHeader = headersList.get('x-authentik-groups');

  // If no UID, user is not authenticated
  if (!uid || !email) {
    return null;
  }

  const groups = groupsHeader ? groupsHeader.split(',') : [];

  return {
    id: uid,
    username: username || email,
    email,
    name: name || username || email,
    groups,
  };
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthentikUser> {
  const user = await getAuthentikUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}
