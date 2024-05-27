import type { Config } from '@jest/types';

export default {
  projects: [
    // 通常のjestでのテスト
    {
      displayName: 'test',
      transform: {
        '\\.ts$': [
          'ts-jest',
          {
            tsconfig: `<rootDir>/tests/tsconfig.json`,
          },
        ],
      },
    },
    ...(process.env['npm_config_lint']
      ? // npm test --lintで実行すると以下も追加でテストする
        [
          // eslintでのチェック
          {
            displayName: 'eslint',
            runner: 'jest-runner-eslint',
            testMatch: ['**/*.ts', '**/*.cjs'],
          },
          // prettierで整形して差異がないかチェック
          {
            preset: '@sugoroku-y/jest-runner-prettier',
          },
        ]
      : []),
  ],
  collectCoverage: !!process.env['npm_config_coverage'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
} satisfies Config.InitialOptions;
