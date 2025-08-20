const plugin = {
  meta: {
    name: 'eslint-plugin-vue-modular',
    version: '1.0.0',
    namespace: 'vue-modular',
  },
  rules: {
    'no-var': {
      meta: {
        type: 'suggestion',
        docs: {
          description: "Disallow usage of 'var'",
          recommended: false,
        },
        messages: {
          unexpected: "Unexpected 'var', use 'let' or 'const' instead.",
        },
      },
      create(context) {
        return {
          VariableDeclaration(node) {
            if (node.kind === 'var') {
              context.report({
                node,
                messageId: 'unexpected',
              });
            }
          },
        };
      },
    },
  },
  processors: {},
};

plugin.configs = {
  recommended: [
    {
      plugins: {
        'vue-modular': plugin,
      },
      rules: {
        'vue-modular/no-var': 'error',
      },
    },
  ],
};

export default plugin;
