---
published: true
tags:
 - Interviewing
 - Technical Interviews
 - Software Engineer Interview
 - Engineering Leadership
 - Hiring
 - Recruiting
 - Software Engineering
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Interviewing Software Engineers
url-slug: interviewing-software-engineers
first-published-on: 2019-04-14 1:20 pm
last-updated-on: 2019-07-26 10:38 pm
meta:
 description: "Methodology for interviewing and hiring high calibre software engineers."
excerpt: "I have been interviewing software engineer candidates, both new grads and experienced candidates, for many years. Over time I have settled down on a pattern of questions that probe for certain key traits that has resulted in hiring excellent software engineers."
---

# Interviewing Software Engineers

${toc}

I think there are broadly 3 types of software engineers:

1. The heavy hitter.
2. The situation cracker.
3. The incompetent.

Obviously we never want to hire the incompetent and it should be fairly easy to weed them out. So, the goal of interviewing candidates for a software engineering position is to ideally always hire the heavy hitter. But the heavy hitting candidates are few and the competition for them is intense. So there are times, when we may want to find the right kind of situation cracker candidate. The issue with situation crackers is that if you hire the wrong type, given that they are in my observation prone to political proclivities, they can cause runtime problems in a team or organization. So I believe we should look for the the type of situation cracker candidate, who demonstrates strong technical skills and who may ideally have certain personality traits^[Speak up, convey opinion and even disagree, but focus on getting work done.]. These types of situation crackers, again in my observation, are focussed more on getting work done rather than indulge in disruptive machinations. It is also my belief, not without reason, that the technically strong situation cracker, with the right mentoring, can ramp up to be a heavy hitter. It goes without saying that these categories may have a certain overlap and the boundaries between the top two can sometimes appear to be nebulous.

I have been interviewing software engineering candidates, both new grads (B.S., M.S., PhD) and those with industry experience, for many years now. Over the years I have settled down on a pattern of questions that have resulted in hiring excellent software engineers with a high degree of probability. Given that I meticulously maintain records of every single candidate I have ever interviewed along with my detailed notes and feedback I have submitted to the recruiting team, it was a relatively straight-forward process to mine that data and obtain patterns of questions that worked for finding the top candidates.

It is pertinent to mention that I often get candidates who are not from a Computer Science background, i.e., their degrees may be in Electrical, Mechanical, Chemical Engineering, or perhaps in Physics, or BioChemistry, etc. Many of these candidates are straight out of school and so I believe it is important to make a distinction between them, and candidates who have graduated with a Computer Science or in some cases Computer Engineering degree. The distinction arises primarily due to the fact that the former pool of candidates, specially the new grads, almost always have had no exposure to Data Structures and Algorithms coursework, either in school or on their own. The relevance of this distinction and its application in my interviewing process is addressed later in this post.

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

## Technical Competency

For the technical portion of the interview, I like to follow the following question patterns. Not all candidates get all questions, which in part is determined by the candidate's background.

1. Do time complexity analysis of a well known (easy level) algorithm. Computer Science (CS) grads are expected to get this unequivocally correct.
2. I have candidates read through some sample C++ code with issues in it and and then I ask related questions – improve code, find mistakes, etc. The candidate is always free to ask for clarification on any method signature or language semantics, since the purpose is not to test them for C++ proficiency, but general programming practices.
3. I have the candidate read through some sample C# code that for the most part is quite straight-forward, and tell me what the code is doing. There are however some .NET specific data structures in the code that I do not expect anyone who has not seen that before to know exactly its purpose. So, the candidate's logical reasoning ability is also tested as part of this exercise.
4. System design questions usually around a SaaS product that has multiple types of architectural patterns.
5. Questions around abstraction patterns involving interfaces, abstract classes, virtual methods.
6. Design pattern questions. CS grads get the harder questions on design patterns.
7. Write pseudo code for a simple problem, such as - get user name & password from user and compare to actual.
8. Write a program in language of choice for a data structure and algorithms problem (easy to moderate difficulty), including doing time and space complexity analysis. CS grads are expected to get the complexity analysis right.
9. A medium to hard level data structures and algorithms problem, if there is time, maybe on dynamic programming or graphs.

### Data Structures and Algorithms

Since the last few years there has been a strong trend in the industry towards asking data structures and algorithms questions that largely follow the LeetCode pattern. It is interesting that this trend was originally started, for the most part, by the book "Cracking the Coding Interview", and has since moved on to LeetCode. I know of places that provide a LeetCode-type question and will fail the candidate if s/he fails to provide compilable code (on the whiteboard) with all edge-cases covered. I do not follow this process. I think it is important to ask the candidate data structures and algorithms question, but with the following points in mind:

1. Candidate should have the option of using either the whiteboard, or a laptop with their IDE of choice.
2. If a candidate chooses to use a Laptop with an IDE, I expect them to have compilable code.
3. Candidate should be free to ask and/or look up method signatures and/or language semantics. If they use an IDE on a laptop, they should be able to use auto-complete, intellisense, etc. I test candidates on logical thinking ability, not on memorization of programming language semantics.
4. The correct algorithm is more important than having every single edge case covered.
5. Writing clean, abstracted code is important.
6. Being able to do time and space complexity analysis is important.
7. I start with an easy problem and then move to a moderately difficult one, and then if there is time, to a hard problem. The more the difficulty level of the problem, the lower the expectation of having fully working code. However, getting the correct algorithm is imperative in all cases.
8. For the more difficult problems, candidate should show ability to break down the problems into manageable parts.

### System Design

With the trend in the industry from monolith to microservices, System Design has generally come to denote large scale distributed system design. However, system design may also include object modelling. Generally, I have questions around following topics.

1. Different architectures for SaaS products/web services – pros and cons of different approaches. For example: what if UI logic and business logic is in same back end server vs. in different servers, etc.
2. Depending on the candidate, sometimes this discussion veers into topics involving scalability, resiliency (including API resilience patterns) and security.
3. If the candidate has relevant industry experience, there may be questions around data consistency models, linearizability, synchronous vs. asynchronous processing patterns, low latency and high throughput architectural patterns and the pros and cons, etc.
4. A new grad candidate with no experience in distributed computing may get an object modeling question with expectation of not just data models but also API design including discussions involving abstraction patterns for storage and access layers.

## Inquisitiveness and Ability to Learn New Things

In the tech industry it is fairly common for technologies to rise and fall and and skills to become redundant. So, it is important that a good Software Engineer should:

1. Be inquisitive about new developments in the industry irrespective of whether these new developments are being used or planned on being used by the higher-ups at their workplace.
2. Have the ability to learn new technologies in reasonably quick time and find the resources needed to really understand these technologies to be able to make informed decisions about their pros and cons, etc.

I probe for these characteristics in a candidate by:

- Asking them questions on new developments in the industry related to their background.
- Asking them questions on a topic that most likely they have never worked on. The idea here is to foster a discussion and observe how effectively the candidate can catch on to something that may not be very familiar with.

## Sense of Ownership

Candidate should exhibit a sense of ownership and pride over their work. They should feel passionate about the work they have previously done and will potentially do in their new workplace. Questions on their previous projects and scenario based behavioral questions are useful to get an idea.

## Tenacity

I test for this attribute by observing how a candidate solves a relatively difficult problem, be it a coding or a system design problem. Some candidates just give up, but there are those who keep at it and try different approaches and try to break down the problem into more manageable parts.

## Teamwork

Candidate should show the ability to work successfully in a team. I probe for this by asking questions on previous work and also from scenario based questions.

## Culture Fit

Candidate should have some degree of alignment with the company culture. Scenario based behavioral questions help gauge this.

## Multiplier

Candidate, specially if interviewing for an experienced develop position, should show the likelihood of elevating the team. At the very least, candidate if hired, should not pull the team down for whatever reason.

## Systematic and Methodical Approach

Software engineering, specially while debugging and troubleshooting problems, requires a [methodical approach](https://www.ribbonfarm.com/2009/08/31/how-to-think-like-hercule-poirot/), not quite unlike [being a detective](http://tulosconsultancy.in/blog/order-and-method/). To get a sense of whether the candidate has any sort of proclivity for [order and method](https://www.youtube.com/watch?v=5bGl_v0asbg), sometimes, if the candidate has either done exceptionally well, or particularly bad, I ask them how they go about a project, like doe instance how did they prepare for this interview.

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
3. Inquisitiveness [**necessary**] and ability to learn new things [**must**].
4. Has a sense of ownership and feels passionate about previous work.
5. Tenacity [**good to have**]
6. Teamwork [**necessary**]
7. Culture Fit [**necessary**]
8. Multiplier (or, Bar Raiser) [**good to have**]

The degree to which the above skills would have to be demonstrated in order for a candidate to be successful varies between a new grad and someone with industry experience.

## Summary

In general, I look for the following attributes in a candidate interviewing for a Software Engineer position:

1. Good communicator.
2. Baseline acceptability of technical competence.
3. Generally inquisitive and more importantly has the ability to learn new concepts and apply these concepts in new or existing projects while working alone or in a team.
4. Sense of ownership. Does candidate feel passionate about previous work? Will s/he take ownership of the work they might do at their new workplace? Will s/he go the extra miles to get something done?
5. Tenacity. Is the candidate going to just give up if s/he runs into a difficult problem? How does the candidate tackle difficult problems - break down into parts, logically reason through seemingly insurmountable issues, etc.?
6. Teamwork. How well will the candidate work in a team? How well will candidate communicate technical information with others?
7. Culture fit. How will the candidate fit into the company culture?
8. Multiplier. Will the candidate add value to the team, organization, company by inspiring and motivating others, by going that extra mile? Will candidate take his/her team from A- to A+?

The methodology I have discussed here has worked out quite well for me over the years. I hope that perhaps it may be useful to others as well.
