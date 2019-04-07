---
published: false
tags:
 - Distributed Systems
 - Cloud Computing
 - Logs
 - Commit Log
 - Transaction Log
 - Real-Time Data
 - Stream Processing
 - LinkedIn Engineering
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Summary of LinkedIn Engineering Blog on Logs
url-slug: log-real-time-data-abstraction-linkedin
first-published-on: 2019-04-06
last-updated-on: 2019-04-06
meta:
 title: Summary of LinkedIn Engineering Blog Post on Logs
 description: "Summary of LinkedIn Engineering Blog Post on Logs."
excerpt: "Summary of LinkedIn Engineering blog post discussing how to use logs for data integration, real time processing, and system building."
---

# The Log: What every software engineer should know about real-time data's unifying abstraction

[log](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying)

Sometimes called write-ahead logs or commit logs or transaction logs, logs have been around almost as long as computers and are at the heart of many distributed data systems and real-time application architectures.

Will discuss how to use logs for data integration, real time processing, and system building.

## Part One: What Is a Log

Perhaps the simplest possible storage abstraction. It is an append-only, totally-ordered sequence of records ordered by time. It looks like this:

![log](https://content.linkedin.com/content/dam/engineering/en-us/blog/migrated/log.png)

Records are appended to the end of the log, and reads proceed left-to-right. Each entry is assigned a unique sequential log entry number.
