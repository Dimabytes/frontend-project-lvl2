#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();
program.version('0.0.1');

program
  .option('-f, --format [type]', 'output format');

program.parse(process.argv);
