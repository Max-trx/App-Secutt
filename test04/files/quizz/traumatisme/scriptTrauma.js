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
      feedbackText = "";
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
    "text": "Que faut-il faire en cas de traumatisme dentaire ?",
    "answers": [
        {
            "text": "a) Faire avaler à la victime de l'eau de javel",
            "isCorrect": false,
            "comment": "Faire avaler de l'eau de javel à la victime peut être dangereux. Il est important de consulter un professionnel de la santé."
        },
        {
            "text": "b) Rincer la dent tombée pendant 1 minute sous l'eau courante",
            "isCorrect": false,
            "comment": "Rincer la dent tombée sous l'eau courante peut endommager les tissus. La dent doit être manipulée avec précaution."
        },
        {
            "text": "c) Garder la dent dans de l'eau du robinet",
            "isCorrect": false,
            "comment": "Conserver la dent dans de l'eau du robinet n'est pas recommandé. Elle devrait plutôt être placée dans du lait ou dans une solution saline."
        },
        {
            "text": "d) Consulter immédiatement un chirurgien-dentiste",
            "isCorrect": true,
            "comment": "En cas de traumatisme dentaire, il est crucial de consulter immédiatement un professionnel de la santé dentaire pour évaluer la blessure et fournir un traitement approprié."
        }
    ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'un traumatisme dentaire avec délogement d'une dent ?",
  "answers": [
      {
          "text": "a) Faire boire de l'eau froide à la victime",
          "isCorrect": false,
          "comment": "Faire boire de l'eau froide à la victime n'est pas la conduite à tenir en cas de traumatisme dentaire avec délogement d'une dent."
      },
      {
          "text": "b) Rincer la dent tombée avec du savon",
          "isCorrect": false,
          "comment": "Rincer la dent avec du savon n'est pas recommandé, car cela peut contaminer la dent."
      },
      {
          "text": "c) Recueillir la dent tombée et la transporter avec la victime",
          "isCorrect": true,
          "comment": "En cas de traumatisme dentaire avec délogement d'une dent, il est important de recueillir la dent tombée et de la transporter avec la victime pour une éventuelle réimplantation."
      },
      {
          "text": "d) Laisser la dent sur le sol et appeler immédiatement les secours",
          "isCorrect": false,
          "comment": "Il est important de recueillir la dent tombée pour éviter sa perte et de contacter immédiatement les secours pour obtenir des conseils supplémentaires."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en cas de traumatisme dentaire ?",
  "answers": [
      {
          "text": "a) Demander à la victime de boire de l'alcool pour désinfecter la plaie",
          "isCorrect": false,
          "comment": "Boire de l'alcool ne désinfectera pas la plaie et peut même aggraver la situation en altérant l'état de la victime."
      },
      {
          "text": "b) Demander à la victime de garder la dent tombée dans de l'eau du robinet",
          "isCorrect": false,
          "comment": "Garder la dent dans de l'eau du robinet peut endommager les tissus de la dent et réduire les chances de la réimplanter avec succès."
      },
      {
          "text": "c) Demander à la victime de se rincer la bouche avec de l'eau",
          "isCorrect": true,
          "comment": "Rincer la bouche avec de l'eau peut aider à éliminer les débris et à réduire le risque d'infection après un traumatisme dentaire."
      },
      {
          "text": "d) Demander à la victime de ne pas consulter de médecin",
          "isCorrect": false,
          "comment": "Il est important de consulter un médecin ou un dentiste dès que possible en cas de traumatisme dentaire pour évaluer les dommages et administrer un traitement approprié."
      }
  ]
},
{
  "text": "Quelles sont les principales causes de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Piqûre d'insecte",
          "isCorrect": false,
          "comment": "Les piqûres d'insectes ne sont généralement pas des causes majeures de traumatisme abdominal."
      },
      {
          "text": "b) Explosion",
          "isCorrect": true,
          "comment": "Les explosions peuvent causer des traumatismes abdominaux graves."
      },
      {
          "text": "c) Éruption volcanique",
          "isCorrect": false,
          "comment": "Les éruptions volcaniques sont peu susceptibles de causer des traumatismes abdominaux."
      },
      {
          "text": "d) Brûlure chimique",
          "isCorrect": false,
          "comment": "Les brûlures chimiques peuvent causer des lésions cutanées, mais pas nécessairement des traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel risque est associé aux traumatismes avec atteinte des organes creux ?",
  "answers": [
      {
          "text": "a) Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Bien que la détresse respiratoire puisse être une complication, le risque principal est l'infection due à la perforation des organes."
      },
      {
          "text": "b) Risque d'hypothermie",
          "isCorrect": false,
          "comment": "Le risque principal est l'infection, pas l'hypothermie."
      },
      {
          "text": "c) Risque infectieux",
          "isCorrect": true,
          "comment": "Les traumatismes avec atteinte des organes creux augmentent le risque d'infection."
      },
      {
          "text": "d) Risque de fracture",
          "isCorrect": false,
          "comment": "Les organes creux ne peuvent pas subir de fracture."
      }
  ]
},
{
  "text": "Comment peut se manifester une éviscération ?",
  "answers": [
      {
          "text": "a) Par des douleurs aux membres",
          "isCorrect": false,
          "comment": "Une éviscération implique l'exposition des viscères à l'extérieur de l'abdomen, pas de douleurs aux membres."
      },
      {
          "text": "b) Par des vomissements répétés",
          "isCorrect": false,
          "comment": "Les vomissements répétés ne sont pas une manifestation typique d'une éviscération."
      },
      {
          "text": "c) Par des vomissements de sang",
          "isCorrect": false,
          "comment": "Les vomissements de sang peuvent indiquer d'autres conditions, mais pas nécessairement une éviscération."
      },
      {
          "text": "d) Par une exposition des viscères à l'extérieur de l'abdomen",
          "isCorrect": true,
          "comment": "Une éviscération se produit lorsque les viscères sont exposés à l'extérieur de l'abdomen."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir en présence d'une éviscération ?",
  "answers": [
      {
          "text": "a) Remettre immédiatement les viscères en place",
          "isCorrect": false,
          "comment": "Remettre les viscères en place sans les précautions nécessaires peut aggraver les blessures."
      },
      {
          "text": "b) Utiliser des compresses pour comprimer les viscères",
          "isCorrect": false,
          "comment": "Comprimer les viscères peut entraîner des dommages supplémentaires. Il est préférable de les protéger avec un champ stérile."
      },
      {
          "text": "c) Envelopper les viscères dans un champ stérile humidifié",
          "isCorrect": true,
          "comment": "L'enveloppement des viscères dans un champ stérile humidifié aide à les protéger contre la contamination et la dessiccation."
      },
      {
          "text": "d) Ne rien faire",
          "isCorrect": false,
          "comment": "L'éviscération nécessite une intervention médicale immédiate pour éviter des complications."
      }
  ]
},
{
  "text": "Pourquoi faut-il protéger la victime contre le froid, le vent ou la chaleur en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Pour éviter la propagation de l'infection",
          "isCorrect": false,
          "comment": "La protection contre le froid, le vent ou la chaleur vise principalement à prévenir l'hypothermie ou l'hyperthermie."
      },
      {
          "text": "b) Pour prévenir l'hypothermie ou l'hyperthermie",
          "isCorrect": true,
          "comment": "Le traumatisme abdominal peut perturber la régulation de la température corporelle, ce qui rend la protection contre les températures extrêmes importante."
      },
      {
          "text": "c) Pour éviter les réactions allergiques",
          "isCorrect": false,
          "comment": "Les réactions allergiques ne sont pas liées directement au traumatisme abdominal."
      },
      {
          "text": "d) Pour empêcher la détérioration de la plaie",
          "isCorrect": false,
          "comment": "La protection contre les éléments vise à maintenir la stabilité de la température corporelle, pas à prévenir la détérioration de la plaie."
      }
  ]
},
{
  "text": "Quelle est la conduite à tenir spécifique pour toute femme enceinte victime d'un traumatisme violent ?",
  "answers": [
      {
          "text": "a) La faire marcher pour favoriser la circulation sanguine",
          "isCorrect": false,
          "comment": "Marcher peut aggraver les blessures chez une femme enceinte victime d'un traumatisme violent."
      },
      {
          "text": "b) La placer en position assise pour soulager la pression abdominale",
          "isCorrect": false,
          "comment": "La position assise peut mettre davantage de pression sur l'abdomen. Une évaluation médicale immédiate est nécessaire."
      },
      {
          "text": "c) La considérer comme traumatisée de l'abdomen et la faire consulter dans un service d'urgence ou spécialisé",
          "isCorrect": true,
          "comment": "Toute femme enceinte victime d'un traumatisme violent doit être considérée comme présentant un risque pour le fœtus et doit être évaluée immédiatement par un professionnel de la santé."
      },
      {
          "text": "d) Appliquer un pansement stérile sur l'abdomen pour protéger le fœtus",
          "isCorrect": false,
          "comment": "L'application d'un pansement ne suffit pas. Une évaluation médicale complète est nécessaire."
      }
  ]
},
{
  "text": "Quelle est la priorité dans l'action de secours en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Identifier la gravité de la plaie",
          "isCorrect": false,
          "comment": "Bien qu'il soit important d'évaluer la plaie, la priorité est de prévenir toute détresse circulatoire en surveillant attentivement la victime."
      },
      {
          "text": "b) Installer ou transporter la victime dans une position d'attente adaptée",
          "isCorrect": false,
          "comment": "La première priorité est de stabiliser la victime dans la position la plus confortable pour prévenir d'autres dommages."
      },
      {
          "text": "c) Examiner la victime pour rechercher des lésions",
          "isCorrect": false,
          "comment": "Bien qu'il soit nécessaire d'examiner la victime, la priorité initiale est de prévenir toute détresse circulatoire."
      },
      {
          "text": "d) Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "La priorité est de surveiller attentivement la victime pour détecter et traiter rapidement toute détresse circulatoire."
      }
  ]
},
{
  "text": "Quels sont les trois types principaux de causes de traumatisme abdominal énumérés dans le texte ?",
  "answers": [
      {
          "text": "a) Choc électrique, brûlure chimique, gelure",
          "isCorrect": false,
          "comment": "Ces éléments ne sont pas des causes principales de traumatisme abdominal."
      },
      {
          "text": "b) Explosion, chute de grande hauteur, accident de vélo",
          "isCorrect": false,
          "comment": "Bien que ces événements puissent causer des blessures, ils ne sont pas les principales causes de traumatisme abdominal énumérées."
      },
      {
          "text": "c) Pénétration d'un corps étranger, traumatisme direct, décélération brusque",
          "isCorrect": true,
          "comment": "Ce sont en effet les principaux types de causes de traumatisme abdominal énumérés."
      },
      {
          "text": "d) Éruption volcanique, avalanche, tremblement de terre",
          "isCorrect": false,
          "comment": "Ces événements peuvent causer des traumatismes, mais ils ne sont pas spécifiquement liés aux traumatismes abdominaux."
      }
  ]
},
{
  "text": "Quel est le risque associé aux traumatismes avec atteinte des gros vaisseaux abdominaux ?",
  "answers": [
      {
          "text": "a) Risque de brûlures",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux brûlures, mais plutôt aux hémorragies internes."
      },
      {
          "text": "b) Risque de détresse circulatoire par hémorragie interne",
          "isCorrect": true,
          "comment": "Les blessures aux gros vaisseaux abdominaux peuvent entraîner une perte de sang importante et une détresse circulatoire."
      },
      {
          "text": "c) Risque de lésions nerveuses",
          "isCorrect": false,
          "comment": "Les gros vaisseaux abdominaux ne sont pas associés aux lésions nerveuses, mais plutôt aux hémorragies et à la détresse circulatoire."
      },
      {
          "text": "d) Risque de détresse respiratoire",
          "isCorrect": false,
          "comment": "Les problèmes respiratoires ne sont pas directement liés aux traumatismes des gros vaisseaux abdominaux."
      }
  ]
},
{
  "text": "Pourquoi faut-il rechercher l'existence de lésions dans le dos de la victime en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Pour vérifier si la victime peut marcher",
          "isCorrect": false,
          "comment": "La capacité de marcher n'est pas la principale préoccupation lors de la recherche de lésions dans le dos."
      },
      {
          "text": "b) Pour évaluer la gravité de la plaie",
          "isCorrect": false,
          "comment": "L'évaluation de la gravité de la plaie se concentre sur la zone abdominale, pas nécessairement sur le dos."
      },
      {
          "text": "c) Pour identifier d'autres sources de douleur",
          "isCorrect": true,
          "comment": "Les lésions dans le dos peuvent indiquer d'autres traumatismes ou fractures qui pourraient être liés au traumatisme abdominal."
      },
      {
          "text": "d) Pour appliquer un traitement spécifique aux lésions du dos",
          "isCorrect": false,
          "comment": "L'identification des lésions dans le dos est principalement pour évaluer l'étendue des dommages et planifier le traitement global, pas seulement pour les lésions du dos."
      }
  ]
},
{
  "text": "Quelle position doit être adoptée par la victime en cas de traumatisme abdominal ?",
  "answers": [
      {
          "text": "a) Position debout",
          "isCorrect": false,
          "comment": "Une position debout peut aggraver les lésions internes. Une position allongée est généralement recommandée."
      },
      {
          "text": "b) Position allongée, à plat ventre, jambes tendues",
          "isCorrect": false,
          "comment": "Une position à plat ventre peut exercer une pression sur l'abdomen. Une position allongée sur le dos avec les jambes fléchies est souvent préférée."
      },
      {
          "text": "c) Position assise, jambes croisées",
          "isCorrect": false,
          "comment": "Une position assise peut exercer une pression sur l'abdomen et ne pas être confortable pour la victime."
      },
      {
          "text": "d) Position allongée, à plat dos, jambes fléchies",
          "isCorrect": true,
          "comment": "Cette position aide à soulager la pression sur l'abdomen et à prévenir d'autres dommages."
      }
  ]
},
{
  "text": "Quel est le pourcentage approximatif de mortalité des traumatismes du bassin ?",
  "answers": [
      {
          "text": "a) 2-5%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "b) 5-8%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus élevé, allant jusqu'à environ 8-15%."
      },
      {
          "text": "c) 8-15%",
          "isCorrect": true,
          "comment": "Le taux de mortalité des traumatismes du bassin se situe généralement dans cette plage, allant jusqu'à environ 8-15%."
      },
      {
          "text": "d) 15-20%",
          "isCorrect": false,
          "comment": "Le taux de mortalité est généralement plus bas que cela, se situant autour de 8-15%."
      }
  ]
},
{
  "text": "Quel signe évoque un traumatisme du bassin si la victime peut s'exprimer ?",
  "answers": [
      {
          "text": "a) Douleur dans les bras",
          "isCorrect": false,
          "comment": "La douleur dans les bras n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "b) Douleur dans le cou",
          "isCorrect": false,
          "comment": "La douleur dans le cou n'est pas spécifique aux traumatismes du bassin."
      },
      {
          "text": "c) Douleur dans le bassin ou la partie basse de l'abdomen",
          "isCorrect": true,
          "comment": "La douleur dans le bassin ou la partie basse de l'abdomen peut être un signe de traumatisme à cette région."
      },
      {
          "text": "d) Douleur dans les jambes",
          "isCorrect": false,
          "comment": "La douleur dans les jambes n'est pas spécifique aux traumatismes du bassin."
      }
  ]
},
{
  "text": "Quel élément ne fait pas partie des signes observables lors de l'examen d'une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Douleur du bassin",
          "isCorrect": false,
          "comment": "La douleur du bassin est souvent un signe observable d'un traumatisme à cette région."
      },
      {
          "text": "b) Impossibilité de bouger les membres inférieurs",
          "isCorrect": false,
          "comment": "L'impossibilité de bouger les membres inférieurs peut être un signe observable de traumatisme du bassin."
      },
      {
          "text": "c) Respiration difficile",
          "isCorrect": true,
          "comment": "La respiration difficile n'est généralement pas un signe observable directement lié aux traumatismes du bassin."
      },
      {
          "text": "d) Urine sanglante ou présence de sang sur les sous-vêtements",
          "isCorrect": false,
          "comment": "La présence d'urine sanglante ou de sang sur les sous-vêtements peut indiquer un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quelle action est recommandée en cas de détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement sur la plaie",
          "isCorrect": false,
          "comment": "Bien qu'un pansement puisse être nécessaire, la détresse circulatoire doit être gérée en priorité."
      },
      {
          "text": "b) Mettre la victime en position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "c) Immobiliser le bassin",
          "isCorrect": true,
          "comment": "Immobiliser le bassin peut aider à prévenir toute aggravation de la blessure et à stabiliser la victime."
      },
      {
          "text": "d) Appliquer de la chaleur sur la zone affectée",
          "isCorrect": false,
          "comment": "L'application de chaleur peut ne pas être appropriée, surtout en cas de suspicion d'hémorragie interne."
      }
  ]
},
{
  "text": "Quelle est la première mesure à prendre lors de l'action de secours pour une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Installer la victime dans une position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin avec détresse circulatoire."
      },
      {
          "text": "b) Contacter les services d'urgence",
          "isCorrect": false,
          "comment": "Bien que contacter les services d'urgence soit essentiel, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "c) Prévenir toute détresse circulatoire par une surveillance attentive",
          "isCorrect": true,
          "comment": "Prévenir toute détresse circulatoire est essentiel pour assurer la stabilité de la victime."
      },
      {
          "text": "d) Examiner les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que l'examen des membres supérieurs puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Qu'est-ce que laisser la victime en une \"position allongée stricte\" signifie dans le contexte de l'action de secours pour un traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Position allongée sur le côté",
          "isCorrect": false,
          "comment": "La position allongée sur le dos, les jambes tendues, est généralement recommandée."
      },
      {
          "text": "b) Position allongée sur le dos, les jambes tendues",
          "isCorrect": true,
          "comment": "Cette position aide à stabiliser la victime et à prévenir toute aggravation du traumatisme."
      },
      {
          "text": "c) Position allongée sur le ventre",
          "isCorrect": false,
          "comment": "La position sur le ventre peut ne pas être appropriée pour une victime de traumatisme du bassin."
      },
      {
          "text": "d) Position assise",
          "isCorrect": false,
          "comment": "La position assise peut ne pas être appropriée pour une victime de traumatisme du bassin."
      }
  ]
},
{
  "text": "Pourquoi est-il recommandé de dénuder le bassin de la victime lors de l'action de secours ?",
  "answers": [
      {
          "text": "a) Pour vérifier la présence de lésions et de sang sur les sous-vêtements",
          "isCorrect": true,
          "comment": "Cela permet d'évaluer les dommages potentiels et d'identifier toute blessure cachée."
      },
      {
          "text": "b) Pour faciliter la respiration de la victime",
          "isCorrect": false,
          "comment": "Bien que la respiration soit importante, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "c) Pour réduire la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse aider, ce n'est pas la principale raison de dénuder le bassin."
      },
      {
          "text": "d) Pour identifier d'autres blessures sur le corps",
          "isCorrect": false,
          "comment": "L'identification d'autres blessures est un avantage, mais ce n'est pas la principale raison de dénuder le bassin."
      }
  ]
},

{
  "text": "Quelle est la mesure recommandée si la victime présente un traumatisme du bassin associé à des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "b) Immobiliser la victime",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la région et à prévenir toute aggravation de la blessure."
      },
      {
          "text": "d) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Comment doit être protégée une victime de traumatisme du bassin contre les éléments environnementaux ?",
  "answers": [
      {
          "text": "a) En l'isolant dans une pièce calme",
          "isCorrect": false,
          "comment": "Isoler la victime dans une pièce calme peut ne pas être pratique dans toutes les situations d'urgence."
      },
      {
          "text": "b) En la recouvrant d'une couverture",
          "isCorrect": true,
          "comment": "Recouvrir la victime d'une couverture peut aider à maintenir sa chaleur corporelle et à prévenir l'hypothermie."
      },
      {
          "text": "c) En la plaçant à l'ombre",
          "isCorrect": false,
          "comment": "Placer la victime à l'ombre peut être bénéfique, mais ce n'est pas la principale mesure pour la protéger contre les éléments environnementaux."
      },
      {
          "text": "d) En la massant",
          "isCorrect": false,
          "comment": "Masser la victime peut ne pas être approprié dans le contexte d'un traumatisme du bassin."
      }
  ]
},
{
  "text": "Quelle est la principale action recommandée en présence d'une détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Appliquer un pansement sur la plaie",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "b) Immobiliser la victime",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse vitale."
      },
      {
          "text": "c) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "La gestion de la douleur peut être nécessaire, mais il y a une action prioritaire à prendre avant cela."
      },
      {
          "text": "d) Appliquer la conduite à tenir adaptée à son état",
          "isCorrect": true,
          "comment": "Appliquer la conduite à tenir adaptée à l'état de la victime est crucial pour assurer sa survie."
      }
  ]
},
{
  "text": "Quel est l'objectif de limiter toute mobilisation de la victime, sauf en cas de nécessité absolue, dans l'action de secours pour un traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Pour éviter la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être un résultat, l'objectif principal est de prévenir toute aggravation de la blessure."
      },
      {
          "text": "b) Pour éviter toute aggravation de la blessure",
          "isCorrect": true,
          "comment": "Limiter la mobilisation peut aider à prévenir des dommages supplémentaires au bassin et aux structures environnantes."
      },
      {
          "text": "c) Pour faciliter le transport de la victime",
          "isCorrect": false,
          "comment": "Le transport de la victime peut nécessiter une mobilisation, mais la priorité est d'éviter toute aggravation de la blessure."
      },
      {
          "text": "d) Pour permettre à la victime de se reposer",
          "isCorrect": false,
          "comment": "Bien que le repos soit important, limiter la mobilisation vise principalement à prévenir toute aggravation de la blessure."
      }
  ]
},
{
  "text": "Que doit-on rechercher en particulier lors de la dénudation du bassin de la victime ?",
  "answers": [
      {
          "text": "a) La présence de lésions sur le visage",
          "isCorrect": false,
          "comment": "Bien que la vérification des blessures soit importante, le visage n'est pas directement lié au traumatisme du bassin."
      },
      {
          "text": "b) La présence de lésions dans le dos ou au niveau des fesses",
          "isCorrect": true,
          "comment": "Les lésions dans le dos ou au niveau des fesses peuvent indiquer des blessures potentielles au bassin ou à la colonne vertébrale."
      },
      {
          "text": "c) La présence de lésions sur les membres supérieurs",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      },
      {
          "text": "d) La présence de lésions sur les chevilles",
          "isCorrect": false,
          "comment": "Bien que cela puisse être important, le focus principal est sur le bassin et les régions environnantes."
      }
  ]
},
{
  "text": "Quel est le but de la contention externe du bassin ?",
  "answers": [
      {
          "text": "a) Réduire la douleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse aider, le but principal est de stabiliser le bassin et de prévenir toute aggravation de la blessure."
      },
      {
          "text": "b) Faciliter la respiration",
          "isCorrect": false,
          "comment": "Bien que cela puisse être bénéfique, le but principal est de stabiliser le bassin et de prévenir toute aggravation de la blessure."
      },
      {
          "text": "c) Prévenir toute aggravation de la blessure",
          "isCorrect": false,
          "comment": "La contention externe vise à stabiliser le bassin, mais il y a un autre objectif plus spécifique."
      },
      {
          "text": "d) Stabiliser le bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin vise à stabiliser la région et à prévenir toute détérioration de la blessure."
      }
  ]
},
{
  "text": "Quelle est la recommandation en cas d'impossibilité d'obtenir un avis médical pour une victime de traumatisme du bassin présentant des signes de détresse circulatoire ?",
  "answers": [
      {
          "text": "a) Attendre l'arrivée des secours sans intervention",
          "isCorrect": false,
          "comment": "En cas de détresse circulatoire, des mesures doivent être prises pour stabiliser la victime jusqu'à l'arrivée des secours."
      },
      {
          "text": "b) Immobiliser la victime sans aucune autre mesure",
          "isCorrect": false,
          "comment": "L'immobilisation seule peut ne pas suffire pour gérer la détresse circulatoire."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en attendant l'arrivée des secours médicaux."
      },
      {
          "text": "d) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une action prioritaire à prendre avant cela."
      }
  ]
},
{
  "text": "Quelle mesure supplémentaire est nécessaire en présence d'une détresse vitale chez une victime de traumatisme du bassin ?",
  "answers": [
      {
          "text": "a) Demander à la victime de bouger ses membres",
          "isCorrect": false,
          "comment": "En cas de détresse vitale, d'autres mesures prioritaires doivent être prises pour stabiliser la victime."
      },
      {
          "text": "b) Administrer des médicaments antidouleur",
          "isCorrect": false,
          "comment": "La gestion de la douleur peut être nécessaire, mais il y a une autre mesure plus importante en cas de détresse vitale."
      },
      {
          "text": "c) Mettre en place une contention externe du bassin",
          "isCorrect": true,
          "comment": "La contention externe du bassin peut aider à stabiliser la victime en cas de détresse vitale."
      },
      {
          "text": "d) Appliquer un pansement compressif",
          "isCorrect": false,
          "comment": "Bien que cela puisse être nécessaire, il y a une autre mesure plus importante en cas de détresse vitale."
      }
  ]
}
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
