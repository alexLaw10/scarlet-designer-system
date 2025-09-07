module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
    'git add'
  ],
  '*.{json,md,scss,css}': [
    'prettier --write',
    'git add'
  ]
};
