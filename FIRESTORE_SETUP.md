# Firestore Setup Instructions

## Required Composite Indexes

The application requires the following composite indexes to function properly. These need to be created in the Firebase Console.

### Method 1: Automatic (Recommended)

Click the links below and Firebase will auto-generate the indexes:

1. **Medications Index**: [Create medications index](https://console.firebase.google.com/v1/r/project/aww-alpha/firestore/indexes?create_composite=Ck1wcm9qZWN0cy9hd3ctYWxwaGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL21lZGljYXRpb25zL2luZGV4ZXMvXxABGg0KCXBhdGllbnRJZBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI)

2. **Lab Results Index**: [Create labResults index](https://console.firebase.google.com/v1/r/project/aww-alpha/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9hd3ctYWxwaGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2xhYlJlc3VsdHMvaW5kZXhlcy9fEAEaDQoJcGF0aWVudElkEAEaDQoJb3JkZXJEYXRlEAIaDAoIX19uYW1lX18QAg)

3. **Invoices Index**: [Create invoices index](https://console.firebase.google.com/v1/r/project/aww-alpha/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9hd3ctYWxwaGEvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2ludm9pY2VzL2luZGV4ZXMvXxABGg0KCXBhdGllbnRJZBABGggKBGRhdGUQAhoMCghfX25hbWVfXxAC)

### Method 2: Manual Setup

Or manually create them in the [Firebase Console](https://console.firebase.google.com/project/aww-alpha/firestore/indexes):

#### medications Collection
- **Collection ID**: `medications`
- **Fields to index**:
  1. `patientId` - Ascending
  2. `createdAt` - Descending

#### labResults Collection
- **Collection ID**: `labResults`
- **Fields to index**:
  1. `patientId` - Ascending
  2. `orderDate` - Descending

#### invoices Collection
- **Collection ID**: `invoices`
- **Fields to index**:
  1. `patientId` - Ascending
  2. `date` - Descending

### Method 3: Firebase CLI

```bash
firebase deploy --only firestore:indexes
```

Note: This requires the Firebase CLI to be properly installed and configured.

## After Creating Indexes

The indexes will take a few minutes to build. You can monitor their status in the Firebase Console under Firestore > Indexes.

Once built, refresh your application and the errors should disappear.
