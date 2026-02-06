# Hackathon Flow Specification

## Overview

This document defines the hackathon listing and hackathon management dashboard flows for the Stellar Hackathon Platform. It covers how users discover hackathons, how organizers create them from the Organization Dashboard, and the full tab-by-tab management experience.

---

## 1. Hackathon Discovery (Listings Page)

The public-facing hackathon listings page is accessible to all users (signed in or not). It serves as the primary entry point for discovering hackathons on the platform.

### 1.1 Page Layout

- **Header area**: Page title, search bar, and a prominent "Host a Hackathon" button (visible to signed-in users only)
- **Filter bar**: Category, status, and tag filters
- **Hackathon grid/list**: Cards displaying hackathon summaries
- **Pagination / infinite scroll**: For large result sets

### 1.2 Hackathon Card

Each hackathon card displays:

| Field | Description |
|-------|-------------|
| Poster | Hackathon cover image |
| Name | Hackathon title |
| Category | Soroban Smart Contracts, Payments & Remittances, DeFi on Stellar, Developer Tooling, etc. |
| Status Badge | Upcoming / Ongoing / Ended |
| Prize Pool | Total prize amount and currency |
| Dates | Start date â†’ Submission deadline |
| Tags | Relevant topic tags |
| Venue | Online or physical location |

Clicking a card navigates to the hackathon's public detail page.

### 1.3 Search & Filtering

| Filter | Type | Options |
|--------|------|---------|
| Search | Text input | Matches hackathon name |
| Category | Multi-select | Soroban Smart Contracts, Payments & Remittances, Anchors & On/Off Ramps, DeFi on Stellar, Real World Assets, Cross-border Payments, Developer Tooling, Wallets & Identity, Other |
| Status | Single-select | Upcoming, Ongoing, Past, All |
| Tags | Multi-select | Dynamic list from existing hackathon tags |
| Sort | Dropdown | Newest first, Prize pool (highâ†’low), Start date (soonest), Deadline (soonest) |

### 1.4 "Host a Hackathon" Button Flow

1. User clicks "Host a Hackathon"
2. If the user has no organization â†’ redirected to Organization Creation (see `organization-flow.md`)
3. If the user has one organization â†’ redirected to Hackathon Creation under that org
4. If the user has multiple organizations â†’ a selector appears to choose which org to create under
5. â†’ Navigates to the Hackathon Dashboard in creation mode

---

## 2. Hackathon Creation

Hackathon creation is initiated from the Organization Dashboard ("Host a Hackathon" button) or from the listings page. The flow opens the Hackathon Dashboard in a new/draft state.

### 2.1 Initial State

- A new hackathon record is created in **Draft** status
- The hackathon is associated with the selected organization
- The user is automatically assigned as an Administrator
- No fields are pre-filled; all tabs are accessible immediately

---

## 3. Hackathon Dashboard

The Hackathon Dashboard is a management interface used for both creating and managing hackathons. It uses a sidebar navigation with seven main sections, each covering a specific aspect of hackathon configuration.

### Navigation Layout

- **Tab bar** at the top of the page with the seven section tabs
- A **status indicator** showing the current hackathon state (Draft, Under Review, Active, Ended, Cancelled)
- **Publish / Submit for Review** button (top right) â€” only enabled when all required fields are filled
- **Back to Organization** link to return to the org dashboard

---

### 3.1 General Section

The foundational configuration for the hackathon.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Hackathon Name | Text | Yes | Display name for the hackathon |
| Category | Select | Yes | Primary category (Soroban Smart Contracts, Payments & Remittances, Anchors & On/Off Ramps, DeFi on Stellar, Real World Assets, Cross-border Payments, Developer Tooling, Wallets & Identity, Other) |
| Visibility | Toggle | Yes | Public (listed) or Private (invite-only, unlisted) |
| Poster | Image Upload | No | Cover image displayed on the listings card and detail page |
| Prize Pool | Number + Asset | Yes | Total prize amount and the Stellar asset (XLM, USDC on Stellar, or custom Stellar asset code) |
| Tags | Multi-select / Freeform | No | Topic tags for discoverability |
| Start Time | DateTime picker | Yes | When the hackathon officially begins |
| Pre-registration End Time | DateTime picker | No | Cutoff for early/pre-registrations |
| Submission Deadline | DateTime picker | Yes | Final deadline for project submissions |
| Venue | Select + Text | Yes | "Online" or a physical location (address / city) |
| Submission Requirements | Textarea + Checklist | No | What builders must include: repo link, demo video, write-up. Optional Stellar-specific: Soroban contract ID (testnet/mainnet), Stellar public key, Horizon API usage, live deployment URL |
| Administrator Contact | Email / URL | Yes | Contact details displayed to participants for support |
| Custom Questions | Dynamic list | No | Additional questions added to the registration form (text, select, checkbox types) |

**Validation rules:**
- Start Time must be in the future
- Submission Deadline must be after Start Time
- Pre-registration End Time (if set) must be before Start Time
- Prize Pool must be a positive number
- At least name, category, start time, deadline, venue, and admin contact are required before publishing

---

### 3.2 Tracks Section

Tracks allow organizers to define thematic categories within the hackathon. Participants choose a track when submitting.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Track Name | Text | Yes | Name of the track (e.g. "Best Soroban dApp", "Cross-border Payments", "Stellar Anchor Innovation") |
| Track Description | Textarea | Yes | What this track is about, judging criteria hints |

**Actions:**
- Add Track â€” appends a new empty track form
- Edit Track â€” inline editing of name and description
- Delete Track â€” removes the track (confirmation required)
- Reorder Tracks â€” drag-and-drop to set display order

**Validation:**
- At least one track must be defined before the hackathon can be published
- Track names must be unique within the hackathon

---

### 3.3 Description Section

A rich-text content area for the full hackathon description visible on the public detail page.

**Sections the organizer should fill:**
- Overview / About the hackathon
- Rules and eligibility
- Resources and documentation links
- Stellar ecosystem resources (links to Soroban docs, Stellar Laboratory, Horizon API reference, Freighter wallet)
- Schedule and milestones
- Prizes breakdown by track
- FAQs

**Editor features:**
- Rich text formatting (headings, bold, italic, lists, links, images)
- Markdown support (optional)
- Preview mode to see how it renders publicly

---

### 3.4 Team & Access Section

Manage who has access to edit and manage the hackathon.

| Field | Type | Description |
|-------|------|-------------|
| Email | Email input | Invite collaborators by email address |
| Permission Level | Select | Full Access (edit all tabs) or Limited Access (edit specific tabs only) |

**Actions:**
- Invite Administrator â€” sends an email invitation
- Change Permissions â€” update an existing admin's access level
- Remove Administrator â€” revoke access (confirmation required)

**Rules:**
- The hackathon creator (organization admin) cannot be removed
- At least one administrator must exist at all times
- Administrators must belong to the parent organization or be explicitly invited

---

### 3.5 Insights Section

A read-only reporting dashboard showing engagement and participation metrics.

| Metric | Description |
|--------|-------------|
| Total Registrations | Number of participants who registered |
| Total Submissions | Number of projects submitted |
| Page Views | Public detail page visit count |
| Unique Visitors | Deduplicated visitor count |
| Registration Conversion | Views â†’ Registrations percentage |
| Submission Rate | Registrations â†’ Submissions percentage |
| Traffic Sources | Where visitors are coming from (direct, social, referral) |
| Daily Trend | Time-series chart of registrations and views over time |

**Available after hackathon is published.** Analytics for draft hackathons show empty/zero states.

---

### 3.6 Participants & Submissions Section

View and manage participant registrations and project submissions.

#### 3.6.1 Builders (Registered Participants)

| Column | Description |
|--------|-------------|
| Name | Participant display name |
| Email | Contact email |
| Registration Date | When they signed up |
| Track | Selected track (if applicable) |
| Custom Answers | Responses to custom registration questions |
| Status | Registered / Withdrawn |

**Actions:**
- Search / filter participants
- Export to CSV
- View individual registration details (full profile + custom answers)

#### 3.6.2 Projects (Submitted Work)

| Column | Description |
|--------|-------------|
| Project Name | Title of the submitted project |
| Team | Team name and member list |
| Track | Track the project is submitted under |
| Submission Time | When the project was submitted |
| Status | Submitted / Under Review / Judged |

**Actions:**
- Search / filter projects
- View project details (description, repo link, demo, attachments)
- Export project list to CSV

---

### 3.7 Winners & Prizes Section

End-to-end judging, winner selection, and prize distribution workflow.

#### 3.7.1 Prize Setting

Define the prize structure for the hackathon.

| Field | Type | Description |
|-------|------|-------------|
| Prize Name | Text | e.g. "Grand Prize", "Best DeFi Project" |
| Track Assignment | Select | Which track this prize belongs to (or "Overall") |
| Placements | List | Ordered placements under this prize (1st, 2nd, 3rd, etc.) |
| Amount per Placement | Number + Currency | Prize amount for each placement |

**Actions:**
- Add Prize â€” create a new prize category
- Add Placement â€” add a placement tier under a prize
- Edit / Delete prizes and placements

**Validation:**
- Total placement amounts across all prizes should not exceed the hackathon's declared prize pool
- Each prize must have at least one placement

#### 3.7.2 Judges

| Field | Type | Description |
|-------|------|-------------|
| Judge Email | Email | Invite judges by email |
| Assigned Tracks | Multi-select | Which tracks this judge evaluates |
| Judging Deadline | DateTime | When judging must be completed |

**Actions:**
- Add / Invite Judge â€” sends an invitation email
- Assign Tracks â€” specify which tracks the judge reviews
- Set Deadline â€” global or per-judge deadline
- Remove Judge â€” revoke judging access

**Rules:**
- Each track should have at least one judge assigned
- Judging deadline must be after the submission deadline

#### 3.7.3 Winner Assignment

After judging is complete, organizers assign winners.

**Flow:**
1. For each prize â†’ select a submitted project for each placement
2. Projects are shown in a searchable/filterable list scoped to the prize's track
3. A project can win multiple prizes (e.g. "Grand Prize" + "Best DeFi")
4. Confirm winner assignments â†’ winners are locked and visible on the public results page

**Display:**
- Prize name â†’ Placement â†’ Winning project + team
- Status badge: Pending / Assigned / Published

#### 3.7.4 Prize Distribution

Manage the payout of prizes to winners.

| Field | Type | Description |
|-------|------|-------------|
| Payout Account | Select / Add | Organization's payout account (bank, crypto wallet, etc.) |
| Distribution Status | Per-placement | Not Started / Processing / Completed |
| Transaction Reference | Text | Payment reference or transaction hash |

**Actions:**
- Add Payout Account â€” link an organization-managed payout method
- Mark as Distributed â€” update individual placement payout status
- Bulk distribute â€” mark multiple placements as paid

**Rules:**
- Payout accounts are managed at the organization level (not per-hackathon)
- Only organization Admins can manage payout accounts
- Distribution tracking is informational (actual payment happens outside the platform unless integrated)

---

## 4. Hackathon States

| State | Description | Transitions To |
|-------|-------------|---------------|
| Draft | Initial state, hackathon is being configured | Under Review |
| Under Review | Submitted for platform admin approval | Active, Rejected |
| Rejected | Platform admin rejected the hackathon | Draft (can re-edit and resubmit) |
| Active | Approved and publicly listed (if public) | Ended, Cancelled |
| Ended | Submission deadline has passed | â€” (terminal, results phase begins) |
| Cancelled | Organizer or platform admin cancelled the hackathon | â€” (terminal) |

**Transition rules:**
- Draft â†’ Under Review: Requires all mandatory fields filled + at least one track
- Under Review â†’ Active: Platform admin approves
- Under Review â†’ Rejected: Platform admin rejects (reason provided)
- Rejected â†’ Draft: Organizer edits and can resubmit
- Active â†’ Ended: Automatic when submission deadline passes
- Active â†’ Cancelled: Manual action by organizer or platform admin
- Ended state enables the Judging & Results workflow

---

## 5. Public Hackathon Detail Page

When a user clicks on a hackathon card from the listings, they see the public detail page.

### Layout

| Section | Content |
|---------|---------|
| Hero | Poster image, hackathon name, organization name, status badge |
| Key Info Bar | Prize pool, dates, venue, category, tags |
| Action Button | "Join Hackathon" (if upcoming/ongoing) or "View Winners" (if ended) |
| Details | Full rich-text content from the Description section |
| Tracks | List of tracks with descriptions |
| Prizes | Prize breakdown by track and placement |
| Schedule | Timeline of key dates |
| Organizer | Organization name, logo, and link to org profile |
| Build Resources | Links to Soroban docs, Stellar Laboratory, Horizon API, Freighter wallet, and starter templates |

---

## 6. Validation Summary

| Rule | Applies To |
|------|-----------|
| Hackathon name is required | Overview |
| Category is required | Overview |
| Start time must be in the future | Overview |
| Submission deadline must be after start time | Overview |
| Pre-reg end time must be before start time | Overview |
| Prize pool must be positive | Overview |
| Venue is required | Overview |
| Admin contact is required | Overview |
| At least one track before publishing | Tracks |
| Track names must be unique within hackathon | Tracks |
| Prize total should not exceed declared pool | Winners & Prizes |
| Each prize needs at least one placement | Winners & Prizes |
| Each track needs at least one judge | Winners & Prizes |
| Judging deadline must be after submission deadline | Winners & Prizes |
| All mandatory fields must be filled before submitting for review | Publish |

---

## 7. Notes

- Only approved hackathons appear in public listings
- Private hackathons are accessible via direct link only
- All hackathons are tied to an organization; no orphan hackathons exist
- Analytics data begins accumulating once the hackathon is published (Active state)
- Prize distribution is tracked at the organization level; payout accounts are shared across all hackathons under that org
- The Hackathon Dashboard is the same interface for both creation and ongoing management â€” all sections remain accessible throughout the hackathon lifecycle
- Platform admin review is required before any hackathon goes public
- Hackathons on the platform are focused on the Stellar ecosystem; projects should demonstrate meaningful use of Stellar or Soroban
- Platform may integrate with the Stellar Community Fund (SCF) for co-sponsored hackathons in the future
