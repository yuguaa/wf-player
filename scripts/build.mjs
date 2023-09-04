import fs from 'fs';
import { Parcel } from '@parcel/core';

(async () => {
    const { version } = JSON.parse(fs.readFileSync(`package.json`, 'utf-8'));

    const bundler = new Parcel({
        entries: `src/index.js`,
        defaultConfig: '@parcel/config-default',
        mode: 'production',
        targets: {
            mian: {
                distDir: 'dist',
                sourceMap: false,
                outputFormat: 'global',
                engines: {
                    browsers: '> 0.5%, last 2 versions, not dead',
                },
            },
        },
        env: {
            NODE_ENV: 'production',
            APP_VER: version,
        },
    });

    const banner =
        '/*!\n' +
        ` * wfplayer.js v${version}\n` +
        ` * Github: https://github.com/yuguaa/wf-player\n` +
        ` * (c) 2017-${new Date().getFullYear()} yuguaa\n` +
        ' * Released under the MIT License.\n' +
        ' */\n';

    const { bundleGraph, buildTime } = await bundler.run();
    const bundles = bundleGraph.getBundles();

    const filePath = `dist/index.js`;
    const newFilePath = `dist/wfplayer.js`;
    const code = banner + fs.readFileSync(filePath);
    fs.writeFileSync(filePath, code.replace(/\\n*\s*</g, '<').replace(/>\\n*\s*/g, '>'));
    fs.renameSync(filePath, newFilePath);
    const size = fs.statSync(newFilePath).size / 1024;
    console.log(`✨ Built  wfplayer@${version}`, `Bundles@${bundles.length}`, `Time@${buildTime}ms`, `Size@${size}kb`);
})();
