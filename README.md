[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-white.svg)](https://sonarcloud.io/dashboard?id=SolarSPELL-Main_content-curation)

[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=SolarSPELL-Main_content-curation&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=SolarSPELL-Main_content-curation)
[![Test frontend build](https://github.com/SolarSPELL-Main/content-curation/actions/workflows/frontend_build.yml/badge.svg)](https://github.com/SolarSPELL-Main/content-curation/actions/workflows/frontend_build.yml)
[![Test django build](https://github.com/SolarSPELL-Main/content-curation/actions/workflows/django_build.yml/badge.svg)](https://github.com/SolarSPELL-Main/content-curation/actions/workflows/django_build.yml)

# Content Curation

SolarSPELL Content Curation service (CC). The Content Curation service provides functionality for library curators to submit new content and its associated metadata for approval in multiple languages. A Content Curation Admin has all the abilities of a library  curator, and can also approve, modify, or reject outright content submitted for approval. A Content Curation Admin can also add new language categories, create/remove users, and modify their roles to create other admins or content curators.

# Getting Started
## Prerequisites
## Running tests
## Running locally
## Deployment/CI
What does it mean to pass CI? All unit tests, lints, and functional tests should pass. The code should be suitable for production deployment.
Deployment should only be carried out through communication with core contributors. Deployments with changes to the database schema should only be carried out if:
- It is a tagged release passing CI
- CI passes AND consumers are alerted (probably a slack @channel announcement)
- A database backup is made if the change is deemed high risk (data migration, schema changes without rollback support)
### Tagging a release
## Troubleshooting

# Contributing
## Developers
### Understanding the architecture
#### Database
put a schema diagram here
#### REST API
link or OpenAPI specification?
#### Client
Very Important Client Info
### Finding work
How to contribute against previously identified work
### Making a Pull Request
Quality control guidelines and the contribution process
### Getting Reviews
Who to reach out to and where, and prereqs to get there (passing CI if not a WIP review)
## Curators
???

# Contact Info
Check out our slack?
