import axios from 'axios';
import { 
  NetlifyConfig, 
  Site, 
  Deploy, 
  DeployKey, 
  DeployHook,
  FormSubmission,
  BuildHook,
  DeployOptions,
  SiteCreateOptions
} from './types';

/**
 * NetlifyService class that handles Netlify API operations for the AI Website Builder platform.
 */
class NetlifyService {
  private apiToken: string | undefined;
  private apiUrl: string;

  /**
   * Initialize the Netlify Service with configuration options
   */
  constructor(config: NetlifyConfig = {}) {
    this.apiToken = config.apiToken;
    this.apiUrl = config.apiUrl || 'https://api.netlify.com/api/v1';
  }

  /**
   * Set the Netlify API token
   * @param token - Netlify API token
   */
  public setToken(token: string): void {
    this.apiToken = token;
  }

  /**
   * Get the API client with authorization headers
   */
  private getApiClient() {
    if (!this.apiToken) {
      throw new Error('Netlify API token is required');
    }

    return axios.create({
      baseURL: this.apiUrl,
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * List all sites for the authenticated user
   * @returns Array of sites
   */
  public async listSites(): Promise<Site[]> {
    try {
      const client = this.getApiClient();
      const response = await client.get('/sites');

      if (response.status !== 200) {
        console.error('Failed to list sites:', response.status);
        return [];
      }

      return response.data.map((site: any) => ({
        id: site.id,
        name: site.name,
        url: site.url,
        adminUrl: site.admin_url,
        screenshotUrl: site.screenshot_url,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        buildSettings: site.build_settings ? {
          cmd: site.build_settings.cmd,
          dir: site.build_settings.dir,
          env: site.build_settings.env
        } : undefined
      }));
    } catch (error) {
      console.error('Error listing sites:', error);
      return [];
    }
  }

  /**
   * Get a site by ID
   * @param siteId - Site ID
   * @returns The site or null if not found
   */
  public async getSite(siteId: string): Promise<Site | null> {
    try {
      const client = this.getApiClient();
      const response = await client.get(`/sites/${siteId}`);

      if (response.status !== 200) {
        console.error('Failed to get site:', response.status);
        return null;
      }

      const site = response.data;
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        adminUrl: site.admin_url,
        screenshotUrl: site.screenshot_url,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        buildSettings: site.build_settings ? {
          cmd: site.build_settings.cmd,
          dir: site.build_settings.dir,
          env: site.build_settings.env
        } : undefined
      };
    } catch (error) {
      console.error('Error getting site:', error);
      return null;
    }
  }

  /**
   * Create a new site
   * @param options - Site creation options
   * @returns The created site or null if creation failed
   */
  public async createSite(options: SiteCreateOptions): Promise<Site | null> {
    try {
      const client = this.getApiClient();
      const response = await client.post('/sites', {
        name: options.name,
        custom_domain: options.customDomain,
        account_slug: options.accountSlug,
        repo: options.repo ? {
          provider: options.repo.provider,
          repo: options.repo.repo,
          private: options.repo.private,
          branch: options.repo.branch
        } : undefined,
        build_settings: options.buildSettings ? {
          cmd: options.buildSettings.cmd,
          dir: options.buildSettings.dir,
          env: options.buildSettings.env
        } : undefined
      });

      if (response.status !== 201) {
        console.error('Failed to create site:', response.status);
        return null;
      }

      const site = response.data;
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        adminUrl: site.admin_url,
        screenshotUrl: site.screenshot_url,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        buildSettings: site.build_settings ? {
          cmd: site.build_settings.cmd,
          dir: site.build_settings.dir,
          env: site.build_settings.env
        } : undefined
      };
    } catch (error) {
      console.error('Error creating site:', error);
      return null;
    }
  }

  /**
   * Update a site
   * @param siteId - Site ID
   * @param options - Site update options
   * @returns The updated site or null if update failed
   */
  public async updateSite(siteId: string, options: Partial<SiteCreateOptions>): Promise<Site | null> {
    try {
      const client = this.getApiClient();
      const response = await client.patch(`/sites/${siteId}`, {
        name: options.name,
        custom_domain: options.customDomain,
        repo: options.repo ? {
          provider: options.repo.provider,
          repo: options.repo.repo,
          private: options.repo.private,
          branch: options.repo.branch
        } : undefined,
        build_settings: options.buildSettings ? {
          cmd: options.buildSettings.cmd,
          dir: options.buildSettings.dir,
          env: options.buildSettings.env
        } : undefined
      });

      if (response.status !== 200) {
        console.error('Failed to update site:', response.status);
        return null;
      }

      const site = response.data;
      return {
        id: site.id,
        name: site.name,
        url: site.url,
        adminUrl: site.admin_url,
        screenshotUrl: site.screenshot_url,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
        buildSettings: site.build_settings ? {
          cmd: site.build_settings.cmd,
          dir: site.build_settings.dir,
          env: site.build_settings.env
        } : undefined
      };
    } catch (error) {
      console.error('Error updating site:', error);
      return null;
    }
  }

  /**
   * Delete a site
   * @param siteId - Site ID
   * @returns Success status
   */
  public async deleteSite(siteId: string): Promise<boolean> {
    try {
      const client = this.getApiClient();
      const response = await client.delete(`/sites/${siteId}`);

      return response.status === 204;
    } catch (error) {
      console.error('Error deleting site:', error);
      return false;
    }
  }

  /**
   * List deploys for a site
   * @param siteId - Site ID
   * @returns Array of deploys
   */
  public async listDeploys(siteId: string): Promise<Deploy[]> {
    try {
      const client = this.getApiClient();
      const response = await client.get(`/sites/${siteId}/deploys`);

      if (response.status !== 200) {
        console.error('Failed to list deploys:', response.status);
        return [];
      }

      return response.data.map((deploy: any) => ({
        id: deploy.id,
        siteId: deploy.site_id,
        status: deploy.state,
        deployUrl: deploy.deploy_url || deploy.url,
        screenshotUrl: deploy.screenshot_url,
        createdAt: deploy.created_at,
        updatedAt: deploy.updated_at,
        branch: deploy.branch,
        commitRef: deploy.commit_ref,
        commitUrl: deploy.commit_url,
        errorMessage: deploy.error_message
      }));
    } catch (error) {
      console.error('Error listing deploys:', error);
      return [];
    }
  }

  /**
   * Get a deploy by ID
   * @param siteId - Site ID
   * @param deployId - Deploy ID
   * @returns The deploy or null if not found
   */
  public async getDeploy(siteId: string, deployId: string): Promise<Deploy | null> {
    try {
      const client = this.getApiClient();
      const response = await client.get(`/sites/${siteId}/deploys/${deployId}`);

      if (response.status !== 200) {
        console.error('Failed to get deploy:', response.status);
        return null;
      }

      const deploy = response.data;
      return {
        id: deploy.id,
        siteId: deploy.site_id,
        status: deploy.state,
        deployUrl: deploy.deploy_url || deploy.url,
        screenshotUrl: deploy.screenshot_url,
        createdAt: deploy.created_at,
        updatedAt: deploy.updated_at,
        branch: deploy.branch,
        commitRef: deploy.commit_ref,
        commitUrl: deploy.commit_url,
        errorMessage: deploy.error_message
      };
    } catch (error) {
      console.error('Error getting deploy:', error);
      return null;
    }
  }

  /**
   * Create a deploy key
   * @returns The deploy key or null if creation failed
   */
  public async createDeployKey(): Promise<DeployKey | null> {
    try {
      const client = this.getApiClient();
      const response = await client.post('/deploy_keys');

      if (response.status !== 201) {
        console.error('Failed to create deploy key:', response.status);
        return null;
      }

      const key = response.data;
      return {
        id: key.id,
        publicKey: key.public_key
      };
    } catch (error) {
      console.error('Error creating deploy key:', error);
      return null;
    }
  }

  /**
   * Create a deploy hook for a site
   * @param siteId - Site ID
   * @param title - Hook title
   * @param branch - Branch to build (optional)
   * @returns The deploy hook or null if creation failed
   */
  public async createDeployHook(siteId: string, title: string, branch?: string): Promise<DeployHook | null> {
    try {
      const client = this.getApiClient();
      const response = await client.post(`/sites/${siteId}/build_hooks`, {
        title,
        branch
      });

      if (response.status !== 201) {
        console.error('Failed to create deploy hook:', response.status);
        return null;
      }

      const hook = response.data;
      return {
        id: hook.id,
        siteId: hook.site_id,
        title: hook.title,
        url: hook.url,
        branch: hook.branch
      };
    } catch (error) {
      console.error('Error creating deploy hook:', error);
      return null;
    }
  }

  /**
   * List deploy hooks for a site
   * @param siteId - Site ID
   * @returns Array of deploy hooks
   */
  public async listDeployHooks(siteId: string): Promise<DeployHook[]> {
    try {
      const client = this.getApiClient();
      const response = await client.get(`/sites/${siteId}/build_hooks`);

      if (response.status !== 200) {
        console.error('Failed to list deploy hooks:', response.status);
        return [];
      }

      return response.data.map((hook: any) => ({
        id: hook.id,
        siteId: hook.site_id,
        title: hook.title,
        url: hook.url,
        branch: hook.branch
      }));
    } catch (error) {
      console.error('Error listing deploy hooks:', error);
      return [];
    }
  }

  /**
   * Trigger a deploy hook
   * @param hookId - Hook ID
   * @returns Success status
   */
  public async triggerDeployHook(hookId: string): Promise<boolean> {
    try {
      const client = this.getApiClient();
      const response = await client.post(`/hooks/${hookId}`);

      return response.status === 200;
    } catch (error) {
      console.error('Error triggering deploy hook:', error);
      return false;
    }
  }

  /**
   * Create a new deploy for a site using direct upload
   * This is a simplified version and would need to be expanded for actual file uploads
   * @param options - Deploy options
   * @returns The created deploy or null if creation failed
   */
  public async createDeploy(options: DeployOptions): Promise<Deploy | null> {
    try {
      const client = this.getApiClient();
      const response = await client.post(`/sites/${options.siteId}/deploys`, {
        title: options.title,
        branch: options.branch,
        deploy_dir: options.deployDir,
        functions_dir: options.functionsDir,
        draft: options.draft,
        message: options.message
      });

      if (response.status !== 201) {
        console.error('Failed to create deploy:', response.status);
        return null;
      }

      const deploy = response.data;
      return {
        id: deploy.id,
        siteId: deploy.site_id,
        status: deploy.state,
        deployUrl: deploy.deploy_url || deploy.url,
        screenshotUrl: deploy.screenshot_url,
        createdAt: deploy.created_at,
        updatedAt: deploy.updated_at,
        branch: deploy.branch,
        commitRef: deploy.commit_ref,
        commitUrl: deploy.commit_url,
        errorMessage: deploy.error_message
      };
    } catch (error) {
      console.error('Error creating deploy:', error);
      return null;
    }
  }

  /**
   * Cancel a deploy
   * @param siteId - Site ID
   * @param deployId - Deploy ID
   * @returns Success status
   */
  public async cancelDeploy(siteId: string, deployId: string): Promise<boolean> {
    try {
      const client = this.getApiClient();
      const response = await client.post(`/sites/${siteId}/deploys/${deployId}/cancel`);

      return response.status === 200;
    } catch (error) {
      console.error('Error canceling deploy:', error);
      return false;
    }
  }

  /**
   * Get form submissions for a site
   * @param siteId - Site ID
   * @param formId - Form ID
   * @returns Array of form submissions
   */
  public async getFormSubmissions(siteId: string, formId: string): Promise<FormSubmission[]> {
    try {
      const client = this.getApiClient();
      const response = await client.get(`/sites/${siteId}/forms/${formId}/submissions`);

      if (response.status !== 200) {
        console.error('Failed to get form submissions:', response.status);
        return [];
      }

      return response.data.map((submission: any) => ({
        id: submission.id,
        siteId: submission.site_id,
        formId: submission.form_id,
        createdAt: submission.created_at,
        data: submission.data
      }));
    } catch (error) {
      console.error('Error getting form submissions:', error);
      return [];
    }
  }
}

export default NetlifyService;
