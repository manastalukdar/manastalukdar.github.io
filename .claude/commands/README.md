# Claude Code Session Management Commands

Custom slash commands for Claude Code that provide comprehensive development session tracking and documentation. Based on [Claude Code's custom slash command system](https://docs.anthropic.com/en/docs/claude-code/slash-commands).

## 🎯 Overview

This is a set of custom slash commands for Claude Code that helps developers maintain continuity across multiple coding sessions with Claude by:

- **Documenting Progress**: Capture what was done, how it was done, and why decisions were made
- **Tracking Changes**: Monitor git changes, todo items, and implementation details  
- **Knowledge Transfer**: Enable future sessions to understand past work without re-analyzing the entire codebase
- **Issue Resolution**: Document problems encountered and their solutions for future reference

These commands extend Claude Code's built-in functionality with project-specific session management capabilities.

## 🚀 Quick Start

```bash
# Start a new session (with optional name)
/project:session-start authentication-refactor
# Or without a name
/project:session-start

# Update progress during development (with optional notes)
/project:session-update Implemented OAuth with Google
# Or without notes (auto-summarizes recent activity)
/project:session-update

# End session with comprehensive summary
/project:session-end

# View current session status
/project:session-current

# List all past sessions
/project:session-list
```

## 📁 File Structure

```
commands/                       # Custom command directory
├── session-start.md           # Command for starting a new session
├── session-update.md          # Command for updating current session
├── session-end.md             # Command for ending and summarizing
├── session-current.md         # Command for viewing current status
├── session-list.md            # Command for listing all sessions
└── session-help.md            # Command for showing help

sessions/                      # Session storage directory
├── .current-session          # Tracks the active session filename
├── 2025-01-16-1347.md       # Example session file
└── [YYYY-MM-DD-HHMM-name].md  # Session naming format
```

## 🛠️ Installation

1. Clone this repository or copy the folders to your project:
   ```bash
   git clone git@github.com:iannuttall/claude-sessions.git
   # Or copy the commands and sessions folders to your project root
   ```

2. Create the sessions tracking file:
   ```bash
   mkdir -p sessions
   touch sessions/.current-session
   ```

3. Add to `.gitignore` if you don't want to track sessions:
   ```
   sessions/
   ```

## 📝 How It Works

This system provides custom slash commands inspired by [Claude Code's custom slash commands](https://docs.anthropic.com/en/docs/claude-code/slash-commands#custom-slash-commands) feature. While Claude Code typically looks for commands in `.claude/commands/`, this repository provides a standalone implementation with commands in the `commands/` directory.

- **Prefix**: All commands use the `/project:` prefix (for project-specific commands)
- **Arguments**: Commands support arguments using the `$ARGUMENTS` placeholder
- **Execution**: Claude reads the command file and executes the instructions within
- **Note**: These commands are designed to work with Claude but can be adapted for other AI coding assistants

## 📋 Command Reference

### `/project:session-start [name]`
Starts a new development session with an optional descriptive name.

**Parameters:**
- `[name]` (optional) - A descriptive name for the session. If omitted, creates a session with just the timestamp.

**What it does:**
- Creates a new markdown file with timestamp (format: `YYYY-MM-DD-HHMM.md` or `YYYY-MM-DD-HHMM-name.md`)
- Sets up session structure with goals and progress sections
- Updates `.current-session` to track active session
- Prompts for session goals if not clear from context

**Examples:**
```
# With a descriptive name
/project:session-start refactor-auth-system

# Without a name (just timestamp)
/project:session-start
```

### `/project:session-update [notes]`
Adds timestamped updates to the current session.

**Parameters:**
- `[notes]` (optional) - Custom notes about the update. If omitted, automatically summarizes recent activities.

**What it does:**
- Appends progress notes with timestamp
- Captures git status and changes
- Tracks todo list progress
- Documents issues and solutions
- Records implementation details
- Auto-generates summary if no notes provided

**Examples:**
```
# With custom notes
/project:session-update Fixed Next.js 15 params Promise issue

# Without notes (auto-summarizes)
/project:session-update
```

### `/project:session-end`
Ends the current session with a comprehensive summary.

**What it does:**
- Generates complete session summary including:
  - Duration and timing
  - Git changes summary
  - Todo items completed/remaining
  - Key accomplishments
  - Problems and solutions
  - Dependencies and configuration changes
  - Lessons learned
  - Tips for future developers
- Clears `.current-session` file

### `/project:session-current`
Shows the status of the current active session.

**What it does:**
- Displays session name and duration
- Shows recent updates
- Lists current goals and tasks
- Reminds of available commands

### `/project:session-list`
Lists all session files with summaries.

**What it does:**
- Shows all session files sorted by date
- Displays session titles and timestamps
- Highlights currently active session
- Shows brief overview of each session

### `/project:session-help`
Displays help information about the session system.

## 🎯 Best Practices for Claude Code

### Command Usage
- These commands work only within Claude Code interactive sessions
- Commands are project-specific and available to all team members
- Arguments are passed directly after the command name

### Session Management  
- Sessions help Claude maintain context across conversations
- Review past sessions before starting related work
- Session files serve as documentation for your development process

## 🔧 Customization

### Adapting for Standard Claude Code Setup
If you want to use these with Claude Code's standard directory structure:
1. Copy the `commands` folder to `.claude/commands/` in your project
2. Update paths in command files from `sessions/` to `.claude/sessions/`

### Creating Your Own Commands
- Modify command files to change behavior
- Create additional session-related commands
- Organize commands in subdirectories for namespacing (e.g., `/project:session:feature:start`)
- Create personal versions in `~/.claude/commands/` with `/user:` prefix

## 📚 References

- [Claude Code Slash Commands Documentation](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Claude Code Memory Management](https://docs.anthropic.com/en/docs/claude-code/memory-management)
- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview)

## 🎯 Best Practices

### Starting Sessions
- Use descriptive names that indicate the main focus
- Start sessions for significant features or bug fixes
- Define clear goals at the beginning

### During Development
- Update regularly when completing significant tasks
- Document unexpected issues and their solutions
- Track breaking changes or important discoveries
- Note any dependencies added or configuration changes

### Ending Sessions
- Always end sessions with `/project:session-end`
- Review the generated summary for completeness
- Add any missing context before closing

### Knowledge Transfer
- Review relevant past sessions before starting similar work
- Reference session files in commit messages for context
- Use session summaries for standup updates or reports

## 💡 Use Cases

### 1. Feature Development
```
/project:session-start user-authentication
# Implement auth logic
/project:session-update Added middleware and login page
# Fix issues
/project:session-update Resolved Next.js 15 async cookie issue
/project:session-end
```

### 2. Bug Fixing
```
/project:session-start fix-email-bounce-handling
# Investigate issue
/project:session-update Found AWS SNS webhook misconfiguration
# Implement fix
/project:session-update Updated webhook handler and added logging
/project:session-end
```

### 3. Refactoring
```
/project:session-start database-service-refactor
# Plan refactoring
/project:session-update Created new DB service class architecture
# Execute changes
/project:session-update Migrated all queries to new service
/project:session-end
```

## 🤖 Benefits for AI Agents

1. **Context Preservation**: Sessions provide rich context about past work
2. **Decision History**: Understand why certain approaches were taken
3. **Issue Awareness**: Know about problems already encountered and solved
4. **Code Evolution**: Track how the codebase has changed over time
5. **Dependency Tracking**: Awareness of what packages and tools are used

## 🔍 Tips and Tricks

1. **Searchable Sessions**: Use consistent terminology in updates for easy searching
2. **Link Issues**: Reference ticket numbers or GitHub issues in updates
3. **Code Snippets**: Include important code changes in session updates
4. **Screenshots**: Reference screenshot paths for UI changes
5. **Testing Notes**: Document test scenarios and results

## ⚙️ Configuration

### Customizing Commands
Edit the command files in `commands/` to:
- Change session file format
- Add custom sections
- Modify summary generation
- Adjust git tracking details

### Session Storage
- Default: `sessions/`
- Can be changed by updating command files
- Consider version control needs

## 🚨 Troubleshooting

**No active session found**
- Start a new session with `/project:session-start`
- Check `sessions/.current-session` exists

**Session updates not working**
- Ensure a session is active
- Check file permissions in `sessions/`

**Missing git information**
- Verify you're in a git repository
- Check git is properly initialized

## 📚 Examples

### Complete Feature Implementation Session
```markdown
# Development Session - 2025-01-16 13:47 - campaign-editor

## Goals
- [x] Create dedicated campaign editor
- [x] Add markdown support
- [x] Implement auto-save

## Progress
[Multiple detailed updates documenting the implementation]

## Session Summary
Successfully implemented a full-featured campaign editor with markdown support,
live preview, and auto-save functionality. Resolved Next.js 15 compatibility
issues and added proper error handling.
```

## 🤝 Contributing

To improve this system:
1. Enhance command instructions for better AI comprehension
2. Add new commands for specific workflows
3. Improve session file formatting
4. Create utilities for session analysis

## 📄 License

This session management system is open source and available for use in any project.

---

*Remember: Good documentation today saves hours of debugging tomorrow!*