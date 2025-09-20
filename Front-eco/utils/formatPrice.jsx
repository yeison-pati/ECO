// Función para formatear precios con separadores de miles (15000 => 15.000)
export function formatPrice(price) {
    return price.toLocaleString('es-ES');
};