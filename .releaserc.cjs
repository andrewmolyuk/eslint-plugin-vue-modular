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

            // Filter out merge commits by header
            if (commit.header && typeof commit.header === 'string') {
              if (commit.header.startsWith('chore(pr):')) return null
              if (commit.header.startsWith('chore(merge):')) return null
              if (commit.header.startsWith('Merge pull request')) return null
              if (commit.header.startsWith('Merge branch')) return null
            }

            // Return a shallow copy instead of mutating the provided object.
            // The conventional-changelog writer may provide frozen/immutable commits.
            const out = Object.assign({}, commit)

            // shorten commit hash for nicer links (7 chars is common)
            if (out.hash && typeof out.hash === 'string' && out.hash.length > 7) {
              out.hash = out.hash.slice(0, 7)
            }

            return out
          },
        },
      },
    ],
    '@semantic-release/npm',
    '@semantic-release/github',
  ],
}
