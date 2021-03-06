var tipoTransaccion;
var idPersona;
var precioActualizado = false;
var transaccion = null;
var transaccion_ant = null;

$(document).ready(function () {
    $('#btnModalGuardar').click(function(){
        if (items.length==0){
            $('#msjModal').html("Por favor, agregue items a la transacción para continuar");
            $('#btnModalAceptar').hide()
            $('#btnModalCancelar').html("Aceptar");           
        }
        else{
            $('#msjModal').html("¿Está seguro que desea agregar esta transacción?");
            $('#btnModalAceptar').show();
            $('#btnModalCancelar').html("Cancelar");    
        }       
    });

    // ACTUALZIAR VALORES ITEM
    $("body").on("change", ".item-update", function(e){
        console.log("--> item-update");
        var pos = e.target.id.split("", 1);
        var item_precio = items[pos]["Bien"]["Precio"];
        var item_cantidad = $('#'+pos+'_item_Cantidad').val();
        var item_subtotal = item_precio * item_cantidad;
        var item_total = "0";

        var item_descuento = $('#'+pos+'_item_Dto').val();
        var item_importe_descuento = item_subtotal * (item_descuento/100);
        item_subtotal = item_subtotal - item_importe_descuento;

        var item_iva = $('#'+pos+'_item_IVA option:selected').text();
        var item_importe_iva = item_subtotal * (item_iva/100);
        item_total = item_subtotal + item_importe_iva;

        var item_gravado = "0";
        var item_no_gravado = "0";
        var item_exento = "0";
        switch (item_iva["Valor"]) {
            case "0.00":
                // EXENTO
                item_exento = item_subtotal;
                item_exento = (parseFloat(item_exento).toFixed(2));
                break;
            default:
                // GRAVADO
                item_gravado = item_subtotal;
                item_gravado = (parseFloat(item_gravado).toFixed(2));
                break;
        }

        item_importe_descuento = (parseFloat(item_importe_descuento).toFixed(2));
        item_importe_iva = (parseFloat(item_importe_iva).toFixed(2));
        item_subtotal = (parseFloat(item_subtotal).toFixed(2));
        item_total = (parseFloat(item_total).toFixed(2));
        
        // Actualizando item[pos]
        items[pos]["Cantidad"] = item_cantidad;
        items[pos]["Dto"] = item_descuento;
        items[pos]["IVA"] = ivas[getIvaFromValue(item_iva)];
        items[pos]["ImpIVA"] = item_importe_iva; //items[pos]["ImpIva"] = item_importe_iva;
        items[pos]["Subtotal"] = item_subtotal;
        items[pos]["ImpDto"] = item_importe_descuento;
        // "Precio Original": item_subtotal;
        items[pos]["ImporteGravado"] = item_gravado;
        items[pos]["ImporteNoGravado"] = item_no_gravado;
        items[pos]["ImporteExento"] = item_exento;
        items[pos]["Totales"] = item_total;

        // Actualizando valores de fila
        $('#'+pos+'_ImpDto').html(item_importe_descuento);
        $('#'+pos+'_ImpIVA').html(item_importe_iva);
        $('#'+pos+'_Totales').html(item_total);

        // Recalcular
        calcularSubcampos();

      });
      
});

function actualizarItems(precioActualizado = null){
    for(var i = 0; i < items.length; i++){
        var item_precio = items[i]["Bien"]["Precio"];
        var item_cantidad = $('#'+i+'_item_Cantidad').val();
        var item_subtotal = item_precio * item_cantidad;
        var item_total = "0";

        var item_descuento = $('#'+i+'_item_Dto').val();
        var item_importe_descuento = item_subtotal * (item_descuento/100);
        item_subtotal = item_subtotal - item_importe_descuento;

        var item_iva = $('#'+i+'_item_IVA option:selected').text();
        var item_importe_iva = item_subtotal * (item_iva/100);
        item_total = item_subtotal + item_importe_iva;

        var item_gravado = "0";
        var item_no_gravado = "0";
        var item_exento = "0";
        switch (item_iva["Valor"]) {
            case "0.00":
                // EXENTO
                item_exento = item_subtotal;
                item_exento = (parseFloat(item_exento).toFixed(2));
                break;
            default:
                // GRAVADO
                item_gravado = item_subtotal;
                item_gravado = (parseFloat(item_gravado).toFixed(2));
                break;
        }

        item_importe_descuento = (parseFloat(item_importe_descuento).toFixed(2));
        item_importe_iva = (parseFloat(item_importe_iva).toFixed(2));
        item_subtotal = (parseFloat(item_subtotal).toFixed(2));
        item_total = (parseFloat(item_total).toFixed(2));
        
        // Actualizando item[i]
        items[i]["Cantidad"] = item_cantidad;
        items[i]["Dto"] = item_descuento;
        items[i]["IVA"] = ivas[getIvaFromValue(item_iva)];
        items[i]["ImpIVA"] = item_importe_iva; //items[i]["ImpIva"] = item_importe_iva;
        items[i]["Subtotal"] = item_subtotal;
        items[i]["ImpDto"] = item_importe_descuento;
        // "Precio Original": item_subtotal;
        items[i]["ImporteGravado"] = item_gravado;
        items[i]["ImporteNoGravado"] = item_no_gravado;
        items[i]["ImporteExento"] = item_exento;
        items[i]["Totales"] = item_total;

        // Actualizando valores de fila
        $('#'+i+'_Precio').html(item_precio);
        $('#'+i+'_ImpDto').html(item_importe_descuento);
        $('#'+i+'_ImpIVA').html(item_importe_iva);
        $('#'+i+'_Totales').html(item_total);
    }

};

function actualizarImporteImpuesto(){
    var sumImpGravado = 0; 
    var sumImpNoGravado = 0;
    var sumImpExento = 0;

    var sumIva = {
        iva_27: 0,
        iva_21: 0,
        iva_10: 0,
        iva_5: 0,
        iva_2: 0,
        iva_0: 0
    };

    var bonificacion = parseFloat($("#bonificacion_general").val());
    if(!bonificacion){
        bonificacion = 0;
        parseFloat($("#bonificacion_general").val("0"));
    }
    var recargo = parseFloat($("#recargo_general").val());
    if(!recargo){
        recargo = 0;
        parseFloat($("#recargo_general").val("0"));
    }

    for(var i = 0; i < items.length; i++){
        if(items[i]["ImporteGravado"]){
            sumImpGravado = sumImpGravado + parseFloat(items[i]["ImporteGravado"]);
        }
        if(items[i]["ImporteNoGravado"]){
            sumImpNoGravado = sumImpNoGravado + parseFloat(items[i]["ImporteNoGravado"]);
        }
        if(items[i]["ImporteExento"]){
            sumImpExento = sumImpExento + parseFloat(items[i]["ImporteExento"]);
        }

        if(items[i]["Transaccion Previa"]){
            sumIva.iva_27 = sumIva.iva_27 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA27"]);
            sumIva.iva_21 = sumIva.iva_21 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA21"]);
            sumIva.iva_10 = sumIva.iva_10 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA10"]);
            sumIva.iva_5 = sumIva.iva_5 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA5"]);
            sumIva.iva_2 = sumIva.iva_2 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA2"]);
            sumIva.iva_0 = sumIva.iva_0 + parseFloat(items[i]["Transaccion Previa"]["ImporteIVA0"]);
        } else {
            switch (items[i]["IVA"]["Valor"]) {
                case "27.00":
                    sumIva.iva_27 = sumIva.iva_27 + parseFloat(items[i]["ImpIVA"]);
                    break;
                case "21.00":
                    sumIva.iva_21 = sumIva.iva_21 + parseFloat(items[i]["ImpIVA"]);
                    break;
                case "10.50":
                    sumIva.iva_10 = sumIva.iva_10 + parseFloat(items[i]["ImpIVA"]);
                    break;
                case "5.00":
                    sumIva.iva_5 = sumIva.iva_5 + parseFloat(items[i]["ImpIVA"]);
                    break;
                case "2.50":
                    sumIva.iva_2 = sumIva.iva_2 + parseFloat(items[i]["ImpIVA"]);
                    break;
                case "0.00":
                    sumIva.iva_0 = sumIva.iva_0 + parseFloat(items[i]["ImpIVA"]);
                    break;
                default:
                    break;
            }
        }
    }

    // GRAVADO
    sumImpGravado = sumImpGravado - (sumImpGravado * bonificacion/100);
    sumImpGravado = sumImpGravado + (sumImpGravado * recargo/100);
    // NO GRAVADO
    sumImpNoGravado = sumImpNoGravado - (sumImpNoGravado * bonificacion/100);
    sumImpNoGravado = sumImpNoGravado + (sumImpNoGravado * recargo/100);
    // EXCENTO
    sumImpExento = sumImpExento - (sumImpExento * bonificacion/100);
    sumImpExento = sumImpExento + (sumImpExento * recargo/100);

    $('#importe_gravado').val(parseFloat(sumImpGravado).toFixed(2));
    $('#importe_no_gravado').val(parseFloat(sumImpNoGravado).toFixed(2));
    $('#importe_exento').val(parseFloat(sumImpExento).toFixed(2));

    $('#importe_iva_27').val(parseFloat(sumIva.iva_27).toFixed(2));
    $('#importe_iva_21').val(parseFloat(sumIva.iva_21).toFixed(2));
    $('#importe_iva_10').val(parseFloat(sumIva.iva_10).toFixed(2));
    $('#importe_iva_5').val(parseFloat(sumIva.iva_5).toFixed(2));
    $('#importe_iva_2').val(parseFloat(sumIva.iva_2).toFixed(2));
    $('#importe_iva_0').val(parseFloat(sumIva.iva_0).toFixed(2));
};

function addItems(bienesTransacciones, tipo, id, actualizarPrecio) {
    precioActualizado = actualizarPrecio;
    if (bienesTransacciones==null){
        bienesTransacciones = [];
    }
    $(document).ready(function () {
        // $("#table_bienes").dataTable().fnDestroy();
        $('#table_bienes').DataTable({
            destroy: true,
            paging: true,
            searching: true,
            aaSorting: [],
            "language": {
                "url": "/json/spanish.json"
            }
        });
    });
    tipoTransaccion = tipo;
    idPersona = id;

    var divContainer = document.getElementById("div_table_bienes");
    if (divContainer != null) {
        divContainer.parentNode.removeChild(divContainer);
    }
    
    divContainer = document.createElement("div");
    divContainer.setAttribute("id", "div_table_bienes");
    var parentDiv = document.getElementById("contenido_bienes");
    parentDiv.innerHTML = "";
    parentDiv.appendChild(divContainer);
    table = document.createElement("table");
    table.setAttribute("id", "table_bienes");
    table.setAttribute("class", "display");
    var thead = document.createElement("thead");
    var col = ["Nombre", "Descripcion", "Cantidad", "Precio", "Dto", "ImpDto", "IVA", "ImpIVA", "Totales", ""];
    var tr = thead.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        switch (col[i]) {
            case 'Nombre':
                th.innerHTML = "Producto / Servicio"; 
                break;
            case 'Cantidad':
                th.innerHTML = "Cant."; 
            break;
            case 'Dto':
                th.innerHTML = "% Dto.";
                break;
            case 'ImpDto':
                th.innerHTML = "Imp. Dto.";
                break;
            case 'IVA':
                th.innerHTML = "% IVA"; 
                break;
            case 'ImpIVA':
                th.innerHTML = "Imp. IVA";
                break;
            case 'Totales':
                th.innerHTML = "Subtotal";
                break;
            default:
                th.innerHTML = col[i];
          }
        tr.appendChild(th);
    }
    
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    tbody.setAttribute("role", "button");
    var value = null;
    for (var i = 0; i < bienesTransacciones.length; i++) {
        var item = bienesTransacciones[i];
        tr = tbody.insertRow(-1);
        tr.setAttribute("id", i);
        tr.setAttribute("class", "click");
        for (var j = 0; j < col.length - 1; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.setAttribute("id", i + "_" + col[j]);

            var dto, cantidad, dtoPeso, precioDto, iva, precio;
            if(precioActualizado){
                precio = item["Bien"]["Precio"];
            } else {
                precio = item["Precio Original"];
            }

            dto= item["Dto"];
            cantidad = item["Cantidad"];
            dtoPeso = (precio * dto / 100) * cantidad;
            precioDto = (cantidad * precio) - dtoPeso;  
            iva = item["IVA"]["Valor"];

            //////////////////////////////////////////////////////////////////////////////////

            var readonly = true;
            switch (col[j]) {
                case 'Nombre':
                    value = item["Bien"][col[j]];
                    break;
                case 'Descripcion':
                    value = item["Bien"][col[j]];
                    break;
                case 'Cantidad':
                    value = item[col[j]];
                    tabCell.setAttribute("class", "cant-width");
                    readonly = false;
                    break;
                case 'Dto':
                    value =dto;
                    tabCell.setAttribute("class", "dto-width");
                    if (!value){value=0;}
                    value = (parseFloat(value)).toFixed(2);
                    readonly = false;
                    break;
                case 'ImpDto':
                    value = (parseFloat(dtoPeso)).toFixed(2);
                    break;
                case 'IVA':
                    value = iva;
                    tabCell.setAttribute("class", "select-iva-width");
                    if (!value){value=0;}
                    value = (parseFloat(value)).toFixed(2);
                    readonly = false;
                    break;
                case 'ImpIVA':
                    value =(precioDto * (iva / 100));
                    if (!value){ value=0};
                    value = (parseFloat(value)).toFixed(2);
                    break;
                case 'Precio':
                    value = precio;
                    if(!value){value = 0;}
                    value = (parseFloat(value)).toFixed(2);
                    break;
                case 'Totales':
                    if (!iva){iva = 0;}
                    var subtotal = precioDto + precioDto * iva / 100;
                    value = subtotal;
                    if (!value){value=0;}
                    value = (parseFloat(value)).toFixed(2);
                    break
                default:
                    value = item[col[j]];
            }
            
            var myHtml = '<input type="text" role="button" class="form-control item-update" name="" id="'+i+'_item_'+col[j]+'" value="'+ value+'" onkeypress="return justNumbersEnter(event);"';
            if(readonly){
                myHtml += ' readonly';
            };
            myHtml += '>';

            // Crear <select> IVAS
            if(col[j] == 'IVA'){
                myHtml = '<select role="button" id="'+i+'_item_'+col[j]+'" class="form-control item-update">';
                for (var k = 0; k < ivas.length; k++) {
                    myHtml += '<option value="'+ivas[k]['Id']+'"';
                    if(value == ivas[k]['Valor']){
                        myHtml += ' selected';
                    };
                    myHtml += '>'+ivas[k]['Valor']+'</option>';
                }
                myHtml += '</select>';
            }

            if(!readonly){
                tabCell.innerHTML = myHtml;
            } else {
                tabCell.innerHTML = value;
            };            
        }
        // Botones
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'btn btn-default btn-sm glyphicon glyphicon-trash'); // set attributes ...
        btn.setAttribute('id', i);
        btn.setAttribute('value', 'Borrar');
        btn.setAttribute("onclick", "removerBien(id)");
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("class", "click");
        tabCell.appendChild(btn);
    }
    table.appendChild(tbody);

    // var divContainer = document.getElementById("div_table_bienes");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    calcularSubcampos();
}


// ADD TRANSACCION PARA MODO PAGO
function addTransaccion(bienesTransacciones, tipo, id) {
    console.log("--> addTransaccion()");    
    
    if (bienesTransacciones==null){
        bienesTransacciones = [];
    }
    $(document).ready(function () {
        $('#table_bienes').DataTable({
            aaSorting: [],
            "language": {
                "url": "/json/spanish.json"
            }
        });
    });
    tipoTransaccion = tipo;
    idPersona = id;
    var divContainer = document.getElementById("div_table_bienes");
    if (divContainer != null) {
        divContainer.parentNode.removeChild(divContainer);
    }
    divContainer = document.createElement("div");
    divContainer.setAttribute("id", "div_table_bienes");
    var parentDiv = document.getElementById("contenido_bienes");
    parentDiv.innerHTML = "";
    parentDiv.appendChild(divContainer);
    table = document.createElement("table");
    table.setAttribute("id", "table_bienes");
    table.setAttribute("class", "display");
    var thead = document.createElement("thead");
    var col = ["Nombre", "Descripcion", "Cantidad", "Precio", "Dto", "ImpDto", "IVA", "ImpIVA", "Totales", ""];
    var tr = thead.insertRow(-1);
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        switch (col[i]) {
            case 'Nombre':
                th.innerHTML = "Producto / Servicio"; 
                break;
            case 'Dto':
                th.innerHTML = "Dto (%)";
                break;
            case 'ImpDto':
                th.innerHTML = "Dto ($)";
                break;
            case 'IVA':
                th.innerHTML = "IVA (%)"; 
                break;
            case 'ImpIVA':
                th.innerHTML = "IVA ($)";
                break;
            default:
                th.innerHTML = col[i];
          }
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);
    var tbody = document.createElement("tbody");
    tbody.setAttribute("role", "button");
    var value = null;
    for (var i = 0; i < bienesTransacciones.length; i++) {
        var item = bienesTransacciones[i];
        tr = tbody.insertRow(-1);
        // tr.onclick= selectItem(item["id"]);
        tr.setAttribute("id", i);
        tr.setAttribute("class", "click");
        //    tr.setAttribute("onclick","selectItem(event,id)");
        for (var j = 0; j < col.length - 1; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.setAttribute("id", i + "_" + col[j]);
            tabCell.setAttribute("class", "click");
            var precio;
            if(precioActualizado){
                precio = item["Bien"]["Precio"];
            }
            else{
                precio = item["Precio Original"];
            }
            if(!precio){
                precio = 0;
            }
            ////////////////////VALORES SI EL PRECIO ESTA ACTUALIZADO O NO/////////////////////
            var dto, cantidad, dtoPeso, precioDto, iva, precio;
            if (precioActualizado){
                precio = item["Bien"]["Precio"];
                dto = item["Bien"]["Dto"];
                cantidad = item["Cantidad"];
                dtoPeso = (precio * dto / 100) * cantidad;
                precioDto = (cantidad * precio) - dtoPeso;  
                iva = item["Bien"]["IVA"];
            }else{
                precio = item["Precio Original"];
                dto= item["Dto"];
                cantidad = item["Cantidad"];
                dtoPeso = (precio * dto / 100) * cantidad;
                precioDto = (cantidad * precio) - dtoPeso;  
                iva = item["IVA"]["Valor"];
            }
            //////////////////////////////////////////////////////////////////////////////////
            switch (col[j]) {
                case 'Nombre':
                    value = item["Bien"][col[j]];
                    break;
                case 'Descripcion':
                    value = item["Bien"][col[j]];
                    break;
                case 'Cantidad':
                    value = item[col[j]];
                    tabCell.setAttribute("ondblclick", "makeEditable(event)");
                    break;
                case 'Dto':
                    value =dto;
                    if (!value){value=0;}
                    value = parseFloat(value).toFixed(2);
                    tabCell.setAttribute("ondblclick", "makeEditable(event)");
                    break;
                case 'ImpDto':
                    value = parseFloat(dtoPeso).toFixed(2);
                    break;
                case 'IVA':
                    value = iva;
                    if (!value){value=0;}
                    value = (parseFloat(value)).toFixed(2);
                    tabCell.setAttribute("ondblclick", "makeEditable(event)");
                    break;
                case 'ImpIVA':
                    value =(precioDto * (iva / 100));
                    if (!value){ value=0};
                    value = (parseFloat(value)).toFixed(2);
                    break;
                case 'Precio':
                    value = precio;
                    if(!value){value = 0;}
                    value = (parseFloat(value)).toFixed(2);
                    break;
                case 'Totales':
                    if (!iva){iva = 0;}
                    var subtotal = precioDto + precioDto * iva / 100;
                    value = subtotal;
                    if (!value){value=0;}
                    value = (parseFloat(value)).toFixed(2);
                    break
                default:
                    value = item[col[j]];
            }
            tabCell.innerHTML = value;
        }
        // Botones
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('class', 'btn btn-default btn-sm glyphicon glyphicon-trash'); // set attributes ...
        btn.setAttribute('id', i);
        btn.setAttribute('value', 'Borrar');
        btn.setAttribute("onclick", "removerBien(id)");
        var tabCell = tr.insertCell(-1);
        tabCell.setAttribute("class", "click");
        tabCell.appendChild(btn);
    }
    table.appendChild(tbody);

    // var divContainer = document.getElementById("div_table_bienes");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
    calcularSubcampos();
}

function getItems() {
    return items;
}

function calcularSubcampos( precioActualizado = null) {
    if ((tipoTransaccion!="nota de credito") && (tipoTransaccion!="nota de debito")){
        var table = document.getElementById("table_bienes");
        var sumSubtotal = 0;
        var sumDto = 0;
        var sumIva = 0;
        var descuento = 0;
        var cantidad = 0;
        var precio_unitario_dto = 0;
        var iva = 0;
        var subtotal = 0;
        var sumVentaBruta = 0;
        var bonificacion = 0;
        var recargo = 0;
        var sumBonificacion = 0;
        var sumRecargo = 0;
        
        if (precioActualizado){
            for (var i = 0; i < items.length; i++) {
                // CANTIDAD
                cantidad = (items[i]["Cantidad"]);
                // PRECIO UNITARIO
                precio_unitario = (items[i]["Bien"]["Precio"]);
                if (!precio_unitario){
                    precio_unitario = 0;
                }
                // DESCUENTO
                descuento = (items[i]["Bien"]["Dto"]);
                if (!descuento){
                    descuento = 0;
                }
                descuento = descuento * (precio_unitario / 100);
                sumDto = sumDto + (descuento * cantidad);
                precio_unitario_dto = precio_unitario - descuento;
                // BONIFICACION
                bonificacion = parseFloat($("#bonificacion_general").val());
                if(!bonificacion){
                    bonificacion = 0;
                    parseFloat($("#bonificacion_general").val("0"));
                }
                bonificacion = precio_unitario_dto * (bonificacion / 100);
                sumBonificacion = sumBonificacion + (bonificacion * cantidad);
                precio_unitario_dto = precio_unitario_dto - bonificacion; // applico al subtotal
                // RECARGO
                recargo = parseFloat($("#recargo_general").val());
                if(!recargo){
                    recargo = 0;
                    parseFloat($("#recargo_general").val("0"));
                }
                recargo = precio_unitario_dto * (recargo / 100);
                sumRecargo = sumRecargo + (recargo * cantidad);
                precio_unitario_dto = precio_unitario_dto + recargo; // applico al subtotal
                // SUBTOTAL
                // subtotal = subtotal - sumBonificacion + sumRecargo; // CASO #2 - aplico al subtotal desde precio base
                subtotal = cantidad * precio_unitario_dto;
                if (!subtotal){
                    subtotal = 0;
                }
                sumSubtotal = sumSubtotal + subtotal;
                sumVentaBruta = sumVentaBruta + (cantidad * precio_unitario); 
                // IVA
                iva = (items[i]["Bien"]["IVA"]);
                if (!iva){
                    iva = 0;
                }
                sumIva = sumIva + ((subtotal * (iva / 100)) * cantidad);
            }
        }
        else{
            for (var i = 0; i < items.length; i++) {
                // CANTIDAD
                cantidad = (items[i]["Cantidad"]);
                // PRECIO UNITARIO
                precio_unitario = (items[i]["Precio Original"]);
                if (!precio_unitario){
                    precio_unitario = 0;
                }
                // DESCUENTO
                descuento = (items[i]["Dto"]);
                if (!descuento){
                    descuento = 0;
                }
                descuento = descuento * (precio_unitario / 100);
                sumDto = sumDto + (descuento * cantidad);
                precio_unitario_dto = precio_unitario - descuento;
                // BONIFICACION
                bonificacion = parseFloat($("#bonificacion_general").val());
                if(!bonificacion){
                    bonificacion = 0;
                    parseFloat($("#bonificacion_general").val("0"));
                }
                bonificacion = precio_unitario_dto * (bonificacion / 100);
                sumBonificacion = sumBonificacion + parseFloat(bonificacion * cantidad);
                precio_unitario_dto = precio_unitario_dto - bonificacion; // applico al subtotal
                // RECARGO
                recargo = parseFloat($("#recargo_general").val());
                if(!recargo){
                    recargo = 0;
                    parseFloat($("#recargo_general").val("0"));
                }
                recargo = precio_unitario_dto * (recargo / 100);
                sumRecargo = sumRecargo + parseFloat(recargo * cantidad);
                precio_unitario_dto = precio_unitario_dto + recargo; // applico al subtotal
                // SUBTOTAL
                // subtotal = subtotal - sumBonificacion + sumRecargo; // CASO #2 - aplico al subtotal desde precio base
                subtotal = cantidad * precio_unitario_dto;
                if (!subtotal){
                    subtotal = 0;
                }
                sumSubtotal = sumSubtotal + subtotal;
                sumVentaBruta = sumVentaBruta + (cantidad * precio_unitario); 
                // IVA
                iva = (items[i]["IVA"]["Valor"]);
                if (!iva){
                    iva = 0;
                }
                sumIva = sumIva + ((subtotal * (iva / 100)) * cantidad); 
            }
        }

        // var total_general = sumSubtotal - (sumSubtotal * bonificacion / 100) + (sumSubtotal * recargo / 100);
        var total_general = sumSubtotal + sumIva;

        $("#subtotal_general").val((parseFloat(sumSubtotal).toFixed(2)));
        $("#bonificacion_importe").val((parseFloat(sumBonificacion).toFixed(2)));
        $("#recargo_importe").val((parseFloat(sumRecargo).toFixed(2)));
        $("#venta_bruta").val((parseFloat(sumVentaBruta).toFixed(2)));
        $("#descuento_total").val((parseFloat(sumDto).toFixed(2)));
        $("#iva_total").val((parseFloat(sumIva).toFixed(2)));
        if (total_general){
            $("#total_general").val((parseFloat(total_general).toFixed(2)));
        }
        else{
            total_general=0;
            $("#total_general").val((parseFloat(total_general).toFixed(2)));
        }
        $("#jsonitems").val(JSON.stringify(items));
    }

    // Calcular Importes Gravado/NoGravado/Exento + IVA
    actualizarImporteImpuesto();
}

function reiniciarSubcampos(){
    $("#forma_pago").val(-1).change();
    $("#subtotal_general").val("0.00");
    $("#bonificacion_importe").val("0.00");
    $("#recargo_importe").val("0.00");
    $("#venta_bruta").val("0.00");
    $("#descuento_total").val("0.00");
    $("#iva_total").val("0.00");
    $("#total_general").val("0.00");
    $("#jsonitems").val(JSON.stringify(items));
}

var item = null;
var item_ant = null;

// obtengo ID de eventos
function selectItem(e, pos) {
    $('#' + pos).toggleClass('item-seleccion');
    if ($('#' + pos).hasClass('item-seleccion')) {
        item_ant = item;
        if (item_ant) {
            $('#' + item_ant).toggleClass('item-seleccion');
        }
        // Guardo id de la fila seleccionada
        item = pos;
        $("#item_precio").val(items[pos]["Precio"]);
        $("#cantidad").val(1);
        $("#descuento").val(items[pos]["Dto"]);
        $("#iva option:selected").html(items[pos]["IVA"]);
        $("#subtotal").val(items[pos]["Precio"]);
        $("#idbien").val(items[pos]["Id"]);
        calculaSubtotal();
    } else {
        // Reseteo el item
        item = null;
        $("#item_precio").val(0);
        $("#cantidad").val(0);
        $("#descuento").val(0);
        $("#iva option:selected").html(0);
        $("#subtotal").val(0);
        $("#idbien").val(0);
    }
}

function removerBien(id) {
    //el id indica el inicio de donde se borra y el 1 la cantidad de elementos eliminados
    items.splice(id, 1);
    addItems(items, tipoTransaccion, idPersona, precioActualizado);
}

function removerBien2(event, id) {
    $.ajax({
        "dataType": "text",
        "type": "POST",
        "data": "temp",
        "url": '/' + tipoTransaccion + '/ajax/eliminarItem/' + id + '/' + idPersona,
        "success": function (msg) {
            document.location.reload();
        },
        "error": function (msg) {
            console.log("1-error!");
        }

    }).done(function () {
        console.log("1-done!");
    })
}

function seleccionaFormaPago() {

    if ($("#forma_pago option:selected").val() == '2') {
        $("#div_bonificacion").attr("hidden", "");
        $("#div_recargo").removeAttr("hidden");
    }

    if ($("#forma_pago option:selected").val() == '1') {
        $("#div_bonificacion").removeAttr("hidden");
        $("#div_recargo").attr("hidden", "");
    }

    reseteaFormaPago();
    calcularSubcampos();

}

function reseteaFormaPago() {
    $("#bonificacion_general").val('0.00');
    $("#recargo_general").val('0.00');
}

function toggleAttr(e, attr) {
    if ($("#" + e).attr(attr)) {
        $("#" + e).removeAttr(attr);
    } else {
        $("#" + e).attr(attr, "");
    }
}

function justNumbers(event) {
    var keynum = window.event ? window.event.keyCode : event.which;
    if ((keynum == 0) || (keynum == 8) || (keynum == 46)) {
        return true;
    }
    return /\d/.test(String.fromCharCode(keynum));
}

function justNumbersEnter(event) {
    var keynum = window.event ? window.event.keyCode : event.which;
    if (keynum == 13){
        $("#"+event.target.id).blur();
        return (keynum != 13);
    }
    if ( ((keynum == 0) || (keynum == 8) || (keynum == 46)) && (keynum != 13)) {
        return true;
    }
    return /\d/.test(String.fromCharCode(keynum));
}

// return (tecla != 13);

/////////////////////////// TODO LO QUE SIGUE ES PARA EDITAR LA TABLA DINAMICAMENTE ////////////////////
var selectedAnt = null;
var selectedNow = null;

function isFormatDescuento(inputValue) {
    if (inputValue != null) {
        return inputValue.substring(inputValue.length - 1) == "%";
    }
    return null;
}

function isFormatMoney(inputValue) {
    if (inputValue != null) {
        return inputValue.substring(0, 1) == "$";
    }
    return null;
}

function getNumberValue(inputValue) {
    if (isFormatDescuento(inputValue)) {
        if (inputValue.indexOf(' ')>0){
            inputValue=inputValue.substring(0, inputValue.indexOf(' '));
        }
        if (inputValue.indexOf('%')>0){
            inputValue=inputValue.substring(0, inputValue.indexOf('%'));
        }
        return inputValue
    } else if (isFormatMoney(inputValue)) {
        return inputValue.substring(2, inputValue.length);
    }
    return inputValue;
}

function getIndex(tdId) {
    return index = tdId.substring(0, tdId.indexOf('_'));
}

function getAttribute(tdId) {
    return attribute = tdId.substring(tdId.indexOf('_') + 1, tdId.length);
}

function controlStock(attribute, inputValue){
    if (tipoTransaccion=="remito"|| tipoTransaccion=="factura"|| tipoTransaccion=="pedido"){
        inputValue = parseFloat(inputValue);
        if(tipoPersona=="CLIENTE"){
            if (items[index]["Bien"]["Tipo"]=="PRODUCTO"){
                if (attribute=="Cantidad"){
                    var stock = parseFloat(items[index]["Bien"]["Stock"]);
                    if(stock<=inputValue){
                        if (tipoTransaccion=="remito"){
                            alert("No se puede agregar el item dado que la cantidad sobrepasa el stock disponible");
                            return false;
                        }
                        else{
                            if (confirm("La cantidad ingresada sobrepasa el Stock disponible. ¿Desea continuar?")){
                                return true
                            } else {
                                return false;
                            }
                        }
                    }
                }
            }
        }  
    }
    return true;
}

function saveValueInJson(tdId, inputValue) {
    //recibo "0_Cantidad" separo en indice 0 y atributo Cantidad
    index = tdId.substring(0, tdId.indexOf('_'));
    attribute = tdId.substring(tdId.indexOf('_') + 1, tdId.length);
    if (inputValue != null) {
        if (controlStock(attribute, inputValue)){
            if (attribute == "IVA") {
                inputValue = ivas[getIvaFromValue(inputValue)];
            }
            if (attribute=="Precio"){
                items[index]["Subtotal"] = inputValue;
            }
            else{
                items[index][attribute] = inputValue;
            }
        }
    }
    //ES NECESARIO GUARDAR LOS CAMBIOS EN EL INPUT HIDDEN DE HTML PARA OBTENER EL JSON CON DATA
    $("#jsonitems").val(JSON.stringify(items));
    // persistItemsInSession();
}
//esta funcion es llamada cuando se modifica el valor de un input
function saveValue(inputId) {
    tdId = inputId.substring(5);
    saveTd(tdId);
}

function actualizarJson(fila) {
    var col = ["Cantidad", "Dto", "ImpDto", "IVA", "Precio","Totales"];
    var index = fila + "_";

    for (var j = 0; j < col.length; j++) {
        var subindex = index + col[j];
        if (col[j] == "Precio"){
            items[fila]["Subtotal"] = getNumberValue(document.getElementById(subindex).innerText);
        }
        if (col[j]=="IVA"){
            var valorIva = document.getElementById(subindex).innerText;
            var ivajson = ivas[getIvaFromValue(valorIva)];
            items[fila]["IVA"] = ivajson;
        }else {
            items[fila][col[j]] = getNumberValue(document.getElementById(subindex).innerText);
        }
    }
    $("#jsonitems").val(JSON.stringify(items));
}

function actualizarFila(tdId) {
    index = getIndex(tdId);
    attribute = getAttribute(tdId);
    cant = document.getElementById(index + "_Cantidad").innerText;
    if (controlStock(attribute,cant)){
        precio = document.getElementById(index + "_Precio").innerText;
        precio = getNumberValue(precio);
        descuento = document.getElementById(index + "_Dto").innerText;
        descuento = getNumberValue(descuento);
        iva = document.getElementById(index + "_IVA").innerText;
        iva = getNumberValue(iva);
        cantxprecio = cant * precio;
        dto$ = cantxprecio  * descuento / 100;
        cantxprecioydto =cantxprecio -cantxprecio  * descuento / 100;
        document.getElementById(index + "_ImpDto").innerText = (parseFloat(dto$).toFixed(2));
        subtotal = cantxprecioydto + cantxprecioydto * iva / 100;
        ivaEnPeso =   cantxprecioydto * iva / 100;
        document.getElementById(index + "_ImpIVA").innerText = (parseFloat(ivaEnPeso).toFixed(2));
        document.getElementById(index + "_Totales").innerText = (parseFloat(subtotal).toFixed(2));
        actualizarJson(index);
        if ((tipoTransaccion=="nota de credito")|| (tipoTransaccion=="nota de debito")){
            calcularTotal();
        }else{
            calcularSubcampos();
        }
    }
}

//esta funcion es llamada para guardar el input anterior al generarse un nuevo input
function saveTd(tdId) {
    inputId = "input" + tdId;
    var inputValue;
    if (getAttribute(tdId) == "IVA") {
        var select = document.getElementById(inputId);
        inputValue = select.options[select.selectedIndex].text;
    }
    else {
        inputValue = document.getElementById(inputId).value;
    }
    numValue = getNumberValue(inputValue);
    inputElement = document.getElementById(inputId);
    if (inputElement != null) {
        inputElement.remove();
        td = document.getElementById(tdId);
        attribute = getAttribute(tdId);
        if ((attribute == "Dto") || (attribute == "IVA")) {
            td.innerText = ((parseFloat(numValue)).toFixed(2));;
        } 
        if (attribute=="Precio"){
            inputValue = ((parseFloat(numValue)).toFixed(2));;
            td.innerText = inputValue;
        } 
        else {
            td.innerText = inputValue;
        }
    }
    actualizarFila(tdId);
}

function pulsar(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    return (tecla != 13);
}

function getIvaFromValue(valor) {
    var ivaValor = getNumberValue(valor);
    for (var i = 0; i < ivas.length; i++) {
        if (ivas[i]["Valor"] == ivaValor) {
            return i;
        }
    }
    return 0;
}

//PARA EL IVA VA A TENER QUE SER DISTINTO, ESTO SIRVE PARA BONIFICACION Y CANTIDAD NOMAS
function makeEditable(event) {
    elementId = event.target.id;
    element = document.getElementById(elementId);
    if (selectedNow != null) {
        selectedAnt = selectedNow;
    }
    selectedNow = elementId;
    if (selectedAnt != null && selectedNow != selectedAnt) {
        saveTd(selectedAnt);
    }
    val = element.innerText;
    if (getAttribute(elementId) == "IVA") {
        //Create and append select list
        var selectList = document.createElement("select");
        selectList.id = "input" + elementId;
        selectList.name = "IVA";
        selectList.setAttribute("class", "form-control");
        selectList.setAttribute("onchange", "saveValue(id);");
        selectList.setAttribute("onkeypress", "return pulsar(event)");
        valor = element.innerText;
        element.innerText = "";
        element.appendChild(selectList);
        //Create and append the options

        var option = document.createElement("option");
        iva = getIvaFromValue(valor);
        option.value = getIvaFromValue(iva['Id']);
        option.text = valor;
        option.setAttribute("hidden", "");
        selectList.appendChild(option);


        var option = document.createElement("option");
        for (var i = 0; i < ivas.length; i++) {
            var option = document.createElement("option");
            option.value = ivas[i]['Id'];
            option.text = ivas[i]['Valor'];
            selectList.appendChild(option);
        }
    } else {
        var input = document.createElement("input");
        input.type = "text";
        input.className = "form-control"; // set the CSS class
        input.value = val;
        input.setAttribute("size", 3);
        input.id = "input" + elementId;
        input.setAttribute("onchange", "saveValue(id);");
        input.setAttribute("onkeypress", "return pulsar(event)");
        element.innerText = "";
        element.appendChild(input);
        // element.setAttribute('contenteditable', true);
    }
}

// * * * * * * * * * PARA AGREGAR ITEM DEL AUTOCOMPLETE * * * * * * * * * 
//agregar el item a la lista de la sesion 
function persistItemsInSession() {
    $.ajax({
        type: "POST",
        data: {
            json: JSON.stringify(items)
        },
        url: '/' + tipoTransaccion + '/ajax/setItems'
    }).done(function () {
        console.log("1-done!");
    })
}


function addItemToTable() {
    // Compara el Stock Disponible con la Cantidad ingresada
    updateOutputSelect();
    if (verificaStockDisponible(output)) {
        items.push(output);
        $("#jsonitems").val(JSON.stringify(items));
        addItems(items, tipoTransaccion, idPersona, precioActualizado);
    };
}

function updateOutputSelect() {
    // Elimina items sobrantes del json "output" y deja solo el seleccionado
    var result;
    var aux = Array.from(json_items);
    for (i = 0; i < aux.length; i++) {
        if (aux[i]["value"] == $('#item_id').val()) {
            result = aux.splice(i, 1);

            // result = result.splice(i,1);
            break;
        }
    }

    var item_precio = result[0]["precio"];
    var item_cantidad = $('#item_cantidad').val();
    var item_subtotal = item_precio * item_cantidad;
    var item_total = "0";

    var item_descuento = result[0]["descuento"];
    var item_importe_descuento = item_subtotal * (item_descuento/100);
    item_subtotal = item_subtotal - item_importe_descuento;

    var item_iva = result[0]["iva"];
    var item_iva = ivas[getIvaFromValue(item_iva)];
    var item_importe_iva = item_subtotal * (item_iva["Valor"]/100);
    item_total = item_subtotal + item_importe_iva;

    var item_gravado = "0";
    var item_no_gravado = "0";
    var item_exento = "0";
    switch (item_iva["Valor"]) {
        case "0.00":
            // EXENTO
            item_exento = item_subtotal;
            item_exento = (parseFloat(item_exento).toFixed(2));
            break;
        default:
            // GRAVADO
            item_gravado = item_subtotal;
            item_gravado = (parseFloat(item_gravado).toFixed(2));
            break;
    }

    item_importe_descuento = (parseFloat(item_importe_descuento).toFixed(2));
    item_importe_iva = (parseFloat(item_importe_iva).toFixed(2));
    item_subtotal = (parseFloat(item_subtotal).toFixed(2));
    item_total = (parseFloat(item_total).toFixed(2));

    output = null;
    output = {
        "Bien": {

            "Categoria": result[0]["categoria"],
            "Descripcion": result[0]["descripcion"],
            "Dto": result[0]["descuento"],
            "Id": result[0]["value"],
            "IVA": result[0]["iva"],
            "Nombre": result[0]["nombre"],
            "Precio": result[0]["precio"],
            "Totales": result[0]["totales"],
            "Tipo": result[0]['tipo'],
            "Stock": result[0]['stock'],
            "Impuesto": result[0]['impuesto'],
            "ImporteGravado": result[0]['importe_gravado'],
            "ImporteNoGravado": result[0]['importe_no_gravado'],
            "ImporteExento": result[0]['importe_exento']
        },
        "Cantidad": item_cantidad,
        "Dto": item_descuento,
        "IVA": item_iva,
        "ImpIVA": item_importe_iva, // "ImpIva": item_importe_iva,
        "Subtotal": item_subtotal,
        "ImpDto": item_importe_descuento,
        "Precio Original": item_precio, //"Precio Original": item_subtotal
        "Id": "",
        "ImporteGravado": item_gravado,
        "ImporteNoGravado": item_no_gravado,
        "ImporteExento": item_exento,
        "Totales": item_total
    }


    // Cambia el formato de "output" con "Bien: + IVA:"
    // output = {"Bien" : output[0], "Cantidad" : cantidad, "Dto (%)" : descuento, "IVA": iva  }
    clearAddItem();
}

function clearAddItem() {
    $('#item_id').val(null);
    $('#item_codigo').val(null);
    $('#item_nombre').val(null);
    $('#item_stock').val(null);
    $('#item_cantidad').val(null);

    // Tabla Detalles
    $('#item_descripcion').html(null);
    $('#item_categoria').html(null);
    $('#item_precio').html(null);
    $('#item_descuento').html(null);
    $('#item_descuento_precio').html(null);
    $('#item_iva').html(null);
    $('#item_iva_precio').html(null);
    $('#item_subtotal').html(null);

}

function verificaStockDisponible(output) {
    if(tipoPersona=="CLIENTE"){
        if (output["Bien"]["Tipo"]=="PRODUCTO"){
            var cant = parseFloat(output["Cantidad"]);
            if (cant > 0) {
                if (cant > parseFloat(output["Bien"]["Stock"])) {
                    if (tipoTransaccion=="remito"){
                        alert("No se puede agregar el item dado que la cantidad sobrepasa el stock disponible");
                        return false;
                    }
                    else{
                        if (confirm("La cantidad ingresada sobrepasa el Stock disponible. ¿Desea continuar?")){
                            return true
                        } else {
                            return false;
                        }
                    }
                } 
            } 
        }
    }
   return true;
    
}

function actualizarPrecios(){
    precioActualizado = true;
    actualizarItems();
    addItems(items, tipoTransaccion, idPersona, precioActualizado);
    calcularSubcampos(true);
}

function borrarItems(){
    items = [];
    $('#' + transaccion).toggleClass('item-');

    addItems(items, tipoTransaccion, idPersona, precioActualizado);
    // reiniciarSubcampos();
    completarTransacciones(transacciones);
}