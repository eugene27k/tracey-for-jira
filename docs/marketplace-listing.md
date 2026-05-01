# Tracey Marketplace Listing Draft

This file is the working checklist and copy source for publishing Tracey as a free beta Jira Cloud app on Atlassian Marketplace.

## Listing Basics

App name: Tracey

Vendor: Eugene K.

Hosting: Forge

Product: Jira Cloud

Pricing: Free beta

Support: Best-effort email support

Support email: eugenktheba@gmail.com

Security contact: eugenktheba@gmail.com

Documentation URL: https://eugene27k.github.io/tracey-for-jira/

Privacy Policy URL: https://eugene27k.github.io/tracey-for-jira/privacy-policy.html

Terms of Service URL: https://eugene27k.github.io/tracey-for-jira/terms-of-service.html

Support and Security URL: https://eugene27k.github.io/tracey-for-jira/support-and-security.html

## Short Description

Tracey helps Jira teams visualize issue traceability, component coverage, story dependencies, and hierarchy gaps.

## Long Description

Tracey is a Jira Cloud traceability app for BA, PM, QA, product, and engineering teams that need a clearer way to inspect how work items connect.

Tracey adds matrix and hierarchy views directly inside Jira. Use it to see which Jira issues touch which system components, how stories depend on each other through standard Jira issue links, and where hierarchy assignment is missing.

Tracey is designed for analytical project work: component coverage, dependency review, scope inspection, and backlog structure cleanup.

## Highlights

- Components matrix: issues by affected system components.
- Story-to-Story matrix: standard Jira links between stories.
- Hierarchical view: interactive issue hierarchy with zoom, pan, fullscreen, and parent coverage.
- Drag-to-assign hierarchy: assign eligible issues to valid parents from the hierarchy canvas.
- Issue panel: traceability fields and grouped issue links on the issue view.
- Structured traceability fields: custom multi-value fields created automatically by the app.

## Target Users

- Business analysts
- Product managers
- Product owners
- QA leads
- Engineering managers
- Delivery managers

## Screenshot Checklist

- Components View with several green component cells.
- Story-to-Story View with blocks, duplicates, clones, and relates examples.
- Hierarchical View in fullscreen.
- Parent Coverage widget.
- Drag-to-assign hierarchy interaction, if possible.
- Issue Panel on a Jira issue.
- Tracey Config page.
- About / Help modal.

## Permission Explanations

`read:jira-work`: Tracey reads Jira issues, issue types, statuses, issue links, components, labels, fix versions, and custom field values to build the matrix and hierarchy views.

`write:jira-work`: Tracey updates issue parent relationships when a user uses drag-to-assign in the Hierarchical View.

`manage:jira-configuration`: Tracey creates and finds its traceability custom fields during installation and configuration.

`storage:app`: Tracey stores app configuration and view state using Forge app storage.

## Marketplace Submission Checklist

- Deploy Forge app to production with `forge deploy -e production`.
- Verify production environment in a test Jira Cloud site.
- Confirm app name, icon, and screenshots.
- Publish the Developer Space in Atlassian Developer Console.
- Create Marketplace listing under the Eugene K vendor profile.
- Set pricing to free.
- Add documentation URL.
- Add privacy policy URL.
- Add terms of service URL.
- Add support email and security contact.
- Complete Privacy & Security tab.
- Submit listing for Atlassian review.

## Pre-Submission Product Checks

- Run `forge lint`.
- Test installation on a clean Jira Cloud site.
- Verify custom fields are created automatically.
- Verify each view works with real project data.
- Verify filters work.
- Verify hierarchy assignment works.
- Verify error and empty states are understandable.
- Verify support and legal links are reachable.
