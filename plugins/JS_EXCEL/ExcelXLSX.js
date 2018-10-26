function to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if (csv.length > 0) {
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    return result.join("\n");
}

function to_formulae(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var formulae = XLSX.utils.get_formulae(workbook.Sheets[sheetName]);
        if (formulae.length > 0) {
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(formulae.join("\n"));
        }
    });
    return result.join("\n");
}

//var tarea = document.getElementById('b64data');
//function b64it() {
//    if (typeof console !== 'undefined') console.log("onload", new Date());
//    var wb = XLSX.read(tarea.value, { type: 'base64', WTF: wtf_mode });
//    process_wb(wb);
//}



//var drop = document.getElementById('drop');
//function handleDrop(e) {
//    e.stopPropagation();
//    e.preventDefault();
//    rABS = document.getElementsByName("userabs")[0].checked;
//    use_worker = document.getElementsByName("useworker")[0].checked;
//    var files = e.dataTransfer.files;
//    var i, f;
//    for (i = 0, f = files[i]; i != files.length; ++i) {
//        var reader = new FileReader();
//        var name = f.name;
//        reader.onload = function (e) {
//            if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
//            var data = e.target.result;
//            if (use_worker) {
//                xlsxworker(data, process_wb);
//            } else {
//                var wb;
//                if (rABS) {
//                    wb = XLSX.read(data, { type: 'binary' });
//                } else {
//                    var arr = fixdata(data);
//                    wb = XLSX.read(btoa(arr), { type: 'base64' });
//                }
//                process_wb(wb);
//            }
//        };
//        if (rABS) reader.readAsBinaryString(f);
//        else reader.readAsArrayBuffer(f);
//    }
//}

//function handleDragover(e) {
//    e.stopPropagation();
//    e.preventDefault();
//    e.dataTransfer.dropEffect = 'copy';
//}

//if (drop.addEventListener) {
//    drop.addEventListener('dragenter', handleDragover, false);
//    drop.addEventListener('dragover', handleDragover, false);
//    drop.addEventListener('drop', handleDrop, false);
//}

function handleFile(e, funcionRegreso) {
    try {

        rABS = true; // document.getElementsByName("userabs")[0].checked;
        use_worker = true; // document.getElementsByName("useworker")[0].checked;
        var files = e.target.files;
        var i, f;

        alert(files[0].name + '\n' + JSON.stringify(files));


        for (i = 0, f = files[i]; i != files.length; ++i) {
            var reader = new FileReader();

            var name = f.name;
            reader.onload = function(e) {
                //if (typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);

                var data = e.target.result;
                xlsxworker(data, process_wb);


                //if (use_worker) {
                //    //alert('use_worker: ' + use_worker + '\n' + process_wb + '\n' + JSON.stringify(process_wb));

                //    xlsxworker(data, process_wb);
                //} else {
                //    var wb;
                //    if (rABS) {
                //        wb = XLSX.read(data, { type: 'binary' });
                //    } else {
                //        var arr = fixdata(data);
                //        wb = XLSX.read(btoa(arr), { type: 'base64' });
                //    }
                //    process_wb(wb);
                //}
            };
            if (rABS) reader.readAsBinaryString(f);
            else reader.readAsArrayBuffer(f);
        }

    } catch (err) { alert(err); }
}


function leerArchivoExcel(arrayFile, funcionRetorno) {
    try {

        rABS = true;
        use_worker = true;
        var reader = new FileReader();
        var name = arrayFile[0].name;
        reader.onload = function(e) {
            var data = e.target.result;
            xlsxworker(data, process_wb, funcionRetorno);
        };

        if (rABS) reader.readAsBinaryString(arrayFile[0]);
        else reader.readAsArrayBuffer(arrayFile[0]);

    } catch (err) { alert(err); }
}

function xlsxworker(data, cb, funcionRetorno) {
    transferable = true; //document.getElementsByName("xferable")[0].checked;

    if (transferable) xlsxworker_xfer(data, cb, funcionRetorno);
    else xlsxworker_noxfer(data, cb);
}

function xlsxworker_xfer(data, cb, funcionRetorno) {
    try {
        var worker = new Worker(rABS ? 'plugins/JS_EXCEL/xlsxworker2.js' : 'plugins/JS_EXCEL/xlsxworker1.js');

        worker.onmessage = function(e) {
            switch (e.data.t) {
                case 'ready': break;
                case 'e': console.error(e.data.d); break;
                default:
                    xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
                    //console.log("done");
                    cb(JSON.parse(xx), funcionRetorno);
                    break;
            }
        };
        if (rABS) {
            var val = s2ab(data);
            worker.postMessage(val[1], [val[1]]);
        } else {
            worker.postMessage(data, [data]);
        }
    } catch (err) { alert(err); }
}

function process_wb(wb, funcionRetorno) {
    try {
        var output = "";
        //switch (get_radio_value("format")) {
        //    case "json":
        output = JSON.stringify(to_json(wb), 2, 2);
        funcionRetorno(output);
    } catch (err) { alert(err); }

}

function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        //console.log('Roa: ' + roa + '\n' +
        //    sheetName +'\n'+
        //    JSON.stringify(workbook.Sheets[sheetName]));
        //console.log('roa.length :', roa.length);
        if (roa.length > 0) {
            result[sheetName] = roa;
        }
    });
    return result;
}

function ab2str(data) {
    var o = "", l = 0, w = 10240;
    for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
    o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
    return o;
}

function s2ab(s) {
    try {
        var b = new ArrayBuffer(s.length * 2), v = new Uint16Array(b);
        for (var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
        return [v, b];
    } catch (err) { aler(err); }
}


