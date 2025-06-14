import { TeamMember } from '@/components/settings/sections/team-members/types';

// Simulated MySQL database storage using localStorage for persistence
class TeamService {
  private storageKey = 'mysql_team_members';

  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      console.log('🔧 TeamService: Fetching team members from MySQL');
      
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const members = JSON.parse(stored);
        console.log('🔧 TeamService: Found stored team members:', members.length);
        return members;
      }
      
      // Return default admin user if no team members exist
      const defaultAdmin: TeamMember = {
        id: 'admin-user-id',
        full_name: 'Admin User',
        email: 'hi@patorama.com.au',
        phone: '+61 2 9876 5432',
        role: 'admin',
        username: 'admin',
        updated_at: new Date().toISOString()
      };
      
      await this.saveTeamMembers([defaultAdmin]);
      return [defaultAdmin];
    } catch (error) {
      console.error('🔧 TeamService: Error fetching team members:', error);
      return [];
    }
  }

  async saveTeamMembers(members: TeamMember[]): Promise<boolean> {
    try {
      console.log('🔧 TeamService: Saving team members to MySQL:', members.length);
      localStorage.setItem(this.storageKey, JSON.stringify(members));
      return true;
    } catch (error) {
      console.error('🔧 TeamService: Error saving team members:', error);
      return false;
    }
  }

  async addTeamMember(member: Omit<TeamMember, 'id' | 'updated_at'>): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamService: Adding team member to MySQL:', member);
      
      const existingMembers = await this.getTeamMembers();
      
      // Check if email already exists
      const emailExists = existingMembers.some(m => m.email === member.email);
      if (emailExists) {
        throw new Error('A team member with this email already exists');
      }
      
      const newMember: TeamMember = {
        ...member,
        id: `team-${Date.now()}`,
        username: member.email.split('@')[0],
        updated_at: new Date().toISOString()
      };
      
      const updatedMembers = [...existingMembers, newMember];
      const success = await this.saveTeamMembers(updatedMembers);
      
      if (success) {
        // Simulate sending email invitation
        await this.sendInvitationEmail(newMember);
        console.log('🔧 TeamService: Team member added successfully');
        return newMember;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 TeamService: Error adding team member:', error);
      throw error;
    }
  }

  async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamService: Updating team member in MySQL:', { id, updates });
      
      const existingMembers = await this.getTeamMembers();
      const memberIndex = existingMembers.findIndex(m => m.id === id);
      
      if (memberIndex === -1) {
        throw new Error('Team member not found');
      }
      
      const updatedMember = {
        ...existingMembers[memberIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const updatedMembers = [...existingMembers];
      updatedMembers[memberIndex] = updatedMember;
      
      const success = await this.saveTeamMembers(updatedMembers);
      if (success) {
        return updatedMember;
      }
      
      return null;
    } catch (error) {
      console.error('🔧 TeamService: Error updating team member:', error);
      throw error;
    }
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    try {
      console.log('🔧 TeamService: Deleting team member from MySQL:', id);
      
      const existingMembers = await this.getTeamMembers();
      const updatedMembers = existingMembers.filter(m => m.id !== id);
      
      return await this.saveTeamMembers(updatedMembers);
    } catch (error) {
      console.error('🔧 TeamService: Error deleting team member:', error);
      return false;
    }
  }

  private async sendInvitationEmail(member: TeamMember): Promise<void> {
    console.log('📧 Sending invitation email to:', member.email);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, this would send an actual email
    // For now, we'll just log the email content
    const invitationContent = {
      to: member.email,
      subject: 'Welcome to Photorama Studios - Team Invitation',
      body: `
        Hello ${member.full_name},

        You've been invited to join the Photorama Studios team as a ${member.role}.

        To get started:
        1. Visit our application at ${window.location.origin}
        2. Create your account using this email address: ${member.email}
        3. Set up your password and complete your profile

        If you have any questions, please don't hesitate to reach out.

        Welcome to the team!

        Best regards,
        Photorama Studios Team
      `
    };
    
    console.log('📧 Email invitation sent:', invitationContent);
    
    // Store invitation for tracking
    const invitations = JSON.parse(localStorage.getItem('mysql_invitations') || '[]');
    invitations.push({
      id: `inv-${Date.now()}`,
      email: member.email,
      role: member.role,
      status: 'sent',
      sent_at: new Date().toISOString(),
      member_id: member.id
    });
    localStorage.setItem('mysql_invitations', JSON.stringify(invitations));
  }
}

export const teamService = new TeamService();