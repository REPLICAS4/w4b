

# REPLICAS -- Product Audit and Next Steps

## Current State Summary

Here is what exists today across all pages and backend:

### Pages
| Page | Route | Status | Notes |
|------|-------|--------|-------|
| Landing | `/` | Done | Hero, demo slideshow, manifesto, terminal demo, FAQ, footer |
| Discovery | `/discovery` | Done | Public browsing, auth-gated chat/clone |
| Create Replica | `/create-replica` | Done | Drag-and-drop form, avatar upload, 5 LLM models |
| My Replicas | `/my-replicas` | Done | List + delete (auth required) |
| Chat | `/chat/:id` | Done | Streaming AI chat via edge function |
| Predict Market | `/predictmarket` | Done | Showcase page (charts, strategy, stats -- static/demo) |
| Docs | `/docs` | Done | 11-section documentation with sidebar |
| Auth | `/auth` | Done | Email/password sign-up and sign-in |

### Database
| Table | Columns | RLS |
|-------|---------|-----|
| `profiles` | id, display_name, avatar_url, created_at, updated_at | Own profile only (select/insert/update) |
| `replicas` | id, owner_id, name, description, avatar_url, instruction, knowledge, model, created_at, updated_at | Public read, owner-only insert/update/delete |

### Backend
- `auth-email-hook` edge function (branded emails)
- `chat-replica` edge function (streaming AI chat via Lovable AI gateway)
- `avatars` storage bucket (public)

### Gaps and Issues Found
1. **My Replicas** fetches ALL replicas, not just the user's own -- missing `.eq("owner_id", user.id)` filter
2. **No edit functionality** for replicas -- only create and delete
3. **Navbar not mobile responsive** -- all links overflow on small screens
4. **No profile page** -- profiles table exists but users can't edit display_name or avatar
5. **Chat history not persisted** -- messages are lost on page refresh
6. **No creator info on Discovery cards** -- no way to see who made a replica

---

## Recommended Next Steps (Priority Order)

### 1. Fix My Replicas Bug (Critical)
The My Replicas page loads ALL replicas instead of only the current user's. Add `.eq("owner_id", user.id)` to the query.

**Files:** `src/pages/MyReplicas.tsx`

---

### 2. Mobile-Responsive Navbar
Add a hamburger menu for mobile devices. Currently the navbar overflows on smaller screens.

**Files:** `src/components/Navbar.tsx`

---

### 3. Edit Replica
Allow users to edit their own replicas from the My Replicas page -- update name, description, instruction, knowledge, model, and avatar.

**Files:** `src/pages/MyReplicas.tsx` (add edit button + modal or navigate to edit page)

---

### 4. User Profile Page
Create a `/profile` page where users can set their display name and avatar. This info can then be shown on their public replicas in Discovery.

**Files:** New `src/pages/Profile.tsx`, update `src/App.tsx` and `src/components/Navbar.tsx`

---

### 5. Show Creator Info on Discovery Cards
Join `profiles` on `owner_id` to show the creator's display name on each replica card. Requires updating the profiles RLS to allow public read of display_name.

**Files:** `src/pages/Discovery.tsx`, new DB migration for profiles public read policy

---

### 6. Persist Chat History
Create a `chat_messages` table to save conversations. Users can resume chats and see past conversations.

**Files:** New DB migration, update `src/pages/ChatReplica.tsx`, new `src/pages/ChatHistory.tsx`

---

## Technical Details

### Fix #1 -- My Replicas Query
```typescript
// In MyReplicas.tsx, line 36, add filter:
.eq("owner_id", user.id)
```

### Fix #2 -- Mobile Navbar
- Add a `Sheet` (drawer) component triggered by a hamburger icon on `md:` breakpoint and below
- Hide desktop links on mobile, show hamburger instead

### Feature #3 -- Edit Replica
- Add an "Edit" button to each card in My Replicas
- Reuse the same form fields from CreateReplicaForm in a dialog or separate `/edit-replica/:id` route
- Use `supabase.from("replicas").update(...)` with the existing RLS update policy

### Feature #4 -- Profile Page
- New page at `/profile` reading from `profiles` table
- Allow updating `display_name` and `avatar_url` (reuse avatar upload logic)

### Feature #5 -- Creator Display
- New RLS policy: `"Anyone can view profile display_name"` on profiles for SELECT
- Update Discovery query to join profiles: `.select("*, profiles!owner_id(display_name, avatar_url)")`

### Feature #6 -- Chat Persistence
- New `chat_messages` table: `id, replica_id, user_id, role, content, created_at`
- RLS: users can read/write only their own messages
- Load existing messages on chat page mount
- Save each message after send/receive

