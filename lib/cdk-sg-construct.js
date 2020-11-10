const cdk = require('@aws-cdk/core')
const ec2 = require('@aws-cdk/aws-ec2')

class BasePlatform extends cdk.Construct {
    constructor(scope, id, props) {
        super(scope, id, props);

        const ServicesSecGrp = ec2.SecurityGroup.fromSecurityGroupId(
            this, "ServicesSecGrp", {
            securityGroupId: cdk.Fn.importValue('ServicesSecGrp')
        });

        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
            isDefault: true
        });

        const ServicesSecGrp2 = new ec2.SecurityGroup(this, "fwp-sg", {
            vpc: vpc,
            description: "XXX SecurityGroup",
        });

    }
}

module.exports = { BasePlatform }