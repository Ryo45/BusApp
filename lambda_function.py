import json

body = {'departure':720,'arrive':730,'crowded':80}
body_2={'departure':730,'arrive':740,'crowded':120}
body_3={'departure':740,'arrive':750,'crowded':10}

array=[body,body_2,body_3]
def lambda_handler(event, context):
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': array
    }
