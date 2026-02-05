# Organization Feature

Handles organization creation and dashboard management. Users must create an organization before they can create hackathons.

## Flow
1. User lands on `/organization` and sees the creation form (name, website, terms).
2. On submit, user is redirected to the Organization Dashboard.
3. Dashboard allows editing profile (name, logo, tagline, about), social links, and viewing team management / create hackathon actions.

## Components
- `OrganizationForm` — creation form (pure UI)
- `OrganizationDashboard` — dashboard with profile and social editing (pure UI)
- `useOrganization` — business logic hook managing step, profile state, and save
