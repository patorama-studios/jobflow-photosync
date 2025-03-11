
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { CompanyInfoFields } from './CompanyInfoFields';
import { ContactInfoFields } from './ContactInfoFields';
import { AddressFields } from './AddressFields';
import { CompanyTeams } from './CompanyTeams';
import { companyFormSchema, CompanyFormData } from './CompanyFormSchema';
import { useCompanies } from '@/hooks/use-companies';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  name: string;
  email?: string;
}

interface CompanyFormProps {
  onClose: () => void;
  onCompanyCreated: (company: any) => void;
}

export function CompanyForm({ onClose, onCompanyCreated }: CompanyFormProps) {
  const { addCompany } = useCompanies();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamName, setTeamName] = useState('');
  
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      industry: 'real estate',
      website: '',
      address: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  const handleAddTeamMember = (member: TeamMember) => {
    // Check if member already exists
    if (!teamMembers.some(m => m.id === member.id)) {
      setTeamMembers([...teamMembers, member]);
    }
  };

  const handleRemoveTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  const onSubmit = async (data: CompanyFormData) => {
    try {
      // Use the hook function to add a new company
      const newCompany = await addCompany({
        name: data.name,
        email: data.email || '',
        phone: data.phone,
        industry: data.industry,
        website: data.website,
        address: data.address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        status: 'active',
        total_jobs: 0,
        open_jobs: 0,
        total_revenue: 0,
        outstanding_amount: 0
      });
      
      if (newCompany && teamMembers.length > 0) {
        try {
          // Create team if we have team members
          // First ensure the migration has been run
          await fetch('/api/run-migration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: '20240519_company_teams' }),
          })
          .then(response => response.json())
          .catch(err => {
            console.log('Migration may already be applied', err);
          });
          
          // Create company team
          const { data: teamData, error: teamError } = await supabase
            .from('company_teams')
            .insert({
              company_id: newCompany.id,
              name: teamName || `${data.name} Team`,
              created_at: new Date().toISOString()
            })
            .select('*')
            .single();
          
          if (teamError) {
            console.error('Error creating team:', teamError);
            toast.error(`Failed to create team: ${teamError.message}`);
          } else if (teamData) {
            // Add team members
            const teamId = teamData.id;
            
            for (const member of teamMembers) {
              const { error: memberError } = await supabase
                .from('company_team_members')
                .insert({
                  team_id: teamId,
                  client_id: member.id,
                  created_at: new Date().toISOString()
                });
                
              if (memberError) {
                console.error('Error adding team member:', memberError);
                toast.error(`Failed to add team member ${member.name}: ${memberError.message}`);
              }
            }
          }
        } catch (teamErr: any) {
          console.error('Error handling team creation:', teamErr);
          toast.error(`Team creation error: ${teamErr.message}`);
        }
      }
      
      toast.success('Company created successfully');
      onCompanyCreated(newCompany);
      onClose();
      form.reset();
    } catch (error: any) {
      console.error('Error creating company:', error);
      toast.error(`Failed to create company: ${error.message}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="company">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="company">Company Info</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="space-y-4">
            <CompanyInfoFields form={form} />
            <ContactInfoFields form={form} />
            <AddressFields form={form} />
          </TabsContent>
          
          <TabsContent value="team">
            <CompanyTeams 
              teamMembers={teamMembers}
              onAddMember={handleAddTeamMember}
              onRemoveMember={handleRemoveTeamMember}
              teamName={teamName}
              onTeamNameChange={setTeamName}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create Company</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
