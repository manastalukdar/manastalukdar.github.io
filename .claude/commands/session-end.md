End the current development session by:

1. Check `.claude/sessions/.current-session` for the active session
2. If no active session, inform user there's nothing to end
3. If session exists, append a comprehensive summary including:
   - Session duration
   - Git summary:
     * Total files changed (added/modified/deleted)
     * List all changed files with change type
     * Number of commits made (if any)
     * Final git status
   - Todo summary:
     * Total tasks completed/remaining
     * List all completed tasks
     * List any incomplete tasks with status
   - Key accomplishments
   - All features implemented
   - All fixes implemented
   - Problems encountered and solutions
   - Breaking changes or important findings
   - Dependencies added/removed
   - Configuration changes
   - Deployment steps taken
   - Lessons learned
   - What wasn't completed
   - Tips for future developers

4. Empty the `.claude/sessions/.current-session` file (don't remove it, just clear its contents)
5. Rename the session file by appending a name based on what was implemented or proposed.
6. Move the session file to the appropriate sub-directory under the `.claude/sessions` directory. If it does not exist, first run the prompt as defined in the `.claude/commands/sessions-init.md` file, and then move the file. If the sub-directory contains a `.gitkeep` file, delete it.
7. Inform user the session has been documented and print location of the session file.

The summary should be thorough enough that another developer (or AI) can understand everything that happened without reading the entire session.
