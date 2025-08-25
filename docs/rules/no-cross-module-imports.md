# no-cross-module-imports

Prevents imports between different modules, enforcing that modules should remain independent and only import from within their own boundaries.

## Rule Details

This rule prevents importing files from other modules. Each module should be self-contained and only import from within its own directory structure or from shared/common areas outside of modules.

**Why this rule exists:**

- Enforces strict module boundaries
- Prevents tight coupling between modules
- Makes modules truly independent and reusable
- Encourages proper separation of concerns
- Makes refactoring and maintenance easier

## Examples

### ❌ Incorrect

```javascript
// Cross-module imports using @ alias
import UserProfile from '@/modules/user/components/UserProfile.vue' // From admin module
import adminService from '@/modules/admin/services/admin.js' // From user module
import PaymentForm from '@/modules/billing/components/PaymentForm.vue' // From inventory module

// Cross-module relative imports
import userComponent from '../../../user/components/Component.vue' // From admin module
import dashboardWidget from '../../admin/components/Widget.vue' // From user module
```

### ✅ Correct

```javascript
// Imports within the same module
import UserProfile from './components/UserProfile.vue'
import userService from '../services/userService.js'
import Button from '@/modules/user/components/Button.vue' // Same module via @ alias

// Imports from shared areas (not modules)
import formatters from '@/shared/formatters'
import commonComponent from '@/shared/ui/Component.vue'
import apiService from '@/services/api'
import store from '@/stores/index'

// Node module imports
import Vue from 'vue'
import { computed } from 'vue'
```

## Options

```json
{
  "vue-modular/no-cross-module-imports": [
    "error",
    {
      "src": "src",
      "modulesDir": "modules"
    }
  ]
}
```

### Option Details

- **`src`** (string): The source directory path. Default: `"src"`
- **`modulesDir`** (string): The modules directory name within `src`. Default: `"modules"`

## Project Structure

```text
src/
├── modules/
│   ├── admin/
│   │   ├── components/
│   │   │   ├── Dashboard.vue     ✅ Can import from admin module
│   │   │   └── UserList.vue      ✅ Can import from admin module
│   │   ├── services/
│   │   │   └── adminApi.js       ✅ Can import from admin module
│   │   └── pages/
│   │       └── AdminHome.vue     ❌ Cannot import from user module
│   ├── user/
│   │   ├── components/
│   │   │   ├── Profile.vue       ✅ Can import from user module
│   │   │   └── Settings.vue      ❌ Cannot import from admin module
│   │   ├── services/
│   │   │   └── userApi.js        ✅ Can import from user module
│   │   └── pages/
│   │       └── UserHome.vue      ✅ Can import from user module
│   └── billing/
│       ├── components/
│       │   └── PaymentForm.vue   ❌ Cannot import from other modules
│       └── services/
│           └── paymentApi.js     ✅ Can import from billing module
├── shared/                       ✅ Available to all modules (flat for utilities; `ui/` for UI kit)
│   ├── formatters.js
│   └── ui/
│       └── BaseButton.vue
├── services/                     ✅ Available to all modules
│   └── httpClient.js
├── stores/                       ✅ Available to all modules
│   └── index.js
└── components/                   ✅ Available to all modules
  └── AppLayout.vue
```

## Configuration Examples

### Default Configuration

```json
{
  "rules": {
    "vue-modular/no-cross-module-imports": "error"
  }
}
```

### Custom Paths

```json
{
  "rules": {
    "vue-modular/no-cross-module-imports": [
      "error",
      {
        "src": "source",
        "modulesDir": "features"
      }
    ]
  }
}
```

This would enforce the rule for a structure like:

```text
source/
├── features/
│   ├── moduleA/
│   └── moduleB/
```

## Module Communication Patterns

### ✅ Recommended Communication Between Modules

```javascript
// Use shared services for cross-module communication
// src/services/eventBus.js
export const eventBus = new EventTarget();

// src/modules/user/components/Profile.vue
import { eventBus } from '@/services/eventBus';

export default {
  methods: {
    updateProfile() {
      // Emit event for other modules to listen
      eventBus.dispatchEvent(new CustomEvent('user-updated', {
        detail: this.user
      }));
    }
  }
}

// src/modules/admin/components/Dashboard.vue
import { eventBus } from '@/services/eventBus';

export default {
  mounted() {
    // Listen for events from other modules
    eventBus.addEventListener('user-updated', this.handleUserUpdate);
  }
}
```

### ✅ Use Shared Stores/State Management

```javascript
// src/store/modules/user.js
export const userStore = {
  state: { user: null },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
  },
}

// Both modules can access shared store
// src/modules/user/components/Profile.vue
// src/modules/admin/components/Dashboard.vue
import { userStore } from '@/store/modules/user'
```

## When Not To Use

- If your project doesn't follow a module-based architecture
- If you intentionally want modules to have tight coupling
- In monolithic applications where module boundaries are not important
- During initial development phases before architectural boundaries are established

## Related Rules

- [`no-cross-feature-imports`](./no-cross-feature-imports.md) - Similar rule for feature-based architecture
- [`enforce-src-structure`](./enforce-src-structure.md) - Enforces allowed top-level directories
