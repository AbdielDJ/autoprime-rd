using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoPrime.Facturacion.Data;
using AutoPrime.Facturacion.Models;

namespace AutoPrime.Facturacion.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly AutoPrimeDbContext _context;

        public SeedController(AutoPrimeDbContext context)
        {
            _context = context;
        }
        [HttpPost("usuarios")]
        public async Task<IActionResult> CargarUsuarios()
        {
            if (await _context.Usuarios.AnyAsync())
                return Ok(new { mensaje = "Ya existen usuarios, no se crearon nuevos." });

            _context.Usuarios.AddRange(
                new Usuario
                {
                    NombreUsuario = "admin",
                    Nombre = "Abdiel de Jesús",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("autoprime2026"),
                    Rol = RolUsuario.Administrador,
                    Activo = true
                },
                new Usuario
                {
                    NombreUsuario = "cajero",
                    Nombre = "Cajero de Prueba",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("cajero2026"),
                    Rol = RolUsuario.Cajero,
                    Activo = true
                }
            );

            await _context.SaveChangesAsync();
            return Ok(new { mensaje = "Usuarios creados: admin/autoprime2026 (Administrador) y cajero/cajero2026 (Cajero)" });
        }
        // POST: api/seed/vehiculos
        [HttpPost("vehiculos")]
        public async Task<IActionResult> CargarVehiculos()
        {
            var codigosExistentes = await _context.Vehiculos
                .Select(v => v.Codigo)
                .ToListAsync();

            var nuevos = new List<Vehiculo>
            {
                new() {
                    Codigo = "AP-0001", Slug = "toyota-corolla-2021", Marca = "Toyota", Modelo = "Corolla",
                    Anio = 2021, Precio = 1250000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 48500, Motor = "1.8 L, 4 cilindros", Traccion = "Delantera",
                    ColorExterior = "Negro", ColorInterior = "Gris oscuro", Pasajeros = 5,
                    Descripcion = "Sedán cómodo, confiable y eficiente, ideal para uso diario y viajes familiares.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://todoautosni.com/wp-content/uploads/2025/05/TOYOTA-COROLLA-SE-2021-7.jpeg",
                        "https://toyotaxalapa.com.mx/wp-content/uploads/2025/10/corolla_negro.jpg",
                        "https://pictures-nigeria.jijistatic.net/179721541_MTAyMC03NjgtNWE0ZTU0MTNhMg.webp"
                    },
                    Caracteristicas = new() { "Cámara de reversa", "Pantalla multimedia", "Bluetooth", "Control de estabilidad", "Aire acondicionado", "Sensores de estacionamiento" }
                },
                new() {
                    Codigo = "AP-0002", Slug = "honda-civic-2020", Marca = "Honda", Modelo = "Civic",
                    Anio = 2020, Precio = 1180000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 52000, Motor = "2.0 L, 4 cilindros", Traccion = "Delantera",
                    ColorExterior = "Gris", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Diseño deportivo, manejo preciso y excelente rendimiento para ciudad y carretera.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://hips.hearstapps.com/hmg-prod/images/197749-honda-reveals-fresh-styling-and-enhanced-interior-for-civic-1573992310.jpg?crop=1.00xw:0.847xh;0,0.112xh&resize=1400:*",
                        "https://blog.consumerguide.com/wp-content/uploads/sites/2/2020/03/Screen-Shot-2020-03-27-at-3.01.58-PM-1-1110x577.png",
                        "https://www.delais.fr/voiture/honda/civic/livraisons/photo19265.webp"
                    },
                    Caracteristicas = new() { "Encendido por botón", "Cámara de reversa", "Control crucero", "Apple CarPlay", "Bluetooth", "Aros deportivos" }
                },
                new() {
                    Codigo = "AP-0003", Slug = "hyundai-tucson-2022", Marca = "Hyundai", Modelo = "Tucson",
                    Anio = 2022, Precio = 1850000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 36000, Motor = "2.0 L, 4 cilindros", Traccion = "Delantera",
                    ColorExterior = "Gris", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "SUV moderna, espaciosa y segura, perfecta para familias y trayectos largos.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfdCVOWRv7D94sc1PNabfOm3e8hNAMHoTzWyz15zDCXA&s=10",
                        "https://acroadtrip.blob.core.windows.net/publicaciones-imagenes/Large/hyundai/tucson/mx/RT_PU_501672914f7444c587c46bdad209c88c.webp",
                        "https://acroadtrip.blob.core.windows.net/publicaciones-imagenes/Large/hyundai/tucson/mx/RT_PU_581c399d463041bba34c286c68cd9595.webp"
                    },
                    Caracteristicas = new() { "Cámara 360°", "Sensores delanteros y traseros", "Pantalla táctil", "Asistente de carril", "Control crucero", "Baúl amplio" }
                },
                new() {
                    Codigo = "AP-0004", Slug = "toyota-vitz-2020", Marca = "Toyota", Modelo = "Vitz",
                    Anio = 2020, Precio = 750000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 61000, Motor = "1.3 L", Traccion = "Delantera",
                    ColorExterior = "Blanco", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Compacto, económico y fácil de estacionar, excelente para movilidad urbana.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://global.toyota/pages/release/309597/Vitz_RS_G_SPORTS_Concept_2_S.jpg",
                        "https://carsguide.ikman.lk/wp-content/uploads/2024/07/vitz-featured.jpg",
                        "https://th.bing.com/th/id/R.821e5d9ed371c9a547111a4230217330?rik=JTm8T%2fp8NP2GkQ&riu=http%3a%2f%2fcdn.justauto.com.au%2fad-assets%2f22584--985%2ffield_images%2fds_22584__985_07_032.jpg&ehk=vu2QaCcT77LiEgQcaXJemYRplF6XgmO3Y0JDwk7RuD0%3d&risl=&pid=ImgRaw&r=0"
                    },
                    Caracteristicas = new() { "Bajo consumo", "Bluetooth", "Aire acondicionado", "Cámara de reversa", "Vidrios eléctricos", "Control de estabilidad" }
                },
                new() {
                    Codigo = "AP-0005", Slug = "honda-fit-hybrid-2020", Marca = "Honda", Modelo = "Fit Hybrid",
                    Anio = 2020, Precio = 950000, Transmision = "Automática", Combustible = "Híbrido",
                    Kilometraje = 57000, Motor = "1.5 L híbrido", Traccion = "Delantera",
                    ColorExterior = "Blanco", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Versátil, espacioso y de consumo reducido gracias a su sistema híbrido.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://cultandclassic.com.au/wp-content/uploads/2025/08/Honda-Fit-3-2400x1600.jpg",
                        "https://img.supercarros.com/AdsPhotos/1024x768/0/14229196.jpg",
                        "https://img.supercarros.com/AdsPhotos/1024x768/0/14427285.jpg"
                    },
                    Caracteristicas = new() { "Sistema híbrido", "Asientos configurables", "Cámara de reversa", "Bluetooth", "Modo ECO", "Encendido por botón" }
                },
                new() {
                    Codigo = "AP-0006", Slug = "mazda-demio-2020", Marca = "Mazda", Modelo = "Demio",
                    Anio = 2020, Precio = 980000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 49000, Motor = "1.5 L Skyactiv", Traccion = "Delantera",
                    ColorExterior = "Rojo", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Compacto de diseño elegante, conducción ágil y buena eficiencia de combustible.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://www.autoconfisa.com/resources/img/car/88253/177568292677.jpeg",
                        "https://img.supercarros.com/AdsPhotos/1024x768/0/14087460.jpg",
                        "https://img.supercarros.com/AdsPhotos/1024x768/0/14087462.jpg"
                    },
                    Caracteristicas = new() { "Tecnología Skyactiv", "Pantalla multimedia", "Bluetooth", "Cámara de reversa", "Control de estabilidad", "Aros de aleación" }
                },
                new() {
                    Codigo = "AP-0007", Slug = "kia-k5-2021", Marca = "Kia", Modelo = "K5",
                    Anio = 2021, Precio = 1850000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 42000, Motor = "1.6 L Turbo", Traccion = "Delantera",
                    ColorExterior = "Gris", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Sedán premium con estilo deportivo, tecnología moderna y excelente confort.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://cdn.jdpower.com/JDPA_2021%20Kia%20K5%20EX%20Gravity%20Gray%20Rear%20Quarter%20View.jpg",
                        "https://tse3.mm.bing.net/th/id/OIP.xrTuQHK7D-mSQmPEBdDYmAHaEe?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
                        "https://th.bing.com/th/id/R.d1ce0f736f9f92ae73cec2bddcecd08e?rik=Fr%2bcp0SPI1eV%2bA&pid=ImgRaw&r=0"
                    },
                    Caracteristicas = new() { "Techo panorámico", "Pantalla digital", "Apple CarPlay", "Cámara de reversa", "Sensores de estacionamiento", "Asientos eléctricos" }
                },
                new() {
                    Codigo = "AP-0008", Slug = "ford-ranger-raptor-2025", Marca = "Ford", Modelo = "Ranger Raptor",
                    Anio = 2025, Precio = 3850000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 8500, Motor = "3.0 L V6 biturbo", Traccion = "4x4",
                    ColorExterior = "Naranja", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Camioneta de alto desempeño preparada para aventura, trabajo y terrenos exigentes.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://www.c3carecarcenter.com/wp-content/uploads/2025/05/Descubre-el-impresionante-Ford-Ranger-Raptor-Orange-2025-ahora.webp",
                        "https://res.cloudinary.com/dmwffxxj3/image/upload/f_auto,q_auto,w_1200,c_limit/v1778365437/autoexplora/vehicles/ixk1vzwwbxcsjvd0butn.jpg",
                        "https://wheelfront.com/wp-content/uploads/formidable/8/next-gen-ranger-raptor-with-vossen-hf6-4-wheels-1.jpeg"
                    },
                    Caracteristicas = new() { "Tracción 4x4", "Modos de terreno", "Suspensión de alto desempeño", "Cámara 360°", "Control de descenso", "Pantalla multimedia" }
                },
                new() {
                    Codigo = "AP-0009", Slug = "honda-accord-2021", Marca = "Honda", Modelo = "Accord",
                    Anio = 2021, Precio = 1450000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 45000, Motor = "1.5 L Turbo", Traccion = "Delantera",
                    ColorExterior = "Azul", ColorInterior = "Beige", Pasajeros = 5,
                    Descripcion = "Sedán amplio y refinado, reconocido por su confort, potencia y confiabilidad.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://bidhistory.org/uploads/8Vuhi7NyMNT4DtAzj34MsNFj0d/1hgcv1f48ma068191-honda-accord-2021-1.jpg",
                        "https://img.corotos.com.do/variants/mivt36aff8bt6qkqdlb03h78fp0x/ce679ccb626c0538ddf96ae31cb4fe352a5677a9ff9b875ffd4f22fc9348637b",
                        "https://tse2.mm.bing.net/th/id/OIP.0SmQE-YFa6LCnPEi4FAlgwHaFU?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                    },
                    Caracteristicas = new() { "Honda Sensing", "Techo solar", "Asientos eléctricos", "Apple CarPlay", "Cámara de reversa", "Control crucero adaptativo" }
                },
                new() {
                    Codigo = "AP-0010", Slug = "honda-civic-ex-2021", Marca = "Honda", Modelo = "Civic EX",
                    Anio = 2021, Precio = 1450000, Transmision = "Automática", Combustible = "Gasolina",
                    Kilometraje = 39000, Motor = "1.5 L Turbo", Traccion = "Delantera",
                    ColorExterior = "Azul", ColorInterior = "Negro", Pasajeros = 5,
                    Descripcion = "Versión equipada del Civic con motor turbo, seguridad avanzada y gran conectividad.",
                    Estado = EstadoVehiculo.Disponible,
                    Imagenes = new() {
                        "https://di-honda-enrollment.s3.amazonaws.com/2021/model-pages/civic_sedan/trims/honda_civic_sedan_ex.jpg",
                        "https://th.bing.com/th/id/R.32d71ccd02a4375032e12df71a78b057?rik=qFIh5at2XBayyg&pid=ImgRaw&r=0",
                        "https://www.carsjm.com/resources/cars/ACU/images/1.JPG"
                    },
                    Caracteristicas = new() { "Motor turbo", "Techo solar", "Honda Sensing", "Apple CarPlay", "Cámara de reversa", "Encendido remoto" }
                },
            };



            var aInsertar = nuevos.Where(v => !codigosExistentes.Contains(v.Codigo)).ToList();

            _context.Vehiculos.AddRange(aInsertar);
            await _context.SaveChangesAsync();

            return Ok(new { insertados = aInsertar.Count, omitidos = nuevos.Count - aInsertar.Count });
        }
    }
}