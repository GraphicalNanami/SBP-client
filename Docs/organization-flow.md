# Organization Flow Specification

## Overview

This document defines the organization management flow for the Stellar Hackathon Platform. Users must create and configure an organization before they can create hackathons.

---

## 1. Organization Creation

When a user clicks "Create Hackathon" without an existing organization, they are redirected to the Organization Creation flow.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| Organization Name | Text | Unique name for the organization |
| Website URL | URL | Official website of the organization |
| Terms Agreement | Checkbox | Must agree to Stellar Terms & Conditions |

### Flow
1. User clicks "Create Hackathon"
2. System checks if user has an organization
3. If no organization exists → redirect to Organization Creation
4. User fills required fields and agrees to terms
5. On submit → Organization is created
6. Redirect to Organization Dashboard

---

## 2. Organization Dashboard

After organization creation, users land on the Organization Dashboard. This serves as the central hub for managing the organization and its hackathons.

### 2.1 Profile Section

| Field | Type | Required |
|-------|------|----------|
| Organization Name | Text | Yes |
| Logo | Image Upload | No |
| Tagline | Text (short) | No |
| About | Text (long) | No |

### 2.2 Social Links

| Platform | Field Type |
|----------|------------|
| X (Twitter) | URL |
| Telegram | URL |
| GitHub | URL |
| Discord | URL |
| LinkedIn | URL |
| Website | URL |

### 2.3 Team Management

| Action | Description |
|--------|-------------|
| Invite Member | Send invitation via email |
| Assign Role | Admin, Editor, Viewer |
| Remove Member | Revoke access from organization |

**Role Permissions:**
- **Admin**: Full access, can manage team and hackathons
- **Editor**: Can create and edit hackathons
- **Viewer**: Read-only access to dashboard and analytics

### 2.4 Dashboard Actions

- View list of organization's hackathons
- Create new hackathon
- Access hackathon management for existing hackathons

---

## 3. Hackathon Creation

Accessible from Organization Dashboard via "Create Hackathon" button.



## State Transitions

### Organization States
- **Active**: Organization is live and can create hackathons
- **Suspended**: Temporarily disabled by admin

---

## Validation Rules

1. Organization name must be unique across platform
2. Website URL must be valid format
3. Terms agreement is mandatory for organization creation
4. Hackathon requires minimum: name, category, start time, deadline, venue, admin contact
5. At least one track must be defined before publishing
6. Hackathons require admin approval before being listed publicly

---

## Notes

- All hackathons created under an organization are subject to platform review
- Only approved hackathons appear in public listings
- Organization admins retain full control over their hackathons
- Prize distribution is managed at organization level
