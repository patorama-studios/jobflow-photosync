
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanyFormSchema, companyFormSchema } from './CompanyFormSchema';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyInfoFields } from './CompanyInfoFields';
import { ContactInfoFields } from './ContactInfoFields';
import { AddressFields } from './AddressFields';
import { CompanyTeams } from './CompanyTeams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyFormProps {
  onSubmit: (data: CompanyFormSchema) => void;
  defaultValues?: Partial<CompanyFormSchema>;
  isSubmitting?: boolean;
  companyId?: string;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  companyId,
}) => {
  const [activeTab, setActiveTab] = useState('company');
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email?: string }>>([]);
  const [teamName, setTeamName] = useState('Default Team');
  const [hasCreatedTeam, setHasCreatedTeam] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  const form = useForm<CompanyFormSchema>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      industry: 'real estate',
      website: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      ...defaultValues,
    },
  });

  const handleSubmit = (data: CompanyFormSchema) => {
    onSubmit(data);
  };

  const handleAddTeam = async () => {
    if (!companyId) {
      toast.error('Cannot create team: Company ID is missing');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('create_company_team', {
        company_id_param: companyId,
        team_name_param: teamName
      });

      if (error) {
        throw error;
      }

      setTeamId(data);
      setHasCreatedTeam(true);
      toast.success('Team created successfully');

      // Add any team members
      for (const member of teamMembers) {
        await addTeamMember(data, member);
      }
    } catch (error: any) {
      console.error('Error creating team:', error);
      toast.error(`Failed to create team: ${error.message}`);
    }
  };

  const addTeamMember = async (teamId: string, member: { id: string; name: string; email?: string }) => {
    try {
      const { error } = await supabase.rpc('add_team_member', {
        team_id_param: teamId,
        user_id_param: member.id,
        name_param: member.name,
        email_param: member.email || ''
      });

      if (error) {
        throw error;
      }
      
      toast.success(`Added ${member.name} to the team`);
    } catch (error: any) {
      console.error('Error adding team member:', error);
      toast.error(`Failed to add team member: ${error.message}`);
    }
  };

  const handleAddMember = (member: { id: string; name: string; email?: string }) => {
    if (teamMembers.some(m => m.id === member.id)) {
      toast.error('This member is already added to the team');
      return;
    }

    setTeamMembers([...teamMembers, member]);

    if (hasCreatedTeam && teamId) {
      addTeamMember(teamId, member);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <CompanyInfoFields form={form} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <ContactInfoFields form={form} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <AddressFields form={form} />
              </CardContent>
            </Card>

            {companyId && (
              <Card>
                <CardContent className="pt-6">
                  <CompanyTeams
                    teamMembers={teamMembers}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                    onTeamNameChange={setTeamName}
                    teamName={teamName}
                  />
                  {!hasCreatedTeam && (
                    <Button 
                      type="button" 
                      onClick={handleAddTeam}
                      className="mt-4"
                    >
                      Create Team
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Company'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
