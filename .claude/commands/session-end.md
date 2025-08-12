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
5. Examine the sub-directories under the `.claude/sessions` directory.
   1. If none exist, run the prompt as defined in the `.claude/commands/sessions-init.md` file. This will create the sub-directories.
6. Examine what was created (or already exists). This is a breakdown of the project areas and components. Based on this list (flat or hierarchical) review the changes made in this session as documented in the active session file.
   1. If they do not correspond to anything on the list, it is possible that the project has changed since the sub-directories were last created. In this case, run the prompt as defined in the `.claude/commands/sessions-init.md` file. and try step `6.` again.
      1. If there is still no good match, stop and print out a statement with details and let the user decide what to do next.
   2. If they correspond to more than one item in the list, split the contents of this file into multiple session files using the naming convention where the timestamp (the original file name) remains as the prefix followed by appending a name based on what was implemented or proposed.
   3. Unless you went down the path of `6.1.1`, at this point you should have the matching sub-directory or sub-directories.
7. Move the session file or files to the appropriate sub-directories under the `.claude/sessions` directory. If the sub-directory contains a `.gitkeep` file, delete it.
8. Inform user the session has been documented and print location of the session file.

The summary should be thorough enough that another developer (or AI) can understand everything that happened without reading the entire session.
