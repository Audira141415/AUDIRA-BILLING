import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface RadiusUser {
  username: string;
  password: string;
  profile?: string;
  rateLimit?: string; // e.g., "10M/10M"
  addressList?: string;
}

export interface CoARequest {
  username: string;
  nasIp: string;
  nasSecret: string;
  attributes?: { [key: string]: string };
}

@Injectable()
export class RadiusService {
  private readonly logger = new Logger(RadiusService.name);
  private readonly radiusHost = process.env.RADIUS_HOST || 'localhost';
  private readonly radiusSecret = process.env.RADIUS_SECRET || 'testing123';

  /**
   * Create PPPoE user in RADIUS database
   * Note: This requires direct database access or RADIUS API
   */
  async createUser(user: RadiusUser): Promise<any> {
    try {
      // TODO: Implement actual RADIUS database insertion
      // For now, this is a placeholder showing the structure
      
      const radcheck = {
        username: user.username,
        attribute: 'Cleartext-Password',
        op: ':=',
        value: user.password,
      };

      const radreply = [];
      
      if (user.rateLimit) {
        radreply.push({
          username: user.username,
          attribute: 'Mikrotik-Rate-Limit',
          op: ':=',
          value: user.rateLimit,
        });
      }

      if (user.addressList) {
        radreply.push({
          username: user.username,
          attribute: 'Mikrotik-Address-List',
          op: ':=',
          value: user.addressList,
        });
      }

      this.logger.log(`RADIUS user created: ${user.username}`);
      
      return {
        success: true,
        message: 'User created in RADIUS',
        username: user.username,
      };
    } catch (error) {
      this.logger.error(`Failed to create RADIUS user ${user.username}:`, error.message);
      throw error;
    }
  }

  /**
   * Alias for createUser for compatibility
   */
  async createRadiusUser(user: RadiusUser): Promise<any> {
    return this.createUser(user);
  }

  /**
   * Update bandwidth for a user
   */
  async updateBandwidth(options: { username: string; rateLimit: string; nasIp?: string; nasSecret?: string }): Promise<any> {
    const nasIp = options.nasIp || this.radiusHost;
    const nasSecret = options.nasSecret || this.radiusSecret;
    
    return this.changeBandwidth(options.username, options.rateLimit, nasIp, nasSecret);
  }

  /**
   * Delete RADIUS user - alias for deleteUser
   */
  async deleteRadiusUser(username: string): Promise<any> {
    return this.deleteUser(username);
  }

  /**
   * Test RADIUS authentication
   */
  async testAuth(username: string, password: string): Promise<boolean> {
    try {
      const command = `radtest ${username} ${password} ${this.radiusHost} 0 ${this.radiusSecret}`;
      const { stdout } = await execAsync(command);
      
      const success = stdout.includes('Access-Accept');
      this.logger.log(`RADIUS test for ${username}: ${success ? 'SUCCESS' : 'FAILED'}`);
      
      return success;
    } catch (error) {
      this.logger.error(`RADIUS test failed for ${username}:`, error.message);
      return false;
    }
  }

  /**
   * Send CoA (Change of Authorization) to change bandwidth
   */
  async sendCoA(request: CoARequest): Promise<any> {
    try {
      const attributes = request.attributes || {};
      
      // Build attribute string
      const attrString = Object.entries({
        'User-Name': request.username,
        ...attributes,
      })
        .map(([key, value]) => `${key}=${value}`)
        .join(',');

      const command = `echo "${attrString}" | radclient ${request.nasIp}:3799 coa ${request.nasSecret}`;
      
      const { stdout } = await execAsync(command);
      
      const success = stdout.includes('Received CoA-ACK');
      this.logger.log(`CoA sent to ${request.username} on ${request.nasIp}: ${success ? 'ACK' : 'NAK'}`);
      
      return {
        success,
        message: success ? 'CoA accepted' : 'CoA rejected',
      };
    } catch (error) {
      this.logger.error(`CoA failed for ${request.username}:`, error.message);
      throw error;
    }
  }

  /**
   * Change user bandwidth dynamically
   */
  async changeBandwidth(username: string, speed: string, nasIp: string, nasSecret: string): Promise<any> {
    return this.sendCoA({
      username,
      nasIp,
      nasSecret,
      attributes: {
        'Mikrotik-Rate-Limit': speed,
      },
    });
  }

  /**
   * Disconnect user session
   */
  async disconnectUser(username: string, nasIp: string, nasSecret: string): Promise<any> {
    try {
      const command = `echo "User-Name=${username}" | radclient ${nasIp}:3799 disconnect ${nasSecret}`;
      
      const { stdout } = await execAsync(command);
      
      const success = stdout.includes('Disconnect-ACK');
      this.logger.log(`Disconnect request for ${username}: ${success ? 'ACK' : 'NAK'}`);
      
      return {
        success,
        message: success ? 'User disconnected' : 'Disconnect failed',
      };
    } catch (error) {
      this.logger.error(`Disconnect failed for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Get active sessions from accounting database
   * Note: This requires direct database access
   */
  async getActiveSessions(): Promise<any[]> {
    try {
      // TODO: Implement actual database query
      // SELECT * FROM radacct WHERE acctstoptime IS NULL
      
      const mockSessions = [
        {
          username: 'customer1',
          nasipaddress: '192.168.1.1',
          acctstarttime: new Date(),
          acctinputoctets: 1024 * 1024 * 500, // 500 MB
          acctoutputoctets: 1024 * 1024 * 300, // 300 MB
        },
      ];

      return mockSessions;
    } catch (error) {
      this.logger.error('Failed to get active sessions:', error.message);
      throw error;
    }
  }

  /**
   * Get user statistics from accounting
   */
  async getUserStats(username: string): Promise<any> {
    try {
      // TODO: Implement actual database query
      // SELECT SUM(acctsessiontime), SUM(acctinputoctets), SUM(acctoutputoctets) 
      // FROM radacct WHERE username = ?
      
      const mockStats = {
        username,
        totalSessions: 45,
        totalTime: 3600 * 120, // 120 hours
        totalDownload: 1024 * 1024 * 1024 * 50, // 50 GB
        totalUpload: 1024 * 1024 * 1024 * 20, // 20 GB
      };

      return mockStats;
    } catch (error) {
      this.logger.error(`Failed to get stats for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Update user password
   */
  async updatePassword(username: string, newPassword: string): Promise<any> {
    try {
      // TODO: Implement actual database update
      // UPDATE radcheck SET value = ? WHERE username = ? AND attribute = 'Cleartext-Password'
      
      this.logger.log(`Password updated for RADIUS user: ${username}`);
      
      return {
        success: true,
        message: 'Password updated',
      };
    } catch (error) {
      this.logger.error(`Failed to update password for ${username}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete user from RADIUS
   */
  async deleteUser(username: string): Promise<any> {
    try {
      // TODO: Implement actual database deletion
      // DELETE FROM radcheck WHERE username = ?
      // DELETE FROM radreply WHERE username = ?
      // DELETE FROM radusergroup WHERE username = ?
      
      this.logger.log(`RADIUS user deleted: ${username}`);
      
      return {
        success: true,
        message: 'User deleted',
      };
    } catch (error) {
      this.logger.error(`Failed to delete RADIUS user ${username}:`, error.message);
      throw error;
    }
  }
}
