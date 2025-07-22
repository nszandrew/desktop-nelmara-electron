const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    // Adicione estas configurações para garantir os caminhos corretos
    dir: '.',
    out: 'out',
    // Ignora arquivos desnecessários para reduzir o tamanho e evitar problemas
    ignore: [
      /^\/src\//,
      /^\/\.vscode\//,
      /^\/\.git\//,
      /^\/\.gitignore$/,
      /^\/README\.md$/,
      /^\/vite\.config\./,
      /^\/node_modules\/.*\/test\//,
      /^\/node_modules\/.*\/tests\//,
      /^\/node_modules\/.*\/\.git\//,
    ],
    // Força a inclusão de certas dependências problemáticas
    afterCopy: [
      (buildPath, electronVersion, platform, arch, callback) => {
        callback();
      }
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
      config: {}
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};