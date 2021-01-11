#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from '../src/index.js';

const program = new Command();
program.version('0.0.1');

program
  .option('-f, --format [type]', 'output format (default: "[type]")', 'stylish');

program
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const diffJson = genDiff(filepath1, filepath2, program.format);
    console.log(diffJson);
  });

program.parse(process.argv);
