// Minimal semantic-release configuration to filter merge commits from generated
// release notes. This customizes the release-notes writer transform only.
// It returns null for merge commits so they are excluded from notes.
module.exports = {
  branches: ['main'],
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        writerOpts: {
          transform(commit) {
            if (commit && commit.header && typeof commit.header === 'string') {
              if (commit.header.startsWith('Merge pull request')) return null
            }
            return commit
          },
        },
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
}
