from sqlite3 import connect
from flask import Flask, redirect,request, render_template, jsonify
from mysql import connector

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

        # Fazendo a conexão com mysql

        connect = connector.connect(
            host = "localhost",
            database = "GuitarAcademy",
            user = "root",
            password = "pjn@2024"
        )

        cursor = connect.cursor()

        query = """
            insert into signup (email, password, telefone, cpf) values
            (%s, %s, %s, %s)
        """

        cursor.execute(query, dados)

        connect.commit()

        cursor.close()
        connect.close()

        return redirect(("/"))
    
    return render_template("signup.html")

if __name__ == "__main__":
    app.run(debug=True)