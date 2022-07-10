from flask import Flask, render_template, request, session
import sys
import typing as t

from grad_desc_normal import *

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getanswer', methods=["POST"])
def answer():
    if request.method == "POST":
        data = request.data 
        data = data.decode("utf-8")
        data = eval(data)
        try:
            f, fprime, points = grad_desc(*[data[i] for i in data])
        except Exception as e:
            return {"status" : 0, "error": f"{type(e)} {e}"}
        fprime = str(fprime)
        return {"f": f, "fprime": fprime, "points": points, "status": 1}
    else:
        pass
    
@app.route('/save', methods=["POST"])
def save():
    data = request.data 
    data = data.decode("utf-8")
    data = eval(data)
    print(data)
    session[data['name']] = data['obj']
    print(session)
    return 1

if __name__ == "__main__":
    app.run(debug=True, threaded=True)