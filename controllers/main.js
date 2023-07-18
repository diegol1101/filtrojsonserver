
const URL = "http://localhost:3000"
const headers = new Headers ({'Content-Type': 'application/json'});

const tbodydepartamentos = document.getElementById("tbodyDepartamentos");
const formdepartamento = document.getElementById("formdepartamento");
const formactualizardepartamento = document.getElementById("formactualizardepartamento");
const formciudad = document.getElementById("formciudad");

/*formulario departamento*/

getdepartamento(); 

formdepartamento.addEventListener("submit",(e)=>{

    e.preventDefault();
    let data=Object.fromEntries(new FormData(e.target));
    console.log(data);
    postDepartamentos(data);

})

/*select departamentos*/
function conocerdepartamentos(departamentos){
    let categoryId=document.querySelector("#conociudades");
    categoryId.innerHTML="";
    departamentos.forEach((element)=>{
        let option = document.createElement("option");
        console.log(element);
        option.setAttribute("value",`${element.id}`);
        option.innerHTML = `${element.nomDepartamento}`;
        categoryId.appendChild(option);
    })
}

/*get departamentos*/
async function getdepartamento(){
    let departamentos = await(await fetch(`${URL}/Departamentos`)).json();
    conocerdepartamentos(departamentos)
    renderizardepartamentos(departamentos)
    seleciudad(departamentos)
}

/*metodo post departamentos*/
async function postDepartamentos(data){

    let config ={
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    }

    let departamentos = await(await fetch(`${URL}/Departamentos`,config)).json();
}

function renderizardepartamentos(data){

    const tbodyDepartamentos = document.getElementById("tbodyDepartamentos");

    tbodyDepartamentos.innerHTML= "";
    data.forEach((departamento)=>{

        let tr = document.createElement("tr");
        tr.setAttribute("id",`${departamento.id}`);
        tr.setAttribute("class","tr");
        tr.innerHTML=`
        <td>${departamento.id}</td>
        <td>${departamento.nomDepartamento}</td>
        <td>
            <input type="submit" data-accion="Eliminar" value="Eliminar" class="btn btn-outline-danger">
            <input type="button" data-bs-toggle="modal" data-bs-target="#modalModificar"  data-accion="Actualizar" value="Actualizar" class="btn btn-outline-info px-2">
        </td>
        `;
        tbodyDepartamentos.appendChild(tr);
    })
}

tbodydepartamentos.addEventListener("click",(e)=>{
    e.preventDefault();

    let tr = e.target.closest("tr");
    let id = tr.id;

    let accion = e.target.dataset.accion;

    if(accion==="Eliminar"){
        deletedepartamentos(tr,id);
        tr.remove();
    }
    else if(accion==="Actualizar"){

        formactualizardepartamento.addEventListener("submit",(e)=>{
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.target));

            putdepartamentos(data,id);
        })
    }

})

/*metodo put departamentos*/

async function putdepartamentos(data,id){

    let config = {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(data)
    };

    let put = await(await fetch(`${URL}/Departamentos/${id}`,config)).json();
}

/*metodo eliminar departamentos*/
async function deletedepartamentos(tr,id){
    let data = Object.fromEntries(new FormData(tr.target));

    let config = {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(data)
    };

    let del = await(await fetch(`${URL}/Departamentos/${id}`,config)).json();

}

/*formulario ciudades*/

formciudad.addEventListener("submit",(e)=>{
    e.preventDefault();

    let data = Object.fromEntries(new FormData(e.target));
    console.log(data);
    postCiudades(data);
})

/*select ciudades*/
function seleciudad(departamentos){

    let seleciudad = document.querySelector("#selecdepartamento");
    seleciudad.innerHTML="";
    departamentos.forEach((element)=>{
        let option = document.createElement("option");
        option.setAttribute("value",`${element.id}`);
        option.innerHTML = `${element.nomDepartamento}`;
        seleciudad.appendChild(option)
    });
}

/*metodo post ciudades*/

async function postCiudades (data){

    let config ={
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
    }

    let ciudades = await(await fetch(`${URL}/Ciudades`,config)).json();
}

/*get ciudades*/

async function filtro(identificacion){
    let ciudades = await (await fetch (`${URL}/Ciudades?departamentoId=${identificacion}`)).json();
    return ciudades
}

const select = document.getElementById("conociudades");
select.addEventListener("change",async (e)=>{
    e.preventDefault();

    let identificacion = e.target.value;

    let ciudades = await filtro(identificacion);
    let tbody = document.getElementById("renderciudades")
    let str = ""
    ciudades.forEach((element)=>{
        str +=`
            <div class="col col-md-3" id="${element.id}">
                <div class="card" style="width: 18rem;">
                    <img src="${element.imagen}" class="card-img-top" alt="...">
                    <div class="card-body" id="${element.id}" >
                        <h5 class="card-title">${element.nomCiudad}</h5>
                        <p class="card-text">latitud: ${element.lat} </p>
                        <p class="card-text">longitud: ${element.lon}</p>
                        <div id="clima"> </div>
                        <input type="submit" data-accion="Eliminar" value="Eliminar" class="btn btn-outline-danger">
                        <input type="button" data-bs-toggle="modal" data-bs-target="#modalModificar"  data-accion="Actualizar" value="Actualizar" class="btn btn-outline-info px-2">
                    </div>
                </div>
            </div>
        `
        try{
            let url = "https://api.openweathermap.org/data/2.5/weather?lat=7.12539&lon=-73.1198&units=metric&appid=b5fdd3955f472fd1077dbe4db72a8e66";
            
            fetch(url)
            .then(respuesta=> {
                return respuesta.json();
                //console.log(respuesta);
            })
            .then(datos=>{
                console.log(datos);
                buildHtml(datos)
            });
            
            
            }
            catch (error) {
                throw 'Error al obtener los datos';
            }
            
            
        
    })
    tbody.innerHTML= str
    tbody.addEventListener("click",(e)=>{
        e.preventDefault();
    
        let div = e.target.closest("div");
        let id = div.id;
        let accion = e.target.dataset.accion;
        console.log(id);
        if(accion==="Eliminar"){
            deleteciudad(div,id);
            console.log(id);
        }
    });
});


function buildHtml(clima){
    let contenedor= document.getElementById("clima")

    contenedor.innerHTML+= `
                            <p> Pais: ${clima.sys.country}</p>
                            <p> Ciudad: ${clima.name}</p> 
                            <p> Longitud: ${clima.coord.lon}</p> 
                            <p> Latitud: ${clima.coord.lat}</p>
                            <p> Temperatura: ${clima.main.temp} °C</p>
                            <p> Sensacion Temp: ${clima.main.feels_like} °C</p>
                            <p> Temperatura Max: ${clima.main.temp_max} °C</p>
                            <p> Temperatura Min: ${clima.main.temp_min}°C</p>  
                            ` 

};

async function deleteciudad(tr,id){

    let data = Object.fromEntries(new FormData(tr.target));

    let config = {
        method: 'DELETE',
        headers: headers,
        body: JSON.stringify(data)
    };
    /* console.log(id); */
    let del = await(await fetch(`${URL}/Ciudades/${id}`,config)).json();
}

