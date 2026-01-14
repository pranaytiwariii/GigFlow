import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigsApi } from '@/api/gigs.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

const CreateGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const gig = await gigsApi.create({
        title,
        description,
        budget: parseFloat(budget),
      });
      navigate(`/gigs/${gig._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create gig. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Post a New Gig</h1>
        <p className="text-muted-foreground mt-1">
          Describe your project and set a budget to attract talent
        </p>
      </div>

      <form onSubmit={handleSubmit} className="form-container space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="title">Gig Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., Build a React Landing Page"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the project requirements, deliverables, and timeline..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Budget ($)</Label>
          <Input
            id="budget"
            type="number"
            placeholder="500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            min="1"
            step="1"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating...' : 'Post Gig'}
        </Button>
      </form>
    </div>
  );
};

export default CreateGig;
