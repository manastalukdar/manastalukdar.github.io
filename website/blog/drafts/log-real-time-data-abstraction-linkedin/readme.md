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
title: Summary of LinkedIn Engineering Blog Post on Logs
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

The ordering of records defines a notion of "time" with left-to-right being older-to-newer. The log entry is analogues to timestamp for the entry. Ordering is decoupled from any physical clock and property is useful for distributed systems. A log is really just a kind of table or file where the records are sorted by time.

Logs have a specific purpose: they record what happened and when. For distributed data systems this is, in many ways, the very heart of the problem.

Application logging that most are familiar with is a degenerative form of the log concept. The biggest difference is that text logs are meant to be primarily for humans to read and the "journal" or "data logs" discussed in the post are built for programmatic access.

## Logs in databases

It is present as early as IBM's [System R](http://www.cs.berkeley.edu/~brewer/cs262/SystemR.pdf). The usage in databases has to do with keeping in sync the variety of data structures and indexes in the presence of crashes. To make this atomic and durable, a database uses a log to write out information about the records they will be modifying, before applying the changes to all the various data structures it maintains. The log is the record of what happened, and each table or index is a projection of this history into some useful data structure or index. Since the log is immediately persisted it is used as the authoritative source in restoring all other persistent structures in the event of a crash.
