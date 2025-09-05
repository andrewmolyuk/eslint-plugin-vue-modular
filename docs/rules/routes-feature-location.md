# vue-modular/routes-feature-location

Require a feature-level routes file when a feature contains view components.

## Rule Details

This rule ensures that when a feature contains view components (files whose names end with a configurable suffix, by default `View`), a feature-level routes file exists (for example `features/{feature}/routes.ts`). This keeps routing for a feature colocated and helps the application router compose routes from each feature.

The rule runs once per ESLint execution (it scans the repository layout from the first matched file) and only reports a problem if view components are present in the feature and the configured routes file is missing.

### Incorrect

```ts
// Feature: src/features/payments/views/ListView.vue
// Feature: src/features/payments/views/DetailView.vue
// No routes file present at src/features/payments/routes.ts
```

This will be flagged because the feature contains view files but has no `routes.ts` file.

### Correct

```ts
// Feature: src/features/payments/views/ListView.vue
// Feature: src/features/payments/views/DetailView.vue
// File present: src/features/payments/routes.ts
```

The presence of `routes.ts` in the feature satisfies the rule.

## Options

This rule accepts a single object with the following properties:

- `features` (string, default: `"src/features"`) - segment to identify feature folders. The rule looks for this segment in the linted filename path to determine the feature root. In many test examples the value `"features"` is used when project-relative paths are passed.
- `views` (string, default: `"views"`) - name of the folder inside a feature that holds view components (for example `views`).
- `routes` (string, default: `"routes.ts"`) - filename expected at the feature root that defines the feature routes.
- `viewSuffix` (string, default: `"View"`) - suffix used to identify view component files. The rule checks filenames in the feature `views` folder for this suffix (the rule accepts either `"View"` or `"View.vue"` and normalizes to match `.vue` files).

Examples:

```js
// Default behavior
{
  "vue-modular/routes-feature-location": ["error"]
}

// Custom settings: features are named 'features' and we use a different suffix
{
  "vue-modular/routes-feature-location": ["error", {
    "features": "features",
    "views": "views",
    "routes": "routes.ts",
  "viewSuffix": "View"
  }]
}
```

## Usage Notes

- The rule only inspects the filesystem layout; it does not parse route definitions inside files.
- It runs only once per ESLint process using the plugin's `runOnce` helper. This avoids repeated scanning and duplicate reports when linting many files.
- The `features` option should match how your repository denotes feature folders in paths. If you pass a linted filename that is already relative to the repository root (for example `src/features/myfeature/...`) set `features` accordingly (for tests you may use `"features"`).
- The `viewSuffix` check is a plain string suffix match (case-sensitive) against filenames found in the configured `views` directory.

## When Not To Use

- If your project does not use per-feature routes or places routes in a non-standard location, this rule will not be suitable.
- If view components are named differently (not using a stable suffix), the rule may produce false positives; in that case configure `viewSuffix` appropriately or disable the rule.

## Further Reading

- Modular routing patterns and best practices for Vue applications.
