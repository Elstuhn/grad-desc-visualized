import sympy
from differentiate import differentiate
import decimal

def cleanfunc(func : str):
    """
    'cleans' the function given and then returns a function of the given function which was previously a string
    """
    x = sympy.Symbol("x")
    try:
        f = sympy.sympify(func)
        return sympy.lambdify(x, f)
    except:
        try:
            func = func.replace("^", "**")
            f = sympy.sympify(func)
            return sympy.lambdify(x, f)
        except:
            pass
    inds = []
    func = list(func)
    for i, j in enumerate(func):
        if all([
            j == "x",
            func[i-1] != "(",
            func[i-1].isdigit(),
            i != 0,
        ]):
            inds.append(i)
            
    prev = 0
    result = ""
    for index in inds:
        result += "".join(func[prev:index])+"*"
        prev = index
    result += "".join(func[prev:])
    f = sympy.sympify(result)
    return sympy.lambdify(x, f)        

def prepfunc(func : str):
    """
    cleans the function for differentiating
    """
    try:
        t = sympy.sympify(func)
        t(2)
        return func
    except:
        try:
            func = func.replace("^", "**")
            sympy.sympify(func)
            return func
        except:
            pass
    inds = []
    func = list(func)
    for i, j in enumerate(func):
        if all([
            j == "x",
            func[i-1] != "(",
            func[i-1].isdigit(),
            i != 0,
        ]):
            inds.append(i)
    
    prev = 0
    result = ""
    for index in inds:
        result += "".join(func[prev:index])+"*"
        prev = index
    result += "".join(func[prev:])
    return result 

def grad_desc(x : float, func : str, lr : float = 3e-4, threshold : float = 1e-5):
    """
    Trains x by approximating the gradient and checks it against the threshold
    """
    x = float(x)
    points = [x]
    lr = float(lr)
    threshold = float(threshold)
    X = sympy.Symbol("x")
    f = cleanfunc(func)
    func = prepfunc(func)
    fprimed = sympy.diff(func)
    fprime = sympy.sympify(fprimed)
    fprime = sympy.lambdify(X, fprime)
    while any([
        fprime(x) > 0+threshold,
        fprime(x) < 0-threshold
    ]): #careful of saddle points
        x -= fprime(x)*lr
        points.append(x)
        
    return func, fprimed, points
