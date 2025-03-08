
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageTransition } from '@/components/layout/PageTransition';
import { Book, Video, FileText, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LearningResourceProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  type: string;
}

const LearningResource: React.FC<LearningResourceProps> = ({ title, description, icon, link, type }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          {type === 'video' && 'Video tutorial - 10 mins'}
          {type === 'article' && 'Written guide - 5 min read'}
          {type === 'documentation' && 'Official documentation'}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
            <span>View Resource</span>
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

const LearningHub: React.FC = () => {
  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of the platform and how to navigate around.',
      icon: <Book className="w-5 h-5 text-blue-500" />,
      link: '#',
      type: 'article'
    },
    {
      title: 'Creating Your First Order',
      description: 'Step-by-step guide to creating and managing orders.',
      icon: <Video className="w-5 h-5 text-red-500" />,
      link: '#',
      type: 'video'
    },
    {
      title: 'Managing Clients',
      description: 'Learn how to add, edit, and organize your client information.',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      link: '#',
      type: 'article'
    },
    {
      title: 'Production Workflow',
      description: 'Understand the production process and status tracking.',
      icon: <Video className="w-5 h-5 text-red-500" />,
      link: '#',
      type: 'video'
    },
    {
      title: 'Platform Documentation',
      description: 'Complete reference documentation for all platform features.',
      icon: <Book className="w-5 h-5 text-purple-500" />,
      link: '#',
      type: 'documentation'
    },
    {
      title: 'Administrator Settings',
      description: 'Configure your account and organization settings.',
      icon: <FileText className="w-5 h-5 text-green-500" />,
      link: '#',
      type: 'article'
    }
  ];

  return (
    <MainLayout>
      <PageTransition>
        <div className="container mx-auto py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Learning Hub</h1>
            <p className="text-muted-foreground">
              Welcome to the learning hub. Find tutorials, guides, and resources to help you get the most out of the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <LearningResource
                key={index}
                title={resource.title}
                description={resource.description}
                icon={resource.icon}
                link={resource.link}
                type={resource.type}
              />
            ))}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default LearningHub;
