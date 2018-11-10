//var iCodUsuarioLogeado = 102;//ERNESTO ADOLFO GUTIERREZ
var iCodUsuarioLogeado = 106;//PEDRO GABRIEL RAMOS INJANTE
var swFirmasCompletadas = false;

function PageInitFirmas() {

    $('.tabsholder4').cardTabs({ theme: 'wiki' });

    /*CONFIGURACIONES DE TAMAÑO*/
    $('div.carousel-item').css('height', $(document).height() - 130);

    $('#CarruselModuloFirmas').css('height', $('div.carousel-item').height() - 55);

    $('div.tabContenedor').css('height', $('#CarruselModuloFirmas').height() - 15);
    // With options (defaults shown below)
    $('.toggle').toggles({
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

    GenerarGrillaClientesAdendas();
}
function GenerarGrillaClientesAdendas() {
    var alto = $(document).height() - 340;
    jQuery('#tablaFirmas').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'codigoAdenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'center', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'Codigo Contrato', name: 'codigoContrato', index: 'codigoContrato', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Adenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Ruc/Dni', name: 'rucDni', index: 'rucDni', align: 'center', width: 100, hidden: false, sortable: false, resizable: false },
            { label: 'Cliente', name: 'cliente', index: 'cliente', align: 'left', width: 200, hidden: false, sortable: false, resizable: false },
            { label: 'Área Responsable', name: 'area', index: 'area', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre Contrato', name: 'nombreContrato', index: 'nombreContrato', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre Adenda', name: 'nombreAdenda', index: 'nombreAdenda', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            {
                label: 'Estado', name: 'estadoAdenda', index: 'estadoAdenda', align: 'center', width: 150, hidden: false, sortable: false, resizable: false,
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
            },
            { label: 'Observación', name: 'observacion', index: 'observacion', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
        ],
        rowNum: 10000,
        shrinkToFit: false,
        width: null,
        height: alto,
        rownumbers: true,
        rownumWidth: 30,
        rowList: [15, 50, 100, 200, 300, 500],
        scroll: true,
        pager: '#pagertablaFirmas',
        gridview: true,
        ignoreCase: true,
        viewrecords: true,
        sortable: true,

        onSelectRow: function (rowid, iRow, iCol, e) {
            var registro = jQuery(this).jqGrid('getRowData', rowid);

            if (registro.estadoAdenda == 'EN PROCESO')
                $('#btnSeleccionar').prop('disabled', false);
            else
                $('#btnSeleccionar').prop('disabled', true);
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


PageInitFirmas();

$('#btnAbrirDialogoClienteBuscar').off().on('click', function () {
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

    $('#txtClienteFirmas').val(registro.cliente);
    $('#hCodigoFirmanteSeleccionadoModuloPrincipalFirmas').val(registro.codigoFirmante);
    CloseDialogo('dialogoBuscarCliente');
});

$('#btnBuscarContratosAdendasFirmas').off().on('click', function () {
    var codigoCliente = $('#hCodigoFirmanteSeleccionadoModuloPrincipalFirmas').val().trim();

    if (codigoCliente.length == 0) {
        MensajeError('Debe seleccionar un cliente a buscar');
        return;
    }


    ReloadJQGRID('tablaFirmas', []);

    MostrarLoading(true, 'Buscando Contratos & Adendas por firmar...');

    QueryAJAX('indraupc/buscarFirmasAdendas',
        {
            codCliente: codigoCliente,
            codUsuario: iCodUsuarioLogeado,
        },
        function (result) {
            MostrarLoading(false);

            if (result == null) {
                MensajeError('Servidor devolvió Error de Datos');
                return;
            }

            if (result.length == 0)
                MensajeError('Búsqueda SIN REGISTRO');
            else
                ReloadJQGRID('tablaFirmas', result);
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Se produjo un error al enviar a llamar al servicio')

        });
});

$('#btnSeleccionar').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaFirmas');

    if (registro == null) {
        MensajeError('Debe seleccionar un registro');
        return;
    }

    MostrarLoading(true, 'Buscando Contratos & Adendas por firmar...');

    QueryAJAX('indraupc/seleccionarFirmaAdenda',
        {
            codAdenda: registro.codigoAdenda
        },
        function (data) {
            MostrarLoading(false);
            console.clear();
            console.log(JSON.stringify(data, null, 3));

            if (data == null) {
                MensajeError('Error en la respuesta del Servidor');
                return;
            }

            $('#txtPaisFirma').val(data.contrato.nombrePais);
            $('#txtDepartamentoFirma').val(data.contrato.nombreDepartamento);
            $('#txtProvinciaFirma').val(data.contrato.nombreProvincia);
            $('#txtDistritoFirma').val(data.contrato.nombreDistrito);
            $('#txtTipoContratoFirma').val(data.contrato.tipoContrato == 1 ? 'GENERAL' : 'SERVICIOS').attr('cTipocontrato', data.contrato.tipoContrato);
            $('#txtTipoServicioFirma').val(data.contrato.nombreTipoServicio);
            $('#txtNombreProyectoFirma').val(data.contrato.nombreProyecto);
            $('#txtNombreAdendaFirma').val(data.contrato.nombreAdenda).attr('nombreContrato', data.contrato.nombreContrato);
            $('#txtNumeroAdendaFirma').val(data.contrato.numeroAdenda).attr('iCodAdenda', data.contrato.codigoAdenda);
            $('#txtRazonSocialClienteFirma').val(data.contrato.cliente);
            $('#txtRucDniFirma').val(data.contrato.rucDni);
            $('#txtDomicilioFirma').val(data.contrato.direccion);
            $('#txtActividadFirma').val(data.contrato.area);

            if (data.contrato.rutaAdenda) {
                var html = '<tr class="text-center">' +
                    '<td>1</td>' +
                    '<td class="text-left">' + data.contrato.rutaAdenda + '</td>' +
                    '<td>-</td>' +
                    '<td>-</td>' +
                    '<td><i class="far fa-trash-alt cursor text-danger eliminarFoto disabled"></i></td>' +
                    '</tr>';

                $('#tablaDocumentos tbody').html(html);

                $('#btnCargarDocumentoFirmas').prop('disabled', true);
            }

            var totalFirmantes = 0;
            var check;
            var sw = false;
            for (var i = 0; i < data.firmante.length; i++) {
                switch (data.firmante[i].perfil) {
                    case 'CLIENTE':
                        $('#txtDniClienteFirmante').val(data.firmante[i].dni);
                        $('#txtNombreClienteFirmante').val(data.firmante[i].cliente);

                        check = $('#chkDniCliente');
                        if (data.firmante[i].estado == 3) {
                            check.data('toggles').toggle(true);
                            check.toggleClass('disabled', true);
                            totalFirmantes++;
                        } else {
                            check.data('toggles').toggle(false);
                            check.toggleClass('disabled', false);
                        }
                        break;
                    case 'APODERADO':
                        $('#txtDniApoderado').val(data.firmante[i].dni);
                        $('#txtNombreApoderado').val(data.firmante[i].cliente);

                        check = $('#chkDnApoderado');
                        if (data.firmante[i].estado == 3) {
                            check.data('toggles').toggle(true);
                            check.toggleClass('disabled', true);
                            $('#contenedorFirmaApoderado').show();
                            totalFirmantes++;

                            if (data.firmante[i].codigoFirmante == iCodUsuarioLogeado) {
                                sw = true;
                            }

                        } else {
                            $('#contenedorFirmaApoderado').hide();
                            check.data('toggles').toggle(false);
                            check.toggleClass('disabled', false);
                        }


                        break;
                    default:
                        $('#txtDniGerente').val(data.firmante[i].dni);
                        $('#txtNombreGerente').val(data.firmante[i].cliente);

                        check = $('#chkDniGerente');
                        if (data.firmante[i].estado == 3) {
                            check.data('toggles').toggle(true);
                            check.toggleClass('disabled', true);

                            $('#contenedorFirmaGerente').show();
                            totalFirmantes++;

                            if (data.firmante[i].codigoFirmante == iCodUsuarioLogeado) {
                                sw = true;
                            }
                        } else {
                            $('#contenedorFirmaGerente').hide();

                            check.data('toggles').toggle(false);
                            check.toggleClass('disabled', false);

                        }

                }
            }

            if (totalFirmantes == data.firmante.length) {
                $('#divContenerInputsAdenda').find('div.card-tabs-bar a:eq(2)').removeClass('disabled');
                $('#btnFirmarFirmaAdenda').hide();
                $('#btnGuardarFirmaAdenda').show();
                $('#btnGuardarFirmaAdenda').prop('disabled', false);

                swFirmasCompletadas = true;
            } else {
                $('#divContenerInputsAdenda').find('div.card-tabs-bar a:eq(2)').addClass('disabled');
                $('#btnFirmarFirmaAdenda').show();
                $('#btnFirmarFirmaAdenda').prop('disabled', false);
                $('#btnGuardarFirmaAdenda').hide();

                swFirmasCompletadas = false;
            }

            if (sw) {
                $('#btnFirmarFirmaAdenda').prop('disabled', true);
            }

            $('#titleOpcion').html('FIRMAR CONTRATO & ADENDA');
            $('div.card-tabs-bar a:not(:first)').show();
            $('#CarruselModuloFirmas').carousel(1);
        },
        function (data) {
            MostrarLoading(false);
            MensajeErr | or('Se produjo un error al llamar al servicio')
        });
});

$('#btnFirmarFirmaAdenda').off().on('click', function () {
    var checkClientes = $('#chkDniCliente').data('toggles');

    if (checkClientes.active == false) {
        if ($('#contenedorFirmaApoderado').is(':visible') || $('#contenedorFirmaGerente').is(':visible')) {
            MensajeError('Debe seleccionar la firma del cliente');
            return;
        }
    }

    MensajeConfirmar('¿Está seguro que desea firmar la Adenda ' + $('#txtNumeroAdendaFirma').val(), function () {

        MostrarLoading(true, 'Registrando Firma...');

        QueryAJAX('indraupc/firmarContratoAdenda',
            {
                codAdenda: $('#txtNumeroAdendaFirma').attr('icodadenda'),
                codUsuario: iCodUsuarioLogeado,
                opcionCliente: $('#chkDniCliente').data('toggles').active ? 1 : 0
            },
            function (resultado) {
                MostrarLoading(false);

                if (resultado <= 0) {
                    MensajeError('Problemas para realizar la firma');
                    return;
                } else if (resultado > 0) {

                    if (checkClientes.active == true) {
                        if ($('#contenedorFirmaApoderado').is(':visible') || $('#contenedorFirmaGerente').is(':visible')) {
                            $('#contenedorFirmaApoderado,#contenedorFirmaGerente').show();

                            var check = $('#chkDnApoderado');

                            $('#chkDniCliente').toggleClass('disabled', true);

                            check.data('toggles').toggle(true);
                            check.toggleClass('disabled', true);

                            check = $('#chkDniGerente');
                            check.data('toggles').toggle(true);
                            check.toggleClass('disabled', true);

                            $('#btnFirmarFirmaAdenda').hide();
                            $('#btnGuardarFirmaAdenda').show().prop('disabled', false);

                            $('#divContenerInputsAdenda').find('div.card-tabs-bar a:eq(2)').removeClass('disabled');
                        }
                    } else {
                        $('#btnCancelarFirmaAdenda').trigger('click');
                    }

                    MensajeOk('Firmar Adenda', 'Se realizó la firma del documento correctamente');
                }
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para conectarnos con el servicio');
            });
    });
});

$('#btnGuardarFirmaAdenda').off().on('click', function () {
    if (!fileSeleccionado) {
        MensajeError('Debe seleccionar un documento a subir');
        return;
    }

    MensajeConfirmar('¿Está seguro que desea guardar el documento?', function () {

        var formularioEnviar = new FormData();
        formularioEnviar.append("codAdenda", $('#txtNumeroAdendaFirma').attr('icodadenda'));
        formularioEnviar.append('documento', fileSeleccionado);

        MostrarLoading(true, 'Guardando...');

        $.ajax({
            url: urlRest + 'indraupc/guardarFirmaContratoAdenda',
            type: "POST",
            data: formularioEnviar,
            async: false,
            success: function (data) {
                MostrarLoading(false);

                console.log('data', data);
            },
            error: function (data) {
                MostrarLoading(false);
                console.log('error', data);
            },
            cache: false,
            contentType: false,
            processData: false
        });
    });
});

$('#btnCargarDocumentoFirmas').off().on('click', function () {
    $('#fileUpload').click();
});
var fileSeleccionado;
$('#fileUpload').off().on('change', function () {
    fileSeleccionado = $(this)[0].files[0];
    //alert(fileSeleccionado.name);
    var html = '<tr class="text-center">' +
        '<td>1</td>' +
        '<td class="text-left">' + fileSeleccionado.name + '</td>' +
        '<td>-</td>' +
        '<td>-</td>' +
        '<td><i class="far fa-trash-alt cursor text-danger eliminarFoto"></i></td>' +
        '</tr>';

    $('#tablaDocumentos tbody').html(html);
});

$('#tablaDocumentos tbody').off().on('click', 'i.eliminarFoto', function () {
    $(this).closest('tr').remove();
    fileSeleccionado = undefined;
});


$('#btnCancelarFirmaAdenda').off().on('click', function () {
    $('#CarruselModuloFirmas').carousel(0);
    $('#btnFirmarFirmaAdenda').prop('disabled', false);
    $('div.card-tabs-bar a:first').click();
});

$('#btnObservarFirmaAdenda').off().on('click', function () {

    $('#txtNombreContratoObservar').val($('#txtNombreAdendaFirma').attr('nombreContrato'));
    $('#txtClienteObservar').val($('#txtRazonSocialClienteFirma').val());
    $('#txtMotivoObservacionObservar').height($('#CarruselModuloFirmas').height() - 140);

    OpenDialogo('dialogoObservarFirma', function () {
        $('#txtMotivoObservacionObservar').focus();
    }, undefined, function () {
        $('#txtMotivoObservacionObservar').val('');
    });

});

$('#btnGuardarObservacion').off().on('click', function () {
    var observacion = $('#txtMotivoObservacionObservar').val().trim();

    if (!observacion) {
        MensajeError('Debe ingresar una observación');
        return;
    }

    MensajeConfirmar('¿Está seguro que desea observar la adenda' + $('#txtNumeroAdendaFirma').val(), function () {

        MostrarLoading(true, 'Observando documento...');

        QueryAJAX('indraupc/observarAdendaFirmar',
            {
                codAdenda: $('#txtNumeroAdendaFirma').attr('icodadenda'),
                codUsuario: iCodUsuarioLogeado,
                observacion: observacion
            },
            function (resultado) {
                MostrarLoading(false);

                if (resultado <= 0) {
                    MensajeError('Problemas para observar el documento');
                    return;
                } else if (resultado > 0) {
                    CloseDialogo('dialogoObservarFirma');
                    MensajeOk('Adenda Observada', 'Se observó adenda correctamente');
                    $('#btnCancelarFirmaAdenda').trigger('click');

                    $('#btnBuscarContratosAdendasFirmas').trigger('click');
                }
            },
            function (error) {
                MostrarLoading(false);
                MensajeError('Problemas para conectarnos con el servicio');
            });
    });


});


function generarNombreUnico() {
    var fechaActual = new Date();
    return 
        ('0' + fechaActual.getDate()).slice(-2) + '_' +
        ('0' + fechaActual.getMonth()).slice(-2) + '_' +
        fechaActual.getFullYear();
}

alert(generarNombreUnico());
