#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkFargateAlbPatternStack } = require('../lib/cdk-fargate-alb-pattern-stack');

const app = new cdk.App();

const _env  = { account: '457175632986', region: 'us-west-2' };

new CdkFargateAlbPatternStack(app, 'CdkFargateAlbPatternStack', {env: _env});
