import { User, UsersListParams, UsersListResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function getUsersList(params: UsersListParams = {}): Promise<UsersListResponse> {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.search) queryParams.set('search', params.search);
  if (params.role) queryParams.set('role', params.role);
  if (params.sortBy) queryParams.set('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

  const response = await fetch(`${API_BASE_URL}/users/list?${queryParams.toString()}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
}

export async function getPublicProfile(identifier: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/profile/public/${identifier}`, {
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}
