require('dts-generator').generate({
  name: 'phosphor-disposable',
  main: 'phosphor-disposable/index',
  baseDir: 'lib',
  files: ['index.d.ts'],
  out: 'lib/phosphor-disposable.d.ts',
});
