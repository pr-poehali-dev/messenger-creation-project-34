import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const emojiCategories = {
  smileys: {
    label: '😊',
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '😶‍🌫️', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐']
  },
  gestures: {
    label: '👋',
    emojis: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋']
  },
  animals: {
    label: '🐶',
    emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈']
  },
  food: {
    label: '🍕',
    emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🍝']
  },
  travel: {
    label: '✈️',
    emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢']
  },
  objects: {
    label: '⚽',
    emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '🤺', '⛹️', '🤾', '🏌️', '🏇', '🧘', '🏊', '🏄', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️']
  },
  symbols: {
    label: '❤️',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐']
  },
  flags: {
    label: '🏁',
    emojis: ['🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇨', '🇦🇩', '🇦🇪', '🇦🇫', '🇦🇬', '🇦🇮', '🇦🇱', '🇦🇲', '🇦🇴', '🇦🇶', '🇦🇷', '🇦🇸', '🇦🇹', '🇦🇺', '🇦🇼', '🇦🇽', '🇦🇿', '🇧🇦', '🇧🇧', '🇧🇩', '🇧🇪', '🇧🇫', '🇧🇬', '🇧🇭', '🇧🇮', '🇧🇯', '🇧🇱', '🇧🇲', '🇧🇳', '🇧🇴', '🇧🇶', '🇧🇷', '🇧🇸', '🇧🇹', '🇧🇻', '🇧🇼', '🇧🇾', '🇧🇿', '🇨🇦', '🇨🇨', '🇨🇩', '🇨🇫', '🇨🇬', '🇨🇭', '🇨🇮', '🇨🇰', '🇨🇱', '🇨🇲', '🇨🇳', '🇨🇴', '🇨🇵', '🇨🇷', '🇨🇺', '🇷🇺', '🇺🇸', '🇬🇧', '🇩🇪', '🇫🇷', '🇮🇹', '🇪🇸']
  }
};

const popularStickers = [
  { id: 1, emoji: '🔥', name: 'Огонь' },
  { id: 2, emoji: '💯', name: '100%' },
  { id: 3, emoji: '✨', name: 'Звёзды' },
  { id: 4, emoji: '💪', name: 'Сила' },
  { id: 5, emoji: '🎉', name: 'Праздник' },
  { id: 6, emoji: '👍', name: 'Класс' },
  { id: 7, emoji: '❤️', name: 'Любовь' },
  { id: 8, emoji: '😂', name: 'Смех' },
  { id: 9, emoji: '🙏', name: 'Спасибо' },
  { id: 10, emoji: '🎯', name: 'Цель' },
  { id: 11, emoji: '⚡', name: 'Молния' },
  { id: 12, emoji: '🌟', name: 'Звезда' },
  { id: 13, emoji: '💎', name: 'Бриллиант' },
  { id: 14, emoji: '🏆', name: 'Победа' },
  { id: 15, emoji: '🎊', name: 'Конфетти' },
  { id: 16, emoji: '🚀', name: 'Ракета' },
  { id: 17, emoji: '💝', name: 'Подарок' },
  { id: 18, emoji: '🌈', name: 'Радуга' },
  { id: 19, emoji: '⭐', name: 'Звёздочка' },
  { id: 20, emoji: '🎁', name: 'Презент' }
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onStickerSelect: (sticker: string) => void;
}

export default function EmojiPicker({ onEmojiSelect, onStickerSelect }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filterEmojis = (emojis: string[]) => {
    if (!searchQuery) return emojis;
    return emojis;
  };

  return (
    <div className="w-[360px] bg-card border border-border rounded-lg shadow-lg">
      <Tabs defaultValue="emoji" className="w-full">
        <div className="border-b border-border px-2 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="emoji" className="text-sm">
              <Icon name="Smile" size={16} className="mr-2" />
              Эмодзи
            </TabsTrigger>
            <TabsTrigger value="stickers" className="text-sm">
              <Icon name="Sparkles" size={16} className="mr-2" />
              Стикеры
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="emoji" className="mt-0">
          <Tabs defaultValue="smileys" className="w-full">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border overflow-x-auto">
              {Object.entries(emojiCategories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="text-xl hover:bg-muted rounded-md px-2 py-1 data-[state=active]:bg-muted"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </div>

            <ScrollArea className="h-[300px]">
              {Object.entries(emojiCategories).map(([key, category]) => (
                <TabsContent key={key} value={key} className="mt-0 p-3">
                  <div className="grid grid-cols-8 gap-1">
                    {filterEmojis(category.emojis).map((emoji, idx) => (
                      <Button
                        key={idx}
                        variant="ghost"
                        className="h-10 w-10 p-0 text-2xl hover:bg-muted rounded-md transition-colors"
                        onClick={() => onEmojiSelect(emoji)}
                      >
                        {emoji}
                      </Button>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </TabsContent>

        <TabsContent value="stickers" className="mt-0">
          <ScrollArea className="h-[350px] p-4">
            <div className="grid grid-cols-4 gap-3">
              {popularStickers.map((sticker) => (
                <Button
                  key={sticker.id}
                  variant="ghost"
                  className="h-20 flex flex-col items-center justify-center hover:bg-muted rounded-lg transition-all hover:scale-110"
                  onClick={() => onStickerSelect(sticker.emoji)}
                >
                  <span className="text-4xl mb-1">{sticker.emoji}</span>
                  <span className="text-xs text-muted-foreground">{sticker.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
