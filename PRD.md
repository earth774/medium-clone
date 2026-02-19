## Product: Medium Clone

### 1. Overview
- **Goal**: Build a simplified Medium-like blogging platform where users can read, write, and manage articles with a clean, editorial UI.
- **Primary users**: Guest readers, registered authors, and returning signed-in users.
- **Scope (MVP)**: Public article browsing, article detail reading, authentication, profile management, and a basic editor for creating/updating articles.

### 2. Core Pages & Flows

#### 2.1 Home (`Page 1 — Home`)
- **Purpose**: Entry point for guests and signed-in users to discover articles.
- **Content**:
  - Global navbar (shared with `Navbar` / `Navbar — Guest` frames).
  - Article list / feed area with cards or rows.
  - Support for featured or latest articles at the top.
- **User actions**:
  - Navigate to article detail.
  - Sign in / register via navbar actions.

#### 2.2 Article Detail (`Page 2 — Article Detail`)
- **Purpose**: Present a single article in a focused reading layout.
- **Content**:
  - Article title, author, publication date, reading time.
  - Article body (rich text: headings, paragraphs, quotes, lists).
  - Basic metadata and navigation back to Home or to author profile.
- **User actions**:
  - Read article content.
  - Navigate to author profile.

#### 2.3 Authentication

##### 2.3.1 Sign In (`Page 3 — Sign In`)
- **Purpose**: Allow existing users to sign in.
- **Content**:
  - Centered sign-in card (`siCard`) with email and password fields.
  - Primary action button: “Sign in”.
  - Link to Register page.
- **User actions**:
  - Submit credentials.
  - Navigate to Register.

##### 2.3.2 Register (`Page 4 — Register`)
- **Purpose**: Allow new users to create an account.
- **Content**:
  - Centered register card (`regCard`) with name, email, password (and confirmation) fields.
  - Primary action button: “Create account” or equivalent.
  - Link to Sign In page.
- **User actions**:
  - Submit registration form.
  - Navigate to Sign In.

#### 2.4 Profile & Settings

##### 2.4.1 Profile (`Page 5 — Profile`)
- **Purpose**: Display a user’s public profile and authored articles.
- **Content**:
  - Navbar (`profNav`) at the top.
  - Body area (`profBody`) showing avatar, bio, username, and list of user’s articles.
- **User actions**:
  - Navigate to an article authored by the user.
  - Navigate to Edit Profile.

##### 2.4.2 Edit Profile (`Page 6 — Edit Profile`)
- **Purpose**: Let a signed-in user update their profile.
- **Content**:
  - Centered edit profile card (`epCard`) with fields for display name, bio, avatar URL, and optional social links.
  - Primary action button: “Save changes”.
- **User actions**:
  - Update profile data and save.

#### 2.5 Editor (`Page 7 — Editor`)
- **Purpose**: Allow authors to create and edit articles.
- **Content**:
  - Top bar (`edTopBar`) with actions like Save/Publish, navigation back to home/profile.
  - Body area (`edBodyWrap`) with:
    - Title input.
    - Main content editor (rich text).
- **User actions**:
  - Create a new article.
  - Edit an existing article.
  - Save draft / publish article (exact states to be defined in implementation).

#### 2.6 Navigation & Design System
- **Navigation Flow (`Navigation Flow` frame)**:
  - Documents page-to-page transitions (Home → Article Detail, Home → Sign In/Register, Profile → Edit Profile, etc.).
- **Navbars (`Navbar`, `Navbar — Guest`)**:
  - Shared top-level navigation with logo and auth actions.
  - Guest vs signed-in variants (e.g., “Sign in / Get started” vs avatar/profile menu).
- **Design System (`Design System` frame)**:
  - **Color Palette**: Base colors for background, borders, text (e.g., `$color-bg`, `$color-border`, `$color-text-1`, `$color-text-2`).
  - **Typography**: Heading + body styles (e.g., `Source Serif 4` for titles, `Inter` for body).
  - **Components**: Buttons, cards, form fields, etc., to be reused across pages.

### 3. Functional Requirements
- **Reading**:
  - Anyone can browse Home and Article Detail without authentication.
- **Authentication**:
  - Email + password-based sign up and sign in.
  - Persist session between visits (e.g. via cookies/JWT).
- **Authoring**:
  - Only signed-in users can access the Editor and publish articles.
  - Users can edit only their own articles.
- **Profiles**:
  - Public profile view with list of authored articles.
  - Editable profile for signed-in user.

### 4. Non‑Functional Requirements (Assumptions)
- **Responsiveness**: Layout should adapt down to tablet and small laptop widths while preserving the designed hierarchy.
- **Accessibility**: Semantic HTML, keyboard navigable forms and buttons, sufficient color contrast following the design system.
- **Performance**: Initial page load should be fast enough for a content site (target < 2s on a typical connection for main pages).

### 5. Out of Scope (for initial version)
- Rich social features (comments, likes, follows).
- Draft autosave and version history.
- Advanced editor blocks (embeds, images, code blocks) beyond basic rich text.