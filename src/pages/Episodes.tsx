import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { topPodcasts } from "@/data/podcasts";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePodcastFeed } from "@/hooks/usePodcastFeed";
import { formatDistanceToNow, formatDuration } from "@/lib/utils";
import { useState } from "react";
import SummaryDialog from "@/components/SummaryDialog";
import { useAuth } from "@/contexts/AuthContext";

export default function Episodes() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const podcast = topPodcasts.find((p) => p.id === podcastId);
  const [selectedEpisode, setSelectedEpisode] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  
  if (!podcast) {
    return (
      <div className="pt-24 px-4 pb-16">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Podcast not found</h1>
          <Button onClick={() => navigate("/podcasts")} className="mt-4">
            Go back to podcasts
          </Button>
        </div>
      </div>
    );
  }

  const { feed, isLoading, error } = usePodcastFeed(podcast.id, podcast.feedUrl);

  const handleGetSummary = (episode: any) => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    setSelectedEpisode({
      id: episode.guid,
      title: episode.title,
      content: episode.contentSnippet,
    });
  };

  return (
    <div className="pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          className="mb-8 hover:bg-neutral-800"
          onClick={() => navigate("/podcasts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to podcasts
        </Button>

        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <img
            src={feed?.image?.url || podcast.imageUrl}
            alt={podcast.title}
            className="w-48 h-48 object-cover rounded-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-2">{podcast.title}</h1>
            <p className="text-xl text-neutral-400 mb-4">{podcast.host}</p>
            <p className="text-neutral-400 max-w-2xl">{feed?.description || podcast.description}</p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-8">
            <div className="flex items-center text-red-500 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Error loading episodes</h3>
            </div>
            <p className="text-neutral-400">Please try again later.</p>
          </div>
        )}

        {feed && (
          <div className="space-y-4">
            {feed.items.map((episode) => (
              <div
                key={episode.guid}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
                    <p className="text-neutral-400">{episode.contentSnippet}</p>
                  </div>
                  <Button 
                    className="bg-green-500 hover:bg-green-600 text-black"
                    onClick={() => handleGetSummary(episode)}
                  >
                    Get Summary
                  </Button>
                </div>
                <div className="flex items-center text-sm text-neutral-400">
                  <span>{formatDistanceToNow(new Date(episode.pubDate))} ago</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatDuration(episode.itunes.duration)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedEpisode && (
        <SummaryDialog
          isOpen={true}
          onClose={() => setSelectedEpisode(null)}
          podcastId={podcast.id}
          episodeId={selectedEpisode.id}
          episodeTitle={selectedEpisode.title}
          episodeContent={selectedEpisode.content}
        />
      )}
    </div>
  );
}