import { useState, useEffect } from 'react';
import { gigsApi, Gig } from '@/api/gigs.api';
import { GigCard } from '@/components/GigCard';
import { Input } from '@/components/ui/input';
import { Search, Briefcase } from 'lucide-react';

const Home = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const data = await gigsApi.getAll(search || undefined);
        setGigs(data);
      } catch (error) {
        console.error('Failed to fetch gigs:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchGigs, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Find Your Next Gig
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Browse open opportunities and submit your bids to land your next project
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-xl mx-auto mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search gigs by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No gigs found</h3>
          <p className="text-muted-foreground">
            {search ? 'Try adjusting your search terms' : 'Check back later for new opportunities'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
