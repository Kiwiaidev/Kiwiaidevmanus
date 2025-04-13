import { Octokit } from 'octokit';
import axios from 'axios';
import { 
  GitHubConfig, 
  Repository, 
  Branch, 
  Commit, 
  WorkflowRun, 
  WorkflowFile,
  PullRequest,
  FileChange
} from './types';

/**
 * GitHubService class that handles GitHub API operations for the AI Website Builder platform.
 */
class GitHubService {
  private octokit: Octokit;
  private config: GitHubConfig;

  /**
   * Initialize the GitHub Service with configuration options
   */
  constructor(config: GitHubConfig = {}) {
    this.config = {
      apiUrl: 'https://api.github.com',
      ...config
    };

    this.octokit = new Octokit({
      auth: this.config.apiToken,
      baseUrl: this.config.apiUrl
    });
  }

  /**
   * Set the GitHub API token
   * @param token - GitHub API token
   */
  public setToken(token: string): void {
    this.config.apiToken = token;
    this.octokit = new Octokit({
      auth: token,
      baseUrl: this.config.apiUrl
    });
  }

  /**
   * Create a new repository
   * @param name - Repository name
   * @param isPrivate - Whether the repository is private
   * @param description - Repository description
   * @returns The created repository
   */
  public async createRepository(
    name: string, 
    isPrivate: boolean = true, 
    description?: string
  ): Promise<Repository | null> {
    try {
      const response = await this.octokit.rest.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true
      });

      if (response.status !== 201) {
        console.error('Failed to create repository:', response.status);
        return null;
      }

      const repo = response.data;
      return {
        id: repo.node_id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || undefined,
        private: repo.private,
        htmlUrl: repo.html_url,
        cloneUrl: repo.clone_url,
        defaultBranch: repo.default_branch,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at
      };
    } catch (error) {
      console.error('Error creating repository:', error);
      return null;
    }
  }

  /**
   * Get a repository by owner and name
   * @param owner - Repository owner
   * @param repo - Repository name
   * @returns The repository
   */
  public async getRepository(owner: string, repo: string): Promise<Repository | null> {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo
      });

      if (response.status !== 200) {
        console.error('Failed to get repository:', response.status);
        return null;
      }

      const repository = response.data;
      return {
        id: repository.node_id,
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description || undefined,
        private: repository.private,
        htmlUrl: repository.html_url,
        cloneUrl: repository.clone_url,
        defaultBranch: repository.default_branch,
        createdAt: repository.created_at,
        updatedAt: repository.updated_at
      };
    } catch (error) {
      console.error('Error getting repository:', error);
      return null;
    }
  }

  /**
   * Create a file in a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param path - File path
   * @param content - File content
   * @param message - Commit message
   * @param branch - Branch name (defaults to the default branch)
   * @returns Success status
   */
  public async createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string
  ): Promise<boolean> {
    try {
      // Get the branch if not provided
      if (!branch) {
        const repository = await this.getRepository(owner, repo);
        if (!repository) {
          return false;
        }
        branch = repository.defaultBranch;
      }

      // Convert content to base64
      const contentEncoded = Buffer.from(content).toString('base64');

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: contentEncoded,
        branch
      });

      return response.status === 201 || response.status === 200;
    } catch (error) {
      console.error('Error creating file:', error);
      return false;
    }
  }

  /**
   * Update a file in a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param path - File path
   * @param content - New file content
   * @param message - Commit message
   * @param branch - Branch name (defaults to the default branch)
   * @returns Success status
   */
  public async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch?: string
  ): Promise<boolean> {
    try {
      // Get the branch if not provided
      if (!branch) {
        const repository = await this.getRepository(owner, repo);
        if (!repository) {
          return false;
        }
        branch = repository.defaultBranch;
      }

      // Get the current file to get its SHA
      const fileResponse = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
        ref: branch
      });

      if (fileResponse.status !== 200 || !('sha' in fileResponse.data)) {
        console.error('Failed to get file content:', fileResponse.status);
        return false;
      }

      // Convert content to base64
      const contentEncoded = Buffer.from(content).toString('base64');

      const response = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: contentEncoded,
        sha: fileResponse.data.sha,
        branch
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error updating file:', error);
      return false;
    }
  }

  /**
   * Create or update multiple files in a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param files - Array of file changes
   * @param branch - Branch name (defaults to the default branch)
   * @returns Success status
   */
  public async commitMultipleFiles(
    owner: string,
    repo: string,
    files: FileChange[],
    branch?: string
  ): Promise<boolean> {
    try {
      // Get the branch if not provided
      if (!branch) {
        const repository = await this.getRepository(owner, repo);
        if (!repository) {
          return false;
        }
        branch = repository.defaultBranch;
      }

      // Get the latest commit SHA for the branch
      const refResponse = await this.octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`
      });

      if (refResponse.status !== 200) {
        console.error('Failed to get reference:', refResponse.status);
        return false;
      }

      const latestCommitSha = refResponse.data.object.sha;

      // Get the commit to retrieve the tree SHA
      const commitResponse = await this.octokit.rest.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha
      });

      if (commitResponse.status !== 200) {
        console.error('Failed to get commit:', commitResponse.status);
        return false;
      }

      const treeSha = commitResponse.data.tree.sha;

      // Create a new tree with the file changes
      const treeItems = await Promise.all(
        files.map(async (file) => {
          const content = file.content;
          return {
            path: file.path,
            mode: '100644', // Regular file
            type: 'blob',
            content
          };
        })
      );

      const treeResponse = await this.octokit.rest.git.createTree({
        owner,
        repo,
        base_tree: treeSha,
        tree: treeItems
      });

      if (treeResponse.status !== 201) {
        console.error('Failed to create tree:', treeResponse.status);
        return false;
      }

      // Create a commit with the new tree
      const commitMessage = files.length === 1 
        ? files[0].message 
        : `Update ${files.length} files`;

      const createCommitResponse = await this.octokit.rest.git.createCommit({
        owner,
        repo,
        message: commitMessage,
        tree: treeResponse.data.sha,
        parents: [latestCommitSha]
      });

      if (createCommitResponse.status !== 201) {
        console.error('Failed to create commit:', createCommitResponse.status);
        return false;
      }

      // Update the reference to point to the new commit
      const updateRefResponse = await this.octokit.rest.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: createCommitResponse.data.sha
      });

      return updateRefResponse.status === 200;
    } catch (error) {
      console.error('Error committing multiple files:', error);
      return false;
    }
  }

  /**
   * Create a branch in a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param branchName - New branch name
   * @param sourceBranch - Source branch to create from (defaults to the default branch)
   * @returns Success status
   */
  public async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    sourceBranch?: string
  ): Promise<boolean> {
    try {
      // Get the source branch if not provided
      if (!sourceBranch) {
        const repository = await this.getRepository(owner, repo);
        if (!repository) {
          return false;
        }
        sourceBranch = repository.defaultBranch;
      }

      // Get the SHA of the latest commit on the source branch
      const refResponse = await this.octokit.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${sourceBranch}`
      });

      if (refResponse.status !== 200) {
        console.error('Failed to get reference:', refResponse.status);
        return false;
      }

      const sha = refResponse.data.object.sha;

      // Create the new branch
      const response = await this.octokit.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branchName}`,
        sha
      });

      return response.status === 201;
    } catch (error) {
      console.error('Error creating branch:', error);
      return false;
    }
  }

  /**
   * Get branches in a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @returns Array of branches
   */
  public async getBranches(owner: string, repo: string): Promise<Branch[]> {
    try {
      const response = await this.octokit.rest.repos.listBranches({
        owner,
        repo
      });

      if (response.status !== 200) {
        console.error('Failed to get branches:', response.status);
        return [];
      }

      return response.data.map(branch => ({
        name: branch.name,
        commit: {
          sha: branch.commit.sha,
          url: branch.commit.url
        },
        protected: branch.protected
      }));
    } catch (error) {
      console.error('Error getting branches:', error);
      return [];
    }
  }

  /**
   * Create a GitHub Actions workflow file
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param workflowFile - Workflow file details
   * @returns Success status
   */
  public async createWorkflow(
    owner: string,
    repo: string,
    workflowFile: WorkflowFile
  ): Promise<boolean> {
    try {
      const path = `.github/workflows/${workflowFile.name}`;
      return await this.createFile(
        owner,
        repo,
        path,
        workflowFile.content,
        `Add GitHub Actions workflow: ${workflowFile.name}`
      );
    } catch (error) {
      console.error('Error creating workflow:', error);
      return false;
    }
  }

  /**
   * Get workflow runs for a repository
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param workflowId - Workflow ID or file name
   * @returns Array of workflow runs
   */
  public async getWorkflowRuns(
    owner: string,
    repo: string,
    workflowId: string | number
  ): Promise<WorkflowRun[]> {
    try {
      const response = await this.octokit.rest.actions.listWorkflowRuns({
        owner,
        repo,
        workflow_id: workflowId
      });

      if (response.status !== 200) {
        console.error('Failed to get workflow runs:', response.status);
        return [];
      }

      return response.data.workflow_runs.map(run => ({
        id: run.id,
        name: run.name || 'Unnamed workflow',
        status: run.status as WorkflowRun['status'],
        conclusion: run.conclusion as WorkflowRun['conclusion'],
        createdAt: run.created_at,
        updatedAt: run.updated_at,
        url: run.url,
        htmlUrl: run.html_url
      }));
    } catch (error) {
      console.error('Error getting workflow runs:', error);
      return [];
    }
  }

  /**
   * Create a pull request
   * @param owner - Repository owner
   * @param repo - Repository name
   * @param title - Pull request title
   * @param head - Head branch
   * @param base - Base branch
   * @param body - Pull request description
   * @returns The created pull request or null
   */
  public async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string
  ): Promise<PullRequest | null> {
    try {
      const response = await this.octokit.rest.pulls.create({
        owner,
        repo,
        title,
        head,
        base,
        body
      });

      if (response.status !== 201) {
        console.error('Failed to create pull request:', response.status);
        return null;
      }

      const pr = response.data;
      return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        state: pr.state as PullRequest['state'],
        htmlUrl: pr.html_url,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        mergedAt: pr.merged_at,
        draft: pr.draft
      };
    } catch (error) {
      console.error('Error creating pull request:', error);
      return null;
    }
  }

  /**
   * Generate a GitHub Actions workflow YAML for CI/CD
   * @param buildCommand - Build command
   * @param testCommand - Test command
   * @param deploymentTarget - Deployment target (e.g., 'netlify')
   * @returns Workflow YAML content
   */
  public generateWorkflowYAML(
    buildCommand: string = 'npm run build',
    testCommand: string = 'npm test',
    deploymentTarget: 'netlify' | 'vercel' | 'none' = 'netlify'
  ): string {
    let yaml = `name: CI/CD Pipeline

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: ${testCommand}
    
    - name: Build
      run: ${buildCommand}
`;

    if (deploymentTarget === 'netlify') {
      yaml += `
  deploy:
    needs: build-and-test
    if: github.event_name == 'push' && (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master')
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: ${buildCommand}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './out'
        production-branch: main
        github-token: \${{ secrets.GITHUB_TOKEN }}
        deploy-m
(Content truncated due to size limit. Use line ranges to read in chunks)