---
published: true
tags:
 - Agentic Coding
 - Coding Agents
 - AI Agents
 - Generative AI
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Things to be Aware of While Using AI Coding Agents
url-slug: things-to-be-aware-of-ai-coding-agents
first-published-on: 2025-08-27 18:20
last-updated-on: 2025-08-27 19:19
meta:
 description: "Things to be aware of when using AI coding agents"
excerpt: "A lot of engineers and engineering organizations have been very successful in quickly"
---

# Things to be Aware of While Using AI Coding Agents

A lot of engineers and engineering organizations have been very successful in quickly embracing AI (agentic) coding tools such as Cursor, WindSurf, Cline and Claude Code. However, we need to keep a few things in mind:

- Trust but verify: Do not merge any AI generated code without understanding what it does.
- Responsibility: Developers and PR reviewers are both responsible for ensuring that AI generated code is functional, robust and reliable.
- Unit Tests: Leverage AI to create as many unit tests as possible. Use mocks as applicable, specially for features that involve UI.
- Very targeted prompting: Use AI with very targeted prompting. Do not trying to build a full feature using a single high-level prompt. Be aware of the context window. Plan out your implementation, write it down in a markdown file, and then use AI to **help** implement step-by-step in a methodical manner.
- Planning before coding: Related to above point, Claude Code plan mode should be leveraged as much as possible. Similar mechanism can be used on Cursor even though a dedicated plan mode may not exist there (at least it did not few months back; I have since moved from Cursor to Claude Code).
- Managing memory: Related to the aforementioned points about context windows and planning, when using Claude Code, leverage the `/memory` command. A more custom mechanism is to use sessions. See more [here](https://github.com/manastalukdar/claude-devstudio?tab=readme-ov-file#-session--project-management). It is pertinent to mention that working across context windows through compression can be expensive, so planning and executing on small steps, and/or going sessions which can be resumed across context windows is recommended.
- Use AI as an enabler not replacement (yet). While we certainly want to embrace tools that enable higher productivity, at this point in time I would be wary of losing skills I have acquired over several years \[see [this](https://arxiv.org/abs/2506.08872) (for essays but concept applies) and [this](https://www.youtube.com/watch?v=5yE5EMAitMM)\]. And I say this even though I am not a puritan. So, please read through and fully understand any AI generated code before merging.

**Further reading**

- https://agentic-coding.github.io/#principles
- https://www.anthropic.com/engineering/claude-code-best-practices
