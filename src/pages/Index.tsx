import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import EmojiPicker from '@/components/EmojiPicker';
import StatusViewer from '@/components/StatusViewer';
import CreateStatus from '@/components/CreateStatus';

type Chat = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'chat' | 'group' | 'channel';
};

type Message = {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'other';
  reactions?: string[];
  isSticker?: boolean;
};

type Status = {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  backgroundColor: string;
  textColor: string;
  hasStatus?: boolean;
};

const mockChats: Chat[] = [
  { id: 1, name: 'Анна Смирнова', avatar: '', lastMessage: 'Привет! Как дела?', time: '14:32', unread: 2, online: true, type: 'chat' },
  { id: 2, name: 'Рабочая группа', avatar: '', lastMessage: 'Александр: Отлично, начинаем!', time: '13:15', unread: 0, online: false, type: 'group' },
  { id: 3, name: 'Дмитрий Петров', avatar: '', lastMessage: 'Созвонимся завтра?', time: '11:20', unread: 1, online: false, type: 'chat' },
  { id: 4, name: 'Новости технологий', avatar: '', lastMessage: 'Вышла новая версия React', time: 'вчера', unread: 0, online: false, type: 'channel' },
  { id: 5, name: 'Семья', avatar: '', lastMessage: 'Мама: Не забудь позвонить', time: 'вчера', unread: 5, online: false, type: 'group' },
];

const mockMessages: Message[] = [
  { id: 1, text: 'Привет! Как твои дела?', time: '14:25', sender: 'other' },
  { id: 2, text: 'Отлично! Работаю над новым проектом', time: '14:28', sender: 'me' },
  { id: 3, text: 'Звучит интересно, расскажешь подробнее?', time: '14:30', sender: 'other', reactions: ['👍', '❤️'] },
  { id: 4, text: 'Конечно! Это мессенджер с современным дизайном', time: '14:32', sender: 'me' },
];

const mockStatuses: Status[] = [
  { id: 1, userId: 1, userName: 'Анна Смирнова', userAvatar: '', content: 'Отличное настроение сегодня! ☀️', timestamp: '2 ч назад', backgroundColor: '#0EA5E9', textColor: '#FFFFFF', hasStatus: true },
  { id: 2, userId: 3, userName: 'Дмитрий Петров', userAvatar: '', content: 'Работаю над новым проектом 🚀', timestamp: '5 ч назад', backgroundColor: '#8B5CF6', textColor: '#FFFFFF', hasStatus: true },
  { id: 3, userId: 2, userName: 'Рабочая группа', userAvatar: '', content: 'Встреча в 15:00', timestamp: '1 ч назад', backgroundColor: '#EC4899', textColor: '#FFFFFF', hasStatus: true },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'calls' | 'channels' | 'groups'>('chats');
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [viewingStatus, setViewingStatus] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
    { id: 'contacts', label: 'Контакты', icon: 'Users' },
    { id: 'calls', label: 'Звонки', icon: 'Phone' },
    { id: 'channels', label: 'Каналы', icon: 'Radio' },
    { id: 'groups', label: 'Группы', icon: 'UsersRound' },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: messageInput,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        sender: 'me',
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleStickerSelect = (sticker: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text: sticker,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      isSticker: true,
    };
    setMessages([...messages, newMessage]);
    setShowEmojiPicker(false);
  };

  const handlePublishStatus = (content: string, backgroundColor: string, textColor: string) => {
    const newStatus: Status = {
      id: statuses.length + 1,
      userId: 0,
      userName: 'Вы',
      userAvatar: '',
      content,
      timestamp: 'только что',
      backgroundColor,
      textColor,
      hasStatus: true,
    };
    setStatuses([newStatus, ...statuses]);
  };

  const handleViewStatus = (index: number) => {
    setCurrentStatusIndex(index);
    setViewingStatus(true);
  };

  const handleNextStatus = () => {
    if (currentStatusIndex < statuses.length - 1) {
      setCurrentStatusIndex(currentStatusIndex + 1);
    }
  };

  const handlePreviousStatus = () => {
    if (currentStatusIndex > 0) {
      setCurrentStatusIndex(currentStatusIndex - 1);
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 space-y-6">
        <div className="flex flex-col items-center gap-2">
          <img 
            src="https://cdn.poehali.dev/projects/b10a89c7-7414-4c1b-a443-a0c39d2d3b0d/files/c7d52477-a9e3-4132-9c40-a0a10847f780.jpg" 
            alt="Vox Logo" 
            className="w-12 h-12 rounded-xl object-cover"
          />
          <span className="text-xs font-semibold text-primary">VOX</span>
        </div>
        
        <Separator className="w-8" />
        
        <div className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="icon"
              className={`rounded-full transition-colors ${
                activeTab === tab.id ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon name={tab.icon as any} size={24} />
            </Button>
          ))}
        </div>
        
        <div className="mt-auto">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Icon name="Settings" size={24} />
          </Button>
        </div>
      </div>

      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{tabs.find(t => t.id === activeTab)?.label}</h2>
            <div className="flex items-center gap-2">
              <img 
                src="https://cdn.poehali.dev/projects/b10a89c7-7414-4c1b-a443-a0c39d2d3b0d/files/c7d52477-a9e3-4132-9c40-a0a10847f780.jpg" 
                alt="Vox" 
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="text-lg font-bold text-primary">VOX</span>
            </div>
          </div>
          
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="space-y-1 p-2">
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-sm font-semibold text-muted-foreground">Статусы</h3>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 px-2 scrollbar-thin">
                <button
                  onClick={() => setShowCreateStatus(true)}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                    <Icon name="Plus" size={24} className="text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground">Ваш статус</span>
                </button>

                {statuses.map((status, idx) => (
                  <button
                    key={status.id}
                    onClick={() => handleViewStatus(idx)}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent">
                        <Avatar className="w-full h-full border-2 border-card">
                          <AvatarImage src={status.userAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {status.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground max-w-[60px] truncate">
                      {status.userName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-3" />

            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-muted' : ''
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {chat.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{chat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {selectedChat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.online ? 'в сети' : 'был(а) недавно'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6 scrollbar-thin">
              <div className="space-y-4 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`${
                        message.isSticker
                          ? ''
                          : `max-w-md px-4 py-2 rounded-2xl ${
                              message.sender === 'me'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`
                      }`}
                    >
                      {message.isSticker ? (
                        <div className="text-7xl">{message.text}</div>
                      ) : (
                        <>
                          <p className="text-sm">{message.text}</p>
                          <div className="flex items-center justify-between mt-1 gap-3">
                            <span className="text-xs opacity-70">{message.time}</span>
                            {message.reactions && message.reactions.length > 0 && (
                              <div className="flex gap-1">
                                {message.reactions.map((emoji, idx) => (
                                  <span key={idx} className="text-xs">
                                    {emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="h-20 bg-card border-t border-border flex items-center gap-3 px-6">
              <Button variant="ghost" size="icon">
                <Icon name="Paperclip" size={20} />
              </Button>
              
              <Input
                ref={inputRef}
                placeholder="Напишите сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />

              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icon name="Smile" size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-0" align="end" side="top">
                  <EmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    onStickerSelect={handleStickerSelect}
                  />
                </PopoverContent>
              </Popover>

              <Button size="icon" onClick={handleSendMessage}>
                <Icon name="Send" size={20} />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Icon name="MessageCircle" size={64} className="mx-auto opacity-20" />
              <p className="text-lg">Выберите чат для начала общения</p>
            </div>
          </div>
        )}
      </div>

      {viewingStatus && (
        <StatusViewer
          statuses={statuses}
          currentIndex={currentStatusIndex}
          onClose={() => setViewingStatus(false)}
          onNext={handleNextStatus}
          onPrevious={handlePreviousStatus}
        />
      )}

      <CreateStatus
        open={showCreateStatus}
        onClose={() => setShowCreateStatus(false)}
        onPublish={handlePublishStatus}
      />
    </div>
  );
}