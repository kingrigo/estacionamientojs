//Mascara para el input de patentes

let oldPatente = [/[A-Z]/i,/[A-Z]/i,/[A-Z]/i,/\d/,/\d/,/\d/,];
let newPatente = [/[A-Z]/i,/[A-Z]/i,/\d/,/\d/,/\d/,/[A-Z]/i,/[A-Z]/i];
let newInput = document.getElementById("newInput");
let maskedInputController = vanillaTextMask.maskInput({
    inputElement: newInput,
    mask: oldPatente,
    guide: false
})

let arreglo = ((JSON.parse(localStorage.getItem("arrayElements")) == null) ? [[[],[]],[[],[]],[[],[]]] : JSON.parse(localStorage.getItem("arrayElements")) ) ;
let cont = ((JSON.parse(localStorage.getItem("cantidad")) == null) ? [0,0,0] : JSON.parse(localStorage.getItem("cantidad")) ) ;
let registro = ((JSON.parse(localStorage.getItem("registro")) == null) ? [] : JSON.parse(localStorage.getItem("registro")) ) ;
let totalRecaudado = ((JSON.parse(localStorage.getItem("totalRecaudado")) == null) ? 0 : JSON.parse(localStorage.getItem("totalRecaudado")) ) ;
let sizes = ((JSON.parse(localStorage.getItem("sizes")) == null) ? [3,5,3] : JSON.parse(localStorage.getItem("sizes")) ) ;
let fees = ((JSON.parse(localStorage.getItem("fees")) == null) ? [20,10,30] : JSON.parse(localStorage.getItem("fees")) ) ;

let helper = ["Autos", "Motos", "Camionetas"];
let cat = 0;
window.categoria = "Autos";
document.getElementById("agregarBtn").setAttribute('onclick', 'addPark()');
document.getElementById("autoC").setAttribute('onclick', 'categClick(event,0)');
document.getElementById("motoC").setAttribute('onclick', 'categClick(event,1)');
document.getElementById("camionetaC").setAttribute('onclick', 'categClick(event,2)');
document.getElementById("precioBtn").setAttribute('onclick', 'abrirModal(1)');
document.getElementById("espacioBtn").setAttribute('onclick', 'abrirModal(2)');
document.getElementById("historialBtn").setAttribute('onclick','abrirModal(3)');


//Agregar nuevo
const hayLugar = (size,arreg,cat) => {
    if(arreg[cat][0].length < size[cat]){
        return true;
    }else{
        return false;
    }
}
const addPark = () => {
    let inputValue = document.getElementById('newInput').value;
    let s = document.getElementById('patenteSelect').value
    let e = document.getElementById('errorText');
    //Validar si ya no existe
    if (inputValue.length === parseInt(s)){
        if ((arreglo[0][0].indexOf(inputValue) === -1) && (arreglo[1][0].indexOf(inputValue) === -1) && (arreglo[2][0].indexOf(inputValue) === -1)){
            if(hayLugar(sizes,arreglo,cat)){
                arreglo[cat][0].push(inputValue)
                arreglo[cat][1].push(Date())
                cont[cat] += 1;
            }else{
                e.innerText = "Error: No hay más lugar en el estacionamiento"
            }
            registro.push('Ingreso ' + inputValue + ' ' + Date().toString().slice(16,21))
            localStorage.setItem('arrayElements', JSON.stringify(arreglo));
            localStorage.setItem('cantidad', JSON.stringify(cont));
            localStorage.setItem('registro', JSON.stringify(registro));
        }else{
            e.innerText = "Error: Esta patente ya fue ingresada"
        }
    }else{
        e.innerText = "Error: Por favor verifique la patente";
    }
    // if ((inputValue.length === parseInt(s)) && (arreglo[0][0].indexOf(inputValue) === -1) && (arreglo[1][0].indexOf(inputValue) === -1) && (arreglo[2][0].indexOf(inputValue) === -1) ){
        
    // }
    setTimeout(()=>{ e.innerText=""}, 2500);
    document.getElementById('newInput').value = '';
    printPark(arreglo,cat);
}

const printPark = (arrayy,cat) => {
    document.getElementById("parkID").innerHTML = "";
    for(let i = 0; i < arrayy[cat][0].length; i++){
        let li = document.createElement('div');
        li.className = 'columns is-mobile';
        let divt = document.createElement('div');
        let t = document.createTextNode(arrayy[cat][0][i])
        divt.className = ('column is-7');
        divt.appendChild(t);
        let divd = document.createElement('div');
        let d = document.createTextNode(arrayy[cat][1][i].toString().slice(16,21));
        let spand = document.createElement('span');
        spand.className = ("tag is-warning");
        divd.className = ('column is-3');
        spand.appendChild(d);
        divd.appendChild(spand);
        let divDel = document.createElement('div');
        let del = document.createElement('i');
        del.className = 'fas fa-arrow-up';
        divDel.className = 'column is-2'
        divDel.appendChild(del);
        divDel.setAttribute('onclick', `abrirModal(0,'${arrayy[cat][0][i]}','${arrayy[cat][1][i].toString().slice(16,21)}',${cat})`)
         li.appendChild(divt);
         li.appendChild(divd);
         li.appendChild(divDel);
        document.getElementById("parkID").appendChild(li);
        
    }
    document.getElementById("autoT").innerText = cont[0];
    document.getElementById("motoT").innerText = cont[1];
    document.getElementById("camionetaT").innerText = cont[2];
}

const categClick = (e,categoria) =>{
    cat = categoria;
    switch (categoria){
        case 0:
            document.getElementById("motoC").className = '';
            document.getElementById("camionetaC").className = '';
            break;
        case 1:
            document.getElementById("autoC").className = '';
            document.getElementById("camionetaC").className = '';
            break;
        case 2:
            document.getElementById("autoC").className = '';
            document.getElementById("motoC").className = '';
            break;
    }
    e.target.parentElement.className = 'is-active';
    printPark(arreglo, categoria);
}
const abrirModal = (tipo, patente = "", hora = "", cat = 0) =>{
    let m = document.getElementById('modal');
    let mT = document.getElementById('modalTitle');
    let mC = document.getElementById('modalContent');
    let submit = document.getElementById('submitBtn');
    submit.style.visibility = 'visible';
    switch (tipo){
        case 0:
        //Si es salida de vehiculo
            mT.innerText = "CheckOut Vehiculo";
            let d = document.createElement('div');
            let s1 = document.createElement('span');
            let s2 = document.createElement('span');
            let s3 = document.createElement('span');

            let t1 = document.createTextNode(patente);
            let t2 = document.createTextNode(hora);
            let tarifa = getPrecio(hora,cat);
            let t3 = document.createTextNode(tarifa);
            s1.classList = "tag has-text-danger is-medium";
            s2.classList = "tag has-text-black is-medium";
            s3.classList = "tag has-text-success is-medium";
            s1.appendChild(t1);
            s2.appendChild(t2);
            s3.appendChild(t3);
            d.appendChild(s1);
            d.appendChild(s2);
            d.appendChild(s3);
            mC.appendChild(d);
        //SI APRETA BOTON DE CONFIRMAR, VENDER Y SUMAR AL TOTAL, Y BORRAR EL ELEMENTO
            submit.setAttribute('onclick',`guardarDinero('${patente}',${cat},${tarifa})`);
            break;
        case 1:
        //MOSTRAR INPUT CON EL PRECIO DE LA HORA
            mT.innerText = "Configurar Precios";
            for(let i=0; i < 3; i++){
                let d = document.createElement('div');
                let lb = document.createElement('label')
                let inp = document.createElement('input')
                d.classList = "field";
                lb.classList = "label"
                lb.innerText = "Precio hora " + helper[i];
                inp.value = fees[i];
                inp.classList = "input";
                inp.setAttribute("type", "number");
                inp.setAttribute("id", "precio" + i)
                d.appendChild(lb);
                d.appendChild(inp);
                mC.appendChild(d);

            }
            submit.setAttribute('onclick',`actArreglo(false)`);
            break;
        case 2:
        //ESPACIO
            mT.innerText = "Configurar Espacios";
            for(let i=0; i < 3; i++){
                let d = document.createElement('div');
                let lb = document.createElement('label')
                let inp = document.createElement('input')
                d.classList = "field";
                lb.classList = "label"
                lb.innerText = "Espacios " + helper[i];
                inp.value = sizes[i];
                inp.classList = "input";
                inp.setAttribute("type", "number");
                inp.setAttribute("id", "espacio" + i)
                d.appendChild(lb);
                d.appendChild(inp);
                mC.appendChild(d);
            }
            submit.setAttribute('onclick',`actArreglo(true)`);
            break;
        case 3:
            //REGISTRO
            mT.innerText = "Registro";
            for(let i=0; i < registro.length; i++){
                let lb = document.createElement('label');
                lb.classList = 'label';
                lb.innerText = registro[i];
                mC.appendChild(lb);
            }
            submit.style.visibility = 'hidden'
            document.getElementById('cancelarBtn').innerText = "Salir";
            break;
    }
    m.classList += " is-active"
}
const cerrarModal = () =>{
    //Borrar contenido
    document.getElementById("modalTitle").innerText = "";
    document.getElementById("modalContent").innerHTML = "";
    document.getElementById("submitBtn").visibility = "visible";
    
    m = document.getElementById("modal").classList = "modal";
}
const actArreglo = (v)  => {
    if(v){
        //Actualizo espacio
        sizes[0] = espacio0.value;
        sizes[1] = espacio1.value;
        sizes[2] = espacio2.value;
        localStorage.setItem('sizes', JSON.stringify(sizes));
    }else{
        //Actualizo tarifas
        fees[0] = precio0.value;
        fees[1] = precio1.value;
        fees[2] = precio2.value;
        localStorage.setItem('fees', JSON.stringify(fees));
    }
    cerrarModal();
  }

const cambPatente = () =>{
    let v = document.getElementById('patenteSelect').value
    maskedInputController.destroy()
    
    if (v === "6") {
        maskedInputController = vanillaTextMask.maskInput({
            inputElement: newInput,
            mask: oldPatente,
            guide: false
        })
    }else{
        maskedInputController = vanillaTextMask.maskInput({
            inputElement: newInput,
            mask: newPatente,
            guide: false
        })
    }
}

const getPrecio = (entrada,cat) =>{
    let t1 = moment.duration(entrada,"HH:mm");
    //Salida es el momento en el que se presiona el boton;

    let t2 = moment.duration(Date().toString().slice(16,21), "HH:mm");
    let tiempo = t2.subtract(t1);
    //tiempo.asMinutes() es el tiempo total
    return (tiempo.asMinutes() * (fees[cat] / 60)).toFixed(2);
}

const guardarDinero = (pat,cat,saldo) => {
    totalRecaudado += saldo;
    document.getElementById("moneySpan").innerText = totalRecaudado;
    let i = arreglo[cat][0].indexOf(pat);
    arreglo[cat][0].splice(i, 1);
    arreglo[cat][1].splice(i, 1);
    cont[cat] -= 1;
    registro.push('Salio ' + pat + ' $' + saldo);
    localStorage.setItem('arrayElements', JSON.stringify(arreglo));
    localStorage.setItem('cantidad', JSON.stringify(cont));
    localStorage.setItem('registro', JSON.stringify(registro));
    localStorage.setItem('totalRecaudado', JSON.stringify(totalRecaudado));
    cerrarModal();
    printPark(arreglo,cat);
}

printPark(arreglo,0);
document.getElementById("moneySpan").innerText = totalRecaudado;