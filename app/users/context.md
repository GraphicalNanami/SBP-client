# Users Directory Module

## Overview
The users directory displays all platform users in a searchable, filterable grid. Users can browse the community, search by name/username, filter by role, and navigate to individual profiles.

## Route
- `/users` - Main users directory page

## Features
- Search users by name or username (debounced)
- Filter by role (Organizers, Builders, Newcomers)
- Sort by newest, most active, experience level, alphabetical
- Paginated grid view (20 users per page default)
- Responsive 3/2/1 column layout

## Components
- `UserCard` - Individual user card in grid
- `SearchBar` - Search input with debounce
- `FilterBar` - Role filter chips
- `Pagination` - Number-based pagination
- `EmptyState` - No results state

## API Integration
- `GET /users/list?page&limit&search&role&sortBy&sortOrder`

## Related Routes
- `/user/{id}` - Individual user profile page
