import type { LegalBundle } from "./legal-pages";

const COMPANY =
  "Lanzarote Experience Tours S.L.U., qui opère commercialement sous le nom Lanzarote Transfers";
const ADDRESS =
  "Calle Calderetas, 100, 35550 San Bartolomé, Lanzarote (Las Palmas), Espagne";
const CIF = "B76071836";
const LICENSE = "I-AV-0002407.1";
const EMAIL = "info@lanzarotetransfers.es";
const SUPPORT = "info@lanzarotetransfers.es";
const PHONE = "+34 646 08 05 85";

export const frLegal: LegalBundle = {
  privacy: {
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 9 septembre 2026",
    intro: `Cette politique explique comment ${COMPANY} traite les données personnelles des personnes qui visitent ce site ou y réservent. La marque publique est Lanzarote Transfers ; le responsable du traitement est la société indiquée, avec les mêmes données fiscales et de contact.`,
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          `${COMPANY}. CIF ${CIF}. Siège : ${ADDRESS}. Licence d'agence de voyages ${LICENSE}.`,
          `Contact : ${PHONE}, ${SUPPORT} et, pour exercer vos droits, ${EMAIL}.`,
        ],
      },
      {
        heading: "2. Données que nous collectons",
        paragraphs: [
          "Identité et contact : nom, e-mail, téléphone (indicatif compris) et, le cas échéant, données de facturation.",
          "Réservation : date et heure du service, nombre de passagers, hôtel ou point de prise en charge, numéro de vol, remarques et référence.",
          "Paiement : nous ne stockons pas le numéro complet de votre carte. Le paiement est traité par des prestataires tels que Stripe ou PayPal. Nous conservons l'état du paiement, les montants et les références nécessaires à la facturation et au suivi.",
          "Données techniques : adresse IP, langue, type d'appareil et données de navigation ou cookies, comme décrit dans la politique de cookies.",
        ],
      },
      {
        heading: "3. Finalités et bases juridiques",
        paragraphs: [
          "Gérer devis, réservations, bons, factures, modifications et annulations (exécution d'un contrat ou mesures précontractuelles, art. 6.1.b du RGPD).",
          "Répondre aux demandes par formulaire, e-mail, téléphone, WhatsApp ou l'assistant du site (intérêt légitime ou mesures précontractuelles).",
          "Respecter les obligations comptables, fiscales et de consommation (obligation légale, art. 6.1.c du RGPD).",
          "Envoyer des messages strictement liés à votre réservation. Nous n'envoyons pas de publicité sans votre consentement.",
        ],
      },
      {
        heading: "4. Destinataires",
        paragraphs: [
          "Chauffeurs nécessaires au transfert réservé (uniquement les données indispensables à la prise en charge et au trajet).",
          "Sous-traitants d'hébergement, d'e-mail, de stockage, de paiement ou d'administration, avec les garanties exigées par le RGPD.",
          "Administrations publiques lorsque la loi l'impose.",
          "Nous ne vendons pas vos données et ne les cédons pas à des fins étrangères à votre réservation ou à votre demande.",
        ],
      },
      {
        heading: "5. Conservation",
        paragraphs: [
          "Les données d'une réservation sont conservées pendant la relation contractuelle, puis pendant les délais légaux de facturation, de réclamation et d'obligations fiscales (en général jusqu'à 6 ans pour les documents commerciaux).",
          "Les demandes sans réservation sont supprimées ou anonymisées lorsqu'elles ne sont plus nécessaires, sauf obligation légale de conservation.",
        ],
      },
      {
        heading: "6. Transferts internationaux",
        paragraphs: [
          "Certains prestataires (paiement ou e-mail, par exemple) peuvent traiter des données hors de l'Espace économique européen. Nous exigeons alors les clauses types de la Commission européenne ou une autre garantie adéquate du RGPD.",
        ],
      },
      {
        heading: "7. Vos droits",
        paragraphs: [
          "Vous pouvez demander l'accès, la rectification, l'effacement, la limitation, l'opposition et la portabilité, et retirer votre consentement lorsque c'est la base juridique.",
          `Pour les exercer, écrivez à ${EMAIL} ou à ${ADDRESS}, en indiquant votre nom et le droit que vous souhaitez exercer. Nous pourrons vous demander une identification raisonnable.`,
          "Vous pouvez aussi introduire une réclamation auprès de l'Agence espagnole de protection des données (www.aepd.es).",
        ],
      },
      {
        heading: "8. Mineurs",
        paragraphs: [
          "Les réservations sont effectuées par un adulte. Les données de mineurs ne sont collectées que dans la mesure nécessaire à la place (âge ou catégorie tarifaire), sous la responsabilité de la personne qui réserve.",
        ],
      },
      {
        heading: "9. Sécurité et modifications",
        paragraphs: [
          "Nous appliquons des mesures techniques et organisationnelles raisonnables. Aucune transmission sur internet n'est absolument sûre.",
          "Nous pouvons mettre à jour cette politique. La version en vigueur est celle publiée sur ce site, avec sa date de mise à jour.",
        ],
      },
    ],
  },
  terms: {
    title: "Conditions de réservation et d'annulation",
    updated: "Dernière mise à jour : 9 septembre 2026",
    intro: `Ces conditions régissent la réservation de transferts privés et de services associés conclus sur ce site avec ${COMPANY} (marque Lanzarote Transfers).`,
    sections: [
      {
        heading: "1. Identification du prestataire",
        paragraphs: [
          `${COMPANY}. CIF ${CIF}. Adresse : ${ADDRESS}. Licence d'agence ${LICENSE}. Téléphone ${PHONE}. E-mail ${SUPPORT}.`,
        ],
      },
      {
        heading: "2. Objet",
        paragraphs: [
          "Le service est un transfert privé entre l'aéroport de Lanzarote (ACE) et les hôtels, villas ou autres points de l'île, dans les conditions affichées au moment de la réservation.",
          "Le tarif est par véhicule (sauf supplément indiqué). Le service est privé et n'est pas partagé avec d'autres clients.",
        ],
      },
      {
        heading: "3. Réservation",
        paragraphs: [
          "En réservant, vous confirmez être majeur et que les informations fournies sont exactes. Vous recevez un e-mail avec une référence. Le bon et, le cas échéant, la facture dépendent du moyen de paiement.",
          "Certaines demandes (groupes privés ou dates soumises à un minimum de voyageurs) peuvent rester en attente jusqu'à confirmation de notre équipe.",
        ],
      },
      {
        heading: "4. Prix et paiement",
        paragraphs: [
          "Les prix incluent les taxes applicables (IGIC sauf indication contraire) et ce que décrit la fiche du transfert (aller, retour ou aller-retour, destinations et suppléments).",
          "Vous pouvez payer par carte via une passerelle sécurisée (Stripe ou autre moyen activé), PayPal ou les options publiées, selon les conditions affichées au paiement.",
          "Les factures sont émises pour les montants encaissés par carte, conformément à la réglementation fiscale. Un paiement en espèces le jour même, lorsqu'il est autorisé, ne génère pas de facture pour ce montant s'il n'a pas été encaissé par voie électronique.",
        ],
      },
      {
        heading: "5. Prise en charge et ponctualité",
        paragraphs: [
          "À l'arrivée, le chauffeur attend dans le hall des arrivées de l'aéroport de Lanzarote (ACE) avec un panneau à votre nom. Au départ, la prise en charge se fait à l'hôtel ou au point indiqué, avec une marge suffisante avant le vol.",
          "Si votre vol est retardé, nous adaptons la prise en charge lorsque vous nous avez communiqué le numéro de vol. Vous êtes responsable de l'exactitude des informations de vol et d'hébergement.",
          "Si vous n'êtes pas au point de rendez-vous à l'heure convenue, le service peut être considéré comme une non-présentation, sans remboursement.",
        ],
      },
      {
        heading: "6. Annulation et modification par le client",
        paragraphs: [
          "Si nous recevons votre demande d'annulation ou de modification plus de 48 heures avant l'heure de prise en charge, le montant payé pour ce service est intégralement remboursé.",
          "Si l'annulation ou la modification intervient moins de 48 heures avant cette heure, aucun montant n'est remboursé.",
          "Vous pouvez gérer ou annuler via les liens de l'e-mail de confirmation ou « Gérer la réservation ». Un service peut prévoir un délai différent ; dans ce cas, les conditions confirmées pour cette réservation prévalent.",
        ],
      },
      {
        heading: "7. Annulation ou modification par l'entreprise",
        paragraphs: [
          "Nous pouvons annuler ou modifier un service en cas de force majeure, de météo, d'incident de circulation ou pour des raisons de sécurité. Nous proposons alors une alternative ou le remboursement du montant correspondant.",
          "Les horaires peuvent légèrement varier en raison du trafic ou des retards aériens.",
        ],
      },
      {
        heading: "8. Comportement et limites",
        paragraphs: [
          "Nous pouvons refuser ou interrompre un service si le comportement met en danger le chauffeur ou le véhicule. Aucun remboursement n'est dû dans ce cas.",
          "Nous ne disposons pas actuellement de minibus adaptés aux fauteuils roulants. Merci de nous consulter avant de réserver si vous avez des besoins d'accessibilité.",
        ],
      },
      {
        heading: "9. Responsabilité",
        paragraphs: [
          "Nous sommes responsables d'exécuter le transfert réservé avec un soin professionnel. Nous ne sommes pas responsables des pertes dues à des informations inexactes que vous fournissez, ni des retards aériens au-delà de ce que la loi exige.",
        ],
      },
      {
        heading: "10. Rétractation",
        paragraphs: [
          "Les services de loisirs liés à une date précise peuvent être exclus du droit de rétractation de 14 jours des contrats à distance. Les règles d'annulation de la section 6 s'appliquent.",
        ],
      },
      {
        heading: "11. Droit applicable",
        paragraphs: [
          "Le droit espagnol s'applique, y compris les règles de consommation des Canaries lorsqu'elles sont pertinentes. Les litiges relèvent des tribunaux du domicile du consommateur lorsque la loi le prévoit ; à défaut, des tribunaux d'Arrecife (Lanzarote).",
        ],
      },
    ],
  },
  cookies: {
    title: "Politique de cookies",
    updated: "Dernière mise à jour : 9 septembre 2026",
    intro: `Ce site, exploité par ${COMPANY} (marque Lanzarote Transfers), utilise des cookies et technologies similaires pour fonctionner et mémoriser vos préférences.`,
    sections: [
      {
        heading: "1. Que sont les cookies",
        paragraphs: [
          "Ce sont de petits fichiers enregistrés par votre navigateur. Ils peuvent être de session (supprimés à la fermeture du navigateur) ou persistants.",
        ],
      },
      {
        heading: "2. Cookies que nous utilisons",
        paragraphs: [
          "Indispensables : langue de navigation, session d'administration et fonctions de réservation. Sans eux, le site ne peut pas fournir le service demandé.",
          "Cookies techniques de tiers : les passerelles de paiement telles que Stripe ou PayPal peuvent déposer leurs propres cookies lors du paiement, selon leurs politiques.",
          "Nous n'utilisons pas de cookies publicitaires ou de remarketing, ni de profilage commercial sans lien avec votre réservation.",
        ],
      },
      {
        heading: "3. Base juridique",
        paragraphs: [
          "Les cookies strictement nécessaires reposent sur l'intérêt légitime et la fourniture du service. Tout cookie non indispensable ajouté à l'avenir exigerait un consentement préalable.",
        ],
      },
      {
        heading: "4. Comment les gérer",
        paragraphs: [
          "Vous pouvez accepter ou limiter les cookies non indispensables depuis le bandeau de ce site (ou via « Gérer les cookies » dans le pied de page). Vous pouvez aussi bloquer ou supprimer les cookies dans votre navigateur. Si vous désactivez les cookies indispensables, la langue ou le paiement peuvent cesser de fonctionner.",
        ],
      },
      {
        heading: "5. Plus d'informations",
        paragraphs: [
          `Pour toute question sur les cookies ou les données personnelles, écrivez à ${EMAIL} ou consultez la politique de confidentialité de ce site.`,
        ],
      },
    ],
  },
};
