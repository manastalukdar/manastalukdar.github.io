# Procedure for Organizing Claude Session Directories:

1. Analyze the Project
   - Perform a thorough analysis of the project's codebase and overall architecture to understand its components.
2. Define the Directory Structure
   - Based on your analysis, create a flat or hierarchical list of the project's key features and product areas. This list will serve as the blueprint for your session directory structure.
3. Synchronize Directories in `.claude/sessions`
Once you have the ideal structure defined, navigate to the `.claude/sessions` directory and perform the following actions:
   - Reconcile Existing Directories: Compare the current sub-directories against your new blueprint.
     - Rename, move, or delete existing directories to match the new structure.
     - Relocate session files from any old or incorrect directories into their proper new locations.
   - Create New Directories: For any features or areas in your blueprint that do not yet have a corresponding directory, create them now.
4. Ensure Directory Persistence
   - In any sub-directory that is empty (whether newly created or after moving files), add a `.gitkeep` file. This ensures the directory structure is committed to version control.
5. Add or update `.claude/sessions/README.md` as relevant.
