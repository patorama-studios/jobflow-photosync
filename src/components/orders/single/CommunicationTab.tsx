
import React, { useState } from 'react';
import { Order } from '@/types/order-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Send, UserCircle } from 'lucide-react';

interface CommunicationTabProps {
  order: Order;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({ order }) => {
  const [message, setMessage] = useState('');
  
  // Mock communication data - will be replaced with real data from order_communication
  const clientMessages = [
    {
      id: 1,
      sender: 'John Doe',
      role: 'Admin',
      message: 'Hello, your photography session is scheduled for tomorrow at 2pm.',
      timestamp: '2023-05-10T14:30:00Z',
      isInternal: false
    },
    {
      id: 2,
      sender: order.client,
      role: 'Client',
      message: 'Thanks for the reminder! I'll be there.',
      timestamp: '2023-05-10T15:15:00Z',
      isInternal: false
    }
  ];
  
  const internalMessages = [
    {
      id: 1,
      sender: 'John Doe',
      role: 'Admin',
      message: 'The client requested extra attention to the backyard area.',
      timestamp: '2023-05-09T10:00:00Z',
      isInternal: true
    },
    {
      id: 2,
      sender: order.photographer,
      role: 'Photographer',
      message: 'Noted. I'll bring the wide angle lens for better coverage.',
      timestamp: '2023-05-09T10:30:00Z',
      isInternal: true
    }
  ];
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Here we would normally send the message to the backend
    console.log('Sending message:', message);
    setMessage('');
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Tabs defaultValue="client">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="client">Client Communication</TabsTrigger>
        <TabsTrigger value="internal">Internal Team</TabsTrigger>
      </TabsList>
      
      <TabsContent value="client">
        <Card>
          <CardHeader>
            <CardTitle>Client Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto mb-4">
              {clientMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.role === 'Client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'Client' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-muted rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="text-xs opacity-70">{formatDate(msg.timestamp)}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="internal">
        <Card>
          <CardHeader>
            <CardTitle>Internal Team Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto mb-4">
              {internalMessages.map((msg) => (
                <div key={msg.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={msg.sender} />
                    <AvatarFallback>
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{msg.sender}</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {msg.role}
                      </span>
                      <span className="text-xs opacity-70">{formatDate(msg.timestamp)}</span>
                    </div>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input 
                placeholder="Type your internal message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
