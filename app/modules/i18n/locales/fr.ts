import meta from "stories/Button.stories"

export default {
  createAccount: {
    continueButton: "Continuer avec l'adresse e-mail",
    heading: "Continuer avec la pile RUSH",
    meta: {
      description: "Réinitialisez votre mot de passe pour la pile RUSH",
      title: "Réinitialisation du mot de passe"
    },
    subheading: "Veuillez saisir votre adresse e-mail. Nous vous enverrons un lien et un mot de passe à usage unique pour vous connecter. Vous serez ensuite dirigé vers l'endroit où vous pourrez réinitialiser votre mot de passe."
  },
  global: {
    formLabels: {
      email: "Adresse e-mail",
      password: "Mot de passe"
    },
    languageSelector: "Sélectionnez une langue",
    login: "Connexion",
    signUp: "S'inscrire"
  },
  home: {
    featuresHeading: "Caractéristiques",
    heading: "Pile Rush",
    meta: {
      description: "Bienvenue sur Remix!",
      title: "Pile Rush"
    },
    subTitle: "Une pile complète pour Remix"
  },
  logIn: {
    heading: "Connectez-vous à votre compte",
    meta: {
      description: "Connectez-vous à votre compte",
      title: "Connexion"
    },
    noAccountText: "Vous n'avez pas de compte?",
    subheading: "Entrez votre adresse e-mail et votre mot de passe pour vous connecter"
  }
}
