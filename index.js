#!/usr/bin/env node

import path from 'path';
import _ from 'lodash/fp';

import { walkSync } from './lib/collectInput';
import { parseImports } from './lib/parseImports';
import { printDot } from "./lib/printDot";

const absolutePath = path.resolve(process.argv[2]);
const files = _.flattenDeep(walkSync(absolutePath));
const imports = parseImports(files, absolutePath);

printDot(imports);