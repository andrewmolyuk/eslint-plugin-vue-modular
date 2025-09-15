# Rules by Severity Score

All 87 rules sorted from highest to lowest severity score (1-10 scale). Implemented rules are marked with "X". MVP "must have" rules are marked with "V".

Scoring is based on: modular architecture impact (50%), maintainability (30%), and clean code practices (20%).

1. X V feature-imports - 9.65
2. X V shared-imports - 9.30
3. X V app-imports - 9.00
4. X V feature-index-required - 8.65
5. X V components-index-required - 8.45
6. X V shared-ui-index-required - 8.15
7. X V file-component-naming - 8.10
8. X V file-ts-naming - 7.35
9. X V sfc-required - 7.35
10. X V folder-kebab-case - 6.75
11. X V service-filename-no-suffix - 6.75
12. X V store-filename-no-suffix - 6.65
13. V stores-shared-location - 6.45
14. X sfc-order - 6.45
15. X V views-suffix - 6.35
16. V services-shared-location - 6.20
17. V services-feature-location - 6.00
18. V store-pinia-composition - 5.84
19. V stores-feature-location - 5.70
20. V feature-stores-no-imports - 5.34
21. V routes-global-location - 5.20
22. V routes-feature-location - 5.00
23. routes-merge-in-app - 4.95
24. routes-lazy-load - 4.90
25. routes-layout-meta - 4.66
26. V feature-components-location - 4.49
27. V ui-components-location - 4.38
28. V business-components-location - 4.33
29. layout-components-location - 3.90
30. V views-feature-location - 3.75
31. component-props-typed - 3.65
32. views-global-location - 3.64
33. views-no-business-logic - 3.48
34. V composables-shared-location - 3.38
35. views-layout-meta - 3.37
36. V composables-feature-location - 3.08
37. composables-prefix-use - 2.79
38. composables-return-reactive - 2.68
39. types-shared-location - 2.64
40. composables-no-dom - 2.57
41. types-feature-location - 2.53
42. types-export-interfaces - 2.42
43. types-common-location - 2.31
44. types-api-location - 2.20
45. utils-shared-location - 2.11
46. utils-feature-location - 1.99
47. utils-pure-functions - 1.89
48. utils-stateless - 1.77
49. assets-styles-location - 1.67
50. assets-images-location - 1.59
51. assets-icons-location - 1.52
52. assets-fonts-location - 1.44
53. assets-scoped-styles - 1.38
54. middleware-global-location - 1.31
55. middleware-feature-location - 1.26
56. middleware-descriptive-names - 1.19
57. middleware-registration - 1.11
58. middleware-composable - 1.03
59. plugins-registration - 1.01
60. plugins-env-aware - 0.96
61. plugins-init-before-mount - 0.88
62. plugins-api-conformance - 0.83
63. plugins-document-deps - 0.78
64. config-type-safe - 0.73
65. config-env-files - 0.68
66. config-no-secrets - 0.63
67. config-environments - 0.58
68. config-validate-runtime - 0.53
69. config-location - 0.48
70. config-export-typed - 0.43
71. exports-named - 0.38
72. exports-internal-hidden - 0.33
73. exports-types - 0.28
74. exports-components-index - 0.23
75. naming-pascalcase-exports - 0.18
76. naming-camelcase-runtime - 0.15
77. naming-composables-prefix - 0.12
78. naming-pinia-stores - 0.09
79. naming-constants - 0.07
80. naming-event-kebab - 0.06
81. imports-absolute-alias - 0.06
82. imports-no-deep-relative - 0.05
83. imports-from-index - 0.04
84. imports-grouping - 0.03
85. service-named-exports - 0.02
86. service-use-api-client - 0.01
87. stores-cross-cutting - 0.01
