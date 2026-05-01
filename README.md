# Tracey for Jira Cloud

Tracey is a free beta Atlassian Forge app for Jira Cloud that helps BA, PM, QA, product, and engineering teams inspect traceability across issues, components, dependencies, and hierarchy.

## What Tracey Does

- Shows a Components matrix: Jira issues by affected system components.
- Shows a Story-to-Story matrix: Jira stories by standard Jira issue links.
- Shows an interactive Hierarchical view with zoom, pan, fullscreen, parent coverage, and drag-to-assign parent support.
- Adds an issue panel with traceability fields and grouped issue links.
- Auto-provisions traceability custom fields during app installation.
- Stores app configuration and view state in Forge app storage.

## Current Status

Tracey is currently prepared as a free beta app. Validate it in a test Jira project before using it for production decisions.

Support: best-effort email support at [eugenktheba@gmail.com](mailto:eugenktheba@gmail.com).

Vendor: Eugene K.

## Custom Fields

Tracey creates these Jira custom fields automatically. They use Jira's labels-type custom field so every field supports multiple values without predefining options.

| Field name | Type | Purpose |
| --- | --- | --- |
| Affected Components | Labels, multi-value | System components or UI areas touched by an issue |
| User Roles | Labels, multi-value | Impacted user roles |
| Permissions | Labels, multi-value | Impacted permissions |
| DB Entities | Labels, multi-value | Impacted database entities |
| Use cases | Labels, multi-value | Short use case names |

Tracey does not use Jira's system Labels field for traceability data.

## Views

### Components View

Rows are Jira issues. Columns are values from `Affected Components`. A green cell means the issue is linked to that component.

### Story-to-Story View

Rows and columns are story-like issues. Cells show supported standard Jira issue links:

- Red: Blocks / is blocked by
- Purple: Duplicates / is duplicated by
- Yellow: Clones / is cloned by
- Grey: Relates to

Full cells mean the row issue points to the column issue. Half-filled cells mean the relation points from the column issue to the row issue. When stronger relations exist, `Relates to` is hidden in that cell to reduce noise.

### Hierarchical View

Cards show Jira hierarchy. Users can zoom, pan, enter fullscreen, inspect standalone issues, and drag eligible leaf issues onto valid parent cards to assign hierarchy. Parent Coverage shows the percentage of non-epic issues that have a parent.

## Permissions

Tracey asks for the smallest currently known set of Forge scopes:

- `read:jira-work`: read issues, fields, components, versions, labels, issue types, statuses, and issue links.
- `write:jira-work`: update issue parent relationships when using drag-to-assign hierarchy.
- `manage:jira-configuration`: create and find Tracey custom fields.
- `storage:app`: store app configuration and view state.

If hierarchy assignment is removed in the future, `write:jira-work` should be reviewed again.

## Local Setup

Install dependencies:

```bash
npm install
```

Log in to Forge:

```bash
forge login
```

Deploy to development:

```bash
npm run build:enhanced-ui
forge deploy
```

Install or upgrade on a Jira Cloud development site:

```bash
forge install
```

or:

```bash
forge install --upgrade
```

## Production Deploy

Build and deploy to the Forge production environment:

```bash
npm run build:enhanced-ui
forge deploy -e production
```

Marketplace publication is handled through the Atlassian Developer Console and Atlassian Marketplace vendor portal. See [Marketplace checklist](docs/marketplace-listing.md).

## Verification Checklist

- Tracey appears in the Jira project sidebar.
- Tracey issue panel appears on issue view.
- Tracey Config appears for Jira admins.
- Custom fields exist after installation.
- Components View loads issues and components.
- Story-to-Story View shows standard Jira links.
- Hierarchical View loads, zooms, pans, enters fullscreen, and drag-to-assign works.
- Parent Coverage updates after hierarchy assignment.
- Filters work by issue type, epic, fix version, label, component, and JQL.

## Documentation

- [Marketplace checklist](docs/marketplace-listing.md)
- [Privacy policy draft](docs/privacy-policy.md)
- [Terms of service draft](docs/terms-of-service.md)
- [Support and security policy](docs/support-and-security.md)
