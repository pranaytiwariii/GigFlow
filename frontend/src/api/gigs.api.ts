import api from '@/lib/axios';

export interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'assigned';
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

export interface CreateGigData {
  title: string;
  description: string;
  budget: number;
}

export const gigsApi = {
  getAll: async (search?: string): Promise<Gig[]> => {
    const params = search ? { search } : {};
    const response = await api.get('/gigs', { params });
    return response.data.gigs;
  },

  getById: async (id: string): Promise<Gig> => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  create: async (data: CreateGigData): Promise<Gig> => {
    const response = await api.post('/gigs', data);
    return response.data.gig;
  },

  getMyGigs: async (): Promise<Gig[]> => {
    const response = await api.get('/gigs/my-gigs');
    return response.data.gigs;
  },
};
