import type { Locale } from "./config";

export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalPageCopy = {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
};

export type LegalBundle = {
  privacy: LegalPageCopy;
  terms: LegalPageCopy;
  cookies: LegalPageCopy;
};

const COMPANY =
  "Lanzarote Experience Tours S.L.U., que opera comercialmente como Lanzarote Transfers";
const ADDRESS =
  "Calle Calderetas, 100, 35550 San Bartolomé, Lanzarote (Las Palmas), España";
const CIF = "B76071836";
const LICENSE = "I-AV-0002407.1";
const EMAIL = "info@lanzaroteexperiencetours.com";
const SUPPORT = "reservas@lanzarotetransfers.es";
const PHONE = "+34 646 08 05 85";

const es: LegalBundle = {
  privacy: {
    title: "Política de privacidad",
    updated: "Última actualización: 9 de septiembre de 2026",
    intro:
      `Esta política explica cómo ${COMPANY}, trata los datos personales de quienes visitan o reservan en este sitio. La marca pública es Lanzarote Transfers; la responsable del tratamiento es la sociedad indicada, con los mismos datos fiscales y de contacto.`,
    sections: [
      {
        heading: "1. Responsable del tratamiento",
        paragraphs: [
          `${COMPANY}. CIF ${CIF}. Domicilio social: ${ADDRESS}. Licencia de agencia de viajes ${LICENSE}.`,
          `Contacto: ${PHONE}, ${SUPPORT} y, para ejercer derechos de protección de datos, ${EMAIL}.`,
        ],
      },
      {
        heading: "2. Datos que recogemos",
        paragraphs: [
          "Identificativos y de contacto: nombre, apellidos, correo electrónico, teléfono (incluido el prefijo internacional) y, si procede, datos de facturación.",
          "De la reserva: fecha y hora del servicio, número de pasajeros, hotel o punto de recogida, número de vuelo, observaciones y localizador.",
          "De pago: no almacenamos el número completo de su tarjeta. El cobro lo procesan pasarelas como Stripe o PayPal. Conservamos el estado del pago, importes y referencias de transacción necesarias para facturar y atender incidencias.",
          "Técnicos: dirección IP, idioma, tipo de dispositivo y datos de navegación o cookies según se describe en la política de cookies.",
        ],
      },
      {
        heading: "3. Finalidades y bases jurídicas",
        paragraphs: [
          "Gestionar presupuestos, reservas, vouchers, facturas, cambios y cancelaciones (ejecución de un contrato o medidas precontractuales, art. 6.1.b RGPD).",
          "Atender consultas por formulario, correo, teléfono, WhatsApp o el asistente del sitio (interés legítimo o, si nos escribe usted, medidas precontractuales).",
          "Cumplir obligaciones contables, fiscales y de consumo (obligación legal, art. 6.1.c RGPD).",
          "Enviar comunicaciones estrictamente operativas sobre su reserva. No le enviaremos publicidad si no nos ha dado su consentimiento.",
        ],
      },
      {
        heading: "4. Destinatarios",
        paragraphs: [
          "Guías y conductores necesarios para prestar el traslado reservado (solo los datos imprescindibles para la recogida y el trayecto).",
          "Encargados de tratamiento que nos prestan hosting, correo, almacenamiento, pasarela de pago o herramientas de administración, con las garantías exigidas por el RGPD.",
          "Administraciones públicas cuando una norma lo imponga.",
          "No vendemos sus datos ni los cedemos para fines ajenos a la reserva o a la atención de su solicitud.",
        ],
      },
      {
        heading: "5. Conservación",
        paragraphs: [
          "Los datos de una reserva se conservan mientras dure la relación contractual y, después, durante los plazos legales de facturación, reclamaciones y obligaciones fiscales (en general, hasta 6 años para documentación mercantil).",
          "Las consultas sin reserva se eliminan o anonimizan cuando dejan de ser necesarias, salvo que deba conservarse un registro por obligación legal.",
        ],
      },
      {
        heading: "6. Transferencias internacionales",
        paragraphs: [
          "Algunos proveedores (por ejemplo, pasarelas de pago o correo) pueden tratar datos fuera del Espacio Económico Europeo. En ese caso exigimos cláusulas tipo de la Comisión Europea u otra garantía adecuada del RGPD.",
        ],
      },
      {
        heading: "7. Derechos",
        paragraphs: [
          "Puede solicitar acceso, rectificación, supresión, limitación, oposición y portabilidad, y retirar el consentimiento cuando la base jurídica sea esa.",
          `Para ejercerlos, escriba a ${EMAIL} o envíe un escrito a ${ADDRESS}, indicando su nombre y el derecho que desea ejercer. Podremos pedirle una identificación razonable.`,
          "También puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        heading: "8. Menores",
        paragraphs: [
          "Las reservas las realiza un adulto. Los datos de menores solo se recogen en la medida necesaria para la plaza (edad o categoría de tarifa) y bajo responsabilidad de quien reserva.",
        ],
      },
      {
        heading: "9. Seguridad y cambios",
        paragraphs: [
          "Aplicamos medidas técnicas y organizativas razonables para proteger los datos. Ninguna transmisión por internet es absolutamente segura.",
          "Podemos actualizar esta política. La versión vigente es la publicada en este sitio, con su fecha de actualización.",
        ],
      },
    ],
  },
  terms: {
    title: "Condiciones de contratación y cancelación",
    updated: "Última actualización: 9 de septiembre de 2026",
    intro:
      `Estas condiciones rigen la reserva de traslados privados y servicios relacionados contratados a través de este sitio con ${COMPANY} (marca Lanzarote Transfers).`,
    sections: [
      {
        heading: "1. Identificación del prestador",
        paragraphs: [
          `${COMPANY}. CIF ${CIF}. Domicilio: ${ADDRESS}. Licencia de agencia ${LICENSE}. Teléfono ${PHONE}. Correo ${SUPPORT}.`,
        ],
      },
      {
        heading: "2. Objeto y ámbito",
        paragraphs: [
          "El objeto es la prestación de traslados privados entre el Aeropuerto de Lanzarote (ACE) y hoteles, villas u otros puntos de la isla, en las condiciones publicadas al reservar.",
          "El precio se indica por vehículo (salvo extras publicados). El servicio es privado: no se comparte con otros clientes.",
        ],
      },
      {
        heading: "3. Proceso de reserva",
        paragraphs: [
          "Al completar una reserva usted declara ser mayor de edad y que los datos facilitados son veraces. Recibirá un correo con el localizador. El bono y, si procede, la factura se generan según el método de pago.",
          "Algunas solicitudes (por ejemplo, grupos privados o fechas sujetas a mínimo de participantes) pueden quedar pendientes de confirmación por nuestro equipo.",
        ],
      },
      {
        heading: "4. Precios y pagos",
        paragraphs: [
          "Los precios incluyen los impuestos aplicables (IGIC, salvo que se indique otra cosa) y lo descrito en la ficha del traslado (ida, vuelta o ida y vuelta, destinos y extras).",
          "Puede pagar con tarjeta a través de pasarela segura (Stripe u otros medios habilitados), PayPal u otras formas publicadas, en las condiciones que se muestren al reservar.",
          "Las facturas se emiten por los importes cobrados con tarjeta, de acuerdo con la normativa fiscal aplicable. El pago en efectivo el día del servicio, cuando esté permitido, no genera factura de ese importe si no se ha cobrado por medios electrónicos.",
        ],
      },
      {
        heading: "5. Recogida y puntualidad",
        paragraphs: [
          "En llegadas, el chófer le espera en la terminal de llegadas del Aeropuerto de Lanzarote (ACE) con un cartel con su nombre. En salidas, la recogida es en el hotel o punto indicado, con antelación suficiente respecto a su vuelo.",
          "Si su vuelo se retrasa, adaptamos la recogida siempre que nos haya facilitado el número de vuelo. Es su responsabilidad facilitar datos de vuelo y alojamiento correctos.",
          "Si no está en el punto de recogida a la hora convenida, el servicio puede considerarse no presentado sin derecho a reembolso.",
        ],
      },
      {
        heading: "6. Cancelación y cambios por el cliente",
        paragraphs: [
          "Si recibimos su solicitud de cancelación o cambio con más de 48 horas de antelación respecto a la hora de recogida del servicio, se le reembolsará el importe íntegro cobrado por ese servicio.",
          "Si la cancelación o el cambio se produce con menos de 48 horas respecto a esa hora, no se reembolsará ningún importe.",
          "Puede gestionar o cancelar desde los enlaces del correo de confirmación o desde «Gestionar reserva». La ficha de una actividad concreta puede indicar un plazo distinto; en caso de conflicto, prevalece lo indicado al confirmar esa reserva.",
        ],
      },
      {
        heading: "7. Cancelación o modificación por la empresa",
        paragraphs: [
          "Podemos cancelar o modificar un servicio por causas de fuerza mayor, meteorología adversa, incidencias de tráfico o razones de seguridad. En ese caso le ofreceremos una alternativa o el reembolso del importe correspondiente.",
          "Los horarios pueden ajustarse ligeramente por tráfico o por retrasos del vuelo.",
        ],
      },
      {
        heading: "8. Comportamiento y limitaciones",
        paragraphs: [
          "Nos reservamos el derecho de no admitir o de interrumpir el servicio si la conducta pone en riesgo al conductor o al vehículo. No se devolverá el importe en esos casos.",
          "Actualmente no disponemos de minibuses adaptados para silla de ruedas. Consulte antes de reservar cualquier necesidad de accesibilidad.",
        ],
      },
      {
        heading: "9. Responsabilidad",
        paragraphs: [
          "Respondemos de la correcta prestación del traslado contratado con la diligencia de una empresa profesional. No respondemos de daños derivados de información inexacta facilitada por el cliente ni de retrasos de vuelo imputables a la aerolínea, más allá de lo legalmente exigible.",
        ],
      },
      {
        heading: "10. Derecho de desistimiento",
        paragraphs: [
          "Los servicios de ocio para una fecha concreta pueden quedar excluidos del desistimiento de 14 días previsto para contratos a distancia, conforme a la normativa de consumidores. Se aplica la política de cancelación del apartado 6.",
        ],
      },
      {
        heading: "11. Ley y fuero",
        paragraphs: [
          "Se aplica la legislación española y, en lo que corresponda, la normativa de consumidores de Canarias. Para controversias, serán competentes los juzgados del domicilio del consumidor cuando así lo disponga la ley; en otro caso, los de Arrecife (Lanzarote).",
        ],
      },
    ],
  },
  cookies: {
    title: "Política de cookies",
    updated: "Última actualización: 9 de septiembre de 2026",
    intro:
      `Este sitio, operado por ${COMPANY} (marca Lanzarote Transfers), utiliza cookies y tecnologías similares para funcionar y recordar sus preferencias.`,
    sections: [
      {
        heading: "1. Qué son las cookies",
        paragraphs: [
          "Son pequeños archivos que el navegador guarda en su dispositivo. Pueden ser de sesión (se borran al cerrar) o persistentes (permanecen un tiempo).",
        ],
      },
      {
        heading: "2. Cookies que utilizamos",
        paragraphs: [
          "Necesarias: idioma de navegación, sesión del panel de administración y el funcionamiento de la reserva. Sin ellas el sitio no puede prestar el servicio que usted solicita.",
          "Técnicas de terceros: las pasarelas de pago (por ejemplo Stripe o PayPal) pueden establecer cookies propias al pagar. Su uso se rige por las políticas de esos proveedores.",
          "No usamos cookies publicitarias de remarketing ni perfiles comerciales ajenos a la reserva.",
        ],
      },
      {
        heading: "3. Base jurídica",
        paragraphs: [
          "Las cookies estrictamente necesarias se instalan sobre la base del interés legítimo y la prestación del servicio. Cualquier cookie no esencial, si se incorporara en el futuro, requeriría su consentimiento previo.",
        ],
      },
      {
        heading: "4. Cómo gestionarlas",
        paragraphs: [
          "Puede aceptar o limitar las cookies no esenciales desde el banner de este sitio (también en «Gestionar cookies» del pie). También puede bloquear o borrar cookies desde la configuración de su navegador. Si desactiva las necesarias, algunas funciones (idioma o pago) pueden dejar de funcionar.",
        ],
      },
      {
        heading: "5. Más información",
        paragraphs: [
          `Para cualquier duda sobre cookies o datos personales, escriba a ${EMAIL} o consulte la política de privacidad de este sitio.`,
        ],
      },
    ],
  },
};

const en: LegalBundle = {
  privacy: {
    title: "Privacy policy",
    updated: "Last updated: 9 September 2026",
    intro:
      `This policy explains how ${COMPANY} processes personal data of people who visit or book on this site. The public brand is Lanzarote Transfers; the data controller is the company named above, with the same tax details and contact addresses.`,
    sections: [
      {
        heading: "1. Data controller",
        paragraphs: [
          `${COMPANY}. Tax ID ${CIF}. Registered office: ${ADDRESS}. Travel agency licence ${LICENSE}.`,
          `Contact: ${PHONE}, ${SUPPORT} and, to exercise data-protection rights, ${EMAIL}.`,
        ],
      },
      {
        heading: "2. Data we collect",
        paragraphs: [
          "Identity and contact details: name, email, phone number (including international prefix) and, where needed, billing details.",
          "Booking details: service date and time, number of passengers, hotel or pickup point, flight number, notes and booking reference.",
          "Payment data: we do not store your full card number. Charges are processed by gateways such as Stripe or PayPal. We keep payment status, amounts and transaction references needed for invoicing and support.",
          "Technical data: IP address, language, device type and browsing or cookie data as described in the cookies policy.",
        ],
      },
      {
        heading: "3. Purposes and legal bases",
        paragraphs: [
          "Managing quotes, bookings, vouchers, invoices, changes and cancellations (performance of a contract or pre-contractual steps, Art. 6(1)(b) GDPR).",
          "Answering enquiries via form, email, phone, WhatsApp or the site assistant (legitimate interest or pre-contractual steps if you write to us).",
          "Accounting, tax and consumer-law duties (legal obligation, Art. 6(1)(c) GDPR).",
          "Sending operational messages about your booking. We will not send marketing unless you have consented.",
        ],
      },
      {
        heading: "4. Recipients",
        paragraphs: [
          "Drivers and suppliers needed to deliver the booked transfer (only the data required for pickup and the journey).",
          "Processors that provide hosting, email, storage, payment or admin tools, under GDPR-compliant terms.",
          "Public authorities where the law requires it.",
          "We do not sell your data or share it for purposes unrelated to your booking or enquiry.",
        ],
      },
      {
        heading: "5. Retention",
        paragraphs: [
          "Booking data is kept for the life of the contract and then for the statutory periods for invoicing, claims and tax (generally up to 6 years for commercial records).",
          "Enquiries without a booking are deleted or anonymised when no longer needed, unless a legal record must be kept.",
        ],
      },
      {
        heading: "6. International transfers",
        paragraphs: [
          "Some providers (for example payment or email) may process data outside the EEA. We then require EU Standard Contractual Clauses or another GDPR-adequate safeguard.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "You may request access, rectification, erasure, restriction, objection and portability, and withdraw consent where that is the legal basis.",
          `To exercise them, email ${EMAIL} or write to ${ADDRESS}, stating your name and the right you wish to exercise. We may ask for reasonable identification.`,
          "You may also lodge a complaint with the Spanish Data Protection Agency (www.aepd.es).",
        ],
      },
      {
        heading: "8. Children",
        paragraphs: [
          "Bookings are made by an adult. Children’s data is collected only as needed for the place (age or fare category) under the responsibility of the person booking.",
        ],
      },
      {
        heading: "9. Security and changes",
        paragraphs: [
          "We apply reasonable technical and organisational measures. No internet transmission is completely secure.",
          "We may update this policy. The current version is the one published on this site, with its update date.",
        ],
      },
    ],
  },
  terms: {
    title: "Booking and cancellation terms",
    updated: "Last updated: 9 September 2026",
    intro:
      `These terms govern bookings of private transfers and related services made on this site with ${COMPANY} (Lanzarote Transfers brand).`,
    sections: [
      {
        heading: "1. Trader details",
        paragraphs: [
          `${COMPANY}. Tax ID ${CIF}. Address: ${ADDRESS}. Agency licence ${LICENSE}. Phone ${PHONE}. Email ${SUPPORT}.`,
        ],
      },
      {
        heading: "2. Scope",
        paragraphs: [
          "We provide private transfers between Lanzarote Airport (ACE) and hotels, villas or other points on the island, on the terms published when you book.",
          "The fare is per vehicle (unless extras are listed). The service is private and is not shared with other customers.",
        ],
      },
      {
        heading: "3. Booking",
        paragraphs: [
          "By completing a booking you confirm you are an adult and that the details given are accurate. You will receive an email with a reference. The voucher and, where applicable, the invoice depend on the payment method.",
          "Some requests (for example private groups or dates subject to a minimum number of guests) may remain pending until our team confirms them.",
        ],
      },
      {
        heading: "4. Prices and payment",
        paragraphs: [
          "Prices include applicable taxes (IGIC unless stated otherwise) and what the transfer listing describes (one way, return or round trip, destinations and extras).",
          "You may pay by card via a secure gateway (Stripe or other enabled methods), PayPal or other published options, on the terms shown at checkout.",
          "Invoices are issued for amounts charged by card, in line with tax rules. Cash paid on the day, where allowed, does not generate an invoice for that amount if it was not collected electronically.",
        ],
      },
      {
        heading: "5. Pickup and punctuality",
        paragraphs: [
          "On arrivals, the driver waits in the arrivals hall at Lanzarote Airport (ACE) with a sign showing your name. On departures, pickup is at the hotel or stated point, with enough time before your flight.",
          "If your flight is delayed, we adjust pickup when you have given us the flight number. You are responsible for accurate flight and accommodation details.",
          "If you are not at the pickup point at the agreed time, the service may be treated as a no-show with no refund.",
        ],
      },
      {
        heading: "6. Cancellation and changes by the customer",
        paragraphs: [
          "If we receive your cancellation or change request more than 48 hours before the pickup time of the service, the amount paid for that service will be refunded in full.",
          "If cancellation or change occurs less than 48 hours before that time, no amount will be refunded.",
          "You can manage or cancel via the links in the confirmation email or “Manage booking”. A specific activity may state a different deadline; if so, the terms confirmed for that booking prevail.",
        ],
      },
      {
        heading: "7. Cancellation or change by us",
        paragraphs: [
          "We may cancel or change a service for force majeure, bad weather, traffic incidents or safety. We will then offer an alternative or a refund of the corresponding amount.",
          "Times may shift slightly due to traffic or airline delays.",
        ],
      },
      {
        heading: "8. Conduct and limitations",
        paragraphs: [
          "We may refuse or stop a service if conduct endangers the driver or the vehicle. No refund is due in those cases.",
          "We do not currently have wheelchair-adapted minibuses. Please ask before booking about accessibility needs.",
        ],
      },
      {
        heading: "9. Liability",
        paragraphs: [
          "We are responsible for delivering the contracted transfer with professional care. We are not liable for loss caused by inaccurate information you provide or airline delays beyond what the law requires.",
        ],
      },
      {
        heading: "10. Withdrawal",
        paragraphs: [
          "Leisure services for a specific date may be excluded from the 14-day distance-contract withdrawal right under consumer law. The cancellation rules in section 6 apply.",
        ],
      },
      {
        heading: "11. Law and venue",
        paragraphs: [
          "Spanish law applies, including Canary Islands consumer rules where relevant. Disputes will be heard by the courts of the consumer’s domicile where the law so provides; otherwise the courts of Arrecife (Lanzarote).",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookies policy",
    updated: "Last updated: 9 September 2026",
    intro:
      `This site, operated by ${COMPANY} (Lanzarote Transfers brand), uses cookies and similar technologies to work and to remember your preferences.`,
    sections: [
      {
        heading: "1. What cookies are",
        paragraphs: [
          "They are small files stored by your browser. They may be session cookies (deleted when you close the browser) or persistent cookies.",
        ],
      },
      {
        heading: "2. Cookies we use",
        paragraphs: [
          "Essential: browsing language, admin session and booking functions. Without them the site cannot provide the service you request.",
          "Third-party technical cookies: payment gateways such as Stripe or PayPal may set their own cookies at checkout, under their policies.",
          "We do not use advertising or remarketing cookies, or commercial profiling unrelated to your booking.",
        ],
      },
      {
        heading: "3. Legal basis",
        paragraphs: [
          "Strictly necessary cookies are used on the basis of legitimate interest and providing the service. Any non-essential cookies added in the future would require prior consent.",
        ],
      },
      {
        heading: "4. How to manage them",
        paragraphs: [
          "You can accept or limit non-essential cookies from the banner on this site (or via «Manage cookies» in the footer). You can also block or delete cookies in your browser settings. If you disable essential cookies, language or payment features may stop working.",
        ],
      },
      {
        heading: "5. Further information",
        paragraphs: [
          `For questions about cookies or personal data, email ${EMAIL} or read the privacy policy on this site.`,
        ],
      },
    ],
  },
};

const de: LegalBundle = {
  privacy: {
    title: "Datenschutzerklärung",
    updated: "Letzte Aktualisierung: 9. September 2026",
    intro:
      `Diese Erklärung beschreibt, wie ${COMPANY} personenbezogene Daten von Besuchern und Buchenden dieser Website verarbeitet. Die öffentliche Marke ist Lanzarote Transfers; Verantwortliche ist die oben genannte Gesellschaft mit denselben steuerlichen Angaben.`,
    sections: [
      {
        heading: "1. Verantwortliche Stelle",
        paragraphs: [
          `${COMPANY}. Steuernummer ${CIF}. Sitz: ${ADDRESS}. Reisebürolizenz ${LICENSE}.`,
          `Kontakt: ${PHONE}, ${SUPPORT} sowie für Datenschutzrechte ${EMAIL}.`,
        ],
      },
      {
        heading: "2. Welche Daten wir erheben",
        paragraphs: [
          "Identitäts- und Kontaktdaten: Name, E-Mail, Telefon (einschließlich Ländervorwahl) und gegebenenfalls Rechnungsdaten.",
          "Buchungsdaten: Datum und Uhrzeit, Passagierzahl, Hotel oder Abholpunkt, Flugnummer, Hinweise und Buchungsnummer.",
          "Zahlungsdaten: wir speichern nicht die vollständige Kartennummer. Zahlungen laufen über Anbieter wie Stripe oder PayPal. Wir behalten Zahlungsstatus, Beträge und Transaktionsreferenzen für Rechnung und Support.",
          "Technische Daten: IP-Adresse, Sprache, Gerät sowie Nutzungs- oder Cookie-Daten gemäß der Cookie-Richtlinie.",
        ],
      },
      {
        heading: "3. Zwecke und Rechtsgrundlagen",
        paragraphs: [
          "Angebote, Buchungen, Voucher, Rechnungen, Änderungen und Stornierungen (Vertragserfüllung bzw. vorvertragliche Maßnahmen, Art. 6 Abs. 1 lit. b DSGVO).",
          "Beantwortung von Anfragen per Formular, E-Mail, Telefon, WhatsApp oder Website-Assistent (berechtigtes Interesse bzw. vorvertragliche Schritte).",
          "Buchhaltungs-, Steuer- und verbraucherrechtliche Pflichten (rechtliche Verpflichtung, Art. 6 Abs. 1 lit. c DSGVO).",
          "Betriebliche Nachrichten zu Ihrer Buchung. Werbung versenden wir nur mit Einwilligung.",
        ],
      },
      {
        heading: "4. Empfänger",
        paragraphs: [
          "Fahrer und Partner, soweit für den gebuchten Transfer nötig.",
          "Auftragsverarbeiter für Hosting, E-Mail, Speicher, Zahlung oder Verwaltung, mit DSGVO-konformen Verträgen.",
          "Behörden, soweit gesetzlich vorgeschrieben.",
          "Wir verkaufen Ihre Daten nicht und geben sie nicht für artfremde Zwecke weiter.",
        ],
      },
      {
        heading: "5. Speicherdauer",
        paragraphs: [
          "Buchungsdaten bleiben für die Vertragsdauer und danach für gesetzliche Aufbewahrungsfristen (in der Regel bis zu 6 Jahre bei Handelsunterlagen).",
          "Anfragen ohne Buchung werden gelöscht oder anonymisiert, sobald sie nicht mehr benötigt werden, soweit keine gesetzliche Pflicht entgegensteht.",
        ],
      },
      {
        heading: "6. Drittlandtransfers",
        paragraphs: [
          "Einige Anbieter können Daten außerhalb des EWR verarbeiten. Dann verlangen wir Standardvertragsklauseln der EU-Kommission oder eine andere geeignete Garantie.",
        ],
      },
      {
        heading: "7. Ihre Rechte",
        paragraphs: [
          "Sie können Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit verlangen sowie eine Einwilligung widerrufen.",
          `Schreiben Sie an ${EMAIL} oder ${ADDRESS}. Wir können eine angemessene Identifizierung verlangen.`,
          "Sie können sich bei der Agencia Española de Protección de Datos (www.aepd.es) beschweren.",
        ],
      },
      {
        heading: "8. Minderjährige",
        paragraphs: [
          "Buchungen nimmt eine erwachsene Person vor. Daten von Kindern werden nur soweit für den Platz nötig (Alter oder Tarif) unter Verantwortung der buchenden Person erhoben.",
        ],
      },
      {
        heading: "9. Sicherheit und Änderungen",
        paragraphs: [
          "Wir setzen angemessene technische und organisatorische Maßnahmen ein. Keine Internetübertragung ist völlig sicher.",
          "Wir können diese Erklärung aktualisieren. Maßgeblich ist die auf dieser Website veröffentlichte Fassung mit Datum.",
        ],
      },
    ],
  },
  terms: {
    title: "Buchungs- und Stornierungsbedingungen",
    updated: "Letzte Aktualisierung: 9. September 2026",
    intro:
      `Diese Bedingungen gelten für Buchungen von privaten Transfers und verwandten Leistungen über diese Website bei ${COMPANY} (Marke Lanzarote Transfers).`,
    sections: [
      {
        heading: "1. Anbieter",
        paragraphs: [
          `${COMPANY}. Steuernummer ${CIF}. Anschrift: ${ADDRESS}. Lizenz ${LICENSE}. Telefon ${PHONE}. E-Mail ${SUPPORT}.`,
        ],
      },
      {
        heading: "2. Gegenstand",
        paragraphs: [
          "Gegenstand sind private Transfers zwischen dem Flughafen Lanzarote (ACE) und Hotels, Villen oder anderen Orten auf der Insel, zu den bei der Buchung veröffentlichten Bedingungen.",
          "Der Preis gilt pro Fahrzeug (soweit keine Zuschläge ausgewiesen sind). Der Service ist privat und wird nicht mit anderen Gästen geteilt.",
        ],
      },
      {
        heading: "3. Buchung",
        paragraphs: [
          "Mit Abschluss der Buchung bestätigen Sie, volljährig zu sein und wahrheitsgemäße Angaben gemacht zu haben. Sie erhalten eine E-Mail mit der Buchungsnummer.",
          "Manche Anfragen (z. B. Privatgruppen oder Termine mit Mindestteilnehmerzahl) bleiben bis zur Bestätigung durch unser Team vorbehaltlich.",
        ],
      },
      {
        heading: "4. Preise und Zahlung",
        paragraphs: [
          "Preise enthalten die jeweils geltenden Steuern (IGIC, soweit nicht anders angegeben) und das in der Beschreibung Genannte. Eintrittskarten können enthalten sein oder nicht.",
          "Zahlung per Karte über ein sicheres Gateway (Stripe oder andere freigeschaltete Wege), PayPal oder andere veröffentlichte Optionen. Manche Leistungen erlauben eine Anzahlung, der Rest am Leistungstag.",
          "Rechnungen werden über kartengestützte Beträge gemäß Steuerrecht ausgestellt. Barzahlungen am Leistungstag, soweit zulässig, erzeugen keine Rechnung über diesen Betrag, wenn er nicht elektronisch eingezogen wurde.",
        ],
      },
      {
        heading: "5. Abholung und Pünktlichkeit",
        paragraphs: [
          "Bei Ankunft wartet der Fahrer in der Ankunftshalle des Flughafens Lanzarote (ACE) mit einem Namensschild. Bei Abflug erfolgt die Abholung am Hotel oder angegebenen Punkt mit ausreichendem Vorlauf vor dem Flug.",
          "Bei Flugverspätung passen wir die Abholung an, wenn Sie uns die Flugnummer mitgeteilt haben. Flug- und Unterkunftsangaben müssen korrekt sein.",
          "Erscheinen Sie nicht rechtzeitig am Abholpunkt, gilt die Leistung als nicht in Anspruch genommen; eine Erstattung entfällt.",
        ],
      },
      {
        heading: "6. Stornierung und Änderung durch den Kunden",
        paragraphs: [
          "Geht Ihre Stornierung oder Änderung mehr als 48 Stunden vor der Abholzeit der Leistung ein, erstatten wir den für diese Leistung gezahlten Betrag vollständig.",
          "Bei weniger als 48 Stunden vor diesem Zeitpunkt wird kein Betrag erstattet.",
          "Verwaltung und Storno sind über die Links in der Bestätigungsmail oder „Buchung verwalten“ möglich. Eine konkrete Leistung kann eine andere Frist nennen; dann gilt die bei dieser Buchung bestätigte Regelung.",
        ],
      },
      {
        heading: "7. Absage oder Änderung durch uns",
        paragraphs: [
          "Wir können eine Leistung bei höherer Gewalt, schlechtem Wetter, Verkehrsproblemen oder Sicherheitsgründen absagen oder ändern. Dann bieten wir eine Alternative oder die Erstattung des entsprechenden Betrags.",
          "Uhrzeiten können sich durch Verkehr oder Flugverspätungen leicht verschieben.",
        ],
      },
      {
        heading: "8. Verhalten und Einschränkungen",
        paragraphs: [
          "Wir können die Leistung verweigern oder abbrechen, wenn das Verhalten Fahrer oder Fahrzeug gefährdet. In diesen Fällen erfolgt keine Erstattung.",
          "Derzeit haben wir keine rollstuhlgerechten Minibusse. Bitte klären Sie Barrierefreiheit vor der Buchung.",
        ],
      },
      {
        heading: "9. Haftung",
        paragraphs: [
          "Wir haften für die vertragsgemäße Erbringung des Transfers mit der Sorgfalt eines professionellen Unternehmens. Nicht für Schäden aus unrichtigen Kundenangaben oder Flugverspätungen der Airline über das gesetzlich Geschuldete hinaus.",
        ],
      },
      {
        heading: "10. Widerruf",
        paragraphs: [
          "Freizeitleistungen zu einem bestimmten Termin können vom 14-tägigen Widerrufsrecht bei Fernabsatz ausgenommen sein. Es gelten die Stornoregeln in Abschnitt 6.",
        ],
      },
      {
        heading: "11. Recht und Gerichtsstand",
        paragraphs: [
          "Es gilt spanisches Recht einschließlich der kanarischen Verbrauchervorschriften, soweit einschlägig. Zuständig sind die Gerichte am Wohnsitz des Verbrauchers, soweit gesetzlich vorgesehen, sonst die Gerichte von Arrecife (Lanzarote).",
        ],
      },
    ],
  },
  cookies: {
    title: "Cookie-Richtlinie",
    updated: "Letzte Aktualisierung: 9. September 2026",
    intro:
      `Diese Website, betrieben von ${COMPANY} (Marke Lanzarote Transfers), verwendet Cookies und ähnliche Technologien für den Betrieb und Ihre Einstellungen.`,
    sections: [
      {
        heading: "1. Was Cookies sind",
        paragraphs: [
          "Kleine Dateien im Browser. Sitzungs-Cookies werden beim Schließen gelöscht; persistente Cookies bleiben länger gespeichert.",
        ],
      },
      {
        heading: "2. Welche Cookies wir nutzen",
        paragraphs: [
          "Erforderlich: Sprache, Admin-Sitzung sowie Buchungsfunktionen. Ohne sie kann die angeforderte Leistung nicht erbracht werden.",
          "Technische Cookies Dritter: Zahlungsanbieter wie Stripe oder PayPal können beim Bezahlen eigene Cookies setzen.",
          "Wir nutzen keine Werbe- oder Remarketing-Cookies und kein Profiling außerhalb der Buchung.",
        ],
      },
      {
        heading: "3. Rechtsgrundlage",
        paragraphs: [
          "Unbedingt erforderliche Cookies beruhen auf berechtigtem Interesse und der Leistungserbringung. Nicht essenzielle Cookies würden künftig eine Einwilligung voraussetzen.",
        ],
      },
      {
        heading: "4. Verwaltung",
        paragraphs: [
          "Über das Banner dieser Website (oder «Cookies verwalten» im Footer) können Sie nicht essenzielle Cookies akzeptieren oder ablehnen. Sie können Cookies auch im Browser blockieren oder löschen. Deaktivieren Sie erforderliche Cookies, können Sprache oder Zahlung ausfallen.",
        ],
      },
      {
        heading: "5. Weitere Informationen",
        paragraphs: [
          `Fragen zu Cookies oder Daten richten Sie an ${EMAIL} oder an die Datenschutzerklärung dieser Website.`,
        ],
      },
    ],
  },
};

const bundles: Record<Locale, LegalBundle> = { es, en, de };

export function getLegalPages(locale: Locale): LegalBundle {
  return bundles[locale] ?? bundles.es;
}
