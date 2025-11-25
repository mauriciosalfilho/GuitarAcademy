from sqlite3 import connect
from flask import Flask, redirect,request, render_template, jsonify
from mysql import connector

app = Flask(__name__)

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/cadastro", methods=["GET", "POST"])
def login_form():

    if request.method == "POST":

        email = request.form.get("email")
        password = request.form.get("password")
        telefone = request.form.get("telefone")
        cpf = request.form.get("cpf")
        
        # Remover formatação do CPF para salvar apenas dígitos
        cpf_clean = cpf.replace(".", "").replace("-", "")

        dados = (
            email,
            password,
            telefone,
            cpf_clean
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

        # Após cadastro bem-sucedido, redireciona para a tela de login
        # com um parâmetro indicando sucesso
        return redirect("/signin?success=1")
    
    return render_template("signup.html")

@app.route("/login", methods=["GET"])
def login():
 
    success_flag = request.args.get('success')
    if success_flag:
        return render_template("signin.html", success="Cadastro feito com sucesso. Efetue login")

    return render_template("signin.html")

@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        cpf = request.form.get("cpf")
        password = request.form.get("password")
        
        # Remover formatação do CPF para comparar apenas dígitos
        cpf_clean = cpf.replace(".", "").replace("-", "")
        
        print(f"Tentativa de login - CPF: {cpf_clean}, Senha: {password}")
        
        try:
            # Conectar ao banco de dados
            db = connector.connect(
                host = "localhost",
                database = "GuitarAcademy",
                user = "root",
                password = "pjn@2024"
            )
            
            cursor = db.cursor()
            
            # Buscar usuário pelo CPF
            query = "SELECT cpf, password FROM signup WHERE cpf = %s"
            cursor.execute(query, (cpf_clean,))
            
            result = cursor.fetchone()
            
            # Verificar se usuário existe e senha está correta
            if result:
                db_cpf, db_password = result
                
                # Comparar CPF e senha
                if db_cpf == cpf_clean and db_password == password:
                    print(f"Login bem-sucedido para CPF: {cpf_clean}")
                    cursor.close()
                    db.close()
                    # Redirecionar para página de cursos
                    return redirect("/courses")
                else:
                    print(f"Falha de autenticação: CPF ou senha incorretos")
                    cursor.close()
                    db.close()
                    # Retornar para signin com mensagem de erro
                    return render_template("signin.html", error="CPF ou senha incorretos")
            else:
                print(f"CPF não encontrado no banco de dados: {cpf_clean}")
                cursor.close()
                db.close()
                # Retornar para signin com mensagem de erro
                return render_template("signin.html", error="CPF ou senha incorretos")
        
        except Exception as e:
            print(f"Erro ao conectar ao banco de dados: {e}")
            return render_template("signin.html", error="Erro ao conectar ao banco de dados")
    
    return render_template("signin.html")

@app.route("/courses", methods=["GET"])
def courses():
    return render_template("courses.html")

@app.route("/newsletter", methods=["GET", "POST"])
def registered():

    if request.method == "POST":

        email = request.form.get("email")

        if not email:
            return redirect(("/"))

        params = (email,)

        print(params)

        db = connector.connect(
            host = "localhost",
            database = "GuitarAcademy",
            user = "root",
            password = "pjn@2024"
        )

        cursor = db.cursor()

        insert = """
            insert into newsletter (email) values (%s)
        """

        cursor.execute(insert, params)

        db.commit()

        cursor.close()
        db.close()

        return redirect(("/"))
    
    return redirect(("/"))
if __name__ == "__main__":
    app.run(debug=True)