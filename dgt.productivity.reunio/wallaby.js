module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      'src/**/*.html',
      'src/**/*.scss',
      'src/**/*.json',
      'node_modules/@ionic/app-scripts/**/*',
      '!src/**/*.spec.ts'
    ],

    tests: [
      'src/**/*.spec.ts'
    ],

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jasmine',
    exclude: [
    ],
    compilers: {
      '**/*.ts': wallaby.compilers.typeScript({
        module: 'commonjs',
        jsx: 'react'
      })
    },

    preprocessors: {
      '**/*.js': function(file) {
        return require('babel-core').transform(
          file.content,
          {sourceMap: true, presets: ['env']}
        );
      },
      '**/*.scss': function(file, done) {
        sass.render({
          data: file.content,
          includePaths: ['node_modules/ionic-angular/themes', 'node_modules/ionicons/dist/scss']
        }, function(error, result) {
          if (error) {
            done(error);
          } else {
            done({ code: result.css.toString(), map: result.map.toString() });
          }
        });
      },
      '**/*.html': function(file) {
        return { code: file.content, map: null };
      },

    setup: function () {
      require('reflect-metadata');
      require('zone.js/dist/zone');
      require('zone.js/dist/long-stack-trace-zone');
      require('zone.js/dist/proxy');
      require('zone.js/dist/sync-test');
      require('zone.js/dist/async-test');
      require('zone.js/dist/fake-async-test');
      require('@angular/core/testing').TestBed.initTestEnvironment(
        require('@angular/platform-browser-dynamic/testing').BrowserDynamicTestingModule,
        require('@angular/platform-browser-dynamic/testing').platformBrowserDynamicTesting()
      );
    }
  }
}
}
