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
            if (!commit) return null
            if (commit.header && typeof commit.header === 'string') {
              if (commit.header.startsWith('Merge pull request')) return null
              if (commit.header.startsWith('Merge branch')) return null
            }

            // shorten commit hash for nicer links (7 chars is common)
            if (commit.hash && typeof commit.hash === 'string' && commit.hash.length > 7) {
              commit.hash = commit.hash.slice(0, 7)
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
