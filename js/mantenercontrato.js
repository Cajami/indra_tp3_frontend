$('#btnAbrirDialogoClienteBuscar').off().on('click', function () {
    OpenDialogo('dialogoBuscarCliente', function () {
        $('#txtBuscarRucCliente').focus();
    }, undefined, function () {
        $('#txtBuscarRucCliente,#txtBuscarDniCliente,#txtBuscarClienteRazonSocialCliente').val('');
        ReloadJQGRID('tablaClientesDialogo', []);
    });
});

$('tbody').off().on('click', 'tr.registros', function () {
    $(this).parent().find('tr.rowSeleccionado').removeClass('rowSeleccionado');
    $(this).addClass('rowSeleccionado');
});

$('#btnSeleccionarClienteDialogo').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaClientesDialogo');

    if (registro == null) {
        MensajeError('Debe seleccionar un Cliente');
        return;
    }

    $('#txtClienteModuloPrincipalContratos').val(registro.cliente);
    $('#hCodigoFirmanteSeleccionadoModuloPrincipalContratos').val(registro.codigoFirmante);
    CloseDialogo('dialogoBuscarCliente');
});

$('#btnBuscarContratosModuloPrincipal').off().on('click', function () {
    var cFirmante = $('#hCodigoFirmanteSeleccionadoModuloPrincipalContratos').val().trim(),
        fInicio = $('#txtFechaInicioModuloPrincipal').val(),
        fFin = $('#txtFechaFinalModuloPrincipal').val();

    if (cFirmante.length == 0) {
        MensajeError('Debe seleccionar un cliente a buscar');
        return;
    }

    if (fInicio.length == 0) {
        MensajeError('Debe seleccionar Fecha Inicio');
        return
    }

    if (fFin.length == 0) {
        MensajeError('Debe seleccionar Fecha Fin');
        return;
    }

    ReloadJQGRID('tablaIngresoStock', []);

    MostrarLoading(true, 'buscando contratos...');

    QueryAJAX('indraupc/buscarContratos',
       {
           codigoCliente: cFirmante,
           fechaInicio: fInicio,
           fechaFin: fFin
       },
       function (result) {
           MostrarLoading(false);

           if (result == null) {
               MensajeError('Servidor devolvió Error de Datos');
               return;
           }

           if (result.length == 0) {
               MensajeError('Búsqueda SIN REGISTRO');
           } else {
               ReloadJQGRID('tablaIngresoStock', result);
           }
       },
       function (error) {
           MostrarLoading(false);
           MensajeError('Se produjo un error al enviar a llamar al srvicio')

       });
});

function ConsultarContrato(iCodAdenda, callBack) {
    MostrarLoading(true, 'Recuperando Datos de Contrato...');
    QueryAJAX('indraupc/consultarContrato',
       {
           codigoAdenda: iCodAdenda
       },
        function (resultado) {
            MostrarLoading(false);

            console.log(resultado);

            if (resultado == null || !resultado) {
                MensajeError('Problemas con el servidor, devolvió NULL');
                return;
            }

            if (resultado.contrato.nombreContrato == null ) {
                MensajeError('No se encontró el detalle del contrato buscado');
                return;
            }

            try {


                callBack();

                //TAB-PRINCIPAL:
                $('#txtPaisNuevoContrato').val(resultado.contrato.nombrePais);
                $('#txtDepartamentoNuevoContrato').val(resultado.contrato.nombreDepartamento);
                $('#txtProvinciaNuevoContrato').val(resultado.contrato.nombreProvincia);
                $('#txtDistritoNuevoContrato').val(resultado.contrato.nombreDistrito);
                $('#txtTipoContratoNuevoContrato').val(resultado.contrato.tipoContrato == 1 ? 'GENERAL' : 'SERVICIOS').attr('cTipocontrato', resultado.contrato.tipoContrato);

                $('#txtServicioNuevoContrato').val(resultado.contrato.nombreTipoServicio);
                $('#txtNombreContratoNuevoContrato').val(resultado.contrato.nombreContrato);
                $('#txtNumeroContratoNuevoContrato').val(resultado.contrato.numeroContrato);
                $('#txtNombreProyectoNuevoContrato').val(resultado.contrato.nombreProyecto);
                $('#txtRazonSocialClienteNuevoContrato').val(resultado.contrato.cliente);
                $('#txtRucDNIClienteNuevoContrato').val(resultado.contrato.rucDni);
                $('#txtDomicilioNuevoContrato').val(resultado.contrato.direccion);
                $('#txtActividadNuevoContrato').val(resultado.contrato.actividad);

                /*TAB-ANTECEDENTES*/
                var html = '';
                for (var i = 0; i < resultado.antecedentes.length; i++) {
                    html += '<tr>' +
                                '<td><i class="far fa-check-square"></i></td>' +
                                '<td>' + resultado.antecedentes[i].descripcion + '</td>' +
                            '</tr>';
                }
                $('#tableAntecedentesNuevoContrato tbody').html(html);

                /*TAB-MONTO CONTRATADO*/
                $('#txtTipoMonedaNuevoContato').val(resultado.contrato.descripcionTipoMoneda).attr('cTipoMoneda', resultado.contrato.tipoMoneda);
                $('#txtPrecioContractualNuevoContato').val(parseFloat(resultado.contrato.montoContractual).toFixed(2));

                /*TAB-CRONOGRAMA DE ENTREGA*/
                html = '';
                for (var i = 0; i < resultado.cronograma.length; i++) {
                    html += '<tr class="text-center">' +
                                '<td>' + resultado.cronograma[i].numeroEntrega + '</td>' +
                                '<td>' + resultado.cronograma[i].cantidadDias + '</td>' +
                                '<td>' + resultado.cronograma[i].fechaEntrega + '</td>' +
                                '<td class="text-left">' + resultado.cronograma[i].descripcionEntrega + '</td>' +
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
                                '<td>' + resultado.pago[i].numeroCuota + '</td>' +
                                '<td>' + resultado.pago[i].anio + '</td>' +
                                '<td mes="' + resultado.pago[i].mes + '">' + nombreMes(resultado.pago[i].mes) + '</td>' +
                                '<td>' + resultado.pago[i].ultimoDiaPago + '</td>' +
                            '</tr>';
                }

                $('#tablaCuotasNuevoContrato tbody').html(html);
                $('#txtCuotasNuevoContrato').val(resultado.pago.length);

                /*TAB-FIRMAS*/
                for (var i = 0; i < resultado.firmante.length; i++) {
                    if (resultado.firmante[i].perfil == 'CLIENTE') {
                        $('#txtDniClienteFirmanteNuevoContrato').val(resultado.firmante[i].dni).prop('disabled', true);
                        $('#txtNombreClienteFirmanteNuevoContrato').val(resultado.firmante[i].cliente);
                    } else if (resultado.firmante[i].perfil == 'APODERADO') {
                        $('#txtDniApoderadoNuevoContrato').val(resultado.firmante[i].dni).prop('disabled', true);
                        $('#txtNombreApoderadoNuevoContrato').val(resultado.firmante[i].cliente);
                    } else {
                        $('#txtDniGerenteNuevoContrato').val(resultado.firmante[i].dni);
                        $('#cboNombresGerentesNuevoContrato').val(resultado.firmante[i].dni).prop('disabled', true);
                    }
                }
            } catch (e) {
                MostrarLoading(false);
                MensajeError('Se produjo un error con la data recibida del servidor');
                $('#btnVistaPreviaNuevoContrato').parent().parent().find('button').prop('disabled', true);
                $('#btnCancelarNuevoContrato').prop('disabled', false);
            }
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para conectarnos con el servicio web');
        });
}

$('#btnNuevoContrato').off().on('click', function () {
    $('#btnEliminarNuevoContrato').hide();
    $('#btnSubirArchivoRequerimientoPrograma').show();

    $('#titleOpcion').html('NUEVO CONTRATO');
    $('div.card-tabs-bar a:not(:first)').hide();
    $('#CarruselModuloContrato').carousel(1);
});

$('#btnConsultarContrato').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaIngresoStock');

    if (registro == null ) {
        MensajeError('Debe seleccionar un Contrato');
        return;
    }

    ConsultarContrato(registro.codigoAdenda, function () {

        $('#titleOpcion').html('CONSULTAR CONTRATO');
        $('#btnGuardarNuevoContrato,#btnEliminarNuevoContrato').hide();
        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloContrato').carousel(1);
    });

});

$('#btnEliminarContrato').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaIngresoStock');

    if (registro == null) {
        MensajeError('Debe seleccionar un Contrato');
        return;
    }


    ConsultarContrato(registro.codigoAdenda, function () {
        $('#titleOpcion').html('ELIMINAR CONTRATO');

        $('#btnEliminarNuevoContrato').show();
        $('#btnGuardarNuevoContrato').hide();

        $('#iCodigoAdendaNuevoContrato').val(registro.codigoAdenda);

        /*MOSTRAMOS EL DETALLE DEL CONTRATO BUSCADO*/
        $('div.card-tabs-bar a:not(:first)').show();
        $('#CarruselModuloContrato').carousel(1);
    });

});

$('#btnListoImprimirContrato').off().on('click', function () {
    var registro = GetRowSelectJqGrid('tablaIngresoStock');

    if (registro == null) {
        MensajeError('Debe seleccionar un Contrato');
        return;
    }

    MensajeConfirmar('¿Desea cambiar el estado del Contrado "Listo para Imprimir"?',
        function () {
            QueryAJAX('indraupc/habilitarContrato',
            {
                codigoAdenda: registro.codigoAdenda,
            },
                  function (resultado) {

                      if (resultado != 1) {
                          MensajeError('No se pudo cambiar estado de Contrato');
                          return;
                      }
                      MensajeOk('Contrato Enviado',
                          'El contrato se envió correctamente');

                      $('#btnBuscarContratosModuloPrincipal').trigger('click');
                  },
                  function (error) {

                  });
        });
});

$('#btnGuardarNuevoContrato').off().on('click', function () {
    if ($('#hArchivoCorrectoNuevoContrato').val() != 1) {
        MensajeError('Debe cargar un archivo excel');
        return;
    }

    var dataGuardar = {
        dniRucCliente: $('#txtRucDNIClienteNuevoContrato').val().trim(),
        codigoDistrito: $('#txtDistritoNuevoContrato').attr('icodigodistrito'),
        tipoContrato: $('#txtTipoContratoNuevoContrato').attr('ctipocontrato'),
        codigoTipoServicio: $('#txtServicioNuevoContrato').attr('cTipocontrato'),
        nombreContrato: $('#txtNombreContratoNuevoContrato').val().trim(),
        numeroContrato: $('#txtNumeroContratoNuevoContrato').val().trim(),
        nombreProyecto: $('#txtNombreProyectoNuevoContrato').val().trim(),
        tipoMoneda: $('#txtTipoMonedaNuevoContato').attr('ctipomoneda'),
        montoContractual: $('#txtPrecioContractualNuevoContato').val().trim(),
        fechaInicio: $('#txtFechaInicioNuevoContato').val().trim(),
        fechaFin: $('#txtFechaFinalNuevoContato').val().trim(),
        clienteFirmante: $('#txtDniClienteFirmanteNuevoContrato').val().trim(),
        dniApoderado: $('#txtDniApoderadoNuevoContrato').val().trim(),
        dniGerente: $('#txtDniGerenteNuevoContrato').val().trim(),
        numeroPagina: 8,
        numeroClausula: 21
    }

    if ($('#txtNombreClienteFirmanteNuevoContrato').val().length == 0) {
        MensajeError('Debe ingresar dni de cliente firmante');
        $('div.card-tabs-bar a:eq(6)').click();

        return;
    }
    if ($('#txtNombreApoderadoNuevoContrato').val().length == 0) {
        MensajeError('Debe ingresar dni de apoderado firmante');
        $('div.card-tabs-bar a:eq(6)').click();
        return;
    }
    if (dataGuardar.dniGerente.length == 0) {
        MensajeError('Debe seleccionar un gerente a firmar');
        $('div.card-tabs-bar a:eq(6)').click();
        return;
    }

    MensajeConfirmar('¿Está seguro que desea registrar el contrato?', function () {

        MostrarLoading(true, 'Registrando Contrato...');

        QueryAJAX('indraupc/registrarContrato',
            dataGuardar,
            function (resultado) {

                if (resultado == 0) {
                    MostrarLoading(false);
                    MensajeError('Problemas para registrar contrato');
                    return;
                }

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

$('#btnEliminarNuevoContrato').off().on('click', function () {
    var iCodAdenda = $('#iCodigoAdendaNuevoContrato').val().trim();

    if (iCodAdenda.length == 0) {
        MensajeError('Error para Eliminar');
        return;
    }

    if (iCodAdenda <= 0) {
        MensajeError('Error para Eliminar');
        return;
    }

    MensajeConfirmar('¿Desea Eliminar el Contrato?',
        function () {
            MostrarLoading(true, 'Eliminando Contrato...');

            QueryAJAX('indraupc/rechazarContrato',
                  {
                      codigoAdenda: iCodAdenda,
                  },
                  function (resultado) {
                      MostrarLoading(false);

                      if (resultado != 1) {
                          MensajeError('No se pudo Eliminar Contrato');
                          return;
                      }
                      MensajeOk('Contrato Eliminado',
                          'El Contrato se eliminó correctamente',
                          function () {
                              $('#btnCancelarNuevoContrato').trigger('click');
                              setTimeout(function () {
                                  $('#btnBuscarContratosModuloPrincipal').trigger('click');
                              }, 1000)
                          });
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
                nroEntrega: $(this).find('td:eq(0)').text(),
                dias: $(this).find('td:eq(1)').text(),
                fechaEntrega: $(this).find('td:eq(2)').text(),
                descripcion: $(this).find('td:eq(3)').text(),
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
                console.log(resultado);

                /*REGISTRAMOS LOS PAGOS DETALLES*/
                var array = [];

                $('#tablaCuotasNuevoContrato tbody tr').each(function () {
                    array.push({
                        anio: $(this).find('td:eq(1)').text(),
                        mes: $(this).find('td:eq(2)').attr('mes'),
                        numeroCuota: $(this).find('td:eq(0)').text(),
                        ultimoDiaPago: $(this).find('td:eq(3)').text()
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
        MostrarLoading(false);
        MensajeOk('Se registró', 'El Contrato se registró correctamente');
        $('#btnGuardarNuevoContrato,#btnSubirArchivoRequerimientoPrograma').prop('disabled', true);
        $('#btnCancelarNuevoContrato').trigger('click');
    }
}

$('#btnSubirArchivoRequerimientoPrograma').off().on('click', function () {
    $('#subirArchivosXLSX').trigger('click');
});

$('#btnVistaPreviaNuevoContrato').off().on('click', function () {
    /*PREGUNTAMOS SI ES PARA CREAR UN NUEVO */
    if ($('#btnGuardarNuevoContrato').is(":visible")) {
        if ($('#hArchivoCorrectoNuevoContrato').val() != 1) {
            MensajeError('Debe cargar primero un archivo Excel');
            return;
        }
    }
    var dniGerente = $('#txtDniGerenteNuevoContrato').val().trim();

    if ($('#txtNombreClienteFirmanteNuevoContrato').val().length == 0) {
        MensajeError('Debe ingresar dni de cliente firmante');
        $('div.card-tabs-bar a:eq(6)').click();
        return;
    }
    if ($('#txtNombreApoderadoNuevoContrato').val().length == 0) {
        MensajeError('Debe ingresar dni de apoderado firmante');
        $('div.card-tabs-bar a:eq(6)').click();
        return;
    }
    if (dniGerente.length == 0) {
        MensajeError('Debe seleccionar un gerente a firmar');
        $('div.card-tabs-bar a:eq(6)').click();
        return;
    }




    //GenerarContratoPDF('CONTRATO No 0009 - 2018 - DESARROLLO DE SOFTWARE');

    var pNOmbreCliente = $('#txtRazonSocialClienteNuevoContrato').val().trim();//'BACKUS y JOHNSTON S.A.A';
    var pNombreContrato = $('#txtNombreContratoNuevoContrato').val().trim();// '0009 - 2018 – 000001 / DESARROLLO DE SOFTWARE';
    var pTipoCliente = $('#txtActividadNuevoContrato').val().trim().length == 0 ? 'DNI' : 'RUC';
    var pDniCliente = $('#txtRucDNIClienteNuevoContrato').val().trim();// '20100113610';
    var pDireccionCliente = $('#txtDomicilioNuevoContrato').val().trim();// 'Av. Nicolás Ayllón 3986 Ate Vitarte';
    var pMonedaContrato = $('#txtTipoMonedaNuevoContato').attr('ctipomoneda') == '1' ? 'S/.' : '$.'

    var pMontoContrato = $('#txtPrecioContractualNuevoContato').val().trim();// '1195,891.44';

    if ($('#txtTipoMonedaNuevoContato').attr('ctipomoneda') == '1') {
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

    GenerarPdfSoftware(pNombreContrato,
                         pNOmbreCliente,
                         pTipoCliente,
                         pDniCliente,
                         pDireccionCliente,
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

function VerDialogoPDF(Titulo, TextoPDF) {
    $('#IFrameVisualizarPDF_JSJ').attr({
        'src': TextoPDF,
        'height': $(document).height() - 180
    });

    $('#TituloDialog_VisualizadorPDF').html(Titulo);

    OpenDialogo('DialogoVisualizarPDF', undefined, undefined, function () {
        $('#IFrameVisualizarPDF_JSJ').attr({
            'src': ' '
        });
    });
}

function ReaderExcel(dataFile) {
    $('#hArchivoCorrectoNuevoContrato').val(0);

    var data = JSON.parse(dataFile);
    //VALIDANDO:
    if (!data.PRINCIPAL) {
        MensajeError('Archivo no reconocido, falta Hoja: principal')
        return;
    }
    if (!data.ANTECEDENTES) {
        MensajeError('Archivo no reconocido, falta Hoja: ANTECEDENTES')
        return;
    }
    if (!data.MONTO_CONTRATADO) {
        MensajeError('Archivo no reconocido, falta Hoja: MONTO_CONTRATADO')
        return;
    }
    if (!data.CRONOGRAMA_ENTREGA) {
        MensajeError('Archivo no reconocido, falta Hoja: CRONOGRAMA_ENTREGA')
        return;
    }
    if (!data.VIGENCIA) {
        MensajeError('Archivo no reconocido, falta Hoja: VIGENCIA')
        return;
    }

    if (!data.FORMAS_PAGO) {
        MensajeError('Archivo no reconocido, falta Hoja: FORMAS_PAGO')
        return;
    }

    debugger;

    /*VALIDACIONES DE CELDAS*/
    if (data.PRINCIPAL.length == 0) {
        MensajeError('Pestaña PRINCIPAL sin registro');
        return;
    }
    if (!data.PRINCIPAL[0].PAIS) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>País</b>');
        return;
    }
    if (!data.PRINCIPAL[0].DEPARTAMENTO) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>Departamento</b>');
        return;
    }
    if (!data.PRINCIPAL[0].PROVINCIA) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>Provincia</b>');
        return;
    }
    if (!data.PRINCIPAL[0].DISTRITO) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>Distrito</b>');
        return;
    }
    if (!data.PRINCIPAL[0].TIPO_CONTRATO) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>Tipo_Contrato</b>');
        return;
    }
    if (!data.PRINCIPAL[0].TIPO_SERVICIO)
        data.PRINCIPAL[0].TIPO_SERVICIO = '0:';

    if (!data.PRINCIPAL[0].RUC_DNI_CLIENTE) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>RucDni de Cliente</b>');
        return;
    }

    if (!data.PRINCIPAL[0].NOMBRE_PROYECTO) {
        MensajeError('Pestaña PRINCIPAL  falta columna <b>Nombre Proyecto</b>');
        return;
    }

    if (data.MONTO_CONTRATADO.length == 0) {
        MensajeError('Pestaña MONTO_CONTRATADO sin registro');
        return;
    }
    if (!data.MONTO_CONTRATADO[0].TIPO_MONEDA) {
        MensajeError('Pestaña MONTO_CONTRATADO falta columna <b>Tipo Moneda</b>');
        return;
    }
    if (!data.MONTO_CONTRATADO[0].PRECIO_CONTRACTUAL) {
        MensajeError('Pestaña MONTO_CONTRATADO falta columna <b>Precio Contractual</b>');
        return;
    }

    if (data.VIGENCIA.length == 0) {
        MensajeError('Pestaña VIGENCIA sin registro');
        return;
    }
    if (!data.VIGENCIA[0]['FCHA_INICIO_CONTRATO\r\n(YYY-MM-DD)']) {
        MensajeError('Pestaña VIGENCIA  falta columna <b>Fecha Inicio Contrato</b>');
        return;
    }
    if (!data.VIGENCIA[0]['FCHA_FIN_CONTRATO\r\n(YYY-MM-DD)']) {
        MensajeError('Pestaña VIGENCIA  falta columna <b>Fecha Fin Contrato</b>');
        return;
    }

    if (data.FORMAS_PAGO.length == 0) {
        MensajeError('Pestaña FORMAS_PAGO sin registro');
        return;
    }
    if (!data.FORMAS_PAGO[0].TIPO_PAGO) {
        MensajeError('Pestaña FORMAS_PAGO falta columna <b>Tipo Pago</b>');
        return;
    }

    /*VIGENCIA*/
    $('#txtFechaInicioNuevoContato').val(data.VIGENCIA[0]['FCHA_INICIO_CONTRATO\r\n(YYY-MM-DD)']);
    $('#txtFechaFinalNuevoContato').val(data.VIGENCIA[0]['FCHA_FIN_CONTRATO\r\n(YYY-MM-DD)']);

    //try {
    var tempo = [];

    /*PRINCIPAL*/
    $('#txtPaisNuevoContrato').val(data.PRINCIPAL[0].PAIS.split(':')[1]);
    $('#txtDepartamentoNuevoContrato').val(data.PRINCIPAL[0].DEPARTAMENTO.split(':')[1]);
    $('#txtProvinciaNuevoContrato').val(data.PRINCIPAL[0].PROVINCIA.split(':')[1]);

    tempo = data.PRINCIPAL[0].DISTRITO.split(':');
    $('#txtDistritoNuevoContrato').val(tempo[1]).attr('iCodigoDistrito', tempo[0]);

    tempo = data.PRINCIPAL[0].TIPO_CONTRATO.split(':');
    $('#txtTipoContratoNuevoContrato').val(tempo[1]).attr('cTipocontrato', tempo[0]);

    if (data.PRINCIPAL[0].TIPO_SERVICIO.length > 0) {
        tempo = data.PRINCIPAL[0].TIPO_SERVICIO.split(':');
        $('#txtServicioNuevoContrato').val(tempo[1]).attr('cTipocontrato', tempo[0]);
    } else {
        $('#txtServicioNuevoContrato').val('').attr('cTipocontrato', 0);
    }

    $('#txtRucDNIClienteNuevoContrato').val(data.PRINCIPAL[0].RUC_DNI_CLIENTE);
    $('#txtNombreProyectoNuevoContrato').val(data.PRINCIPAL[0].NOMBRE_PROYECTO);

    /*ANTECEDENTES*/
    var html = '';
    for (var i = 0; i < data.ANTECEDENTES.length; i++) {
        if (typeof data.ANTECEDENTES[i].DESCRIPCION == 'undefined') {

            MensajeError('Pestaña ANTECEDENTES  Entrada inválida, favor de verificar');
            return;
        }
        html += '<tr>' +
                    '<td><i class="far fa-check-square"></i></td>' +
                    '<td>' + data.ANTECEDENTES[i].DESCRIPCION + '</td>' +
                '</tr>';
    }

    $('#tableAntecedentesNuevoContrato tbody').html(html);

    /*MONTO CONTRATADO*/
    $('#txtTipoMonedaNuevoContato').val(data.MONTO_CONTRATADO[0].TIPO_MONEDA).attr('cTipoMoneda', data.MONTO_CONTRATADO[0].TIPO_MONEDA == 'SOLES' ? 1 : 2);
    $('#txtPrecioContractualNuevoContato').val(parseFloat(data.MONTO_CONTRATADO[0].PRECIO_CONTRACTUAL).toFixed(2));

    /*CRONOGRAMA DE ENTREGA*/
    html = '';

    for (var i = 0; i < data.CRONOGRAMA_ENTREGA.length; i++) {
        if (typeof data.CRONOGRAMA_ENTREGA[i].NRO_ENTREGA == 'undefined' ||
            typeof data.CRONOGRAMA_ENTREGA[i].DIAS == 'undefined' ||
            typeof data.CRONOGRAMA_ENTREGA[i]['FECHA_ENTREGA\r\n(YYY/MM/DD)'] == 'undefined' ||
            typeof data.CRONOGRAMA_ENTREGA[i].DESCRIPCION == 'undefined') {

            MensajeError('Pestaña CRONOGRAMA_ENTREGA  Entrada inválida, favor de verificar');
            return;
        }
        html += '<tr class="text-center">' +
                    '<td>' + data.CRONOGRAMA_ENTREGA[i].NRO_ENTREGA + '</td>' +
                    '<td>' + data.CRONOGRAMA_ENTREGA[i].DIAS + '</td>' +
                    '<td>' + data.CRONOGRAMA_ENTREGA[i]['FECHA_ENTREGA\r\n(YYY/MM/DD)'] + '</td>' +
                    '<td class="text-left">' + data.CRONOGRAMA_ENTREGA[i].DESCRIPCION + '</td>' +
                '</tr>';
    }

    $('#tablaCronogramaEntregaNuevoContrato tbody').html(html);

    /*VIGENCIA*/
    $('#txtFechaInicioNuevoContato').val(data.VIGENCIA[0]['FCHA_INICIO_CONTRATO\r\n(YYY-MM-DD)']);
    $('#txtFechaFinalNuevoContato').val(data.VIGENCIA[0]['FCHA_FIN_CONTRATO\r\n(YYY-MM-DD)']);

    /*FORMAS DE PAGO*/
    html = '';

    var cantidadCuotasPgao = 0;
    if (data.FORMAS_PAGO[0].TIPO_PAGO == 'EN CUOTAS') {
        $('#chkPagoCuotasNuevoContrato').prop('checked', true);

        for (var i = 0; i < data.FORMAS_PAGO.length; i++) {
            cantidadCuotasPgao++;

            if (typeof data.FORMAS_PAGO[i].NUMERO_CUOTA == 'undefined' ||
                typeof data.FORMAS_PAGO[i].AÑO == 'undefined' ||
                typeof data.FORMAS_PAGO[i].MES == 'undefined' ||
                typeof data.FORMAS_PAGO[i]['ULTIMO_DIA_PAGO\r\n(YYY/MM/DD)'] == 'undefined') {

                MensajeError('Pestaña FORMAS_PAGO  Entrada inválida, favor de verificar');
                return;
            }

            tempo = data.FORMAS_PAGO[i].MES.split(':');

            html += '<tr class="text-center">' +
                        '<td>' + data.FORMAS_PAGO[i].NUMERO_CUOTA + '</td>' +
                        '<td>' + data.FORMAS_PAGO[i].AÑO + '</td>' +
                        '<td mes="' + tempo[0] + '">' + tempo[1] + '</td>' +
                        '<td>' + data.FORMAS_PAGO[i]['ULTIMO_DIA_PAGO\r\n(YYY/MM/DD)'] + '</td>' +
                    '</tr>';
        }
    }
    else {
        $('#chkPagoContadoNuevoContrato').prop('checked', true);
        cantidadCuotasPgao++;
        html += '<tr class="text-center">' +
                       '<td>1</td>' +
                       '<td>0</td>' +
                       '<td>0</td>' +
                       '<td>2018-01-01</td>' +
                   '</tr>';
    }

    $('#tablaCuotasNuevoContrato tbody').html(html);
    $('#txtCuotasNuevoContrato').val(cantidadCuotasPgao);

    $('div.card-tabs-bar a:not(:first)').show();

    MostrarLoading(true, 'recuperando cliente...');

    /*RECUPERAMOS AL CLIENTE*/
    QueryAJAX('indraupc/buscarClientexRucDni',
        {
            dniRuc: data.PRINCIPAL[0].RUC_DNI_CLIENTE//'45265162'// 
        },
        function (result) {
            if (!result) {
                MostrarLoading(false);
                MensajeError('No se pudo recuperar el cliente indicado');
                return;
            }

            $('#txtRazonSocialClienteNuevoContrato').val(result.cliente);
            $('#txtDomicilioNuevoContrato').val(result.direccion);
            $('#txtActividadNuevoContrato').val(result.actividad);

            /*RECUPERAMOS EL CONTRATO*/

            QueryAJAX('indraupc/buscarInformacionContrato',
                {
                    codigoDistrito: $('#txtDistritoNuevoContrato').attr('iCodigoDistrito'),
                    tipoContrato: $('#txtTipoContratoNuevoContrato').attr('cTipocontrato'),
                    fechaInicio: data.VIGENCIA[0]['FCHA_INICIO_CONTRATO\r\n(YYY-MM-DD)'],
                    dniRucCliente: data.PRINCIPAL[0].RUC_DNI_CLIENTE
                },
                function (result) {
                    MostrarLoading(false);

                    console.log(result);

                    if (result == null ) {
                        MensajeError('No se pudo recuperar informacion del siguiente contrato');
                        return;
                    }

                    $('#txtNombreContratoNuevoContrato').val(result.nombreContrato);
                    $('#txtNumeroContratoNuevoContrato').val(result.numeroContrato);

                    $('#hArchivoCorrectoNuevoContrato').val(1);
                },
                function (error) {
                    MostrarLoading(false);
                    MensajeError('Problemas para comunicarnos con el servicio');
                });
        },
        function (error) {
            MostrarLoading(false);
            MensajeError('Problemas para comunicarnos con el servicio');
        });
    //} catch (e) {
    //    alert('Se produjo un error al intentar el excel');
    //}

}

$('#subirArchivosXLSX').off().on('change', function () {
    var arrayFile = document.querySelector('#subirArchivosXLSX').files;
    debugger;
    leerArchivoExcel(arrayFile, ReaderExcel);
    document.querySelector('#subirArchivosXLSX').value = "";
});

function GenerarGrillaClientesContratos() {
    var alto = $(document).height() - 340;
    jQuery('#tablaIngresoStock').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'Codigo Adenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'center', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'Cliente', name: 'cliente', index: 'cliente', align: 'left', width: 300, frozen: true, hidden: true, sortable: false, resizable: false },
            { label: 'Número de Contrato', name: 'numeroContrato', index: 'numeroContrato', align: 'center', width: 180, frozen: true, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre de Contrato', name: 'nombreContrato', index: 'nombreContrato', align: 'left', width: 300, hidden: false, sortable: false, resizable: false },
            { label: 'Fecha Inicio', name: 'fechaInicio', index: 'fechaInicio', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            { label: 'Fecha Fin', name: 'fechaFin', index: 'fechaFin', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
            {
                label: 'Estado', name: 'estadoContrato', index: 'estadoContrato', align: 'center', width: 150, hidden: false, sortable: false, resizable: false,
                cellattr: function (rowId, val, rawObject, cm, rdata) {
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
        pager: '#pagertablaIngresoStock',
        gridview: true,
        ignoreCase: true,
        viewrecords: true,
        sortable: true,

        onSelectRow: function (rowid, iRow, iCol, e) {
            var registro = jQuery(this).jqGrid('getRowData', rowid);

            switch (registro.estadoContrato) {
                case 'INICIADO':
                    $('#btnListoImprimirContrato,#btnEliminarContrato').prop('disabled', false);
                    break;
                case 'EN PROCESO':
                case 'RECHAZADO':
                    $('#btnListoImprimirContrato,#btnEliminarContrato').prop('disabled', true);
                    break;
                case 'OBSERVADO':
                    $('#btnEliminarContrato').prop('disabled', false);
                    break;
                    case 'APROBADO':
                    $('#btnEliminarContrato').prop('disabled', true);
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

$('#btnCancelarNuevoContrato').off().on('click', function () {
    $('#contenedorColumna10NuevoContrato input').val('');
    $('#iCodigoAdendaNuevoContrato').val('');
    $('#btnGuardarNuevoContrato').show();

    $('#tableAntecedentesNuevoContrato tbody,#tablaCronogramaEntregaNuevoContrato tbody,#tablaCuotasNuevoContrato tbody').html('');

    $('#chkPagoCuotasNuevoContrato,#chkPagoContadoNuevoContrato').prop('checked', false);



    $('#txtDniClienteFirmanteNuevoContrato,#txtDniApoderadoNuevoContrato,#cboNombresGerentesNuevoContrato').prop('disabled', false);

    $('#btnSubirArchivoRequerimientoPrograma').hide();

    $('#cboNombresGerentesNuevoContrato').prop('selectedIndex', -1);
    //return;

    $('#CarruselModuloContrato').carousel(0);
    $('#hArchivoCorrectoNuevoContrato').val(0);

    $('#btnGuardarNuevoContrato,#btnSubirArchivoRequerimientoPrograma').prop('disabled', false);

    $('div.card-tabs-bar a:first').click();
});

//===========================================================================

/*RECUPERAMOS LOS GERENTES FIRMANTES*/
function PageInit_MantenerContrato() {
    // var parametros ={
    //     primerMensaje:'CCCCCCCCCCCCC',
    //     segundoMensaje:'DDDDDDDDDDDDDD'
    // }
    // $.ajax({
    //     url: 'http://localhost:8080/validarContrato',
    //     type: "post",
    //     data: parametros,
    //     success: function (data) {
    //         console.log('OK');
    //         console.log(JSON.stringify(data));
    //     },
    //     error: function (data) {
    //             console.log('ERROR');
    //             console.log(JSON.stringify(data));
    //     }
    // });


    // return;
    /*CONFIGURACIONES DE TAMAÑO*/
    $('div.carousel-item').css('height', $(document).height() - 130);

    $('.tabsholder4').cardTabs({ theme: 'wiki' });

    $('#contenedorColumna10NuevoContrato').css('height', $('div.carousel-item').height() - 55);

    $('#txtFechaInicioModuloPrincipal,#txtFechaFinalModuloPrincipal').off().on('keydown', function (e) {
        e.preventDefault();
        e.stopPropagation();
    }).datetimepicker({
        timepicker: false,
        value: new Date(),
        format: 'Y-m-d',
    });


    /*GENERANDO LOS JQGRID*/
    GenerarGrillaClientesContratos();

    MostrarLoading(true, 'Recuperando Información, un momento por favor...');

    QueryAJAX('indraupc/buscarGerentesFirmantes',
        '',
        function (result) {
            MostrarLoading(false);
            //

            if (result == null ) {
                MensajeError('Servidor devolvió Error de Datos');
                return;
            }

            var html = '';

            if (result.length > 0) {
                html += '<option value="">(Seleccione)</option>';

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
            $('#btnBuscarContratosModuloPrincipal,#btnNuevoContrato,#btnConsultarContrato,#btnEliminarContrato,#btnListoImprimirContrato').off().prop('disabled', true);
        });
};
PageInit_MantenerContrato();


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





/*FUNCTION VISTA PREVIA PDF*/
function GenerarPdfSoftware(pNombreContrato,
                              pNombreCliente,
                              pTipoCliente,
                              pDniCliente,
                              pDireccionCliente,
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

    function listar_array(objeto, nombreobjeto) {
        var texto = '';
        for (var i = 0; i < nombreobjeto.length; i++) {
            texto += nombreobjeto[i].descripcion + '\n\n';
        };
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

    var docDefinition = {
        content: [
          {
              text:  pNombreContrato,
              style: 'header'
          },
          '\n',
          {
              text: ['Conste por el presente documento, uno de locación de servicios, para la provisión de Desarrollo de Software, que celebran de una parte la empresa INDRA COMPANY SAC, con RUC N° 20374984838, con domicilio legal en Av. Jorge Basadre Nro. 233 Int. 901 (Alt. 1ra Cuadra de Av. Javier Prado Oeste) San Isidro, debidamente representado por su Representante Legal VICTOR MANUEL SUZUKI LAVIN, identificado(a) con DNI N° 03654673 a quien en adelante se le conocerá como ', { text: 'LA EMPRESA', style: 'bigger' }, ' y de la otra parte ' + pNombreCliente + ', con ' + pTipoCliente + ' N° ' + pDniCliente + ', con domicilio legal en ' + pDireccionCliente + ', a quien en adelante se le denominará ', { text: 'EL CLIENTE', style: 'bigger' }, ' en los términos y condiciones siguientes:'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA PRIMERA: ANTECEDENTES',
              style: 'tituloclausula'
          },
          '\n',
          {
              text: listar_array('Antecedentes', array_antecedentes),
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA SEGUNDA: OBJETO DEL CONTRATO',
              style: 'tituloclausula'
          },
          {
              text: ['El objeto del presente Contrato, consiste en proveer del diseño y desarrollo de un software por parte de ', { text: 'LA EMPRESA', style: 'bigger' }, ', según las especificaciones, características y cantidades establecidas por ', { text: 'EL CLIENTE', style: 'bigger' }, ', detalladas en los siguientes Anexos:'],
              style: 'parrafo'
          },
          '\n',
          {
              text: listar_array('Anexos', array_anexos),
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA TERCERA: CONTRAPRESTACIÓN',
              style: 'tituloclausula'
          },
          {
              text: ['La contraprestación que deberá abonar ', { text: 'EL CLIENTE', style: 'bigger' }, ' a ', { text: 'LA EMPRESA', style: 'bigger' }, ' por la ejecución del objeto del contrato asciende a la suma total de ' + pMonedaContrato + ' ' + pMontoContrato + ' (UN MILLON CIENTO NOVENTA Y CINCO MIL OCHOCIENTOS NOVENTA Y UN CON 44/100 SOLES), que comprende la provisión del servicio de desarrollo de software, los gastos administrativos, operativos e impuestos.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA CUARTA: FORMA DE PAGO',
              style: 'tituloclausula'
          },
          {
              text: ['La contraprestación que deberá abonar ', { text: 'LA EMPRESA', style: 'bigger' }, ' se deberá efectuar mediante un depósito en la cuenta el cual defina ', { text: 'EL CLIENTE', style: 'bigger' }, ' en un acuerdo en ambas partes. Dicha contraprestación se deberá efectuar en la modalidad ' + pTipoPago + ' y se definirá siguiendo el siguiente cronograma de pago:'],
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              table: {
                  widths: ['auto', 'auto', 'auto', 'auto'],
                  headerRows: 1,
                  // dontBreakRows: true,
                  // keepWithHeaderRows: 1,
                  //body: [
                  //    [{ text: 'Número Cuota', style: 'tableHeader' }, { text: 'Año', style: 'tableHeader' }, { text: 'Mes', style: 'tableHeader' }, { text: 'Último Día Pago', style: 'tableHeader' }],
                  //[aa],
                  //    [array_pago[0].cuota, array_pago[1].anio, array_pago[2].mes, array_pago[3].diapago],
                  //]
                  body: arrayPagoTempo
              },
              layout: {
                  hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                  },
                  hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F';
                  },
                  vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F';
                  },
                  fillColor: function (i, node) {
                      return (i % 2 === 0) ? '#CCCCCC' : null;
                  },
                  // paddingLeft: function(i, node) { return 4; },
                  // paddingRight: function(i, node) { return 4; },
                  // paddingTop: function(i, node) { return 2; },
                  // paddingBottom: function(i, node) { return 2; },
              }
          },
          '\n',
          {
              text: ['Se afirma en esta cláusula la conformidad del ', { text: 'EL CLIENTE', style: 'bigger' }, ' en aceptar las penalidades conformes en este contrato, las cuales serán detalladas más adelante en la CLÁUSULA DÉCIMO CUARTA: PENALIDADES'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA QUINTA: PLAZO DEL CONTRATO',
              style: 'tituloclausula'
          },
          {
              text: 'El plazo del presente se ejecutará y está sujeto conforme al cronograma establecido:',
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              table: {
                  widths: [180, 180],
                  //heights: [20, 50],
                  headerRows: 1,
                  // dontBreakRows: true,
                  // keepWithHeaderRows: 1,
                  body: [
                      [{ text: 'Fecha Inicio Contrato', style: 'tableHeader' }, { text: 'Fecha Fin Contrato', style: 'tableHeader' }],
                      [pFechaInicial, pFechaFinal],
                  ]
              },
              layout: {
                  hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                  },
                  hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F';
                  },
                  vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F';
                  },
                  fillColor: function (i, node) {
                      return (i % 2 === 0) ? '#CCCCCC' : null;
                  },
                  //paddingLeft: function(i, node) { return 4; },
                  //paddingRight: function(i, node) { return 4; },
                  //paddingTop: function(i, node) { return 2; },
                  //paddingBottom: function(i, node) { return 2; },
              }
          },
          '\n',
          {
              text: 'CLÁUSULA SEXTA: CRONOGRAMA DE ENTREGA',
              style: 'tituloclausula'
          },
          {
              text: ['A través del ANEXO Nro. 02: Cronograma de Entrega, desarrollo y entrega de software del presente contrato, se concluye el fortalecimiento de la importancia que tiene el Cronograma de diseño, desarrollo y entrega de software en el contrato. En tanto ', { text: 'LA EMPRESA', style: 'bigger' }, ', se compromete al cumplimiento del siguiente cronograma, con el formato detallado a continuación:'],
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              table: {
                  widths: ['auto', 'auto', 'auto', 'auto'],
                  headerRows: 1,
                  // dontBreakRows: true,
                  // keepWithHeaderRows: 1,
                  //body: [
                  //    [{ text: 'Nro. Entrega', style: 'tableHeader' }, { text: 'Días', style: 'tableHeader' }, { text: 'Fecha de Entrega', style: 'tableHeader' }, { text: 'Descripción', style: 'tableHeader' }],
                  //    [array_cronograma[0].numentrega, array_cronograma[1].dia, array_cronograma[2].fecentrega, array_cronograma[3].descripcion],
                  //]
                  body: arrayCronogramaTempo
              },
              layout: {
                  hLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                  },
                  vLineWidth: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                  },
                  hLineColor: function (i, node) {
                      return (i === 0 || i === node.table.body.length) ? '#00005F' : '#00005F';
                  },
                  vLineColor: function (i, node) {
                      return (i === 0 || i === node.table.widths.length) ? '#00005F' : '#00005F';
                  },
                  fillColor: function (i, node) {
                      return (i % 2 === 0) ? '#CCCCCC' : null;
                  },
                  // paddingLeft: function(i, node) { return 4; },
                  // paddingRight: function(i, node) { return 4; },
                  // paddingTop: function(i, node) { return 2; },
                  // paddingBottom: function(i, node) { return 2; },
              }
          },
          '\n',
          {
              text: ['Dichas responsabilidades planteadas en esta cláusula para y con ', { text: 'LA EMPRESA', style: 'bigger' }, ', tendrán dos anexos a tomar en cuenta: Anexo N° 01 , Anexo Nro. 02; así como también la CLÁUSULA DÉCIMO CUARTA: PENALIDADES'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA SÉPTIMA: CAUSALES DE MODIFICACIÓN',
              style: 'tituloclausula'
          },
          {
              text: ['Cada una de las entregas programadas en el presente Contrato estipuladas en el anexo Nro. 02: Cronograma prestación de servicios del presente contrato, debe garantizar que ', { text: 'EL CLIENTE', style: 'bigger' }, ' se encuentre conforme en su totalidad. Dicho esto, se entiende y acepta por ', { text: 'EL CLIENTE', style: 'bigger' }, ', que ', { text: 'LA EMPRESA', style: 'bigger' }, ' siga el contrato tal y como se ha estipulado. En ese sentido, si en caso ', { text: 'EL CLIENTE', style: 'bigger' }, ' desease alguna modificación en la PRESTACIÓN DEL SERVICIO por parte de ', { text: 'LA EMPRESA', style: 'bigger' }, '; considerando los siguientes campos: número de adenda, nombre de adenda, firma y nombre de ambas partes, fecha de inicio y fin de la adenda, la última modificación de tal así como también el estado en el cual se encuentra, ya sea aprobado rechazado o en proceso. En tanto, se presentan los siguientes motivos:'],
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'Cuando EL CLIENTE desee modificar algún procedimiento que se llevará a cabo para el desarrollo de su software debido al cambio en su forma de negocio, dícese necesidades para la mejora de sus servicios.',
                    'Cuando EL CLIENTE desee modificar algún procedimiento que se llevará a cabo para el desarrollo de su software que genere el cambio de la contraprestación.'
              ]
          },
          '\n',
          {
              text: [{ text: 'EL CLIENTE', style: 'bigger' }, ' y ', { text: 'LA EMPRESA', style: 'bigger' }, ' se encuentran conforme en que la adenda se generará una vez aprobada la solicitud de cambio por el GERENTE correspondiente.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA OCTAVA: PARTES INTEGRANTES DEL CONTRATO',
              style: 'tituloclausula'
          },
          {
              text: ['El presente contrato está conformado por sus Anexos, Formatos y la normativa complementaria. Las partes reconocen expresamente que ninguno de los documentos que conforman el presente contrato puede contener estipulaciones, condiciones o alcances inferiores a los contenidos en la CLAUSULA VIGÉSIMA: MARCO LEGAL DEL CONTRATO detallada más adelante; la cual menciona la legalidad del contrato bajo un enfoque de ley y regulaciones estatales.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA NOVENA: OBLIGACIONES DEL CONTRATO',
              style: 'tituloclausula'
          },
          {
              text: [{ text: 'EL CLIENTE', style: 'bigger' }, ' se sujetará a las siguientes obligaciones:'],
              style: 'parrafo'
          },
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'ASISTIR a LAS REUNIONES convocadas por LA EMPRESA. Esta convocación tendrá un plazo no menor de 72 horas.',
                    'Cumplir con el pago de la contraprestación y la forma eficiente del mismo conforme que está establecido en las cláusulas tercera y cuarta del presente contrato.',
                    'Dar las facilidades de acceso a la información de la organización. Esta información tendrá un carácter de necesario y medular al momento del desarrollo del software, tanto como información de sus instalaciones -estado de las mismas- e  información sobre el negocio.',
                    'Cumplir con lo dispuesto en  los anexos del presente contrato.',
                    'Presentar, si existiese, el expediente de cambios de software si en caso el CLIENTE deseará que el DESARROLLO DE SOFTWARE en este contrato necesitara de otro software ya instalado en sus oficinas.',
                    'Dar las todas las facilidades del caso a LA EMPRESA  para que esta pueda cumplir con la implementación y así cumplir las fechas estipuladas por el contrato.',
                    'Contar con el o los profesionales o técnicos titulados en su(s) establecimiento(s), según las especificaciones establecidas en el anexo Nro. 04: Equipo encargado especializado del CLIENTE garantizando su presencia durante la supervisión inicial y la ejecución contractual.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMA: OBLIGACIONES DE LA EMPRESA',
              style: 'tituloclausula'
          },
          {
              text: [{ text: 'LA EMPRESA', style: 'bigger' }, ' se sujetará a las siguientes obligaciones:'],
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'Cumplir todas y cada una de las especificaciones y características requeridas por el clientes para el desarrollo del software conforme al Anexo 01.',
                    'ASISTIR a LAS REUNIONES posteriores a las entregas convocadas por EL CLIENTE. Esta convocación tendrá un plazo no menor de 72 horas.',
                    'Cumplir con la ejecución del Software en cuestión de una forma eficiente el mismo conforme en el Anexo Nro 02.',
                    'Cumplir con lo dispuesto en  los anexos del presente contrato.',
                    'Dar las todas las facilidades del caso al CLIENTE para que este pueda acceder a la documentación del proyecto.',
                    'Contar con el o los profesionales o técnicos titulados en su(s) establecimiento(s), según las especificaciones establecidas en el anexo Nro. 06: Equipo encargado especializado de LA EMPRESA garantizando su presencia durante la supervisión inicial y la ejecución contractual.',
                    'Entregar los documentos de aprobación de ADENDA a LA EMPRESA luego de 48 horas como máximo de acuerdo al anexo Nro. 02: Cronograma de diseño, desarrollo y entrega de software del presente contrato.',
                    'Garantizar la calidad del Software para el buen desempeño de EL CLIENTE.',
                    'Coordinar permanentemente con el personal de EL CLIENTE el cumplimiento de la información declarada en el anexo Nro. 05: Datos medulares de EL CLIENTE para el desarrollo del software y mantener la confidencialidad de los datos otorgados en el anexo Nro. 05.',
                    'Permitir el ingreso del supervisor u otro personal acreditado por el EL CLIENTE a las instalaciones de LA EMPRESA.',
                    'Cumplir todas y cada una de las especificaciones y características requeridas por el clientes para el desarrollo del software conforme al Anexo 01.',
                    'Cumplir con servicio post venta de una año para el mantenimiento del software.'
              ]
          },
          '\n',
          {
              text: ['Luego de liquidado el presente Contrato, ', { text: 'LA EMPRESA', style: 'bigger' }, ' procederá con la revisión de la garantía, tal y como está estipulado en la CLAUSULA UNDÉCIMA: EJECUCIÓN  DE GARANTÍAS.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA UNDÉCIMA: EJECUCIÓN DE GARANTÍAS',
              style: 'tituloclausula'
          },
          {
              text: [{ text: 'LA EMPRESA', style: 'bigger' }, ' está facultado para disponer definitivamente del fondo de garantía, cuando:'],
              style: 'parrafo'
          },
          '\n',
          {
              text: ['La resolución del Contrato por causa imputable a ', { text: 'EL CLIENTE', style: 'bigger' }, ' haya quedado consentida o cuando ', { text: 'EL CLIENTE', style: 'bigger' }, ' incumpla alguna de las reglas consentidas en la  CLÁUSULA OCTAVA: OBLIGACIONES DEL ', { text: 'CLIENTE', style: 'bigger' }, '; en tanto radica esencialmente en todo tipo de perjuicio dado por ', { text: 'EL CLIENTE', style: 'bigger' }, ' a ', { text: 'LA EMPRESA', style: 'bigger' }, ' a lo largo del desarrollo del SOFTWARE.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: ['Dicho esto, queda claro que cualquier perjuicio por parte del ', { text: 'CLIENTE', style: 'bigger' }, ' a ', { text: 'LA EMPRESA', style: 'bigger' }, ' será medida a partir de la CLAUSULA DÉCIMO TERCERA: PENALIDADES y pondrá el riesgo la garantía a devolver por ', { text: 'LA EMPRESA', style: 'bigger' }, ' al ', { text: 'CLIENTE', style: 'bigger' }, ' al finalizar el presente contrato.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO SEGUNDA: CONFORMIDAD DE LA PRESTACIÓN ',
              style: 'tituloclausula'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'La conformidad de la entrega del SOFTWARE es otorgado por el gerente del proyecto y se materializa con la suscripción del respectivo anexo Nro. 07 Acta de Entrega Final.',
                    'EL CLIENTE tiene el deber de revisar de forma meticulosa cada entregable del proyecto para verificar la el SOFTWARE en cuestión.',
                    'EL CLIENTE solo realiza el pago de acuerdo a la CLAUSULA TERCERA: CONTRAPRESTACIÓN y la CLAUSULA  CUARTA: FORMA DE PAGO.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO TERCERA: SUPERVISIÓN DE LA PRESTACIÓN',
              style: 'tituloclausula'
          },
          {
              text: [{ text: 'LA EMPRESA', style: 'bigger' }, ' se compromete a contar con el personal técnico según lo estipulado en el contrato con las especificaciones establecidas en el anexo Nro. 06: Equipo encargado especializado de LA EMPRESA garantizando su presencia durante la ejecución del proyecto. Lo antes dicho se complementa con LA CLÁUSULA NOVENA: OBLIGACIONES DE ', { text: 'LA EMPRESA', style: 'bigger' }, '.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO CUARTA: PENALIDADES',
              style: 'tituloclausula'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'EL CLIENTE considerará una penalidad la divulgación de la información otorgada para la ejecución del SOFTWARE.',
                    'EL CLIENTE se encuentra en toda potestad de calificar la ejecución del contrato tal y como se encuentra estipulado en el anexo N° 01 – especificaciones técnicas y características requeridas (detalle de las especificaciones y características que requiere el cliente que contenga el software a desarrollar); caso contrario será considerada una penalidad.',
                    'LA EMPRESA tendrá que acoplarse estrictamente todos los anexos, caso contrario se le aplicará una penalidad.',
                    'Se aplicará una penalidad si LA EMPRESA divulga información confidencial detallada en el anexo Nro. 05: Datos medulares del cliente para el desarrollo del software.',
                    'El incumplimiento del anexo Nro. 02: Cronograma de diseño, desarrollo y entrega de software del presente contrato, en cuanto a demora, significará una penalidad aplicada por la siguiente formula.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO QUINTA: SUSPENCIÓN DE LA PRESTACIÓN DEL SERVICIO Y RESOLUCIÓN DEL CONTRATO',
              style: 'tituloclausula'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'La prestación del presente contrato podrá suspender por situaciones de fuerza mayor o caso fortuito y durante el tiempo que dure dicha contingencia.', 'Luego de dos fechas sin pagar se cesa con el desarrollo del software y la resolución del contrato.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO SEXTA: RESOLUCIÓN DEL CONTRATO',
              style: 'tituloclausula'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'El contrato podrá Resolverse por mutuo acuerdo entre las partes, previa liquidación conforme al avance que se haya realizado de la prestación.',
                    'Por incumplimiento del pago de la contraprestación conforme al cronograma establecido en la cláusula cuarta de este contrato.',
                    'Cuando EL CLIENTE presente documentación falsa o documentos adulterados, así como la adulteración de la información registrada en el anexo Nro. 05: Datos medulares del cliente para el desarrollo del software.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO SÉPTIMA: RESPONSABILIDAD DE LAS PARTES',
              style: 'tituloclausula'
          },
          {
              text: ['Cuando una de las partes incumpla injustificadamente las obligaciones asumidas, debe resarcir a la otra parte por los daños y perjuicios ocasionados; a través de la indemnización correspondiente. Ello no obstante representa la aplicación de las sanciones administrativas, penales, civiles y económicas a que dicho incumplimiento diere lugar, en el caso que éstas correspondan.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: [{ text: 'LA EMPRESA', style: 'bigger' }, ' se responsabiliza por lo estipulado a lo largo de este contrato; asimismo está sujeta a todo tipo de responsabilidad estipulada en los anexos y en cada una de las cláusulas, especialmente a la CLÁUSULA NOVENA: RESPONSABILIDAD DE LA EMPRESA y a la CLÁUSULA DÉCIMO TERCERA: PENALIDADES.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO OCTAVA: CASO FORTUITO O FUERZA MAYOR',
              style: 'tituloclausula'
          },
          {
              text: ['La presente CLÁUSULA se remite especialmente al caso de desastres naturales que pudiesen perjudicar las instalaciones del ', { text: 'CLIENTE', style: 'bigger' }, ' y/o perjudicarlo de cualquier otra forma. También cabe resaltar que los casos fortuitos y de fuerza mayor lejanos al de desastre  naturales pasarán por su debida evaluación al momento de sucedidos ya que como esta cláusula lo menciona se debe a algo inesperado. Así mismo, esta CLÁUSULA también reconoce a ', { text: 'LA EMPRESA', style: 'bigger' }, ' como posible afectado de un desastre natural, lo cual ', { text: 'EL CLIENTE', style: 'bigger' }, ' deberá mantener la comprensión del caso. Dicho esto se enfatiza la importancia de dicha cláusula para las dos partes.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA DÉCIMO NOVENA: MARCO LEGAL DEL CONTRATO',
              style: 'tituloclausula'
          },
          {
              text: ['El contrato se encontrará bajo todo el marco legal para poder legitimarlo frente a las entidades estatales pertinentes, así como también para que sean equiparables a la CLÁUSULA DÉCIMO TERCERA: PENALIDADES. En ese sentido, se asevera el uso de las reglas estipuladas por la Oficina Nacional de Gobierno Electrónico e Informático, órgano regulatorio autónomo del Estado.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA VIGÉSIMA: SOLUCIÓN DE CONTROVERSIAS',
              style: 'tituloclausula'
          },
          {
              text: ['Para llevar a cabo la presente cláusula, se convocará a una sesión extraordinaria a las dos partes involucradas, tanto ', { text: 'EL CLIENTE', style: 'bigger' }, ' como ', { text: 'LA EMPRESA', style: 'bigger' }, '. Esto conllevara inevitablemente la resolución de las controversias en el proceso de ejecución del software en cuestión. Las sesiones extraordinarias serán llevadas a cabo de una serie de reuniones hasta que se pueda solucionar los inconvenientes entre las dos partes.'],
              style: 'parrafo'
          },
          '\n',
          {
              text: 'CLÁUSULA VIGÉSIMO PRIMERA: INFORMACIÓN REQUERIDA EN EL ACTA DE ACUERDOS ANEXO NRO 08',
              style: 'tituloclausula'
          },
          {
              text: ['Ambas partes, tanto ', { text: 'LA EMPRESA', style: 'bigger' }, ' como ', { text: 'EL CLIENTE', style: 'bigger' }, ' se comprometen a la ejecución y elaboración de un acta de acuerdos indexada al anexo con número 8. En la presente acta se colocará un título  adherido a un código y con una pequeña descripción consensuada por ambas partes.'],
              style: 'parrafo'
          },
          '\n',
          {
              style: 'parrafo',
              margin: [30, 0, 20, 0],
              ol: [
                    'La presente acta llevará fecha de inicio, al igual que fecha de final del contrato.',
                    'La presente acta llevará el dato de los representantes por parte de LA EMPRESA y EL CLIENTE.'
              ]
          },
          '\n',
          {
              text: 'CLÁUSULA VIGÉSIMO SEGUNDA: FACULTAD DE ELEVAR A ESCRITURA PÚBLICA',
              style: 'tituloclausula'
          },
          {
              text: ['Cualquiera de las partes pueda  solicitar a la otra la elevación del presente contrato a  Escritura Pública corriendo con todos los gastos que demande esta formalidad. De conformidad con las cláusulas precedentes, las partes proceden a suscribir el presente contrato por duplicado en la ciudad de Lima, a los ' + pDia + ' día(s) del mes de ' + pMes + ' del año ' + pAnio + '.'],
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
          //'No styling here, this is a standard paragraph',
          //{ text: 'Another text', style: 'anotherStyle' },
          //{ text: 'Multiple styles applied', style: ['header', 'anotherStyle'] }
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
                margin: [20, 0, 20, 10],

            },
            tituloclausula: {
                fontSize: 14,
                bold: true,
                alignment: 'justify',
                margin: [20, 0, 20, 5],

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


