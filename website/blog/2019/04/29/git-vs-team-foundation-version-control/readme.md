---
published: true
tags:
 - Git
 - Team Foundation Version Control
 - Gitflow
 - Source Control
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Git vs. Team Foundation Version Control
url-slug: git-vs-team-foundation-version-control
first-published-on: 2019-04-29 10:55 am
last-updated-on: 2019-04-29 10:55 am
meta:
 description: "A comparison of Git vs. Team Foundation Version Control with motivations for moving to Git."
excerpt: "The primary motivation for moving to Git is the far better support for branching and merging."
---

**Note**: Some years back I had written up reasons for moving to Git. Looking through some of my old notes I ran into the write-up and decided to make a blog post out of it.

# Git vs. Team Foundation Version Control

${toc}

## 1. Overview

The primary motivation for moving to Git is the far better support for branching and merging. Specifically, the GitFlow branching model (section 3 below) will help manage parallel and distributed development, especially for a distributed team. Git is very widely used and is gradually becoming a source control branching standard. Furthermore, while merging in Git is no silver bullet and we still must do our due diligence, it is reported to be much better than in Team Foundation Version Control (TFVC) (section 2.3, 2.4 and 2.5 below).

## 2. A summary of Git vs TFVC

| Sl. No. | Concept | Git | TFVC | Winner | Comments |
|---------|---------|-----|------|--------|----------|
| 1 | Branching | Trivial and inexpensive. Also, supports local branching. | Expensive. No support for local branching. | Git | Branching takes less time in Git. Getting code also takes less time. |
| 2 | Pull Requests | Allows for anyone to be able to merge into a branch, while keeping track of such pending pull requests. Keeps branch being merged into clean and isolated. Can be further “secured” using build to be triggered on a pull request submission. | Anyone can indeed also merge into a “main/dev” branch, but no way to keep track (or queue) such requests. | Git |  |
| 3 | Merging across branches with no Parent-Child relationship | Easy (supported) | Nightmare | Git |  |
| 4 | Rebasing | Native | N/A | Git | This allows for changesets/commits in a branch to be streamlined into the merged branch [Happy to explain in person or over Skype]. |
| 5 | Merge conflicts | Lesser due to 3-way merging. Also uses some sort of probabilistic algorithm to minimize conflicts. | Relatively more since TFVC does text based merge. | Git | <http://www.drdobbs.com/tools/three-way-merging-a-look-under-the-hood/240164902> <http://www.richard-banks.org/2010/10/why-does-git-merge-work-better-than-tfs.html> |
| 6 | Setting exclusions | Using .gitignore | Using source control explorer? (dr: this is often buggy, though) | Draw |  |
| 7 | Offline access | Native | N/A | Git |  |
| 8 | Speed | Git treats branches as a pointer at a linked list of commits. So downloads, etc. are much faster. |  | Git |  |
| 9 | Usage | Even MSFT is moving to Git. Large community support and help on the web. |  | Git |  |
| 10 | Ease of use | There is a ramp up time needed – not too bad. Sophisticated command line usage also available. |  | ?? | <http://www.continuousimprover.com/2015/06/why-you-should-abandon-tfs-source.html> |
| 11 | Visual Studio support | Yes | Yes | Draw | 3rd party tools are also available for Git. Git repo is not browse-able using Source Control Explorer. |
| 12 | Gated checkins | N/A | Yes | TFVC | In Git this can be accomplished using branching flows and pull requests. |
| 13 | Fast forward merging | Native | N/A | Git | <http://ariya.ofilabs.com/2013/09/fast-forward-git-merge.html> [In general we should avoid fast forward merging so we retain history of commits that were done in a branch] |
| 14 | Checkin policies | Needs some work to make this happen | Native | TFVC |  |
| 15 | Code reviews | Can be accomplished using pull requests | Native - using VS | TFVC |  |
| 16 | Shelving | N/A | Native | TFVC |  |
| 17 | Annotate | N/A | Native | TFVC | <http://weblogs.asp.net/joelvarty/tfs-who-edited-this-text-annotations-in-source-control> |
| 18 | Checkin locks | N/A | Native | TFVC | <https://msdn.microsoft.com/en-us/library/ms181419.aspx> |

## 3. Proposal for new branching framework

The GitFlow branching model is proposed \[[ref](http://nvie.com/posts/a-successful-git-branching-model/)\]. (Diagram at the end of this section)

### 3.1 Main branches

There are two main branches (each of infinite timeline):

- master
- develop

The master branch is at the “root” level. Some also refer to this as the integration branch. Typically, nightly builds run off of this branch. We always deploy to production from the master branch and use tags to keep track of such deployments.

Parallel to the master branch exists the develop branch. All development converges into this branch. When a stable point is reached, all changes are merged back to master and tagged with a release number. Each time when changes are merged back into master, this is a new production release by definition. We need to be very strict at this, so that theoretically, we could use a Git hook script to automatically build and roll-out our software to our production environments every time there was a commit on master.

Then there are three types of supporting branches:

- Feature branches
- Release branches
- Hotfix branches

### 3.2 Feature branches

May branch off from develop. Must merge back into develop. Branch naming
convention: anything except master, develop, release-\*, or hotfix-\*.

### 3.3 Release branches

May branch off from develop. Must merge back into develop and master. Branch naming convention: release-\*.

### 3.4 Hotfix branches

May branch off from master. Must merge back into develop and master. Branch naming convention: hotfix-\*.

I Highly recommend [this](http://nvie.com/posts/a-successful-git-branching-model/) article.

![alt text](http://nvie.com/img/git-model@2x.png)

## 4. How to accomplish some TFVC Tasks in Git

### 4.1 Common actions

First clone the remote repository (repo). Now log in using the correct
credentials (if you are prompted).

It is highly recommended to install the 3^rd^ party Git client SourceTree.

In order to get access follow steps [here](https://adamprescott.net/2015/01/29/visual-studio-online-and-sourcetree/), except first clone the repo using VS, then in the password field of SourceTree enter the token.

To get latest, you can do a fetch and pull.

To checkin code, first do a commit. This is on your local repo (either using VS or 3^rd^ party client). Then do a push (wrapped by a sync action in the VS extension) - this persists your local changes (commits) to the remote (VSO) repo.

To check history, go to the branch and select view history from the context menu (using VS). The web UI in VSO is pretty good too.

To compare files across different commits, either use the web UI (VSO) or use another 3^rd^ part client called Git Extensions. No VS support here.

### 4.2 Some TFVC actions not natively available in Git

#### 4.2.1 Check-in policies

This is available in VSO Git on a per-branch and per pull request [basis](https://blogs.msdn.microsoft.com/buckh/2016/03/20/gated-checkin-for-git-using-branch-policies-to-run-a-build-in-vsts-and-tfs/). So, we absolutely need to enable this for the master and develop branches.

Enforcing a comment for every commit is enabled by default on VSO. For [linking](https://visualstudio.uservoice.com/forums/330519-team-services/suggestions/4038344-associate-a-git-commit-with-a-work-item) every commit to a backlog item, either the \#ID [mention](http://www.codewrecks.com/blog/index.php/2013/01/31/associate-work-items-to-check-in-in-a-tf-service-git-enabled-repository/) in the commit comment can be used, or the VS “commit changes” UI can be [used](https://blogs.msdn.microsoft.com/visualstudioalm/2016/03/02/linking-work-items-to-git-branches-commits-and-pull-requests/) (similar to TFVC). For enforcing this, a plugin for custom check-in policy can be [written](http://almsports.net/tfs-server-side-check-in-policy-for-git-repositories/1025/).

#### 4.2.2 Code Reviews

This can be availed using Pull Requests. There is no direct equivalent of the VS TFVC code review feature. 3rd part tools like Gerrit are available.

#### 4.2.3 Shelvesets

There is no direct equivalent in Git. The closest alternative is to create a temporary branch, especially if others need to get to it. More details
[here](http://stackoverflow.com/questions/3069979/whats-the-git-equivalent-of-tfs-commands-shelve-unshelve-cherry-pick).

#### 4.2.4 Gated Builds

Use pull requests and set up a build to trigger on every pull request being submitted.

## 5. Further reading

- <http://www.richard-banks.org/2014/02/tfs-internals-how-does-tfs-store-git.html>
- <https://msdn.microsoft.com/Library/vs/alm/code/overview#tfvc_or_git_details>
- <http://www.rapidprogramming.com/questions-answers/difference-between-tfs-and-git-tfs-vs-git-1528>
- <https://www.visualstudio.com/en-us/articles/mapping-my-tfvc-actions-to-git>
