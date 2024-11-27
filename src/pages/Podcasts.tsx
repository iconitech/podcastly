import { Button } from "@/components/ui/button";
import { topPodcasts } from "@/data/podcasts";
import { Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePodcastFeed } from "@/hooks/usePodcastFeed";
import { formatDistanceToNow, formatDuration } from "@/lib/utils";
import { useState } from "react";
import SummaryDialog from "@/components/SummaryDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Podcasts() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedEpisode, setSelectedEpisode] = useState<{
    podcastId: string;
    episodeId: string;
    title: string;
    content: string;
    audioUrl: string;
  } | null>(null);

  const handleGetSummary = (podcastId: string, episode: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in or create an account to get episode summaries.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: `/podcasts/${podcastId}` } });
      return;
    }
    
    setSelectedEpisode({
      podcastId,
      episodeId: episode.guid,
      title: episode.title,
      content: episode.contentSnippet,
      audioUrl: episode.audioUrl
    });
  };

  return (
    <div className="pt-24 px-4 pb-16">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-4">NFL Podcasts</h1>
        <p className="text-xl text-neutral-400 mb-12">
          Get AI-powered summaries from the best NFL podcasts.
        </p>

        <div className="grid gap-8">
          {topPodcasts.map((podcast) => {
            const { feed, isLoading, error } = usePodcastFeed(podcast.id, podcast.feedUrl);
            
            return (
              <div key={podcast.id} className="bg-neutral-900 rounded-lg p-4 sm:p-6 border border-neutral-800">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-6 md:mb-8">
                  <img
                    src={feed?.image?.url || podcast.imageUrl}
                    alt={podcast.title}
                    className="w-full md:w-48 h-48 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{podcast.title}</h2>
                    <p className="text-lg text-neutral-400 mb-4">{podcast.host}</p>
                    <p className="text-neutral-400 max-w-2xl mb-6">
                      {feed?.description || podcast.description}
                    </p>
                    <Button 
                      onClick={() => navigate(`/podcasts/${podcast.id}`)}
                      className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-black"
                    >
                      View all episodes
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-neutral-400">Latest Episodes</h3>
                  
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <div className="flex items-center text-red-500 mb-2">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <h3 className="font-semibold">Error loading episodes</h3>
                      </div>
                      <p className="text-neutral-400">Please try again later.</p>
                    </div>
                  )}

                  {feed?.items?.slice(0, 2).map((episode) => (
                    <div
                      key={episode.guid}
                      className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{episode.title}</h4>
                          <p className="text-sm text-neutral-400 line-clamp-2">
                            {episode.contentSnippet}
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          className="w-full sm:w-auto bg-neutral-700 hover:bg-neutral-600"
                          onClick={() => handleGetSummary(podcast.id, episode)}
                        >
                          Get Summary
                        </Button>
                      </div>
                      <div className="flex items-center text-sm text-neutral-400 mt-2">
                        <span>{formatDistanceToNow(new Date(episode.pubDate))} ago</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDuration(episode.itunes.duration)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedEpisode && (
        <SummaryDialog
          isOpen={true}
          onClose={() => setSelectedEpisode(null)}
          podcastId={selectedEpisode.podcastId}
          episodeId={selectedEpisode.episodeId}
          episodeTitle={selectedEpisode.title}
          episodeContent={selectedEpisode.content}
          audioUrl={selectedEpisode.audioUrl}
        />
      )}
    </div>
  );
}