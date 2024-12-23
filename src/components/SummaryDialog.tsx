import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { getCurrentMonthCredits, incrementSummaryCount } from '@/lib/db/credits';
import { createSummary, getEpisodeSummary } from '@/lib/db/summaries';
import { processPodcastEpisode } from '@/lib/podcast-processor';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  podcastId: string;
  episodeId: string;
  episodeTitle: string;
  episodeContent: string;
  audioUrl: string;
}

export default function SummaryDialog({
  isOpen,
  onClose,
  podcastId,
  episodeId,
  episodeTitle,
  episodeContent,
  audioUrl,
}: SummaryDialogProps) {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [existingSummary, setExistingSummary] = useState<boolean>(false);

  const isPremium = profile?.subscription_tier === 'premium';

  useEffect(() => {
    if (user && episodeId) {
      getEpisodeSummary(user.id, episodeId).then((data) => {
        if (data?.summary_text) {
          setSummary(data.summary_text);
          setExistingSummary(true);
        }
      });
    }
  }, [user, episodeId]);

  const handleGetSummary = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      // Check credits for free users
      if (!isPremium) {
        const credits = await getCurrentMonthCredits(user.id);
        if (credits?.summaries_used >= 2) {
          setError('You have used all your free summaries for this month. Upgrade to premium for unlimited summaries!');
          return;
        }
      }

      let summaryText = '';
      
      // Process the podcast episode with streaming
      await processPodcastEpisode({
        audioUrl,
        isPremium,
        stream: true,
        callbacks: {
          onToken: (token) => {
            summaryText += token;
            setSummary(summaryText);
          },
          onProgress: (percent) => {
            setProgress(percent);
          },
          onComplete: async () => {
            try {
              // Only save and count if we have a valid summary
              if (summaryText.trim()) {
                // Save summary
                await createSummary({
                  user_id: user.id,
                  podcast_id: podcastId,
                  episode_id: episodeId,
                  summary_text: summaryText,
                  key_points: null
                });

                // Increment usage count for free users
                if (!isPremium) {
                  await incrementSummaryCount(user.id);
                }

                setExistingSummary(true);
              }
            } catch (err) {
              console.error('Error saving summary:', err);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save summary. Please try again.",
              });
            }
            setIsLoading(false);
          },
          onError: (error) => {
            console.error('Streaming error:', error);
            setError('Failed to generate summary. Please try again later.');
            setIsLoading(false);
          }
        }
      });
    } catch (err) {
      console.error('Error generating summary:', err);
      setError('Failed to generate summary. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate summary. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-500" />
            AI Summary
          </DialogTitle>
          <DialogDescription>
            {isPremium
              ? "Get a detailed AI-powered summary of this episode"
              : "Get a quick overview of this episode (2 free summaries per month)"}
          </DialogDescription>
        </DialogHeader>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center text-red-500 mb-2">
              <AlertCircle className="h-5 w-5 mr-2" />
              <h3 className="font-semibold">Error</h3>
            </div>
            <p className="text-neutral-400">{error}</p>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <h3 className="font-semibold">{episodeTitle}</h3>
            {isLoading && (
              <div className="w-full bg-neutral-800 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            <div className="prose prose-invert max-w-none">
              {summary.split('\n').map((paragraph, index) => (
                <p key={index} className="text-neutral-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Generate Summary</h3>
            <p className="text-neutral-400 mb-6">
              {isPremium
                ? "Get a detailed AI analysis of this episode's content"
                : "Get a quick overview of the main points"}
            </p>
            <Button
              onClick={handleGetSummary}
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-black"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                  Generating... {progress}%
                </>
              ) : existingSummary ? (
                'View Summary'
              ) : (
                'Generate Summary'
              )}
            </Button>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          {!isPremium && (
            <p className="text-sm text-neutral-400">
              {summary ? 'Want more detailed summaries?' : 'Want unlimited summaries?'}{' '}
              <button
                onClick={() => {
                  onClose();
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-green-500 hover:underline"
              >
                Upgrade to Premium
              </button>
            </p>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}