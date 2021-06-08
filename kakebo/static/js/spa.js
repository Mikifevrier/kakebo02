const categorias = {
    CU: "Cultura",
    SU: "Supervivencia",
    OV: "Ocio-vicio",
    EX: "Extra"
}

function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) {
        const respuesta = JSON.parse(this.responseText)

        if (respuesta.status !== "success") {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }
    

        for (let i=0; i < respuesta.movimientos.length; i++) {
            const movimiento = respuesta.movimientos[i]
            const fila = document.createElement("tr")
            const dentro = `
                <td>${movimiento.fecha}</td>
                <td>${movimiento.concepto}</td>
                <td>${movimiento.esGasto ? "Gasto" : "Ingreso"}</td>
                <td>${movimiento.categoria ? categorias[movimiento.categoria] : ""}</td>
                <td>${movimiento.cantidad} €</td>
            `
            fila.innerHTML = dentro
            const tbody = document.querySelector(".tabla-movimientos tbody")       /*esto lo inserta dentro de tbody*/
            tbody.appendChild(fila)
        }
    }
}

xhr = new XMLHttpRequest()
xhr.onload = muestraMovimientos                                                  /*quien gestiona la llamada*/

function llamaApiMovimientos() {
    xhr.open("GET", `http://localhost:5000/api/v1/movimientos`, true)
    xhr.send()
}

window.onload = function() {                                /*esto se ejecutará una vez se cargue la página, cuando esté renderizada*/
    llamaApiMovimientos()
}