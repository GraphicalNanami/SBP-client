# User Profile Module

## Overview
Individual public user profile page displaying comprehensive user information including bio, experience, skills, social links, and activity.

## Route
- `/user/{id}` - Public user profile (id can be uuid or username)

## Features
- Hero banner with gradient (deterministic color from user id)
- Profile information card overlay
- About section with bio
- Social links (GitHub, Twitter, LinkedIn, Website)
- Skills & Experience display
- Professional roles and skill level
- Programming languages and tools
- Tabbed navigation (Overview, Activity, Contributions, Achievements)
- Share profile functionality

## Components
- `ProfileHeader` - Hero banner with profile card overlay
- `ProfileAbout` - Bio section
- `ProfileExperience` - Skills and experience card
- `ProfileSocial` - Social links bar
- `ProfileTabs` - Tab navigation

## API Integration
- `GET /profiles/public/{identifier}` - Returns full user profile

## Related Routes
- `/users` - Users directory page
- `/user/{id}/edit` - Edit profile (authenticated, future)
