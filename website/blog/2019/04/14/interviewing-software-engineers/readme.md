---
published: true
tags:
 - Interviewing
 - Technical Interviews
 - Software Engineer Interview
 - Engineering Management
 - Engineering Leadership
 - Hiring
 - Recruiting
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Interviewing Software Engineers
url-slug: interviewing-software-engineers
first-published-on: 2019-04-14
last-updated-on: 2019-04-14
meta:
 description: "Methodology for interviewing and hiring high calibre software engineers."
excerpt: "I have been interviewing software engineer candidates, both new grads and experienced candidates, for many years now. Over the years I have settled down on a pattern of questions that have resulted in hiring excellent software engineers with a high degree of probability."
---

# Interviewing Software Engineers

${toc}

I think there are broadly 3 types of software engineers:

1. The heavy hitter.
2. The situation cracker.
3. The incompetent.

Obviously we never want to hire the incompetent and it should be fairly easy to weed them out. So, the goal of interviewing candidates for a software engineering position is to ideally always hire the heavy hitter. But the heavy hitting candidates are few and the competition for them is very intense. So there are times, when we may want to find the right kind of situation cracker candidate. The issue with situation crackers is that if you hire the wrong type, given that they are, in my observation, prone to political proclivities, they can cause runtime problems in a team or org. So, I believe we should look for the the situation cracker candidate, who demonstrates strong technical skills and who may ideally have certain personality traits^[Speak up, convey opinion and even disagree, but focus on getting work done.]. These types of situation crackers, again in my observation, are focussed more on getting work done rather than indulge in disruptive machinations. It is also my belief, not without reason, that the technically strong situation cracker, with the right mentoring, can ramp up to be a heavy hitter.

I have been interviewing software engineering candidates, both new grads (B.S., M.S., PhD) and those with industry experience, for many years now. Over the years I have settled down on a pattern of questions that have resulted in hiring excellent software engineers with a high degree of probability. Given that I meticulously maintain records of every single candidate I have ever interviewed along with my detailed notes and feedback I have submitted to the recruiting team, it was a relatively straight-forward process to mine that data and obtain patterns of questions that worked for finding the top candidates.

It is pertinent to mention that I often get candidates who are not from a CS background, i.e., their degrees may be in Electrical, Mechanical, Chemical Engineering, or perhaps in Physics, or BioChemistry, etc. Many of these candidates are straight out of school and so I believe it is important to make a distinction between them, and candidates who have graduated with a Computer Science or in some cases Computer Engineering degree. The distinction arises primarily due to the fact that the former pool of candidates, specially the new grads, almost always have had no exposure to Data Structures and Algorithms coursework, either in School or on their own. The relevance of this distinction and its application in my interviewing process is addressed later in this post.

## Communication Skills

The first thing I have a candidate do is pick any project from their resume and talk about it in no more than 3-4 minutes. The purpose of this exercise is to evaluate:

1. How well can the candidate communicate their previous accomplishments?
2. How passionate is the candidate about their work?
3. If it was a team project:
     1. What was the candidate's individual contribution in the project?
     2. Is the candidate focussing on the "we" vs. the "I"?
     3. How well do they work in a team?
     4. How do they perceive work done by the team vs. work done by themselves individually?
4. How much information can the candidate convey in as precise and concise a form?
5. How good is the candidate in technical communication?
6. If the project is in an area that I, as the interviewer, do not possess knowledge of, how well can the candidate help me understand the new information?

I have follow-up questions that lead into a conversation for another 3-4 minutes.

One important goal of this round is to help the candidate become comfortable before we dive into the more technical evaluations.

## Technical Evaluation

In general, for the technical portion of the interview, I like to follow the following question patterns. Not all candidates get all questions, which in part is determined by the candidate's background.

1. Do time complexity analysis of a well known (easy level) algorithm. CS grads are expected to get this unequivocally correct.
2. I have candidates read through some sample C++ code with issues in it and and then I ask related questions – improve code, find mistakes, etc. The candidate is always free to ask for clarification on any method signature or language semantics, since the purpose is not to test them for C++ proficiency, but general programming practices.
3. I have candidate read through some sample C# code that for the most part is quite straight-forward, and tell me what the code is doing. There are however some .NET specific data structures in the code that I do not expect anyone who has not seen that before to know exactly its purpose. So, the candidate's logical reasoning ability is also tested as part of this exercise.
4. System design questions usually around a SaaS product that has multiple types of architectural patterns.
5. Questions around abstraction patterns involving interfaces, abstract classes, virtual methods.
6. Design pattern questions. CS grads get the harder questions on design patterns.
7. Write pseudo code for a simple problem, such as - get user name & password from user and compare to actual.
8. Write a program in language of choice for a data structure and algorithms problem (easy to moderate difficulty), including doing time and space complexity analysis. CS grads are expected to get the complexity analysis right.
9. A hard data structure and algorithms problem, if there is time, maybe on dynamic programming or graphs.

### Data Structures and Algorithms

Since the last few years there has been a strong trend in the industry towards asking data structures and algorithms questions that largely follow the LeetCode pattern. It is interesting that this trend was originally started, for the most part, by the CTCI book, and has since moved on to LeetCode. I know of places that provide a LeetCode-type, question and will fail the candidate if s/he fails to provide compilable code (on the whiteboard) with all edge-cases covered. I do not follow this process. I think it is important to ask the candidate data structures and algorithms question, but with the following points in mind:

1. Candidate should have the option of using either the whiteboard or a laptop with their IDE of choice.
2. If a candidate chooses to use a Laptop with an IDE, I expect them to have compilable code.
3. Candidate should be free to ask and/or look up method signatures and/or language semantics. If they use an IDE on a laptop, they should be able to use auto-complete, intellisense, etc. I test candidates on logical thinking ability, not on memorization of programming language semantics.
4. The correct algorithm is more important than having every single edge case covered.
5. Writing clean, abstracted code is important.
6. Being able to do time and space complexity analysis is important.
7. I start with an easy problem and then move to a moderately difficult one, and then if there is time, to a hard problem. The more the difficulty level of the problem, the lower the expectation of having fully working code. However, getting the correct algorithm is imperative in all cases.

### System Design

With the trend in the industry from monolith to microservices, System Design has generally come to denote large scale distributed system design. However, system design may also include object modelling. Generally, I have questions around following topics.

1. Different architectures for SaaS products/web services – pros and cons of different approaches. For example: what if UI logic and business logic is in same back end server vs. in different servers, etc.
2. Depending on the candidate, sometimes this discussion veers into topics involving scalability, resiliency (including API resilience patterns) and security.
3. If the candidate has relevant industry experience, there may be questions around data consistency models, linearizability, synchronous vs. asynchronous processing patterns, latency, throughput, etc.
4. A new grad candidate with no experience in distributed computing may get an object modeling question with expectation of not just data models, but also API design.

## Experienced Candidates

For experienced candidates, I go through their resume and based on their background, and the requisition requirement, I create a set of technical questions and problems. Obviously, a candidate with industry experience is almost always held to a higher standard than a new grad. But, by and large, the skills they are tested for broadly follow the same aforementioned patterns.

## The Successful Candidate

The successful candidate would have demonstrated the following skills:

1. Communications
   1. Good technical communication ability. [**must**]
   2. Generally good communicator with ability to convey information in concise form. [**good to have**]
2. Technical
   1. Logical thinking ability. [**must**]
   2. Good coding ability. [**must**]
      1. Time and space complexity analysis. [**necessary**]
      2. Ability to write clean, abstracted code. [**must**]
   3. System design skills. [**must**]

The degree to which the above skills would have to be demonstrated in order for a candidate to be successful varies between a new grad and someone with industry experience.

In general, I look for the following attributes in a candidate:

1. Baseline acceptability of technical competence.
2. Ability to learn and grasp new concepts and ability to apply these concepts in new or existing projects while working alone or in a team.
3. Sense of ownership. Does candidate feel passionate about previous work? Will s/he take ownership of the work they might do at their new workplace? Will s/he go the extra miles to get something done?
4. Tenacity. Is the candidate going to just give up if s/he runs into a difficult problem? How does the candidate tackle difficult problems - break down into parts, logically reason through seemingly insurmountable issues, etc.?
5. Other
   1. Teamwork: How well will the candidate work in a team? How well will candidate communicate technical information with others?
   2. Culture: How will the candidate fit into the company culture?
   3. Multiplier: Will the candidate add value to the team, org, company by inspiring and motivating others, by going that extra mile? Will candidate take his/her team from A- to A+?
