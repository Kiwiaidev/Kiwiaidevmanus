# API Specifications

## AI Agent Interface API

### 1. Project Analysis Endpoint
- **Endpoint**: `/api/ai/analyze`
- **Method**: POST
- **Description**: Analyzes project requirements and generates initial project structure
- **Request Body**:
  ```json
  {
    "projectDescription": "string",
    "targetAudience": "string",
    "features": ["string"],
    "designPreferences": "string"
  }
  ```
- **Response**:
  ```json
  {
    "projectId": "string",
    "analysis": {
      "recommendedStructure": "object",
      "suggestedComponents": ["string"],
      "estimatedComplexity": "string"
    },
    "nextSteps": ["string"]
  }
  ```

### 2. Code Generation Endpoint
- **Endpoint**: `/api/ai/generate`
- **Method**: POST
- **Description**: Generates code based on project requirements and specifications
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "componentType": "string",
    "specifications": "object",
    "existingCode": "string"
  }
  ```
- **Response**:
  ```json
  {
    "generatedCode": "string",
    "filePath": "string",
    "dependencies": ["string"],
    "explanations": "string"
  }
  ```

### 3. Debugging Endpoint
- **Endpoint**: `/api/ai/debug`
- **Method**: POST
- **Description**: Analyzes code for issues and suggests fixes
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "code": "string",
    "errorMessage": "string",
    "context": "string"
  }
  ```
- **Response**:
  ```json
  {
    "issues": [
      {
        "type": "string",
        "location": "string",
        "description": "string",
        "suggestedFix": "string"
      }
    ],
    "optimizationSuggestions": ["string"]
  }
  ```

## Supabase Integration API

### 1. Database Configuration Endpoint
- **Endpoint**: `/api/supabase/configure`
- **Method**: POST
- **Description**: Configures Supabase database schema and tables
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "schema": [
      {
        "tableName": "string",
        "columns": [
          {
            "name": "string",
            "type": "string",
            "constraints": ["string"]
          }
        ],
        "relationships": ["string"]
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "tables": ["string"],
    "connectionString": "string",
    "apiKeys": {
      "anon": "string",
      "service": "string"
    }
  }
  ```

### 2. Authentication Setup Endpoint
- **Endpoint**: `/api/supabase/auth`
- **Method**: POST
- **Description**: Configures authentication methods for the project
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "authMethods": ["email", "google", "github"],
    "userFields": ["string"],
    "redirectUrls": ["string"]
  }
  ```
- **Response**:
  ```json
  {
    "success": "boolean",
    "authConfig": "object",
    "redirectUrls": ["string"]
  }
  ```

## GitHub Automation API

### 1. Repository Setup Endpoint
- **Endpoint**: `/api/github/setup`
- **Method**: POST
- **Description**: Creates and configures GitHub repository
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "repoName": "string",
    "description": "string",
    "isPrivate": "boolean",
    "gitIgnoreTemplate": "string"
  }
  ```
- **Response**:
  ```json
  {
    "repoUrl": "string",
    "defaultBranch": "string",
    "cloneUrl": "string",
    "webhookUrl": "string"
  }
  ```

### 2. CI/CD Configuration Endpoint
- **Endpoint**: `/api/github/cicd`
- **Method**: POST
- **Description**: Sets up GitHub Actions workflows
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "repoName": "string",
    "buildSteps": ["string"],
    "testCommands": ["string"],
    "deploymentTarget": "string"
  }
  ```
- **Response**:
  ```json
  {
    "workflowFiles": ["string"],
    "workflowUrls": ["string"],
    "status": "string"
  }
  ```

## Netlify Deployment API

### 1. Site Configuration Endpoint
- **Endpoint**: `/api/netlify/configure`
- **Method**: POST
- **Description**: Configures Netlify site settings
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "siteName": "string",
    "buildCommand": "string",
    "publishDirectory": "string",
    "environmentVariables": "object"
  }
  ```
- **Response**:
  ```json
  {
    "siteId": "string",
    "siteName": "string",
    "siteUrl": "string",
    "adminUrl": "string"
  }
  ```

### 2. Deployment Endpoint
- **Endpoint**: `/api/netlify/deploy`
- **Method**: POST
- **Description**: Triggers deployment to Netlify
- **Request Body**:
  ```json
  {
    "projectId": "string",
    "siteId": "string",
    "commitSha": "string",
    "deploymentMessage": "string"
  }
  ```
- **Response**:
  ```json
  {
    "deploymentId": "string",
    "deploymentUrl": "string",
    "status": "string",
    "logs": "string"
  }
  ```

## Dashboard & Monitoring API

### 1. Project Status Endpoint
- **Endpoint**: `/api/dashboard/status`
- **Method**: GET
- **Description**: Retrieves project status and metrics
- **Query Parameters**:
  - `projectId`: string
- **Response**:
  ```json
  {
    "projectId": "string",
    "status": "string",
    "lastUpdated": "string",
    "integrations": {
      "github": "object",
      "supabase": "object",
      "netlify": "object"
    },
    "metrics": {
      "performance": "object",
      "errors": "object",
      "deployments": "object"
    }
  }
  ```

### 2. Logs Endpoint
- **Endpoint**: `/api/dashboard/logs`
- **Method**: GET
- **Description**: Retrieves system logs
- **Query Parameters**:
  - `projectId`: string
  - `type`: string (error, info, warning)
  - `limit`: number
  - `offset`: number
- **Response**:
  ```json
  {
    "logs": [
      {
        "timestamp": "string",
        "type": "string",
        "message": "string",
        "source": "string",
        "details": "object"
      }
    ],
    "total": "number",
    "hasMore": "boolean"
  }
  ```
