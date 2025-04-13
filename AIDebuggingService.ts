import axios from 'axios';
import {
  DebuggingConfig,
  CodeAnalysisRequest,
  CodeAnalysisResponse,
  ErrorFixRequest,
  ErrorFixResponse,
  PerformanceOptimizationRequest,
  PerformanceOptimizationResponse,
  SecurityAuditRequest,
  SecurityAuditResponse,
  AccessibilityCheckRequest,
  AccessibilityCheckResponse,
  TestGenerationRequest,
  TestGenerationResponse,
  DocumentationGenerationRequest,
  DocumentationGenerationResponse
} from './types';

/**
 * AIDebuggingService class that handles AI-powered debugging operations
 * for the AI Website Builder platform.
 */
class AIDebuggingService {
  private apiKey: string | undefined;
  private apiUrl: string;
  private model: string;

  /**
   * Initialize the AI Debugging Service with configuration options
   */
  constructor(config: DebuggingConfig = {}) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || 'https://api.openai.com/v1';
    this.model = config.model || 'gpt-4';
  }

  /**
   * Set the API key
   * @param apiKey - API key for the AI service
   */
  public setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Set the model to use for AI operations
   * @param model - Model name
   */
  public setModel(model: string): void {
    this.model = model;
  }

  /**
   * Get the API client with authorization headers
   */
  private getApiClient() {
    if (!this.apiKey) {
      throw new Error('API key is required');
    }

    return axios.create({
      baseURL: this.apiUrl,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Analyze code for issues, suggestions, and complexity metrics
   * @param request - Code analysis request
   * @returns Code analysis response
   */
  public async analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildAnalysisPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert code analyzer. Provide detailed analysis of code including issues, suggestions, and complexity metrics.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseAnalysisResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing code:', error);
      throw new Error('Failed to analyze code: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Fix errors in code
   * @param request - Error fix request
   * @returns Error fix response
   */
  public async fixError(request: ErrorFixRequest): Promise<ErrorFixResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildErrorFixPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert code debugger. Fix errors in code and explain the root cause and solution.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseErrorFixResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fixing code:', error);
      throw new Error('Failed to fix code error: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Optimize code for performance
   * @param request - Performance optimization request
   * @returns Performance optimization response
   */
  public async optimizePerformance(request: PerformanceOptimizationRequest): Promise<PerformanceOptimizationResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildOptimizationPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert in code optimization. Improve code performance and explain the optimizations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseOptimizationResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error optimizing code:', error);
      throw new Error('Failed to optimize code: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Audit code for security vulnerabilities
   * @param request - Security audit request
   * @returns Security audit response
   */
  public async auditSecurity(request: SecurityAuditRequest): Promise<SecurityAuditResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildSecurityAuditPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert in application security. Identify security vulnerabilities in code and suggest remediations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseSecurityAuditResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error auditing code security:', error);
      throw new Error('Failed to audit code security: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Check code for accessibility issues
   * @param request - Accessibility check request
   * @returns Accessibility check response
   */
  public async checkAccessibility(request: AccessibilityCheckRequest): Promise<AccessibilityCheckResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildAccessibilityCheckPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert in web accessibility. Identify accessibility issues in code and suggest remediations.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseAccessibilityCheckResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error checking accessibility:', error);
      throw new Error('Failed to check accessibility: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Generate tests for code
   * @param request - Test generation request
   * @returns Test generation response
   */
  public async generateTests(request: TestGenerationRequest): Promise<TestGenerationResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildTestGenerationPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert in test-driven development. Generate comprehensive tests for code.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseTestGenerationResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating tests:', error);
      throw new Error('Failed to generate tests: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Generate documentation for code
   * @param request - Documentation generation request
   * @returns Documentation generation response
   */
  public async generateDocumentation(request: DocumentationGenerationRequest): Promise<DocumentationGenerationResponse> {
    try {
      const client = this.getApiClient();
      
      const prompt = this.buildDocumentationGenerationPrompt(request);
      
      const response = await client.post('/chat/completions', {
        model: this.model,
        messages: [
          { role: 'system', content: 'You are an expert in code documentation. Generate comprehensive documentation for code.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      });

      return this.parseDocumentationGenerationResponse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating documentation:', error);
      throw new Error('Failed to generate documentation: ' + (error.message || 'Unknown error'));
    }
  }

  /**
   * Build prompt for code analysis
   * @param request - Code analysis request
   * @returns Prompt string
   */
  private buildAnalysisPrompt(request: CodeAnalysisRequest): string {
    return `
Analyze the following ${request.language} code:

\`\`\`${request.language}
${request.code}
\`\`\`

${request.context ? `Context: ${request.context}\n` : ''}

Provide a detailed analysis including:
1. Issues (errors, warnings, potential bugs)
2. Suggestions for improvement (refactoring, optimization, best practices)
3. Complexity metrics (cyclomatic complexity, maintainability index, lines of code, comment percentage)
4. Summary of the code quality

Format your response as JSON with the following structure:
{
  "issues": [
    {
      "type": "error|warning|info",
      "message": "Description of the issue",
      "line": 123,
      "column": 45,
      "code": "Problematic code snippet",
      "severity": "critical|high|medium|low",
      "ruleId": "Optional rule identifier"
    }
  ],
  "suggestions": [
    {
      "type": "refactor|optimization|security|accessibility|best-practice",
      "message": "Description of the suggestion",
      "line": 123,
      "column": 45,
      "originalCode": "Original code snippet",
      "suggestedCode": "Improved code snippet",
      "explanation": "Detailed explanation of why this change is recommended"
    }
  ],
  "complexity": {
    "cyclomaticComplexity": 10,
    "maintainabilityIndex": 75,
    "halsteadVolume": 500,
    "linesOfCode": 150,
    "commentPercentage": 15
  },
  "summary": "Overall assessment of the code quality"
}
`;
  }

  /**
   * Parse code analysis response
   * @param responseText - Response text from API
   * @returns Parsed code analysis response
   */
  private parseAnalysisResponse(responseText: string): CodeAnalysisResponse {
    try {
      // Extract JSON from response text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json\n|```/g, '');
        return JSON.parse(jsonStr);
      }
      
      throw new Error('Could not parse JSON from response');
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      
      // Return a default response
      return {
        issues: [],
        suggestions: [],
        complexity: {
          cyclomaticComplexity: 0,
          maintainabilityIndex: 0,
          linesOfCode: 0,
          commentPercentage: 0
        },
        summary: 'Failed to parse analysis response'
      };
    }
  }

  /**
   * Build prompt for error fixing
   * @param request - Error fix request
   * @returns Prompt string
   */
  private buildErrorFixPrompt(request: ErrorFixRequest): string {
    return `
Fix the following error in this ${request.language} code:

\`\`\`${request.language}
${request.code}
\`\`\`

Error: ${request.error}

${request.stackTrace ? `Stack trace:\n${request.stackTrace}\n` : ''}
${request.context ? `Context: ${request.context}\n` : ''}

Provide a fix for the code and explain the root cause of the error.

Format your response as JSON with the following structure:
{
  "fixedCode": "Complete fixed code",
  "explanation": "Detailed explanation of the fix",
  "rootCause": "Description of what caused the error",
  "additionalSuggestions": [
    "Suggestion 1",
    "Suggestion 2"
  ]
}
`;
  }

  /**
   * Parse error fix response
   * @param responseText - Response text from API
   * @returns Parsed error fix response
   */
  private parseErrorFixResponse(responseText: string): ErrorFixResponse {
    try {
      // Extract JSON from response text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json\n|```/g, '');
        return JSON.parse(jsonStr);
      }
      
      throw new Error('Could not parse JSON from response');
    } catch (error) {
      console.error('Error parsing error fix response:', error);
      
      // Return a default response
      return {
        explanation: 'Failed to parse error fix response',
        rootCause: 'Unknown'
      };
    }
  }

  /**
   * Build prompt for performance optimization
   * @param request - Performance optimization request
   * @returns Prompt string
   */
  private buildOptimizationPrompt(request: PerformanceOptimizationRequest): string {
    return `
Optimize the following ${request.language} code for performance:

\`\`\`${request.language}
${request.code}
\`\`\`

${request.performanceProfile ? `
Performance profile:
- Execution time: ${request.performanceProfile.executionTime || 'Unknown'}
- Memory usage: ${request.performanceProfile.memoryUsage || 'Unknown'}
${request.performanceProfile.bottlenecks ? `- Bottlenecks: ${request.performanceProfile.bottlenecks.join(', ')}` : ''}
` : ''}

${request.context ? `Context: ${request.context}\n` : ''}

Provide optimized code and explain the performance improvements.

Format your response as JSON with the following structure:
{
  "optimizedCode": "Complete optimized code",
  "explanation": "Detailed explanation of the optimizations",
  "expectedImprovements": {
    "executionTime": "Expected improvement in execution time",
    "memoryUsage": "Expected improvement in memory usage",
    "other": "Other expected improvements"
  },
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}
`;
  }

  /**
   * Parse performance optimization response
   * @param responseText - Response text from API
   * @returns Parsed performance optimization response
   */
  private parseOptimizationResponse(responseText: string): PerformanceOptimizationResponse {
    try {
      // Extract JSON from response text
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                        responseText.match(/{[\s\S]*}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json\n|```/g, '');
        return JSON.parse(jsonStr);
      }
      
      throw new Error('Could not parse JSON from response');
    } catch (error) {
      console.error('Error parsing optimization response:', error);
      
      // Return a default response
      return {
        explanation: 'Failed to parse optimization response',
        expectedImprovements: {},
        recommendations: []
      };
    }
  }

  /**
   * Build prompt for security audit
   * @param request - Security audit request
   * @returns Prompt string
   */
  private buildSecurityAuditPrompt(request: SecurityAuditRequest): string {
    return `
Perform a security audit on the following ${request.language} code:

\`\`\`${request.language}
${request.code}
\`\`\`

${request.sensitiveOperations ? `Sensitive operations: ${request.sensitiveOperations.join(', ')}\n` : ''}
${request.context ? `Context: ${request.context}\n` : ''}

Identify security vulnerabilities and provide recommendations for remediation.

Format your response as JSON with the following structure:
{
  "vulnerabilities": [
    {
      "type": "Vulnerability type (e.g., XSS, SQL Injection)",
      "severity": "critical|high|medium|low",
      "description": "Description of the vulnerability",
      "line": 123,
      "column": 45,
      "code": "Vulnerable code snippet",
      "remediation": "How to fix this vulnerability",
      "cweId": "Common W
(Content truncated due to size limit. Use line ranges to read in chunks)