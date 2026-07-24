---
trigger: always_on
---

# Git Commit Message Generation Strategy (Trae-Style)

When generating commit messages, do not just list file changes. Follow this multi-step analysis:

1. **Analyze Intent:** Compare the diffs and determine _why_ the change was made (e.g., "Refactoring for performance" vs "Fixing a null pointer").
2. **Structural Formatting:** Use the Semantic Commit format: `<type>(<scope>): <description>`.
3. **The Body Rule:** - If the change is complex, include a body that explains the "What" and "Why" (not the "How").
   - Use bullet points for multiple logical changes.
4. **Tone:** Be concise, professional, and use imperative mood (e.g., "Add feature" instead of "Added feature").
5. **Files To Look For:** Priority should be to look for the staged files. If there are no staged files, you can take the context of all the files that has been changes.

**Example Output:**
feat(auth): implement JWT rotation for enhanced security

- Added refresh token logic to the login flow
- Updated middleware to intercept expired tokens
- Migrated secret keys to Supabase Vault
