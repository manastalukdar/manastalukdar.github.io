---
published: yes
tags:
 - Engineering Leadership
 - Documentation
 - Software Engineering
 - Architecture Decision Record (ADR)
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Software Engineering Architecture Decision Records (ADR)
url-slug: software-engineering-architecture-decision-records
first-published-on: 2023-03-18 13:44
last-updated-on: 2023-03-18 13:44
meta:
 description: "A discussion of Architecture Decision Record (ADR) and a proposed template."
excerpt: "Architecture Decision Record (ADR) is a point-in-time log entry of a design and/or architectural decision. This is usually the result of..."
---

# Software Engineering Architecture Decision Records (ADR)

${toc}

## Overview

Architecture Decision Record (ADR) is a point-in-time log entry of a design and/or architectural decision. This is usually the result of a pointed decision / discussion rather than a played-out design review process. ADR should also typically only address a specific problem / concern and it should be concise and lightweight as compared to design documents.

There is a certain inter-play between ADR, 𝗥𝗙𝗖 (Request for Comments) and design documents. Sometimes ADRs are used as feeders for RFCs, but that is not necessary a hard and fast rule.

We will discuss RFC and design documents in separate posts. This post outlines a template for capturing a ADR.

## Template

### Title

A short title summarizing the documented decision.

| Metadata                    | Value(s)                                                       |
| --------------------------- | -------------------------------------------------------------- |
| Status                      | Draft / Proposed / Under Review / Unknown / Accepted / Amended |
| Date Created                | [optional]                                                     |
| Date Last Updated           | [optional]                                                     |
| Last Updated By             | [optional]                                                     |
| Author(s)                   |                                                                |
| Engineering Team(s)         |                                                                |
| Engineering Lead            |                                                                |
| Primary Product Stakeholder |                                                                |
| Other Stakeholders          |                                                                |
| Reviewer(s)                 |                                                                |

### Problem Statement

### Motivation and Context

Discussion of the technical and/or business requirements / use-cases that was the motivation for this decision.

### Decision

Discussion of the decision with all relevant details.

### Consequences

Discussion of problem mitigation. Tradeoffs and risks (including short-term and/or long-term) should also be covered.

### Alternatives

List of any alternatives that were considered with their pros and cons.

### Next Steps

Who will implement, who is responsible for review, which team, etc.

## References / Further Reading

- [DOCUMENTING ARCHITECTURE DECISIONS](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)
- [mrwilson/adr-viewer](https://github.com/mrwilson/adr-viewer)
- [Architectural Decision Records (ADRs)](https://adr.github.io)
