---
published: true
tags:
 - Engineering Leadership
 - Software Engineering
 - Growing Teams
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Growing and Developing Software Engineering Teams
url-slug: growing-developing-software-engineering-teams
first-published-on: 2019-09-19 22:33
last-updated-on: 2019-09-19 22:33
meta:
 description: "An exposition of some mechanisms to grow and develop software engineering teams."
excerpt: "A big aspect of Engineering Leadership is growing and developing teams. This is a multi-faceted task that involves a multitude of things."
---

# Growing and Developing Software Engineering Teams

${toc}

A big aspect of Engineering Leadership is growing and developing teams. This is a multi-faceted task that involves a multitude of things. This article will discuss my approach as an Engineering Manager.

## Setting Expectations

I think it is very important to have **well defined roles** within a team and **set very clear expectations** of these roles with each developer in the team depending on his/her role. So for instance, the contours of a role and the expectations from a _Software Developer I_ are different from that of a _Staff Software Developer_. This should be a conversation that the Engineering Manager (EM) has with each employee. This should also be taken into account when developing quarterly/yearly goals and career progression plans, as we will discuss below.

## Identifying and Addressing Gaps

It is the responsibility of the EM to identity gaps within the team.

For the team as a whole this can take the following forms:

- Gap in certain domain expertise. Perhaps the team lacks someone who could take ownership of DevOps. Or, maybe the team does not have anyone who could bring in prior industry experience with microservices.
- Gap in experience level. Maybe there are too many new grad hires in the team^[Which should not have happened in the first place.]. Maybe the team has mostly highly experiences developers^[Which might not necessarily be a bad thing.].

For individual employees this can be:

- Lack of industry experience for a new grad hire.
- Lack of know-how in a certain tech stack. Maybe an employee has worked with on-premises software before and has not has exposure to cloud and distributed systems.

Subsequently, the EM should identify means to address these gaps, for both teams and individual employees.

For the team this could mean hiring developers, helping current developers learn new technologies, etc. For individuals this could imply helping them ramp up by mentoring, providing learning resources, etc.

## Hiring

A big part of an Engineering Manager role is hiring new employees. This involves:

- Identifying gaps and needs (discussed above).
- Working with the recruiting organization to develop a hiring plan.
- Developing a methodology for interviewing software engineers. I have discussed this in details in an earlier [blog post](https://manastalukdar.github.io/blog/2019/04/14/interviewing-software-engineers/).
- Identifying individuals who could take on phone screening and on-site interviewing responsibilities.

## Talent Management

This ties in very closely with the _Identifying and Addressing Gaps_ section above. The EM needs to have a very good handle on

- Any existing gaps within the team, either on the team as a whole or for individual employees.
- The strengths and scope-for-improvements for each employee. The EM should take this into account when assigning work to developers and also when developing goals and career growth plans for each employee.
- Succession plans within the team. For example, the EM should have a good idea about who could take on the role of the _Technical Lead_ in case the current developer in that role moves on to something else. Once again, as in the previous point, when developing goals and career growth plans for each employee, the EM should take into account **where each employee currently stands and where s/he needs/wants to be**.

## Mentoring and Coaching

This is one of the most important aspects of growing teams. It is critically important to ensure both new hires and extant employees get the mentoring and coaching they need to be successful in their job. The EM has a pivotal role to play in this regard.

### Onboarding Plan for New Employees

The EM should establish an on-boarding plan for all new hires. The goal of this plan should be to:

- Provide the employee a technical overview of the team
  - Projects
  - Source code
  - CI/CD pipelines
  - Test infrastructure
  - Dependencies, etc.
- Provide the employee any learning resources if needed. This may include anything specific to the ecosystem of the product the company and/or team works on.
- Assign a technical mentor to the employee. This should be mandatory for all new grad hires. This is an opportunity for the new employee to get a helping hand as s/he ramps up and for the mentor to get some leadership experience. The EM may consider tieing this into a yearly/quarterly goal for the mentor.

### Helping Current Employees

It is not just new hires but extant employees who may sometimes need mentoring or coaching. For example, an employee may be struggling to understand the details of a work item and expects very precise step-by-step elaboration. The EM should coach this developer so that she is able to deal with ambiguity and cultivates the ability to see the bigger picture and ask the right questions. Perhaps an employee is up for promotion but needs to exhibit [certain traits](https://manastalukdar.github.io/blog/2019/04/17/attributes-senior-level-software-engineer/) in order to be promoted to a more senior position. The EM should then mentor this employee and ensure s/he has a definitive plan in order to fulfill the needed criteria for getting that promotion. Another scenario may that an employee could have transferred from a different team working in a very different tech stack and perhaps with a different team culture^[Generally teams within the same org have cultural commonalities, but this is also possible.]. The EM should then help this employee ease into the team culture and also identify learning resources that could help him/her gain the knowledge necessary to be successful.

### Formal Learning Plan

As we have discussed above, it can become necessary for both new and extant employees to utilize learning resources in order to acquire domain knowledge necessary for their job. The EM should work with the employee to put in place a learning plan and set very clear expectations of timelines and outcomes. The EM should identify the right learning tools depending on the employee's needs. This could be on-the-job learning, online/offline classes. If the employee has a mentor (in case of new grad hires), the EM should discuss this plan with him/her.

## Career Progression

The EM should work with each employee to come up with a plan for their professional growth aand career progression. This generally involves:

- Having a conversation with each employee about their interest and career goals.
- Making a determination of each employee's current position is and where s/he wants and/or needs to be.
- Working with each employee to come up with a career progression plan.

### Aligning Work with Interest

While it is important that developers do not get compartmentalized into specific portions of the project, the EM should ensure that each developer gets to work on things that they find interesting. This is specially true for the high performers, who often need to feel challenged. The EM when assigning work items should take into account areas of interest for each developer.

The EM may also use delegation of responsibility to some employees as a means to help them gain some project management and leadership experience. This could be getting an employee to sometimes run daily standups, getting an employee to represent the team in some meeting, making a presentation to stakeholders, etc.

### Creating a Career Progression Plan

The EM should work with each employee to create a formal career progression plan. This should define what the employee needs to accomplish in order to move to the next step in their career. The needs should be quantitative and measurable and expectations should be set with regards tentative timelines. **The goal of this exercise is not simply to promote the employee but to set them up for success**, so that if they move to a different team or a different company they can look back and confidently say that the skills they acquired, the things they learnt have stood them in good stead.

## Having Measurable Goals

The EM should work with each employee to create some yearly goals, which should then be further refined to a quarterly granularity.

These goals should align with:

- The org level goals.
- The team level goals.
- The employee's career progression plan.

The goals should be measurable and very clear expectation should be set, in discussion with each employee, as regards what constitutes successful completion for each goal.

OKRs are a common methodology for setting and tracking goals.

I like to break down goals for my employees into the following broad categories:

- **Leadership:** This could be mentoring a new grad hire. Or, taking end-to-end ownership of a feature development.
- **Learning:** Involves taking any online/offline classes that is aligned with what the EM would be identified as a gap that needs to be addressed. Or, perhaps attending a technical conference.
- **Recruiting:** This is going on campus visits, taking phone screens or doing on-site interviews.
- **Other:** This is a catch-all for anything that does not fall in the previous categories. Could be something like perhaps going on a customer visit, maybe working on a side project^[Generally has to be aligned with the business needs of the company], or getting interaction with stakeholders.

## Team Building

It is the EM's responsibility to create and manage a coherent, efficient and productive team. Part of that is **establishing a set of values within the team**. These values should be aligned with the company and org values and culture. While I have a certain set of values I strive to establish within my teams, I will not discuss them in this post.

### Building Trust

Getting a group of people from diverse background to work together is imperative for being a successful EM. Building trust between employees and between the employees and their EM is crucial to accomplish this. I think the following are important mechanisms to build trust.

- Applies to all team members:
  - Listening.
  - Respecting others' opinions.
- Applies to EM:
  - Praise and reward: The EM should give credit to developers for (consistently) delivering on work and reward them appropriately be it through compensation, promotion or additional responsibilities.
  - Do not micromanage: People usually do not work very well if they feel that there is always someone breathing down their neck.

I believe something that is common to most people in the tech industry is our love for technology. The EM should strive to reinforce this common feature and ensure that people within the team work together to deliver on committed work. When two or more people work together to get work done on something they all love and enjoy, that goes a long way in building trust and comradery.

### Team Activities

The EM should organize team events every so often, org logistics permitting. This can be team lunches/dinners, or specific team building exercises.

## Getting and Giving Feedback

Regular One-on-One (1-1) should be scheduled between the EM and each employee. The 1-1 should me a mechanism for the EM to:

- Keep track of the employee's progress with their yearly/quarterly goals.
- Provide the employee an opportunity to speak on anything on their mind.
- Have a frank conversation with the employee about the team health from their perspective.
- Ask the employee for feedback on anything the EM could do to help him/her or the team.

The 1-1 should really be one of the primary mechanisms for the EM to keep his/her hand on the team's pulse. the EM should take notes on the conversations during these 1-1 and follow up on action items if any.
