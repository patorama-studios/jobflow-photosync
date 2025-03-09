
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Mail, Phone, UserCircle, Tag, RefreshCw } from 'lucide-react';
import { Order } from '@/types/order-types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DeliverEmailDialog } from '@/components/orders/single/DeliverEmailDialog';

interface CommunicationTabProps {
  order: Order | null;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({ order }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isDeliverEmailOpen, setIsDeliverEmailOpen] = useState(false);
  
  if (!order) return null;

  // Mock communication data for demonstration
  const clientMessages = [
    {
      id: 1,
      sender: 'Client',
      senderName: order.client || order.customerName || 'Client',
      content: 'Hi, I wanted to check on the status of my order. When will the photos be ready?',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      channel: 'email'
    },
    {
      id: 2,
      sender: 'Admin',
      senderName: 'Admin User',
      content: 'Hello! The photos are currently being edited. We expect to deliver them within the next 48 hours.',
      timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      channel: 'email'
    },
    {
      id: 3,
      sender: 'Client',
      senderName: order.client || order.customerName || 'Client',
      content: 'Great, thank you for the update!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      channel: 'email'
    }
  ];

  const internalMessages = [
    {
      id: 1,
      sender: 'Photographer',
      senderName: order.photographer || 'Photographer',
      content: 'I\'ve completed the photoshoot. There were some challenges with lighting in the living room, but I was able to work around them.',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      role: 'photographer'
    },
    {
      id: 2,
      sender: 'Admin',
      senderName: 'Admin User',
      content: 'Thanks for the update. I\'ll assign this to an editor right away.',
      timestamp: new Date(Date.now() - 2.8 * 24 * 60 * 60 * 1000),
      role: 'admin'
    },
    {
      id: 3,
      sender: 'Editor',
      senderName: 'Sarah Editor',
      content: 'I\'ve received the assignment. I\'ll fix the lighting issues in the living room shots.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      role: 'editor'
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    toast.success("Message sent successfully");
    setNewMessage('');
    // Implementation for sending the message would go here
  };

  const handleSyncCommunication = () => {
    toast.info("Syncing communication history...");
    // Implementation for syncing with external communication systems would go here
  };

  const handleOpenDeliverEmail = () => {
    setIsDeliverEmailOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="client" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="client">Client Communication</TabsTrigger>
            <TabsTrigger value="internal">Internal Communication</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" onClick={handleSyncCommunication}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Communication
          </Button>
        </div>
        
        <TabsContent value="client" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Client Communication
              </CardTitle>
              <CardDescription>
                Manage communication with {order.client || order.customerName || 'the client'}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-4">
              {clientMessages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex gap-3 ${message.sender === 'Admin' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== 'Admin' && (
                    <Avatar>
                      <AvatarFallback>{(message.senderName || 'C').charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.sender === 'Admin' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{message.senderName}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.channel === 'email' ? <Mail className="h-3 w-3 mr-1" /> : <Phone className="h-3 w-3 mr-1" />}
                        {message.channel}
                      </Badge>
                    </div>
                    <p>{message.content}</p>
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {format(message.timestamp, 'MMM d, h:mm a')}
                    </div>
                  </div>
                  {message.sender === 'Admin' && (
                    <Avatar>
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Textarea 
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <div className="flex flex-col gap-2">
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline" onClick={handleOpenDeliverEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="internal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="h-5 w-5 mr-2" />
                Internal Communication
              </CardTitle>
              <CardDescription>
                Team communication for this order
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-4">
              {internalMessages.map(message => (
                <div key={message.id} className="flex gap-3">
                  <Avatar>
                    <AvatarFallback>{(message.senderName || 'U').charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted max-w-[80%]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{message.senderName}</span>
                      <Badge variant="outline" className="text-xs">
                        <UserCircle className="h-3 w-3 mr-1" />
                        {message.role}
                      </Badge>
                    </div>
                    <p>{message.content}</p>
                    <div className="text-xs mt-1 opacity-70 text-right">
                      {format(message.timestamp, 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <div className="flex gap-2 w-full">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tag role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Team</SelectItem>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="@mention team member"
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2 w-full">
                <Textarea 
                  placeholder="Type your internal note here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="self-end">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DeliverEmailDialog
        isOpen={isDeliverEmailOpen}
        onOpenChange={setIsDeliverEmailOpen}
        order={order}
      />
    </div>
  );
};
