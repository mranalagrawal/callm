# CallMeWine Frontend

## Setup

> Make sure you are using node v16.17.1 or greater, if you need help switching node versions install [NVM](https://github.com/nvm-sh/nvm)

### install dependencies

```bash
yarn install
```

### Development Server

Start the development server on http://localhost:3000

> Make sure you have a .env file with the proper environments, if you are unsure which environments you need, contact [developers@callmewine.com](mailto:developers@callmewine.com) for further advice.

```bash
yarn dev
```
### Production, Stage and Features Builds

This is all handle on [Vercel](https://vercel.com/), everytime you push a feature or a Merge Request is approved and merged a new build starts happening on Vercel environments

## Gitflow

To ensure a standard development process we are adopting the [gitflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) process. All the documentation needed is on their site, feel free to read their documents for further implementations. In short, we have 3 types of branches:

- Feature: Each new feature should reside in its own branch, which can be pushed to the central repository for backup/collaboration.
- Release: Must be created by team leads after new features have been approved and merged.
- Hotfix: Maintenance or “hotfix” branches are used to quickly patch production releases. Hotfix branches are a lot like release branches and feature branches except they're based on main instead of develop.

## Releases

ChangeLog is handle on [gitlab](https://docs.gitlab.com/), whenever you finish a feature you should update the upcoming release to clarify the progress of what have been done.

Basically, we follow a standard pattern to track our progress, on top of that, GitHub [Releases Page](https://docs.gitlab.com/ee/user/project/releases/#create-a-release-in-the-releases-page) offers a friendly UI to make this process less painful.

### Release Names

From a galaxy far away... we are taking an inspiration from [Star Wars creatures](https://www.starwars.com/creatures) to create the upcoming releases names.

#### Naming Convention Pattern
```
${creature-name}-v${MAJOR}.${MINOR}.${REVISION}
```

#### Rules
- The creature name uses kebab-case.
- The "-v" should be placed right after the creature name followed by the version number

#### Examples

> 👏🏻 `acklay-v1.0.1` | `colo-claw-fish-v2.2.3`

> 🙈 `v1.0.1__acklay` | `ColoClawFish__v223`

For entertainment purposes I encourage to start the release by placing a creature's little description from [Star Wars Website](https://www.starwars.com/databank). 

#### Example 
### Acklay
#### *acklay-v1.0.1*
A surprisingly agile fury of sharp claws and pointed fangs, the vicious acklay was one of the three arena creatures unleashed in the Geonosian execution arena, dispatched to kill Anakin Skywalker, Padme Amidala, and Obi-Wan Kenobi.

### Types of changes
- Improvements: for new features. 
- Changed: for changes in existing functionality.
- Deprecated: for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security: in case of vulnerabilities.

Feel free to read [these documents](https://keepachangelog.com/en/1.0.0/) to lear more.
