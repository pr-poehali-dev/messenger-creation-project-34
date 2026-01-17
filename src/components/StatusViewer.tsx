import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface Status {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  backgroundColor: string;
  textColor: string;
}

interface StatusViewerProps {
  statuses: Status[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function StatusViewer({ 
  statuses, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrevious 
}: StatusViewerProps) {
  const [progress, setProgress] = useState(0);
  const currentStatus = statuses[currentIndex];
  const DURATION = 5000;

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (currentIndex < statuses.length - 1) {
            onNext();
          } else {
            onClose();
          }
          return 100;
        }
        return prev + (100 / (DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, statuses.length, onNext, onClose]);

  if (!currentStatus) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md h-[600px] p-0 overflow-hidden border-0"
        style={{ 
          backgroundColor: currentStatus.backgroundColor,
          color: currentStatus.textColor 
        }}
      >
        <div className="relative h-full flex flex-col">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 space-y-3">
            <div className="flex gap-1">
              {statuses.map((_, idx) => (
                <Progress 
                  key={idx} 
                  value={idx === currentIndex ? progress : idx < currentIndex ? 100 : 0}
                  className="h-1 flex-1"
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="border-2 border-white">
                  <AvatarImage src={currentStatus.userAvatar} />
                  <AvatarFallback className="bg-primary/20 text-white">
                    {currentStatus.userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-white">{currentStatus.userName}</p>
                  <p className="text-xs text-white/80">{currentStatus.timestamp}</p>
                </div>
              </div>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-8">
            <p className="text-2xl font-medium text-center leading-relaxed">
              {currentStatus.content}
            </p>
          </div>

          <div className="absolute inset-y-0 left-0 w-1/3" onClick={onPrevious} />
          <div className="absolute inset-y-0 right-0 w-1/3" onClick={onNext} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
