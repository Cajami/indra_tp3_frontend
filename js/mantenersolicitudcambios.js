

function InitPageSolicitudCambios(){

    $('.tabsholder4').cardTabs({ theme: 'wiki' });

    /*CONFIGURACIONES DE TAMAÑO*/
    $('div.carousel-item').css('height', $(document).height() - 130);

    GenerarGrillaClientesAdendas();


}

function GenerarGrillaClientesAdendas() {
    var alto = $(document).height() - 340;
    jQuery('#tablaSolicitudCambios').jqGrid({
        url: '',
        datatype: "local",
        colModel: [
            { label: 'codigoAdenda', name: 'codigoAdenda', index: 'codigoAdenda', align: 'center', width: 100, hidden: true, key: true, sortable: false, resizable: false },
            { label: 'Codigo Contrato', name: 'codigoContrato', index: 'codigoContrato', align: 'left', width: 300, hidden: true, sortable: false, resizable: false },
            { label: 'Nro Solicitud de Cambios', name: 'NroSolicitudCambios', index: 'NroSolicitudCambios', align: 'left', width: 300, sortable: false, resizable: false },
            { label: 'Nro Contrato', name: 'numero_contrato', index: 'numero_contrato', align: 'center', width: 100, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre Contrato', name: 'nombreContrato', index: 'nombreContrato', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Nro Adenda', name: 'numero_adenda', index: 'numero_adenda', align: 'left', width: 200, hidden: false, sortable: false, resizable: false },
            { label: 'Nombre Adenda', name: 'nombreAdenda', index: 'nombreAdenda', align: 'center', width: 250, hidden: false, sortable: false, resizable: false },
            { label: 'Fec. Registro', name: 'fecha_registro', index: 'fecha_registro', align: 'center', width: 150, hidden: false, sortable: false, resizable: false },
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
InitPageSolicitudCambios();

$('#btnNuevoSolicitudCambios').off().on('click',function(){
    $('#titleOpcion').html('NUEVA SOLICITUD DE CAMBIOS');
    $('div.card-tabs-bar a:not(:first)').show();
    $('#CarruselModuloSolicitudCambios').carousel(1);
});

$('#btnConsultarSolicitudCambios').off().on('click',function(){

});

$('#btnModificarSolicitudCambios').off().on('click',function(){

});

$('#btnAprobarSolicitudCambios').off().on('click',function(){

});

$('#btnEliminarSolicitudCambios').off().on('click',function(){

});
