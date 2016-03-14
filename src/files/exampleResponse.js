/*eslint-disable*/
module.exports = {
  "code": 200,
  "body": '{"Instances":[{"InstanceId":"i-1697eea4"}],"Subnets":["subnet-0378a966","subnet-eccedfaa"],"DNSName":"postato-1254052096.us-west-1.elb.amazonaws.com","VPCId":"vpc-79b1491c","LoadBalancerName":"postato","CanonicalHostedZoneName":"postato-1254052096.us-west-1.elb.amazonaws.com","SourceSecurityGroup":{"GroupName":"default","OwnerAlias":"933693344490"},"AvailabilityZones":["us-west-1a","us-west-1c"],"HealthCheck":{"Target":"HTTPS:8000/index.html","Timeout":5,"Interval":30,"HealthyThreshold":10,"UnhealthyThreshold":2},"SecurityGroups":["sg-1227fa77"],"ListenerDescriptions":[{"Listener":{"Protocol":"HTTPS","InstancePort":80,"InstanceProtocol":"HTTP","LoadBalancerPort":443,"SSLCertificateId":"arn:aws:iam::933693344490:server-certificate/InOpseeComWildcard"},"PolicyNames":["AWSConsole-SSLNegotiationPolicy-postato-1454712422460"]}],"CreatedTime":"2016-02-05T22:47:01.51Z","Scheme":"internet-facing","CanonicalHostedZoneNameID":"Z1M58G0W56PQJA"}',
  "headers": [
    {
      "name": "Date",
      "values": [
        "Thu, 25 Feb 2016 23:28:15 GMT"
      ]
    },
    {
      "name": "Server",
      "values": [
        "WSGIServer/0.1 Python/2.7.6"
      ]
    },
    {
      "name": "Content-Type",
      "values": [
        "application/json"
      ]
    },
    {
      "name": "Content-Length",
      "values": [
        "9"
      ]
    }
  ],
  "metrics": [
    {
      "name": "request_latency_ms",
      "value": 3.3661290000000004
    }
  ]
}