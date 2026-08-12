import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos previos (orden por FK)
  await prisma.item.deleteMany();
  await prisma.lostReport.deleteMany();
  await prisma.post.deleteMany();
  await prisma.event.deleteMany();
  await prisma.mapLocation.deleteMany();
  await prisma.user.deleteMany();

  // Usuarios
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const editorPassword = await bcrypt.hash("Editor123!", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Administrador",
      email: "admin@comunidad.local",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const editor = await prisma.user.create({
    data: {
      name: "Editor Apoyo",
      email: "editor@comunidad.local",
      password: editorPassword,
      role: "EDITOR",
    },
  });

  // Publicaciones / Noticias
  const now = new Date();

  await prisma.post.create({
    data: {
      title: "Terremoto en el Eje Cafetero y Cauca: cómo ayudar",
      slug: "terremoto-eje-cafetero-cauca-como-ayudar",
      excerpt:
        "Balance de la emergencia y las formas de apoyar a las familias afectadas por el sismo del 10 de agosto.",
      content:
        "El terremoto del 10 de agosto dejó graves afectaciones en el Eje Cafetero y el Cauca. Millones de familias necesitan alojamiento, alimentos, agua y atención médica. Aquí te contamos las formas más efectivas de ayudar: donar a los centros de acopio habilitados, ofrecer alojamiento temporal, sumarte como voluntario o difundir información verificada. Cada aporte, por pequeño que sea, hace la diferencia.",
      kind: "NOTICIA",
      category: "EMERGENCIA",
      status: "PUBLICADO",
      featured: true,
      authorId: admin.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Llamado urgente de voluntarios para centros de acopio",
      slug: "llamado-voluntarios-centros-acopio",
      excerpt:
        "Necesitamos manos para clasificar, empacar y distribuir la ayuda humanitaria en Armenia, Pereira y Popayán.",
      content:
        "La demanda de voluntarios es urgente. Los centros de acopio de Armenia, Pereira, Manizales y Popayán requieren personas para recibir, clasificar y empacar donaciones. Si puedes aportar algunas horas al día, inscríbete en el punto de información más cercano o escribe al WhatsApp de la red de apoyo.",
      kind: "PUBLICACION",
      category: "VOLUNTARIADO",
      status: "PUBLICADO",
      featured: true,
      authorId: editor.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Albergues habilitados: ubicación y capacidad",
      slug: "albergues-habilitados-ubicacion-capacidad",
      excerpt:
        "Directorio actualizado de albergues con cupo disponible para las familias evacuadas.",
      content:
        "Se han habilitado albergues en colegios, coliseos y sedes comunitarias de la región. Consulta el mapa de la red de apoyo para encontrar el albergue más cercano, su capacidad disponible y los servicios que ofrece. Si conoces un espacio que pueda servir como albergue, repórtalo a los puntos de información.",
      kind: "NOTICIA",
      category: "ALERTAS",
      status: "PUBLICADO",
      authorId: admin.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Colecta de agua, alimentos no perecederos y medicamentos",
      slug: "colecta-agua-alimentos-medicamentos",
      excerpt:
        "Convocatoria nacional de donaciones para las zonas más afectadas del Eje Cafetero y el Cauca.",
      content:
        "Las prioridades actuales son agua embotellada, alimentos no perecederos, pañales, fórmulas infantiles y medicamentos básicos. Los puntos de acopio están abiertos desde las 6:00 a.m. hasta las 10:00 p.m. Revisa el mapa para ubicar el centro más cercano y recuerda no enviar ropa sin clasificar.",
      kind: "NOTICIA",
      category: "DONACIONES",
      status: "PUBLICADO",
      featured: true,
      authorId: editor.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Historias de resiliencia: unidos frente a la emergencia",
      slug: "historias-resiliencia-unidos-frente-emergencia",
      excerpt:
        "Testimonios de solidaridad de las comunidades afectadas y de quienes han salido a apoyar.",
      content:
        "A pesar de la tragedia, la solidaridad no se detiene. Vecinos que abren sus puertas, jóvenes que organizan brigadas y familias enteras que comparten lo poco que tienen. Estas historias demuestran que la esperanza se construye en comunidad. Comparte tu historia para inspirar a más personas a sumarse a la red de apoyo.",
      kind: "PUBLICACION",
      category: "COMUNIDAD",
      status: "BORRADOR",
      authorId: admin.id,
    },
  });

  // Avisos / Eventos
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.event.createMany({
    data: [
      {
        title: "Brigada de rescate y búsqueda",
        description:
          "Brigada coordinada para labores de búsqueda y rescate en zonas afectadas. Punto de partida: centro de acopio de Armenia.",
        type: "RESCATE",
        location: "Centro de acopio Armenia",
        startAt: new Date(tomorrow.setHours(6, 0, 0, 0)),
        endAt: new Date(tomorrow.setHours(18, 0, 0, 0)),
      },
      {
        title: "Jornada de acopio de donaciones",
        description:
          "Recibimos agua, alimentos, medicamentos y elementos de aseo para las familias afectadas. Abierto a todo público.",
        type: "DONACION",
        location: "Centro de acopio Pereira",
        startAt: new Date(tomorrow.setHours(8, 0, 0, 0)),
        endAt: new Date(tomorrow.setHours(20, 0, 0, 0)),
      },
      {
        title: "Capacitación en primeros auxilios",
        description:
          "Taller gratuito de primeros auxilios y atención inicial para voluntarios de la red de apoyo.",
        type: "CAPACITACION",
        location: "Auditorio comunitario Manizales",
        startAt: new Date(nextWeek.setHours(9, 0, 0, 0)),
        endAt: new Date(nextWeek.setHours(13, 0, 0, 0)),
      },
      {
        title: "Voluntariado para albergues",
        description:
          "Convocatoria de voluntarios para apoyo en albergues: atención, logística y distribución de ayuda.",
        type: "VOLUNTARIADO",
        location: "Albergue central Popayán",
        startAt: new Date(now.setDate(now.getDate() + 2)),
      },
      {
        title: "Punto de hidratación y alimentos",
        description:
          "Instalación de punto de hidratación y distribución de alimentos para damnificados y voluntarios.",
        type: "ALBERGUE",
        location: "Parque principal Calarcá",
        startAt: new Date(tomorrow.setHours(10, 0, 0, 0)),
        endAt: new Date(tomorrow.setHours(16, 0, 0, 0)),
      },
    ],
  });

  // Personas / Animales perdidos
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  await prisma.lostReport.createMany({
    data: [
      {
        type: "PERSONA",
        status: "BUSQUEDA_ACTIVA",
        name: "Don Alberto Giraldo",
        description:
          "Hombre de 68 años, estatura media, cabello cano. Fue visto por última vez tras el sismo cerca del parque principal de Armenia. Viste camisa clara y pantalón oscuro.",
        characteristics: "68 años, cabello cano, camisa clara",
        lastLocation: "Parque principal de Armenia",
        latitude: 4.5333,
        longitude: -75.6811,
        lostDate: threeDaysAgo,
        contactType: "WHATSAPP",
        contactValue: "+57 300 000 0000",
        reporterId: admin.id,
      },
      {
        type: "ANIMAL",
        status: "PERDIDO",
        name: "Luna",
        description:
          "Perrita mestiza de tamaño mediano, pelaje color miel, collar rojo. Se separó de su familia durante la evacuación en Popayán.",
        characteristics: "Mediana, pelaje miel, collar rojo",
        lastLocation: "Casco urbano de Popayán",
        latitude: 2.4448,
        longitude: -76.6147,
        lostDate: tenDaysAgo,
        contactType: "TELEFONO",
        contactValue: "+57 311 111 1111",
        reporterId: editor.id,
      },
      {
        type: "PERSONA",
        status: "ENCONTRADO",
        name: "Niña Valentina Gómez",
        description:
          "Niña de 8 años encontrada en el albergue central. Ya se reunió con su familia.",
        characteristics: "8 años, mochila rosa",
        lastLocation: "Albergue central Calarcá",
        lostDate: tenDaysAgo,
        contactType: "EMAIL",
        contactValue: "contacto@redapoyocolombia.co",
        reporterId: admin.id,
      },
    ],
  });

  // Insumos / Ayuda
  await prisma.item.createMany({
    data: [
      {
        name: "Agua embotellada disponible",
        description:
          "Barriles de agua potable disponibles para reparto en el barrio. Coordinar por WhatsApp para la entrega.",
        category: "AGUA",
        location: "Punto de acopio Armenia",
        contactType: "WHATSAPP",
        contactValue: "+57 300 000 0000",
        publishedById: admin.id,
      },
      {
        name: "Alojamiento temporal ofrecido",
        description:
          "Familia ofrece habitaciones con servicios básicos para damnificados de la zona. Aceptan familias con niños.",
        category: "ALOJAMIENTO",
        location: "Sector norte de Pereira",
        contactType: "EMAIL",
        contactValue: "ayuda@redapoyocolombia.co",
        publishedById: editor.id,
      },
      {
        name: "Transporte para envío de donaciones",
        description:
          "Vehículo disponible para transportar donaciones desde Cali hasta los centros de acopio del Cauca.",
        category: "TRANSPORTE",
        location: "Cali, Valle del Cauca",
        contactType: "TELEFONO",
        contactValue: "+57 315 222 2222",
        publishedById: admin.id,
      },
      {
        name: "Atención médica de emergencia",
        description:
          "Brigada médica voluntaria ofrece atención general y pediátrica en el centro de salud habilitado.",
        category: "SERVICIOS",
        location: "Centro de salud de Manizales",
        contactType: "WHATSAPP",
        contactValue: "+57 313 333 3333",
        publishedById: editor.id,
      },
    ],
  });

  // Ubicaciones / Mapa
  await prisma.mapLocation.createMany({
    data: [
      {
        name: "Centro de acopio Armenia",
        type: "CENTRO_ACOPIO",
        latitude: 4.5333,
        longitude: -75.6811,
        address: "Bodega principal, carrera 14, Armenia, Quindío",
        hours: "Lun a Dom 6:00 - 22:00",
        phone: "+57 300 000 0000",
        description: "Centro de acopio principal: recibe agua, alimentos y medicamentos.",
      },
      {
        name: "Albergue central Calarcá",
        type: "ALBERGUE",
        latitude: 4.5287,
        longitude: -75.6465,
        address: "Coliseo municipal de Calarcá, Quindío",
        hours: "Abierto 24 horas",
        phone: "+57 311 111 1111",
        description: "Albergue con cupo para 300 personas, servicios de alimentación y salud.",
      },
      {
        name: "Centro de salud Popayán",
        type: "CENTRO_SALUD",
        latitude: 2.4448,
        longitude: -76.6147,
        address: "Calle 5 #10-25, Popayán, Cauca",
        hours: "Lun a Dom 7:00 - 21:00",
        phone: "+57 315 222 2222",
        description: "Punto de atención médica de emergencia y vacunación.",
      },
      {
        name: "Punto de información Manizales",
        type: "PUNTO_INFORMACION",
        latitude: 5.07,
        longitude: -75.5174,
        address: "Plaza principal de Manizales, Caldas",
        hours: "Lun a Dom 8:00 - 20:00",
        description: "Punto de información y registro de voluntarios.",
      },
      {
        name: "Punto de encuentro Pereira",
        type: "PUNTO_ENCUENTRO",
        latitude: 4.8133,
        longitude: -75.6961,
        address: "Parque El Lago, Pereira, Risaralda",
        hours: "Abierto 24 horas",
        description: "Punto de encuentro para distribución de ayuda y reunión de brigadas.",
      },
    ],
  });

  console.log("Seed completado correctamente.");
  console.log("Admin: admin@comunidad.local / Admin123!");
  console.log("Editor: editor@comunidad.local / Editor123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
