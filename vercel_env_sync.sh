#!/bin/bash

# Vercel Environment Variable Sync Helper
# This script helps sync environment variables between local .env files and Vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed"
    print_info "Install it with: npm i -g vercel"
    exit 1
fi

print_success "Vercel CLI is installed"

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env-file FILE    Specify .env file to sync (default: .env)"
    echo "  -p, --project PROJECT  Specify Vercel project name"
    echo "  -t, --target ENV       Target environment (production|preview|development)"
    echo "  -l, --list             List current Vercel environment variables"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --list"
    echo "  $0 --env-file .env.production --target production"
    echo "  $0 --env-file .env --target preview"
}

# Function to list Vercel environment variables
list_env_vars() {
    print_info "Listing Vercel environment variables..."
    vercel env ls
}

# Function to sync environment variables
sync_env_vars() {
    local env_file=$1
    local target=$2
    
    if [ ! -f "$env_file" ]; then
        print_error "Environment file '$env_file' not found"
        exit 1
    fi
    
    print_info "Syncing environment variables from '$env_file' to Vercel ($target environment)..."
    
    # Read .env file and add each variable
    while IFS= read -r line || [ -n "$line" ]; do
        # Skip comments and empty lines
        if [[ "$line" =~ ^#.*$ ]] || [[ -z "$line" ]]; then
            continue
        fi
        
        # Extract variable name and value
        if [[ "$line" =~ ^([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
            var_name="${BASH_REMATCH[1]}"
            var_value="${BASH_REMATCH[2]}"
            
            # Remove quotes if present
            var_value=$(echo "$var_value" | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
            
            print_info "Adding $var_name to $target environment..."
            echo "$var_value" | vercel env add "$var_name" "$target" || print_warning "Failed to add $var_name (might already exist)"
        fi
    done < "$env_file"
    
    print_success "Environment sync complete!"
}

# Parse command line arguments
ENV_FILE=".env"
TARGET="development"
LIST_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        -t|--target)
            TARGET="$2"
            shift 2
            ;;
        -l|--list)
            LIST_ONLY=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Main logic
if [ "$LIST_ONLY" = true ]; then
    list_env_vars
else
    # Validate target environment
    if [[ ! "$TARGET" =~ ^(production|preview|development)$ ]]; then
        print_error "Invalid target environment: $TARGET"
        print_info "Valid values: production, preview, development"
        exit 1
    fi
    
    sync_env_vars "$ENV_FILE" "$TARGET"
fi
