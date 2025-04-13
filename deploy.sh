#!/bin/bash

# Production Deployment Script for AI Website Builder Platform
# This script automates the deployment process for the platform

# Exit on error
set -e

echo "Starting deployment process for AI Website Builder Platform..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
  echo "Error: .env.production file not found!"
  echo "Please create a .env.production file with the required environment variables."
  exit 1
fi

# Load environment variables
echo "Loading environment variables..."
export $(grep -v '^#' .env.production | xargs)

# Verify required environment variables
required_vars=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "GITHUB_CLIENT_ID"
  "GITHUB_CLIENT_SECRET"
  "GITHUB_ACCESS_TOKEN"
  "NETLIFY_CLIENT_ID"
  "NETLIFY_CLIENT_SECRET"
  "NETLIFY_ACCESS_TOKEN"
  "AI_API_KEY"
  "AI_API_URL"
  "NEXTAUTH_URL"
  "NEXTAUTH_SECRET"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "Error: Required environment variable $var is not set!"
    exit 1
  fi
done

echo "Environment variables verified."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests to verify build..."
npm test

# Build the application
echo "Building the application..."
npm run build

# Choose deployment method
echo "Select deployment method:"
echo "1. Netlify"
echo "2. Docker"
echo "3. Manual (build only)"
read -p "Enter your choice (1-3): " deployment_choice

case $deployment_choice in
  1)
    echo "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
      echo "Installing Netlify CLI..."
      npm install -g netlify-cli
    fi
    
    # Deploy to Netlify
    echo "Deploying to Netlify production..."
    netlify deploy --prod
    
    echo "Netlify deployment completed!"
    ;;
    
  2)
    echo "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
      echo "Error: Docker is not installed!"
      exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
      echo "Error: Docker Compose is not installed!"
      exit 1
    fi
    
    # Create necessary directories
    mkdir -p nginx/ssl
    
    # Generate self-signed SSL certificate for development
    # (In production, you would use a real certificate)
    echo "Generating self-signed SSL certificate for development..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout nginx/ssl/ai-website-builder.key \
      -out nginx/ssl/ai-website-builder.crt \
      -subj "/CN=ai-website-builder.com" \
      -addext "subjectAltName=DNS:ai-website-builder.com,DNS:www.ai-website-builder.com"
    
    # Build and start Docker containers
    echo "Building and starting Docker containers..."
    docker-compose up -d --build
    
    echo "Docker deployment completed! Application is running at https://localhost"
    ;;
    
  3)
    echo "Manual deployment selected."
    echo "The application has been built and is ready for deployment."
    echo "Build output is located in the .next directory."
    ;;
    
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo "Deployment process completed successfully!"
echo "Don't forget to verify the deployment using the post-deployment checklist in the deployment guide."
