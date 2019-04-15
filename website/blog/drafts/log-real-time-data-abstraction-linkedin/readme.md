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
 - Learning
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Summary of LinkedIn Engineering Blog Post on Logs
url-slug: log-real-time-data-abstraction-linkedin
first-published-on: 2019-04-08
last-updated-on: 2019-04-08
meta:
 description: "Summary of LinkedIn Engineering Blog Post on Logs."
excerpt: "Summary of LinkedIn Engineering blog post discussing how to use logs for data integration, real time processing, and system building."
---

**Note**: The content below is from the [original blog post](https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying). This post contains notes as I read through the original post and extracted key points. All credit goes entirely to the original author and this post here is merely an effort in summarizing his post.

# The Log: What every software engineer should know about real-time data's unifying abstraction

- [The Log: What every software engineer should know about real-time data's unifying abstraction](#the-log-what-every-software-engineer-should-know-about-real-time-datas-unifying-abstraction)
  - [Part One: What Is a Log](#part-one-what-is-a-log)
  - [Logs in databases](#logs-in-databases)
  - [Logs in distributed systems](#logs-in-distributed-systems)

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

Over-time the usage of the log grew from an implementation detail of ACID to a method for replicating data between databases. It turns out that the sequence of changes that happened on the database is exactly what is needed to keep a remote replica database in sync.

The use of logs as a mechanism for data subscription (for external entities) seems to have arisen almost by chance. But this very abstraction is ideal for supporting all kinds of messaging, data flow, and real-time data processing.

## Logs in distributed systems

The two problems a log solves — ordering changes and distributing data — are even more important in distributed data systems.

The log-centric approach to distributed systems arises from a simple observation that I will call the State Machine Replication Principle:

_If two identical, deterministic processes begin in the same state and get the same inputs in the same order, they will produce the same output and end in the same state._

[Determinism](http://en.wikipedia.org/wiki/Deterministic_algorithm) means processing is independent of any factor of time or order.

The _state_ of the process is whatever data remains on the machine, either in memory or persisted on disk, at the end of the processing.

With regards to distributed systems, the problem of making multiple machines all do the same thing reduces to the problem of implementing a distributed consistent log to feed as input to these processes. The purpose of the log here is to squeeze all the non-determinism out of the input stream to ensure that each replica processing this input stays in sync.

The time stamps that index the log now act as the clock for the state of the replicas.

There can be many ways of applying this principle depending on what is put in the log. As long as two processes process the inputs in the same way, the processes will remaining consistent across replicas.

Uses of logs is described differently by different users. Database people generally differentiate between _physical_ and logical _logging_. Physical logging means logging the contents of each row that is changed. Logical logging means logging not the changed rows but the SQL commands that lead to the row changes (the insert, update, and delete statements).

The distributed systems literature commonly distinguishes two broad approaches to processing and replication.

1. State machine model: Usually refers to an active-active model where we keep a log of the incoming requests and each replica processes each request.
2. Primary-backup model (A slight modification of state machine model): Elect one replica as the leader and allow this leader to process requests in the order they arrive and log out the changes to its state from processing the requests. The other replicas apply in order the state changes the leader makes so that they will be in sync and ready to take over as leader should the leader fail.

![Primary-Backup and State-Machine models](https://content.linkedin.com/content/dam/engineering/en-us/blog/migrated/active_and_passive_arch.png)

As an example consider a replicated "arithmetic service", which has a number as its state and applies arithmetic operations to this value.

1. Active-active mode: Log out the transformations to apply: "+1", "*2", "-4", etc. Each replica would apply these transformations and hence go through the same set of values.
2. Active-passive mode: single master execute the transformations and log out the _result_, say "1", "3", "6", etc.

It should be obvious that ordering is key for ensuring consistency between replicas. Reordering an addition and multiplication will yield a different result.

The distributed log can be seen as the data structure which models the problem of consensus. A log, after all, represents a series of decisions on the "next" value to append.

Log is not apparent in Paxos, where it is accomplished using an extension of the protocol called "multi-paxos", which models the log as a series of consensus problems, one for each slot in the log.

In other protocols such as ZAB, RAFT, [Viewstamped Replication](http://pmg.csail.mit.edu/papers/vr-revisited.pdf), log is more prominent, as these protocols directly model the problem of maintaining a distributed, consistent log.


