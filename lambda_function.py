import json
import random

body = {'departure':720,'arrive':730,'crowded':80}
body_2={'departure':730,'arrive':740,'crowded':120}
body_3={'departure':740,'arrive':750,'crowded':10}

array=[body,body_2,body_3]

def lambda_handler(event, context):
    # デバッグ用
    payload=event
    
    # axios.getのparams辞書の中身は'queryStringParameters'で取得する
    params = event['queryStringParameters']
    func=params['func']
    
    if func=='getBusData':
        payload = array
        
        # input_timeパラメータがある場合は以下を実行
        try:
            input_time = params["input_time"]
            
            ### 以下、デモ用にサンプル生成
            # 分で表現
            minutes = int(input_time.split(":")[0])*60+int(input_time.split(":")[1]) 
            minutes = int(minutes/10)*10 # 10分単位に丸める
            for i in range(3):
                array[i]["departure"]=minutes+(i-1)*10
                array[i]["arrive"]=minutes+i*10
                array[i]["crowded"]=10*random.randint(5,15)
            payload = array
            
            print(input_time)
        except KeyError:
            pass
        
    elif func=='sendReminder':
        email = params['mailaddress']
        payload = email
    
    return {
        'isBase64Encoded': False,
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(payload)
    }