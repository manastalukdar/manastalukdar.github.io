---
published: true
tags:
 - Engineering Leadership
 - Project Management
 - Software Engineering
 - Agile Methodology
 - Scrum
 - Continuous Integration
 - Git
categories:
 - Technology
authors:
 - "Manas Talukdar"
post-format: standard
title: Continuous Integration using Git Branching and Pull Requests
url-slug: continuous-integration-git-branching-pull-requests
first-published-on: 2019-04-28 04:15 pm
last-updated-on: 2019-04-28 04:15 pm
meta:
 description: "An implementation of continuous integration using Git branching and pull requests."
excerpt: ""
---

# Continuous Integration using Git Branching and Pull Requests

${toc}

## Source branching model

I like to follow the GitFlow branching model \[[ref](http://nvie.com/posts/a-successful-git-branching-model/)\] with slight variations.

### Main branches

There are two main branches (each of infinite timeline):

- `master`
- `develop`

The `master` branch is at the “root” level. Some also refer to this as the integration branch. Typically, nightly builds run off of this branch. We always deploy to production from the `master` branch and use tags to keep track of such deployments.

Parallel to the `master` branch exists the `develop` branch. All development converges into this branch. When a stable point is reached, all changes are merged back to `master` and tagged with a release number. Each time when changes are merged back into `master`, this is a new production release by definition. We need to be very strict at this, so that theoretically, we could use a Git hook script to automatically build and roll-out our software to our production environments every time there was a commit on `master`.

Then there are three types of supporting branches:

- Feature branches
- Release branches
- Hotfix branches

### Feature branches

May branch off from `develop`. Must merge back into `develop`. Branch naming
convention: anything except `master`, `develop`, `release-\*`, or `hotfix-\*`.

### Release branches

May branch off from `develop`. Must merge back into `develop` and `master`. Branch naming convention: `release-\*`.

### Hotfix branches

May branch off from `master`. Must merge back into `develop` and `master`. Branch naming convention: `hotfix-\*`.

### Diagram

![GitFlow](http://nvie.com/img/git-model@2x.png)

## Making changes

- You cannot push changes to remote `develop` and `master` directly.
  - Mechanism in place that will prevent developers from even committing changes into `develop` and `master` locally.
- Changes into `develop` and `master` will have to have orchestrated via pull requests.
- Submitting a pull request into `develop` and `master` will automatically trigger builds. See section on pull requests below for more details.

## Branching and Merging

### Method 1

1. Create feature branch and associate with backlog item from web UI.
    - **Remember to add "feature/" prefix to branch name.**
1. Pull new feature branch from remote to local repo.
1. Make changes and commit to local feature branch.
1. Push changes to remote feature branch.
1. Submit pull request from feature branch to develop branch using web UI. See section on pull requests below for more details.
1. Once pull request goes through, the remote feature branch will be deleted. Also be sure to squash commits.
1. Now, locally
    - Make sure you are on a branch that isn't the feature branch that has been deleted in the remote origin: `checkout develop`
    - Delete feature branch: `git branch -d feature/SomeFeature`. Sometimes this may fail with a message saying you have merges pending, in which case run, `git branch -D feature/SomeFeature`.
    - Pull latest from remote develop: `checkout develop`, then `git pull`. You may have to resolve merge conflicts here.
    - Now if you have an under-development branch locally to which you need to merge the latest from develop:
        - Now checkout that branch: `git checkout feature/SomethingUnderWork`
        - Now merge develop into this in-progress branch: `git merge develop`. At this point, you may have to resolve any merge conflict.
        - Now checkout the in-progress branch and continue your work: `git checkout feature/SomethingInProgress`

### Method 2

1. Create feature branch locally
    - Using GitFlow (command line or your Git Client UI of choice).
    - Using raw git commands (feel free to, but option above is easier).
1. Make changes and commits into new local feature branch.
1. Push new local feature branch to remote origin.
    - Depending on which client tool you use, you will get prompted to
        - Create the new remote feature branch.
        - Add tracking ref to the local feature branch for the newly created remote feature branch.
    - Or, you may choose to orchestrate all of this manually using git command line.
1. From this point, follow steps from step 5 onward as described under Method 1, above.

### Pull Requests

1. Pull Requests have to be created for merging code into `develop` (and `master`). For the context of the discussion below we will implicitly refer to `develop`.
1. Invite one more developers you wish to code review your PR using the PR web UI.
1. Once the invited developer(s) have approved the PR, any one person in the `PR Approvers` group will approve the PR.
1. If `PR Approvers` are unavailable and the PR needs to be merged in sooner rather than later, branch merge policy may be overridden with an appropriate comment.
1. PR need to have associated backlog item(s).
1. PRs need to have comments resolved, if any.
1. PRs need to have passing build.
1. Once the code has been merged into `develop`, the person with the "Approve WI" task (if applicable) will make sure that the work done as part of the associated backlog item(s) are functionally complete. Typically this involves running user acceptance tests against the test environment. Once the validation is successful, the task can be closed and the backlog item(s) marked as completed. If the validation fails, new Bug backlog items need to be created.
