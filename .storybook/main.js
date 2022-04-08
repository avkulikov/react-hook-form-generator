module.exports = {
  refs: {
    // Remove chakra ui from showing up along side our components
    '@chakra-ui/react': {
      disable: true,
    },
  },
  stories: [
    '../src/stories/**/*.stories.mdx',
    '../src/stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@chakra-ui/storybook-addon',
    '@storybook/addon-links',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
};
