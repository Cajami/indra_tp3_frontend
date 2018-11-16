

function InitPageSolicitudCambios() {

    $('.tabsholder4').cardTabs({ theme: 'wiki' });

    // $('#txtFechaRegistroSolicitudCambios').off().on('keydown', function (e) {
    //     e.preventDefault();
    //     e.stopPropagation();
    // }).datetimepicker({
    //     timepicker: false,
    //     value: new Date(),
    //     format: 'Y-m-d',
    // });

    /*CONFIGURACIONES DE TAMAÑO*/
    $('div.carousel-item').css('height', $(document).height() - 130);

    $('#chkControversiaAsociada').toggles({
        drag: true, // allow dragging the toggle between positions
        click: true, // allow clicking on the toggle
        text: {
            on: 'SI', // text for the ON position
            off: 'No' // and off
        },
        on: false, // is the toggle ON on init
        animate: 250, // animation time (ms)
        easing: 'swing', // animation transition easing function
        //checkbox: null, // the checkbox to toggle (for use in forms)
        //clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
        width: 70, // width used if not set in css
        height: 20, // height if not set in css
        type: 'compact' // if this is set to 'select' then the select style toggle will be used
    });

    $('#chkControversiaAsociada').css('opacity', 1)
        .toggleClass('disabled', true);


    GenerarGrillaSolicitudesCambios();
}

function GenerarGrillaSolicitudesCambios() {
    var alto = $(document).height() - 340;
    jQuery('#tablaSolicitudCambios').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'codigoSolicitud', name: 'codigoSolicitud', index: 'codigoSolicitud', align: 'center', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'codigoAdenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'center', width: 100, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Contrato', name: 'codigoContrato', index: 'codigoContrato', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Nro Solicitud de Cambios', name: 'numeroSolicitud', index: 'numeroSolicitud', align: 'center', width: 150, sortable: false, resizable: false },
            { label: 'Nro Contrato', name: 'numeroContrato', index: 'numeroContrato', align: 'center', width: 100, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre Contrato', name: 'nombreContrato', index: 'nombreContrato', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            {
                label: 'Nro Adenda', name: 'numeroAdenda', index: 'numeroAdenda', align: 'center', width: 100, hidden: false, sortable: false, resizable: false,
                formatter: function (cellvalue, options, rowObject) {
                    return cellvalue ? cellvalue : '';
                }
            },
            { label: 'Nombre Adenda', name: 'nombreAdenda', index: 'nombreAdenda', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Fec. Registro', name: 'fechaRegistro', index: 'fechaRegistro', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            {
                label: 'Estado', name: 'estadoSolicitud', index: 'estadoSolicitud', align: 'center', width: 150, hidden: false, sortable: false, resizable: false,
                cellattr: function (rowId, val, rawObject, cm, rdata) {
                    var stylo = '';
                    switch (val) {
                        case 'INICIADO':
                            stylo = 'color:blue;';
                            break;
                        case 'RECHAZADO':
                            stylo = 'color:red;';
                            break;
                        case 'EN PROCESO':
                            stylo = 'color:green;font-weight: bold;';
                        default:

                    }
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
        pager: '#pagertablaSolicitudCambios',
        gridview: true,
        ignoreCase: true,
        viewrecords: true,
        sortable: true,

        onSelectRow: function (rowid, iRow, iCol, e) {
            var registro = jQuery(this).jqGrid('getRowData', rowid);

            $('#contenedorBotones button').prop('disabled', true);
            switch (registro.estadoSolicitud) {
                case 'RECHAZADO':
                    $('#btnConsultarSolicitudCambios,#btnNuevoSolicitudCambios').prop('disabled', false);
                    break;
                case 'INICIADO':
                    $('#contenedorBotones button').prop('disabled', false);
                    break;
                case 'APROBADO':
                    $('#btnConsultarSolicitudCambios,#btnNuevoSolicitudCambios').prop('disabled', false);
            }

            // if (registro.estadoAdenda == 'EN PROCESO')
            //     $('#btnSeleccionar').prop('disabled', false);
            // else
            //     $('#btnSeleccionar').prop('disabled', true);
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
InitPageSolicitudCambios();

$('#btnAbrirDialogoClienteBuscar').off().on('click', function () {
    $('#btnSeleccionarClienteDialogo').attr('accion', 'principal');
    OpenDialogo('dialogoBuscarCliente', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {


        $('#txtBuscarRucCliente,#txtBuscarDniCliente,#txtBuscarClienteRazonSocialCliente').val('');
        ReloadJQGRID('tablaClientesDialogo', []);
    });
});

$('#btnBuscarAdendaSolicitudCambios').off().on('click', function () {
    var $tabla = $('#tablaBusquedaContratosDialogo');
    $tabla.hideCol('numeroSolicitud');
    $tabla.hideCol('estadoSolicitud');

    OpenDialogo('dialogoBuscarContrato', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {
        var $tabla = $('#tablaBusquedaContratosDialogo');

        $tabla.showCol('numeroSolicitud');
        $tabla.showCol('estadoSolicitud');

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

        var $tabla = $('#tablaBusquedaContratosDialogo');
        $tabla.hideCol('numeroSolicitud');
        $tabla.hideCol('estadoSolicitud');
    }, function () {
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

    debugger;
    if ($('#btnSeleccionarClienteDialogo').attr('accion') == 'principal') {
        $('#txtClienteSolicitudCambios').val(registro.cliente).attr('iCodCliente', registro.codigoFirmante);
    } else {
        $('#txtBuscarRucClienteDialogo').val(registro.cliente);
        $('#hCodigoClienteDialogoContrato').val(registro.codigoFirmante);
    }
});


$('#btnSeleccionarContratoDialogo').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaBusquedaContratosDialogo');
    debugger;
    if (registro == null) {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }
    /*LA ADENDA DEBE ESTAR APROBADA*/
    if (registro.estadoAdenda != 'APROBADO') {
        MensajeError('La última adenda aún no ha finalizado el proceso');
        return;
    }

    if (registro.numeroSolicitud.trim().length > 0) {
        MensajeError('Adenda ya cuenta con una solicitud de cambios');
        return;
    }

    $('#txtNroContratoSolicitudCambios').val(registro.numeroContrato).attr({
        'iCodContrato': registro.codigoContrato,
        'nombreContrato': registro.nombreContrato
    });
    //$('#txtNroAdendaAdenda').val(registro.numeroAdenda).attr('iCodAdenda', registro.codigoAdenda);
    $('#txtNroAdendaSolicitudCambios').val(registro.numeroAdenda.length == 0 ? '' : registro.numeroAdenda).attr('iCodAdenda', registro.codigoAdenda);
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

            if (resultado == null) {
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

$('#btnBuscarSolicitudesCambios').off().on('click', function () {
    var codigoCliente = $('#txtClienteSolicitudCambios').attr('icodcliente');

    //) $('#hCodigoFirmanteSeleccionadoModuloPrincipalSolicitudCambios').val(),
    fechaRegistro = '1900-01-01';

    if (typeof codigoCliente == 'undefined') {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }
    MostrarLoading(true, 'Buscando Solicitudes de Cambio, un momento por favor...');

    QueryAJAX('indraupc/buscarSolicitudCambios',
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

            // for (var i = 0; i < resultado.length; i++)
            //     resultado[i].IdRegistro = i + 1;

            ReloadJQGRID('tablaSolicitudCambios', resultado);
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos al servicio web');
        });
});

$('#btnNuevoSolicitudCambios').off().on('click', function () {
    $('#contenedorControlesSolicitud input').val('');
    $('#btnBuscarAdendaSolicitudCambios,#btnBuscarContratoAdendaSolicitudCambios').prop('disabled', false);
    $('#tablaCausulasAModificar tbody tr input[type=checkbox]').prop('checked', false).trigger('change');
    $('#titleOpcion').html('NUEVA SOLICITUD DE CAMBIOS');
    $('#btnModificarRegistroSolicitudCambios,#btnEliminarRegistroSolicitudCambios').hide();

    //$('div.card-tabs-bar a:not(:first)').show();
    $('#CarruselModuloSolicitudCambios').carousel(1);
});

$('#btnConsultarSolicitudCambios').off().on('click', function () {

    var registro = GetRowSelectJqGrid('tablaSolicitudCambios');

    if (registro == null) {
        MensajeError('Debe seleccionar una Solicitud');
        return;
    }

    recuperarDatosSolicitud(registro.codigoSolicitud, function () {
        $('#titleOpcion').html('CONSULTAR SOLICITUD DE CAMBIO');
        $(' #btnBuscarContratoAdendaSolicitudCambios,#btnBuscarAdendaSolicitudCambios').prop('disabled', true);
        $('#btnGuardarSolicitudCambios').hide();
        $('#btnModificarRegistroSolicitudCambios').hide();
        $('#btnEliminarRegistroSolicitudCambios').hide();
    });


});

function recuperarDatosSolicitud(codigoSolicitud, callBack) {

    MostrarLoading(true, 'Recuperando  Solicitudes de Cambio, un momento por favor...');

    QueryAJAX('indraupc/consultarSolicitudCambio',
        {
            codigoSolicitud: codigoSolicitud,
        },
        function (resultado) {
            MostrarLoading(false);

            if (resultado == null) {
                MensajeError('Servidor devolvió SIN DATOS');
                return;
            }

            $('#hcodigoSolicitud').val(resultado.contrato.codigoSolicitud);

            $('#txtNroContratoSolicitudCambios').val(resultado.contrato.numeroContrato);
            $('#txtNroAdendaSolicitudCambios').val(resultado.contrato.numeroAdenda).attr('iCodAdenda', resultado.contrato.codigoAdenda);
            $('#txtFechaRegistroSolicitudCambios').val(resultado.contrato.fechaRegistro);
            $('#txtNroSolicitudCambios').val(resultado.contrato.numeroSolicitud);
            $('#txtNombreContratoSolicitudCambios').val(resultado.contrato.nombreContrato);
            $('#txtNombreAdendaSolicitudCambios').val(resultado.contrato.nombreAdenda);
            $('#txtRazonSocialSolicitudCambios').val(resultado.contrato.cliente);
            $('#txtRucDniSolicitudCambios').val(resultado.contrato.rucDni);

            if (resultado.contrato.codigoControversia > 0) {
                $('#chkControversiaAsociada').data('toggles').toggle(true);
            } else {
                $('#chkControversiaAsociada').data('toggles').toggle(false);
            }


            for (var i = 0; i < resultado.clausula.length; i++) {
                $('input[type="checkbox"][numeroclausula="' + resultado.clausula[i].numeroClausula + '"]').prop('checked', true).trigger('change', [resultado.clausula[i].detalle]);

            }


            $('#CarruselModuloSolicitudCambios').carousel(1);

            callBack();
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos al servicio web');
        });

}

$('#btnModificarSolicitudCambios').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaSolicitudCambios');

    if (registro == null) {
        MensajeError('Debe seleccionar una Solicitud');
        return;
    }

    recuperarDatosSolicitud(registro.codigoSolicitud, function () {
        $('#titleOpcion').html('MODIFICAR SOLICITUD DE CAMBIO');
        $(' #btnBuscarContratoAdendaSolicitudCambios,#btnBuscarAdendaSolicitudCambios').prop('disabled', true);
        $('#btnGuardarSolicitudCambios').hide();
        $('#btnEliminarRegistroSolicitudCambios').hide();
        $('#btnModificarRegistroSolicitudCambios').show();

    });
});

$('#btnAprobarSolicitudCambios').off().on('click', function () {

    var registro = GetRowSelectJqGrid('tablaSolicitudCambios');

    if (registro == null) {
        MensajeError('Debe seleccionar una Solicitud');
        return;
    }

    MensajeConfirmar('¿Está seguro que desea aprobar la solicitud de cambio?', function () {

        MostrarLoading(true, 'Aprobando solicitud, un momento por favor');

        QueryAJAX('indraupc/aprobarSolicitudCambio',
            {
                codigoSolicitud: registro.codigoSolicitud,
            },
            function (resultado) {
                MostrarLoading(false);

                if (resultado == null) {
                    MensajeError('Servidor devolvió Sin Datos');
                } else if (resultado <= 0)
                    MensajeError('Error al aprobar solicitud');
                else {
                    MensajeOk('Solicitud de Cambios', 'Se aprobó solicitud de cambios');
                    $('#btnBuscarSolicitudesCambios').trigger('click');
                }
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para comunicarnos con el servicio web');
            });
    });
});

$('#btnEliminarSolicitudCambios').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaSolicitudCambios');

    if (registro == null) {
        MensajeError('Debe seleccionar una Solicitud');
        return;
    }

    recuperarDatosSolicitud(registro.codigoSolicitud, function () {
        $('#titleOpcion').html('ELIMINAR SOLICITUD DE CAMBIO');
        $(' #btnBuscarContratoAdendaSolicitudCambios,#btnBuscarAdendaSolicitudCambios').prop('disabled', true);
        $('#btnGuardarSolicitudCambios').hide();
        $('#btnModificarRegistroSolicitudCambios').hide();
        $('#btnEliminarRegistroSolicitudCambios').show();

    });
});

$('#tablaCausulasAModificar tbody').off().on('change', 'input[type="checkbox"]', function (event, detalle) {
    var html = '';
    if ($(this).is(':checked') == true) {
        html = '<textarea class="form-control" rows="3" cols="1" style="height: 50px;margin-top: 5px;background-color: #f9f9e9;color: #1e62b9;min-width: 297px;"></textarea>';
    }
    $(this).parent().next().html(html);

    if (html) {
        if (detalle) {
            $(this).parent().next().find('textarea').val(detalle);

        }

    }
});

$('#btnBuscarContratoAdendaSolicitudCambios').off().on('click', function () {
    var iCodAdenda = $('#txtNroAdendaSolicitudCambios').attr('iCodAdenda');

    //---------------------------------------------------------
    //$('#txtNroContratoAdenda').attr('icodcontrato', 21);
    //iCodAdenda = 20;
    //---------------------------------------------------------

    if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0) {
        MensajeError('Sin Contrato & Adenda a buscar');
        return;
    }

    MostrarLoading(true, 'Buscando Solicitudes de Cambio, un momento por favor...');

    QueryAJAX('indraupc/seleccionarAdendaSolicitudCambios',
        {
            codigoAdenda: iCodAdenda,
        },
        function (resultado) {
            MostrarLoading(false);

            if (resultado == null) {
                MensajeError('Servidor devolvió SIN DATOS');
                return;
            }

            console.log(resultado);

            var fecha = new Date();
            $('#txtFechaRegistroSolicitudCambios').val(
                fecha.getFullYear() + '/' +
                ('0' + fecha.getMonth()).slice(-2) + '/' +
                ('0' + fecha.getDate()).slice(-2)
            );

            $('#txtNroSolicitudCambios').val(resultado.numeroSolicitud);
            $('#txtNombreContratoSolicitudCambios').val(resultado.nombreContrato);
            $('#txtNombreAdendaSolicitudCambios').val(resultado.nombreAdenda);
            $('#txtRazonSocialSolicitudCambios').val(resultado.cliente);
            $('#txtRucDniSolicitudCambios').val(resultado.rucDni);

            if (resultado.codigoControversia > 0) {
                $('#chkControversiaAsociada').data('toggles').toggle(true);
            } else {
                $('#chkControversiaAsociada').data('toggles').toggle(false);
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos al servicio web');
        });
});

$('#btnGuardarSolicitudCambios').off().on('click', function () {
    var iCodAdenda = $('#txtNroAdendaSolicitudCambios').attr('iCodAdenda');

    if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0) {
        MensajeError('Sin Contrato & Adenda seleccionada');
        return;
    }

    var arrayClausulas = [],
        detalle = '',
        sw = false;

    $('#tablaCausulasAModificar tbody tr input[type="checkbox"]').each(function (index, control) {
        if ($(control).is(':checked')) {
            detalle = $(control).parent().next().find('textarea').val().trim();
            if (!detalle) {
                sw = true;
                MensajeError('Debe agregar una observación a la cláusula ' + $(control).parent().prev().text());
                return false;
            }
            arrayClausulas.push({
                numeroClausula: $(control).attr('numeroclausula'),
                detalle: detalle
            });
        }
    });

    if (sw)
        return;

    if (arrayClausulas.length == 0) {
        MensajeError('Debe selecionar alguna cláusula');
        return;
    }

    MensajeConfirmar('¿Está seguro que desea guardar la solicitud de cambio?', function () {

        MostrarLoading(true, 'Registrando Solicitud de Cambios, un momento por favor...');

        QueryAJAX('indraupc/registrarSolicitudCambios',
            {
                codigoAdenda: iCodAdenda,
            },
            function (resultado) {

                if (resultado == null) {
                    MostrarLoading(false);
                    MensajeError('Servidor devolvió SIN DATOS');
                    return;
                }

                if (resultado <= 0) {
                    MensajeError('Error al guardar solicitud de cambios');
                    return;
                }

                console.log('numero solicitud:', resultado);

                guardarClausulasRecursivo(0, arrayClausulas, resultado, '');
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para conectarnos al servicio web');
            });
    });
});

function guardarClausulasRecursivo(index, data, codigoSolicitud, errores, modificar) {
    if (index < data.length) {

        QueryAJAX('indraupc/registrarClausulaSolicitudCambios',
            {
                codigoSolicitud: codigoSolicitud,
                numeroClausula: data[index].numeroClausula,
                detalle: data[index].detalle
            },
            function (resultado) {
                if (resultado == null) {
                    errores += 'No se pudo guardar la Cláusula ' + data[index].numeroClausula + '<br/>';
                } else if (resultado <= 0) {
                    errores += 'No se pudo guardar la Cláusula ' + data[index].numeroClausula + '<br/>';
                }

                console.log('numero ID CLAUSULA:', resultado);

                index++;
                guardarClausulasRecursivo(index, data, codigoSolicitud, errores, modificar);
            },
            function (error) {
                errores += 'No se pudo conectar con el servicio para  guardar la Cláusula ' + data[index].numeroClausula + '<br/>';
                index++;
                guardarClausulasRecursivo(index, data, codigoSolicitud, errores, modificar);
            });
    } else {
        MostrarLoading(false);

        if (errores)
            MensajeError('Se produjeron los siguientes errores:<br/>' + errores);
        else {

            if (modificar == undefined)
                MensajeOk('Solicitud de Cambios', 'Se guardó la solicitud de cambios');
            else
                MensajeOk('Solicitud de Cambios', 'Se guardó modificación de la solicitud de cambios');

        }

        $('#btnCancelarSolicitudCambios').trigger('click');

    }
}

$('#btnCancelarSolicitudCambios').off().on('click', function () {
    $('#hcodigoSolicitud').val('0');
    $('#CarruselModuloSolicitudCambios').carousel(0);
});


$('#btnModificarRegistroSolicitudCambios').off().on('click', function () {
    MensajeConfirmar('¿Está seguro que desea modificar la solicitud de cambio?', function () {

        MostrarLoading(true, 'Guardando cambios, un momento por favor');

        var codigoSolicitud = $('#hcodigoSolicitud').val();


        var arrayClausulas = [],
            detalle = '',
            sw = false;

        $('#tablaCausulasAModificar tbody tr input[type="checkbox"]').each(function (index, control) {
            if ($(control).is(':checked')) {
                detalle = $(control).parent().next().find('textarea').val().trim();
                if (!detalle) {
                    sw = true;
                    MensajeError('Debe agregar una observación a la cláusula ' + $(control).parent().prev().text());
                    return false;
                }
                arrayClausulas.push({
                    numeroClausula: $(control).attr('numeroclausula'),
                    detalle: detalle
                });
            }
        });

        if (sw)
            return;

        if (arrayClausulas.length == 0) {
            MensajeError('Debe selecionar alguna cláusula');
            return;
        }

        QueryAJAX('indraupc/modificarSolicitudCambio',
            {
                codigoSolicitud: codigoSolicitud,
            },
            function (resultado) {
                if (resultado == null) {
                    MensajeError('Servidor devolvió Sin Datos');
                } else if (resultado <= 0)
                    MensajeError('Error al modificar solicitud');
                else
                    guardarClausulasRecursivo(0, arrayClausulas, codigoSolicitud, '', true);
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para comunicarnos con el servicio web');
            });
    });
});

$('#btnEliminarRegistroSolicitudCambios').off().on('click', function () {
    MensajeConfirmar('¿Está seguro que desea eliminar la solicitud de cambio?', function () {

        MostrarLoading(true, 'Eliminando solicitud, un momento por favor');

        var codigoSolicitud = $('#hcodigoSolicitud').val();

        QueryAJAX('indraupc/eliminarSolicitudCambio',
            {
                codigoSolicitud: codigoSolicitud,
            },
            function (resultado) {
                MostrarLoading(false);

                if (resultado == null) {
                    MensajeError('Servidor devolvió Sin Datos');
                } else if (resultado <= 0)
                    MensajeError('Error al modificar solicitud');
                else {
                    MensajeOk('Solicitud de Cambios', 'Se eliminó solicitud de cambios');
                    $('#btnCancelarSolicitudCambios').trigger('click');
                }
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para comunicarnos con el servicio web');
            });
    });
});