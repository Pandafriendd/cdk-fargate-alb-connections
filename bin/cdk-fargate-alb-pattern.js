#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkFargateAlbPatternStack } = require('../lib/cdk-fargate-alb-pattern-stack');

const app = new cdk.App();
new CdkFargateAlbPatternStack(app, 'CdkFargateAlbPatternStack');
