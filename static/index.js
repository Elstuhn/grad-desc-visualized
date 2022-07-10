const sleep = async ms => new Promise(resolve=>setTimeout(resolve,ms));
var flag = true;

function unsympy(f) {
    return f.replaceAll("**", "^");
}

function getgrad(x, fprime) {
    fprime = unsympy(fprime);
    return math.evaluate(fprime.replaceAll("x", x));
    //return eval(fprime.replaceAll("x", x));
}

function gety(x, f) {
    f = unsympy(f);
    return math.evaluate(f.replaceAll("x", `(${x})`))
}


function getResult() {
    flag = false;
    func = document.getElementById("poly").value;
    x = document.getElementById("x").value;
    lr = document.getElementById("lr").value;
    threshold = document.getElementById("th").value;
    $.ajax({
        type: "POST",
        url:"/getanswer",
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({"x": x, "func": func, "lr": lr, "threshold": threshold}),
        /*success: (msg, status, jqXHR) => {
            console.log(msg);
        }*/
    }).done((msg, status, jqXHR) => {
        if (!msg.status) {
            document.getElementById("error").innerHTML = msg.error;
            return;
        }
        points = msg.points;
        fprime = msg.fprime;
        f = msg.f;
        setgraph(f);
        flag = true;
        visualize(f, fprime, points);
    })
}

function save(name, obj) {
    $.ajax({
        type: "POST",
        url: "/save",
        //contentType: 'application/json;charset=UTF-8',
        data: {"name": name, "obj": obj},
    })
}



function main() {
    var elt = document.getElementById('calculator');
    calculator = Desmos.GraphingCalculator(elt, { expressions:false, keypad: false, settingsMenu:false});
    calculator.setExpression({id: 'graph1', latex: 'x^2+3x+2'});
    /*sessionStorage.setItem("calculator", JSON.stringify({calculator : calculator}));
    console.log(sessionStorage);
    console.log(JSON.parse(sessionStorage.getItem("calculator")));*/
}

function startserver() {
    $.ajax({
        url:"load.py",
        context: document.body
    })
}

function setgraph(f) {
    func = document.getElementById("poly").value;
    //var calculator = sessionStorage.getItem("calculator");
    calculator.setExpression({id: 'graph1', latex: func});
    //sessionStorage.setItem("calculator", calculator)
}

function replacemetrics(x, f, fprime) {
    y = gety(x, f);
    grad = getgrad(x, fprime);
    c = y-(grad*x);
    calculator.setExpression({id: 'graph2', latex: `${grad}x+${c}`})
    document.getElementById("xvalue").innerHTML = `x value: ${x}`;
    document.getElementById("grad").innerHTML = `gradient: ${grad}`;
}

async function visualize(f, fprime, points) {
    document.getElementById("finished").innerHTML = "";
    document.getElementById("error").innerHTML = "";
    let i = 0;
    while (flag && i < points.length) {
        replacemetrics(points[i], f, fprime);
        await sleep(60);
        i += 15
    }
    document.getElementById("finished").innerHTML = "finished";
}