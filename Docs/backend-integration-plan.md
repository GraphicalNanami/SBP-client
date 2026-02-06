# Backend Integration Plan: Organization Module

**Date:** 2026-02-06
**Status:** Ready for Implementation
**Frontend:** Fully Built (UI + State Management)
**Backend:** Spec Complete, Implementation Pending

---

## Executive Summary

The frontend organization module is **100% complete** with all UI components, state management, and business logic. However, it currently uses **mock data** with no backend persistence. This plan outlines the integration strategy to connect the existing frontend to the backend API.

**Key Finding:** Frontend and backend specifications are **highly aligned** with only minor adjustments needed.

---

## 1. Current State Assessment

### Frontend Status ✅

| Component | Status | Location |
|-----------|--------|----------|
| Organization Creation Form | ✅ Complete | `src/features/organization/components/organizationUI/OrganizationForm.tsx` |
| Organization Dashboard | ✅ Complete | `src/features/organization/components/organizationUI/OrganizationDashboard.tsx` |
| State Management Hook | ✅ Complete | `src/features/organization/components/organizationService/useOrganization.ts` |
| TypeScript Types | ✅ Complete | `src/features/organization/types/organization.types.ts` |
| Multi-Org Support | ✅ Complete | Organization switcher in dashboard |
| Team Management UI | ✅ Complete | Invite/remove/role update UI |

### Backend Status ⏳

| Component | Status | Notes |
|-----------|--------|-------|
| API Specification | ✅ Complete | Comprehensive endpoint definitions |
| Schemas | 🔨 Pending | Organization + OrganizationMember |
| Controllers | 🔨 Pending | Organizations + Members |
| Services | 🔨 Pending | Business logic layer |
| DTOs | 🔨 Pending | Validation objects |
| Guards | 🔨 Pending | RBAC enforcement |
| Tests | 🔨 Pending | Unit + E2E tests |

---

## 2. API Endpoint Mapping

### 2.1 Organization CRUD Operations

| Frontend Action | Backend Endpoint | Method | Auth | Frontend Handler |
|----------------|------------------|--------|------|------------------|
| Create Organization | `/organizations` | POST | Bearer | `handleCreate()` |
| Get User's Organizations | `/organizations/me` | GET | Bearer | Initial load on mount |
| Get Organization Details | `/organizations/:id` | GET | Bearer | `handleSwitchOrg()` |
| Update Profile | `/organizations/:id/profile` | PATCH | Bearer + ADMIN | `handleProfileChange()` |
| Update Social Links | `/organizations/:id/social-links` | PATCH | Bearer + ADMIN | `handleSocialChange()` |

### 2.2 Team Management Operations

| Frontend Action | Backend Endpoint | Method | Auth | Frontend Handler |
|----------------|------------------|--------|------|------------------|
| List Members | `/organizations/:id/members` | GET | Bearer | Initial load when viewing org |
| Invite Member | `/organizations/:id/members/invite` | POST | Bearer + ADMIN | `handleAddMember()` |
| Update Member Role | `/organizations/:id/members/:memberId/role` | PATCH | Bearer + ADMIN | `handleUpdateMemberRole()` |
| Remove Member | `/organizations/:id/members/:memberId` | DELETE | Bearer + ADMIN | `handleRemoveMember()` |

### 2.3 Future Endpoints (Not Yet Needed)

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `GET /organizations/:id/hackathons` | List org's hackathons | P1 - Next sprint |
| `POST /hackathons` | Create hackathon | P1 - Next sprint |

---

## 3. Data Model Alignment

### 3.1 Organization Creation

**Frontend Type:**
```typescript
interface OrganizationCreatePayload {
  name: string;
  website: string;
  termsAccepted: boolean;
}
```

**Backend DTO:**
```typescript
interface CreateOrganizationDto {
  name: string;          // 3-100 chars, required
  website: string;       // Valid URL, required
  agreeToTerms: boolean; // Must be true, required
}
```

**✅ Alignment:** Perfect match (just rename `termsAccepted` → `agreeToTerms` in frontend)

---

### 3.2 Organization Profile

**Frontend Type:**
```typescript
interface OrganizationProfile {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  about: string;
  website: string;
  socialLinks: SocialLinks;
  teamMembers: TeamMember[];
}
```

**Backend Schema:**
```typescript
interface Organization {
  _id: ObjectId;           // → id (string)
  name: string;
  slug: string;            // Missing in frontend ⚠️
  website: string;
  logo?: string;
  tagline?: string;
  about?: string;
  socialLinks?: SocialLinks;
  termsAcceptedAt: Date;   // Missing in frontend (not needed)
  termsVersion: string;    // Missing in frontend (not needed)
  status: 'ACTIVE' | 'SUSPENDED';  // Missing in frontend ⚠️
  createdBy: ObjectId;     // Missing in frontend (not needed)
  createdAt: Date;         // Missing in frontend
  updatedAt: Date;         // Missing in frontend
}
```

**⚠️ Adjustments Needed:**
- Add `slug: string` to frontend type (for URL-friendly routes)
- Add `status: 'ACTIVE' | 'SUSPENDED'` to frontend type (for UI state)
- Add `createdAt: string` (ISO date) for displaying org age
- Backend should return `id` as string (converted from `_id`)
- Frontend doesn't need `termsAcceptedAt`, `termsVersion`, `createdBy`

---

### 3.3 Social Links

**Frontend & Backend:**
```typescript
interface SocialLinks {
  x: string;            // Backend calls it "twitter" ⚠️
  telegram: string;
  github: string;
  discord: string;
  linkedin: string;
  website: string;      // ⚠️ Duplicate - already in Organization
}
```

**⚠️ Adjustments Needed:**
1. **Backend:** Rename `twitter` → `x` (or accept both)
2. **Frontend:** Remove `website` from socialLinks (use top-level `website` instead)
3. All fields should be optional (`?:` or nullable)

---

### 3.4 Team Members

**Frontend Type:**
```typescript
interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  avatarUrl?: string;
  joinedAt: string;
}
```

**Backend Schema:**
```typescript
interface OrganizationMember {
  _id: ObjectId;           // → id (string)
  organizationId: ObjectId; // Not needed in response
  userId: ObjectId;        // → populate user details
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';  // ⚠️ Case mismatch
  invitedBy: ObjectId;     // Could add to frontend for "Invited by X"
  invitedAt: Date;         // Could add to frontend
  joinedAt?: Date;         // ✅ Matches
  status: 'PENDING' | 'ACTIVE' | 'REMOVED';  // Missing in frontend ⚠️
  createdAt: Date;
  updatedAt: Date;
}
```

**⚠️ Adjustments Needed:**
1. **Role Case:** Backend uses `ADMIN`, frontend uses `Admin`
   - **Solution:** Backend should return roles in PascalCase for UI consistency
   - Or frontend converts on receive
2. **Add `status` field** to frontend type for handling pending invitations
3. **Populate User Details:** Backend should join User collection to get `name`, `email`, `avatarUrl`
4. **Optional:** Add `invitedBy` user info for displaying "Invited by John Doe"

---

## 4. Implementation Steps

### Phase 1: Frontend Preparation (Days 1-2)

#### 4.1 Create API Service Layer

**File:** `src/services/api/organizationApi.ts`

```typescript
// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API client with auth token injection
class OrganizationApi {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token'); // Or from auth context
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Create organization
  async createOrganization(payload: OrganizationCreatePayload): Promise<OrganizationResponse> {
    const response = await fetch(`${API_BASE_URL}/organizations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name: payload.name,
        website: payload.website,
        agreeToTerms: payload.termsAccepted, // Rename
      }),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Get user's organizations
  async getUserOrganizations(): Promise<UserOrganizationsResponse[]> {
    const response = await fetch(`${API_BASE_URL}/organizations/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Get organization details
  async getOrganization(orgId: string): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Update organization profile
  async updateProfile(orgId: string, updates: Partial<OrganizationProfile>): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/profile`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        logo: updates.logo,
        tagline: updates.tagline,
        about: updates.about,
      }),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Update social links
  async updateSocialLinks(orgId: string, socialLinks: SocialLinks): Promise<Organization> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/social-links`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        twitter: socialLinks.x, // Map x → twitter for backend
        telegram: socialLinks.telegram,
        github: socialLinks.github,
        discord: socialLinks.discord,
        linkedin: socialLinks.linkedin,
      }),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Invite team member
  async inviteMember(orgId: string, email: string, role: TeamMemberRole): Promise<TeamMemberResponse> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/invite`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email,
        role: role.toUpperCase(), // Convert Admin → ADMIN
      }),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Update member role
  async updateMemberRole(orgId: string, memberId: string, role: TeamMemberRole): Promise<TeamMemberResponse> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${memberId}/role`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({
        role: role.toUpperCase(),
      }),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }

  // Remove member
  async removeMember(orgId: string, memberId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members/${memberId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new ApiError(response);
  }

  // Get organization members
  async getMembers(orgId: string, status?: 'PENDING' | 'ACTIVE' | 'REMOVED'): Promise<TeamMember[]> {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${API_BASE_URL}/organizations/${orgId}/members${params}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) throw new ApiError(response);
    return response.json();
  }
}

// Error handling class
class ApiError extends Error {
  status: number;
  data: any;

  constructor(response: Response) {
    super(`API Error: ${response.status} ${response.statusText}`);
    this.status = response.status;
    this.name = 'ApiError';
  }
}

export const organizationApi = new OrganizationApi();
```

**Tasks:**
- [ ] Create `src/services/api/` directory
- [ ] Implement `organizationApi.ts` with all methods
- [ ] Add error handling class
- [ ] Add TypeScript response types

---

#### 4.2 Update TypeScript Types

**File:** `src/features/organization/types/organization.types.ts`

**Changes needed:**
```typescript
// Add missing fields
export interface OrganizationProfile {
  id: string;
  name: string;
  slug: string;                  // ✨ NEW
  logo: string;
  tagline: string;
  about: string;
  website: string;
  status: 'ACTIVE' | 'SUSPENDED'; // ✨ NEW
  socialLinks: SocialLinks;
  teamMembers: TeamMember[];
  createdAt: string;             // ✨ NEW (ISO date string)
}

// Fix social links
export interface SocialLinks {
  x: string;                     // Changed from "twitter"
  telegram: string;
  github: string;
  discord: string;
  linkedin: string;
  // Removed duplicate "website"
}

// Add member status
export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Pending' | 'Active' | 'Removed';  // ✨ NEW
  avatarUrl?: string;
  joinedAt: string;              // ISO date string
  invitedAt?: string;            // ✨ NEW (optional)
  invitedBy?: {                  // ✨ NEW (optional)
    id: string;
    name: string;
  };
}

// Backend response types (NEW)
export interface OrganizationResponse {
  organization: OrganizationProfile;
  membership: {
    id: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'Active';
    joinedAt: string;
  };
}

export interface UserOrganizationsResponse {
  organization: {
    _id: string;
    name: string;
    slug: string;
    logo?: string;
    status: 'ACTIVE' | 'SUSPENDED';
  };
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  joinedAt: string;
}
```

**Tasks:**
- [ ] Add `slug`, `status`, `createdAt` to `OrganizationProfile`
- [ ] Update `SocialLinks` (x instead of twitter, remove website)
- [ ] Add `status`, `invitedAt`, `invitedBy` to `TeamMember`
- [ ] Create backend response types

---

#### 4.3 Update useOrganization Hook

**File:** `src/features/organization/components/organizationService/useOrganization.ts`

**Key Changes:**

```typescript
import { organizationApi } from '@/services/api/organizationApi';

export function useOrganization() {
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load organizations on mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  async function loadOrganizations() {
    try {
      setIsLoading(true);
      setError(null);

      const orgs = await organizationApi.getUserOrganizations();

      // Transform backend response to frontend format
      const transformedOrgs = orgs.map(item => ({
        id: item.organization._id,
        name: item.organization.name,
        slug: item.organization.slug,
        logo: item.organization.logo || '',
        status: item.organization.status,
        // ... fetch full details for each org
      }));

      setOrganizations(transformedOrgs);

      // Set first org as active
      if (transformedOrgs.length > 0) {
        setActiveOrgId(transformedOrgs[0].id);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load organizations:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreate(payload: OrganizationCreatePayload) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await organizationApi.createOrganization(payload);

      // Transform response and add to state
      const newOrg = transformOrganizationResponse(response);
      setOrganizations(prev => [...prev, newOrg]);
      setActiveOrgId(newOrg.id);
      setStep('dashboard');

    } catch (err) {
      setError(err.message);
      throw err; // Re-throw for form error handling
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    const activeOrg = organizations.find(org => org.id === activeOrgId);
    if (!activeOrg) return;

    try {
      setIsSaving(true);
      setError(null);

      // Save profile updates
      await organizationApi.updateProfile(activeOrgId!, {
        logo: activeOrg.logo,
        tagline: activeOrg.tagline,
        about: activeOrg.about,
      });

      // Save social links
      await organizationApi.updateSocialLinks(activeOrgId!, activeOrg.socialLinks);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAddMember(email: string, role: TeamMember['role']) {
    if (!activeOrgId) return;

    try {
      setError(null);

      const member = await organizationApi.inviteMember(activeOrgId, email, role);

      // Update local state
      setOrganizations(prev =>
        prev.map(org =>
          org.id === activeOrgId
            ? { ...org, teamMembers: [...org.teamMembers, transformMemberResponse(member)] }
            : org
        )
      );

    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  // Similar updates for handleRemoveMember and handleUpdateMemberRole...

  return {
    // ... existing returns
    isLoading,
    error,
  };
}
```

**Tasks:**
- [ ] Add API calls to all handler functions
- [ ] Replace mock `setTimeout` saves with real API calls
- [ ] Add loading/error states
- [ ] Add data transformation utilities
- [ ] Handle API errors gracefully

---

#### 4.4 Update UI Components for Error Handling

**File:** `OrganizationForm.tsx` and `OrganizationDashboard.tsx`

Add error/loading UI:
```typescript
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    {error}
  </div>
)}

{isLoading && (
  <div className="flex items-center gap-2">
    <LoadingSpinner />
    <span>Loading organizations...</span>
  </div>
)}
```

**Tasks:**
- [ ] Add error display components
- [ ] Add loading spinners
- [ ] Disable buttons during save operations
- [ ] Show success toasts/notifications

---

### Phase 2: Backend Implementation (Days 3-7)

#### 5.1 Database Schema Setup

**Priority 1: Create Schemas**

**File:** `modules/organizations/schemas/organization.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationDocument = Organization & Document;

@Schema({ timestamps: true })
export class Organization {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  website: string;

  @Prop()
  logo?: string;

  @Prop({ maxlength: 100 })
  tagline?: string;

  @Prop()
  about?: string;

  @Prop({ type: Object })
  socialLinks?: {
    x?: string;       // Changed from twitter
    telegram?: string;
    github?: string;
    discord?: string;
    linkedin?: string;
  };

  @Prop({ required: true })
  termsAcceptedAt: Date;

  @Prop({ required: true, default: 'v1.0' })
  termsVersion: string;

  @Prop({ type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);

// Pre-save hook to generate slug
OrganizationSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});
```

**File:** `modules/organizations/schemas/organization-member.schema.ts`

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrganizationMemberDocument = OrganizationMember & Document;

@Schema({ timestamps: true })
export class OrganizationMember {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true, index: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, enum: ['ADMIN', 'EDITOR', 'VIEWER'], default: 'VIEWER' })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true, default: () => new Date() })
  invitedAt: Date;

  @Prop()
  joinedAt?: Date;

  @Prop({ type: String, enum: ['PENDING', 'ACTIVE', 'REMOVED'], default: 'PENDING' })
  status: string;
}

export const OrganizationMemberSchema = SchemaFactory.createForClass(OrganizationMember);

// Compound unique index
OrganizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
```

**Tasks:**
- [ ] Create organization schema with all fields
- [ ] Create organization-member schema
- [ ] Add indexes (name, slug, organizationId + userId)
- [ ] Add pre-save hook for slug generation
- [ ] Add validation decorators

---

#### 5.2 DTOs & Validation

**File:** `modules/organizations/dto/create-organization.dto.ts`

```typescript
import { IsString, IsUrl, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsUrl()
  website: string;

  @IsBoolean()
  agreeToTerms: boolean;
}
```

**Other DTOs needed:**
- `update-organization-profile.dto.ts`
- `update-social-links.dto.ts`
- `invite-member.dto.ts`
- `update-member-role.dto.ts`

**Tasks:**
- [ ] Create all 5 DTO files
- [ ] Add class-validator decorators
- [ ] Add custom validators (URL format, etc.)

---

#### 5.3 Services Layer

**File:** `modules/organizations/organizations.service.ts`

Key methods to implement:
```typescript
@Injectable()
export class OrganizationsService {
  async create(userId: string, dto: CreateOrganizationDto): Promise<OrganizationResponse>
  async findUserOrganizations(userId: string): Promise<UserOrganizationsResponse[]>
  async findById(orgId: string): Promise<Organization>
  async updateProfile(orgId: string, dto: UpdateProfileDto): Promise<Organization>
  async updateSocialLinks(orgId: string, dto: UpdateSocialLinksDto): Promise<Organization>
}
```

**File:** `modules/organizations/members.service.ts`

Key methods to implement:
```typescript
@Injectable()
export class MembersService {
  async findByOrganizationId(orgId: string, status?: string): Promise<TeamMember[]>
  async inviteMember(orgId: string, invitedBy: string, dto: InviteMemberDto): Promise<Member>
  async updateMemberRole(memberId: string, role: string): Promise<Member>
  async removeMember(memberId: string): Promise<void>
  async getUserRole(orgId: string, userId: string): Promise<string | null>
  async isAdmin(orgId: string, userId: string): Promise<boolean>
}
```

**Tasks:**
- [ ] Implement OrganizationsService with all methods
- [ ] Implement MembersService with all methods
- [ ] Add business logic (slug generation, uniqueness checks)
- [ ] Add error handling (NotFoundException, ConflictException)

---

#### 5.4 Controllers

**File:** `modules/organizations/organizations.controller.ts`

```typescript
@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  @Post()
  create(@User() user, @Body() dto: CreateOrganizationDto) { }

  @Get('me')
  getUserOrganizations(@User() user) { }

  @Get(':id')
  @UseGuards(OrganizationMemberGuard)
  getOrganization(@Param('id') id: string) { }

  @Patch(':id/profile')
  @UseGuards(OrganizationMemberGuard, RequireRole('ADMIN'))
  updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) { }

  @Patch(':id/social-links')
  @UseGuards(OrganizationMemberGuard, RequireRole('ADMIN'))
  updateSocialLinks(@Param('id') id: string, @Body() dto: UpdateSocialLinksDto) { }
}
```

**File:** `modules/organizations/members.controller.ts`

```typescript
@Controller('organizations/:orgId/members')
@UseGuards(JwtAuthGuard, OrganizationMemberGuard)
export class MembersController {
  @Get()
  listMembers(@Param('orgId') orgId: string, @Query('status') status?: string) { }

  @Post('invite')
  @UseGuards(RequireRole('ADMIN'))
  inviteMember(@Param('orgId') orgId: string, @User() user, @Body() dto: InviteMemberDto) { }

  @Patch(':memberId/role')
  @UseGuards(RequireRole('ADMIN'))
  updateRole(@Param('memberId') memberId: string, @Body() dto: UpdateRoleDto) { }

  @Delete(':memberId')
  @UseGuards(RequireRole('ADMIN'))
  removeMember(@Param('memberId') memberId: string) { }
}
```

**Tasks:**
- [ ] Create organizations controller
- [ ] Create members controller
- [ ] Add route handlers
- [ ] Add validation pipes
- [ ] Add authorization guards

---

#### 5.5 Authorization Guards

**File:** `modules/organizations/guards/organization-member.guard.ts`

```typescript
@Injectable()
export class OrganizationMemberGuard implements CanActivate {
  constructor(private membersService: MembersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const orgId = request.params.id || request.params.orgId;

    // Check if user is member
    const role = await this.membersService.getUserRole(orgId, user.id);

    if (!role) {
      throw new ForbiddenException('You are not a member of this organization');
    }

    // Attach role to request for use in controllers
    request.organizationRole = role;
    return true;
  }
}
```

**File:** `modules/organizations/guards/require-role.guard.ts`

```typescript
export const RequireRole = (role: 'ADMIN' | 'EDITOR' | 'VIEWER') =>
  SetMetadata('requiredRole', role);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('requiredRole', context.getHandler());
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const userRole = request.organizationRole;

    const roleHierarchy = { ADMIN: 3, EDITOR: 2, VIEWER: 1 };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
}
```

**Tasks:**
- [ ] Create OrganizationMemberGuard
- [ ] Create RoleGuard with @RequireRole decorator
- [ ] Add role hierarchy logic
- [ ] Test authorization flows

---

### Phase 3: Integration & Testing (Days 8-10)

#### 6.1 Environment Configuration

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend `.env`:**
```env
ORG_TERMS_VERSION=v1.0
ORG_NAME_MIN_LENGTH=3
ORG_NAME_MAX_LENGTH=100
ORG_TAGLINE_MAX_LENGTH=100
```

**Tasks:**
- [ ] Configure API URL in frontend
- [ ] Add CORS settings in backend for frontend origin
- [ ] Set up environment variables

---

#### 6.2 CORS Configuration

**Backend:** `main.ts`

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

**Tasks:**
- [ ] Enable CORS for frontend origin
- [ ] Allow credentials for auth cookies/tokens

---

#### 6.3 Testing Strategy

**Frontend Tests:**
- [ ] Test organization creation flow
- [ ] Test form validation
- [ ] Test API error handling
- [ ] Test multi-org switching
- [ ] Test team member management

**Backend Tests:**
- [ ] Unit tests for services
- [ ] E2E tests for all endpoints
- [ ] Test role-based authorization
- [ ] Test "cannot remove last admin" rule
- [ ] Test slug uniqueness and generation

**Integration Tests:**
- [ ] End-to-end flow: Create org → Update profile → Invite members
- [ ] Test with real JWT tokens
- [ ] Test error scenarios (409 Conflict, 403 Forbidden)

---

## 5. Gap Analysis & Risks

### 5.1 Identified Gaps

| Gap | Impact | Solution |
|-----|--------|----------|
| No authentication system in frontend | 🔴 Critical | Implement JWT auth or use existing auth provider |
| Member status not shown in UI | 🟡 Medium | Add "Pending" badge for unaccepted invitations |
| No image upload for logo | 🟡 Medium | Add file upload service (S3/Cloudinary) or allow URL-only |
| Social links field mismatch (x vs twitter) | 🟢 Low | Standardize on "x" or map during API calls |
| No organization name change flow | 🟢 Low | Add later - requires admin approval per spec |

### 5.2 Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Frontend types don't match backend response | Medium | Create adapter/transformer functions |
| Role case mismatch (Admin vs ADMIN) | High | Decide on convention and enforce with types |
| Missing user population in backend | High | Ensure all queries populate user details |
| CORS issues | Medium | Configure properly before integration |
| Slug collisions | Low | Add numeric suffix on collision (org-name-2) |

---

## 6. Success Criteria

### Functional Requirements

- [ ] User can create organization from frontend
- [ ] Organization persists to database
- [ ] Creator is automatically admin
- [ ] User can view their organizations list
- [ ] User can switch between multiple organizations
- [ ] Admin can update profile (logo, tagline, about)
- [ ] Admin can update social links
- [ ] Admin can invite team members
- [ ] Admin can change member roles
- [ ] Admin can remove members
- [ ] Cannot remove last admin (validation)
- [ ] All changes persist after page refresh

### Non-Functional Requirements

- [ ] All API calls complete within 2 seconds
- [ ] Proper error messages shown to users
- [ ] Loading states displayed during async operations
- [ ] Form validation works before API calls
- [ ] Authorization enforced on all protected endpoints
- [ ] Audit trail maintained (createdBy, timestamps)

---

## 7. Timeline Estimate

| Phase | Duration | Tasks |
|-------|----------|-------|
| Frontend Preparation | 2 days | API service layer, type updates, hook refactoring |
| Backend Implementation | 5 days | Schemas, DTOs, services, controllers, guards |
| Integration & Testing | 3 days | End-to-end testing, bug fixes, polish |
| **Total** | **10 days** | |

---

## 8. Next Steps

### Immediate Actions (Today)

1. **Decide on authentication strategy** - JWT? Session? Auth provider?
2. **Standardize role casing** - Use PascalCase (Admin) or UPPERCASE (ADMIN)?
3. **Choose logo upload approach** - URL-only, or implement file upload?
4. **Confirm backend stack** - NestJS confirmed? Database: MongoDB?

### Week 1: Frontend

1. Create API service layer (`organizationApi.ts`)
2. Update TypeScript types with backend response shapes
3. Refactor `useOrganization` hook to call real APIs
4. Add error handling UI components
5. Test with mock backend (or Postman mock server)

### Week 2: Backend

1. Implement schemas and DTOs
2. Build services layer with business logic
3. Create controllers with proper guards
4. Write unit tests
5. Set up database with indexes

### Week 3: Integration

1. Connect frontend to backend
2. End-to-end testing
3. Fix bugs and edge cases
4. Polish UX (loading, errors, success states)
5. Deploy to staging

---

## 9. Open Questions

- [ ] **Authentication:** Is JWT auth already implemented? Where are tokens stored?
- [ ] **User Model:** Does a User schema exist? What fields does it have?
- [ ] **Logo Upload:** Should logos be uploaded files or just URLs for now?
- [ ] **Email Service:** For member invitations, what email provider should be used?
- [ ] **Invitation Flow:** Should invitations require email confirmation, or auto-accept?
- [ ] **Organization Name Changes:** Should we allow it, and if so, require manual approval?
- [ ] **Hackathon Integration:** Timeline for connecting organizations to hackathons?

---

## 10. Reference Documentation

- **Frontend Spec:** `/Docs/organization-flow.md`
- **Backend Spec:** (Provided in task description)
- **Frontend Code:** `/src/features/organization/`
- **API Base URL:** `.env.example` → `NEXT_PUBLIC_API_URL`

---

## Appendix A: Quick Reference - Endpoint Summary

| Endpoint | Method | Frontend Handler | Backend Guard |
|----------|--------|------------------|---------------|
| `/organizations` | POST | `handleCreate()` | JWT |
| `/organizations/me` | GET | `useEffect` on mount | JWT |
| `/organizations/:id` | GET | `handleSwitchOrg()` | JWT + Member |
| `/organizations/:id/profile` | PATCH | `handleSave()` | JWT + Admin |
| `/organizations/:id/social-links` | PATCH | `handleSave()` | JWT + Admin |
| `/organizations/:id/members` | GET | Initial load | JWT + Member |
| `/organizations/:id/members/invite` | POST | `handleAddMember()` | JWT + Admin |
| `/organizations/:id/members/:id/role` | PATCH | `handleUpdateMemberRole()` | JWT + Admin |
| `/organizations/:id/members/:id` | DELETE | `handleRemoveMember()` | JWT + Admin |

---

## Appendix B: Data Transformation Examples

### Backend → Frontend Transformation

**Backend Response (Create Org):**
```json
{
  "organization": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Stellar Foundation",
    "slug": "stellar-foundation",
    "website": "https://stellar.org",
    "logo": null,
    "tagline": null,
    "about": null,
    "socialLinks": {},
    "status": "ACTIVE",
    "createdBy": "507f191e810c19729de860ea",
    "termsAcceptedAt": "2025-01-15T10:30:00Z",
    "termsVersion": "v1.0",
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  },
  "membership": {
    "_id": "507f1f77bcf86cd799439012",
    "role": "ADMIN",
    "status": "ACTIVE",
    "joinedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Frontend State:**
```typescript
{
  id: "507f1f77bcf86cd799439011",
  name: "Stellar Foundation",
  slug: "stellar-foundation",
  website: "https://stellar.org",
  logo: "",
  tagline: "",
  about: "",
  status: "ACTIVE",
  socialLinks: {
    x: "",
    telegram: "",
    github: "",
    discord: "",
    linkedin: ""
  },
  teamMembers: [
    {
      id: "member-1",
      email: "user@example.com",
      name: "Current User",
      role: "Admin",
      status: "Active",
      joinedAt: "2025-01-15T10:30:00Z"
    }
  ],
  createdAt: "2025-01-15T10:30:00Z"
}
```

---

**Document Version:** 1.0
**Last Updated:** 2026-02-06
**Status:** Ready for Implementation
