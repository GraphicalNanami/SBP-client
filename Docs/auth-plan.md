# Freighter Wallet Authentication Integration Plan

## Overview

This plan outlines the integration of Freighter wallet-based authentication as an alternative login and signup method alongside the existing email/password authentication. Users will be able to register and login using their Stellar wallet address through Freighter, with the same JWT-based session management flow.

---

## Current State Analysis

### Existing Authentication Flow
- **Method**: Email + Password
- **Registration**: User provides email, password, and name
- **Login**: User authenticates with email + password
- **Session Management**: JWT access tokens (15 min TTL) + opaque refresh tokens (7 days TTL, stored in Redis)
- **User Model**: Contains email (unique), password (hashed, select: false), name, avatar, role, and uuid

### Existing Wallet Infrastructure
- **Wallets Module**: Already exists with Freighter wallet management capabilities
- **Wallet Model**: Contains userId, address (unique), nickname, isPrimary, isVerified, lastUsedAt
- **Verification Flow**: Signature-based verification using Stellar SDK
- **Current Usage**: Wallets are linked to existing authenticated users (post-registration)

---

## Integration Goals

1. Enable users to register/signup using only their Freighter wallet address
2. Enable users to login using their wallet address via signature verification
3. Maintain consistency with existing JWT-based session management
4. Preserve backward compatibility with email/password authentication
5. Ensure proper user profile creation for wallet-based signups
6. Follow NestJS modular architecture and separation of concerns

---

## What Backend Expects from Frontend

### For Wallet Registration (Signup)

**Endpoint**: `POST /auth/wallet/register`

**Frontend Responsibilities**:
1. Connect to Freighter wallet and request user's public key
2. Request a challenge from backend via `POST /auth/wallet/challenge` endpoint
3. Sign the challenge message using Freighter's signMessage API
4. Submit the registration payload with signature

**Backend Expected Payload**:
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP",
  "signature": "base64_encoded_signature_string",
  "challenge": "unique_challenge_string_from_backend",
  "name": "John Doe"  // Optional: user's display name
}
```

**Validation Requirements**:
- `walletAddress`: Must be valid Stellar public key (56 characters, starts with 'G')
- `signature`: Must be valid base64 encoded signature
- `challenge`: Must exist in Redis and not be expired (5 minute TTL)
- `name`: Optional string, if not provided will default to "Stellar User" or first 8 characters of wallet address

---

### For Wallet Login

**Endpoint**: `POST /auth/wallet/login`

**Frontend Responsibilities**:
1. Connect to Freighter wallet and request user's public key
2. Request a challenge from backend via `POST /auth/wallet/challenge` endpoint
3. Sign the challenge message using Freighter's signMessage API
4. Submit the login payload with signature

**Backend Expected Payload**:
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP",
  "signature": "base64_encoded_signature_string",
  "challenge": "unique_challenge_string_from_backend"
}
```

**Validation Requirements**:
- `walletAddress`: Must be valid Stellar public key and must exist in Wallet collection
- `signature`: Must be valid signature created by the wallet
- `challenge`: Must exist in Redis and not be expired (5 minute TTL)

---

### For Challenge Generation

**Endpoint**: `POST /auth/wallet/challenge`

**Frontend Responsibilities**:
1. Request a challenge before attempting registration or login
2. Store the challenge temporarily for signing

**Backend Expected Payload**:
```json
{
  "walletAddress": "GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOP"
}
```

**Backend Response**:
```json
{
  "challenge": "Sign this message to authenticate: nonce_random_string_timestamp",
  "expiresAt": "2026-02-10T12:30:00.000Z"
}
```

---
