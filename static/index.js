const sleep = async ms => new Promise(resolve=>setTimeout(resolve,ms));


function unsympy(f) {
    return f.replaceAll("**", "^");
}

function getgrad(x, fprime) {
    fprime = unsympy(fprime);
    console.log("fprime unsympyed", fprime)
    return math.evaluate(fprime.replaceAll("x", x));
    //return eval(fprime.replaceAll("x", x));
}

function gety(x, f) {
    f = unsympy(f);
    return math.evaluate(f.replaceAll("x", `(${x})`))
}


function getResult() {
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
        points = msg.points;
        fprime = msg.fprime;
        f = msg.f;
        setgraph(f);
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
    console.log(f, fprime);
    console.log(y, grad, c);
    calculator.setExpression({id: 'graph2', latex: `${grad}x+${c}`})
    document.getElementById("xvalue").innerHTML = `x value: ${x}`;
    document.getElementById("grad").innerHTML = `gradient: ${grad}`;
}

async function visualize(f, fprime, points) {
    for (var i = 0; i < points.length; i+=15) {
        replacemetrics(points[i], f, fprime);
        await sleep(60);
    }
}