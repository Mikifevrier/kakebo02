const categorias = {
    CU: "Cultura",
    SU: "Supervivencia",
    OV: "Ocio-vicio",
    EX: "Extra"
}

let losMovimientos

function recibeRespuesta() {
    if (this.readyState === 4 && this.status === 200) {
        const respuesta = JSON.parse(this.responseText)

        if(respuesta.status !== "success") {
            alert("Se ha producido un error en acceso a servidor " + respuesta.mensaje)
            return
        }
        
        llamaApiMovimientos()
    }
}

function detallaMovimiento(id) {
    let movimiento
    for (let i=0; i<losMovimientos.length; i++) {
        const item = losMovimientos[i]
        if (item.id == id) {                        /* debemos hacer que la posición coincida con el id que buscamos */
            movimiento = item
            break
        }
    }

    if (!movimiento) return

    document.querySelector("#idMovimiento").value = id  /*podemos guardarlo en el http */
    document.querySelector("#fecha").value = movimiento.fecha
    document.querySelector("#concepto").value = movimiento.concepto
    document.querySelector("#categoria").value = movimiento.categoria
    document.querySelector("#cantidad").value = movimiento.cantidad.toFixed(2) /* para que me redondee*/
    if (movimiento.esGasto == 1) {
        document.querySelector("#gasto").checked = true         /*checked hace que el radio salga seleccionado*/
    } else {
        document.querySelector("#ingreso").checked = true       /*aquí igual, selecciona el otro*/
    }
}

function muestraMovimientos() {
    if (this.readyState === 4 && this.status === 200) {
        const respuesta = JSON.parse(this.responseText)

        if (respuesta.status !== "success") {
            alert("Se ha producido un error en la consulta de movimientos")
            return
        }

        losMovimientos = respuesta.movimientos
        const tbody = document.querySelector(".tabla-movimientos tbody")       /*esto lo inserta dentro de tbody*/
        tbody.innerHTML = ""

        for (let i=0; i < respuesta.movimientos.length; i++) {
            const movimiento = respuesta.movimientos[i]
            const fila = document.createElement("tr")
            fila.addEventListener("click", () => {
                detallaMovimiento(movimiento.id)
            })

            const dentro = `
                <td>${movimiento.fecha}</td>
                <td>${movimiento.concepto}</td>
                <td>${movimiento.esGasto ? "Gasto" : "Ingreso"}</td>
                <td>${movimiento.categoria ? categorias[movimiento.categoria] : ""}</td>
                <td>${movimiento.cantidad} €</td>
            `
            fila.innerHTML = dentro
            tbody.appendChild(fila)
        }
    }
}

xhr = new XMLHttpRequest()

function llamaApiMovimientos() {
    xhr.open("GET", `http://localhost:5000/api/v1/movimientos`, true)
    xhr.onload = muestraMovimientos                                                  /*quien gestiona la llamada asincrona*/
    xhr.send()
}

window.onload = function() {                                /*esto se ejecutará una vez se cargue la página, cuando esté renderizada, o si no se puede quedar pillada*/
    llamaApiMovimientos()

    document.querySelector("#modificar")
        .addEventListener("click", (ev) => {
            ev.preventDefault()
            const movimiento = {}
            movimiento.fecha = document.querySelector("#fecha").value
            movimiento.concepto = document.querySelector("#concepto").value
            movimiento.categoria = document.querySelector("#categoria").value
            movimiento.cantidad = document.querySelector("#cantidad").value
            if (document.querySelector("#gasto").checked) {
                movimiento.esGasto = 1
            } else {
                movimiento.esGasto = 0
            }
            
            id = document.querySelector("#idMovimiento").value
            xhr.open("PUT", `http://localhost:5000/api/v1/movimiento/${id}`, true)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
            xhr.onload = recibeRespuesta
            xhr.send(JSON.stringify(movimiento))

        })
}