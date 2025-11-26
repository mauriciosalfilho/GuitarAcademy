from flask import Flask, redirect, request, render_template, jsonify
from flask_mail import Mail, Message
from mysql import connector
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
import os
from datetime import datetime, timedelta

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)

# Configuração de email
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() in ('1','true','yes')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

# Inicializar Mail
mail = Mail(app)

# Serializador de tokens
serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

# ===== FUNÇÕES AUXILIARES =====

def gerar_token_reset(email):
    """Gera um token único e seguro para reset de senha (válido por 1 hora)"""
    return serializer.dumps(email, salt='reset-password-salt')

def verificar_token_reset(token, expiration=3600):
    """Verifica se o token é válido e não expirou (3600 segundos = 1 hora)"""
    try:
        email = serializer.loads(token, salt='reset-password-salt', max_age=expiration)
        return email
    except:
        return None

def email_existe_no_banco(email):
    """Verifica se o email existe na tabela signup"""
    try:
        db = connector.connect(
            host="localhost",
            database="GuitarAcademy",
            user="root",
            password="pjn@2024"
        )
        cursor = db.cursor()
        query = "SELECT email FROM signup WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        cursor.close()
        db.close()
        return result is not None
    except Exception as e:
        print(f"Erro ao verificar email: {e}")
        return False

def enviar_email_reset(email, token):
    """Envia email com link de reset de senha"""
    try:
        link_reset = f"http://localhost:5000/reset-senha/{token}"
        subject = "Guitar Academy - Redefinir Senha"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #1a1f2e; color: #ffffff; padding: 20px;">
                <div style="background-color: #242a33; padding: 20px; border-radius: 10px; border: 1px solid #2a2f36;">
                    <h2 style="color: #73adff; text-align: center;">Recuperar Senha</h2>
                    <p>Olá,</p>
                    <p>Você solicitou uma redefinição de senha para sua conta na Guitar Academy.</p>
                    <p>Clique no botão abaixo para redefinir sua senha:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="{link_reset}" style="background-color: #73adff; color: #1a1f2e; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                            Redefinir Senha
                        </a>
                    </div>
                    <p style="font-size: 0.9rem; color: #888;">Ou copie e cole este link no seu navegador:<br>{link_reset}</p>
                    <p style="font-size: 0.85rem; color: #666; margin-top: 20px;">Este link é válido por 1 hora.</p>
                    <p style="font-size: 0.85rem; color: #666;">Se você não solicitou este email, ignore-o.</p>
                </div>
            </body>
        </html>
        """
        
        msg = Message(
            subject=subject,
            recipients=[email],
            html=body,
            sender=app.config['MAIL_USERNAME']
        )
        
        mail.send(msg)
        print(f"Email de reset enviado para: {email}")
        return True
    except Exception as e:
        print(f"Erro ao enviar email: {e}")
        return False

def atualizar_senha_banco(email, nova_senha):
    """Atualiza a senha do usuário no banco de dados"""
    try:
        db = connector.connect(
            host="localhost",
            database="GuitarAcademy",
            user="root",
            password="pjn@2024"
        )
        cursor = db.cursor()
        query = "UPDATE signup SET password = %s WHERE email = %s"
        cursor.execute(query, (nova_senha, email))
        db.commit()
        cursor.close()
        db.close()
        print(f"Senha atualizada com sucesso para: {email}")
        return True
    except Exception as e:
        print(f"Erro ao atualizar senha: {e}")
        return False

# ===== FIM FUNÇÕES AUXILIARES =====

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

        try:
            # Conexão com mysql
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

            # Retornar JSON com sucesso para o frontend
            return jsonify({"success": True})
        
        except Exception as e:
            print(f"Erro ao cadastrar: {e}")
            return jsonify({"success": False, "error": str(e)}), 400
    
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
                    return redirect("/courses")
                else:
                    print(f"Falha de autenticação: CPF ou senha incorretos")
                    cursor.close()
                    db.close()
                    return render_template("signin.html", error="CPF ou senha incorretos")
            else:
                print(f"CPF não encontrado no banco de dados: {cpf_clean}")
                cursor.close()
                db.close()
                return render_template("signin.html", error="CPF ou senha incorretos")
        
        except Exception as e:
            print(f"Erro ao conectar ao banco de dados: {e}")
            return render_template("signin.html", error="Erro ao conectar ao banco de dados")
    
    return render_template("signin.html")

@app.route("/esqueci-senha", methods=["GET", "POST"])
def forgot_password():
    if request.method == "POST":
        email = request.form.get("email")
        
        print(f"Recuperação de senha solicitada para: {email}")
        
        # Verificar se o email existe no banco
        if not email_existe_no_banco(email):
            return render_template("senha.html", error="Email não encontrado no banco de dados")
        
        # Gerar token seguro
        token = gerar_token_reset(email)
        
        # Enviar email com link de reset
        if enviar_email_reset(email, token):
            return render_template("senha.html", success="Email enviado com sucesso! Verifique sua caixa de entrada.")
        else:
            return render_template("senha.html", error="Erro ao enviar email. Tente novamente mais tarde.")
    
    return render_template("senha.html")

@app.route("/reset-senha/<token>", methods=["GET", "POST"])
def reset_password(token):
    # Verificar se o token é válido
    email = verificar_token_reset(token)
    
    if not email:
        return render_template("reset.html", error="Link inválido ou expirado. Solicite um novo reset de senha.")
    
    if request.method == "POST":
        nova_senha = request.form.get("nova_senha")
        confirmar_senha = request.form.get("confirmar_senha")
        
        # Validações
        if not nova_senha or not confirmar_senha:
            return render_template("reset.html", error="Todos os campos são obrigatórios")
        
        if len(nova_senha) < 6:
            return render_template("reset.html", error="A senha deve ter pelo menos 6 caracteres")
        
        if nova_senha != confirmar_senha:
            return render_template("reset.html", error="As senhas não correspondem")
        
        # Atualizar senha no banco
        if atualizar_senha_banco(email, nova_senha):
            # Redirecionar para login com mensagem de sucesso
            return redirect("/login?success=true&message=Senha+alterada+com+sucesso")
        else:
            return render_template("reset.html", error="Erro ao atualizar senha. Tente novamente.")
    
    return render_template("reset.html")

@app.route("/courses", methods=["GET"])
def courses():
    return render_template("courses.html")

@app.route("/newsletter", methods=["GET", "POST"])
def registered():

    if request.method == "POST":

        email = request.form.get("email")

        if not email:
            return jsonify({"success": False, "error": "Email é obrigatório"}), 400

        params = (email,)

        print(params)

        try:
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

            return jsonify({"success": True, "message": "Inscrito com sucesso! "})
        
        except Exception as e:
            print(f"Erro ao inscrever na newsletter: {e}")
            return jsonify({"success": False, "error": "Erro ao inscrever na newsletter"}), 400
    
    return redirect(("/"))
if __name__ == "__main__":
    app.run(debug=True)