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
    "text": "Quels sont les gestes à éviter lors de la prise en charge d'une victime de noyade ?",
    "answers": [
        {
            text: "Sécher prudemment la victime après son dégagement de l'eau",
            isCorrect: false,
            comment: "Incorrect. Il est important de sécher la victime pour éviter l'hypothermie, mais cela ne doit pas retarder les premiers secours."
        },
        {
            text: "Utiliser des couvertures pour protéger la victime du vent",
            isCorrect: false,
            comment: "Incorrect. Utiliser des couvertures peut aider à maintenir la chaleur corporelle de la victime, ce qui est bénéfique dans certains cas de noyade."
        },
        {
          text: "Effectuer des mobilisations intempestives lors du déshabillage de la victime",
          isCorrect: true,
          comment: "Correct. Il est important d'éviter les mobilisations intempestives qui pourraient aggraver les blessures ou le traumatisme de la victime."
      },
      {
          text: "Surveiller attentivement la victime en continu",
          isCorrect: false,
          comment: "Incorrect. Surveiller la victime en continu est essentiel pour détecter tout changement dans son état et adapter les premiers secours en conséquence."
      }

    

    ]

  },
  {
    text: "Qu'est-ce que l'action de secours doit permettre lors d'un accident électrique ?",
    "answers": [
        {
            text: "Réparer les câbles endommagés.",
            isCorrect: false,
            comment: "La réparation des câbles endommagés est une tâche pour les professionnels de l'électricité, pas pour les secouristes."
        },
        {
            text: "Prendre des photos des blessures.",
            isCorrect: false,
            comment: "Prendre des photos des blessures peut être utile à des fins médicales, mais ce n'est pas l'objectif principal de l'action de secours lors d'un accident électrique."
        },
        {
            text: "Obtenir un avis médical, réaliser les gestes de secours adaptés et prendre en charge les brûlures.",
            isCorrect: true,
            comment: "L'action de secours lors d'un accident électrique doit permettre d'obtenir un avis médical, de réaliser les gestes de secours adaptés et de prendre en charge les brûlures."
        },
        {
            text: "Aucune des réponses précédentes.",
            isCorrect: false,
            comment: "La dernière option est incorrecte car l'action de secours doit comprendre plusieurs mesures pour aider la victime."
        }
    ]


  },
  {
    "text": "Quelle est la principale action recommandée lorsqu'une compression de membre est suspectée ?",
    "answers": [
        {
            "text": "Réaliser des massages cardiaques.",
            isCorrect: false,
            comment: "Incorrect. Réaliser des massages cardiaques n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
        },
        {
            text: "Évaluer la durée de la compression et réaliser les gestes de secours adaptés.",
            isCorrect: true,
            comment: "Correct. La principale action recommandée lorsqu'une compression de membre est suspectée est d'évaluer la durée de la compression et de réaliser les gestes de secours adaptés."
        },
        {
            text: "Administrer un médicament anti-inflammatoire.",
            isCorrect: false,
            comment: "Incorrect. Administrer un médicament anti-inflammatoire n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
        },
        {
            text: "Appliquer un pansement compressif.",
            isCorrect: false,
            comment: "Incorrect. Appliquer un pansement compressif n'est pas la principale action recommandée lorsqu'une compression de membre est suspectée."
        }

    ]
},
{
    "text": "Que doit-on faire en cas de détresse vitale associée à une compression de membre ?",
    "answers": [
        {
            text: "Rien, car la situation n'est pas grave.",
            isCorrect: false,
            comment: "Incorrect. En cas de détresse vitale, il est crucial d'agir rapidement pour aider la victime."
        },
        {
            text: "Appliquer un garrot.",
            isCorrect: false,
            comment: "Incorrect. Appliquer un garrot peut aggraver la situation dans le cas d'une détresse vitale associée à une compression de membre."
        },
        {
            text: "Appeler les secours médicaux d'urgence et réaliser les gestes de secours adaptés.",
            isCorrect: true,
            comment: "Correct. En cas de détresse vitale, il est essentiel d'appeler les secours médicaux d'urgence et de réaliser les gestes de secours appropriés pour aider la victime."
        },
        {
            text: "Continuer à comprimer le membre.",
            isCorrect: false,
            comment: "Incorrect. Continuer à comprimer le membre n'est pas la bonne approche en cas de détresse vitale, car cela peut aggraver la situation."
        }
    ]
},
{
  "text": "Quels sont les gestes à effectuer pour assurer le sauvetage aquatique d'une victime de noyade ?",
  answers: [
      {
          text: "Entrer dans l'eau rapidement et seul",
          isCorrect: false,
          comment: "Incorrect. Entrer rapidement dans l'eau peut mettre en danger le sauveteur. Il est préférable d'utiliser un moyen d'aide au sauvetage."
      },
      {
          text: "Utiliser un moyen d'aide au sauvetage et éviter de plonger tête la première",
          isCorrect: true,
          comment: "Correct. Il est recommandé d'utiliser un moyen d'aide au sauvetage tel qu'une bouée et d'éviter de plonger tête la première pour éviter les blessures."
      },
      {
          text: "Ne pas parler à la victime pour éviter la panique",
          isCorrect: false,
          comment: "Incorrect. Il est important de communiquer avec la victime pour la rassurer et lui indiquer les actions entreprises."
      },
      {
          text: "Plonger tête la première pour une meilleure propulsion",
          isCorrect: false,
          comment: "Incorrect. Plonger tête la première peut entraîner des blessures graves, surtout dans des eaux peu profondes ou inconnues."
      }
  ]
},
{
  "text": "Que doit faire un intervenant secouriste lorsqu'une victime est en contact avec un conducteur endommagé dans le cadre d'un accident electrique ?",
  "answers": [
      {
          text: "S'approcher immédiatement de la victime.",
          isCorrect: false,
          comment: "S'approcher immédiatement de la victime peut mettre en danger l'intervenant lui-même en cas de danger électrique."
      },
      {
          text: "Couper le courant si possible.",
          isCorrect: true,
          comment: "La première action à entreprendre est de couper le courant si cela est possible pour sécuriser la zone et éviter de nouvelles victimes."
      },
      {
          text: "Toucher la victime pour vérifier si elle est consciente.",
          isCorrect: false,
          comment: "Toucher la victime sans avoir sécurisé la zone peut être dangereux en cas de danger électrique."
      },
      {
          text: "Prendre des photos de la scène.",
          isCorrect: false,
          comment: "Prendre des photos de la scène peut être utile à des fins d'enquête ou de documentation, mais cela ne doit pas être la priorité lorsqu'une victime est en contact avec un conducteur endommagé."
      }
  ]
},
{
  "text": "Quelle est la première mesure recommandée pour traiter une gelure ?",
  answers: [
      {
          text: "Réchauffer immédiatement la zone atteinte avec de l'eau chaude.",
          isCorrect: false,
          comment: "Incorrect. La première mesure recommandée pour traiter une gelure est d'isoler la victime dans un endroit chaud et à l'abri du vent."
      },
      {
          text: "Appliquer de la glace sur la zone touchée.",
          isCorrect: false,
          comment: "Incorrect. L'application de glace n'est pas recommandée pour traiter une gelure, car cela peut aggraver les lésions cutanées."
      },
      {
          text: "Isoler la victime dans un endroit chaud et à l'abri du vent.",
          isCorrect: true,
          comment: "Correct. La première mesure recommandée pour traiter une gelure est d'isoler la victime dans un endroit chaud et à l'abri du vent pour éviter une exposition supplémentaire au froid."
      },
      {
          text: "Masser doucement la zone affectée.",
          isCorrect: false,
          comment: "Incorrect. Le massage doux de la zone affectée n'est pas recommandé car il peut aggraver les lésions cutanées."
      }
  ]
},
{
  text: "Quelle est la position la plus adaptée pour une personne victime d'un traumatisme de l'abdomen ?",
  "answers": [
      {
          text: "La position allongée, à plat dos, jambes fléchis.",
          isCorrect: true,
          comment: "Bonne réponse ! C'est en effet la position allongée, à plat dos, jambes fléchis"
      },
      {
          text: "La position demi-assise.",
          isCorrect: false,
          comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis"
      },
      {
          text: "La position debout.",
          isCorrect: true,
          comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis."
      },
      {
          text: "Pas de position particulière recommandée",
          isCorrect: false,
          comment: "Mauvaise réponse. La bonne réponse est la position allongée, à plat dos, jambes fléchis"
      }
  ]
},
{
  "text": "Quelle est la position la plus adaptée pour une personne victime d'un traumatisme du thorax ?",
  "answers": [
      {
          text: "La position allongée, à plat dos, jambes fléchis.",
          isCorrect: false,
          comment: "Bonne réponse ! C'est en effet la position demi-assise."
      },
      {
          text: "La position demi-assise.",
          isCorrect: true,
          comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
      },
      {
          text: "La position debout.",
          isCorrect: true,
          comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
      },
      {
          text: "Pas de position particulière recommandée",
          isCorrect: false,
          comment: "Mauvaise réponse. Bonne réponse ! C'est en effet la position demi-assise."
      }
  ]
},
{
  "text": "Quelle est la durée maximale recommandée pour rechercher la ventilation chez une victime inconsciente ?",
  "answers": [
      {
          text: "Dix secondes.",
          isCorrect: true,
          comment: "Effectivement, la recherche de la ventilation chez une victime inconsciente ne devrait pas dépasser dix secondes pour éviter tout retard dans la prise en charge."
      },
      {
          text: "Trente secondes.",
          isCorrect: false,
          comment: "Rechercher la ventilation chez une victime inconsciente ne devrait pas prendre plus de dix secondes pour éviter tout retard dans la prise en charge."
      },
      {
          text: "Une minute.",
          isCorrect: false,
          comment: "Une minute est une période trop longue pour rechercher la ventilation chez une victime inconsciente, car cela pourrait retarder la prise en charge."
      },
      {
          text: "Deux minutes.",
          isCorrect: false,
          comment: "Deux minutes est une période trop longue pour rechercher la ventilation chez une victime inconsciente, car cela pourrait retarder la prise en charge."
      }
  ]
},

{
  "text": "Quelle est la fréquence ventilatoire d'un Adulte ?",
  "answers": [
      {
          text: "12 à 20",
          isCorrect: true,
          comment: "Bonne réponse ! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
      },
      {
          text: "20 à 30",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
      },
      {
          text: "30 à 40.",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
      },
      {
          text: "60 à 100",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un adulte est varie entre 12 et 20 mvt/min"
      }
  ]
},
{
  "text": "Quelle est la fréquence ventilatoire d'un enfant ?",
  "answers": [
      {
          text: "12 à 20",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence ventilatoire d'un enfant varie entre 20 et 30 mvt/min"
      },
      {
          text: "20 à 30",
          isCorrect: true,
          comment: "Bonne réponse ! La fréquence ventilatoire d'un enfant varie entre 20 et 30 mvt/min"
      },
      {
          text: "30 à 40",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant est varie entre 20 et 30 mvt/min"
      },
      {
          text: "60 à 100",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant est varie entre 20 et 30 mvt/min"
      }
  ]
},
{
  "text": "Quelle est la fréquence ventilatoire d'un nourisson ?",
  "answers": [
      {
          text: "12 à 20",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
      },
      {
          text: "20 à 30",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
      },
      {
          text: "30 à 40.",
          isCorrect: true,
          comment: "Bonne réponse ! La fréquence ventilatoire d'un nourisson varie entre 30 et 40 mvt/min"
      },
      {
          text: "60 à 100",
          isCorrect: false,
          comment: "Mauvaise réponse! La fréquence ventilatoire d'un enfant varie entre 30 et 40 mvt/min"
      }
  ]
},
{
  "text": "Quelle est la fréquence ventilatoire d'un nouveau-né ?",
  "answers": [
      {
          text: "12 à 20",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
      },
      {
          text: "20 à 30",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
      },
      {
          text: "30 à 40.",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
      },
      {
          text: "40 à 60",
          isCorrect: false,
          comment: "Bonne réponse ! La fréquence ventilatoire d'un nouveau né varie entre 40 et 60 mvt/min"
      }
  ]
},
{
  "text": "Quelle est la fréquence cardiaque d'un nouveau-né ?",
  "answers": [
      {
          text: "120 à 160",
          isCorrect: true,
          comment: "Bonne réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
      },
      {
          text: "20 à 30",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
      },
      {
          text: "30 à 40.",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
      },
      {
          text: "40 à 60",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un nouveau né varie entre 120 à 160 bpm"
      }
  ]
},
{
  "text": "Quand la mesure de la glycémie capillaire est-elle réalisée par les secouristes ?",
  "answers": [
      {
          text: "Devant toutes victimes présentant des signes évoquant un accident vasculaire cérébral.",
          isCorrect: false,
          comment: "La mesure de la glycémie capillaire n'est pas spécifiquement indiquée devant toutes les victimes présentant des signes évoquant un accident vasculaire cérébral."
      },
      {
          text: "Lorsqu'un médecin régulateur en fait la demande.",
          isCorrect: false,
          comment: "La demande d'un médecin régulateur n'est qu'une des indications pour la réalisation de la mesure de la glycémie capillaire, mais ce n'est pas la seule."
      },
      {
          text: "En présence de signes pouvant évoquer une hypoglycémie.",
          isCorrect: true,
          comment: "Oui, la mesure de la glycémie capillaire est réalisée en présence de signes pouvant évoquer une hypoglycémie, tels que des malaises chez un diabétique."
      },
      {
          text: "Uniquement en cas de perte de connaissance de la victime.",
          isCorrect: false,
          comment: "La mesure de la glycémie capillaire peut être réalisée dans diverses situations, pas seulement en cas de perte de connaissance de la victime."
      }
  ]
},
{
  "text": "Quels sont les éléments nécessaires à la réalisation de la mesure de la glycémie capillaire ?",
  "answers": [
      {
          text: "Un tensiomètre et un stéthoscope.",
          isCorrect: false,
          comment: "Un tensiomètre et un stéthoscope sont utilisés pour d'autres évaluations médicales, mais ils ne sont pas nécessaires à la mesure de la glycémie capillaire."
      },
      {
          text: "Un lecteur de glycémie et des bandelettes réactives.",
          isCorrect: true,
          comment: "Exact, pour réaliser la mesure de la glycémie capillaire, il faut un lecteur de glycémie et des bandelettes réactives adaptées."
      },
      {
          text: "Des compresses stériles et une seringue.",
          isCorrect: false,
          comment: "Les compresses stériles et les seringues sont utilisées pour d'autres procédures médicales et ne sont pas spécifiquement nécessaires à la mesure de la glycémie capillaire."
      },
      {
          text: "Un oxymètre de pouls et un tensiomètre automatique.",
          isCorrect: false,
          comment: "Ces équipements sont utilisés pour d'autres évaluations médicales, mais pas pour la mesure de la glycémie capillaire."
      }
  ]
},
{
  "text": "Quelle est la première étape à suivre avant de réaliser la mesure de la glycémie capillaire ?",
  "answers": [
      {
          text: "Frictionner les mains avec une solution hydroalcoolique.",
          isCorrect: false,
          comment: "Bien que le nettoyage des mains soit une étape importante, la première étape est d'installer la victime confortablement."
      },
      {
          text: "Expliquer le geste technique à la victime.",
          isCorrect: false,
          comment: "Expliquer le geste technique à la victime est une étape importante, mais ce n'est pas la première étape."
      },
      {
          text: "Se préparer en mettant des gants à usage unique.",
          isCorrect: false,
          comment: "Se préparer en mettant des gants à usage unique est une étape essentielle, mais ce n'est pas la première étape."
      },
      {
          text: "Installer la victime confortablement.",
          isCorrect: true,
          comment: "Oui, la première étape est d'installer la victime confortablement avant de procéder à la mesure de la glycémie capillaire."
      }
  ]
},
{
  "text": "Quelle est la dernière étape à suivre après avoir effectué la mesure de la glycémie capillaire ?",
  "answers": [
      {
          text: "Jeter les bandelettes réactives dans un sac à ordures ménagères.",
          isCorrect: false,
          comment: "Les bandelettes réactives doivent être jetées dans un sac à DASRI, pas dans un sac à ordures ménagères."
      },
      {
          text: "Éteindre le lecteur de glycémie après utilisation.",
          isCorrect: true,
          comment: "Exact, après avoir utilisé le lecteur de glycémie, il est important de l'éteindre pour économiser la batterie et prolonger sa durée de vie."
      },
      {
          text: "Transmettre le résultat de la glycémie à l'hôpital le plus proche.",
          isCorrect: false,
          comment: "Transmettre le résultat de la glycémie à un établissement de santé peut être nécessaire, mais ce n'est pas la dernière étape à suivre après avoir réalisé la mesure."
      },
      {
          text: "Se laver les mains avec du savon et de l'eau.",
          isCorrect: false,
          comment: "Se laver les mains est une étape importante pour l'hygiène, mais ce n'est pas la dernière étape après avoir effectué la mesure de la glycémie capillaire."
      }
  ]
},
{
  "text": "Quels sont les risques associés à la réalisation de la mesure de la glycémie capillaire ?",
  "answers": [
      {
          text: "La transmission d'une infection si les matériels ne sont pas correctement utilisés.",
          isCorrect: true,
          comment: "Oui, la transmission d'une infection est l'un des risques associés à la réalisation de la mesure de la glycémie capillaire si les matériels ne sont pas correctement utilisés."
      },
      {
          text: "La survenue d'une crise cardiaque chez la victime.",
          isCorrect: false,
          comment: "La réalisation de la mesure de la glycémie capillaire ne provoque pas directement la survenue d'une crise cardiaque chez la victime."
      },
      {
          text: "Une réaction allergique à la solution hydroalcoolique.",
          isCorrect: false,
          comment: "Une réaction allergique à la solution hydroalcoolique est possible, mais elle n'est pas spécifiquement liée à la réalisation de la mesure de la glycémie capillaire."
      },
      {
          text: "La perte de conscience de la victime pendant la mesure.",
          isCorrect: false,
          comment: "La perte de conscience de la victime pendant la mesure peut être une complication, mais ce n'est pas un risque directement associé à la réalisation de la mesure de la glycémie capillaire."
      }
  ]
},
{
  "text": "Quand la mesure de la pression artérielle est-elle réalisée ?",
  "answers": [
      {
          text: "Uniquement en situation d'urgence.",
          isCorrect: false,
          comment: "La mesure de la pression artérielle n'est pas réservée uniquement aux situations d'urgence, elle est réalisée chaque fois que possible, lors du bilan et de la surveillance."
      },
      {
          text: "À la demande du médecin régulateur.",
          isCorrect: false,
          comment: "La mesure de la pression artérielle peut être réalisée à la demande du médecin régulateur, mais elle n'est pas limitée à cette situation."
      },
      {
          text: "Lors du bilan et de la surveillance.",
          isCorrect: true,
          comment: "Oui, la mesure de la pression artérielle est réalisée lors du bilan et de la surveillance, chaque fois que possible."
      },
      {
          text: "Uniquement en cas de perte de connaissance de la victime.",
          isCorrect: false,
          comment: "La mesure de la pression artérielle peut être réalisée dans diverses situations, pas seulement en cas de perte de connaissance de la victime."
      }
  ]
},
{
  "text": "Quel matériel est nécessaire pour mesurer la pression artérielle ?",
  "answers": [
      {
          text: "Un tensiomètre et un stéthoscope.",
          isCorrect: true,
          comment: "Exact, pour mesurer la pression artérielle, un tensiomètre et un stéthoscope sont nécessaires, en fonction de la méthode de mesure utilisée."
      },
      {
          text: "Un lecteur de glycémie et des bandelettes réactives.",
          isCorrect: false,
          comment: "Ces équipements sont utilisés pour mesurer la glycémie, pas la pression artérielle."
      },
      {
          text: "Un oxymètre de pouls et un tensiomètre automatique.",
          isCorrect: false,
          comment: "Un oxymètre de pouls mesure la saturation en oxygène du sang, ce qui est différent de la mesure de la pression artérielle."
      },
      {
          text: "Une seringue et des compresses stériles.",
          isCorrect: false,
          comment: "Ces équipements sont utilisés pour d'autres procédures médicales, mais pas pour la mesure de la pression artérielle."
      }
  ]
},
{
  "text": "Quelle est la méthode recommandée pour mesurer la pression artérielle ?",
  "answers": [
      {
          text: "La mesure par auscultation.",
          isCorrect: true,
          comment: "Oui, la mesure par auscultation est l'une des méthodes recommandées pour mesurer la pression artérielle, notamment avec un tensiomètre manuel et un stéthoscope."
      },
      {
          text: "La mesure par palpation.",
          isCorrect: false,
          comment: "La mesure par palpation ne permet de mesurer que la pression systolique et n'est pas la méthode recommandée pour mesurer la pression artérielle dans toutes les situations."
      },
      {
          text: "La mesure automatique.",
          isCorrect: false,
          comment: "La mesure automatique est une autre méthode de mesure de la pression artérielle, mais ce n'est pas la méthode recommandée dans toutes les situations."
      },
      {
          text: "La mesure visuelle.",
          isCorrect: false,
          comment: "La mesure visuelle n'est pas une méthode standard pour mesurer la pression artérielle."
      }
  ]
},
{
  "text": "Quelle est la valeur normale de la pression artérielle chez l'adulte au repos ?",
  "answers": [
      {
          text: "100 mmHg de PA systolique et 80 mmHg de PA diastolique.",
          isCorrect: true,
          comment: "Exact, les valeurs normales de pression artérielle chez l'adulte au repos sont d'environ 100 mmHg de PA systolique et 80 mmHg de PA diastolique."
      },
      {
          text: "120 mmHg de PA systolique et 90 mmHg de PA diastolique.",
          isCorrect: false,
          comment: "Ces valeurs sont généralement considérées comme des valeurs de préhypertension chez l'adulte."
      },
      {
          text: "90 mmHg de PA systolique et 60 mmHg de PA diastolique.",
          isCorrect: false,
          comment: "Ces valeurs sont généralement considérées comme des valeurs de tension artérielle basse chez l'adulte."
      },
      {
          text: "140 mmHg de PA systolique et 100 mmHg de PA diastolique.",
          isCorrect: false,
          comment: "Ces valeurs sont généralement considérées comme des valeurs de préhypertension chez l'adulte."
      }
  ]
},
{
  "text": "Quels sont les risques associés à la mesure de la pression artérielle ?",
  "answers": [
      {
          text: "La sensation douloureuse lors du gonflement du brassard.",
          isCorrect: true,
          comment: "Oui, le gonflement du brassard peut entraîner une sensation douloureuse chez la victime."
      },
      {
          text: "La survenue d'une crise cardiaque chez la victime.",
          isCorrect: false,
          comment: "La mesure de la pression artérielle ne provoque pas directement la survenue d'une crise cardiaque chez la victime."
      },
      {
          text: "L'apparition d'une réaction allergique au brassard.",
          isCorrect: false,
          comment: "Une réaction allergique au brassard est possible mais rare."
      },
      {
          text: "L'impossibilité d'obtenir des résultats si la pression artérielle est trop basse ou trop élevée.",
          isCorrect: true,
          comment: "Oui, les dispositifs médicaux de mesure de la pression artérielle peuvent ne pas afficher de résultats si la pression artérielle est trop basse ou trop élevée."
      }
  ]
},
{
  "text": "Quand la mesure de la saturation pulsée en oxygène est-elle utile ?",
  "answers": [
      {
          text: "En cas de détresse vitale (sauf arrêt cardiorespiratoire).",
          isCorrect: true,
          comment: "Oui, la mesure de la saturation pulsée en oxygène est utile en cas de détresse vitale, sauf en cas d'arrêt cardiorespiratoire."
      },
      {
          text: "Uniquement en cas d'arrêt cardiorespiratoire.",
          isCorrect: false,
          comment: "La mesure de la saturation pulsée en oxygène est utile dans diverses situations de détresse respiratoire, pas seulement en cas d'arrêt cardiorespiratoire."
      },
      {
          text: "Uniquement en cas de blessure grave.",
          isCorrect: false,
          comment: "La mesure de la saturation pulsée en oxygène n'est pas limitée aux cas de blessures graves, mais elle peut être utile dans diverses situations de détresse respiratoire."
      },
      {
          text: "Uniquement en cas de choc traumatique.",
          isCorrect: false,
          comment: "La mesure de la saturation pulsée en oxygène n'est pas limitée aux cas de choc traumatique, mais elle peut être utile dans diverses situations de détresse respiratoire."
      }
  ]
},
{
  "text": "Quel est le matériel nécessaire pour mesurer la saturation pulsée en oxygène ?",
  "answers": [
      {
          text: "Un oxymètre de pouls et un capteur adapté à l'âge de la victime.",
          isCorrect: true,
          comment: "Exact, pour mesurer la saturation pulsée en oxygène, un oxymètre de pouls et un capteur adapté à l'âge de la victime sont nécessaires."
      },
      {
          text: "Un tensiomètre automatique.",
          isCorrect: false,
          comment: "Un tensiomètre automatique mesure la pression artérielle, pas la saturation pulsée en oxygène."
      },
      {
          text: "Un stéthoscope et un brassard.",
          isCorrect: false,
          comment: "Ces équipements sont utilisés pour d'autres mesures médicales, mais pas pour la saturation pulsée en oxygène."
      },
      {
          text: "Un thermomètre frontal.",
          isCorrect: false,
          comment: "Un thermomètre frontal est utilisé pour mesurer la température corporelle, pas la saturation pulsée en oxygène."
      }
  ]
},
{
  "text": "Quelles sont les valeurs normales de saturation pulsée en oxygène ?",
  "answers": [
      {
          text: "Entre 94 et 100 %.",
          isCorrect: true,
          comment: "Oui, les valeurs normales de saturation pulsée en oxygène se situent généralement entre 94 et 100 %."
      },
      {
          text: "Entre 80 et 90 %.",
          isCorrect: false,
          comment: "Ces valeurs indiquent une saturation pulsée en oxygène basse, ce qui peut être anormal dans de nombreuses situations."
      },
      {
          text: "Entre 70 et 80 %.",
          isCorrect: false,
          comment: "Ces valeurs indiquent une saturation pulsée en oxygène très basse, ce qui peut être dangereux pour la santé."
      },
      {
          text: "Entre 60 et 70 %.",
          isCorrect: false,
          comment: "Ces valeurs indiquent une saturation pulsée en oxygène très basse, ce qui peut être dangereux pour la santé."
      }
  ]
},
{
  "text": "Quels sont les risques associés à la mesure de la saturation pulsée en oxygène ?",
  "answers": [
      {
          text: "Le signal peut ne pas être détecté dans certaines situations.",
          isCorrect: true,
          comment: "Oui, dans certaines situations, le signal de l'oxymètre peut ne pas être détecté, ce qui peut fausser la mesure."
      },
      {
          text: "La fausse indication de valeurs rassurantes en cas d'intoxication au monoxyde de carbone.",
          isCorrect: true,
          comment: "Oui, l'intoxication au monoxyde de carbone peut fausser la mesure de la saturation pulsée en oxygène, en donnant à tort des valeurs rassurantes."
      },
      {
          text: "La sensation de brûlure au niveau du capteur.",
          isCorrect: false,
          comment: "La sensation de brûlure au niveau du capteur n'est pas un risque courant associé à la mesure de la saturation pulsée en oxygène."
      },
      {
          text: "La possibilité d'erreur lors de la mesure de la fréquence cardiaque.",
          isCorrect: false,
          comment: "La mesure de la fréquence cardiaque peut être affectée dans certaines situations, mais ce n'est pas un risque principal associé à la mesure de la saturation pulsée en oxygène."
      }
  ]
},
{
  "text": "Dans quelles situations la mesure manuelle de la fréquence cardiaque est-elle recommandée malgré l'affichage sur l'oxymètre ?",
  "answers": [
      {
          text: "En cas de détresse circulatoire.",
          isCorrect: true,
          comment: "Oui, en cas de détresse circulatoire, la mesure manuelle de la fréquence cardiaque est recommandée malgré l'affichage sur l'oxymètre, car la fréquence cardiaque peut être faussée dans cette situation."
      },
      {
          text: "Uniquement en cas d'arrêt cardiorespiratoire.",
          isCorrect: false,
          comment: "La mesure manuelle de la fréquence cardiaque peut être recommandée dans diverses situations, pas seulement en cas d'arrêt cardiorespiratoire."
      },
      {
          text: "Uniquement en cas de gêne respiratoire.",
          isCorrect: false,
          comment: "La mesure manuelle de la fréquence cardiaque peut être recommandée dans diverses situations, pas seulement en cas de gêne respiratoire."
      },
      {
          text: "En cas de tremblements de la victime.",
          isCorrect: false,
          comment: "Les tremblements de la victime peuvent affecter la mesure de la saturation pulsée en oxygène, mais ce n'est pas une indication directe pour une mesure manuelle de la fréquence cardiaque."
      }
  ]
},

{
  "text": "Quelle est la fréquence cardiaque d'un adulte ?",
  "answers": [
      {
          text: "60 à 100",
          isCorrect: true,
          comment: "Bonne réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
      },
      {
          text: "70 à 140",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
      },
      {
          text: "100 à 160",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
      },
      {
          text: "40 à 60",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un adulte varie entre 60 à 100 bpm."
      }
  ]
},
{
  "text": "Quelle est la fréquence cardiaque d'un enfant ?",
  "answers": [
      {
          text: "60 à 100",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
      },
      {
          text: "70 à 140",
          isCorrect: true,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
      },
      {
          text: "100 à 160.",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
      },
      {
          text: "40 à 60",
          isCorrect: false,
          comment: "Mauvaise réponse ! La fréquence cardiaque d'un enfant varie entre 70 à 140 bpm."
      }



  ]
},
{
  "text": "Quel est le principal objectif de la mesure de la température d'une victime ?",
  "answers": [
      {
          "text": "Dépister une augmentation ou une diminution de la température corporelle.",
          "isCorrect": true,
          "comment": "Oui, la mesure de la température d'une victime vise principalement à dépister une augmentation (hyperthermie) ou une diminution (hypothermie) de sa température corporelle."
      },
      {
          "text": "Déterminer la fréquence respiratoire.",
          "isCorrect": false,
          "comment": "La mesure de la température ne vise pas à déterminer la fréquence respiratoire, mais plutôt à évaluer la température corporelle de la victime."
      },
      {
          "text": "Évaluer la pression artérielle.",
          "isCorrect": false,
          "comment": "La mesure de la température ne vise pas à évaluer la pression artérielle, mais plutôt à évaluer la température corporelle de la victime."
      },
      {
          "text": "Déterminer le taux de glycémie.",
          "isCorrect": false,
          "comment": "La mesure de la température ne vise pas à déterminer le taux de glycémie, mais plutôt à évaluer la température corporelle de la victime."
      }
  ]
},
{
  "text": "Quels sont les types de thermomètres utilisables pour mesurer la température ?",
  "answers": [
      {
          "text": "Thermomètre tympanique, thermomètre électronique, thermomètre médical et thermomètre frontal.",
          "isCorrect": true,
          "comment": "Oui, ces différents types de thermomètres peuvent être utilisés pour mesurer la température corporelle de la victime."
      },
      {
          "text": "Spiromètre et tensiomètre.",
          "isCorrect": false,
          "comment": "Le spiromètre est utilisé pour mesurer la capacité pulmonaire, et le tensiomètre est utilisé pour mesurer la pression artérielle, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
      },
      {
          "text": "Stéthoscope et oxymètre de pouls.",
          "isCorrect": false,
          "comment": "Le stéthoscope est utilisé pour écouter les sons du corps, et l'oxymètre de pouls est utilisé pour mesurer la saturation pulsée en oxygène, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
      },
      {
          "text": "Tensiomètre et glucomètre.",
          "isCorrect": false,
          "comment": "Le tensiomètre est utilisé pour mesurer la pression artérielle, et le glucomètre est utilisé pour mesurer le taux de glycémie, mais ni l'un ni l'autre n'est utilisé pour mesurer la température corporelle."
      }
  ]
},
{
  "text": "Quel est le type de thermomètre recommandé pour la mesure de la température chez un nourrisson de moins de 3 mois ?",
  "answers": [
      {
          "text": "Thermomètre rectal.",
          "isCorrect": true,
          "comment": "Oui, le thermomètre rectal est recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car son conduit auditif est trop petit pour utiliser un thermomètre auriculaire."
      },
      {
          "text": "Thermomètre buccal.",
          "isCorrect": false,
          "comment": "Le thermomètre buccal n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car il peut être difficile de l'utiliser avec précision à cet âge."
      },
      {
          "text": "Thermomètre auriculaire.",
          "isCorrect": false,
          "comment": "Le thermomètre auriculaire n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car son conduit auditif est trop petit pour utiliser ce type de thermomètre."
      },
      {
          "text": "Thermomètre frontal.",
          "isCorrect": false,
          "comment": "Le thermomètre frontal n'est pas recommandé pour mesurer la température chez un nourrisson de moins de 3 mois, car il peut ne pas être aussi précis que d'autres types de thermomètres."
      }
  ]
},
{
  "text": "Quelle est la température normale du corps humain chez un adulte au repos et réveillé ?",
  "answers": [
      {
          "text": "Autour de 37°C.",
          "isCorrect": true,
          "comment": "Oui, la température normale du corps humain chez un adulte au repos et réveillé est d'environ 37°C."
      },
      {
          "text": "Autour de 35°C.",
          "isCorrect": false,
          "comment": "Une température autour de 35°C indiquerait une hypothermie légère chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
      },
      {
          "text": "Autour de 40°C.",
          "isCorrect": false,
          "comment": "Une température autour de 40°C indiquerait une fièvre chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
      },
      {
          "text": "Autour de 42°C.",
          "isCorrect": false,
          "comment": "Une température autour de 42°C serait considérée comme une hyperthermie sévère chez un adulte au repos et réveillé, ce qui n'est pas considéré comme normal."
      }
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
