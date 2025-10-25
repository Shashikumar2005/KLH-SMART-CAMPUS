#!/bin/bash

# Smart Campus KLH - Quick Deploy Script
# This script helps you deploy to various platforms

set -e

echo "🚀 Smart Campus KLH - Deployment Helper"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if git is clean
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes!"
    read -p "Do you want to commit them? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        read -p "Enter commit message: " commit_message
        git commit -m "$commit_message"
        print_success "Changes committed"
    fi
fi

# Push to GitHub
echo ""
echo "📤 Pushing to GitHub..."
git push origin main
print_success "Code pushed to GitHub"

# Deployment options
echo ""
echo "Choose deployment platform:"
echo "1) Render (Recommended - Free tier with WebSocket)"
echo "2) Vercel (Frontend) + Railway (Backend)"
echo "3) Docker Compose (Self-hosted)"
echo "4) Skip deployment"
echo ""
read -p "Select option (1-4): " option

case $option in
    1)
        echo ""
        echo "🎯 Deploying to Render..."
        echo ""
        echo "Next steps:"
        echo "1. Go to https://render.com"
        echo "2. Click 'New +' → 'Blueprint'"
        echo "3. Connect your GitHub repo"
        echo "4. Render will use render.yaml for configuration"
        echo "5. Add your environment variables in Render dashboard"
        echo ""
        print_success "render.yaml is already configured!"
        echo ""
        echo "📋 Don't forget to add these environment variables in Render:"
        echo "   - MONGODB_URI"
        echo "   - JWT_SECRET"
        echo "   - CLOUDINARY_* (optional)"
        echo "   - GEMINI_API_KEY (optional)"
        echo "   - EMAIL_* (optional)"
        echo "   - FRONTEND_URL (after frontend is deployed)"
        ;;
    2)
        echo ""
        echo "🎯 Deploying to Vercel + Railway..."
        echo ""
        echo "Backend (Railway):"
        echo "1. Go to https://railway.app"
        echo "2. New Project → Deploy from GitHub"
        echo "3. Select your repo and set root directory to 'backend'"
        echo "4. Add environment variables"
        echo "5. Generate domain and copy URL"
        echo ""
        echo "Frontend (Vercel):"
        echo "1. Go to https://vercel.com"
        echo "2. Import Project from GitHub"
        echo "3. Set root directory to 'frontend'"
        echo "4. Add VITE_API_URL and VITE_SOCKET_URL"
        echo "5. Deploy!"
        ;;
    3)
        echo ""
        echo "🐳 Deploying with Docker Compose..."
        echo ""
        read -p "Do you have Docker installed? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Building and starting containers..."
            docker-compose down
            docker-compose build
            docker-compose up -d
            print_success "Containers started!"
            echo ""
            echo "Access your application at:"
            echo "  Frontend: http://localhost:3000"
            echo "  Backend: http://localhost:5000"
            echo "  MongoDB: localhost:27017"
        else
            print_error "Please install Docker first: https://docs.docker.com/get-docker/"
        fi
        ;;
    4)
        print_warning "Deployment skipped"
        ;;
    *)
        print_error "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✨ Deployment process completed!"
echo ""
echo "📚 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
