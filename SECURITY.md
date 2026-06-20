# 🔒 Craftland Hub Security Measures

## API Security Implementation

### Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 10 per IP address per window
- **Headers**: Returns `X-RateLimit-Remaining` and `Retry-After` headers
- **Storage**: In-memory (resets on server restart)

### Authentication
- **API Key**: Required for all API requests
- **Header**: `X-API-Key`
- **Environment**: `INTERNAL_API_KEY` (server-side only)

### Request Validation
- **Size Limit**: 10KB maximum payload
- **Input Sanitization**: Map codes limited to 20 characters
- **Region Validation**: Only allowed regions accepted
- **Required Fields**: Comprehensive validation for all endpoints

### CORS Protection
- **Origins**: Restricted to your domain only
- **Methods**: POST and OPTIONS only
- **Headers**: Content-Type and X-API-Key allowed
- **Preflight**: Proper OPTIONS handling

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

## Firestore Security Rules

### Maps Collection
- **Read**: Public access for all users
- **Create**: Authenticated users only
- **Update**: Owner or admin only
- **Delete**: Admin only

### Users Collection
- **Read**: Public profile data, private for sensitive info
- **Write**: Users can only modify their own data

### Votes Collection
- **Read/Write**: Authenticated users only
- **Ownership**: Users can only modify their own votes

## Database Indexes

Optimized indexes for:
- Category + creation date
- Region + creation date
- Difficulty + creation date
- Net votes (descending)
- Vote score (descending)
- Views (descending)
- Creation date (descending)
- Map code + region (duplicate prevention)

## Environment Variables Required

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Security
INTERNAL_API_KEY=your-strong-random-secret
NEXT_PUBLIC_API_KEY=your-strong-random-secret
```

## Deployment Instructions

### 1. Enable Firestore API
Visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=YOUR_PROJECT_ID
- Click "Enable API"

### 2. Deploy Firestore Rules
```bash
firebase deploy --only firestore
```

### 3. Update Environment Variables
- Set production domain in CORS configuration
- Use strong, unique API keys
- Never commit secrets to version control

## Security Best Practices Implemented

✅ **No API Keys in Client Code**: All sensitive operations server-side only
✅ **Rate Limiting**: Prevents abuse and DoS attacks
✅ **Input Validation**: Prevents injection attacks
✅ **CORS Restrictions**: Prevents unauthorized cross-origin requests
✅ **Security Headers**: Protects against common web vulnerabilities
✅ **Firestore Rules**: Database-level access control
✅ **Request Size Limits**: Prevents buffer overflow attacks
✅ **Error Handling**: No sensitive information leaked in errors

## Monitoring & Maintenance

- Rate limiting logs IP addresses and timestamps
- API requests are logged for monitoring
- Firestore rules prevent unauthorized access
- Indexes ensure query performance
- Security headers protect against web attacks

## Future Enhancements

- [ ] Implement Redis for distributed rate limiting
- [ ] Add request logging to external service
- [ ] Implement API versioning
- [ ] Add request/response encryption
- [ ] Implement OAuth2 for enhanced authentication