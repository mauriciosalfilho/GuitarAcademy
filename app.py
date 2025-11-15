from flask import Flask, redirect,request, render_template, jsonify

app = Flask(__name__)

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/cadastro-main", methods=["GET", "POST"])
def login_form():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")
        telefone = request.form.get("telefone")
        cpf = request.form.get("cpf")

        dados = (
            email,
            password,
            telefone,
            cpf
        )

        print(dados)

        return redirect(("/"))
    
    return render_template("signup.html")

if __name__ == "__main__":
    app.run(debug=True)