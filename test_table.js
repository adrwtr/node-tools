var objMysql = require('mysql');
var _ = require('underscore');

const objConnectionBaseA = objMysql.createConnection({
    host     : "localhost",
    user     : "backup",
    password : "..",
    database : "adriano"
});

const objConnectionBaseB = objMysql.createConnection({
    host     : "localhost",
    user     : "backup",
    password : "...",
    database : "adriano"
});

var ds_tabela_comparar = 'htry_log';


/**
 * responsavel por retornar um array
 * com os dados de uma tabela do mysql
 * baseado na conexao/base
 *
 * @param  conexao mysql
 * @param  nome da tabela
 * @return promessa
 */
function getColunas(
    objConexao,
    ds_table_name
) {
    return new Promise(
        function (resolve, reject) {
            var ds_query = 'show columns from ' + ds_table_name;

            objConexao.connect();

            objConexao.query(
                ds_query,
                function (error, arrColunas) {

                    objConexao.end();

                    if (error){
                        reject(error);
                        return;
                    }

                    var arrCampos  = arrColunas.map(
                        function(objColuna) {
                            return {
                                ds_nome : objColuna.Field,
                                ds_tipo : objColuna.Type,
                                is_null : objColuna.Null,
                                ds_key : objColuna.Key,
                                ds_default : objColuna.Default,
                                ds_extra : objColuna.Extra
                            };
                        }
                    );

                    resolve(arrCampos);
                }
            );
        }
    );
}


/**
 * executa a comparação
 */
getColunas(
    objConnectionBaseA,
    ds_tabela_comparar
).then(
    function (arrResultadoA) {
        getColunas(
            objConnectionBaseB,
            ds_tabela_comparar
        ).then(
            function (arrResultadoB) {
                isEqualTables(
                    ds_tabela_comparar,
                    arrResultadoA,
                    arrResultadoB
                );
            }
        ).catch(
            function (objError) {
                console.log(objError);
            }
        );

    }
).catch(
    function (objError) {
        console.log(objError);
    }
);


/**
 * Verifica se as duas tabelas sao iguais
 *
 * @param  str nome tabela
 * @param  arrResultadoA
 * @param  arrResultadoB
 * @return bool
 */
function isEqualTables(ds_tabela_comparar, arrResultadoA, arrResultadoB)
{
    var sn_igual = true;
    var objErroA = null;
    var objErroB = null;

    _.each(
        arrResultadoA,
        function(objValor, nr_key) {
            var arrTesteA = _.toArray(objValor);
            var arrTesteB = _.toArray(arrResultadoB[nr_key]);
            var arrTest = _.difference(arrTesteA, arrTesteB);

            if (arrTest.length > 0) {
                sn_igual = false;

                // mostra qual
                if (objErroA == null) {
                    objErroA = objValor;
                    objErroB = arrResultadoB[nr_key]
                }
            }
        }
    );

    if (sn_igual == false) {
        console.log(objErroA);
        console.log("nao eh igual a:")
        console.log(objErroB);
        return false;
    }

    console.log('Nenhum problema encontrado em: ' + ds_tabela_comparar);
    return true;

}