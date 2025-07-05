# Frontend Deployment Guide

This guide explains how to deploy the Utopia Frontend to Google Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Make sure you have a Google Cloud account with billing enabled
2. **gcloud CLI**: Install the [Google Cloud CLI](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
4. **Project Setup**: Have your Google Cloud project ID ready

## Configuration

### Backend Connection

The frontend is configured to connect to your backend at:

```
https://utopia-backend-218476677732.us-central1.run.app/api
```

If you need to change this URL, update it in `next.config.js`:

```javascript
env: {
  NEXT_PUBLIC_API_URL: "https://your-backend-url.com/api",
}
```

## Deployment Options

### Option 1: Automated Deployment (GitHub Actions)

1. **Set up GitHub Secrets**:

   - `GCP_PROJECT_ID`: Your Google Cloud project ID
   - `GCP_SA_KEY`: Service account key JSON (base64 encoded)

2. **Create Service Account**:

   ```bash
   # Create service account
   gcloud iam service-accounts create utopia-frontend-deployer \
     --display-name="Utopia Frontend Deployer"

   # Grant necessary permissions
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:utopia-frontend-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/run.admin"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:utopia-frontend-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/storage.admin"

   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:utopia-frontend-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/iam.serviceAccountUser"

   # Create and download key
   gcloud iam service-accounts keys create key.json \
     --iam-account=utopia-frontend-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

3. **Push to GitHub**:
   The workflow will automatically trigger on pushes to the `main` branch.

### Option 2: Manual Deployment

1. **Set Environment Variable**:

   ```bash
   export GCP_PROJECT_ID="your-project-id"
   ```

2. **Authenticate with Google Cloud**:

   ```bash
   gcloud auth login
   gcloud config set project $GCP_PROJECT_ID
   ```

3. **Run Deployment Script**:
   ```bash
   ./deploy.sh
   ```

### Option 3: Step-by-Step Manual Deployment

1. **Build the Docker image**:

   ```bash
   docker build -t gcr.io/YOUR_PROJECT_ID/utopia-frontend:latest .
   ```

2. **Push to Container Registry**:

   ```bash
   gcloud auth configure-docker
   docker push gcr.io/YOUR_PROJECT_ID/utopia-frontend:latest
   ```

3. **Deploy to Cloud Run**:
   ```bash
   gcloud run deploy utopia-frontend \
     --image gcr.io/YOUR_PROJECT_ID/utopia-frontend:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 3000 \
     --memory 512Mi \
     --cpu 1 \
     --min-instances 0 \
     --max-instances 10 \
     --set-env-vars="NEXT_PUBLIC_API_URL=https://utopia-backend-218476677732.us-central1.run.app/api"
   ```

## Local Development

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Run development server**:

   ```bash
   pnpm dev
   ```

3. **Build for production**:

   ```bash
   pnpm build
   ```

4. **Test production build locally**:
   ```bash
   pnpm start
   ```

## Environment Variables

The following environment variables are used:

- `NEXT_PUBLIC_API_URL`: Backend API URL (set in next.config.js)
- `NODE_ENV`: Environment (development/production)
- `PORT`: Port for the server (default: 3000)

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are installed with `pnpm install`
2. **Docker Build Fails**: Ensure Docker is running and you have enough disk space
3. **Deployment Fails**: Check that your Google Cloud project has the required APIs enabled
4. **CORS Issues**: Ensure your backend allows requests from your frontend domain

### Checking Logs

```bash
# View Cloud Run service logs
gcloud run services logs read utopia-frontend --region us-central1

# View build logs
gcloud builds list --limit 10
```

### Updating the Deployment

To update the deployment:

1. Make your changes
2. Run the deployment script again or push to GitHub
3. The new version will be automatically deployed

## Performance Optimization

The Docker image is optimized for production with:

- Multi-stage builds to reduce image size
- Standalone Next.js output for faster cold starts
- Proper caching layers
- Security best practices

## Security

The application includes:

- Security headers (CSP, HSTS, etc.)
- Content type protection
- Frame protection
- HTTPS enforcement

## Monitoring

You can monitor your application through:

- Google Cloud Console
- Cloud Run metrics
- Application logs
- Error reporting

## Support

If you encounter issues, check:

1. Google Cloud logs
2. Docker build logs
3. Next.js build output
4. Network connectivity to backend
