import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const backgrounds = [
  { color: '#0EA5E9', textColor: '#FFFFFF' },
  { color: '#8B5CF6', textColor: '#FFFFFF' },
  { color: '#EC4899', textColor: '#FFFFFF' },
  { color: '#F97316', textColor: '#FFFFFF' },
  { color: '#10B981', textColor: '#FFFFFF' },
  { color: '#EF4444', textColor: '#FFFFFF' },
  { color: '#222222', textColor: '#FFFFFF' },
  { color: '#FFFFFF', textColor: '#222222' },
];

interface CreateStatusProps {
  open: boolean;
  onClose: () => void;
  onPublish: (content: string, backgroundColor: string, textColor: string) => void;
}

export default function CreateStatus({ open, onClose, onPublish }: CreateStatusProps) {
  const [content, setContent] = useState('');
  const [selectedBg, setSelectedBg] = useState(backgrounds[0]);

  const handlePublish = () => {
    if (content.trim()) {
      onPublish(content, selectedBg.color, selectedBg.textColor);
      setContent('');
      setSelectedBg(backgrounds[0]);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Создать статус</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div 
            className="w-full h-60 rounded-lg flex items-center justify-center p-6 transition-colors"
            style={{ backgroundColor: selectedBg.color, color: selectedBg.textColor }}
          >
            <p className="text-xl font-medium text-center leading-relaxed">
              {content || 'Напишите что-нибудь...'}
            </p>
          </div>

          <Textarea
            placeholder="Что у вас нового?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none"
            maxLength={200}
          />

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {backgrounds.map((bg, idx) => (
                <button
                  key={idx}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedBg.color === bg.color 
                      ? 'border-primary scale-110' 
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: bg.color }}
                  onClick={() => setSelectedBg(bg)}
                />
              ))}
            </div>

            <span className="text-sm text-muted-foreground">
              {content.length}/200
            </span>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={!content.trim()}
              className="gap-2"
            >
              <Icon name="Send" size={16} />
              Опубликовать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
