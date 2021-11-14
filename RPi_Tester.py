import json
from time import sleep
import random
import math 
import time
import logging
from flask import Flask, request, jsonify, session, Response, render_template
# from flask_session import Session
# from flask_csv import send_csv



FORMAT = 'utf-8'
LIST_C_E = {}
i=0
apparatus = ["Other","WP_LIS_IST","Other","Other","Other","Other"]
result_id_save=0
RESULTS = []

# List_of_Exexution_Configured = {}

app = Flask(__name__, template_folder='templates', static_folder='static')





# app.config['SESSION_TYPE'] = 'memcached'
#sess = Session(app)
    


#app.logger.disabled = False




@app.route('/',methods=['GET'])
def HTML_exe():
    return render_template("pendulum.html")

def get_Config(Exp):
    #Apanhar erro se ficheiro no existir
    config = 'Configs/'+str(Exp)+'.json'
    with open(config) as json_file:
        data = json.load(json_file)
    return data

@app.route('/api/v1/apparatus/<int:apparatus_id>', methods=['GET'])
def Send_config (apparatus_id):
    print(apparatus[apparatus_id])
    print(json.dumps(get_Config(apparatus[apparatus_id])))
    return get_Config(apparatus[apparatus_id])

@app.route('/api/v1/apparatus/<int:apparatus_id>/nextexecution', methods=['GET'])
def Send_execution_to_RPi (apparatus_id):
    global LIST_C_E
    if LIST_C_E != None and "apparatus" in LIST_C_E.keys():
        if LIST_C_E["apparatus"] == apparatus_id:
            print (apparatus_id)
            save = LIST_C_E
            LIST_C_E = {}
            return save
        else:
            print(LIST_C_E["apparatus"])
            return {"error":"wrong apparatus, u send "+str(apparatus_id)}
    else:
        
        return {"error":"bad"}


@app.route('/api/v1/execution', methods=['POST','OPTIONS'])
def Flask_f1():
    global LIST_C_E
    global i
    if request.method == 'POST':
        #origin = request.headers.get('Origin')	
        print("ola",request.data)
        user_json = json.loads(request.data.decode(FORMAT))
        LIST_C_E = user_json
        print (json.dumps(LIST_C_E))
        j= i
        i=i+1
        return {"id":int(j), "execution":json.dumps(LIST_C_E) } 
    elif request.method == 'OPTIONS':
        return ''


@app.route('/api/v1/result', methods=['POST','OPTIONS'])
def recive_data_RPi ():
    global RESULTS
    global result_id_save
    if request.method == 'POST':
        print("ola",request.data)
        user_json = json.loads(request.data.decode(FORMAT))
        user_json["id"] = result_id_save
        
        RESULTS.append(user_json)
        print (json.dumps(RESULTS[result_id_save]))
        result_id_save = result_id_save +1
        return ''
    



@app.route('/api/v1/execution/<int:execution_id>/result/<int:result_id>', methods=['GET'])
def getPoint(execution_id,result_id):
    global RESULTS
    if RESULTS != None and len(RESULTS) > result_id :
        send_data = RESULTS[result_id]
        return send_data
    else:
        return ''
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port = 5005,debug=True)


