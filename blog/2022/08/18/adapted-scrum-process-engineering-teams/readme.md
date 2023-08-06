---
published: true
tags:
 - Agile Methodology
 - Engineering Leadership
 - Project Management
 - Scrum
 - Software Engineering
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Adapted Scrum Process for Engineering Teams
url-slug: adapted-scrum-process-engineering-teams
first-published-on: 2022-08-18 12:08
last-updated-on: 2023-08-05 22:02
meta:
 description: "Adapted scrum process for engineering teams."
excerpt: "In the past we have discussed a [development methodology](/blog/2019/04/28/development-methodology/) for software engineering teams. This post will discuss an evolution of"
---

# Adapted Scrum Process for Engineering Teams

In the past we have discussed a [development methodology](/blog/2019/04/28/development-methodology/) for software engineering teams. This post will discuss an evolution of that methodology that has now been successfully utilized by multiple teams.

## Background

Most scrum teams do a fair job as far as estimation, story points, assignment, planning, standups, etc. are concerned. However, there can be potential for refining the methodology, specifically as it pertains to prioritization, cross-functional collaboration, formalization of some of the structures and processes around the different roles and responsibilities of the personas in the scrum process.

## Overview

This post will propose some ideas for better ticketing w.r.t. Jira issue types, user stories from Product (both high-level business value and more granular items), product increments per sprint, potentially more structured Product backlogs feeding into engineering team backlogs, more formal and regular backlog refinements, etc. This post outlines the adaptations proposed based off of the scrum based agile development methodology.

## Goals

- Each team in the org will diligently follow the (adjusted) scrum process.
- Each persona in the scrum process will fulfill their responsibilities as outlined in this document.
- The adjusted scrum process will lead to:
  - Better planning and prioritization.
  - Better sprint completion rates.
  - Better cross-functional collaboration.

## Work Items and Jira Issue Types

| Id  | Work Item                | Description                                                            | Jira Issue Type | Backlog   | Lattice                                                                                       |
| --- | ------------------------ | ---------------------------------------------------------------------- | --------------- | --------- | --------------------------------------------------------------------------------------------- |
| 1   | High-Level Objective     | High-level business value/vision                                       | Initiative      | Product   | N/A                                                                                           |
| 2   | User Story               | End-user based user story                                              | Epic            | Product   | Objective                                                                                     |
| 3   | Granular User Story      | Breakdown of end-user user story into something achievable in a sprint | Story           | Product   | Potentially a KR                                                                              |
| 4   | Engg Tech Debt           | Tech debt as determined by Engg                                        | Feature/Task    | Engg Team | Potentially maps to individual objective or high level Tech Debt objective depending on scope |
| 5   | Externally reported bugs | Bugs reported by customers, DS, Services, Product, etc.                | Bug             | Product   | N/A                                                                                           |
| 6   | Engg Team reported bugs  | Bugs found by Engg team                                                | Bug             | Product   | N/A                                                                                           |

## Backlogs

### Product Backlog

- There will be a dedicated backlog in Jira for each Product.
- The Product backlog will contain
  - User stories [Id: 1]
  - Granular user stories [Id: 2]
  - Bugs [Id: 5 and 6]
- Each user story should be a product increment. The granular user stories should be product increments ideally deliverable within a sprint.
- Larger user stories will be lower in the backlog.
- As and when a larger user story is broken down into granular user stories, they should be appropriately linked up.
- Product owner will be responsible for the Product backlog. This includes ordering items in terms of priorities (with discussions with Engineering). A higher priority item typically assigned a corresponding higher Jira priority is expected to be listed above a lower priority item.
- Tickets in the product backlog may not necessarily have the team field assigned, but it recommended best practice to have it assigned.
- Any ideas coming out of ad-hoc discussions, sync meetings, etc. will be translated into user stories and captured in the product backlog as appropriate.
- Bugs reported from UAT, Services, etc. will go into the Product backlog.

### Engineering Team Backlog

Engineering Team backlog may contain work items across Product areas. It will also be a parking spot for all engineering tech debt items. Tickets in the engineering team backlog will have the team field assigned. Any ideas coming out of ad-hoc discussions, sync meetings, etc. that are more of engineering tech debt will be captured in the engineering team backlog as appropriate.

## Flow of Work Items

- Product owner to define high-level objective.
- Product owner to define end-user based user story for each high-level objective. There will typically be multiple user stories for each objective. A User Story will map to a Lattice Objective.
- Product owner to work with engineering team (primarily lead and manager) to break down a User Story to granular user stories. A granular user story would typically be something that can be accomplished in a sprint and provides product increment.

### Pre-Sprint Planning Meeting

Before sprint planning meeting, there will be a pre-planning between Product owner, manager and lead engineer. During this time, following will be accomplished:

- Determine which items from the Product backlog (stories, bugs) will be addressed in the upcoming sprint. Add a tag to the items to reflect commitment. Assign sprint.
- Determine which items from the engineering team backlog (tech debt) will be addressed in the upcoming sprint. Add a tag to the items to reflect commitment. Assign sprint.
- If time permits, breakdown a user story in the product backlog into granular user stories.

### Sprint Planning Meeting

During sprint planning,

- Estimate stories, bugs and tech debt items committed to during pre-planning and assign them to team members.
- Load balance as needed.
- If it is determined that certain items previously committed can no longer be worked on in the sprint due to lack of bandwidth,
  - do not assign those items to any team member
  - manager and/or lead to to discuss with corresponding product owner and go from there.

## Backlog Refinement

Product owner will schedule regular backlog refinement sessions with manager and lead. The refinement session will include:

- Prioritization of items in the Product backlog. This will be primarily driven by the Product owner.
- Breaking down larger user stories into granular user stories and subsequently moving these larger user stories towards the bottom of the backlog.
- Discussion and prioritization of engineering tech debt items from the engineering team backlog.

## Research Work Items

When ambiguous work items are planned/scheduled, if it is not possible to break it down into granular concrete deliverables, a commitment for deliverable will only be made towards doing a research spike and not delivering a completed feature. The outcome and deliverable from the research spike will be a design document.

It is important to note that sometimes there will be expectations of delivering some feature within a certain time (say 2 sprints, or a quarter), and the implementation of this feature could very well be ambiguous and necessitate a research spike. So it will be important to try and plan 2 quarters ahead so the research spike can be done in the immediate quarter and the implementation can follow in the next (remains to be seen how this will work out).

## Quarterly Planning

As part of quarterly planning, no later than the middle of the last month of the current quarter, the product owner, manager and lead will start planning for the next quarter. This will involve:

- Product owner driving defining the initiatives.
- Engineering driving breaking down each initiative into relevant epics.
  - Each epic needs to have team, assignee, estimate and target version.
- Engineering breaking down each epic into tickets and/or adding existing tickets from the backlog.
- For generalized tech debt and bugs epics, tickets should be added in from the engineering team's and product backlogs.
- At this point, each ticket parented to a quarterly epic much have the team and target version assigned.
- At this time, a commitment is being made to address each ticket, so an appropriate tag `team-commitment` should be assigned. This tag will then make the ticket visible on the engineering team's backlog.

## Ticket Assignments

### Pre-Sprint Planning

During the pre-sprint planning meeting (between Product owner, manager and lead engineer), stories and tickets bucketed for the sprint will be assigned to `area.jira` and not to any specific team member. The team field will be filled in at this time, if previously not filled in (should be an exception since team field should have been filled earlier). At this time, a commitment is being made to address the ticket, so an appropriate tag `team-commitment` should be assigned, if it was not a ticket considered earlier as part of quarterly planning. This tag will then make the ticket visible on the engineering team's backlog.

### Sprint Planning

Tickets will be estimated and assigned to specific team members.

### Mid-Sprint Additions

Mid-sprint addition (MSA) tickets will be assigned to `area.jira`, and manager and/or lead will be tagged on the ticket to triage. Who will subsequently assign the team field, estimate, assign to a team member and add to the sprint if it is deemed to be a MSA.

### Backlog Refinement

No ticket assignments will be done during the backlog refinement.

## Jira Issue Creation Guidelines

- Each ticket in the engineering team backlog should have a parent epic after a commitment has been made to address the ticket during a quarter as part of quarterly planning, or during (pre-)sprint planning. When creating the ticket, it is not necessary to assign the epic if it is not a commitment for the quarter.
- As and when a story or a bug from the product backlog is committed to for a sprint during the pre-sprint planning meeting, it will be assigned a parent epic. Parent epic will also have be assigned as part of quarterly planning.
- User stories (Id: 1), i.e., Jira (Product) epics will be owned by the product owner. As and when a certain user story / epic is committed to for a quarter then it will be assigned to engineering.
- For each quarter there will be generalized epics for tech debt and bugs (e.g. `Area | Tech Debt - Q1FY23`, etc.).
- Tech debt epics will always be owned by engineering regardless of quarterly commitments.
- Each user story (Id: 1) as captured by a Jira (product) epic will have a definition of done captured in its description.
- Each ticket should have a brief description.
- Bug tickets should have reproducible steps and call stacks where applicable.
- Each ticket much have the correct component assigned.
- Each epic much have the correct component, team and estimate.

## Scrum Personas

### Product Owner

Product manager will fulfill the role of the Product owner. S/he will provide the high-level objective, and will also be responsible for the Product backlog. S/he will be responsible for interviewing end-users, doing market surveys, etc. and coming up with the user stories. The product owner will work closely with the manager and engineering lead(s) and will have shared responsibility to ensure successful delivery of commitments and deliverables.

### Scrum Master

Scrum master will be someone from the engineering team. This does not have to be the manager or the lead engineer. The org will have a pool of certified scrum masters. The role of the scrum master will be to

- run the daily standup.
- understand blockers and work with the manager, lead(s), and/or stakeholders to unblock.
- keep the sprint board up-to-date and drive it towards completion at the end of the sprint.

### Developer

The developer(s) will work on items in the sprint board and will be responsible for getting each assigned work item done.

## Other [WIP]

- Trimming large team backlogs?
  - Close tickets older than 4 or 5 years?
- What is feature complete? When can a user story (Id: 1), as captured by a Jira (product) epic, be closed?
  - Functionality vs. bugs?
  - Testing coverage?
