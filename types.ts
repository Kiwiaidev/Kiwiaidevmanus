export interface ProjectRequirements {
  projectDescription: string;
  targetAudience?: string;
  features?: string[];
  designPreferences?: string;
}

export interface ProjectAnalysis {
  projectId: string;
  analysis: {
    recommendedStructure: Record<string, any>;
    suggestedComponents: string[];
    estimatedComplexity: string;
  };
  nextSteps: string[];
}

export interface CodeGenerationRequest {
  projectId: string;
  componentType: string;
  specifications: Record<string, any>;
  existingCode?: string;
}

export interface CodeGenerationResponse {
  generatedCode: string;
  filePath: string;
  dependencies: string[];
  explanations: string;
}

export interface DebuggingRequest {
  projectId: string;
  code: string;
  errorMessage?: string;
  context?: string;
}

export interface DebuggingResponse {
  issues: Array<{
    type: string;
    location: string;
    description: string;
    suggestedFix: string;
  }>;
  optimizationSuggestions: string[];
}

export interface AIServiceConfig {
  apiKey?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
}
