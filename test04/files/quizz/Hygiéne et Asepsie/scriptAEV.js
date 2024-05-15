//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: []
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml
    };
    this.update();
  
    let feedbackText;
    if (detail.answer.isCorrect) {
      feedbackText = "Correct! ";
    } else {
      feedbackText = "Incorrect. ";
    }
    feedbackText += detail.answer.comment; // Ajouter le commentaire à la réponse
  
    this.questionFeedback.innerHTML = feedbackText;
  
    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer
        }
      })
    );
  };
  

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("div");
    this.questionText.classList.add("titreQuestion");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer
            }
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Exact !";
    incorrectFeedback = "Non.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
  {
    text: "Qu'est-ce qu'un accident d'exposition à un risque viral ?",
    answers: [
        {
            text: "Toute exposition percutanée ou contact direct avec du sang ou un liquide biologique souillé par du sang.",
            isCorrect: true,
            comment: "Effectivement, un accident d'exposition à un risque viral est défini comme toute exposition percutanée (par piqûre ou coupure) ou tout contact direct sur une peau lésée ou des muqueuses avec du sang ou un liquide biologique souillé par du sang."
        },
        {
            text: "Toute exposition à des substances toxiques.",
            isCorrect: false,
            comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
        },
        {
            text: "Toute exposition à des substances radioactives.",
            isCorrect: false,
            comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
        },
        {
            text: "Toute exposition à des bactéries ou des champignons.",
            isCorrect: false,
            comment: "Cette réponse ne correspond pas à la définition donnée d'un accident d'exposition à un risque viral."
        }
    ]
},
{
    text: "Quels sont les liquides biologiques considérés comme présentant un risque de transmission des virus VIH, VHB et VHC lors d'un accident d'exposition ?",
    answers: [
        {
            text: "Sang, salive, urine, liquide amniotique.",
            isCorrect: false,
            comment: "La salive, les urines et le liquide amniotique ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC, sauf s'ils contiennent du sang."
        },
        {
            text: "Sang, salive, sperme, sécrétions vaginales.",
            isCorrect: true,
            comment: "Exact, le sang, la salive, le sperme et les sécrétions vaginales présentent un risque de transmission des virus VIH, VHB et VHC. En effet la salive peut contenir du sang."
        },
        {
            text: "Sang, urine, liquide céphalo-rachidien, sécrétions nasales.",
            isCorrect: false,
            comment: "Les urines, le liquide céphalo-rachidien et les sécrétions nasales ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC."
        },
        {
            text: "Sang, sueur, larmes, liquide synovial.",
            isCorrect: false,
            comment: "La sueur, les larmes et le liquide synovial ne sont pas considérés comme présentant un risque de transmission des virus VIH, VHB et VHC."
        }
    ]
},
{
    text: "Quels sont les principaux risques associés à un accident d'exposition à un risque viral ?",
    answers: [
        {
            text: "Infection par des bactéries et des champignons.",
            isCorrect: false,
            comment: "Les principaux risques associés à un accident d'exposition à un risque viral sont la transmission des virus VIH, VHB et VHC, et non l'infection par des bactéries et des champignons."
        },
        {
            text: "Transmission des virus VIH, VHB et VHC.",
            isCorrect: true,
            comment: "C'est exact, les principaux risques associés à un accident d'exposition à un risque viral sont la transmission des virus VIH, VHB et VHC."
        },
        {
            text: "Développement de maladies auto-immunes.",
            isCorrect: false,
            comment: "Les maladies auto-immunes ne sont pas directement associées à un accident d'exposition à un risque viral."
        },
        {
            text: "Réaction allergique sévère.",
            isCorrect: false,
            comment: "Les réactions allergiques ne sont pas directement associées à un accident d'exposition à un risque viral."
        }
    ]
},
{
    text: "Quels signes doivent alerter concernant un accident d'exposition à un risque viral ?",
    answers: [
        {
            text: "Une coupure avec un objet propre.",
            isCorrect: false,
            comment: "Une coupure avec un objet propre ne constitue pas un accident d'exposition à un risque viral, il doit y avoir un contact avec du sang ou un liquide biologique contaminé par du sang."
        },
        {
            text: "Une projection de sang dans les yeux.",
            isCorrect: true,
            comment: "Effectivement, une projection de sang dans les yeux peut être un signe d'accident d'exposition à un risque viral."
        },
        {
            text: "Un contact avec de l'urine.",
            isCorrect: false,
            comment: "Un contact avec de l'urine ne constitue pas un accident d'exposition à un risque viral, sauf si elle contient du sang."
        },
        {
            text: "Un contact avec de la sueur.",
            isCorrect: false,
            comment: "Un contact avec de la sueur ne constitue pas un accident d'exposition à un risque viral."
        }
    ]
},
{
    text: "Quel est le principe de l'action de secours en cas d'accident d'exposition à un risque viral ?",
    answers: [
        {
            text: "Assurer immédiatement les gestes de secours sans prendre en compte le risque viral.",
            isCorrect: false,
            comment: "Il est essentiel de prendre en compte le risque viral lors de l'action de secours pour appliquer les mesures appropriées."
        },
        {
            text: "Réaliser immédiatement les soins adaptés en cas d'accident d'exposition à un risque viral avéré.",
            isCorrect: true,
            comment: "C'est correct, l'action de secours doit permettre de réaliser immédiatement les soins adaptés en cas d'accident d'exposition à un risque viral avéré."
        },
        {
            text: "Attendre l'arrivée des secours médicaux sans intervenir.",
            isCorrect: false,
            comment: "Attendre l'arrivée des secours médicaux sans intervenir peut aggraver la situation. Il est important d'agir rapidement en cas d'accident d'exposition à un risque viral."
        },
        {
            text: "Réaliser une désinfection sommaire de la plaie avant toute autre action.",
            isCorrect: false,
            comment: "Une désinfection sommaire de la plaie ne suffit pas en cas d'accident d'exposition à un risque viral. Il est nécessaire de suivre les protocoles appropriés."
        }
    ]
},
{
"text": "Que doit-on faire dès la constatation d'un accident d'exposition à un risque viral ?",
"answers": [
    {
        "text": "Interrompre l'action de secours en cours et se faire relayer.",
        "isCorrect": true,
        "comment": "Correct, il est important d'interrompre l'action de secours en cours pour gérer l'accident d'exposition à un risque viral."
    },
    {
        "text": "Continuer l'action de secours sans interruption.",
        "isCorrect": false,
        "comment": "Ce n'est pas la procédure recommandée pour un accident d'exposition à un risque viral."
    },
    {
        "text": "Nettoyer immédiatement la plaie avec de l'alcool.",
        "isCorrect": false,
        "comment": "Nettoyer immédiatement la plaie est important, mais ce n'est pas la première action à prendre."
    },
    {
        "text": "Appliquer une compresse stérile sur la plaie.",
        "isCorrect": false,
        "comment": "Ce n'est pas la première action à prendre en cas d'accident d'exposition à un risque viral."
    }
]
},
{
"text": "Quelles sont les mesures à prendre en cas d'exposition à un risque viral via une plaie ?",
"answers": [
    {
        "text": "Faire saigner la plaie puis nettoyer avec de l'eau et du savon.",
        "isCorrect": false,
        "comment": "Faire saigner la plaie n'est pas recommandé dans ce cas."
    },
    {
        "text": "Appliquer un antiseptique à large spectre directement sur la plaie.",
        "isCorrect": false,
        "comment": "L'utilisation d'un antiseptique à large spectre n'est pas la première mesure à prendre en cas d'exposition à un risque viral."
    },
    {
        "text": "Ne pas faire saigner, nettoyer à l'eau courante et au savon, puis réaliser l'asepsie.",
        "isCorrect": true,
        "comment": "Correct, ne pas faire saigner la plaie, la nettoyer à l'eau courante et au savon, puis réaliser l'asepsie sont les mesures recommandées."
    },
    {
        "text": "Utiliser des produits pour le traitement hygiénique des mains par friction.",
        "isCorrect": false,
        "comment": "Ce type de produit n'est pas adapté pour traiter une plaie exposée à un risque viral."
    }
]
},
{
"text": "Quelles actions sont recommandées en cas de projection de liquide biologique sur les muqueuses, en particulier au niveau de la conjonctive ?",
"answers": [
    {
        "text": "Ne rien faire et attendre que ça se résolve.",
        "isCorrect": false,
        "comment": "Attendre n'est pas la bonne approche dans ce cas."
    },
    {
        "text": "Rincer abondamment durant au moins cinq minutes avec de l'eau.",
        "isCorrect": true,
        "comment": "Correct, rincer abondamment avec de l'eau est la bonne mesure à prendre en cas de projection de liquide biologique sur les muqueuses."
    },
    {
        "text": "Appliquer un antiseptique puissant sur la zone touchée.",
        "isCorrect": false,
        "comment": "L'application d'un antiseptique n'est pas la première mesure recommandée dans ce cas."
    },
    {
        "text": "Utiliser un soluté isotonique pour nettoyer la zone touchée.",
        "isCorrect": false,
        "comment": "Bien que le soluté isotonique soit adapté, l'utilisation de l'eau est généralement plus pratique et suffisante."
    }
]
},

{
"text": "Quelle est la principale voie de transmission des microorganismes dans le contexte des risques infectieux ?",
"answers": [
    {
        "text": "Par les gouttelettes de 'pflugge'.",
        "isCorrect": false,
        "comment": "Bien que les gouttelettes de 'pflugge' soient une voie de transmission, ce n'est pas la principale dans ce contexte."
    },
    {
        "text": "Par contact direct avec une personne potentiellement infectée.",
        "isCorrect": true,
        "comment": "Correct, le contact direct avec une personne infectée est la principale voie de transmission des microorganismes dans ce contexte."
    },
    {
        "text": "Par l'ingestion d'aliments contaminés.",
        "isCorrect": false,
        "comment": "L'ingestion d'aliments contaminés peut être une voie de transmission, mais ce n'est pas la principale dans ce contexte."
    },
    {
        "text": "Par inhalation de particules en suspension dans l'air.",
        "isCorrect": false,
        "comment": "Bien que cela puisse être une voie de transmission, ce n'est pas la principale dans ce contexte."
    }
]
},
{
"text": "Quelles sont les précautions recommandées pour limiter le risque de transmission d'infections entre la victime et l'intervenant ?",
"answers": [
    {
        "text": "Ne pas porter de gants pendant l'intervention pour mieux sentir les choses.",
        "isCorrect": false,
        "comment": "Ne pas porter de gants augmente le risque de transmission d'infections, ce n'est donc pas recommandé."
    },
    {
        "text": "Utiliser un masque uniquement si la victime tousse ou éternue.",
        "isCorrect": false,
        "comment": "Il est recommandé d'utiliser un masque en tout temps pour limiter la transmission d'infections, pas seulement lorsque la victime tousse ou éternue."
    },
    {
        "text": "Appliquer systématiquement des précautions d'hygiène standards (gants masques etc).",
        "isCorrect": true,
        "comment": "Correct, l'application de précautions d'hygiène standards est essentielle pour limiter le risque de transmission d'infections entre la victime et l'intervenant."
    },
    {
        "text": "Porter un tablier en plastique uniquement si la victime saigne abondamment.",
        "isCorrect": false,
        "comment": "Il est recommandé de porter un tablier en plastique en tout temps lors d'une intervention pour limiter la transmission d'infections, pas seulement en cas de saignement abondant."
    }
]
},


{
"text": "Quelle est l'une des précautions recommandées pendant l'intervention pour limiter le risque infectieux ?",
"answers": [
    {
        "text": "Porter des vêtements élégants.",
        "isCorrect": false,
        "comment": "Porter des vêtements élégants n'est pas une mesure recommandée pour limiter le risque infectieux pendant l'intervention."
    },
    {
        "text": "Changer de tenue dès qu'elle est souillée.",
        "isCorrect": true,
        "comment": "Correct, il est recommandé de changer de tenue dès qu'elle est souillée pour limiter le risque infectieux."
    },
    {
        "text": "Ignorer les procédures de gestion des déchets.",
        "isCorrect": false,
        "comment": "Ignorer les procédures de gestion des déchets peut augmenter le risque infectieux pendant l'intervention."
    },
    {
        "text": "Utiliser les mêmes gants pendant toute l'intervention.",
        "isCorrect": false,
        "comment": "Utiliser les mêmes gants pendant toute l'intervention peut augmenter le risque de contamination croisée."
    }
]
},
{
"text": "Quelle est une mesure recommandée pour couvrir une plaie pendant l'intervention ?",
"answers": [
    {
        "text": "Laisser la plaie à l'air libre.",
        "isCorrect": false,
        "comment": "Laisser une plaie à l'air libre peut augmenter le risque d'infection."
    },
    {
        "text": "Recouvrir la plaie par un pansement.",
        "isCorrect": true,
        "comment": "Correct, il est recommandé de recouvrir toute plaie par un pansement pour limiter le risque infectieux."
    },
    {
        "text": "Appliquer de la sauge sur la plaie.",
        "isCorrect": false,
        "comment": "Appliquer de la sauge sur la plaie n'est pas une mesure recommandée pendant l'intervention."
    },
    {
        "text": "Utiliser de l'alcool pour désinfecter la plaie.",
        "isCorrect": false,
        "comment": "L'utilisation d'alcool pour désinfecter une plaie peut être irritante et n'est pas recommandée."
    }
]
},
{
"text": "Que faut-il faire après chaque transport sur le brancard pour limiter le risque infectieux ?",
"answers": [
    {
        "text": "Utiliser les mêmes draps à usage unique pour chaque transport.",
        "isCorrect": false,
        "comment": "Utiliser les mêmes draps à usage unique pour chaque transport peut augmenter le risque de contamination croisée."
    },
    {
        "text": "Changer les draps après chaque transport.",
        "isCorrect": true,
        "comment": "Correct, il est recommandé d'utiliser de nouveaux draps après chaque transport sur le brancard pour limiter le risque infectieux."
    },
    {
        "text": "Ignorer l'entretien du brancard.",
        "isCorrect": false,
        "comment": "Ignorer l'entretien du brancard peut augmenter le risque infectieux."
    },
    {
        "text": "Ne rien faire, car le brancard est déjà propre.",
        "isCorrect": false,
        "comment": "Même si le brancard semble propre, il est recommandé de prendre des mesures pour limiter le risque infectieux après chaque transport."
    }
]
},

{
"text": "Quelle est une mesure recommandée pour les intervenants en contact avec la victime afin de limiter la transmission des agents infectieux ?",
"answers": [
    {
        "text": "Porter des gants à usage multiple.",
        "isCorrect": false,
        "comment": "Porter des gants à usage multiple augmente le risque de contamination croisée et n'est pas recommandé."
    },
    {
        "text": "Porter une surblouse et une protection des cheveux (charlotte) en cas de contact avec la victime ou des surfaces contaminées.",
        "isCorrect": true,
        "comment": "Correct, porter une surblouse et une protection des cheveux peut limiter la transmission des agents infectieux lors du contact avec la victime ou des surfaces contaminées."
    },
    {
        "text": "Se laver les mains uniquement après avoir touché la victime.",
        "isCorrect": false,
        "comment": "Se laver les mains après avoir touché la victime est important, mais d'autres mesures de protection sont également nécessaires."
    },
    {
        "text": "Ne pas porter de masque de protection.",
        "isCorrect": false,
        "comment": "Le port d'un masque de protection est recommandé pour limiter la transmission des agents infectieux."
    }
]
},
{
"text": "Que faut-il faire pour la victime afin de limiter la dissémination des particules infectieuses ?",
"answers": [
    {
        "text": "Ne rien faire, car la victime est déjà isolée.",
        "isCorrect": false,
        "comment": "Même si la victime est isolée, il existe des mesures supplémentaires pour limiter la dissémination des particules infectieuses."
    },
    {
        "text": "Porter une surblouse et une protection des cheveux.",
        "isCorrect": false,
        "comment": "Les surblouses et les protections des cheveux sont destinées aux intervenants, pas à la victime."
    },
    {
        "text": "Porter un masque de type chirurgical ou un masque de protection respiratoire.",
        "isCorrect": true,
        "comment": "Correct, le port d'un masque de type chirurgical ou d'un masque de protection respiratoire par la victime peut limiter la dissémination des particules infectieuses."
    },
    {
        "text": "Ne rien porter, car cela n'a pas d'effet sur la dissémination des particules infectieuses.",
        "isCorrect": false,
        "comment": "Le port d'un masque par la victime peut limiter la dissémination des particules infectieuses."
    }
]
},
{
"text": "Quels sont les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) ?",
"answers": [
{
  "text": "Les deux types de déchets distingués sont les matériels piquants, coupants et tranchants (aiguilles, scalpels, lames de rasoir) et les déchets mous (compresses, pansements, champs, draps à usage unique).",
  "isCorrect": true,
  "comment": "Correct ! Les deux types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
},
{
  "text": "Les déchets liquides et solides.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas correct. Les deux types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
},
{
  "text": "Les déchets organiques et inorganiques.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas la bonne réponse. Les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont spécifiquement les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
},
{
  "text": "Les déchets recyclables et non recyclables.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas la bonne réponse. Les types de déchets distingués dans l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) sont spécifiquement les matériels piquants, coupants et tranchants, ainsi que les déchets mous."
}
]
},
{
"text": "Quelles sont les règles générales à suivre lors de l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) ?",
"answers": [
{
  "text": "Les règles générales à suivre comprennent ne rien laisser sur les lieux de l'action de secours, ne jamais recapuchonner les aiguilles ni séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur, utiliser l'emballage conforme adapté au déchet, ne pas jeter de DASRI aux ordures ménagères, et déposer les emballages pleins dans un lieu prévu à cet effet.",
  "isCorrect": true,
  "comment": "Correct ! Les règles générales à suivre lors de l'utilisation des emballages pour l'élimination des déchets des activités de soins à risques infectieux (DASRI) comprennent plusieurs points, notamment ne rien laisser sur les lieux de l'action de secours, ne jamais recapuchonner les aiguilles, utiliser l'emballage adapté, et déposer les emballages pleins dans un lieu approprié."
},
{
  "text": "Il n'est pas nécessaire de déposer les emballages pleins dans un lieu prévu à cet effet.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas correct. Il est essentiel de déposer les emballages pleins dans un lieu prévu à cet effet pour assurer une élimination appropriée des déchets des activités de soins à risques infectieux (DASRI)."
},
{
  "text": "Il est recommandé de séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas la bonne pratique. Il ne faut jamais séparer les aiguilles d'une seringue ou d'une tubulure à perfusion avant de les mettre dans le collecteur pour éviter les accidents d'exposition au sang."
},
{
  "text": "Il est recommandé de jeter les DASRI aux ordures ménagères.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas une pratique sûre. Les DASRI ne doivent jamais être jetés aux ordures ménagères car ils représentent une source importante de transmission des infections et d'accidents d'exposition au risque viral."
}
]
},
{
"text": "Quelles sont les précautions à prendre lors de la manipulation des déchets des activités de soins à risques infectieux (DASRI) ?",
"answers": [

{
  "text": "Il n'est pas nécessaire de fermer l'emballage après avoir déposé le déchet.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas correct. Il est essentiel de fermer immédiatement l'emballage après avoir déposé le déchet pour éviter toute exposition supplémentaire aux risques infectieux."
},
{
  "text": "Il est recommandé de remplir l'emballage au-delà de la limite indiquée.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas une bonne pratique. Il faut éviter de remplir l'emballage au-delà de la limite indiquée pour assurer une manipulation sûre des déchets des activités de soins à risques infectieux (DASRI)."
},
{
  "text": "Il est recommandé de tasser les déchets à l'intérieur de l'emballage à DASRI.",
  "isCorrect": false,
  "comment": "Non, ce n'est pas une bonne pratique. Il ne faut pas tasser les déchets à l'intérieur de l'emballage à DASRI car cela peut compromettre la sécurité lors de la manipulation et de l'élimination des déchets."
}
{
    "text": "Les précautions à prendre comprennent l'ouverture préalable de l'emballage, le dépôt du déchet dans l'emballage suivi de sa fermeture immédiate, l'évitement de remplir l'emballage au-delà de la limite indiquée, de tasser les déchets à l'intérieur de l'emballage, et la fermeture de l'emballage lorsque le taux maximum de remplissage est atteint.",
    "isCorrect": true,
    "comment": "Correct ! Les précautions à prendre lors de la manipulation des déchets des activités de soins à risques infectieux (DASRI) incluent plusieurs étapes, telles que l'ouverture préalable de l'emballage, le dépôt du déchet suivi de la fermeture immédiate de l'emballage, et le respect des limitations de remplissage et de la date de péremption."
  },
]
},
];


// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${5}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(questionsData);

// creating questions
for (var i = 0; i < 5; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
