/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require('@yarnpkg/types');

const reactPackages = ['react', 'react-dom'];
const reactVersion = '18.3.1';

module.exports = defineConfig({
  async constraints({ Yarn }) {
    for (const dep of Yarn.dependencies({ ident: 'typescript' })) {
      dep.update('5.7.3');
    }

    for (const dep of Yarn.dependencies({ ident: '@types/node' })) {
      dep.update('^22');
    }

    for (const dep of Yarn.dependencies({ ident: '@types/react' })) {
      dep.update('18.3.18');
    }

    reactPackages.forEach((ident) => {
      for (const dep of Yarn.dependencies({ ident })) {
        dep.update(reactVersion);
      }
    });
  },
});
