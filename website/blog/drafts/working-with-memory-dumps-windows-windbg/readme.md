---
published: false
tags:
 - Memory Dumps
 - Debugging
 - WinDbg
 - Windows
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Working with Memory Dumps on Windows using WinDbg
url-slug: working-with-memory-dumps-windows-windbg
first-published-on: 2019-04-28 08:00 pm
last-updated-on: 2019-04-28 08:00 pm
meta:
 description: "Some steps on getting and analyzing memory dumps on Windows using WinDbg."
excerpt: "Open WinDbg and go to File > Attach to a Process. Select the process from the list and hit OK."
---

# Working with Memory Dumps on Windows using WinDbg

${toc}

## Getting a Memory Dump

- Open WinDbg and go to File > Attach to a Process. Select the process from the list and hit OK.
- At this point the process will hang. In WinDbg hit F5 to let the process continue, try not to take too long as it can cause you to disconnect.
- If you see "BUSY Debuggee is running..." at the bottom of the command window in WinDbg, the process is running. Whenever you don't see that, or the process hangs, return to WinDbg and hit F5 again. This might happen a few times when the process loads DLLs, it's nothing to be alarmed about, just skip through them. The window will read something like this:

```text
(71f0.7068): Access violation - code c0000005 (first chance)
First chance exceptions are reported before any exception handling.
This exception may be expected and handled.
*** ERROR: Symbol file could not be found.  Defaulted to export symbols for C:\Program Files (x86)\Windower 3.4\plugins\spellcast.dll -
spellcast!CreateInstance+0x7f79d:
00000000`1e5c44dd 8908            mov     dword ptr [eax],ecx ds:002b:00000000`00000000=????????
```

- When you reach the point where the process crashes or hangs, now you need to create a memory dump.
- The command you want to type is `.dump /m C:\filename.dmp`
- Whenever you want to detach WinDbg from the process, just go to Debug > Detach Debuggee. If the process had crashed, it will then crash as usual. If it was running normally, it will continue running normally. If the process is running normal and hasn't crashed yet, you will need to go to Debug > Break first before Detaching.

## Analyzing a Memory Dump

- Be sure to add symbol file path.
- In WinDbg, File->’Open Crash Dump’, and point to the dump file. WinDbg will show you the instruction your app was executing when it crashed or was hung.
- `.lastevent`, or, `!analyze –v` will show you the exception record and stack trace of the function where the exception occurred.
- You can also use the `.exr`, `.cxr` and `.ecxr` commands to display the exception and context records.
- Note also that you can change the first-chance handling option for an exception using the `sxe`, `sxd`, `sxn` and `sxi` commands.
- `KB`: stack trace.

## References

- <https://github.com/Windower/Issues/wiki/Creating-crash-dumps-with-Windbg>
- <https://www.codeproject.com/Articles/6084/Windows-Debuggers-Part-A-WinDbg-Tutorial>
