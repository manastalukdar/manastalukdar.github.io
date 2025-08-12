
# Procedure for Ending and Archiving a Development Session

This procedure archives the work from the current session into a permanent, detailed log for future reference.

## Phase 1: Verify the Active Session

1. Check for an active session by reading the `.claude/sessions/.current-session` file.
2. If the file is empty or doesn't exist, inform the user that there is no active session to end and stop the process.

## Phase 2: Generate the Session Summary

1. Append a comprehensive summary to the end of the active session file. The summary should be structured and detailed enough for another developer to understand the session's context and outcomes. It must include:

- Session Metadata:
  - Session duration
- Version Control Summary (Git):
  - Total files added, modified, or deleted
  - A list of all changed files with their status (e.g., `A`, `M`, `D`)
  - Number of commits made during the session
  - Final `git status` output
- Task Management Summary (To-Do):
  - Totals for completed vs. remaining tasks
  - A list of all completed tasks
  - A list of all incomplete tasks and their current status
- Development Narrative:
  - Key accomplishments
  - Features and fixes implemented
  - Problems encountered and their solutions
  - Lessons learned and tips for future developers
- Project Impact:
  - Breaking changes or other important findings
  - Dependencies added or removed
  - Configuration changes made
  - Deployment steps taken (if any)
  - Work that was planned but not completed

## Phase 3: File the Session Log

This phase determines the correct location for the session file based on its content.

1. Ensure Directory Structure Exists: Check for sub-directories inside `.claude/sessions`.
   - If no directories exist, create them by running the `sessions-init.md` command.

2. Analyze and Categorize the Session: Review the session summary to determine which feature or product area it relates to. Compare this against the existing sub-directory names.

3. Handle Filing Scenarios:
    - A) Simple Match: If the session clearly maps to one sub-directory, proceed to Phase 4.
    - B) No Match: If the session content does not match any existing directory:
        1. The project structure may have changed. Re-run the `sessions-init.md` command to update the directories.
        2. Attempt to categorize the session again against the updated directories.
        3. If there is still no match, halt the process. Inform the user that a suitable directory could not be found and that manual action is required.
    - C) Multiple Matches: If the session covers more than one feature area:
        1. Split the session file into multiple files.
        2. Use the naming convention: `[original_timestamp]-[feature_name].md`.
        3. Each new file should contain the relevant parts of the summary for that specific feature.

## Phase 4: Finalize and Clean Up

1. Archive the File(s): Move the session file (or the newly split files) into the appropriate sub-directory (or directories) identified in Phase 3.
2. Clean Up Directory: If the destination directory contained a `.gitkeep` file, delete it, as the directory is no longer empty.
3. End the Session: Clear the contents of the `.claude/sessions/.current-session` file. Do not delete the file itself.
4. Notify the User: Confirm that the session has been successfully documented and archived. Print the final location(s) of the session file(s).
