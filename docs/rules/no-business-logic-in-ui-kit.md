# no-business-logic-in-ui-kit

Enforces that UI kit files only import from their own layer, common shared utilities, or external libraries, preventing business
logic dependencies in shared UI components.

## Rule Details

This rule ensures that UI kit components remain truly reusable by preventing them from importing business logic, state management, or domain-specific functionality. UI kit components should be pure, stateless, and only concerned with presentation.

Note: the rule permits imports from `src/shared/ui/` and from the top-level `src/shared/` folder which is commonly used for shared
utilities/constants (for example `@/shared/cn`). If your project keeps business logic inside `src/shared/`, tighten the rule by
using the `allowedImports` option or restricting `uiKitPaths` in your ESLint configuration.

**Why this rule exists:**

- Keeps UI components reusable across different features and modules
- Prevents tight coupling between UI components and business logic
- Maintains clear separation between presentation and business layers
- Ensures UI kit components can be easily shared or extracted to a design system
- Promotes consistent and predictable component behavior

## Examples

### ❌ Incorrect

```javascript
// UI kit component importing business logic
import userService from '@/services/userService.js'
import { useUserStore } from '@/stores/userStore.js'
import SearchBar from '@/features/search/SearchBar.vue'
import UserCard from '@/components/UserCard.vue'
import { trackEvent } from '@/modules/analytics/tracking.js'

// Side-effectful operations in UI kit
export default {
  setup() {
    // Forbidden: direct API calls
    fetch('/api/data')

    // Forbidden: store mutations
    store.dispatch('updateUser')

    // Forbidden: router navigation
    router.push('/dashboard')

    // Forbidden: logging/tracking
    console.log('Button clicked')
    localStorage.setItem('theme', 'dark')
  },
}
```

### ✅ Correct

```javascript
// UI kit importing only external libraries
import { computed, ref } from 'vue'
import { VueUse } from '@vueuse/core'
import lodash from 'lodash'

// UI kit importing other UI kit components or shared utilities
import Icon from './Icon.vue'
import BaseButton from '../BaseButton.vue'
import Tooltip from '@/shared/ui/Tooltip.vue'
// UI kit importing shared utilities (allowed by the rule)
import cn from '@/shared/cn'

// UI kit with pure presentation logic
export default {
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'danger'].includes(value),
    },
    disabled: Boolean,
    loading: Boolean,
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (event) => {
      if (!props.disabled && !props.loading) {
        emit('click', event) // Emit events instead of side effects
      }
    }

    const classes = computed(() => ({
      btn: true,
      [`btn--${props.variant}`]: true,
      'btn--disabled': props.disabled,
      'btn--loading': props.loading,
    }))

    return { handleClick, classes }
  },
}
```

## Options

```json
{
  "vue-modular/no-business-logic-in-ui-kit": [
    "error",
    {
      "uiKitPaths": ["src/shared/ui/"],
      "allowedImports": [],
      "detectSideEffects": true
    }
  ]
}
```

### Option Details

- **`uiKitPaths`** (array): Array of paths that should be treated as UI kit directories. Default: `["src/shared/ui/"]`
  Note: common utilities placed under `src/shared/` are considered safe by the rule implementation. To change this behavior,
  either add specific modules to `allowedImports` or include `src/shared/` in `uiKitPaths` if you want the rule to consider a
  broader set of files as part of the UI kit.
- **`allowedImports`** (array): Array of explicitly allowed import module names. Default: `[]`
- **`detectSideEffects`** (boolean): Whether to detect and report side-effectful operations. Default: `true`

## Project Structure

```text
src/
├── shared/
│   └── ui/                        🎨 UI Kit Layer
│       ├── Button.vue             ✅ Can import from ui/, external libs
│       ├── Input.vue              ✅ Can import other UI components
│       ├── Modal.vue              ❌ Cannot import from business layers
│       └── components/
│           ├── forms/
│           │   ├── FormField.vue  ✅ Can import within ui/
│           │   └── FormGroup.vue  ✅ Can import external libs
│           └── layout/
│               ├── Grid.vue       ✅ Pure presentation logic
│               └── Container.vue  ❌ Cannot import from services/
├── components/                    🔧 Business Components Layer
│   ├── UserProfile.vue            ❌ UI kit cannot import from here
│   └── ProductCard.vue            ❌ UI kit cannot import from here
├── features/                      🎯 Feature Layer
│   ├── auth/
│   │   └── LoginForm.vue          ❌ UI kit cannot import from here
│   └── search/
│       └── SearchResults.vue     ❌ UI kit cannot import from here
├── modules/                       📦 Module Layer
│   ├── user/
│   │   └── UserModule.vue         ❌ UI kit cannot import from here
│   └── product/
│       └── ProductModule.vue     ❌ UI kit cannot import from here
├── services/                      ⚙️ Service Layer
│   ├── api.js                     ❌ UI kit cannot import from here
│   └── httpClient.js              ❌ UI kit cannot import from here
├── stores/                        🗄️ State Layer
│   ├── userStore.js               ❌ UI kit cannot import from here
│   └── appStore.js                ❌ UI kit cannot import from here
└── composables/                   🔗 Business Logic Layer
    ├── useAuth.js                 ❌ UI kit cannot import from here
    └── useApi.js                  ❌ UI kit cannot import from here
```

## Configuration Examples

### Default Configuration

```json
{
  "rules": {
    "vue-modular/no-business-logic-in-ui-kit": "error"
  }
}
```

### Custom UI Kit Paths

```json
{
  "rules": {
    "vue-modular/no-business-logic-in-ui-kit": [
      "error",
      {
        "uiKitPaths": ["src/ui/", "src/design-system/"],
        "detectSideEffects": true
      }
    ]
  }
}
```

### Allow Specific Imports

```json
{
  "rules": {
    "vue-modular/no-business-logic-in-ui-kit": [
      "error",
      {
        "uiKitPaths": ["src/shared/ui/"],
        "allowedImports": ["@/shared/constants/colors.js", "@/shared/utils/formatters.js"],
        "detectSideEffects": false
      }
    ]
  }
}
```

## Communication Patterns

### ✅ Proper UI Kit to Business Logic Communication

```javascript
// ❌ Bad: UI component directly calling services
export default {
  setup() {
    const handleSubmit = async (formData) => {
      const result = await userService.createUser(formData) // Wrong!
      if (result.success) {
        router.push('/dashboard') // Wrong!
      }
    }
  }
}

// ✅ Good: UI component emitting events
export default {
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const handleSubmit = (formData) => {
      emit('submit', formData) // Let parent handle business logic
    }

    const handleCancel = () => {
      emit('cancel') // Let parent handle navigation
    }

    return { handleSubmit, handleCancel }
  }
}

// ✅ Good: Parent component handling business logic
// src/features/user/CreateUserPage.vue
import UserForm from '@/shared/ui/forms/UserForm.vue'
import { userService } from '@/services/userService.js'
import { useRouter } from 'vue-router'

export default {
  components: { UserForm },
  setup() {
    const router = useRouter()

    const handleUserSubmit = async (formData) => {
      const result = await userService.createUser(formData)
      if (result.success) {
        router.push('/dashboard')
      }
    }

    return { handleUserSubmit }
  }
}
```

### ✅ Providing Data to UI Components

```javascript
// ✅ Good: Pass data as props
// Parent provides data
<UserCard
  :user="user"
  :loading="loading"
  @edit="handleEdit"
  @delete="handleDelete"
/>

// UI component receives data
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete']
}
```

## Side Effects Detection

The rule detects common side-effectful operations that shouldn't be in UI kit components:

### What Are Side Effects?

Side effects are operations that:

- Modify state outside the component (global variables, external APIs, databases)
- Perform I/O operations (network requests, file system access)
- Interact with browser APIs that affect the global state
- Have observable effects beyond returning a value

UI kit components should be **pure** and **predictable** - given the same props, they should always render the same output without causing external changes.

### Detected Side Effects

```javascript
// ❌ HTTP requests
fetch('/api/endpoint')
axios.get('/api/data')
request.post('/api/create')

// ❌ Store operations
store.dispatch('updateUser')

// ❌ Router navigation
router.push('/path')

// ❌ Console logging
console.log('Debug info')
console.warn('Warning')
console.error('Error')

// ❌ Storage operations
localStorage.setItem('key', 'value')
sessionStorage.setItem('key', 'value')
```

> **Note**: The rule currently detects a subset of common side effects. Additional side effects may exist in your code but won't be automatically flagged by this rule. Consider these examples as guidance for what to avoid in UI kit components.

### Other Side Effects to Avoid (Not Automatically Detected)

While the rule doesn't automatically detect these, they should also be avoided in UI kit components:

```javascript
// ❌ Other store operations
store.commit('SET_DATA')
$store.dispatch('fetchProducts')

// ❌ Other routing operations
router.replace('/path')
router.go(-1)
this.$router.push({ name: 'UserProfile' })

// ❌ Other console operations
console.info('Information')
console.debug('Debug details')

// ❌ Global state modifications
window.globalVar = 'value'
document.title = 'New Title'
document.cookie = 'theme=dark'

// ❌ Timers and intervals
setTimeout(() => console.log('delayed'), 1000)
setInterval(() => updateCounter(), 1000)
requestAnimationFrame(animate)

// ❌ Browser APIs
window.open('https://example.com')
window.location.href = '/redirect'
history.pushState({}, '', '/new-url')
navigator.geolocation.getCurrentPosition(callback)

// ❌ External service integrations
analytics.track('button_clicked')
gtag('event', 'click', { button_name: 'submit' })
mixpanel.track('User Action')
Sentry.captureException(error)

// ❌ File system operations (Node.js)
fs.writeFileSync('file.txt', 'content')
fs.readFile('config.json', callback)

// ❌ Database operations
db.collection('users').add(userData)
User.create(userData)
await mongoose.model('User').save()
```

### ✅ Allowed Operations

```javascript
// ✅ Pure computations and data transformations
const computedValue = computed(() => props.value * 2)
const formattedDate = computed(() => new Date(props.timestamp).toLocaleDateString())
const filteredItems = computed(() => props.items.filter((item) => item.visible))

// ✅ Event emissions (let parent handle side effects)
emit('change', newValue)
emit('submit', formData)
emit('delete', itemId)
emit('navigate', { route: '/dashboard' })

// ✅ DOM manipulations for presentation only
nextTick(() => {
  inputRef.value?.focus()
  modalRef.value?.scrollTo(0, 0)
})

// ✅ Reactive state for UI behavior (component-internal state)
const isOpen = ref(false)
const isLoading = ref(false)
const selectedTab = ref('general')
const formErrors = ref({})

const toggleOpen = () => (isOpen.value = !isOpen.value)
const setActiveTab = (tab) => (selectedTab.value = tab)

// ✅ UI-related computed properties
const cssClasses = computed(() => ({
  modal: true,
  'modal--open': isOpen.value,
  'modal--loading': isLoading.value,
  [`modal--${props.variant}`]: props.variant,
}))

// ✅ Form validation (pure functions)
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
const validateRequired = (value) => value && value.trim().length > 0

// ✅ Data formatting and parsing (pure functions)
const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const parsePhoneNumber = (phone) => phone.replace(/\D/g, '')

// ✅ UI animations and transitions (declarative)
const slideAnimation = {
  enter: 'slide-enter',
  enterActive: 'slide-enter-active',
  leave: 'slide-leave',
  leaveActive: 'slide-leave-active',
}

// ✅ Component lifecycle for UI setup only
onMounted(() => {
  // Set up UI-only concerns
  inputRef.value?.focus()
  resizeObserver.observe(containerRef.value)
})

onUnmounted(() => {
  // Clean up UI-only resources
  resizeObserver.disconnect()
  clearTimeout(animationTimeout.value)
})

// ✅ Reactive transformations
const uppercaseValue = computed(() => props.value?.toUpperCase())
const sortedOptions = computed(() => [...props.options].sort((a, b) => a.label.localeCompare(b.label)))

// ✅ UI state management with composables (for reusable UI logic)
const { isVisible, show, hide, toggle } = useToggle(false)
const { position, updatePosition } = useTooltipPosition(targetRef)
```

### Real-World Example: Refactoring a Violating Component

❌ **Before: UI Component with Side Effects**

```javascript
// src/shared/ui/UserCard.vue - VIOLATES the rule
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <button @click="handleEdit">Edit</button>
    <button @click="handleDelete">Delete</button>
  </div>
</template>

<script>
import { userService } from '@/services/userService.js' // ❌ Business logic import
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications.js' // ❌ Business logic import

export default {
  props: ['user'],
  setup(props) {
    const router = useRouter()
    const { showSuccess, showError } = useNotifications()

    const handleEdit = () => {
      router.push(`/users/${props.user.id}/edit`) // ❌ Side effect: navigation
    }

    const handleDelete = async () => {
      try {
        await userService.deleteUser(props.user.id) // ❌ Side effect: API call
        showSuccess('User deleted successfully') // ❌ Side effect: notification
        router.push('/users') // ❌ Side effect: navigation
      } catch (error) {
        console.error('Delete failed:', error) // ❌ Side effect: logging
        showError('Failed to delete user') // ❌ Side effect: notification
      }
    }

    return { handleEdit, handleDelete }
  }
}
</script>
```

✅ **After: Pure UI Component**

```javascript
// src/shared/ui/UserCard.vue - FOLLOWS the rule
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <button @click="$emit('edit', user.id)" :disabled="loading">
      Edit
    </button>
    <button @click="$emit('delete', user.id)" :disabled="loading">
      {{ loading ? 'Deleting...' : 'Delete' }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['edit', 'delete'] // ✅ Pure: emit events instead of side effects
}
</script>
```

✅ **Parent Component Handles Business Logic**

```javascript
// src/features/users/UsersPage.vue - Business logic container
<template>
  <div>
    <UserCard
      v-for="user in users"
      :key="user.id"
      :user="user"
      :loading="deletingUserId === user.id"
      @edit="handleUserEdit"
      @delete="handleUserDelete"
    />
  </div>
</template>

<script>
import UserCard from '@/shared/ui/UserCard.vue' // ✅ Import pure UI component
import { userService } from '@/services/userService.js'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications.js'

export default {
  components: { UserCard },
  setup() {
    const router = useRouter()
    const { showSuccess, showError } = useNotifications()
    const deletingUserId = ref(null)

    const handleUserEdit = (userId) => {
      router.push(`/users/${userId}/edit`) // ✅ Business logic in appropriate layer
    }

    const handleUserDelete = async (userId) => {
      deletingUserId.value = userId
      try {
        await userService.deleteUser(userId) // ✅ Business logic in appropriate layer
        showSuccess('User deleted successfully')
        await refreshUsers()
      } catch (error) {
        console.error('Delete failed:', error)
        showError('Failed to delete user')
      } finally {
        deletingUserId.value = null
      }
    }

    return { handleUserEdit, handleUserDelete, deletingUserId }
  }
}
</script>
```

## When Not To Use

- If your project doesn't have a separate UI kit or design system
- If you intentionally want UI components to have business logic (not recommended)
- During rapid prototyping phases where architectural boundaries are not yet established
- If your UI components are always feature-specific and will never be reused

## Related Rules

- [`enforce-import-boundaries`](./enforce-import-boundaries.md) - Comprehensive import boundary enforcement
- [`no-cross-module-imports`](./no-cross-module-imports.md) - Prevents imports between different modules
- [`no-cross-feature-imports`](./no-cross-feature-imports.md) - Prevents imports between different features

## Further Reading

- [Component Design Patterns](https://vuejs.org/guide/reusability/composables.html)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Design System Architecture](https://bradfrost.com/blog/post/atomic-web-design/)
