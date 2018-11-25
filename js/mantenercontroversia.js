function PageInitControversia() {
    GenerarGrillaClientesControversias();
    //$('.tabsholder4').cardTabs({ theme: 'wiki' });

    //$('div[data-tab]').css('height', $(document).height() - 255);

    $('#txtFechaInicioModuloPrincipal, #txtFechaFinalModuloPrincipal').off().on('keydown', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).datetimepicker({
        timepicker: false,
        format: 'Y-m-d',
    });

    /*
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
            MensajeError('Error al recuperar los datos');
            $('#btnNuevoControversia,#btnConsultarControversia,#btnModificarControversia,#btnEliminarControversia').off().prop('disabled', true);
        });*/

}

$('#btnNuevoControversia').off().on('click', function () {
    $('#btnGuardarModificacionControversia,#btnGuardarEliminarControversia').hide();
    $('#btnGuardarControversia').show();
    $('#CarruselModuloControversia').carousel(1);
    $('div.card-tabs-bar a:not(:first)').hide();

    //$('#txtTipoDocumentoControversia').val('');
    $('#txtDescripcionControversia').val('').prop('disabled', false);
    $('#txtNumeroPaginaControversia').val(null).prop('disabled', false);
    $('#txtNroClausulaControversia').val(null).prop('disabled', false);

    $('#txtFechaRegistroControversia').off().on('keydown', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).datetimepicker({
        timepicker: false,   
        value: new Date(),     
        format: 'Y-m-d',
    });
    
    
});





function ConsultarAdenda(iCodContrato, iCodAdenda, callBack, evento) {
    MostrarLoading(true, 'Recuperando Datos de Adenda...');


    QueryAJAX('indraupc/buscarxContAdenda',
        {
            codContrato: iCodContrato,
            codAdenda: iCodAdenda
        },
        function (resultado) {

            console.log(resultado);

            if (resultado == null || !resultado) {
                MostrarLoading(false);
                MensajeError('Problemas con el servidor, devolvió NULL');
                return;
            }

            /*if (resultado.contrato.nombreAdenda == null) {
                MostrarLoading(false);
                MensajeError('No se encontró el detalle de la adenda buscada');
                return;
            }*/

            try {

                callBack();

                MostrarLoading(false);

                $('#txtNroControversiaControversia').val(resultado[0].codControversia);

                //$('#txtNombreContratoControversia').val(resultado.contrato.tipoContrato == 1 ? 'GENERAL' : 'SERVICIOS').attr('cTipocontrato', resultado.contrato.tipoContrato);                
                $('#txtNombreContratoControversia').val(resultado[0].nombreContrato);
                $('#txtNombreAdendaControversia').val(resultado[0].nombreAdenda);
                $('#txtRazonSocialClienteControversia').val(resultado[0].desFirmanteContrato);
                $('#txtRucDniControversia').val(resultado[0].rucFirmanteContrato);


                $('#txtTipoDocumentoControversia').val('DNI');
                $('#txtNumeroDocumentoControversia').val(resultado[0].dniFirmante);
                $('#txtNombresApellidosControversia').val(resultado[0].nombreFirmante);
                $('#txtTelefonoControversia').val(resultado[0].fonoFirmante);
                $('#txtDireccionControversia').val(resultado[0].direcFirmante);
                $('#txtEmailControversia').val(resultado[0].emailFirmante);


            } catch (e) {
                MostrarLoading(false);
                MensajeError('Se produjo un error con la data recibida del servidor');
                //$('#btnVistaPreviaAdenda').parent().find('button').prop('disabled', true);
                $('#btnCancelarControversia').prop('disabled', false);
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos con el servicio web');
        });
}

function ConsultarControversia(icodControversia, icodFirmanteControversia, callBack, evento) {
    MostrarLoading(true, 'Recuperando Datos de Controversia...');
    QueryAJAX('indraupc/consultarControversia',
        {
            codControversia: icodControversia,
            idFirmanteContrato: icodFirmanteControversia
        },
        function (resultado) {

            console.log(resultado);

            if (resultado == null || !resultado) {
                MostrarLoading(false);
                MensajeError('Problemas con el servidor, devolvió NULL');
                return;
            }

            /*if (resultado.contrato.nombreAdenda == null) {
                MostrarLoading(false);
                MensajeError('No se encontró el detalle de la adenda buscada');
                return;
            }*/

            try {

                callBack();

                MostrarLoading(false);


                $('#txtFechaRegistroControversia').val(resultado[0].fechaRegistro);
                $('#txtNroControversiaControversia').val(resultado[0].codControversia);

                $('#txtNroContratoControversia').val(resultado[0].numContrato);
                $('#txtNroAdendaControversia').val(resultado[0].numAdenda);


                //$('#txtNombreContratoControversia').val(resultado.contrato.tipoContrato == 1 ? 'GENERAL' : 'SERVICIOS').attr('cTipocontrato', resultado.contrato.tipoContrato);                
                $('#txtNombreContratoControversia').val(resultado[0].nombreContrato);
                $('#txtNombreAdendaControversia').val(resultado[0].nombreAdenda);
                $('#txtRazonSocialClienteControversia').val(resultado[0].desFirmanteContrato);
                $('#txtRucDniControversia').val(resultado[0].rucFirmanteContrato);

                $('#txtTipoDocumentoControversia').val('DNI');
                $('#txtNumeroDocumentoControversia').val(resultado[0].dniFirmante);
                $('#txtNombresApellidosControversia').val(resultado[0].nombreFirmante);
                $('#txtTelefonoControversia').val(resultado[0].fonoFirmante);
                $('#txtDireccionControversia').val(resultado[0].direcFirmante);
                $('#txtEmailControversia').val(resultado[0].emailFirmante);


                $('#txtDescripcionControversia').val(resultado[0].descripcionControversia);
                $('#txtNumeroPaginaControversia').val(resultado[0].numPagina);
                $('#txtNroClausulaControversia').val(resultado[0].numClausula);


            } catch (e) {
                MostrarLoading(false);
                MensajeError('Se produjo un error con la data recibida del servidor');
                $('#btnVistaPreviaAdenda').parent().find('button').prop('disabled', true);
                $('#btnCancelarControversia').prop('disabled', false);
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos con el servicio web');
        });
}

function GenerarGrillaClientesControversias() {
    var alto = $(document).height() - 340;
    jQuery('#tablaClientesControversias').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'id', name: 'IdRegistro', index: 'IdRegistro', align: 'left', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'Codigo Contrato', name: 'codContrato', index: 'codContrato', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Adenda', name: 'codAdenda', index: 'codAdenda', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Controversia', name: 'codControversia', index: 'codControversia', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Codigo Firmante', name: 'codFirmanteControversia', index: 'codFirmanteControversia', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Cliente', name: 'nomCliente', index: 'nomCliente', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Contrato', name: 'nomContrato', index: 'nomContrato', align: 'left', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Fecha Inicio', name: 'fechaRegistro', index: 'fechaRegistro', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            { label: 'Fecha Finalización', name: 'fechaAprobacion', index: 'fechaAprobacion', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            { label: 'Últ.Fecha Modif.', name: 'fechaUltimaMod', index: 'fechaUltimaMod', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            {
                label: 'Estado', name: 'estado', index: 'estado', align: 'center', width: 120, hidden: false, sortable: false, resizable: false,
                cellattr: function (rowId, val, rawObject, cm, rdata) {
                    var stylo = '';
                    switch (val) {
                        case 'INICIADO':
                            stylo = 'color:blue;';
                            break;
                        case 'APROBADO':
                            stylo = 'color:green;font-weight: bold;';
                            break;
                        case 'RECHAZADO':
                            stylo = 'color:red;';
                            break;
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
        pager: '#pagertablaClientesControversias',
        gridview: true,
        ignoreCase: true,
        viewrecords: true,
        sortable: true,

        onSelectRow: function (rowid, iRow, iCol, e) {
            var registro = jQuery(this).jqGrid('getRowData', rowid);
            switch (registro.estado) {
                case 'INICIADO':
                    $('#btnEliminarControversia,#btnModificarControversia').prop('disabled', false);
                    break;
                case 'APROBADO':
                    $('#btnEliminarControversia,#btnModificarControversia').prop('disabled', true);
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

PageInitControversia();


$('#btnBuscarDialogoContratoAdenda').off().on('click', function () {
    var $tabla = $('#tablaBusquedaContratosDialogo');
    $tabla.hideCol('numeroSolicitud');
    $tabla.hideCol('codigoControversia');
    $tabla.hideCol('estadoSolicitud');

    OpenDialogo('dialogoBuscarContrato', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {

        var $tabla = $('#tablaBusquedaContratosDialogo');

        tabla.showCol('numeroSolicitud');
        tabla.showCol('codigoControversia');
        tabla.showCol('estadoSolicitud');


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
    if (registro == null) {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }
    /*LA ADENDA DEBE ESTAR APROBADA*/
    /*if (registro.estadoAdenda != 'APROBADO') {
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
    }*/

    /*$('#txtNroContratoControversia').val(registro.numeroContrato).attr({
        'iCodContrato': registro.codigoContrato,
        'nombreContrato': registro.nombreContrato
    });*/

    console.log(registro)
    $('#txtNroContratoControversia').val(registro.numeroContrato).attr('iCodContrato', registro.codigoContrato);
    $('#txtNroAdendaControversia').val(registro.numeroAdenda).attr('iCodAdenda', registro.codigoAdenda);
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

$('#btnCancelarControversia').off().on('click', function () {
    $('#divContenerInputsControversia input').val('');
    $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').show();

    $('#CarruselModuloControversia').carousel(0);
    $('div.card-tabs-bar a:not(:first)').show();
    $('div.card-tabs-bar a:first').click();
});

$('#btnBuscarContratoAdenda').off().on('click', function () {
    var iCodContrato = $('#txtNroContratoControversia').attr('iCodContrato');
    var iCodAdenda = $('#txtNroAdendaControversia').attr('iCodAdenda');

    //---------------------------------------------------------
    //$('#txtNroContratoAdenda').attr('icodcontrato', 21);
    //iCodAdenda = 20;
    //---------------------------------------------------------

    if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0) {
        MensajeError('Sin Contrato & Adenda a buscar');
        return;
    }
    ConsultarAdenda(iCodContrato, iCodAdenda, function () {
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

$('#btnGuardarControversia').off().on('click', function () {
    var codAdenda = $('#txtNroAdendaControversia').attr('icodAdenda'),
        dniCliente = $('#txtNumeroDocumentoControversia').val(),
        desControversia = $('#txtDescripcionControversia').val().trim(),
        numeroPaginas = $('#txtNumeroPaginaControversia').val().trim(),
        numeroClausulas = $('#txtNroClausulaControversia').val().trim()


    /*if (typeof icodAdenda == 'undefined' || icodAdenda.length == 0 || icodAdenda == 0) {
        MensajeError('No ha seleccionando ninguna adenda');
        return;
    }*/

    if (!$.isNumeric(numeroPaginas)) {
        MensajeError('Número de páginas debe ser solo números');
        return;
    }
    numeroPaginas = parseFloat(numeroPaginas)
    if (numeroPaginas <= 0) {
        MensajeError('Número de páginas no puede ser menor o igual a cero (0)');
        return;
    }

    if (!$.isNumeric(numeroClausulas)) {
        MensajeError('Número de cláusulas debe ser solo números');
        return;
    }
    numeroClausulas = parseFloat(numeroClausulas)
    if (numeroClausulas <= 0) {
        MensajeError('Número de cláusulas no puede ser menor o igual a cero (0)');
        return;
    }


    if ($('#txtDescripcionControversia').val().trim().length == 0) {
        MensajeError('La descripción no puede estar vacío');
        return;
    }

    MensajeConfirmar('¿Desea guardar la nueva controversia?',
        function () {
            MostrarLoading(true, 'Regitrando Controversia...');

            QueryAJAX('indraupc/registrarControversia',
                   {
                        dniCliente: dniCliente,
                        codAdenda: codAdenda,
                        desControversia: desControversia,
                        numeroPaginas: numeroPaginas,
                        numeroClausulas: numeroClausulas
                   },
                   function (resultado) {

                       if (resultado <= 0) {
                           MostrarLoading(false);
                           MensajeError('No se pudo registrar la controversia en el servidor');
                           return;
                       }

                       MostrarLoading(false);

                       if (resultado==1){
                            MensajeError('Número de páginas no válida');
                       }else if(resultado==2){
                            MensajeError('Número de cláusula no válida');    
                       }else if(resultado==3){
                        MensajeError('Ya existe controversia para la adenda');    
                        }else{
                            MensajeOk('Controversia creada',
                            'Se registró la Controversia correctamente',
                            function () {
                                $('#btnCancelarControversia').trigger('click');
                                setTimeout(function () {
                                    $('#btnBuscarControversiasModuloPrincipal').trigger('click');
                                }, 1000)
                            });
                        }

                       

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

$('#btnBuscarControversiasModuloPrincipal').off().on('click', function () {
    var /*fechaInicial = $('#txtFechaInicioModuloPrincipal').val().trim(),
        fechaFinal = $('#txtFechaFinalModuloPrincipal').val().trim(),*/
        nombreContrato = $('#txtNombreContratoModuloPrincipalControversia').val().trim(),
        estadoControversia = $('#cboEstadoModuloPrincipalControversia').val();

    /*if (typeof codigoCliente == 'undefined') {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }*/

    /*if (fechaInicial.length == 0)
        fechaInicial = '1900-01-01';

    if (fechaFinal.length == 0)
        fechaFinal = '2020-01-01';*/
    MostrarLoading(true, 'Buscando Controversia, un momento por favor...');


    QueryAJAX('indraupc/buscarControversia',
        {
            /*fechaIni: fechaInicial,
            fechaFin: fechaFinal,*/
            estado: estadoControversia,
            nomContrato: nombreContrato
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

            ReloadJQGRID('tablaClientesControversias', resultado);
        },
        function (error) {
            alert('Error');
            MostrarLoading(false);


        });
});

$('#btnConsultarControversia').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesControversias');

    if (registro == null) {
        MensajeError('Debe seleccionar una Controversia');
        return;
    }

    ConsultarControversia(registro.codControversia, registro.codFirmanteControversia, function () {

        $('#titleOpcion').html('CONSULTAR CONTROVERSIA');
        $('#btnGuardarControversia,#btnGuardarModificacionControversia,#btnGuardarEliminarControversia').hide();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();

        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloControversia').carousel(1);

        $('#txtDescripcionControversia').prop('disabled', true);
        $('#txtNumeroPaginaControversia').prop('disabled', true);
        $('#txtNroClausulaControversia').prop('disabled', true);
    });
});

$('#btnModificarControversia').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesControversias');

    if (registro == null) {
        MensajeError('Debe seleccionar una Controversia');
        return;
    }

    if (registro.estado == 'APROBADO') {
        MensajeError('No se puede modificar la controversia, ya fue aprobada');
        return;
    }

    if (registro.estado == 'RECHAZADO') {
        MensajeError('No se puede modificar la controversia, ya fue rechazada');
        return;
    }

    ConsultarControversia(registro.codControversia,registro.codFirmanteControversia, function () {

        $('#titleOpcion').html('MODIFICAR ADENDA');
        $('#btnGuardarControversia,#btnGuardarEliminarControversia').hide();
        $('#btnGuardarModificacionControversia').show();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();


        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloControversia').carousel(1);

        $('#txtDescripcionControversia').prop('disabled', false);
        $('#txtNumeroPaginaControversia').prop('disabled', false);
        $('#txtNroClausulaControversia').prop('disabled', false);
    });

});

$('#btnEliminarControversia').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesControversias');

    if (registro == null) {
        MensajeError('Debe seleccionar una Controversia');
        return;
    }

    if (registro.estado == 'APROBADO') {
        MensajeError('No se puede modificar la controversia, ya fue aprobada');
        return;
    }

    if (registro.estado == 'RECHAZADO') {
        MensajeError('No se puede modificar la controversia, ya fue rechazada');
        return;
    }

    console.log(registro.codigoAdenda);
    ConsultarControversia(registro.codControversia, registro.codFirmanteControversia, function () {


        $('#titleOpcion').html('ELIMINAR CONTROVERSIA');
        $('#btnGuardarControversia,#btnGuardarModificacionControversia').hide();
        $('#btnGuardarEliminarControversia').show();
        $('#btnBuscarContratoAdenda,#btnBuscarDialogoContratoAdenda').hide();

        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloControversia').carousel(1);
    });
});


$('#btnGuardarModificacionControversia').off().on('click', function () {
    var iCodControversia = $('#txtNroControversiaControversia').val(),
        desControversia = $('#txtDescripcionControversia').val().trim(),
        numeroPaginas = $('#txtNumeroPaginaControversia').val().trim(),
        numeroClausulas = $('#txtNroClausulaControversia').val().trim();

    if (desControversia.length == 0) {
        MensajeError('La descripción no puede estar vacío');
        return;
    }

    if (!$.isNumeric(numeroPaginas)) {
        MensajeError('Número de Página debe ser solo números');
        return;
    }

    if (!$.isNumeric(numeroClausulas)) {
        MensajeError('Número de Cláusula debe ser solo números');
        return;
    }

    MensajeConfirmar('¿Desea modificar la controversia?',
        function () {
            MostrarLoading(true, 'Modificando Controversia...');

            QueryAJAX('indraupc/modificarControversia',
                {
                    codControversia: iCodControversia,
                    desControversia: desControversia,
                    numeroPaginas: numeroPaginas,
                    numeroClausulas: numeroClausulas
                },
                function (resultado) {

                    if (resultado <= 0) {
                        MostrarLoading(false);
                        MensajeError('No se pudo modificar controversia en el servidor');
                        return;
                    }

                    MostrarLoading(false);

                    MensajeOk('Controversia Modificada',
                        'Se modificó la Controversia correctamente',
                        function () {
                            $('#btnCancelarControversia').trigger('click');
                            setTimeout(function () {
                                $('#btnBuscarControversiasModuloPrincipal').trigger('click');
                            }, 1000)
                        });

                },
                function (error) {
                    MostrarLoading(false);
                    MensajeError('Problemas para conectarnos con el servicio');
                });
        });
});

$('#btnGuardarEliminarControversia').off().on('click', function () {
    MensajeConfirmar('¿Desea realmente eliminar la controversia?',
        function () {
            MostrarLoading(true, 'Eliminando Controversia...');

            var iCodControversia = $('#txtNroControversiaControversia').val();

            /*if (typeof iCodAdenda == 'undefined' || iCodAdenda.length == 0 || iCodAdenda == 0) {
                MensajeError('No ha seleccionando ningún contrato');
                return;
            }*/
            //console.log(iCodControversia)
            QueryAJAX('indraupc/eliminarControversia',
                {
                    codControversia: iCodControversia,
                },
                function (resultado) {
                    MostrarLoading(false);

                    //if (resultado != 1) {
                    if (resultado <= 0) {
                        MensajeError('No se pudo Eliminar la Controversia');
                        return;
                    }
                    MensajeOk('Controversia Eliminada',
                        'Se eliminó la Controversia correctamente',
                        function () {
                            $('#btnCancelarControversia').trigger('click');
                            setTimeout(function () {
                                $('#btnBuscarControversiasModuloPrincipal').trigger('click');
                            }, 1000)
                        });
                },
                function (error) {
                    MostrarLoading(false);
                    MensajeError('Problemas para conectarnos con el servicio');
                });
        });
});


