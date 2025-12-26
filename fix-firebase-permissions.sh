#!/bin/bash

# Fix Firebase Admin SDK Permissions
# This script grants the necessary IAM roles to your service account

PROJECT_ID="aww-alpha"
SERVICE_ACCOUNT="aww-scribe-sa@aww-alpha.iam.gserviceaccount.com"

echo "Granting Cloud Datastore User role to service account..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/datastore.user"

echo "Granting Firebase Admin SDK Administrator Service Agent role..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$SERVICE_ACCOUNT" \
  --role="roles/firebaseauth.admin"

echo "Done! Service account now has permissions to read/write Firestore."
echo ""
echo "If you still get permission errors, try restarting your Next.js dev server:"
echo "  npm run dev"
