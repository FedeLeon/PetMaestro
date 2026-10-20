// Test-only loader: read real TypeScript content without booting React Native.
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  module._compile(code, filename);
};
for (const extension of ['.png', '.ogg', '.mp3']) {
  require.extensions[extension] = (module, filename) => { module.exports = filename; };
}
module.exports = {
  ...require('../src/data/gameContent.ts'),
  ...require('../src/data/assetImages.ts'),
  ...require('../src/data/audioAssets.ts'),
  ...require('../src/data/gameAudio.ts'),
  ...require('../src/data/kitchenContent.ts'),
  ...require('../src/data/gardenContent.ts'),
  ...require('../src/data/adventureContent.ts'),
};
