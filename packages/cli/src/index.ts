#!/usr/bin/env node

import { Region } from '@contentstack/delivery-sdk';
import { FeatureFlag, fetchFeatureFlags } from '@lamkoti/ghostff-core';
import chalk from 'chalk';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const program = new Command();

interface Config {
  apiKey: string;
  deliveryToken: string;
  environment: string;
  region?: Region;
  contentTypeUid: string;
  outputPath: string;
  host?: string;
}

const validateEnvFile = (envPath: string): Config => {
  if (!fs.existsSync(envPath)) {
    throw new Error(`Environment file not found: ${envPath}`);
  }

  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  
  const requiredVars = [
    'CONTENTSTACK_API_KEY',
    'CONTENTSTACK_DELIVERY_TOKEN',
    'CONTENTSTACK_ENVIRONMENT',
    'CONTENTSTACK_CONTENT_TYPE_UID',
    'GHOSTFF_OUTPUT_PATH'
  ];

  const missingVars = requiredVars.filter(varName => !envConfig[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return {
    apiKey: envConfig.CONTENTSTACK_API_KEY!,
    deliveryToken: envConfig.CONTENTSTACK_DELIVERY_TOKEN!,
    environment: envConfig.CONTENTSTACK_ENVIRONMENT!,
    region: envConfig.CONTENTSTACK_REGION as Region,
    contentTypeUid: envConfig.CONTENTSTACK_CONTENT_TYPE_UID!,
    host: envConfig.CONTENTSTACK_HOST,
    outputPath: envConfig.GHOSTFF_OUTPUT_PATH!
  };
};

const writeFeatureFlagsToFile = (flags: FeatureFlag[], outputPath: string) => {
  const outputDir = path.dirname(outputPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputContent = JSON.stringify(flags, null, 2);
  fs.writeFileSync(outputPath, outputContent);
  
  console.log(chalk.green(`✓ Feature flags written to: ${outputPath}`));
  console.log(chalk.gray(`Found ${flags.length} feature flags`));
};

program
  .name('ghostff')
  .description('CLI tool for fetching feature flags from Contentstack')
  .version('1.0.0');

program
  .command('generate')
  .description('Generate feature flags from Contentstack')
  .option('-e, --env <path>', 'Path to .env file', '.env')
  .action(async (options) => {
    try {
      console.log(chalk.blue('Fetching feature flags from Contentstack...\n'));

      // Load and validate environment variables
      const config = validateEnvFile(options.env);
      
      console.log(chalk.gray(`Using configuration:`));
      console.log(chalk.gray(`  Environment: ${config.environment}`));
      console.log(chalk.gray(`  Region: ${config.region}`));
      console.log(chalk.gray(`  Content Type UID: ${config.contentTypeUid}`));
      console.log(chalk.gray(`  Output Path: ${config.outputPath}\n`));

      // Fetch feature flags
      const flags = await fetchFeatureFlags(config);

      if (flags.length === 0) {
        console.log(chalk.yellow('No feature flags found in Contentstack.'));
        return;
      }

      // Write to file
      writeFeatureFlagsToFile(flags, config.outputPath);

      console.log(chalk.green('\n✓ Feature flags fetched and saved successfully!'));
      
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
      process.exit(1);
    }
  });

program.parse(); 