function PageInitAdendas() {
    GenerarGrillaClientesAdendas();
    $('.tabsholder4').cardTabs({ theme: 'wiki' });

    $('div[data-tab]').css('height', $(document).height() - 255);

    $('#txtFechaInicioModuloPrincipal').off().on('keydown', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
    });

    MostrarLoading(true, 'Recuperando Información, un momento por favor...');

    QueryAJAX('indraupc/buscarGerentesFirmantes',
        '',
        function (result) {
            MostrarLoading(false);
            //

            if (result == null) {
                MensajeError('Servidor devolvió Error de Datos');
                return;
            }

            var html = '';

            if (result.length > 0) {
                //html += '<option value="">(Seleccione)</option>';

                for (var i = 0; i < result.length; i++) {
                    html += '<option value="' + result[i].dni + '">' + result[i].nombreApellidos + '</option>';
                }
            }

            $('#cboNombresGerentesNuevoContrato').html(html);

            if (result.length == 0) {
                MensajeError('Búsqueda SIN REGISTRO');
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Error al recuperar los Gerentes');
            $('#btnNuevoAdenda,#btnConsultarAdenda,#btnModificarAdenda,#btnEliminarAdenda,#btnListoImprimirAdenda').off().prop('disabled', true);
        });

}

$('#btnNuevoAdenda').off().on('click', function () {
    $('#btnGuardarModificacionAdenda,#btnGuardarEliminarAdenda').hide();

    $('#CarruselModuloAdenda').carousel(1);
    $('div.card-tabs-bar a:not(:first)').hide();
});


function ConsultarAdenda(iCodAdenda, callBack, evento) {
    MostrarLoading(true, 'Recuperando Datos de Adenda...');
    QueryAJAX('indraupc/ad_ConsultarAdenda',
       {
           codigoAdenda: iCodAdenda
       },
        function (resultado) {

            console.log(resultado);

            if (resultado == null  || !resultado) {
                MostrarLoading(false);
                MensajeError('Problemas con el servidor, devolvió NULL');
                return;
            }

            if (resultado.contrato.nombreAdenda == null) {
                MostrarLoading(false);
                MensajeError('No se encontró el detalle de la adenda buscada');
                return;
            }

            try {

                callBack();

                //TAB-PRINCIPAL:
                if (typeof evento == 'undefined') {
                    $('#txtNroContratoAdenda').val(resultado.contrato.numeroContrato).attr({
                        'iCodContrato': resultado.contrato.codigoContrato,
                        'nombreContrato': resultado.contrato.nombreContrato
                    });

                    $('#txtNroAdendaAdenda').val(resultado.contrato.numeroAdenda).attr('iCodAdenda', resultado.contrato.codigoAdenda);
                }

                $('#txtPaisAdenda').val(resultado.contrato.nombrePais);
                $('#txtDepartamentoAdenda').val(resultado.contrato.nombreDepartamento);
                $('#txtProvinciaAdenda').val(resultado.contrato.nombreProvincia);
                $('#txtDistritoAdenda').val(resultado.contrato.nombreDistrito);
                $('#txtTipoContratoAdenda').val(resultado.contrato.tipoContrato == 1 ? 'GENERAL' : 'SERVICIOS').attr('cTipocontrato', resultado.contrato.tipoContrato);

                $('#txtTipoServicioAdenda').val(resultado.contrato.nombreTipoServicio);

                $('#txtNombreAdendaAdenda').val(resultado.contrato.nombreAdenda);
                $('#txtNumeroAdendaAdenda').val(resultado.contrato.numeroAdenda);

                $('#txtNombreProyectoAdenda').val(resultado.contrato.nombreProyecto);

                $('#txtRazonSocialClienteAdenda').val(resultado.contrato.cliente);
                $('#txtRucDniAdenda').val(resultado.contrato.rucDni);
                $('#txtDomicilioAdenda').val(resultado.contrato.direccion);
                $('#txtActividadAdenda').val(resultado.contrato.actividad);

                /*TAB-ANTECEDENTES*/
                var html = '';
                for (var i = 0; i < resultado.antecedentes.length; i++) {
                    html += '<tr>' +
                                '<td class="cursor deleteAntecedentes"><i class="far fa-trash-alt text-danger"></i></td>' +
                                '<td contenteditable="true">' + resultado.antecedentes[i].descripcion + '</td>' +
                            '</tr>';
                }
                $('#tableAntecedentesNuevoContrato tbody').html(html);

                /*TAB-MONTO CONTRATADO*/
                $('#cboTipoMonedaNuevoContrato option[value=' + resultado.contrato.tipoMoneda + ']').attr('selected', 'selected');
                $('#txtPrecioContractualNuevoContato').val(parseFloat(resultado.contrato.montoContractual).toFixed(2));

                /*TAB-CRONOGRAMA DE ENTREGA*/
                html = '';
                for (var i = 0; i < resultado.cronograma.length; i++) {
                    html += '<tr class="text-center">' +
                                '<td class="cursor deleteCronograma"><i class="far fa-trash-alt text-danger"></i></td>' +
                                '<td contenteditable="true" columna="numeroentrega">' + resultado.cronograma[i].numeroEntrega + '</td>' +
                                '<td contenteditable="true" columna="numerodias">' + resultado.cronograma[i].cantidadDias + '</td>' +
                                '<td contenteditable="true" columna="fechaentrega">' + resultado.cronograma[i].fechaEntrega + '</td>' +
                                '<td contenteditable="true" class="text-left">' + resultado.cronograma[i].descripcionEntrega + '</td>' +
                            '</tr>';
                }
                $('#tablaCronogramaEntregaNuevoContrato tbody').html(html);

                /*TAB-VIGENCIA*/
                $('#txtFechaInicioNuevoContato').val(resultado.contrato.fechaInicio);
                $('#txtFechaFinalNuevoContato').val(resultado.contrato.fechaFin);

                /*TAB-FORMAS DE PAGO*/

                if (resultado.pago[0].tipoPago == 1) {//CONTADO
                    $('#chkPagoContadoNuevoContrato').prop('checked', true);
                } else {//EN CUOTAS
                    $('#chkPagoCuotasNuevoContrato').prop('checked', true);
                }

                html = '';

                for (var i = 0; i < resultado.pago.length; i++) {

                    html += '<tr class="text-center">' +
                                '<td class="cursor deletePagos"><i class="far fa-trash-alt text-danger"></i></td>' +
                                '<td contenteditable="true" columna="numerocuota">' + resultado.pago[i].numeroCuota + '</td>' +
                                '<td contenteditable="true" columna="aniocuota">' + resultado.pago[i].anio + '</td>' +
                                '<td contenteditable="true" columna="mescuota" mes="' + resultado.pago[i].mes + '">' + nombreMes(resultado.pago[i].mes) + '</td>' +
                                '<td contenteditable="true" columna="ultimodiapagocuota">' + resultado.pago[i].ultimoDiaPago + '</td>' +
                            '</tr>';
                }

                $('#tablaCuotasNuevoContrato tbody').html(html);
                $('#txtCuotasNuevoContrato').val(resultado.pago.length);

                /*TAB-CLAUSULAS*/
                $('#tablaClausulasAImprimirAdenda tbody input[type=checkbox]').prop('checked', false);
                for (var i = 0; i < resultado.clausula.length; i++) {
                    $('input[type=checkbox][numeroClausula=' + resultado.clausula[i].numeroClausula + ']').prop('checked', true);
                }


                /*TAB-FIRMAS*/
                for (var i = 0; i < resultado.firmante.length; i++) {
                    if (resultado.firmante[i].perfil == 'CLIENTE') {
                        $('#txtDniClienteFirmanteNuevoContrato').val(resultado.firmante[i].dni);
                        $('#txtNombreClienteFirmanteNuevoContrato').val(resultado.firmante[i].cliente);
                    } else if (resultado.firmante[i].perfil == 'APODERADO') {
                        $('#txtDniApoderadoNuevoContrato').val(resultado.firmante[i].dni);
                        $('#txtNombreApoderadoNuevoContrato').val(resultado.firmante[i].cliente);
                    } else {
                        $('#txtDniGerenteNuevoContrato').val(resultado.firmante[i].dni);
                        $('#cboNombresGerentesNuevoContrato').val(resultado.firmante[i].dni);
                    }
                }

                if (evento) {
                    var iCodContrato = $('#txtNroContratoAdenda').attr('icodcontrato');
                    QueryAJAX('indraupc/informacionAdenda',
                       {
                           codigoContrato: iCodContrato
                       },
                       function (resultado) {
                           MostrarLoading(false);

                           if (resultado == null) {
                               MostrarLoading(false);
                               MensajeError('Problemas con el servidor, devolvió NULL');
                               return;
                           }

                           $('#txtNombreAdendaAdenda').val(resultado.nombreAdenda);
                           $('#txtNumeroAdendaAdenda').val(resultado.numeroAdenda);

                       },
                       function (error) {
                           MostrarLoading(false);
                           MensajeError('Problemas para conectarnos con el servicio web');
                       });
                } else
                    MostrarLoading(false);
            } catch (e) {
                MostrarLoading(false);
                MensajeError('Se produjo un error con la data recibida del servidor');
                $('#btnVistaPreviaAdenda').parent().find('button').prop('disabled', true);
                $('#btnCancelarAdenda').prop('disabled', false);
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos con el servicio web');
        });
}

function GenerarGrillaClientesAdendas() {
    var alto = $(document).height() - 340;
    jQuery('#tablaClientesAdendas').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'id', name: 'IdRegistro', index: 'IdRegistro', align: 'center', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'Codigo Contrato', name: 'codigoContrato', index: 'codigoContrato', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Adenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Nro. Contrato', name: 'numeroContrato', index: 'numeroContrato', align: 'center', width: 100, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre de Contrato', name: 'nombreContrato', index: 'nombreContrato', align: 'left', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Nro. Adenda', name: 'numeroAdenda', index: 'numeroAdenda', align: 'center', width: 100, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre de Adenda', name: 'nombreAdenda', index: 'nombreAdenda', align: 'left', width: 300, hidden: false, sortable: false, resizable: false },
            { label: 'Fecha Registro', name: 'fechaRegistro', index: 'fechaRegistro', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            {
                label: 'Estado', name: 'estadoAdenda', index: 'estadoAdenda', align: 'center', width: 150, hidden: false, sortable: false, resizable: false,
                cellattr: function (rowId, val, rawObject, cm, rdata) {
                    //var stylo = '';
                    //switch (val) {
                    //    case 'INICIADO':
                    //        stylo = 'color:blue;';
                    //        break;
                    //    case 'RECHAZADO':
                    //        stylo = 'color:red;';
                    //        break;
                    //    case 'EN PROCESO':
                    //        stylo = 'color:green;font-weight: bold;';
                    //    default:

                    //}
                    return ' style="' + getEstiloEstado(val) + '"';
                },
            }
        ],
        rowNum: 10000,
        shrinkToFit: false,
        width: null,
        height: alto,
        rownumbers: true,
        rownumWidth: 30,
        rowList: [15, 50, 100, 200, 300, 500],
        scroll: true,
        pager: '#pagertablaClientesAdendas',
        gridview: true,
        ignoreCase: true,
        viewrecords: true,
        sortable: true,

        onSelectRow: function (rowid, iRow, iCol, e) {
            var registro = jQuery(this).jqGrid('getRowData', rowid);
            switch (registro.estadoAdenda) {
                case 'INICIADO':
                    $('#btnListoImprimirAdenda,#btnEliminarAdenda,#btnModificarAdenda').prop('disabled', false);
                    break;
                case 'EN PROCESO':
                case 'RECHAZADO':
                    $('#btnListoImprimirAdenda,#btnEliminarAdenda,#btnModificarAdenda').prop('disabled', true);
                    break;
                case 'OBSERVADO':
                    $('#btnEliminarAdenda,#btnModificarAdenda').prop('disabled', false);
                    break;
                    case 'APROBADO':
                    $('#btnEliminarAdenda,#btnModificarAdenda').prop('disabled', true);
                    break;
            }
        },
        onCellSelect: function (rowid, icol, cellcontent, e) {
        },
        onRightClickRow: function (rowid, iRow, iCol, e) {
        },
        ondblClickRow: function (rowid, iRow, iCol, e) {
        },
        gridComplete: function (data) {
        },
        loadComplete: function (data) {
        }
    });
}

PageInitAdendas();


$('#btnBuscarDialogoContratoAdenda').off().on('click', function () {
    OpenDialogo('dialogoBuscarContrato', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {
        $('#txtBuscarRucClienteDialogo,#hCodigoClienteDialogoContrato').val('');
        ReloadJQGRID('tablaBusquedaContratosDialogo', []);
    });
});

$('#btnAbrirDialogoClienteBuscarAdenda').off().on('click', function () {
    $('#dialogoBuscarContrato').modal('hide');

    $('#btnSeleccionarClienteDialogo').attr('accion', 'dialogo');
    OpenDialogo('dialogoBuscarCliente', function () {
        $('#txtBuscarRucCliente').focus();
    }, function () {
        $('#dialogoBuscarContrato').modal('show');
    }, function () {
        $('#txtBuscarRucCliente,#txtBuscarDniCliente,#txtBuscarClienteRazonSocialCliente').val('');
        ReloadJQGRID('tablaClientesDialogo', []);
    });
});

$('#btnAbrirDialogoClienteBuscar').off().on('click', function () {
    $('#btnSeleccionarClienteDialogo').attr('accion', 'principal');
    OpenDialogo('dialogoBuscarCliente', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {
        $('#txtBuscarRucCliente,#txtBuscarDniCliente,#txtBuscarClienteRazonSocialCliente').val('');
        ReloadJQGRID('tablaClientesDialogo', []);
    });
});

$('#btnSeleccionarClienteDialogo').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesDialogo');
    if (registro == null) {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }
    CloseDialogo('dialogoBuscarCliente');

    if ($('#btnSeleccionarClienteDialogo').attr('accion') == 'principal') {
        $('#txtClienteModuloPrincipalAdendas').val(registro.cliente).attr('iCodCliente', registro.codigoFirmante);
    } else {
        $('#txtBuscarRucClienteDialogo').val(registro.cliente);
        $('#hCodigoClienteDialogoContrato').val(registro.codigoFirmante);
    }

});

$('#btnSeleccionarContratoDialogo').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaBusquedaContratosDialogo');
debugger;
    if (registro == null ) {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }
    /*LA ADENDA DEBE ESTAR APROBADA*/
    if (registro.estadoAdenda != 'APROBADO') {
        MensajeError('La última adenda aún no ha finalizado el proceso, no puede generar más adendas');
        return;
    }

    if (registro.numeroSolicitud.trim().length == 0) {
        MensajeError('No se cuenta con una Solicitud de Cambio, no puede generar adendas');
        return;
    }

    if (registro.estadoSolicitud != 'APROBADO') {
        MensajeError('La solicitud  de Cambios aún no ha sido aprobada, no puede generar adendas');
        return;
    }

    $('#txtNroContratoAdenda').val(registro.numeroContrato).attr({
        'iCodContrato': registro.codigoContrato,
        'nombreContrato': registro.nombreContrato
    });
    $('#txtNroAdendaAdenda').val(registro.numeroAdenda).attr('iCodAdenda', registro.codigoAdenda);
    //$('#txtNroAdendaAdenda').val(registro.numeroAdenda.length == 0 ? 0 : registro.numeroAdenda).attr('iCodAdenda', registro.codigoAdenda);
    CloseDialogo('dialogoBuscarContrato');
});

$('#btnBuscarContratoDialogo').off().on('click', function () {
    var iCodcliente = $('#hCodigoClienteDialogoContrato').val();
    if (iCodcliente.length == 0) {
        MensajeError('Debe seleccionar un cliente a buscar');
        return;
    }


    MostrarLoading(true, 'Buscando contratos, un momento por favor...');

    QueryAJAX('indraupc/ad_BuscarContrato',
        {
            codigoCliente: iCodcliente
        },
         function (resultado) {
             MostrarLoading(false);

             if (resultado == null ) {
                 MensajeError('Problemas con el servidor, devolvió NULL');
                 return;
             }

             for (var i = 0; i < resultado.length; i++)
                 resultado[i].idRegistro = i + 1;

             ReloadJQGRID('tablaBusquedaContratosDialogo', resultado);
         },
         function (error) {
             MostrarLoading(false);
             MensajeError('Problemas para conectarnos con el servicio');
         });
});

$('#btnCancelarAdenda').off().on('click', function () {
    $('#divContenerInputsAdenda input').val('');
    $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').show();

    $('#CarruselModuloAdenda').carousel(0);
    $('div.card-tabs-bar a:not(:first)').show();
    $('div.card-tabs-bar a:first').click();
});

$('#btnBuscarContratoAdenda').off().on('click', function () {
    var iCodAdenda = $('#txtNroAdendaAdenda').attr('iCodAdenda');

    //---------------------------------------------------------
    //$('#txtNroContratoAdenda').attr('icodcontrato', 21);
    //iCodAdenda = 20;
    //---------------------------------------------------------

    if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0) {
        MensajeError('Sin Contrato & Adenda a buscar');
        return;
    }
    ConsultarAdenda(iCodAdenda, function () {
        $('div.card-tabs-bar a:not(:first)').show();
    }, true);
});

$('#tableAntecedentesNuevoContrato tbody').off().on('click', 'td.deleteAntecedentes', function () {
    var $tr = $(this).parent();
    MensajeConfirmar(
        '¿Está seguro que desea eliminar el antecedente?',
        function () {
            $tr.remove();
        });
});

$('#tablaCronogramaEntregaNuevoContrato tbody').off().on('click', 'td.deleteCronograma', function () {
    var $tr = $(this).parent();
    MensajeConfirmar(
        '¿Está seguro que desea eliminar el cronograma?',
        function () {
            $tr.remove();
        });
}).on('focusout', '[contenteditable]', function () {
    var valor = $(this).text().trim();

    if (valor.length == 0) {
        $(this).html(valor);
        return;
    }

    switch ($(this).attr('columna')) {
        case 'numeroentrega':
        case 'numerodias':
            if (!$.isNumeric(valor)) {
                valor = '';
                MensajeError('Solo puede ingresar números');
            }
            $(this).html(valor);
            break;
        case 'fechaentrega':
            var tempo = valor.split('-');
            if (tempo.length != 3) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (tempo[0].length != 4 || tempo[1].length != 2 || tempo[2].length != 2) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (!$.isNumeric(tempo[0]) || !$.isNumeric(tempo[1]) || !$.isNumeric(tempo[2])) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (parseInt(tempo[1]) <= 0 || parseInt(tempo[1]) >= 13) {//MES
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (parseInt(tempo[2]) <= 0 || parseInt(tempo[1]) >= 31) {//DIA
                valor = '';
                MensajeError('Fecha Incorrecta');
            }
            $(this).html(valor);
            break;
    }
});

$('#tablaCuotasNuevoContrato tbody').off().on('click', 'td.deletePagos', function () {
    var $tr = $(this).parent();
    MensajeConfirmar(
        '¿Está seguro que desea eliminar número de cuota?',
        function () {
            $tr.remove();
            $('#txtCuotasNuevoContrato').val($('#tablaCuotasNuevoContrato tbody tr').length);
        });
}).on('focusout', '[contenteditable]', function () {
    var valor = $(this).text().trim();

    if (valor.length == 0) {
        $(this).html(valor);
        return;
    }

    switch ($(this).attr('columna')) {
        case 'numerocuota':
            if (!$.isNumeric(valor)) {
                valor = '';
                MensajeError('Solo puede ingresar números');
            }
            $(this).html(valor);
            break;
        case 'aniocuota':
            if (!$.isNumeric(valor)) {
                valor = '';
                MensajeError('Solo puede ingresar números');
            }
            if (valor.length != 4) {
                valor = '';
                MensajeError('Año incorrecto');
            }
            $(this).html(valor);
            break;
        case 'mescuota':
            if (!$.isNumeric(valor)) {
                valor = '';
                MensajeError('Solo puede ingresar números');
            } else {
                valor = parseInt(valor);

                if (valor <= 0 || valor >= 13) {
                    valor = '';
                    MensajeError('Mes incorrecto');
                }
            }

            $(this).html(nombreMes(valor)).attr('mes', valor);
            break;
        case 'ultimodiapagocuota':
            var tempo = valor.split('-');
            if (tempo.length != 3) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (tempo[0].length != 4 || tempo[1].length != 2 || tempo[2].length != 2) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (!$.isNumeric(tempo[0]) || !$.isNumeric(tempo[1]) || !$.isNumeric(tempo[2])) {
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (parseInt(tempo[1]) <= 0 || parseInt(tempo[1]) >= 13) {//MES
                valor = '';
                MensajeError('Fecha Incorrecta');
            } else if (parseInt(tempo[2]) <= 0 || parseInt(tempo[1]) >= 31) {//DIA
                valor = '';
                MensajeError('Fecha Incorrecta');
            }
            $(this).html(valor);
            break;
    }
});

$('#btnAgregarNuevoAntecedenteAdenda').off().on('click', function () {
    var html = '<tr>' +
                    '<td class="cursor deleteAntecedentes"><i class="far fa-trash-alt text-danger"></i></td>' +
                    '<td contenteditable="true"></td>' +
                '</tr>';
    $('#tableAntecedentesNuevoContrato tbody').append(html);
});

$('#btnAgregarNuevoCronogramaAdenda').off().on('click', function () {
    var html = '<tr class="text-center">' +
                     '<td class="cursor deleteCronograma"><i class="far fa-trash-alt text-danger"></i></td>' +
                     '<td contenteditable="true" columna="numeroentrega"></td>' +
                     '<td contenteditable="true" columna="numerodias" ></td>' +
                     '<td contenteditable="true" columna="fechaentrega" ></td>' +
                     '<td contenteditable="true" class="text-left"></td>' +
                 '</tr>';
    $('#tablaCronogramaEntregaNuevoContrato tbody').append(html);
});

$('#btnAgregarCuotaPagoAdenda').off().on('click', function () {
    var html = '<tr class="text-center">' +
            '<td class="cursor deletePagos"><i class="far fa-trash-alt text-danger"></i></td>' +
            '<td contenteditable="true" columna="numerocuota"></td>' +
            '<td contenteditable="true" columna="aniocuota"></td>' +
            '<td contenteditable="true" columna="mescuota" mes=""></td>' +
            '<td contenteditable="true" columna="ultimodiapagocuota"></td>' +
        '</tr>';

    $('#tablaCuotasNuevoContrato tbody').append(html);
    $('#txtCuotasNuevoContrato').val($('#tablaCuotasNuevoContrato tbody tr').length);
});


$('#chkPagoContadoNuevoContrato').off().on('change', function () {
    if ($(this).is(':checked'))
        $('#chkPagoCuotasNuevoContrato').prop('checked', false);

});

$('#chkPagoCuotasNuevoContrato').off().on('change', function () {
    if ($(this).is(':checked'))
        $('#chkPagoContadoNuevoContrato').prop('checked', false);
});


$('#txtDniClienteFirmanteNuevoContrato').off().on('keydown', function (e) {
    if (e.which == 9)//TAB
        return;

    if (e.which == 13) {
        var dniBuscar = this.value.trim();
        if (dniBuscar.length == 0) {
            MensajeError('Debe ingresar un Dni a buscar');
            return;
        }

        MostrarLoading(true, 'recuperando información...');

        QueryAJAX('indraupc/buscarClienteFirmar',
            {
                dni: dniBuscar,
            },
            function (result) {
                MostrarLoading(false);

                if (result == null) {
                    MensajeError('Servidor devolvió SIN DATOS');
                    return;
                }

                $('#txtNombreClienteFirmanteNuevoContrato').val(result.cliente);
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para conectarnos con el servicio');
            });
    } else {
        $('#txtNombreClienteFirmanteNuevoContrato').val('');
    }
});
$('#txtDniApoderadoNuevoContrato').off().on('keydown', function (e) {
    if (e.which == 9)//TAB
        return;

    if (e.which == 13) {
        var dniBuscar = this.value.trim();
        if (dniBuscar.length == 0) {
            MensajeError('Debe ingresar un Dni a buscar');
            return;
        }

        MostrarLoading(true, 'recuperando información...');

        QueryAJAX('indraupc/buscarApoderado',
            {
                dni: dniBuscar,
            },
            function (result) {
                MostrarLoading(false);

                if (result == null) {
                    MensajeError('Servidor devolvió SIN DATOS');
                    return;
                }

                $('#txtNombreApoderadoNuevoContrato').val(result.nombreApellidos);
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para conectarnos con el servicio');
            });
    } else {
        $('#txtNombreApoderadoNuevoContrato').val('');
    }
});

$('#cboNombresGerentesNuevoContrato').off().on('change', function () {
    $('#txtDniGerenteNuevoContrato').val(this.value);
});

$('#btnGuardarAdenda').off().on('click', function () {
    var iCodContrato = $('#txtNroContratoAdenda').attr('icodcontrato'),
        tipoMoneda = $('#cboTipoMonedaNuevoContrato').val(),
        monto = $('#txtPrecioContractualNuevoContato').val().trim(),
        fechaInicio = $('#txtFechaInicioNuevoContato').val().trim(),
        fechaFin = $('#txtFechaFinalNuevoContato').val().trim(),
        dniCliente = $('#txtDniClienteFirmanteNuevoContrato').val().trim(),
        dniApoderado = $('#txtDniApoderadoNuevoContrato').val().trim(),
        dniGerente = $('#txtDniGerenteNuevoContrato').val().trim(),
        numeroPaginas = 10,
        numeroClausulas = 15;

    if (typeof iCodContrato == 'undefined' || iCodContrato.length == 0 || iCodContrato == 0) {
        MensajeError('No ha seleccionando ningún contrato');
        return;
    }

    if (!$.isNumeric(monto)) {
        MensajeError('Precio Contractual debe ser solo números');
        return;
    }
    monto = parseFloat(monto)
    if (monto <= 0) {
        MensajeError('Precio Contractual no puede ser menor o igual a cero (0)');
        return;
    }

    if (fechaInicio.length == 0) {
        MensajeError('Fecha Inicio no puede estar vacío');
        return;
    }

    if (fechaFin.length == 0) {
        MensajeError('Fecha Fin no puede estar vacío');
        return;
    }

    if ($('#txtNombreClienteFirmanteNuevoContrato').val().trim().length == 0) {
        MensajeError('Dni cliente firmante no puede estar vacío');
        return;
    }
    if ($('#txtNombreApoderadoNuevoContrato').val().trim().length == 0) {
        MensajeError('Dni apoderado no puede estar vacío');
        return;
    }

    if (dniGerente.length == 0) {
        MensajeError('Dni de gerente no puede estar vacío');
        return;
    }

    /*VALIDANDO CAMPOS VACIOS*/
    var sw = false;
    //ANTECEDENTES
    $('#tableAntecedentesNuevoContrato tbody tr').each(function () {
        if ($(this).find('td:eq(1)').text().trim().length == 0)
            sw = true;
    });

    if (sw) {
        MensajeError('Antecedentes sin concluir');
        $('div.card-tabs-bar a:eq(1)').click();
        return;
    }

    //CRONOGRAMA
    $('#tablaCronogramaEntregaNuevoContrato tbody tr').each(function () {
        if ($(this).find('td:eq(1)').text().trim().length == 0 ||
                $(this).find('td:eq(2)').text().trim().length == 0 ||
                $(this).find('td:eq(3)').text().trim().length == 0 ||
                $(this).find('td:eq(4)').text().trim().length == 0)
            sw = true;
    });

    if (sw) {
        MensajeError('Cronograma sin concluir');
        $('div.card-tabs-bar a:eq(3)').click();
        return;
    }

    //PAGO CUOTAS
    $('#tablaCuotasNuevoContrato tbody tr').each(function () {
        if ($(this).find('td:eq(2)').text().trim().length == 0 ||
                $(this).find('td:eq(3)').text().trim().length == 0 ||
                $(this).find('td:eq(1)').text().trim().length == 0 ||
                $(this).find('td:eq(4)').text().trim().length == 0)
            sw = true;
    });

    if (sw) {
        MensajeError('Forma de Pago sin concluir');
        $('div.card-tabs-bar a:eq(5)').click();
        return;
    }

    //CLAUSULAS A IMPRIMIR
    $('#tablaClausulasAImprimirAdenda tbody tr').each(function () {
        if ($(this).find('td:eq(0) input').is(':checked'))
            sw = true;
    });

    if (sw == false) {
        MensajeError('No ha seleccionado ninguna clausula a imprimir');
        $('div.card-tabs-bar a:eq(7)').click();
        return;
    }

    MensajeConfirmar('¿Desea guardar la nueva adenda?',
        function () {
            MostrarLoading(true, 'Regitrando Adenda...');

            QueryAJAX('indraupc/registrarAdenda',
                   {
                       codigoContrato: iCodContrato,
                       tipoMoneda: tipoMoneda,
                       monto: monto,
                       fechaInicio: fechaInicio,
                       fechaFin: fechaFin,
                       dniCliente: dniCliente,
                       dniApoderado: dniApoderado,
                       dniGerente: dniGerente,
                       numeroPaginas: numeroPaginas,
                       numeroClausulas: numeroClausulas
                   },
                   function (resultado) {

                       if (resultado <= 0) {
                           MostrarLoading(false);
                           MensajeError('No se pudo registrar adenda en el servidor');
                           return;
                       }

                       console.log('Codigo de Adenda: ', resultado);

                       var idAdenda = resultado;

                       MostrarLoading(true, 'Registrando Antecedentes...');

                       var array = [];
                       $('#tableAntecedentesNuevoContrato tbody tr').each(function () {
                           array.push($(this).find('td:eq(1)').text());
                       });

                       RegistrarAntecedentes(array, idAdenda, 0);

                   },
                   function (error) {
                       MostrarLoading(false);
                       MensajeError('Problemas para conectarnos con el servicio');
                   });
        });
});

function RegistrarAntecedentes(array, idAdenda, index) {
    if (index < array.length) {
        QueryAJAX('indraupc/registrarAncedente',
                   {
                       codigoAdenda: idAdenda,
                       descripcion: array[index]
                   },
                   function (resultado) {
                       console.log('Registro Antecedente: ', resultado);

                       index++;
                       RegistrarAntecedentes(array, idAdenda, index);
                   },
                   function (error) {
                       index++;
                       RegistrarAntecedentes(array, idAdenda, index);
                   });
    } else {
        array.length = 0;

        $('#tablaCronogramaEntregaNuevoContrato tbody tr').each(function () {
            array.push({
                nroEntrega: $(this).find('td:eq(1)').text(),
                dias: $(this).find('td:eq(2)').text(),
                fechaEntrega: $(this).find('td:eq(3)').text(),
                descripcion: $(this).find('td:eq(4)').text(),
            });
        });

        RegistrarCronograma(array, idAdenda, 0);
    }

}

function RegistrarCronograma(array, idAdenda, index) {
    if (index < array.length) {
        QueryAJAX('indraupc/registrarCronograma',
                   {
                       codigoAdenda: idAdenda,
                       numeroEntrega: array[index].nroEntrega,
                       descripcionEntrega: array[index].descripcion,
                       cantidadDias: array[index].dias,
                       fechaEntrega: array[index].fechaEntrega
                   },
                   function (resultado) {
                       index++;
                       RegistrarCronograma(array, idAdenda, index);
                   },
                   function (error) {
                       index++;
                       RegistrarCronograma(array, idAdenda, index);
                   });
    } else {
        /*REGISTRAMOS EL PAGO*/
        var tipoPago = 0;
        if ($('#chkPagoContadoNuevoContrato').prop('checked')) {
            tipoPago = 1;
        } else {
            tipoPago = 2;
        }

        QueryAJAX('indraupc/registrarPago',
            {
                codigoAdenda: idAdenda,
                tipoPago: tipoPago,
                descripcion: 'PAGO DE PROYECTO',
            },
            function (resultado) {
                if (resultado <= 0) {
                    MostrarLoading(false);
                    MensajeError('No se registró el pago');
                    return;
                }
                /*REGISTRAMOS LOS PAGOS DETALLES*/
                var array = [];

                $('#tablaCuotasNuevoContrato tbody tr').each(function () {
                    array.push({
                        anio: $(this).find('td:eq(2)').text(),
                        mes: $(this).find('td:eq(3)').attr('mes'),
                        numeroCuota: $(this).find('td:eq(1)').text(),
                        ultimoDiaPago: $(this).find('td:eq(4)').text()
                    });
                });

                RegistrarPagosDetalles(array, idAdenda, 0);
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para comunicarnos con el servicio para registrar el pago');
            });
    }
}

function RegistrarPagosDetalles(array, idAdenda, index) {
    if (index < array.length) {
        QueryAJAX('indraupc/registrarPagoDetalle',
            {
                codigoAdenda: idAdenda,
                anio: array[index].anio,
                mes: array[index].mes,
                numeroCuota: array[index].numeroCuota,
                ultimoDiaPago: array[index].ultimoDiaPago,
            },
            function (resultado) {
                index++;
                RegistrarPagosDetalles(array, idAdenda, index);
            },
            function (error) {
                index++;
                RegistrarPagosDetalles(array, idAdenda, index);
            });
    } else {

        /*GUARDAMOS LAS CLAUSULAS A IMPRIMIR*/

        var array = [];

        $('#tablaClausulasAImprimirAdenda tbody tr').each(function () {
            if ($(this).find('td:eq(0) input').is(':checked')) {
                array.push({
                    codigoAdenda: idAdenda,
                    numeroClausula: $(this).find('td:eq(0) input').attr('numeroClausula')
                });
            }
        });

        RegistrarClausulasImprimir(array, idAdenda, 0);
    }
}

function RegistrarClausulasImprimir(array, idAdenda, index) {
    if (index < array.length) {
        QueryAJAX('indraupc/registrarClausulaImprimirAdenda',
            {
                codigoAdenda: idAdenda,
                numeroClausula: array[index].numeroClausula
            },
            function (resultado) {
                index++;
                RegistrarClausulasImprimir(array, idAdenda, index);
            },
            function (error) {
                index++;
                RegistrarClausulasImprimir(array, idAdenda, index);
            });
    } else {
        MostrarLoading(false);

        if ($('#btnGuardarAdenda').is(":visible")) {
            MensajeOk('Se registró', 'La Adenda se registró correctamente');
            $('#btnGuardarAdenda').prop('disabled', true);
            $('#btnCancelarAdenda').trigger('click');
        } else if ($('#btnGuardarModificacionAdenda').is(":visible")) {
            MensajeOk('Se modificó', 'Los datos de la Adenda se modificacon correctamente');
            $('#btnCancelarAdenda').trigger('click');
        }
    }
}

$('#btnBuscarAdendasModuloPrincipal').off().on('click', function () {
    var codigoCliente = $('#txtClienteModuloPrincipalAdendas').attr('icodcliente'),
        fechaRegistro = $('#txtFechaInicioModuloPrincipal').val().trim();

    if (typeof codigoCliente == 'undefined') {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }

    if (fechaRegistro.length == 0)
        fechaRegistro = '1900-01-01';

    MostrarLoading(true, 'Buscando Adenda, un momento por favor...');

    QueryAJAX('indraupc/buscarAdendas',
        {
            codigoCliente: codigoCliente,
            fechaRegistro: fechaRegistro
        },
        function (resultado) {
            MostrarLoading(false);

            if (resultado == null) {
                MensajeError('Servidor devolvió SIN DATOS');
                return;
            }

            console.log(resultado);

            for (var i = 0; i < resultado.length; i++)
                resultado[i].IdRegistro = i + 1;

            ReloadJQGRID('tablaClientesAdendas', resultado);
        },
        function (error) {
            MostrarLoading(false);


        });
});

$('#btnConsultarAdenda').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesAdendas');

    if (registro == null) {
        MensajeError('Debe seleccionar una Adenda');
        return;
    }

    ConsultarAdenda(registro.codigoAdenda, function () {

        $('#titleOpcion').html('CONSULTAR ADENDA');
        $('#btnGuardarAdenda,#btnGuardarModificacionAdenda,#btnGuardarEliminarAdenda').hide();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();

        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloAdenda').carousel(1);
    });
});

$('#btnModificarAdenda').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesAdendas');

    if (registro == null) {
        MensajeError('Debe seleccionar una Adenda');
        return;
    }

    ConsultarAdenda(registro.codigoAdenda, function () {

        $('#titleOpcion').html('MODIFICAR ADENDA');
        $('#btnGuardarAdenda,#btnGuardarEliminarAdenda').hide();
        $('#btnGuardarModificacionAdenda').show();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();

        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloAdenda').carousel(1);
    });
});

$('#btnEliminarAdenda').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesAdendas');

    if (registro == null) {
        MensajeError('Debe seleccionar una Adenda');
        return;
    }

    ConsultarAdenda(registro.codigoAdenda, function () {

        $('#titleOpcion').html('ELIMINAR ADENDA');
        $('#btnGuardarAdenda,#btnGuardarModificacionAdenda').hide();
        $('#btnGuardarEliminarAdenda').show();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();

        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloAdenda').carousel(1);
    });
});


$('#btnGuardarModificacionAdenda').off().on('click', function () {
    var iCodAdenda = $('#txtNroAdendaAdenda').attr('icodadenda'),
       tipoMoneda = $('#cboTipoMonedaNuevoContrato').val(),
       monto = $('#txtPrecioContractualNuevoContato').val().trim(),
       fechaInicio = $('#txtFechaInicioNuevoContato').val().trim(),
       fechaFin = $('#txtFechaFinalNuevoContato').val().trim(),
       dniCliente = $('#txtDniClienteFirmanteNuevoContrato').val().trim(),
       dniApoderado = $('#txtDniApoderadoNuevoContrato').val().trim(),
       dniGerente = $('#txtDniGerenteNuevoContrato').val().trim(),
       numeroPaginas = 10,
       numeroClausulas = 15;

    if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0 || iCodAdenda == 0) {
        MensajeError('No ha seleccionando ningún contrato');
        return;
    }

    if (!$.isNumeric(monto)) {
        MensajeError('Precio Contractual debe ser solo números');
        return;
    }
    monto = parseFloat(monto)
    if (monto <= 0) {
        MensajeError('Precio Contractual no puede ser menor o igual a cero (0)');
        return;
    }

    if (fechaInicio.length == 0) {
        MensajeError('Fecha Inicio no puede estar vacío');
        return;
    }

    if (fechaFin.length == 0) {
        MensajeError('Fecha Fin no puede estar vacío');
        return;
    }

    if ($('#txtNombreClienteFirmanteNuevoContrato').val().trim().length == 0) {
        MensajeError('Dni cliente firmante no puede estar vacío');
        return;
    }
    if ($('#txtNombreApoderadoNuevoContrato').val().trim().length == 0) {
        MensajeError('Dni apoderado no puede estar vacío');
        return;
    }

    if (dniGerente.length == 0) {
        MensajeError('Dni de gerente no puede estar vacío');
        return;
    }

    MensajeConfirmar('¿Desea modificar la adenda?',
        function () {
            MostrarLoading(true, 'Modificando Adenda...');

            QueryAJAX('indraupc/modificarAdenda',
                   {
                       codigoAdenda: iCodAdenda,
                       tipoMoneda: tipoMoneda,
                       monto: monto,
                       fechaInicio: fechaInicio,
                       fechaFin: fechaFin,
                       dniCliente: dniCliente,
                       dniApoderado: dniApoderado,
                       dniGerente: dniGerente,
                       numeroPaginas: numeroPaginas,
                       numeroClausulas: numeroClausulas
                   },
                   function (resultado) {

                       if (resultado <= 0) {
                           MostrarLoading(false);
                           MensajeError('No se pudo modificar adenda en el servidor');
                           return;
                       }

                       console.log('Codigo de Adenda Modificada: ', resultado);

                       var idAdenda = resultado;

                       MostrarLoading(true, 'Modificando Antecedentes...');

                       var array = [];
                       $('#tableAntecedentesNuevoContrato tbody tr').each(function () {
                           array.push($(this).find('td:eq(1)').text());
                       });

                       RegistrarAntecedentes(array, idAdenda, 0);

                   },
                   function (error) {
                       MostrarLoading(false);
                       MensajeError('Problemas para conectarnos con el servicio');
                   });
        });
});

$('#btnGuardarEliminarAdenda').off().on('click', function () {
    MensajeConfirmar('¿Desea realmente eliminar la adenda?',
        function () {
            MostrarLoading(true, 'Eliminando Adenda...');

            var iCodAdenda = $('#txtNroAdendaAdenda').attr('icodadenda');

            if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0 || iCodAdenda == 0) {
                MensajeError('No ha seleccionando ningún contrato');
                return;
            }

            QueryAJAX('indraupc/rechazarContrato',
                  {
                      codigoAdenda: iCodAdenda,
                  },
                  function (resultado) {
                      MostrarLoading(false);

                      if (resultado != 1) {
                          MensajeError('No se pudo Eliminar Adenda');
                          return;
                      }
                      MensajeOk('Adenda Eliminada',
                          'Se eliminó Adenda correctamente',
                          function () {
                              $('#btnCancelarAdenda').trigger('click');
                              setTimeout(function () {
                                  $('#btnBuscarAdendasModuloPrincipal').trigger('click');
                              }, 1000)
                          });
                  },
                  function (error) {
                      MostrarLoading(false);
                      MensajeError('Problemas para conectarnos con el servicio');
                  });
        });
});

$('#btnListoImprimirAdenda').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesAdendas');

    if (registro == null ) {
        MensajeError('Debe seleccionar una Adenda');
        return;
    }

    MensajeConfirmar('¿Desea cambiar el estado de la Adenda "Listo para Imprimir"?',
        function () {
            QueryAJAX('indraupc/habilitarContrato',
            {
                codigoAdenda: registro.codigoAdenda,
            },
                  function (resultado) {

                      if (resultado != 1) {
                          MensajeError('No se pudo cambiar estado de la Adenda');
                          return;
                      }
                      MensajeOk('Adenda Enviada',
                          'La Adenda se envió correctamente');

                      $('#btnBuscarAdendasModuloPrincipal').trigger('click');
                  },
                  function (error) {

                  });
        });
});

$('#btnVistaPreviaAdenda').off().on('click', function () {
    /*PREGUNTAMOS SI ES PARA CREAR UN NUEVO */
    if ($('#btnGuardarAdenda').is(":visible")) {
        var iCodContrato = $('#txtNroContratoAdenda').attr('icodcontrato'),
      tipoMoneda = $('#cboTipoMonedaNuevoContrato').val(),
      monto = $('#txtPrecioContractualNuevoContato').val().trim(),
      fechaInicio = $('#txtFechaInicioNuevoContato').val().trim(),
      fechaFin = $('#txtFechaFinalNuevoContato').val().trim(),
      dniCliente = $('#txtDniClienteFirmanteNuevoContrato').val().trim(),
      dniApoderado = $('#txtDniApoderadoNuevoContrato').val().trim(),
      dniGerente = $('#txtDniGerenteNuevoContrato').val().trim(),
      numeroPaginas = 10,
      numeroClausulas = 15;

        if (typeof iCodContrato == 'undefined' || iCodContrato.length == 0 || iCodContrato == 0) {
            MensajeError('No ha seleccionando ningún contrato');
            return;
        }

        if (!$.isNumeric(monto)) {
            MensajeError('Precio Contractual debe ser solo números');
            return;
        }
        monto = parseFloat(monto)
        if (monto <= 0) {
            MensajeError('Precio Contractual no puede ser menor o igual a cero (0)');
            return;
        }

        if (fechaInicio.length == 0) {
            MensajeError('Fecha Inicio no puede estar vacío');
            return;
        }

        if (fechaFin.length == 0) {
            MensajeError('Fecha Fin no puede estar vacío');
            return;
        }

        if ($('#txtNombreClienteFirmanteNuevoContrato').val().trim().length == 0) {
            MensajeError('Dni cliente firmante no puede estar vacío');
            return;
        }
        if ($('#txtNombreApoderadoNuevoContrato').val().trim().length == 0) {
            MensajeError('Dni apoderado no puede estar vacío');
            return;
        }

        if (dniGerente.length == 0) {
            MensajeError('Dni de gerente no puede estar vacío');
            return;
        }

        /*VALIDANDO CAMPOS VACIOS*/
        var sw = false;
        //ANTECEDENTES
        $('#tableAntecedentesNuevoContrato tbody tr').each(function () {
            if ($(this).find('td:eq(1)').text().trim().length == 0)
                sw = true;
        });

        if (sw) {
            MensajeError('Antecedentes sin concluir');
            $('div.card-tabs-bar a:eq(1)').click();
            return;
        }

        //CRONOGRAMA
        $('#tablaCronogramaEntregaNuevoContrato tbody tr').each(function () {
            if ($(this).find('td:eq(1)').text().trim().length == 0 ||
                    $(this).find('td:eq(2)').text().trim().length == 0 ||
                    $(this).find('td:eq(3)').text().trim().length == 0 ||
                    $(this).find('td:eq(4)').text().trim().length == 0)
                sw = true;
        });

        if (sw) {
            MensajeError('Cronograma sin concluir');
            $('div.card-tabs-bar a:eq(3)').click();
            return;
        }

        //PAGO CUOTAS
        $('#tablaCuotasNuevoContrato tbody tr').each(function () {
            if ($(this).find('td:eq(2)').text().trim().length == 0 ||
                    $(this).find('td:eq(3)').text().trim().length == 0 ||
                    $(this).find('td:eq(1)').text().trim().length == 0 ||
                    $(this).find('td:eq(4)').text().trim().length == 0)
                sw = true;
        });

        if (sw) {
            MensajeError('Forma de Pago sin concluir');
            $('div.card-tabs-bar a:eq(5)').click();
            return;
        }

        //CLAUSULAS A IMPRIMIR
        $('#tablaClausulasAImprimirAdenda tbody tr').each(function () {
            if ($(this).find('td:eq(0) input').is(':checked'))
                sw = true;
        });

        if (sw == false) {
            MensajeError('No ha seleccionado ninguna clausula a imprimir');
            $('div.card-tabs-bar a:eq(7)').click();
            return;
        }
    }

    var pNumeroAdenda = $('#txtNumeroAdendaAdenda').val().trim();// '1';
    var pnombreAdenda = $('#txtNombreAdendaAdenda').val().trim();
    var pNumSolCambios = '1';
    var pNombreContrato = $('#txtNroContratoAdenda').attr('nombreContrato'); //'0009 - 2018 – 000001 / DESARROLLO DE SOFTWARE';
    var pNombreCliente = $('#txtRazonSocialClienteAdenda').val().trim();//'BACKUS y JOHNSTON S.A.A';
    var pTipoCliente = $('#txtActividadAdenda').val().trim().length == 0 ? 'DNI' : 'RUC';
    var pDniCliente = $('#txtRucDniAdenda').val().trim();// '20100113610';
    var pDireccionCliente = $('#txtDomicilioAdenda').val().trim();// 'Av. Nicolás Ayllón 3986 Ate Vitarte';
    var pPrimeraClausula = 0;
    var pSegundaClausula = 0;
    var pTerceraClausula = 0;
    var pCuartaClausula = 0;
    var pQuintaClausula = 0;
    var pSextaClausula = 0;
    var pSeptimaClausula = 0;

    //for (var i = 0; i < resultado.clausula.length; i++) {
    //    $('input[type=checkbox][numeroClausula=' + resultado.clausula[i].numeroClausula + ']').prop('checked', true);
    //}

    var contadorTempo = 0;
    var correlativoClausula = 0;
    $('#tablaClausulasAImprimirAdenda tbody input[type=checkbox]').each(function () {
        contadorTempo++;
        switch (contadorTempo) {
            case 1:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pPrimeraClausula = correlativoClausula;
                }
                break;
            case 2:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pSegundaClausula = correlativoClausula;
                }
                break;
            case 3:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pTerceraClausula = correlativoClausula;
                    break;
                }
            case 4:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pCuartaClausula = correlativoClausula;
                }
                break;
            case 5:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pQuintaClausula = correlativoClausula;
                }
                break;
            case 6:
                if ($(this).is(':checked')) {
                    correlativoClausula++;
                    pSextaClausula = correlativoClausula;
                    break;
                }
        }
    });

    correlativoClausula++;
    pSeptimaClausula = correlativoClausula;




    var pMonedaContrato = $('#cboTipoMonedaNuevoContrato').val() == '1' ? 'S/.' : '$.';
    var pMontoContrato = $('#txtPrecioContractualNuevoContato').val().trim();// '1195,891.44';

    if ($('#cboTipoMonedaNuevoContrato').val() == '1') {
        pMontoContrato += ' (' + numeroALetras(parseFloat(pMontoContrato), {
            plural: 'SOLES',
            singular: 'SOL',
            centPlural: 'CENTIMOS',
            centSingular: 'CENTIMO'
        }) + ')';
    } else {
        pMontoContrato += ' (' + numeroALetras(parseFloat(pMontoContrato), {
            plural: 'DÓARES ESTADOUNIDENSES',
            singular: 'DÓLAR ESTADOUNIDENSE',
            centPlural: 'CENTAVOS',
            centSingular: 'CENTAVO'
        }) + ')';
    }
    var pTipoPago = $('#chkPagoContadoNuevoContrato').is(':checked') ? 'Pago al Contado' : 'Pago en Cuotas';
    var pFechaInicial = $('#txtFechaInicioNuevoContato').val().trim();// '01/01/2018';
    var pFechaFinal = $('#txtFechaFinalNuevoContato').val().trim();//'31/12/2018';
    var pDia = '01';
    var pMes = 'Enero';
    var pAnio = '2018';

    //var array_antecedentes = [
    //{ descripcion: 'La EMPRESA  es una persona jurídica dedicada al diseño, desarrollo, ejecución y mantenimiento de softwares empresariales. EL CLIENTE es una persona jurídica dedicada a la producción de cervezas, y dentro de sus actividades empresariales requieren del desarrollo de distintos software para el mejoramiento de sus procesos y procedimientos.' },
    //{ descripcion: 'Con fecha 01/01/2018 se tuvo la primera conversación con EL CLIENTE lo cual representa el primer contacto que contrae LA EMPRESA y EL CLIENTE por medio del equipo de marketing. En este primer contacto se proponen las bases del proyecto de desarrollo de software entre LA EMPRESA Y EL CLIENTE, lo cual significaría más adelante su aprobación por ambas partes y dar inicio con el proyecto. En este antecedente se declara la intención del CLIENTE para dar inicio con el contrato de desarrollo de software por parte de LA EMPRESA a continuación detallado en las siguientes cláusulas.' }
    //];

    var array_antecedentes = [];

    $('#tableAntecedentesNuevoContrato tbody tr').each(function () {
        array_antecedentes.push({
            descripcion: $(this).find('td:eq(1)').text()
        });
    });

    var array_anexos = [
    { descripcion: 'Anexo N° 01 – Especificaciones técnicas y características requeridas (detalle de las especificaciones y características que requiere EL CLIENTE que contenga el software a desarrollar).' },
    { descripcion: 'Anexo N° 02 - Cronograma de diseño, desarrollo y entrega de software del presente contrato.' }
    ];

    //var array_pago = [
    //    {
    //        cuota: '1',
    //        anio: '2018',
    //        mes: 'Abril',
    //        diapago: '05 de Mayo del 2018'
    //    },
    //    {
    //        cuota: '2',
    //        anio: '2018',
    //        mes: 'Junio',
    //        diapago: '05 de Junio del 2018'
    //    },
    //    {
    //        cuota: '3',
    //        anio: '2018',
    //        mes: 'Julio',
    //        diapago: '05 de Julio del 2018'
    //    },
    //    {
    //        cuota: '4',
    //        anio: '2018',
    //        mes: 'Julio',
    //        diapago: '10 de Agosto del 2018'
    //    },
    //    {
    //        cuota: '5',
    //        anio: '2018',
    //        mes: 'Julio',
    //        diapago: '21 de Septiembe del 2018'
    //    }
    //];

    var array_pago = [];

    $('#tablaCuotasNuevoContrato tbody tr').each(function () {
        array_pago.push({
            cuota: $(this).find('td:eq(0)').text(),
            anio: $(this).find('td:eq(1)').text(),
            mes: $(this).find('td:eq(2)').text(),
            diapago: $(this).find('td:eq(3)').text()
        });
    });
    //var array_cronograma = [
    //    {
    //        numentrega: '1',
    //        dia: '15',
    //        fecentrega: '25 de Febrero del 2018',
    //        descripcion: 'Prototipos'
    //    },
    //    {
    //        numentrega: '2',
    //        dia: '10',
    //        fecentrega: '07 de Marzo del 2018',
    //        descripcion: 'Base de Datos'
    //    },
    //    {
    //        numentrega: '3',
    //        dia: '19',
    //        fecentrega: '26 de Marzo del 2018',
    //        descripcion: 'Primer módulo'
    //    }
    //];

    var array_cronograma = [];

    $('#tablaCronogramaEntregaNuevoContrato tbody tr').each(function () {
        array_cronograma.push({
            numentrega: $(this).find('td:eq(0)').text(),
            dia: $(this).find('td:eq(1)').text(),
            fecentrega: $(this).find('td:eq(2)').text(),
            descripcion: $(this).find('td:eq(3)').text()
        });
    });

    GenerarPdfAdenda(pNombreContrato,
                        pnombreAdenda,
                     pNumeroAdenda,
                     pNumSolCambios,
                     pNombreCliente,
                     pTipoCliente,
                     pDniCliente,
                     pDireccionCliente,
                     pPrimeraClausula,
                     pSegundaClausula,
                     pTerceraClausula,
                     pCuartaClausula,
                     pQuintaClausula,
                     pSextaClausula,
                     pSeptimaClausula,
                     array_antecedentes,
                     array_anexos,
                     pMonedaContrato,
                     pMontoContrato,
                     pTipoPago,
                     array_pago,
                     pFechaInicial,
                     pFechaFinal,
                     array_cronograma,
                     pDia,
                     pMes,
                     pAnio
                    );
});
/*VISUALIZAR PDF ADENDA*/

function GenerarPdfAdenda(pNombreContrato,
                            nombreAdenda,
                          pNumeroAdenda,
                          pNumSolCambios,
                          pNombreCliente,
                          pTipoCliente,
                          pDniCliente,
                          pDireccionCliente,
                          pPrimeraClausula,
                          pSegundaClausula,
                          pTerceraClausula,
                          pCuartaClausula,
                          pQuintaClausula,
                          pSextaClausula,
                          pSeptimaClausula,
                          array_antecedentes,
                          array_anexos,
                          pMonedaContrato,
                          pMontoContrato,
                          pTipoPago,
                          array_pago,
                          pFechaInicial,
                          pFechaFinal,
                          array_cronograma,
                          pDia,
                          pMes,
                          pAnio
                         ) {

    var clausulaSiguiente = 0;

    //alert(pPrimeraClausula + '\n' +
    //                          pSegundaClausula + '\n' +
    //                          pTerceraClausula + 'n' +
    //                          pCuartaClausula + '\n' +
    //                          pQuintaClausula + '\n' +
    //                          pSextaClausula);

    function listar_array(objeto, nombreobjeto) {
        var texto = '';
        for (var i = 0; i < nombreobjeto.length; i++) {
            texto += nombreobjeto[i].descripcion + '\n\n';
        };
        return texto;
    }

    function clausula1(clausula1) {
        var texto = '';
        if (clausula1 > 0) {
            texto = primeraclausula;
        }
        return texto;
    }

    function clausula2(clausula2) {
        var texto = '';
        if (clausula2 > 0) {
            texto = segundaclausula;
        }
        return texto;
    }

    function clausula3(clausula3) {
        var texto = '';
        if (clausula3 > 0) {
            texto = terceraclausula;
        }
        return texto;
    }

    function clausula4(clausula4) {
        var texto = '';
        if (clausula4 > 0) {
            texto = cuartaclausula;
        }
        return texto;
    }

    function clausula5(clausula5) {
        var texto = '';
        if (clausula5 > 0) {
            texto = quintaclausula;
        }
        return texto;
    }

    function clausula6(clausula6) {
        var texto = '';
        if (clausula6 > 0) {
            texto = sextaclausula;
        }
        return texto;
    }

    function clausulas(numero) {
        var texto = ''
        clausulaSiguiente++;
        switch (numero) {
            case 1:
                texto = 'PRIMERA';
                break;
            case 2:
                texto = 'SEGUNDA';
                break;
            case 3:
                texto = 'TERCERA';
                break;
            case 4:
                texto = 'CUARTA';
                break;
            case 5:
                texto = 'QUINTA';
                break;
            case 6:
                texto = 'SEXTA';
                break;
            case 7:
                texto = 'SEPTIMA';
                break;

        }
        //if (numero == 1) {
        //    texto = 'PRIMERA';
        //}
        //else if (numero == 2) {
        //    texto = 'SEGUNDA';
        //}
        //else if (numero == 3) {
        //    texto = 'TERCERA';
        //}
        //else if (numero == 4) {
        //    texto = 'CUARTA';
        //}
        //else if (numero == 5) {
        //    texto = 'QUINTA';
        //}
        //else if (numero == 6) {
        //    texto = 'SEXTA';
        //}
        //else if (numero == 7) {
        //    texto = 'SEPTIMA';
        //}
        return texto;
    }

    var arrayPagoTempo = [
        [{ text: 'Número Cuota', style: 'tableHeader' }, { text: 'Año', style: 'tableHeader' }, { text: 'Mes', style: 'tableHeader' }, { text: 'Último Día Pago', style: 'tableHeader' }]
    ]

    for (var i = 0; i < array_pago.length; i++) {
        arrayPagoTempo.push(
            [
                array_pago[i].cuota,
                array_pago[i].anio,
                array_pago[i].mes,
                array_pago[i].diapago
            ]
            );
    }

    var arrayCronogramaTempo = [
        [{ text: 'Nro. Entrega', style: 'tableHeader' }, { text: 'Días', style: 'tableHeader' }, { text: 'Fecha de Entrega', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }]
    ]

    for (var i = 0; i < array_cronograma.length; i++) {
        arrayCronogramaTempo.push(
            [
                array_cronograma[i].numentrega,
                array_cronograma[i].dia,
                array_cronograma[i].fecentrega,
                array_cronograma[i].descripcion
            ]
            );
    }

    var arrayPlazoTempo = [
        [{ text: 'Fecha Inicio Contrato', style: 'tableHeader' }, { text: 'Fecha Fin Contrato', style: 'tableHeader' }]
    ]

    var primeraclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pPrimeraClausula) + ': DE LOS ANTECEDENTES', style: 'tituloclausula' },
          {
              text: 'Según la Solicitud de Cambios N° ' + pNumSolCambios + ', se define la siguiente lista actualizada de Antecedentes a mostrar en el contrato vigente:' + listar_array('Antecedentes', array_antecedentes),
              style: 'parrafo'
          }]
    ]

    var segundaclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pSegundaClausula) + ': DEL OBJETO', style: 'tituloclausula' },
          {
              text: 'Según la Solicitud de Cambios N° ' + pNumSolCambios + ', se define la siguiente lista actualizada de Anexos a mostrar en el contrato vigente:' + '\n\n' + listar_array('Anexos', array_anexos),
              style: 'parrafo'
          }]
    ]

    var terceraclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pTerceraClausula) + ': DEL MONTO CONTRACTUAL', style: 'tituloclausula' },
          {
              text: 'El monto del presente Contrato asciende a la suma total de ' + pMonedaContrato + ' ' + pMontoContrato + ' (UN MILLON CIENTO NOVENTA Y CINCO MIL OCHOCIENTOS NOVENTA Y UN CON 44/100 SOLES), por los cambios solicitados por EL CLIENTE (según lo establecido en la Solicitud de Cambios con N° ' + pNumSolCambios + ')',
              style: 'parrafo'
          }]
    ]

    var cuartaclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pCuartaClausula) + ': DE LA FORMA DE PAGO', style: 'tituloclausula' },
          { text: 'Según la Solicitud de Cambios N° ' + pNumSolCambios + ', EL CLIENTE se compromete a realizar el pago de tipo ' + pTipoPago + ' del servicio solicitado de acuerdo al Contrato vigente, basado en el siguiente cuadro:' + '\n', style: 'parrafo' },
          { table: { widths: ['auto', 'auto', 'auto', 'auto'], headerRows: 1, body: arrayPagoTempo }, layout: { hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; }, vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; }, hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F'; }, vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F'; }, fillColor: function (i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; } }, style: 'parrafo' }
        ]
    ]

    var quintaclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pQuintaClausula) + ': DEL PLAZO DEL CONTRATO', style: 'tituloclausula' },
          {
              text: 'Según la Solicitud de Cambios N° ' + pNumSolCambios + ', se actualiza la vigencia del contrato para que sea cumplido por parte de LA EMPRESA, siguiendo las siguientes fechas:' + '\n',
              style: 'parrafo'
          },
          { table: { widths: [180, 180], headerRows: 1, body: [[{ text: 'Fecha Inicio Contrato', style: 'tableHeader' }, { text: 'Fecha Fin Contrato', style: 'tableHeader' }], [pFechaInicial, pFechaFinal], ] }, layout: { hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; }, vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; }, hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F'; }, vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F'; }, fillColor: function (i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; } }, style: 'parrafo' }
        ]
    ]

    var sextaclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pSextaClausula) + ': DEL CRONOGRAMA DE ENTREGA', style: 'tituloclausula' },
          { text: 'Según la Solicitud de Cambios N° ' + pNumSolCambios + ', se actualiza el Cronograma de entrega del Contrato vigente, basado en el siguiente cuadro:' + '\n', style: 'parrafo' },
          { table: { widths: ['auto', 'auto', 'auto', 'auto'], headerRows: 1, body: arrayCronogramaTempo }, layout: { hLineWidth: function (i, node) { return (i === 0 || i === node.table.body.length) ? 2 : 1; }, vLineWidth: function (i, node) { return (i === 0 || i === node.table.widths.length) ? 2 : 1; }, hLineColor: function (i, node) { return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F'; }, vLineColor: function (i, node) { return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F'; }, fillColor: function (i, node) { return (i % 2 === 0) ? '#CCCCCC' : null; } }, style: 'parrafo' }
        ]
    ]

    var septimaclausula = [
        [{ text: 'CLÁUSULA ' + clausulas(pSeptimaClausula) + ': RATIFICACIÓN DE LAS ESTIPULACIONES', style: 'tituloclausula' },
          { text: '\nLas partes declaran, que las demás estipulaciones del contrato que no hayan sido modificadas expresamente por la presente adenda permanecen inalterables ratificando las partes su eficacia.', style: 'parrafo' },
          { text: '\n\nLas partes firman por triplicado en señal de conformidad, en la ciudad de Lima a los ' + pDia + ' día(s) del mes de ' + pMes + ' del año ' + pAnio + '.', style: 'parrafo' }
        ]
    ]

    var docDefinition = {
        content: [
          {
              //text: 'Adenda N° ' + pNumeroAdenda + ' al ' + pNombreContrato,
              text: nombreAdenda,
              style: 'header'
          },
          '\n',
          {
              text: ['Conste por el presente documento, la suscripción de la Adenda al Contrato ' + pNombreContrato + ', reconocido mediante la Solicitud de Cambios N° ' + pNumSolCambios + ', a quien se le define a la empresa INDRA COMPANY SAC, con RUC N° 20374984838, con domicilio legal en Av. Jorge Basadre Nro. 233 Int. 901 (Alt. 1ra Cuadra de Av. Javier Prado Oeste) San Isidro, debidamente representado por su Representante Legal VICTOR MANUEL SUZUKI LAVIN, identificado(a) con DNI N° 03654673 a quien en adelante se le conocerá como ', { text: 'LA EMPRESA', style: 'bigger' }, ' y de la otra parte ' + pNombreCliente + ', con ' + pTipoCliente + ' N° ' + pDniCliente + ', con domicilio legal en ' + pDireccionCliente + ', a quien en adelante se le denominará ', { text: 'EL CLIENTE', style: 'bigger' }, ' en los términos y condiciones siguientes:'],
              style: 'parrafo'
          },
          '\n',
          clausula1(pPrimeraClausula),
          '\n',
          clausula2(pSegundaClausula),
          '\n',
          clausula3(pTerceraClausula),
          '\n',
          clausula4(pCuartaClausula),
          '\n',
          clausula5(pQuintaClausula),
          '\n',
          clausula6(pSextaClausula),
              '\n',
          {
              text: septimaclausula,
              style: 'parrafo'
          },
          '\n\n\n\n',
          {
              text: '_________________________________________' + '\n' + 'FIRMA DEL GERENTE DEL ÁREA',
              style: 'parrafo',
          },
          '\n\n\n\n',
          {
              text: '_________________________________________' + '\n' + 'FIRMA DEL APODERADO',
              style: 'parrafo',
          },
          '\n\n\n\n',
          {
              text: '_________________________________________' + '\n' + 'FIRMA DEL CLIENTE',
              style: 'parrafo',
          }
        ],

        styles: {
            header: {
                fontSize: 18,
                bold: true,
                decoration: 'underline',
                alignment: 'center',
                margin: [20, 45, 20, 45]
            },
            parrafo: {
                fontSize: 14,
                alignment: 'justify',
                margin: [20, 0, 20, 15],

            },
            tituloclausula: {
                fontSize: 14,
                bold: true,
                alignment: 'justify',
                margin: [20, 0, 20, 8],

            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            },
            bigger: {
                fontSize: 14,
                bold: true
            },
            anotherStyle: {
                italic: true,
                alignment: 'right'
            }
        }
    };
    pdfMake.createPdf(docDefinition).open();
}
