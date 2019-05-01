---
published: true
tags:
 - Engineering Leadership
 - Project Management
 - Software Engineering
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Area Champions in Software Engineering Teams
url-slug: area-champions-software-engineering-teams
first-published-on: 2019-05-01 12:56 pm
last-updated-on: 2019-05-01 12:56 pm
meta:
 description: "A methodology for keeping software engineers interested and engaged, preventing compartmentalization and spreading knowledge across the team."
excerpt: "An important goal in running software engineering teams is ensuring software engineers remain interested and engaged in their work."
---

# Area Champions in Software Engineering Teams

${toc}

## Introduction

An important goal in running software engineering teams is ensuring software engineers (or developers) remain interested and engaged in their work. This can be accomplished by assigning work to each developer that they find interesting and challenging. However, a common pitfall many engineering managers fall into is repeatedly assigning developers work from a part of the project that they are quite familiar with. This could be because the developer assigned that work was the original programmer who wrote it, or was actively involved in its implementation. Obviously, there is a speed advantage in this approach, but I believe that it is not particularly positive for the long term health of a team.

I think it is inevitable that a software engineers who wrote a piece of code or was heavily involved in its implementation will always know a little bit more about it than another developer in the same team. And this is fine. But, a situation where team members are compartmentalized into distinct portions of the project should be avoided. Spreading work from different portions of the project across the different software engineers in the team also has the advantage of spreading knowledge across the team. So if someone goes on extended vacation, things still keep running smoothy.

My approach to solving this problem is by a methodology I like to call "Area Champions".

## Area Champions - The Areas

I form broadly four areas within my engineering teams (with adaptations for a team/project as needed):

1. Security
2. Ops
   1. Service Ops
   2. Dev Ops
3. Reliability (QA, profiling/performance, etc.)
4. Core functionality - Depending on the team/project sometimes this is broken down into multiple areas.

## Rotating Role

Each area has a single team member as the champion for that role. The duration for a person to be in that role is at minimum that of a Program. At the end of the stint, another team member moves into the role.

As discussed before, the rotation of the Area Champion is to ensure:

1. No compartmentalization of any developer into a specific area of the project.
2. Spreading of knowledge across the team.

I take into account developer interest when assigning them to a specific Area Champion role.

## Goals and Measure of Success for an Area Champion

I, as the Engineering Manager, work with each Area Champion for clearly defining the necessary criteria for that person to be successful during their rotation. To that end, we make efforts to define success in terms of measurable and quantifiable results as much as possible.

I work with each incoming Area Champion for a role to:

1. Define and document scope and goals right before or during the start of rotation.

I work with each outgoing Area Champion for a role to:

1. Documents results at the end of rotation relative to the stated goals during the start of their rotation.
2. Add to the existing corpus of knowledge for that particular area (wiki articles, documents, runbook updates, etc.) as applicable. Sometimes this is defined as a goal in itself.

I continually work with each Area Champion during the course of their rotation to keep track of their progress relative to the stated goals during the start of their rotation and provide any guidance and/or assistance as necessary. Typically the recurring 1-1 is the primary mechanism to orchestrate this, but other avenues are also sometimes utilized.

Some examples of goals are:

1. Improve Ops documentation.
2. Add new wiki article documenting process for upgrading platform runtime and SDK on cluster.
3. Add new wiki article documenting mapping between storage accounts and clusters.
4. Decrease build runtime by 15%.
5. Improve Security Development Lifecycle (SDL) score for the team across 3 categories (x, y. and z) by 50% for each category.
6. Increase test coverage for the codebase by 30%. (Note: Does not imply that the Area Champion will write all the tests to increase the code coverage.)
7. Increase response time for all REST calls into the _abc_ microservice by 10%.
8. Decrease latency for all incoming calls into the _pqr_ microservice by 20%.
9. Decrease test failures for nightly test runs by 60%.

## Summary

I have formed Area Champions in most teams I have managed and it has worked out quite well. It has also helped software engineers grow in their careers by challenging them to learn more about something that initially might have been relatively unfamiliar to them. Furthermore, by making the goals measurable we are able to show success in a very data-driven quantifiable manner. More importantly, it has ensured that software engineers in my teams, while each no doubt having inclinations towards certain aspects of the projects, are always ready and able to take on work from any part of the project. As developers move across different Area Champion roles, we iterate over our documentation and processes and continually improve them over time. This keeps teams running like well-oiled machines and keeps developers interested and engaged.
