const cdk = require('@aws-cdk/core')
const ec2 = require('@aws-cdk/aws-ec2')
const ecs = require('@aws-cdk/aws-ecs')
const ecsPatterns = require('@aws-cdk/aws-ecs-patterns')
const platform = require("../lib/cdk-sg-construct")

class CdkFargateAlbPatternStack extends cdk.Stack {
    /**
     *
     * @param {cdk.Construct} scope
     * @param {string} id
     * @param {cdk.StackProps=} props
     */
    constructor(scope, id, props) {
        super(scope, id, props);

        // The code that defines your stack goes here

        const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
            isDefault: true
        });

        const wordpressSg = new ec2.SecurityGroup(this, "fwp-sg", {
            vpc: vpc,
            description: "FormsWPStack SecurityGroup",
        });

        const cluster = new ecs.Cluster(this, "ecs-cluster", {
            vpc,
        });

        //cluster.connections.addSecurityGroup(wordpressSg);

        const taskImageOptions = {
            // An instance of Container Image: https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecs.ContainerImage.html
            // from DockerHub or other registry
            image: ecs.ContainerImage.fromRegistry('kissmygritts/fishnv-app'),
            containerPort: 3000,
            environment: {
                APIURL: 'http://api.fishnv-service:3000'
            }
        }

        const fargateLoadBalancedService = new ecsPatterns.ApplicationLoadBalancedFargateService(
            this,
            'FrontendFargateLBService',
            {
                serviceName: 'fishnv-frontend',
                publicLoadBalancer: true,
                cpu: 512,
                memoryLimitMiB: 1024,
                desiredCount: 1,
                cluster: cluster,
                taskImageOptions: taskImageOptions
            }
        )

        const basePlatform = new BasePlatform0(this, id, props);
        //const basePlatform = new platform.BasePlatform(this, id, props);
        
        cluster.connections.addSecurityGroup(basePlatform.ServicesSecGrp2);
        
        fargateLoadBalancedService.service.connections.allowTo(
            //wordpressSg,
            //basePlatform.ServicesSecGrp,
            basePlatform.ServicesSecGrp2,
            //ec2.Port.tcp(8080)
            new ec2.Port({
                protocol: ec2.Protocol.TCP,
                stringRepresentation: "port3000",
                fromPort: 3000,
                toPort: 3000
            })
        );
    }
}

class BasePlatform0 extends cdk.Stack {
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

module.exports = { CdkFargateAlbPatternStack }
