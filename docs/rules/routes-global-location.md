# vue-modular/routes-global-location

Require a global routes file when the project contains application-level view components.

## Rule Details

This rule ensures that when your project keeps application-level view components under the configured application folder (by default `src/app/views`), there is a top-level routes file (by default `src/app/routes.ts`) that defines the application's routes.

The rule runs once per ESLint execution (it scans the repository layout from the first matched file) and only reports a problem if view components are present in the application `views` folder and the configured global routes file is missing.

### Incorrect

```ts
// Project: src/app/views/HomeView.vue
// Project: src/app/views/AboutView.vue
// No file present at src/app/routes.ts
```

This will be flagged because the project contains view files under the application views folder but no top-level routes file.

### Correct

```ts
// Project: src/app/views/HomeView.vue
// Project: src/app/views/AboutView.vue
// File present: src/app/routes.ts
```

Having `src/app/routes.ts` satisfies the rule.

## Options

This rule accepts a single object with the following properties:

- `app` (string, default: `"src/app"`) — application root directory containing the `views` folder.
- `routes` (string, default: `"routes.ts"`) — filename expected under the application root that defines global routes (for example `src/app/routes.ts`).

Examples:

```js
// Default behavior (uses `src/app`)
{
  "rules": {
    "vue-modular/routes-global-location": ["error"]
  }
}

// Custom configuration
{
  "rules": {
    "vue-modular/routes-global-location": ["error", { "app": "src/app", "routes": "routes.ts" }]
  }
}
```

## Usage Notes

- The rule only inspects the filesystem layout; it does not parse or validate route definitions inside files.
- It runs once per ESLint process using the plugin's `runOnce` helper to avoid duplicate scanning and reports.
- The rule looks for view components using the conventional `*View.vue` filename pattern in the configured `app/views` folder.

## When Not To Use

- If your project does not keep global view components in a shared `app/views` folder or you manage routes in a different location, this rule may be unsuitable.

## Further Reading

- Modular routing patterns and best practices for Vue applications.
