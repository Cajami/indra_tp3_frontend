/*FUNCION PARA ABRIR DIALOG BOOSTRAP*/
function OpenDialogo(id, callBackOpen, callBackPorCerrar, callBackClose) {
    $('#' + id).off('shown.bs.modal hide.bs.modal hidden.bs.modal')
        .on('shown.bs.modal', function (e) {
            //CUANDO EL DIALOGO YA SE MOSTRÓ
            if (typeof callBackOpen != 'undefined')
                callBackOpen();
        }).on('hide.bs.modal', function (e) {
            //CUANDO EL DIALOGO SE ESTÁ CERRANDO
            if (typeof callBackPorCerrar != 'undefined')
                callBackPorCerrar(e);
        }).on('hidden.bs.modal', function (e) {
            //CUANDO EL DIALOGO YA SE OCULTÓ
            if (typeof callBackClose != 'undefined')
                callBackClose();
        }).modal({
            keyboard: false,
            backdrop: 'static'
        });
}

function nombreMes(mes) {
    switch (mes) {
        case 1:
            return 'ENERO';
            break;
        case 2:
            return 'FEBRERO';
            break;
        case 3:
            return 'MARZO';
            break;
        case 4:
            return 'ABRIL';
            break;
        case 5:
            return 'MAYO';
            break;
        case 6:
            return 'JUNIO';
            break;
        case 7:
            return 'JULIO';
            break;
        case 8:
            return 'AGOSTO';
            break;
        case 9:
            return 'SEPTIEMBRE';
            break;
        case 10:
            return 'OCTUBRE';
            break;
        case 11:
            return 'NOVIEMBRE';
            break;
        case 12:
            return 'DICIEMBRE';
            break;
        default:
            return '';

    }
}

/*FUNCTION PARA CERRAR DIALOGO BOOSTRAP*/
function CloseDialogo(id) {
    $('#' + id).modal('hide');
}

/*FUNCION QUE DEVUELVE UNA CADENA ALEATORIA DE N LOGITUD*/
function GenerarStringAleatorio(longitud) {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
    var cadena = "";
    for (var i = 0; i < longitud; i++)
        cadena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return cadena;
}


/*FUNCION AJAX GENERICA:*/
function QueryAJAX(url, parametros, callBackSucces, callBackError) {
    $.ajax({
        url: 'http://localhost:8080/' + url,
        type: "POST",
        data: parametros,
        success: function (data) {
            callBackSucces(data);
        },
        error: function (data) {
            callBackError(data);
        }
    });
    return;
    $.ajax({
        url: 'http://localhost:8081/indrap/service/' + url,
        type: "POST",
        data: parametros,
        success: function (data) {
            callBackSucces(data);
        },
        error: function (data) {
            callBackError(data);
        }
    });
    //$.ajax({
    //    type: "POST",
    //    //url: URL_BlazeWS + '/' + 'BlazeWS.asmx/' + url,
    //    url: 'http://localhost:8080/indrap/service/' + url,
    //    data: parametros,
    //    //cache: true,
    //    //datatype: "json",
    //    //async: true,
    //    //contentType: "application/json; charset-utf-8",
    //    success: function (data) {
    //        callBackSucces(data);
    //    },
    //    error: function (data) {
    //        callBackError(data);
    //    }
    //});
}

/*RECARGAR JQGRID*/
function ReloadJQGRID(id, data) {
    var $Grid = jQuery('#' + id);
    $Grid.jqGrid('clearGridData');
    $Grid.jqGrid('setGridParam', { data: data });
    $Grid.trigger('reloadGrid');
}

/*FUNCION PARA DEVOLVER LA DATA COMPLETA DE JQGRID*/
function GetDataJqGrid(id) {
    return jQuery('#' + id).jqGrid("getGridParam").data;
}

/*FUNCION PARA DEVOLVER UN REGISTRO DE JQGRID*/
function GetRowDataJqGrid(idGrid, idRow) {
    return jQuery('#' + idGrid).jqGrid('getRowData', idRow);
}

function GetRowSelectJqGrid(id) {
    var $Grid = jQuery('#' + id);
    var selRowId = $Grid.jqGrid("getGridParam", "selrow");
    if (selRowId == null)
        return selRowId;
    else
        return $Grid.jqGrid("getRowData", selRowId);
}

/*FUNCION PARA MOSTRAR UN GIT CARGANDO*/
function MostrarLoading(sw, texto) {
    if (sw) {
        $('body').waitMe({
            effect: 'ios',
            text: texto,
            color: '#0E073C'
        });
    } else {
        $('body').waitMe('hide');
    }
}

function MensajeError(message) {
    $.alert({
        title: 'Error!',
        content: message,
        type: 'red',
        typeAnimated: true,
        draggable: true,
        escapeKey: 'OK',
        icon: 'fas fa-exclamation-triangle',
        buttons: {
            OK: {
                btnClass: 'btn-warning',
            }
        }
    });
}

function MensajeOk(title, message, callBackOk) {
    $.alert({
        title: title,
        content: message,
        type: 'blue',
        typeAnimated: true,
        draggable: true,
        escapeKey: true,
        backgroundDismiss: false,
        icon: 'far fa-check-circle',
        escapeKey: 'OK',
        buttons: {
            OK: {
                btnClass: 'btn-primary',
                action: function () {
                    if (typeof callBackOk != 'undefined')
                        callBackOk();
                }
            }
        }
    });
}

function MensajeConfirmar(message, callBackOk, callBackCancel) {
    $.alert({
        title: 'Confirmar',
        content: message,
        type: 'dark',
        typeAnimated: true,
        draggable: true,
        escapeKey: true,
        backgroundDismiss: false,
        icon: 'far fa-question-circle',
        escapeKey: 'NO',
        buttons: {
            SI: {
                btnClass: 'btn-primary',
                action: function () {
                    callBackOk();
                }
            },
            NO: {
                btnClass: 'btn-danger',
                action: function () {
                    if (typeof callBackCancel != 'undefined')
                        callBackCancel();
                }
            }

        }
    });
}

function getEstiloEstado(estado) {
    switch (estado) {
        case 'INICIADO':
            return 'color:blue;';
        case 'APROBADO':
            return 'color:orange;';
        case 'RECHAZADO':
            return 'color:red;';
        case 'EN PROCESO':
            return 'color:green;font-weight: bold;';
        case 'OBSERVADO':
            return 'color:purple;';
        default:
            return '';
    }
}

var numeroALetras = (function () {

    // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
    function Unidades(num) {

        switch (num) {
            case 1: return 'UN';
            case 2: return 'DOS';
            case 3: return 'TRES';
            case 4: return 'CUATRO';
            case 5: return 'CINCO';
            case 6: return 'SEIS';
            case 7: return 'SIETE';
            case 8: return 'OCHO';
            case 9: return 'NUEVE';
        }

        return '';
    }//Unidades()

    function Decenas(num) {

        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0: return 'DIEZ';
                    case 1: return 'ONCE';
                    case 2: return 'DOCE';
                    case 3: return 'TRECE';
                    case 4: return 'CATORCE';
                    case 5: return 'QUINCE';
                    default: return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0: return 'VEINTE';
                    default: return 'VEINTI' + Unidades(unidad);
                }
            case 3: return DecenasY('TREINTA', unidad);
            case 4: return DecenasY('CUARENTA', unidad);
            case 5: return DecenasY('CINCUENTA', unidad);
            case 6: return DecenasY('SESENTA', unidad);
            case 7: return DecenasY('SETENTA', unidad);
            case 8: return DecenasY('OCHENTA', unidad);
            case 9: return DecenasY('NOVENTA', unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5: return 'QUINIENTOS ' + Decenas(decenas);
            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
            case 7: return 'SETECIENTOS ' + Decenas(decenas);
            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural || 'PESOS CHILENOS',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
            letrasMonedaSingular: currency.singular || 'PESO CHILENO', //'PESO', 'Dólar', 'Bolivar', 'etc'
            letrasMonedaCentavoPlural: currency.centPlural || 'CHIQUI PESOS CHILENOS',
            letrasMonedaCentavoSingular: currency.centSingular || 'CHIQUI PESO CHILENO'
        };

        if (data.centavos > 0) {
            data.letrasCentavos = 'CON ' + (function () {
                if (data.centavos == 1)
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                else
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            })();
        };

        if (data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };

})();