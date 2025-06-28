import { getDbClient } from '@/integrations/mysql/config';

export interface TeamMember {
  id: string | number;
  company_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: 'Team Leader' | 'Agent' | 'Admin Staff' | 'Property Management' | 'owner' | 'admin' | 'photographer' | 'editor';
  job_title?: string;
  status: 'active' | 'inactive' | 'pending';
  team_id?: number;
  client_id?: string;
  created_at?: string;
  updated_at?: string;
  avatarUrl?: string;
  lastActive?: string;
}

export interface PermissionSet {
  viewAllOrders: boolean;
  showOrderPricing: boolean;
  displayClientInfo: boolean;
  calendarAllEvents: boolean;
  manageProducts: boolean;
  accessReports: boolean;
  viewOrderNotes: boolean;
  managePayroll: boolean;
  createOrders: boolean;
  updateProductionStatus: boolean;
  sendNotifications: boolean;
}

export interface TeamMemberPermissions {
  user_id: string | number;
  permissions: PermissionSet;
  updated_at: string;
}

class TeamManagementService {
  
  // Get all team members for a company
  async getTeamMembers(companyId?: string): Promise<TeamMember[]> {
    try {
      console.log('🔧 TeamManagementService: Fetching team members from MySQL');
      const db = await getDbClient();
      
      let sql = 'SELECT * FROM company_users';
      let params: any[] = [];
      
      if (companyId) {
        sql += ' WHERE company_id = ?';
        params = [companyId];
      }
      
      sql += ' ORDER BY created_at DESC';
      
      const members = await db.query<TeamMember>(sql, params);
      console.log(`🔧 TeamManagementService: Found ${members.length} team members`);
      
      return members.map(member => ({
        ...member,
        id: member.id.toString(),
        avatarUrl: '', // We can add avatar support later
        lastActive: member.updated_at
      }));
    } catch (error) {
      console.error('🔧 TeamManagementService: Error fetching team members:', error);
      return [];
    }
  }

  // Get a single team member
  async getTeamMember(id: string | number): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamManagementService: Fetching team member:', id);
      const db = await getDbClient();
      
      const member = await db.queryOne<TeamMember>(
        'SELECT * FROM company_users WHERE id = ?',
        [id]
      );
      
      if (!member) {
        console.log('🔧 TeamManagementService: Team member not found');
        return null;
      }
      
      return {
        ...member,
        id: member.id.toString(),
        avatarUrl: '',
        lastActive: member.updated_at
      };
    } catch (error) {
      console.error('🔧 TeamManagementService: Error fetching team member:', error);
      return null;
    }
  }

  // Add a new team member
  async addTeamMember(memberData: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamManagementService: Adding new team member:', memberData.email);
      const db = await getDbClient();
      
      // Ensure required fields are present
      if (!memberData.company_id) {
        throw new Error('Company ID is required');
      }
      
      const insertData = {
        company_id: memberData.company_id,
        full_name: memberData.full_name,
        email: memberData.email,
        phone: memberData.phone || null,
        role: memberData.role,
        job_title: memberData.job_title || null,
        status: memberData.status || 'pending',
        team_id: memberData.team_id || null
      };
      
      const result = await db.insert('company_users', insertData);
      
      if (result.insertId) {
        console.log('🔧 TeamManagementService: Team member added successfully:', result.insertId);
        return await this.getTeamMember(result.insertId);
      }
      
      return null;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error adding team member:', error);
      return null;
    }
  }

  // Update a team member
  async updateTeamMember(id: string | number, memberData: Partial<TeamMember>): Promise<TeamMember | null> {
    try {
      console.log('🔧 TeamManagementService: Updating team member:', id);
      const db = await getDbClient();
      
      // Remove fields that shouldn't be updated
      const { id: _, created_at, updated_at, avatarUrl, lastActive, ...updateData } = memberData;
      
      const result = await db.update('company_users', updateData, { id });
      
      if (result.affectedRows > 0) {
        console.log('🔧 TeamManagementService: Team member updated successfully');
        return await this.getTeamMember(id);
      }
      
      return null;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error updating team member:', error);
      return null;
    }
  }

  // Delete a team member
  async deleteTeamMember(id: string | number): Promise<boolean> {
    try {
      console.log('🔧 TeamManagementService: Deleting team member:', id);
      const db = await getDbClient();
      
      const result = await db.delete('company_users', { id });
      
      if (result.affectedRows > 0) {
        console.log('🔧 TeamManagementService: Team member deleted successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error deleting team member:', error);
      return false;
    }
  }

  // Get team member permissions
  async getTeamMemberPermissions(userId: string | number): Promise<PermissionSet | null> {
    try {
      console.log('🔧 TeamManagementService: Fetching permissions for user:', userId);
      const db = await getDbClient();
      
      // Try to get custom permissions from app_settings
      const permissionsKey = `team_permissions_${userId}`;
      const storedPermissions = await db.queryOne<any>(
        'SELECT setting_value FROM app_settings WHERE setting_key = ?',
        [permissionsKey]
      );
      
      if (storedPermissions && storedPermissions.setting_value) {
        const permissions = JSON.parse(storedPermissions.setting_value);
        console.log('🔧 TeamManagementService: Found custom permissions');
        return permissions;
      }
      
      // If no custom permissions, return role-based defaults
      const member = await this.getTeamMember(userId);
      if (member) {
        return this.getDefaultPermissions(member.role);
      }
      
      return null;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error fetching permissions:', error);
      return null;
    }
  }

  // Save team member permissions
  async saveTeamMemberPermissions(userId: string | number, permissions: PermissionSet): Promise<boolean> {
    try {
      console.log('🔧 TeamManagementService: Saving permissions for user:', userId);
      const db = await getDbClient();
      
      const permissionsKey = `team_permissions_${userId}`;
      
      const result = await db.query(
        `INSERT INTO app_settings (setting_key, setting_value, setting_type) 
         VALUES (?, ?, 'json') 
         ON DUPLICATE KEY UPDATE 
         setting_value = VALUES(setting_value), 
         updated_at = CURRENT_TIMESTAMP`,
        [permissionsKey, JSON.stringify(permissions)]
      );
      
      console.log('🔧 TeamManagementService: Permissions saved successfully');
      return true;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error saving permissions:', error);
      return false;
    }
  }

  // Get default permissions based on role
  private getDefaultPermissions(role: string): PermissionSet {
    const rolePermissions: Record<string, PermissionSet> = {
      'owner': {
        viewAllOrders: true,
        showOrderPricing: true,
        displayClientInfo: true,
        calendarAllEvents: true,
        manageProducts: true,
        accessReports: true,
        viewOrderNotes: true,
        managePayroll: true,
        createOrders: true,
        updateProductionStatus: true,
        sendNotifications: true,
      },
      'admin': {
        viewAllOrders: true,
        showOrderPricing: true,
        displayClientInfo: true,
        calendarAllEvents: true,
        manageProducts: true,
        accessReports: true,
        viewOrderNotes: true,
        managePayroll: true,
        createOrders: true,
        updateProductionStatus: true,
        sendNotifications: true,
      },
      'Team Leader': {
        viewAllOrders: true,
        showOrderPricing: false,
        displayClientInfo: true,
        calendarAllEvents: true,
        manageProducts: false,
        accessReports: true,
        viewOrderNotes: true,
        managePayroll: false,
        createOrders: true,
        updateProductionStatus: true,
        sendNotifications: true,
      },
      'Admin Staff': {
        viewAllOrders: true,
        showOrderPricing: true,
        displayClientInfo: true,
        calendarAllEvents: true,
        manageProducts: true,
        accessReports: true,
        viewOrderNotes: true,
        managePayroll: true,
        createOrders: true,
        updateProductionStatus: true,
        sendNotifications: true,
      },
      'photographer': {
        viewAllOrders: false,
        showOrderPricing: false,
        displayClientInfo: true,
        calendarAllEvents: false,
        manageProducts: false,
        accessReports: false,
        viewOrderNotes: true,
        managePayroll: false,
        createOrders: false,
        updateProductionStatus: true,
        sendNotifications: false,
      },
      'editor': {
        viewAllOrders: false,
        showOrderPricing: false,
        displayClientInfo: true,
        calendarAllEvents: false,
        manageProducts: false,
        accessReports: false,
        viewOrderNotes: true,
        managePayroll: false,
        createOrders: false,
        updateProductionStatus: true,
        sendNotifications: false,
      },
      'Agent': {
        viewAllOrders: false,
        showOrderPricing: false,
        displayClientInfo: true,
        calendarAllEvents: false,
        manageProducts: false,
        accessReports: false,
        viewOrderNotes: true,
        managePayroll: false,
        createOrders: true,
        updateProductionStatus: true,
        sendNotifications: false,
      },
      'Property Management': {
        viewAllOrders: true,
        showOrderPricing: false,
        displayClientInfo: true,
        calendarAllEvents: true,
        manageProducts: false,
        accessReports: true,
        viewOrderNotes: true,
        managePayroll: false,
        createOrders: true,
        updateProductionStatus: false,
        sendNotifications: true,
      }
    };
    
    return rolePermissions[role] || rolePermissions['Agent'];
  }

  // Get available roles
  getAvailableRoles(): Array<{value: string, label: string}> {
    return [
      { value: 'owner', label: 'Owner' },
      { value: 'admin', label: 'Admin' },
      { value: 'Team Leader', label: 'Team Leader' },
      { value: 'Admin Staff', label: 'Admin Staff' },
      { value: 'Agent', label: 'Agent' },
      { value: 'photographer', label: 'Photographer' },
      { value: 'editor', label: 'Editor' },
      { value: 'Property Management', label: 'Property Management' }
    ];
  }

  // Send invitation email (placeholder for now)
  async sendInvitation(email: string, role: string, companyName: string): Promise<boolean> {
    try {
      console.log(`🔧 TeamManagementService: Sending invitation to ${email} as ${role} for ${companyName}`);
      
      // TODO: Implement actual email sending
      // This would integrate with your email service (SendGrid, AWS SES, etc.)
      
      console.log('🔧 TeamManagementService: Invitation sent successfully (simulated)');
      return true;
    } catch (error) {
      console.error('🔧 TeamManagementService: Error sending invitation:', error);
      return false;
    }
  }
}

export const teamManagementService = new TeamManagementService();