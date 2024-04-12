from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app)

id = 0
solicitacoes = []

@app.route('/listar', methods=['GET'])
def listar_solicitacoes():
    return jsonify(solicitacoes)

@app.route('/cadastro', methods=['POST'])
def cadastrar_chamado():
    global id
    nome = request.form['nome']
    cpf = request.form['cpf']
    descricao = request.form['descricao']
    setor = request.form['setor']
    data_atual = datetime.datetime.now().strftime("%d/%m/%Y")
    id += 1
    novo_chamado = {
        "id": id,
        "nome": nome,
        "cpf": cpf,
        "descricao": descricao,
        "setor": setor,
        "status": True,
        "data": data_atual,
        "comentario": ""
    }
    solicitacoes.append(novo_chamado)
    return jsonify({"message": "Chamado cadastrado"}), 201

@app.route('/<string:cpf>', methods=['GET'])
def obter_chamados_por_cpf(cpf):
    chamados_por_cpf = [chamado for chamado in solicitacoes if chamado['cpf'] == cpf]
    if chamados_por_cpf:
        return jsonify(chamados_por_cpf), 200
    else:
        return jsonify({"error": "Nenhum chamado encontrado para este CPF"}), 404

if __name__ == '__main__':
    app.run(debug=True)

