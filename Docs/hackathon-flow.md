# Feature Specification: Stellar Hackathon Platform

## Overview

This document outlines the core features for the Stellar Hackathon Platform MVP, covering user authentication, hackathon discovery, organization management, and hackathon creation workflows.

---

## 1. Authentication

### Login
- Email and password authentication
- Google OAuth login option
- "Forgot Password" flow with email reset

### Sign Up
- Email and password registration
- Google OAuth registration
- Email verification required

### User Profile
- Display name
- Profile picture
- Contact email

---

## 2. Hackathon Discovery

### Hackathons Listing Page
- Grid/list view of all public hackathons
- Search by hackathon name
- Filter by category, status (upcoming/ongoing/past), tags
- Sort by date, prize pool

### Page Actions
- "Create Hackathon" button at the top of the page
- Clicking redirects to Organization Creation if user has no organization

---

## 3. Organization Management

### Organization Creation Flow
User must create an organization before creating a hackathon.

**Required Fields:**
- Organization Name
- Website URL
- Agree to Stellar Terms & Conditions checkbox

**Post-Creation:**
- Redirect to Organization Dashboard

### Organization Dashboard

**Profile Section:**
- Organization Name
- Logo upload
- Tagline
- About (description)

**Social Links:**
- X (Twitter)
- Telegram
- GitHub
- Discord
- LinkedIn
- Website

**Team Management:**
- Invite team members by email
- Role assignment (Admin, Editor, Viewer)
- Remove team members

**Actions:**
- Create Hackathon button

---

## 4. Hackathon Creation & Management

Hackathon management is organized into tabs within the hackathon dashboard.

### Basic Details Tab
- Hackathon Name
- Category (DeFi, NFT, Gaming, Infrastructure, etc.)
- Visibility: Public / Private
- Poster image upload
- Prize Pool (amount + currency)
- Tags
- Start Time
- Pre-registration End Time
- Submission Deadline
- Venue (Online / Physical location)
- Submission Requirements (text description)
- Administrator Contact Details
- Custom Questions (for registration form)

### Tracks Tab
- Add/Edit/Delete tracks
- Track Name
- Track Description

### Details Tab
- Rich text editor for full hackathon details
- Rules, eligibility, resources, schedule

### Administrators Tab
- Invite collaborators by email
- Permission levels for editing hackathon details
- Remove administrator access

### Analytics Tab
- Total registrations
- Total submissions
- Page views
- Engagement metrics

### Registration Details Tab

**Hackers:**
- List of registered participants
- Export to CSV
- View individual registration details

**Projects:**
- List of submitted projects
- Project name, team, submission time
- View project details

### Judging & Results Tab

**Prize Setting:**
- Define prizes for the hackathon
- Assign prizes to specific tracks
- Add placements (1st Place, 2nd Place, etc.)
- Prize amount per placement

**Judges:**
- Add/invite judges by email
- Set judging deadline
- Assign judges to tracks

**Winner Assignment:**
- Select winners from submitted projects
- Assign to prize placements

**Prize Distribution:**
- Add payout account (managed by organization)
- Track distribution status
- Mark prizes as distributed

---

## User Flows Summary

1. **New User** → Sign Up → Browse Hackathons → Register for hackathon
2. **Organizer** → Login → Click "Create Hackathon" → Create Organization → Setup Org Profile → Create Hackathon → Manage Hackathon
3. **Returning Organizer** → Login → Org Dashboard → Create/Manage Hackathons

---

## Notes

- Anyone can view the listed hackathons but to participate/create hackathon user     must sign in 
- Before creating a hackathon, user must create an organization
- after submitting a hackathon only hackathons that are approved by admin are listed
- All features follow the architecture patterns defined in `architecture.md`
- UI follows the design system in `design.md`
- Backend API structure to be defined in a separate specification
