// Función helper para limpiar y convertir precios
const limpiarPrecio = (texto) => {
    const limpio = texto.replace(/[^\d.,]/g, '')
    const numero = limpio.replace(/\./g, '').replace(',', '.')
    return Number(numero)
}

// Función para extraer precio de un contenedor
const extraerPrecio = ($container) => {
    const todosLosTextos = []

    $container.find('*').each((i, el) => {
        const texto = $(el).text().trim()
        // Solo elementos con texto corto que puedan ser precios
        if (texto.length > 0 && texto.length < 15) {
            todosLosTextos.push(texto)
        }
    })

    // Buscar patrones de precio
    const precios = todosLosTextos.filter(t =>
        /^\$?\s*\d{1,2}[.,]\d{3}/.test(t) || // $1.470 o 1.470
        /^\d{3,4}$/.test(t) // 1470
    )

    return precios.length > 0 ? precios[0] : null
}

describe('Validar diferencia entre dólar blue y euro blue', () => {

    Cypress.on('uncaught:exception', (err, runnable) => {
        return false
    })

    it('La diferencia no debe superar el 50%', () => {
        cy.visit('https://www.dolarito.ar')
        cy.wait(4000)

        // Estrategia: buscar "blue" y obtener todo el contenedor padre
        cy.get('body').then(($body) => {
            // Buscar el elemento que contiene "blue" (puede ser con emoji o sin él)
            const $blueElement = $body.find(':contains("blue")').filter((i, el) => {
                const text = $(el).text().toLowerCase()
                return text.includes('blue') && text.length < 100
            }).first()

            if ($blueElement.length === 0) {
                throw new Error('No se encontró elemento con "blue"')
            }

            // Obtener el contenedor padre más grande
            const $container = $blueElement.closest('div').parent().parent()
            const precioTexto = extraerPrecio($container)

            if (precioTexto) {
                const valor = limpiarPrecio(precioTexto)
                cy.log(`💵 Dólar Blue: ${precioTexto} → ${valor}`)
                cy.wrap(valor).as('dolarBlue')
            } else {
                cy.log('Contenedor HTML:', $container.html())
                throw new Error('No se pudo extraer el valor del Dólar Blue')
            }
        })

        // Hacer clic en Euro
        cy.contains(/euro/i).first().click({ force: true })
        cy.wait(3000)

        // Obtener Euro Blue
        cy.get('body').then(($body) => {
            const $blueElement = $body.find(':contains("blue")').filter((i, el) => {
                const text = $(el).text().toLowerCase()
                return text.includes('blue') && text.length < 100
            }).first()

            if ($blueElement.length === 0) {
                throw new Error('No se encontró elemento con "blue" en la pestaña Euro')
            }

            const $container = $blueElement.closest('div').parent().parent()
            const precioTexto = extraerPrecio($container)

            if (precioTexto) {
                const valor = limpiarPrecio(precioTexto)
                cy.log(`💶 Euro Blue: ${precioTexto} → ${valor}`)
                cy.wrap(valor).as('euroBlue')
            } else {
                cy.log('Contenedor HTML:', $container.html())
                throw new Error('No se pudo extraer el valor del Euro Blue')
            }
        })

        // Validar diferencia
        cy.get('@dolarBlue').then((dolarBlue) => {
            cy.get('@euroBlue').then((euroBlue) => {
                const diferencia = Math.abs(dolarBlue - euroBlue) / dolarBlue

                cy.log(`💵 Dólar Blue: $${dolarBlue}`)
                cy.log(`💶 Euro Blue: $${euroBlue}`)
                cy.log(`📊 Diferencia absoluta: $${Math.abs(dolarBlue - euroBlue).toFixed(2)}`)
                cy.log(`📈 Diferencia porcentual: ${(diferencia * 100).toFixed(2)}%`)

                expect(
                    diferencia,
                    'La diferencia entre el euro y el dólar supera el 50%'
                ).to.be.lte(0.5)
            })
        })
    })
})
