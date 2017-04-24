var _ = require('underscore');

var ds_sql = "insert into tabela (cd_produto, cd_conta, cd_unidade, cd_categoria, ds_nome, nr_estoque_minimo, nr_estoque, ds_descricao, sn_ativo, dt_cadastro, dt_alteracao, ds_categoria, sn_encontrou_prod_req, ds_sigla, sn_selecionado, dt_aquisicao) VALUES (5, 126, 2, 3, 'Arroz', 10, 0, 'arroz', 1, '2017-03-01 10:06:01', NULL, 'Produtos Alimenticios', 5, 'Kg', 0, NULL);";

var nr_pos_values = ds_sql.indexOf(' VALUES ');

if (nr_pos_values > 0) {
    var arrValues = ds_sql.split(' VALUES ');

    // pega campos
    var arrCampos = arrValues[0].split(',');

    // limpa campos
    arrCampos = _.map(
        arrCampos,
        limpaPrimeiroEUltimo
    )

    var arrValores = arrValues[1].split(', ');

    // limpa campos
    arrValores = _.map(
        arrValores,
        limpaPrimeiroEUltimo
    )

    // imprime os valores
    _.each(
        arrCampos,
        function (ds_valor, nr_index) {
            imprimir(
                arrValores,
                ds_valor,
                nr_index
            );
        }
    )
}


function limpaPrimeiroEUltimo(ds_valor)
{
    ds_valor = ds_valor.trim();

    nr_pos = ds_valor.indexOf('(');

    if (nr_pos >= 0) {
        ds_valor = ds_valor.substr(
            nr_pos + 1,
            ds_valor.length
        ).trim();
    }

    nr_pos = ds_valor.indexOf(')');

    if (nr_pos >= 0) {
        ds_valor = ds_valor.substr(0, nr_pos).trim();
    }

    return ds_valor;
}

function imprimir(arrValores, ds_valor, nr_index)
{
    console.log(
        ds_valor
        + ' = '
        + arrValores[nr_index]
        + "\n"
    );
}