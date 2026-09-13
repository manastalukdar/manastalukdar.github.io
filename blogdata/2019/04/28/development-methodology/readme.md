---
published: true
tags:
 - Engineering Leadership
 - Project Management
 - Software Engineering
 - Agile Methodology
 - Scrum
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Development Methodology
url-slug: development-methodology
first-published-on: 2019-04-28 01:15 pm
last-updated-on: 2019-11-04 23:18
meta:
 description: "An exposition of the software development methodology in engineering teams I run."
excerpt: "Software Engineering teams I run follow agile development process, specifically scrum, or a close variation of it."
---

# Development Methodology

${toc}

Software Engineering teams I run follow agile development process, specifically scrum, or a close variation of it.

## Area Paths

I like to have the following area paths (or tags) defined, with adaptations for a team and/or project as needed:

- Core
- CI-CD
- Configuration and Management
- Documentation
- External Dependencies
- Health and Diagnostics
- Platform and Infrastructure
- Profiling
- Security
- Software Reliability

## Work Items

There are essentially three types of work items I like to use:

- Epics: Maps to very high-level definitions, usually aligned with customer requirements. Such as health monitoring, data egress, search, etc.
- Features: One of more features are created for each Epic.
- Backlog Items: One or more backlog items are created for each Feature.

Epics are managed at the Program level, features and backlog items at the team/project level. I work with program and product management to manage the features. Program management works with me to manage the Epics.

## Backlog Item

I like to use two types of backlog items:

- Product backlog item: Maps to a parent feature.
- Bug

The team maintains a backlog with any team member being able to create backlog items. The person creating the backlog item needs to enter a description, an acceptance criterion and assign it to the right area path. Additionally, s/he needs to notify me, the Engineering Manager, that this new backlog item has been created. I then verify that the work defined is appropriate and make any edits if needed. I will also make sure that the backlog item has a parent feature, if it is not a bug.

## Work Item States

Work items in the backlog can have any of the following states:

- New
- Approved
- Committed
- Done
- Removed

## Product Backlog Board Columns

The product backlog board have the following columns:

- New (maps to `New' state)
- Inbox (maps to `New' state)
- ToDo (maps to `New' state)
- Approved (maps to `New' state)
- In Work (maps to `Committed' state)
- Code Review (maps to `Committed' state)
- Done (maps to `Done' state)

Newly added backlog items default to the `New` column in the with a `New` state.

As discussed above, items with the `New` state map to the following columns: `New`, `Inbox`, `ToDo` in increasing order of priority. These columns are in the left-to-right order. Items in each column move lower in priority as we move down.

## Pre-Sprint Planning

Once a backlog item is approved it is pulled into the `Approved` column. This happens as part of pre-sprint planning.  I, the Engineering Manager, make this decision after discussions with the technical lead, product manager, program manager, architect, etc. Subsequently, I will populate next sprint backlog using a sub-set of the approved backlog items. I will also pull in the features corresponding to the approved backlog items into the appropriate board column and iteration path.

## Length of Sprint

When I first started working in teams using sprints, as an individual contributor some years back, I experienced 4-week sprints. Since then I have tried 2- and 3-week sprints, both as IC and Manager. I believe 3 week hits the right balance, and that is what I use in my teams at this point.

## Sprint Planning

The next step is sprint planning. During this process the team will:

  1. Go through and cleanup current sprint backlog.
  2. Discuss if any other backlog items need to be addressed during the next sprint, and if so, I will have the call if it needs to be pulled into the bucket for the next sprint.
  3. Estimate effort points for next sprint backlog items using planning poker.
  4. Fill in capacity details for each team member for the next sprint.
  5. Assign the items for next sprint backlog items to developers. I do this considering the following points:
     1. Which developer is best placed to work on the backlog item to get it done most efficiently.
     2. Is a developer getting compartmentalized into a specific part of the project? If so, backlog items need to be spread around.
     3. Is any developer expressing interest to work on a specific backlog item?
     4. Have effort points been uniformly distributed across the team members, weighted by developer experience level, career plans, etc. I have a python script that queries the project metadata and provides this information based on (predefined) coded parameters.
  6. Mark assigned work items as `Committed`.
  7. Do a retrospective for current sprint.
     1. What went well?
     2. What could have we done better?
        1. Does this section include anything that was mentioned in previous sprint retrospective(s), and if so, I take an action item to investigate why this matter is yet unaddressed.

Then, the assignee/owner of each backlog item for the next sprint will break down the backlog item into tasks and assign them appropriately. While it is common for all tasks under a backlog item to have the same assignee as the parent backlog item, it is quite possible to divide up the tasks between multiple team members if necessary. The main goal of the assignee of the parent work item is to shepherd the work involved in completing the backlog item.

Each parent backlog item will almost always have a common task: "Code Review". This will be assigned to the developer who will review the related PR for the backlog item. If multiple developers need to review the PR, there will be a "Code Review" task for each developer. The Engineering Manager is not precluded from performing code reviews.

Sometimes a "Approve WI" task may be created. This will typically be assigned to the Engineering Manager, sometimes to the Technical Product Manager. The work involved here is to verify that the functionality as desired as a result of the work done in the backlog item is as expected. This is usually from a user perspective. The functionality validation as part of "Approve WI" task can happen before or after the PR has been completed. But it needs to wait for the "Code Review" task(s) to be completed, i.e., for developers to approve the PR.

  1. If this happens before the PR is completed, verification needs to be run against the test environment - but first there is a need to make sure that latest code from the feature branch corresponding to the backlog item has been deployed to the correct test environment.
  2. If this happens after the PR is completed, along with the test environment, verification can also be run against the integration or staging environment after latest merged code is deployed from the `develop` branch.

## During the Sprint

It is the responsibility of the owner of a backlog item to make sure all child tasks are done and closed out before the end of the sprint, and then also close out the backlog item itself.

It is the responsibility of the assignee of a task to update the remaining hours diligently so that the sprint burn-down chart accurately reflects the work-in-progress and the work details correctly displays the remaining work in hours per developer.

I keep a close eye on the sprint backlog to make sure that the burn-down looks fine and that no developer is overloaded or falling behind in terms of the capacity and work remaining in hours. If necessary, I orchestrate any load balancing so that as a team we can deliver on all committed items at the end of the sprint.

## Summary

At the end of the day, the process defined above is a framework. Adaptations have to be made based on team, company culture, etc. It is key that the process should not hinder the people. Rather, processes should facilitate empowering and helping people. The EMs role is to adapt the process to facilitate and ensure team productivity.
