import api from '@/lib/axios';

export interface Bid {
  _id: string;
  gigId: string;
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  price: number;
  status: 'pending' | 'hired' | 'rejected';
  createdAt: string;
}

export interface CreateBidData {
  gigId: string;
  message: string;
  price: number;
}

export const bidsApi = {
  create: async (data: CreateBidData): Promise<Bid> => {
    const response = await api.post('/bids', data);
    return response.data;
  },

  getByGigId: async (gigId: string): Promise<Bid[]> => {
    const response = await api.get(`/bids/${gigId}`);
    return response.data.bids;
  },

  hire: async (bidId: string): Promise<Bid> => {
    const response = await api.patch(`/bids/${bidId}/hire`);
    return response.data;
  },
};
