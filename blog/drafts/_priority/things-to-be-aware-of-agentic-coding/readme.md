---
published: false
tags:
 - Agenric Coding
 - Coding Agents
 - AI Agents
 - Generative AI
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Things to be Aware of While Agentic Coding
url-slug: things-to-be-aware-of-agentic-coding
first-published-on: 2025-07-24 20:01
last-updated-on: 2025-07-24 20:01
meta:
 description: "Things to be aware of when using coding agents"
excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt"
---

# Things to be Aware of While Agentic Coding

A lot of engineers and engineering organizations have been very successful in quickly embracing agentic coding tools such as Cursor, WIndSurf, Cline and Claude Code. However, we need to keep a few things in mind:

- Trust but verify: Do not merge any AI generated code without understanding what it does.
- Responsibility: Developers and PR reviewers are both responsible for ensuring that AI generated code is functional, robust and reliable.
- Unit Tests: Please leverage AI to create as many unit tests as possible. Use mocks as applicable, specially for features that involve UI.
- Very targeted prompting: Use AI with very targeted prompting. Do not trying to build a full feature using a single high-level prompt. Be aware of the context window. Plan out your implementation, write it down in a markdown file, and then use AI to **help** implement step-by-step in a methodical manner.
- Planning before coding: Related to above point, Claude Code plan mode should be leveraged as much as possible. Similar mechanism can be used on Cursor even though a dedicated plan mode may not exist there (at least it did not ~3 weeks back; I have since moved from Cursor to Claude Code).
- Use AI as an enabler not replacement (yet). While we certainly want to embrace tools that enable higher productivity, at this point in time I would be wary of losing skills I have acquired over several years \[see [this](https://arxiv.org/abs/2506.08872) (for essays but concept applies) and [this](https://www.youtube.com/watch?v=5yE5EMAitMM)\]. And I say this even though I am not a puritan. So, please read through and fully understand any AI generated code before merging.

Further reading:

https://agentic-coding.github.io/#principles
https://www.anthropic.com/engineering/claude-code-best-practices
